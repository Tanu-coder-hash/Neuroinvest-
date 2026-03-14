const { BedrockRuntimeClient, ConverseCommand } = require("@aws-sdk/client-bedrock-runtime");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Initialize AWS clients
const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Model ID for Claude 3 Sonnet (supports sentiment analysis well)
const MODEL_ID = "anthropic.claude-3-sonnet-20240229-v1:0";

exports.handler = async (event) => {
    console.log("Event received:", JSON.stringify(event));
    
    try {
        // Get parameters from request
        let age = 30;
        let riskPreference = "moderate";
        let userText = "";
        let userId = "demo-user";
        
        if (event.queryStringParameters) {
            age = parseInt(event.queryStringParameters.age) || 30;
            riskPreference = event.queryStringParameters.risk || "moderate";
            userText = event.queryStringParameters.text || "I'm feeling neutral about investing";
            userId = event.queryStringParameters.userId || "demo-user";
        }
        
        // Call Bedrock for emotional analysis [citation:2][citation:3]
        const emotionalAnalysis = await analyzeEmotionWithBedrock(userText);
        
        // Get age-based stock recommendations
        const stocks = getStocksByAgeAndRisk(age, riskPreference);
        
        // Generate personalized advice using Bedrock
        const advice = await generateAdviceWithBedrock(age, riskPreference, emotionalAnalysis, stocks);
        
        // Store in DynamoDB
        const timestamp = new Date().toISOString();
        const historyItem = {
            userId: userId,
            timestamp: timestamp,
            age: age,
            riskPreference: riskPreference,
            userText: userText.substring(0, 100),
            emotion: emotionalAnalysis.dominantEmotion,
            sentimentScore: emotionalAnalysis.sentimentScore,
            stocks: stocks.map(s => s.ticker)
        };
        
        await docClient.send(new PutCommand({
            TableName: process.env.TABLE_NAME || "neuroinvest-history",
            Item: historyItem
        }));
        
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({
                age: age,
                riskPreference: riskPreference,
                emotionalAnalysis: emotionalAnalysis,
                stocks: stocks,
                advice: advice,
                userId: userId,
                timestamp: timestamp
            })
        };
        
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                error: "Failed to process request",
                message: error.message
            })
        };
    }
};

/**
 * Analyze emotion from user text using Amazon Bedrock [citation:3][citation:6]
 */
async function analyzeEmotionWithBedrock(text) {
    const prompt = `You are an expert in behavioral finance and emotional analysis. Analyze the following text from an investor and extract emotional insights.

Text: "${text}"

Return a JSON object with the following fields:
- dominantEmotion: The primary emotion detected (choose from: stressed, anxious, confident, happy, fearful, neutral)
- sentimentScore: A score from -10 (extremely negative) to +10 (extremely positive)
- stressLevel: A score from 1-10 indicating stress/anxiety level
- emotionalBiases: Array of behavioral finance biases detected (e.g., "loss aversion", "herd mentality", "overconfidence", "recency bias", "fomo")
- explanation: A brief explanation of the emotional analysis

Return ONLY valid JSON, no other text.`;

    const command = new ConverseCommand({
        modelId: MODEL_ID,
        messages: [
            {
                role: "user",
                content: [{ text: prompt }]
            }
        ],
        inferenceConfig: {
            maxTokens: 1000,
            temperature: 0.2,  // Lower temperature for more consistent analysis
            topP: 0.9
        }
    });

    try {
        const response = await bedrockClient.send(command);
        const responseText = response.output.message.content[0].text;
        
        // Extract JSON from response (handle potential extra text)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            return {
                dominantEmotion: analysis.dominantEmotion || "neutral",
                sentimentScore: analysis.sentimentScore || 0,
                stressLevel: analysis.stressLevel || 5,
                emotionalBiases: analysis.emotionalBiases || [],
                explanation: analysis.explanation || "Emotional analysis complete"
            };
        }
        
        // Fallback if JSON parsing fails
        return {
            dominantEmotion: "neutral",
            sentimentScore: 0,
            stressLevel: 5,
            emotionalBiases: [],
            explanation: "Unable to analyze emotion in detail"
        };
        
    } catch (error) {
        console.error("Bedrock emotional analysis error:", error);
        // Fallback to rule-based detection
        return fallbackEmotionAnalysis(text);
    }
}

/**
 * Generate personalized investment advice using Bedrock [citation:4]
 */
async function generateAdviceWithBedrock(age, riskPreference, emotionalAnalysis, stocks) {
    const stockList = stocks.map(s => `${s.ticker} (${s.name})`).join(", ");
    
    const prompt = `You are a certified financial advisor specializing in behavioral finance. Create personalized investment advice for a client with the following profile:

Age: ${age}
Risk Preference: ${riskPreference}
Current Emotional State: ${emotionalAnalysis.dominantEmotion} (Stress Level: ${emotionalAnalysis.stressLevel}/10)
Detected Biases: ${emotionalAnalysis.emotionalBiases.join(", ") || "None detected"}
Recommended Stocks: ${stockList}

Provide concise, actionable advice that:
1. Acknowledges their emotional state and how it might affect decisions
2. Addresses any detected behavioral biases
3. Explains why the recommended stocks match their age and risk profile
4. Gives 2-3 specific action items

Keep the advice friendly, professional, and under 200 words.`;

    const command = new ConverseCommand({
        modelId: MODEL_ID,
        messages: [
            {
                role: "user",
                content: [{ text: prompt }]
            }
        ],
        inferenceConfig: {
            maxTokens: 800,
            temperature: 0.5
        }
    });

    try {
        const response = await bedrockClient.send(command);
        return response.output.message.content[0].text;
    } catch (error) {
        console.error("Bedrock advice generation error:", error);
        return fallbackAdvice(age, riskPreference, emotionalAnalysis.dominantEmotion);
    }
}

