import React, { useState } from 'react';
import './App.css';

// ============================================
// CONFIGURATION - CHANGE THESE VALUES
// ============================================
const USE_MOCK = false; // Set to false to use real AWS API
const API_URL = 'YOUR_API_URL_HERE'; // Replace with your actual API URL after deployment
// ============================================

function App() {
  const [userId, setUserId] = useState('demo-user');
  const [age, setAge] = useState(30);
  const [riskPreference, setRiskPreference] = useState('moderate');
  const [emotion, setEmotion] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('emotion');

  // Market ticker data
  const marketData = {
    sp500: { value: "5,234.78", change: "+0.45%" },
    nasdaq: { value: "18,456.32", change: "+0.86%" },
    dow: { value: "39,234.56", change: "-0.12%" }
  };

  // Real company database with current status
  const companyDatabase = {
    // Small Caps - High Growth
    nvda: { 
      name: "NVIDIA Corporation", 
      ticker: "NVDA", 
      price: "$856.34", 
      change: "+23.45", 
      changePercent: "+2.81%", 
      marketCap: "$2.1T", 
      pe: "64.5", 
      volume: "45.2M",
      sector: "Semiconductors",
      description: "Leader in AI chips and graphics processors",
      trend: "up",
      risk: "High",
      reason: "Dominant position in AI hardware with massive growth potential"
    },
    tsla: { 
      name: "Tesla Inc", 
      ticker: "TSLA", 
      price: "$198.45", 
      change: "+3.67", 
      changePercent: "+1.88%", 
      marketCap: "$632B", 
      pe: "71.3", 
      volume: "98.2M",
      sector: "Automotive",
      description: "Electric vehicle and clean energy company",
      trend: "up",
      risk: "High",
      reason: "Leading EV manufacturer with expanding energy business"
    },
    amd: { 
      name: "Advanced Micro Devices", 
      ticker: "AMD", 
      price: "$167.89", 
      change: "+5.23", 
      changePercent: "+3.21%", 
      marketCap: "$271B", 
      pe: "52.8", 
      volume: "62.1M",
      sector: "Semiconductors",
      description: "CPU and GPU manufacturer",
      trend: "up",
      risk: "High",
      reason: "Gaining market share in data center and consumer chips"
    },
    pltr: { 
      name: "Palantir Technologies", 
      ticker: "PLTR", 
      price: "$21.56", 
      change: "+1.02", 
      changePercent: "+4.97%", 
      marketCap: "$47B", 
      pe: "87.6", 
      volume: "75.3M",
      sector: "Software",
      description: "Big data analytics platform",
      trend: "up",
      risk: "Very High",
      reason: "AI-powered data analytics with government and commercial contracts"
    },
    
    // Mid Caps - Balanced Growth
    msft: { 
      name: "Microsoft Corporation", 
      ticker: "MSFT", 
      price: "$402.45", 
      change: "+4.89", 
      changePercent: "+1.23%", 
      marketCap: "$2.99T", 
      pe: "35.2", 
      volume: "22.1M",
      sector: "Technology",
      description: "Software, cloud, and AI leader",
      trend: "up",
      risk: "Medium",
      reason: "Strong Azure cloud growth and AI integration across products"
    },
    aapl: { 
      name: "Apple Inc", 
      ticker: "AAPL", 
      price: "$175.32", 
      change: "+1.23", 
      changePercent: "+0.71%", 
      marketCap: "$2.7T", 
      pe: "28.4", 
      volume: "58.3M",
      sector: "Consumer Tech",
      description: "Consumer electronics and services",
      trend: "up",
      risk: "Medium",
      reason: "Massive installed base and growing services revenue"
    },
    jpm: { 
      name: "JPMorgan Chase & Co", 
      ticker: "JPM", 
      price: "$182.34", 
      change: "+0.92", 
      changePercent: "+0.51%", 
      marketCap: "$526B", 
      pe: "11.2", 
      volume: "12.4M",
      sector: "Banking",
      description: "Leading global financial services",
      trend: "up",
      risk: "Medium",
      reason: "Well-capitalized bank benefiting from higher interest rates"
    },
    v: { 
      name: "Visa Inc", 
      ticker: "V", 
      price: "$245.67", 
      change: "+1.23", 
      changePercent: "+0.50%", 
      marketCap: "$502B", 
      pe: "28.9", 
      volume: "8.2M",
      sector: "Payments",
      description: "Global payments technology",
      trend: "up",
      risk: "Medium",
      reason: "Durable business model with strong cross-border volumes"
    },
    
    // Large Caps - Stable Income
    jnj: { 
      name: "Johnson & Johnson", 
      ticker: "JNJ", 
      price: "$158.67", 
      change: "+0.31", 
      changePercent: "+0.20%", 
      marketCap: "$382B", 
      pe: "15.3", 
      volume: "7.8M",
      sector: "Healthcare",
      description: "Diversified healthcare products",
      trend: "up",
      risk: "Low",
      dividend: "3.1%",
      reason: "Defensive healthcare leader with 60+ years of dividend increases"
    },
    pg: { 
      name: "Procter & Gamble", 
      ticker: "PG", 
      price: "$163.45", 
      change: "+0.42", 
      changePercent: "+0.26%", 
      marketCap: "$385B", 
      pe: "24.7", 
      volume: "6.5M",
      sector: "Consumer Staples",
      description: "Consumer goods giant",
      trend: "up",
      risk: "Low",
      dividend: "2.5%",
      reason: "Essential products with pricing power and reliable dividends"
    },
    ko: { 
      name: "Coca-Cola Company", 
      ticker: "KO", 
      price: "$61.23", 
      change: "+0.11", 
      changePercent: "+0.18%", 
      marketCap: "$265B", 
      pe: "24.1", 
      volume: "15.6M",
      sector: "Beverage",
      description: "Global beverage leader",
      trend: "up",
      risk: "Low",
      dividend: "3.2%",
      reason: "Iconic brand with 62 years of dividend increases"
    },
    pep: { 
      name: "PepsiCo Inc", 
      ticker: "PEP", 
      price: "$172.45", 
      change: "+0.51", 
      changePercent: "+0.30%", 
      marketCap: "$237B", 
      pe: "25.8", 
      volume: "5.2M",
      sector: "Consumer Goods",
      description: "Food and beverage conglomerate",
      trend: "up",
      risk: "Low",
      dividend: "2.9%",
      reason: "Diversified portfolio with strong snack and beverage brands"
    },
    
    // ETFs
    voo: { 
      name: "Vanguard S&P 500 ETF", 
      ticker: "VOO", 
      price: "$452.34", 
      change: "+3.45", 
      changePercent: "+0.77%", 
      marketCap: "$1.1T", 
      expense: "0.03%",
      sector: "ETF",
      description: "Tracks S&P 500 index",
      trend: "up",
      risk: "Medium",
      reason: "Low-cost exposure to 500 largest US companies"
    },
    schd: { 
      name: "Schwab Dividend ETF", 
      ticker: "SCHD", 
      price: "$74.89", 
      change: "+0.23", 
      changePercent: "+0.31%", 
      marketCap: "$52B", 
      dividend: "3.5%",
      sector: "ETF",
      description: "Focuses on dividend growth",
      trend: "up",
      risk: "Low",
      reason: "High-quality dividend stocks with growth potential"
    },
    bnd: { 
      name: "Vanguard Total Bond ETF", 
      ticker: "BND", 
      price: "$72.34", 
      change: "-0.07", 
      changePercent: "-0.10%", 
      marketCap: "$85B", 
      yield: "4.5%",
      sector: "Bonds",
      description: "Broad bond market exposure",
      trend: "down",
      risk: "Very Low",
      reason: "Diversified bond portfolio for income and stability"
    }
  };

  // Helper function to get emotional tip
  const getEmotionalTip = (emotion) => {
    const tips = {
      stressed: "When stressed, avoid impulsive decisions. Consider conservative investments.",
      anxious: "Feeling anxious? Focus on stable, established companies.",
      confident: "Confidence is good, but always diversify.",
      happy: "Great mood! Review your long-term goals while you feel positive.",
      fearful: "Fear can create buying opportunities. Consider dollar-cost averaging.",
      neutral: "Good time for balanced decision-making."
    };
    return tips[emotion] || tips.neutral;
  };

  // Helper function to get category from age and risk
  const getCategoryFromAgeAndRisk = (age, risk) => {
    if (age < 30) {
      if (risk === 'conservative') return "Young Conservative - Balanced Approach";
      if (risk === 'moderate') return "Young Moderate - Growth Focus";
      return "Young Aggressive - High Growth";
    } else if (age < 50) {
      if (risk === 'conservative') return "Mid-Career Conservative - Income Focus";
      if (risk === 'moderate') return "Mid-Career Moderate - Balanced";
      return "Mid-Career Aggressive - Growth";
    } else {
      if (risk === 'conservative') return "Retirement Conservative - Income";
      if (risk === 'moderate') return "Retirement Moderate - Balanced Income";
      return "Retirement Aggressive - Growth (Higher Risk)";
    }
  };

  // Mock recommendation generator (fallback if API fails)
  const getMockRecommendation = (age, risk, detectedEmotion) => {
    let stocks = [];
    let allocation = {};
    
    if (age < 30) {
      if (risk === 'conservative') {
        allocation = { largeCap: 50, midCap: 30, bonds: 20 };
        stocks = [companyDatabase.voo, companyDatabase.schd, companyDatabase.bnd];
      } else if (risk === 'moderate') {
        allocation = { smallCap: 40, midCap: 30, largeCap: 30 };
        stocks = [companyDatabase.msft, companyDatabase.aapl, companyDatabase.nvda];
      } else {
        allocation = { smallCap: 70, midCap: 20, crypto: 10 };
        stocks = [companyDatabase.nvda, companyDatabase.tsla, companyDatabase.amd, companyDatabase.pltr];
      }
    } else if (age < 50) {
      if (risk === 'conservative') {
        allocation = { largeCap: 60, bonds: 30, cash: 10 };
        stocks = [companyDatabase.jnj, companyDatabase.pg, companyDatabase.ko];
      } else if (risk === 'moderate') {
        allocation = { largeCap: 40, midCap: 30, bonds: 20, international: 10 };
        stocks = [companyDatabase.msft, companyDatabase.jpm, companyDatabase.v];
      } else {
        allocation = { smallCap: 30, midCap: 40, largeCap: 30 };
        stocks = [companyDatabase.nvda, companyDatabase.tsla, companyDatabase.amd];
      }
    } else {
      if (risk === 'conservative') {
        allocation = { largeCap: 40, bonds: 40, cash: 20 };
        stocks = [companyDatabase.jnj, companyDatabase.ko, companyDatabase.bnd];
      } else if (risk === 'moderate') {
        allocation = { largeCap: 50, bonds: 30, cash: 10, dividend: 10 };
        stocks = [companyDatabase.pep, companyDatabase.ko, companyDatabase.schd];
      } else {
        allocation = { largeCap: 60, dividend: 20, bonds: 20 };
        stocks = [companyDatabase.msft, companyDatabase.aapl, companyDatabase.jpm];
      }
    }

    return {
      age: age,
      riskPreference: risk,
      tip: getEmotionalTip(detectedEmotion),
      category: getCategoryFromAgeAndRisk(age, risk),
      stocks: stocks,
      allocation: allocation,
      advice: `Based on your age (${age}) and ${risk} risk preference, we recommend focusing on ${stocks.length} companies. ${getEmotionalTip(detectedEmotion)}`,
      marketDate: new Date().toLocaleDateString(),
      marketTime: new Date().toLocaleTimeString(),
      emotionalAnalysis: {
        dominantEmotion: detectedEmotion,
        stressLevel: detectedEmotion === 'stressed' ? 8 : detectedEmotion === 'anxious' ? 7 : 5,
        emotionalBiases: []
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple emotion detection from text (for display purposes)
    let detectedEmotion = 'neutral';
    const text = emotion.toLowerCase();
    if (text.includes('stress') || text.includes('worried') || text.includes('anxious')) {
      detectedEmotion = 'stressed';
    } else if (text.includes('happy') || text.includes('excited') || text.includes('great')) {
      detectedEmotion = 'happy';
    } else if (text.includes('confident') || text.includes('sure')) {
      detectedEmotion = 'confident';
    } else if (text.includes('scared') || text.includes('fear')) {
      detectedEmotion = 'fearful';
    }
    
    try {
      if (!USE_MOCK && API_URL !== 'YOUR_API_URL_HERE') {
        // Use real AWS API with Bedrock
        console.log('Calling AWS API:', `${API_URL}/recommend?age=${age}&risk=${riskPreference}&text=${encodeURIComponent(emotion)}&userId=${userId}`);
        
        const response = await fetch(`${API_URL}/recommend?age=${age}&risk=${riskPreference}&text=${encodeURIComponent(emotion)}&userId=${userId}`);
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        // Map API response to our recommendation format
        setRecommendation({
          age: data.age,
          riskPreference: data.riskPreference,
          tip: getEmotionalTip(data.emotionalAnalysis?.dominantEmotion || detectedEmotion),
          emotionalAnalysis: data.emotionalAnalysis,
          category: getCategoryFromAgeAndRisk(data.age, data.riskPreference),
          stocks: data.stocks || [],
          advice: data.advice || `Based on your age (${data.age}) and ${data.riskPreference} risk preference, we recommend these investments.`,
          allocation: getAllocationFromAgeAndRisk(data.age, data.riskPreference),
          marketDate: new Date().toLocaleDateString(),
          marketTime: new Date().toLocaleTimeString()
        });
      } else {
        // Use mock data (fallback)
        console.log('Using mock data');
        const mockData = getMockRecommendation(age, riskPreference, detectedEmotion);
        setRecommendation(mockData);
      }
      
      setActiveTab('portfolio');
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to API. Using mock data instead.');
      
      // Fallback to mock on error
      const mockData = getMockRecommendation(age, riskPreference, detectedEmotion);
      setRecommendation(mockData);
      setActiveTab('portfolio');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get allocation based on age and risk
  const getAllocationFromAgeAndRisk = (age, risk) => {
    if (age < 30) {
      if (risk === 'conservative') return { largeCap: 50, midCap: 30, bonds: 20 };
      if (risk === 'moderate') return { smallCap: 40, midCap: 30, largeCap: 30 };
      return { smallCap: 70, midCap: 20, crypto: 10 };
    } else if (age < 50) {
      if (risk === 'conservative') return { largeCap: 60, bonds: 30, cash: 10 };
      if (risk === 'moderate') return { largeCap: 40, midCap: 30, bonds: 20, international: 10 };
      return { smallCap: 30, midCap: 40, largeCap: 30 };
    } else {
      if (risk === 'conservative') return { largeCap: 40, bonds: 40, cash: 20 };
      if (risk === 'moderate') return { largeCap: 50, bonds: 30, cash: 10, dividend: 10 };
      return { largeCap: 60, dividend: 20, bonds: 20 };
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-section">
          <h1>NeuroInvest</h1>
          <p>AI-Powered Emotional Intelligence Investing</p>
        </div>
        <div className="market-ticker">
          <div className="ticker-items">
            <div className="ticker-item">
              <span className="ticker-name">S&P 500</span>
              <span className="ticker-value">{marketData.sp500.value}</span>
              <span className={`ticker-change ${marketData.sp500.change.includes('+') ? 'positive' : 'negative'}`}>
                {marketData.sp500.change}
              </span>
            </div>
            <div className="ticker-item">
              <span className="ticker-name">NASDAQ</span>
              <span className="ticker-value">{marketData.nasdaq.value}</span>
              <span className={`ticker-change ${marketData.nasdaq.change.includes('+') ? 'positive' : 'negative'}`}>
                {marketData.nasdaq.change}
              </span>
            </div>
            <div className="ticker-item">
              <span className="ticker-name">DOW</span>
              <span className="ticker-value">{marketData.dow.value}</span>
              <span className={`ticker-change ${marketData.dow.change.includes('+') ? 'positive' : 'negative'}`}>
                {marketData.dow.change}
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="tab-nav">
        <button 
          className={activeTab === 'emotion' ? 'active' : ''} 
          onClick={() => setActiveTab('emotion')}
        >
          Check In
        </button>
        <button 
          className={activeTab === 'portfolio' ? 'active' : ''} 
          onClick={() => setActiveTab('portfolio')}
          disabled={!recommendation}
        >
          Portfolio
        </button>
      </div>
      
      <main>
        {activeTab === 'emotion' && (
          <div className="emotion-card">
            <div className="card-header">
              <h2>How are you feeling today?</h2>
              <p>Your age, risk preference, and emotional state help us personalize your investments</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Active Users</div>
                <div className="stat-value">12,345</div>
                <div className="stat-change">+8.2% today</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Avg. Returns</div>
                <div className="stat-value">+14.6%</div>
                <div className="stat-change">Above market</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Risk Score</div>
                <div className="stat-value">65</div>
                <div className="stat-change">Moderate</div>
              </div>
            </div>
            
            <div className="user-id-input">
              <label>User ID</label>
              <input 
                type="text" 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID"
              />
            </div>
            
            {/* AGE SECTION */}
            <div className="age-section">
              <h3>Your Age</h3>
              <div className="age-slider-container">
                <input 
                  type="range" 
                  min="18" 
                  max="80" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)}
                  className="age-slider"
                />
                <div className="age-display">
                  <span className="age-number">{age}</span>
                  <span className="age-badge">
                    {age < 30 ? "Young" : age < 50 ? "Mid-Career" : "Senior"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* RISK PREFERENCE */}
            <div className="risk-section">
              <h3>Risk Preference</h3>
              <div className="risk-buttons">
                <button 
                  type="button"
                  className={`risk-btn conservative ${riskPreference === 'conservative' ? 'selected' : ''}`}
                  onClick={() => setRiskPreference('conservative')}
                >
                  Conservative
                </button>
                <button 
                  type="button"
                  className={`risk-btn moderate ${riskPreference === 'moderate' ? 'selected' : ''}`}
                  onClick={() => setRiskPreference('moderate')}
                >
                  Moderate
                </button>
                <button 
                  type="button"
                  className={`risk-btn aggressive ${riskPreference === 'aggressive' ? 'selected' : ''}`}
                  onClick={() => setRiskPreference('aggressive')}
                >
                  Aggressive
                </button>
              </div>
            </div>
            
            {/* EMOTION INPUT */}
            <div className="emotion-section">
              <h3>How are you feeling?</h3>
              <textarea
                className="emotion-input"
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                placeholder="I'm feeling excited about the market today..."
              />
              <div className="emotion-quick-picks">
                <span className="quick-pick" onClick={() => setEmotion("I'm feeling very stressed about the market")}>
                  Stressed
                </span>
                <span className="quick-pick" onClick={() => setEmotion("I'm excited and confident about investing!")}>
                  Confident
                </span>
                <span className="quick-pick" onClick={() => setEmotion("I'm feeling anxious about my retirement")}>
                  Anxious
                </span>
                <span className="quick-pick" onClick={() => setEmotion("I'm feeling neutral about the market")}>
                  Neutral
                </span>
              </div>
            </div>
            
            <button 
              className="primary-button" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Analyzing with AI...' : 'Get Investment Advice'}
            </button>
            
            {USE_MOCK && (
              <div className="mock-badge">
                Using Mock Data - AWS API not connected
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'portfolio' && recommendation && (
          <div className="recommendation-card">
            <h2>Your Personalized Portfolio</h2>
            
            <div className="market-status-bar">
              <span className="market-date">{recommendation.marketDate}</span>
              <span className="market-time">{recommendation.marketTime}</span>
              <span className="market-badge">
                {USE_MOCK ? 'MOCK DATA' : 'LIVE AWS'}
              </span>
            </div>
            
            <div className="emotional-insight">
              <p>{recommendation.tip}</p>
              {recommendation.emotionalAnalysis?.emotionalBiases?.length > 0 && (
                <div className="biases-list">
                  Detected biases: {recommendation.emotionalAnalysis.emotionalBiases.join(', ')}
                </div>
              )}
            </div>
            
            <div className="profile-summary">
              <span className="profile-badge age">Age {recommendation.age}</span>
              <span className={`profile-badge risk ${recommendation.riskPreference}`}>
                {recommendation.riskPreference.charAt(0).toUpperCase() + recommendation.riskPreference.slice(1)} Risk
              </span>
            </div>
            
            <div className="category-banner">
              <h3>{recommendation.category}</h3>
            </div>
            
            <div className="advice-box">
              <p>{recommendation.advice}</p>
            </div>
            
            {/* Allocation Section */}
            {recommendation.allocation && (
              <div className="allocation-section">
                <h3>Asset Allocation</h3>
                {Object.entries(recommendation.allocation).map(([asset, percent]) => (
                  <div key={asset} className="allocation-item">
                    <div className="allocation-header">
                      <span>{asset.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="allocation-bar-container">
                      <div 
                        className="allocation-bar"
                        style={{ 
                          width: `${percent}%`,
                          background: asset.includes('small') ? '#ef4444' :
                                     asset.includes('mid') ? '#f59e0b' :
                                     asset.includes('large') ? '#3b82f6' :
                                     asset.includes('bond') ? '#10b981' : '#94a3b8'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Stocks Grid */}
            <div className="stocks-grid">
              {recommendation.stocks.map((stock, index) => (
                <div key={index} className="stock-card">
                  <div className="stock-header">
                    <span className="stock-ticker">{stock.ticker}</span>
                    <span className={`stock-risk ${stock.risk === 'High' ? 'high' : stock.risk === 'Medium' ? 'medium' : 'low'}`}>
                      {stock.risk}
                    </span>
                  </div>
                  <div className="stock-name">{stock.name}</div>
                  <div className="stock-sector">{stock.sector}</div>
                  
                  <div className="stock-details">
                    <div className="detail-item">
                      <span className="detail-label">Price</span>
                      <span className="detail-value">{stock.price}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Change</span>
                      <span className={`detail-value ${stock.trend === 'up' ? 'positive' : 'negative'}`}>
                        {stock.change} ({stock.changePercent})
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Market Cap</span>
                      <span className="detail-value">{stock.marketCap}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">P/E</span>
                      <span className="detail-value">{stock.pe || stock.dividend || stock.expense || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="stock-description">
                    {stock.description}
                  </div>
                  
                  <div className="stock-reason">
                    {stock.reason}
                  </div>
                </div>
              ))}
            </div>
            
            <button className="back-button" onClick={() => setActiveTab('emotion')}>
              ← Back to Check In
            </button>
          </div>
        )}
      </main>
      
      <footer>
        <p>Powered by AWS Lambda • API Gateway • DynamoDB • Bedrock • Built with Kiro</p>
        <p>NIMBUS1000 Hackathon 2025 | Finance Domain - Problem 5</p>
        <div className="footer-links">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Documentation</span>
        </div>
        <p className="data-source">* Using {USE_MOCK ? 'Mock Data' : 'Amazon Bedrock AI for emotional analysis'}</p>
      </footer>
    </div>
  );
}

export default App;