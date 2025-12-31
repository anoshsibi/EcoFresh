import React, { useState, useEffect } from 'react';
import { geminiAI } from '../services/geminiAI';
import type { AnalysisResponse, AnomalyDetection, ChartAnalysisData } from '../services/geminiAI';
import type { CityChartData } from '../types/analytics';

interface PresetPrompt {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: 'health-impact',
    name: 'Health Impact Assessment',
    description: 'Analyze health implications and provide recommendations for vulnerable populations',
    icon: '🏥'
  },
  {
    id: 'trend-analysis',
    name: 'Trend Analysis',
    description: 'Identify patterns, trends, and predict future air quality conditions',
    icon: '📈'
  },
  {
    id: 'pollution-sources',
    name: 'Pollution Source Analysis',
    description: 'Identify potential sources and causes of air pollution',
    icon: '🏭'
  },
  {
    id: 'comparison-report',
    name: 'City Comparison Report',
    description: 'Compare air quality between selected cities with rankings',
    icon: '⚖️'
  },
  {
    id: 'emergency-assessment',
    name: 'Emergency Assessment',
    description: 'Check for critical conditions requiring immediate attention',
    icon: '🚨'
  },
  {
    id: 'environmental-correlation',
    name: 'Environmental Factors',
    description: 'Analyze correlation with weather, geography, and urban factors',
    icon: '🌍'
  }
];