/**
 * Fallback emotion analysis (rule-based) if Bedrock fails
 */
function fallbackEmotionAnalysis(text) {
    const lowerText = text.toLowerCase();
    
    let dominantEmotion = "neutral";
    let sentimentScore = 0;
    let stressLevel = 5;
    let biases = [];
    
    if (lowerText.includes('stress') || lowerText.includes('worried') || lowerText.includes('anxious')) {
        dominantEmotion = "stressed";
        sentimentScore = -3;
        stressLevel = 8;
        biases.push("anxiety bias");
    } else if (lowerText.includes('happy') || lowerText.includes('excited') || lowerText.includes('great')) {
        dominantEmotion = "happy";
        sentimentScore = 5;
        stressLevel = 3;
    } else if (lowerText.includes('confident') || lowerText.includes('sure')) {
        dominantEmotion = "confident";
        sentimentScore = 4;
        stressLevel = 4;
        if (lowerText.includes('definitely') || lowerText.includes('certain')) {
            biases.push("overconfidence");
        }
    } else if (lowerText.includes('scared') || lowerText.includes('fear')) {
        dominantEmotion = "fearful";
        sentimentScore = -5;
        stressLevel = 9;
        biases.push("loss aversion");
    } else if (lowerText.includes('fomo') || lowerText.includes('missing out')) {
        dominantEmotion = "anxious";
        sentimentScore = -2;
        stressLevel = 7;
        biases.push("fomo", "herd mentality");
    }
    
    return {
        dominantEmotion,
        sentimentScore,
        stressLevel,
        emotionalBiases: biases,
        explanation: `Detected ${dominantEmotion} mood with stress level ${stressLevel}/10`
    };
}

/**
 * Fallback advice generator
 */
function fallbackAdvice(age, riskPreference, emotion) {
    const adviceMap = {
        stressed: "When stressed, avoid making impulsive decisions. Stick to your age-based allocation and consider reducing position sizes.",
        anxious: "Anxiety often leads to selling at the wrong time. Review your long-term goals and remember that markets recover.",
        confident: "Confidence is good, but maintain diversification. Your age-based strategy is designed for consistent growth.",
        happy: "Great mood! Use this positive energy to review your portfolio and rebalance if needed.",
        fearful: "Fear can create buying opportunities. Consider dollar-cost averaging into your target allocation.",
        neutral: "A balanced emotional state is ideal for investing. Stick to your plan."
    };
    
    return adviceMap[emotion] || "Stay focused on your long-term investment goals based on your age and risk tolerance.";
}

/**
 * Get stocks based on age and risk preference
 */
function getStocksByAgeAndRisk(age, riskPreference) {
    // Company database
    const companies = {
        nvda: { ticker: "NVDA", name: "NVIDIA Corporation", price: "$856.34", sector: "Semiconductors", risk: "High", reason: "Leader in AI chips with massive growth potential" },
        tsla: { ticker: "TSLA", name: "Tesla Inc", price: "$198.45", sector: "Automotive", risk: "High", reason: "EV innovation with expanding energy business" },
        amd: { ticker: "AMD", name: "AMD", price: "$167.89", sector: "Semiconductors", risk: "High", reason: "Gaining market share in data center" },
        msft: { ticker: "MSFT", name: "Microsoft", price: "$402.45", sector: "Technology", risk: "Medium", reason: "Cloud and AI leader with strong moat" },
        aapl: { ticker: "AAPL", name: "Apple", price: "$175.32", sector: "Technology", risk: "Medium", reason: "Massive installed base and services growth" },
        jpm: { ticker: "JPM", name: "JPMorgan", price: "$182.34", sector: "Finance", risk: "Medium", reason: "Well-capitalized banking leader" },
        jnj: { ticker: "JNJ", name: "Johnson & Johnson", price: "$158.67", sector: "Healthcare", risk: "Low", reason: "Defensive healthcare with dividend growth" },
        pg: { ticker: "PG", name: "Procter & Gamble", price: "$163.45", sector: "Consumer", risk: "Low", reason: "Essential products with pricing power" },
        ko: { ticker: "KO", name: "Coca-Cola", price: "$61.23", sector: "Beverage", risk: "Low", reason: "Iconic brand with 62 years of dividends" }
    };
    
    if (age < 30) {
        if (riskPreference === "conservative") {
            return [companies.msft, companies.aapl, companies.jpm];
        } else if (riskPreference === "moderate") {
            return [companies.nvda, companies.msft, companies.tsla];
        } else {
            return [companies.nvda, companies.tsla, companies.amd];
        }
    } else if (age < 50) {
        if (riskPreference === "conservative") {
            return [companies.jnj, companies.pg, companies.ko];
        } else if (riskPreference === "moderate") {
            return [companies.msft, companies.jpm, companies.aapl];
        } else {
            return [companies.nvda, companies.msft, companies.tsla];
        }
    } else {
        if (riskPreference === "conservative") {
            return [companies.jnj, companies.pg, companies.ko];
        } else if (riskPreference === "moderate") {
            return [companies.jnj, companies.msft, companies.pg];
        } else {
            return [companies.msft, companies.jpm, companies.aapl];
        }
    }
}