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

  // --- The continuation of the parameters form, closing tags, and results step ---

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      {/* ...all previous content from above... */}

      {/* Continue from the cut-off input for Process Maturity */}
      {step === 'parameters' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Calculator className="mr-3 text-blue-600" />
              Your Business Profile
            </h2>
            
            <div className="space-y-6">
              {/* ...previous parameter inputs... */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Process Maturity: {inputs.processMaturity}%
                </label>
                <input
                  type="range"
                  min="30"
                  max="90"
                  value={inputs.processMaturity}
                  onChange={(e) => handleInputChange('processMaturity', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">How standardized and optimized are your core processes?</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outsourcing Level
                </label>
                <select
                  value={inputs.outsourcingLevel}
                  onChange={(e) => handleInputChange('outsourcingLevel', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low (Most functions in-house)</option>
                  <option value="medium">Medium (Some functions outsourced)</option>
                  <option value="high">High (Many functions outsourced)</option>
                </select>
              </div>
              <button
                onClick={runSimulation}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center mt-6"
              >
                <TrendingUp className="mr-2" />
                Run My Profit Finder Simulation
              </button>
            </div>
          </div>
          {/* Personalized Messaging */}
          <div className="bg-blue-50 rounded-xl shadow-lg p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="mr-2 text-blue-500" />
                Personalized Insights
              </h2>
              <div className="mb-4">
                <div className="font-bold text-blue-700">Industry Insight</div>
                <p className="text-gray-700">{getIndustryInsights()}</p>
              </div>
              <div className="mb-4">
                <div className="font-bold text-green-700">Opportunity</div>
                <p className="text-gray-700">{getPersonalizedMessaging().opportunity}</p>
              </div>
              <div className="mb-4">
                <div className="font-bold text-yellow-700">Urgency</div>
                <p className="text-gray-700">{getPersonalizedMessaging().urgency}</p>
              </div>
              <div>
                <div className="font-bold text-red-700">Risk</div>
                <p className="text-gray-700">{getPersonalizedMessaging().risk}</p>
              </div>
            </div>
            <div className="mt-8 text-xs text-gray-500 text-center">
              All simulations are confidential and secure.
            </div>
          </div>
        </div>
      )}

      {/* Results Step */}
      {step === 'results' && results && (
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-700 mb-2">Your Hidden Profit Potential</h2>
            <p className="text-lg text-gray-600 mb-4">
              Based on 3,000 AI-powered simulations, here's what you could unlock:
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg shadow-sm">
                <div className="text-sm text-green-700 font-semibold mb-1">Conservative (P10)</div>
                <div className="text-2xl font-bold text-green-900">{results.p10.percent.toFixed(1)}%</div>
                <div className="text-sm text-gray-700">= ${results.p10.amount.toLocaleString(undefined, {maximumFractionDigits:0})} / year</div>
              </div>
              <ArrowRight size={32} className="text-blue-400 hidden md:block" />
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-sm">
                <div className="text-sm text-blue-700 font-semibold mb-1">Most Likely (P50)</div>
                <div className="text-2xl font-bold text-blue-900">{results.p50.percent.toFixed(1)}%</div>
                <div className="text-sm text-gray-700">= ${results.p50.amount.toLocaleString(undefined, {maximumFractionDigits:0})} / year</div>
              </div>
              <ArrowRight size={32} className="text-blue-400 hidden md:block" />
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg shadow-sm">
                <div className="text-sm text-yellow-700 font-semibold mb-1">Best Case (P90)</div>
                <div className="text-2xl font-bold text-yellow-900">{results.p90.percent.toFixed(1)}%</div>
                <div className="text-sm text-gray-700">= ${results.p90.amount.toLocaleString(undefined, {maximumFractionDigits:0})} / year</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">*P10 = Conservative, P50 = Most Likely, P90 = Best Case</div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Savings Distribution Chart */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <TrendingUp className="mr-2 text-blue-600" />
                Potential Savings Distribution
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={getDistributionData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" fontSize={12} />
                  <YAxis tickFormatter={v => `${v}%`} fontSize={12} />
                  <Tooltip formatter={(value, name) => name === "probability" ? `${value.toFixed(1)}%` : value} />
                  <Bar dataKey="probability" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
              <div className="text-xs text-gray-500 mt-2">
                Shows probability of various savings outcomes across 3,000 simulations.
              </div>
            </div>
            {/* OpEx Breakdown Pie Chart */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <DollarSign className="mr-2 text-green-600" />
                Current OpEx Breakdown (${results.currentOpex.toLocaleString(undefined, {maximumFractionDigits:0})})
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie 
                    data={results.breakdownData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" 
                    cy="50%" 
                    outerRadius={90}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {results.breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={value => `$${value.toLocaleString(undefined, {maximumFractionDigits:0})}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-xs text-gray-500 mt-2">
                Personnel, Technology, Operations, and Overhead as % of current OpEx.
              </div>
            </div>
          </div>
          {/* Money Bleeding Counter, CTA, and Booking */}
          <div className="mt-8 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded mb-4 flex items-center">
                <Zap className="text-red-400 mr-3" size={24} />
                <div>
                  <p className="font-bold text-red-700 mb-1">Each day you delay costs an average of:</p>
                  <p className="text-2xl font-black text-red-800">${(results.p50.amount / 365).toLocaleString(undefined, {maximumFractionDigits:0})} / day</p>
                  <p className="text-xs text-gray-500">Days since simulation: {daysPassed}</p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center mb-4"
                  onClick={() => {
                    setShowCalendar(!showCalendar);
                  }}
                >
                  <Calendar className="mr-2" />
                  Book a Free Strategy Session
                </button>
                {showCalendar && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
                    <h4 className="text-sm font-semibold mb-2">Available Time Slots</h4>
                    <ul>
                      {generateTimeSlots().map((day, idx) =>
                        <li key={idx} className="mb-1">
                          <span className="font-semibold">{day.day}: </span>
                          {day.slots.length > 0
                            ? day.slots.map((slot, sidx) => (
                                <button
                                  key={sidx}
                                  className={`inline-block px-3 py-1 rounded-lg border bg-white mr-2 mb-1 ${selectedTimeSlot === slot ? 'border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700'}`}
                                  onClick={() => setSelectedTimeSlot(slot)}
                                >
                                  {slot}
                                </button>
                              ))
                            : <span className="text-gray-400">No slots</span>}
                        </li>
                      )}
                    </ul>
                    {selectedTimeSlot && (
                      <div className="mt-3 text-green-700 font-semibold">
                        Booked for {selectedTimeSlot}! We'll email you a confirmation.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-4">
                  <p className="font-bold text-green-700 mb-1">What Happens Next?</p>
                  <ul className="list-disc list-inside text-green-900 text-sm">
                    <li>Wilts Alexander will review your simulation</li>
                    <li>Get a personalized, actionable 3-step plan</li>
                    <li>No obligation, just insight and value</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <button
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg flex items-center justify-center"
                  onClick={() => window.print()}
                >
                  <Download className="mr-2" />
                  Download/Print My Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HiddenProfitFinder;