interface AIAnalysisPanelProps {
  chartData: CityChartData[];
  chartType: string;
  metric: string;
  cities: string[];
  timeRange: string;
  isVisible: boolean;
  onClose: () => void;
  onReportGenerated: (report: string) => void;
  onAnalysisGenerated?: (analysis: AnalysisResponse) => void;
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  chartData,
  chartType,
  metric,
  cities,
  timeRange,
  isVisible,
  onClose,
  onReportGenerated,
  onAnalysisGenerated
}) => {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'anomalies' | 'presets'>('presets');
  const [loadingPreset, setLoadingPreset] = useState<string | null>(null);

  const analysisData: ChartAnalysisData = {
    chartType,
    metric,
    cities,
    timeRange,
    data: chartData
  };

  useEffect(() => {
    if (isVisible && chartData.length > 0 && cities.length > 0) {
      detectAnomalies();
    }
  }, [isVisible, chartData, cities]);

  const generateFullAnalysis = async () => {
    if (chartData.length === 0 || cities.length === 0) {
      setError('Please select cities and generate chart data first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await geminiAI.analyzeChart(analysisData);
      setAnalysis(result);
      onReportGenerated(result.report);
      onAnalysisGenerated?.(result);
      setActiveTab('analysis');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const detectAnomalies = async () => {
    if (chartData.length === 0) return;

    try {
      const detectedAnomalies = await geminiAI.detectAnomalies(analysisData);
      setAnomalies(detectedAnomalies);
    } catch (err) {
      console.error('Error detecting anomalies:', err);
    }
  };

  const generatePresetAnalysis = async (presetId: string) => {
    if (chartData.length === 0 || cities.length === 0) {
      setError('Please select cities and generate chart data first');
      return;
    }

    setLoadingPreset(presetId);
    setError(null);

    try {
      const result = await geminiAI.generatePresetAnalysis(presetId, analysisData);
      const analysisResult = {
        report: result,
        anomalies: anomalies,
        insights: [],
        recommendations: []
      };
      setAnalysis(analysisResult);
      onReportGenerated(result);
      onAnalysisGenerated?.(analysisResult);
      setActiveTab('analysis');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate preset analysis');
    } finally {
      setLoadingPreset(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10';
      case 'high': return 'text-orange-400 bg-orange-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'spike': return '📈';
      case 'drop': return '📉';
      case 'pattern': return '🔄';
      case 'threshold': return '⚠️';
      default: return '❓';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-black/90 backdrop-blur-xl border border-cyan-400/20 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-400/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
              🤖
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Analysis & Anomaly Detection</h2>
              <p className="text-cyan-400/80 text-sm">
                {cities.length > 0 ? `Analyzing ${cities.length} cities: ${cities.join(', ')}` : 'Select cities to begin analysis'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 transition-all duration-200"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-cyan-400/20">
          {[
            { id: 'presets', name: 'Quick Analysis', icon: '⚡' },
            { id: 'analysis', name: 'Full Report', icon: '📊' },
            { id: 'anomalies', name: `Anomalies (${anomalies.length})`, icon: '🚨' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-cyan-400 border-cyan-400 bg-cyan-400/5'
                  : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-red-400">
              <div className="flex items-center space-x-2">
                <span>❌</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Preset Prompts Tab */}
          {activeTab === 'presets' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Choose an Analysis Type</h3>
                <p className="text-gray-400">Select a preset analysis to get instant AI-powered insights about your air quality data</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRESET_PROMPTS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => generatePresetAnalysis(preset.id)}
                    disabled={loadingPreset === preset.id || chartData.length === 0}
                    className="p-6 bg-gradient-to-br from-slate-700/50 to-slate-800/50 hover:from-cyan-900/30 hover:to-blue-900/30 border border-slate-600/30 hover:border-cyan-400/50 rounded-xl transition-all duration-300 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                        {loadingPreset === preset.id ? '⏳' : preset.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                          {preset.name}
                        </h4>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          {preset.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center pt-6 border-t border-slate-700/50">
                <button
                  onClick={generateFullAnalysis}
                  disabled={isLoading || chartData.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Generating Comprehensive Analysis...</span>
                    </span>
                  ) : (
                    '🚀 Generate Comprehensive Analysis'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Full Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {analysis ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-400/30 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center space-x-2">
                      <span>📋</span>
                      <span>AI Analysis Report</span>
                    </h3>
                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                        {analysis.report}
                      </div>
                    </div>
                  </div>

                  {analysis.insights.length > 0 && (
                    <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-400/30 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-green-400 mb-4 flex items-center space-x-2">
                        <span>💡</span>
                        <span>Key Insights</span>
                      </h4>
                      <ul className="space-y-2">
                        {analysis.insights.map((insight, index) => (
                          <li key={index} className="flex items-start space-x-3 text-gray-300">
                            <span className="text-green-400 mt-1">•</span>
                            <span className="text-sm">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.recommendations.length > 0 && (
                    <div className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border border-orange-400/30 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-orange-400 mb-4 flex items-center space-x-2">
                        <span>🎯</span>
                        <span>Recommendations</span>
                      </h4>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-3 text-gray-300">
                            <span className="text-orange-400 mt-1">•</span>
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className="text-xl font-bold text-gray-400 mb-2">No Analysis Generated Yet</h3>
                  <p className="text-gray-500 mb-6">Use the preset analysis options or generate a comprehensive report to see AI insights here.</p>
                  <button
                    onClick={() => setActiveTab('presets')}
                    className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-400 rounded-xl transition-all duration-200"
                  >
                    ← Back to Preset Analysis
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Anomalies Tab */}
          {activeTab === 'anomalies' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span>🔍</span>
                  <span>Anomaly Detection Results</span>
                </h3>
                <button
                  onClick={detectAnomalies}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-400 rounded-lg transition-all duration-200"
                >
                  🔄 Refresh Detection
                </button>
              </div>

              {anomalies.length > 0 ? (
                <div className="grid gap-4">
                  {anomalies.map((anomaly, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${getSeverityColor(anomaly.severity)} bg-opacity-10`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getAnomalyIcon(anomaly.type)}</span>
                          <div>
                            <h4 className="font-bold text-white">{anomaly.city}</h4>
                            <p className="text-sm opacity-80">{anomaly.timestamp}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(anomaly.severity)}`}>
                            {anomaly.severity.toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            Confidence: {Math.round(anomaly.confidence * 100)}%
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{anomaly.description}</p>
                      <div className="text-xs text-gray-400">
                        <span className="font-medium">Type:</span> {anomaly.type} | 
                        <span className="font-medium ml-2">Value:</span> {anomaly.value}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-green-400 mb-2">No Anomalies Detected</h3>
                  <p className="text-gray-400">The air quality data appears normal with no significant anomalies or concerning patterns detected.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPanel;