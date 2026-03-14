NEUROINVEST - AI-POWERED EMOTIONAL INTELLIGENCE INVESTING

NeuroInvest is an AI-powered investment platform that recommends stocks based on your age, risk preference, and emotional state. Unlike traditional robo-advisors that only look at financial data, NeuroInvest understands how you feel and adjusts recommendations accordingly.

Research shows that 80% of investment decisions are emotional, not rational. Investors lose $3.2 trillion annually to emotional trading mistakes like panic selling during market dips and FOMO buying at market peaks. NeuroInvest solves this by bringing emotional intelligence to investing.


KEY FEATURES

Age Slider - Select age from 18 to 80. The app automatically categorizes you as Young, Mid-Career, or Senior and adjusts the investment strategy.

Risk Preference - Choose from three options:
- Conservative: Focus on capital preservation and income
- Moderate: Balanced approach with growth and stability
- Aggressive: Maximum growth potential with higher risk

Emotional Analysis - Type how you're feeling (e.g., "I'm stressed about the market" or "I'm feeling confident"). Amazon Bedrock AI analyzes your text to detect emotions like stress, anxiety, confidence, or happiness, and provides personalized advice.

Stock Recommendations - Get real company names with current prices, market cap, P/E ratios, and price changes. Each recommendation includes a reason why the stock fits your profile.

Asset Allocation - See a visual breakdown of how your portfolio is divided across small caps, mid caps, large caps, bonds, and other assets.

History Tracking - All your past check-ins and recommendations are saved so you can track your emotional patterns over time.


HOW IT WORKS

Step 1: Check In
- Enter your User ID
- Move the age slider to your current age
- Select your risk preference (Conservative, Moderate, or Aggressive)
- Type how you're feeling in the text box (or use the quick emotion buttons)

Step 2: AI Analysis
- Amazon Bedrock (Claude 3) analyzes your text
- It detects your dominant emotion (happy, stressed, anxious, confident, fearful)
- It assigns a stress level from 1 to 10
- It identifies behavioral biases like loss aversion, FOMO, or overconfidence

Step 3: Get Recommendations
- Based on your age, risk preference, and emotional state, the app recommends specific stocks
- Each stock shows ticker, company name, current price, price change, market cap, and P/E ratio
- You also get personalized advice that addresses your emotional state
- The allocation chart shows how your portfolio is distributed


AGE-BASED INVESTMENT STRATEGY

Age 18 to 30 (Young):
- Strategy: Small Caps - High Growth
- Allocation: 70% Small Cap, 20% Mid Cap, 10% Crypto
- Sample Companies: NVIDIA (NVDA), Tesla (TSLA), AMD (AMD), Palantir (PLTR)

Age 31 to 50 (Mid-Career):
- Strategy: Mid Caps - Balanced Growth
- Allocation: 40% Mid Cap, 30% Large Cap, 30% Bonds
- Sample Companies: Microsoft (MSFT), JPMorgan (JPM), Visa (V), Apple (AAPL)

Age 51 and above (Senior):
- Strategy: Large Caps - Income & Stability
- Allocation: 50% Large Cap, 30% Bonds, 20% Cash
- Sample Companies: Johnson & Johnson (JNJ), Procter & Gamble (PG), Coca-Cola (KO), PepsiCo (PEP)


TECHNOLOGY STACK

Frontend:
- React 18 for the user interface
- CSS3 for custom styling (dark theme professional look)

Backend (AWS):
- AWS Lambda for serverless backend logic (Node.js 18)
- Amazon API Gateway for REST API with CORS
- Amazon DynamoDB for storing user history
- Amazon Bedrock with Claude 3 for emotional analysis
- AWS SAM for infrastructure as code

Development Tools:
- Kiro - AWS's agentic IDE for spec-driven development
- Git and GitHub for version control


AWS SERVICES USED

1. AWS Lambda - Runs the backend code that processes user input, calls Bedrock, and returns recommendations
2. Amazon API Gateway - Provides the REST API endpoint that connects the frontend to the backend
3. Amazon DynamoDB - Stores user history including past emotions and recommendations
4. Amazon Bedrock - Provides Claude 3 AI model for emotional analysis and bias detection
5. AWS SAM - Used for deploying all AWS resources with a single command
6. Amazon CloudWatch - Monitors logs and performance


KIRO IMPLEMENTATION

Kiro is AWS's agentic IDE for spec-driven development. This project uses Kiro in the following ways:

- Complete spec file at .kiro/specs/neuroinvest.spec
- All functional requirements documented in the spec
- AWS services clearly listed in the spec
- MCP servers configured: aws-documentation-mcp and bedrock-mcp

The spec file defines all requirements, AWS services, and data models used in the project.

HOW TO RUN LOCALLY

Prerequisites:
- Node.js (version 18 or higher)
- npm or yarn
- Git

Step 1: Clone the repository
git clone https://github.com/YOUR-USERNAME/neuroinvest-hackathon.git
cd neuroinvest-hackathon

Step 2: Install backend dependencies
cd lambda
npm install
cd ..

Step 3: Install frontend dependencies
cd frontend
npm install
cd ..

Step 4: Start the frontend (uses mock data by default)
cd frontend
npm start

HOW TO DEPLOY TO AWS

Step 1: Configure AWS CLI
aws configure
(Enter your AWS Access Key ID, Secret Access Key, and region: us-east-1)

Step 2: Build and deploy the backend
cd C:\Users\bhakt\Desktop\NeuroInvest
sam build
sam deploy --guided

During deployment, enter:
- Stack Name: neuroinvest-stack
- AWS Region: us-east-1
- Confirm changes before deploy: y
- Allow SAM CLI IAM role creation: Y
- Disable rollback: N
- Save arguments to configuration file: Y

Step 3: Get your API URL
After deployment completes, run:
aws cloudformation describe-stacks --stack-name neuroinvest-stack --region us-east-1 --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" --output text

Step 4: Update the frontend with your API URL
Open frontend/src/App.js
Find the line: const API_URL = 'YOUR_API_URL_HERE';
Replace with your actual API URL
Change USE_MOCK from true to false

Step 5: Restart the frontend
cd frontend
npm start

Your app is now connected to AWS and using real AI for emotional analysis!

AWS Services Used (4+):
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- Amazon Bedrock
- AWS SAM
- Amazon CloudWatch


---

This project was created for NIMBUS1000 Hackathon 2025. All code is for demonstration purposes only. Not financial advice.
