import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calculator, DollarSign, TrendingUp, Download, Calendar, ArrowRight, Users, Target, Eye, Zap, Trophy } from 'lucide-react';

const HiddenProfitFinder = () => {
  const [step, setStep] = useState('contact');
  const [daysPassed, setDaysPassed] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [industryType, setIndustryType] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('medium');
  const [inputs, setInputs] = useState({
    revenue: 20,
    opexPercent: 35,
    headcount: 85,
    techSpend: 8,
    aiReadiness: 'beginner',
    processMaturity: 60,
    outsourcingLevel: 'low',
    name: '',
    company: '',
    email: '',
    phone: ''
  });

  const [results, setResults] = useState(null);

  // Money bleeding counter effect
  useEffect(() => {
    if (results && step === 'results') {
      const interval = setInterval(() => {
        setDaysPassed(prev => prev + 1);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [results, step]);

  const runSimulation = () => {
    console.log('Starting simulation with inputs:', inputs);
    
    const numSimulations = 3000;
    const simResults = [];

    const aiSavingsRange = {
      beginner: [0.03, 0.08],
      learning: [0.06, 0.12],
      adopter: [0.10, 0.18]
    };

    const processSavingsRange = [0.05, 0.20];
    const outsourcingSavingsRange = {
      low: [0.02, 0.06],
      medium: [0.04, 0.10],
      high: [0.06, 0.15]
    };

    const changeSuccessRange = [0.65, 0.85];
    const currentOpex = inputs.revenue * (inputs.opexPercent / 100);

    for (let i = 0; i < numSimulations; i++) {
      const aiRange = aiSavingsRange[inputs.aiReadiness];
      const aiSavings = Math.random() * (aiRange[1] - aiRange[0]) + aiRange[0];
      
      const processSavings = Math.random() * (processSavingsRange[1] - processSavingsRange[0]) + processSavingsRange[0];
      
      const outsourcingRange = outsourcingSavingsRange[inputs.outsourcingLevel];
      const outsourcingSavings = Math.random() * (outsourcingRange[1] - outsourcingRange[0]) + outsourcingRange[0];
      
      const changeSuccess = Math.random() * (changeSuccessRange[1] - changeSuccessRange[0]) + changeSuccessRange[0];
      
      const maturityMultiplier = inputs.processMaturity / 100;
      const techMultiplier = Math.min(inputs.techSpend / 10, 1.2);
      
      const totalSavingsPercent = (aiSavings + processSavings * maturityMultiplier + outsourcingSavings) * changeSuccess * techMultiplier;
      const savingsAmount = currentOpex * totalSavingsPercent;
      
      simResults.push({
        savingsPercent: totalSavingsPercent * 100,
        savingsAmount: savingsAmount
      });
    }

    const sortedResults = [...simResults].sort((a, b) => a.savingsPercent - b.savingsPercent);

    const p10Index = Math.floor(numSimulations * 0.1);
    const p50Index = Math.floor(numSimulations * 0.5);
    const p90Index = Math.floor(numSimulations * 0.9);

    const summary = {
      p10: {
        percent: sortedResults[p10Index].savingsPercent,
        amount: sortedResults[p10Index].savingsAmount
      },
      p50: {
        percent: sortedResults[p50Index].savingsPercent,
        amount: sortedResults[p50Index].savingsAmount
      },
      p90: {
        percent: sortedResults[p90Index].savingsPercent,
        amount: sortedResults[p90Index].savingsAmount
      },
      currentOpex: currentOpex,
      simulations: simResults,
      breakdownData: getBreakdownData()
    };

    console.log('Final simulation summary:', summary);
    setResults(summary);
    setStep('results');
  };

  const getBreakdownData = () => {
    const currentOpex = inputs.revenue * (inputs.opexPercent / 100);
    return [
      { name: 'Personnel', value: currentOpex * 0.65, color: '#3B82F6' },
      { name: 'Technology', value: currentOpex * (inputs.techSpend / 100), color: '#10B981' },
      { name: 'Operations', value: currentOpex * 0.15, color: '#F59E0B' },
      { name: 'Overhead', value: currentOpex * 0.12, color: '#EF4444' }
    ];
  };

  const getDistributionData = () => {
    if (!results) return [];
    
    const buckets = Array(15).fill(0);
    const minPercent = 0;
    const maxPercent = 25;
    const bucketSize = (maxPercent - minPercent) / 15;

    results.simulations.forEach(sim => {
      const bucketIndex = Math.min(Math.floor(sim.savingsPercent / bucketSize), 14);
      buckets[bucketIndex]++;
    });

    return buckets.map((count, index) => ({
      range: `${(index * bucketSize).toFixed(1)}-${((index + 1) * bucketSize).toFixed(1)}%`,
      count: count,
      probability: (count / results.simulations.length) * 100
    }));
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const generateTimeSlots = () => {
    return [
      { day: 'Today', slots: ['2:00 PM'], available: 1 },
      { day: 'Tomorrow', slots: [], available: 0 },
      { day: 'Thursday', slots: ['10:00 AM', '3:30 PM'], available: 2 },
      { day: 'Friday', slots: [], available: 0 },
      { day: 'Monday', slots: ['9:00 AM'], available: 1 }
    ];
  };

  const getPersonalizedMessaging = () => {
    const revenueSegment = inputs.revenue < 5 ? 'startup' : inputs.revenue < 25 ? 'growth' : 'enterprise';
    
    const messages = {
      startup: {
        urgency: 'Cash flow optimization critical for survival and growth',
        opportunity: 'Most startups have 20-35% hidden profit potential',
        risk: 'Competitors with better unit economics will outpace you'
      },
      growth: {
        urgency: 'Scale efficiently or hit the growth ceiling',
        opportunity: 'Growing companies often have 15-25% profit trapped in processes',
        risk: 'Inefficient growth leads to investor concerns and market loss'
      },
      enterprise: {
        urgency: 'Market leaders maintain advantage through operational excellence',
        opportunity: 'Enterprise-level companies average 10-20% profit optimization potential',
        risk: 'Nimble competitors are disrupting with AI-optimized operations'
      }
    };
    
    return messages[revenueSegment];
  };

  const getIndustryInsights = () => {
    const insights = {
      'Manufacturing': 'Supply chain optimization typically yields 12-18% cost reduction',
      'Technology': 'R&D efficiency and talent optimization can unlock 15-25% profits',
      'Healthcare': 'Administrative automation often reduces OpEx by 10-20%',
      'Professional Services': 'Process standardization can improve margins by 20-30%',
      'Retail/E-commerce': 'Inventory and fulfillment optimization typically saves 10-15%',
      'Other': 'Cross-industry analysis shows 12-22% average profit optimization potential'
    };
    
    return insights[industryType] || insights['Other'];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      {/* Enhanced Header with Blue Ocean Positioning */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="flex items-center">
              <div className="text-4xl font-black text-blue-900 mr-4">WCA</div>
              <div className="border-l-2 border-blue-900 pl-4">
                <div className="text-xl font-bold text-blue-900">Wilts C.</div>
                <div className="text-xl font-bold text-blue-900">Alexander III</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-4">
          <Eye className="mr-3 text-blue-600" size={32} />
          <h1 className="text-4xl font-bold text-slate-800">
            Hidden Profit Finder™
          </h1>
        </div>
        <p className="text-xl text-slate-600 mb-2">
          AI-Powered Simulations for Business Leaders ($1M-$100M Revenue)
        </p>
        <p className="text-lg text-slate-500 mb-4">
          De-risk decisions • Find hidden profits • Test strategies before you commit
        </p>
        
        <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
          <Zap className="mr-2" size={16} />
          World's First Strategy Simulation Coaching™
        </div>
      </div>

      {/* Social Proof Banner */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 mb-8">
        <div className="text-center mb-4">
          <Trophy className="mx-auto mb-2 text-yellow-600" size={32} />
          <h3 className="font-bold text-gray-800">Trusted by 200+ Business Leaders</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-green-700">Manufacturing Co. ($28M)</p>
            <p className="text-gray-600">"Found $2.1M in hidden profits. Implemented strategy in 60 days."</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-blue-700">Tech Services ($15M)</p>
            <p className="text-gray-600">"Reduced OpEx by 14% through AI simulation insights. ROI in 3 months."</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-purple-700">Distribution ($42M)</p>
            <p className="text-gray-600">"$1.8M annual savings. Best strategic investment we've made."</p>
          </div>
        </div>
      </div>

      {/* Urgency & Scarcity Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <div className="flex items-center">
          <Zap className="text-yellow-600 mr-3" size={20} />
          <div>
            <p className="font-bold text-yellow-800">⚡ First-Mover Advantage Window Closing</p>
            <p className="text-yellow-700 text-sm">73% of your industry peers are already using AI for strategic advantage. Only 2 Strategy Simulation Coaching slots left this quarter.</p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${step === 'contact' ? 'text-blue-600' : step === 'parameters' || step === 'results' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'contact' ? 'bg-blue-600 text-white' : step === 'parameters' || step === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>1</div>
            <span className="ml-2 font-medium">Contact Info</span>
          </div>
          <div className="w-12 h-px bg-gray-300"></div>
          <div className={`flex items-center ${step === 'parameters' ? 'text-blue-600' : step === 'results' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'parameters' ? 'bg-blue-600 text-white' : step === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
            <span className="ml-2 font-medium">Business Details</span>
          </div>
          <div className="w-12 h-px bg-gray-300"></div>
          <div className={`flex items-center ${step === 'results' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>3</div>
            <span className="ml-2 font-medium">Your Hidden Profits</span>
          </div>
        </div>
      </div>

      {/* Contact Form Step */}
      {step === 'contact' && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Discover Your Hidden Profits in 3 Minutes</h2>
            <p className="text-gray-600">Most business leaders are shocked to find 15-25% of potential profits hidden in plain sight</p>
          </div>
          
          <div className="max-w-md mx-auto space-y-4">
            <input
              type="text"
              placeholder="Your Full Name *"
              value={inputs.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              placeholder="Company Name *"
              value={inputs.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            
            <select
              value={industryType}
              onChange={(e) => setIndustryType(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Your Industry *</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Technology">Technology/Software</option>
              <option value="Healthcare">Healthcare/Medical</option>
              <option value="Professional Services">Professional Services</option>
              <option value="Retail/E-commerce">Retail/E-commerce</option>
              <option value="Construction">Construction/Real Estate</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Other">Other</option>
            </select>
            
            <input
              type="email"
              placeholder="Business Email Address *"
              value={inputs.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={inputs.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How urgent is profit optimization for your business?
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="low"
                    checked={urgencyLevel === 'low'}
                    onChange={(e) => setUrgencyLevel(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">Exploring options (next 6-12 months)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="medium"
                    checked={urgencyLevel === 'medium'}
                    onChange={(e) => setUrgencyLevel(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">Important priority (next 3-6 months)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="high"
                    checked={urgencyLevel === 'high'}
                    onChange={(e) => setUrgencyLevel(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">Critical need (immediate action required)</span>
                </label>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 p-3 bg-blue-50 rounded">
              <p className="mb-2">By providing your information, you agree to receive:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your personalized Hidden Profit Analysis</li>
                <li>Industry-specific strategic insights and AI-powered optimization tips</li>
                <li>Information about Wilts Alexander's Strategy Simulation Coaching</li>
              </ul>
              <p className="mt-2">You can unsubscribe at any time. We respect your privacy.</p>
            </div>
            
            <button
              onClick={() => {
                if (inputs.name && inputs.company && inputs.email && industryType) {
                  setStep('parameters');
                } else {
                  alert('Please fill in all required fields (marked with *)');
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <Eye className="mr-2" />
              Reveal My Hidden Profits →
            </button>
            
            <div className="text-center text-sm text-gray-500">
              Questions? Call Wilts Alexander directly: <strong className="text-blue-600">678-428-5997</strong>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center italic">
              "40+ years helping leaders de-risk strategic decisions. From Fortune 500 boardrooms to scaling startups, I've seen what works—and what costs millions in missed opportunities."
            </p>
            <p className="text-sm text-gray-700 mt-2 font-medium text-center">— Wilts Alexander III, Strategy Simulation Coach™</p>
          </div>
        </div>
      )}

      {/* Personal Message from Wilts */}
      {step === 'parameters' && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Personal Message from Wilts Alexander</h2>
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-2xl font-bold">WA</span>
            </div>
            <div className="flex-1">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-gray-800 italic">
                  "Hi {inputs.name}, I've worked with 200+ {industryType.toLowerCase()} companies like {inputs.company}. 
                  {getIndustryInsights()}
                  
                  Based on your urgency level ({urgencyLevel === 'high' ? 'critical need' : urgencyLevel === 'medium' ? 'important priority' : 'exploring options'}), 
                  I'll prioritize {urgencyLevel === 'high' ? 'immediate quick wins' : urgencyLevel === 'medium' ? 'strategic opportunities' : 'long-term optimization potential'} 
                  in your personalized analysis.
                  
                  After you see your simulation results, I'll personally show you the top 3 profit opportunities specific to {industryType.toLowerCase()} businesses in your revenue range. No sales pitch, just actionable insights you can implement this quarter."
                </p>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-semibold">Wilts Alexander III, Strategy Simulation Coach™</p>
                <p>40+ years • 200+ companies • $500M+ in hidden profits discovered</p>
                <p className="text-blue-600">Specializing in {industryType.toLowerCase()} optimization strategies</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Parameters Step */}
      {step === 'parameters' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Calculator className="mr-3 text-blue-600" />
              Your Business Profile
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Revenue ($M): ${inputs.revenue}M
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={inputs.revenue}
                  onChange={(e) => handleInputChange('revenue', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$1M</span>
                  <span>$100M</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operating Expenses (% of Revenue): {inputs.opexPercent}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={inputs.opexPercent}
                  onChange={(e) => handleInputChange('opexPercent', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Growing companies typically run 25-50%</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Count: {inputs.headcount}
                </label>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={inputs.headcount}
                  onChange={(e) => handleInputChange('headcount', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technology Spend (% of OpEx): {inputs.techSpend}%
                </label>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={inputs.techSpend}
                  onChange={(e) => handleInputChange('techSpend', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI/Automation Readiness
                </label>
                <select
                  value={inputs.aiReadiness}
                  onChange={(e) => handleInputChange('aiReadiness', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Just Starting (3-8% hidden profit potential)</option>
                  <option value="learning">Learning Phase (6-12% hidden profit potential)</option>
                  <option value="adopter">Early Adopter (10-18% hidden profit potential)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Process Maturity: {inputs.processMaturity}%
                </label>
                <input
                  type="range"
                  min="30"
                  max="90"
                  value={inputs.processMaturity}