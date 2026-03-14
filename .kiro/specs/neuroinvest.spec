name: "NeuroInvest - Emotional Intelligence Investing"
version: "1.0.0"
description: "AI-powered investment platform with emotional analysis"

requirements:
  functional:
    - User enters text about their feelings
    - System analyzes emotional state
    - Provides personalized investment advice
    - Age-based stock recommendations

aws_services:
  - AWS Lambda
  - Amazon API Gateway
  - Amazon DynamoDB

mcp_servers:
  - aws-documentation-mcp
  - bedrock-mcp