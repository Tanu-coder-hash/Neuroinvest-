exports.handler = async (event) => {
    console.log("Event:", JSON.stringify(event));
    
    // Get parameters from request
    let age = 30;
    let riskPreference = "moderate"; // default
    let emotion = "neutral";
    
    if (event.queryStringParameters) {
        age = parseInt(event.queryStringParameters.age) || 30;
        riskPreference = event.queryStringParameters.risk || "moderate";
        emotion = event.queryStringParameters.emotion || "neutral";
    }
    
    // Emotional tips based on mood
    const emotionalTips = {
        stressed: "🧘 When stressed, avoid impulsive decisions. Consider conservative investments.",
        happy: "😊 Great mood! Review your long-term goals while you feel positive.",
        anxious: "😟 Feeling anxious? Focus on stable, established companies.",
        confident: "😎 Confidence is good, but always diversify.",
        neutral: "⚖️ Good time for balanced decision-making."
    };
    
    // Determine investment strategy based on age AND risk preference
    let category = "";
    let stocks = [];
    let allocation = {};
    let advice = "";
    
    // BASE strategy by age
    if (age < 30) {
        // Young investors - can take more risk
        if (riskPreference === "conservative") {
            category = "🛡️ Young Conservative - Balanced Approach";
            allocation = { largeCap: 50, midCap: 30, bonds: 20 };
            stocks = [
                { ticker: "VOO", name: "Vanguard S&P 500 ETF", price: "$452.34", return: "8-10%", risk: "Low" },
                { ticker: "SCHD", name: "Schwab Dividend ETF", price: "$74.89", return: "7-9%", risk: "Low" },
                { ticker: "BND", name: "Vanguard Total Bond", price: "$72.34", return: "4-5%", risk: "Very Low" }
            ];
            advice = "Even though you're young, you prefer safety. Focus on ETFs and dividends.";
        } 
        else if (riskPreference === "moderate") {
            category = "⚖️ Young Moderate - Growth Focus";
            allocation = { smallCap: 40, midCap: 30, largeCap: 30 };
            stocks = [
                { ticker: "MSFT", name: "Microsoft", price: "$402.45", return: "12-15%", risk: "Medium" },
                { ticker: "AAPL", name: "Apple", price: "$175.32", return: "10-12%", risk: "Medium" },
                { ticker: "NVDA", name: "NVIDIA", price: "$856.34", return: "15-20%", risk: "Medium-High" }
            ];
            advice = "Balanced growth with some established tech leaders.";
        } 
        else { // aggressive
            category = "🚀 Young Aggressive - High Growth";
            allocation = { smallCap: 70, midCap: 20, crypto: 10 };
            stocks = [
                { ticker: "NVDA", name: "NVIDIA", price: "$856.34", return: "20-25%", risk: "High" },
                { ticker: "TSLA", name: "Tesla", price: "$198.45", return: "15-20%", risk: "High" },
                { ticker: "AMD", name: "AMD", price: "$167.89", return: "15-18%", risk: "High" },
                { ticker: "PLTR", name: "Palantir", price: "$21.56", return: "20-30%", risk: "Very High" }
            ];
            advice = "Maximum growth potential. Be prepared for volatility.";
        }
    } 
    else if (age < 50) {
        // Mid-career investors
        if (riskPreference === "conservative") {
            category = "🛡️ Mid-Career Conservative - Income Focus";
            allocation = { largeCap: 60, bonds: 30, cash: 10 };
            stocks = [
                { ticker: "JNJ", name: "Johnson & Johnson", price: "$158.67", return: "6-8%", risk: "Low" },
                { ticker: "PG", name: "Procter & Gamble", price: "$163.45", return: "5-7%", risk: "Low" },
                { ticker: "KO", name: "Coca-Cola", price: "$61.23", return: "4-6%", risk: "Low" }
            ];
            advice = "Focus on dividend aristocrats and stability.";
        } 
        else if (riskPreference === "moderate") {
            category = "⚖️ Mid-Career Moderate - Balanced";
            allocation = { largeCap: 40, midCap: 30, bonds: 20, international: 10 };
            stocks = [
                { ticker: "MSFT", name: "Microsoft", price: "$402.45", return: "8-10%", risk: "Medium" },
                { ticker: "JPM", name: "JPMorgan", price: "$182.34", return: "7-9%", risk: "Medium" },
                { ticker: "V", name: "Visa", price: "$245.67", return: "8-10%", risk: "Medium" }
            ];
            advice = "Balance growth with quality companies.";
        } 
        else { // aggressive
            category = "🚀 Mid-Career Aggressive - Growth";
            allocation = { smallCap: 30, midCap: 40, largeCap: 30 };
            stocks = [
                { ticker: "NVDA", name: "NVIDIA", price: "$856.34", return: "12-15%", risk: "High" },
                { ticker: "AMZN", name: "Amazon", price: "$145.23", return: "10-12%", risk: "Medium-High" },
                { ticker: "GOOGL", name: "Google", price: "$142.78", return: "10-12%", risk: "Medium" }
            ];
            advice = "Growth-oriented with some established names.";
        }
    } 
    else {
        // Near/In retirement
        if (riskPreference === "conservative") {
            category = "🛡️ Retirement Conservative - Income";
            allocation = { largeCap: 40, bonds: 40, cash: 20 };
            stocks = [
                { ticker: "JNJ", name: "Johnson & Johnson", price: "$158.67", return: "4-5%", risk: "Very Low" },
                { ticker: "O", name: "Realty Income", price: "$54.67", return: "4-5%", risk: "Very Low" },
                { ticker: "BND", name: "Total Bond ETF", price: "$72.34", return: "3-4%", risk: "Very Low" }
            ];
            advice = "Capital preservation is #1 priority.";
        } 
        else if (riskPreference === "moderate") {
            category = "⚖️ Retirement Moderate - Balanced Income";
            allocation = { largeCap: 50, bonds: 30, cash: 10, dividend: 10 };
            stocks = [
                { ticker: "PEP", name: "PepsiCo", price: "$172.45", return: "5-6%", risk: "Low" },
                { ticker: "KO", name: "Coca-Cola", price: "$61.23", return: "4-5%", risk: "Low" },
                { ticker: "SCHD", name: "Dividend ETF", price: "$74.89", return: "5-6%", risk: "Low" }
            ];
            advice = "Mix of income and moderate growth.";
        } 
        else { // aggressive - not typical for retirement, but option exists
            category = "🚀 Retirement Aggressive - Growth (Higher Risk)";
            allocation = { largeCap: 60, dividend: 20, bonds: 20 };
            stocks = [
                { ticker: "MSFT", name: "Microsoft", price: "$402.45", return: "6-8%", risk: "Medium" },
                { ticker: "AAPL", name: "Apple", price: "$175.32", return: "5-7%", risk: "Medium" },
                { ticker: "JPM", name: "JPMorgan", price: "$182.34", return: "5-6%", risk: "Medium" }
            ];
            advice = "More growth than typical for your age. Monitor closely.";
        }
    }
    
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
            age: age,
            riskPreference: riskPreference,
            emotion: emotion,
            tip: emotionalTips[emotion] || emotionalTips.neutral,
            category: category,
            stocks: stocks,
            allocation: allocation,
            advice: advice
        })
    };
};