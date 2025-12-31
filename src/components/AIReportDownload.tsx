import React from 'react';
import type { AnalysisResponse } from '../services/geminiAI';
import type { CityChartData } from '../types/analytics';

interface AIReportDownloadProps {
  chartData: CityChartData[];
  chartType: string;
  metric: string;
  cities: string[];
  timeRange: string;
  analysis: AnalysisResponse | null;
}

const AIReportDownload: React.FC<AIReportDownloadProps> = ({
  chartData,
  chartType,
  metric,
  cities,
  timeRange,
  analysis
}) => {
  const downloadAIReportAsPDF = () => {
    if (!analysis || chartData.length === 0) {
      alert('Please generate an AI analysis first');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download report');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>EcoFresh AI Analysis Report</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: white;
              color: #1a1a1a;
              margin: 0;
              padding: 30px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #06b6d4;
              padding-bottom: 30px;
            }
            .logo {
              font-size: 2.5rem;
              font-weight: bold;
              color: #06b6d4;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #64748b;
              font-size: 1.2rem;
              margin-bottom: 20px;
            }
            .metadata {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 30px;
            }
            .metadata h3 {
              margin: 0 0 15px 0;
              color: #1e293b;
              font-size: 1.1rem;
            }
            .metadata-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
            }
            .metadata-item {
              display: flex;
              justify-content: space-between;
              padding: 8px 12px;
              background: white;
              border-radius: 6px;
              border: 1px solid #e2e8f0;
            }
            .metadata-label {
              font-weight: 600;
              color: #475569;
            }
            .metadata-value {
              color: #1e293b;
              font-weight: 500;
            }
            .content {
              white-space: pre-wrap;
              font-size: 14px;
              line-height: 1.8;
            }
            .section {
              margin-bottom: 30px;
              padding: 25px;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              background: #fafbfc;
            }
            .section h2 {
              color: #1e293b;
              border-bottom: 2px solid #06b6d4;
              padding-bottom: 10px;
              margin-bottom: 20px;
              font-size: 1.4rem;
            }
            .anomaly-item {
              background: white;
              border: 1px solid #fecaca;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 15px;
            }
            .anomaly-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
            }
            .anomaly-city {
              font-weight: bold;
              color: #dc2626;
            }
            .anomaly-severity {
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 0.8rem;
              font-weight: bold;
              text-transform: uppercase;
            }
            .severity-critical {
              background: #fecaca;
              color: #991b1b;
            }
            .severity-high {
              background: #fed7aa;
              color: #9a3412;
            }
            .severity-medium {
              background: #fef3c7;
              color: #92400e;
            }
            .severity-low {
              background: #dcfce7;
              color: #166534;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              color: #64748b;
              font-size: 0.9rem;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🌍 EcoFresh</div>
            <div class="subtitle">AI-Powered Air Quality Analysis Report</div>
          </div>
          
          <div class="metadata">
            <h3>📊 Report Configuration</h3>
            <div class="metadata-grid">
              <div class="metadata-item">
                <span class="metadata-label">Chart Type:</span>
                <span class="metadata-value">${chartType}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Metric:</span>
                <span class="metadata-value">${metric}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Cities:</span>
                <span class="metadata-value">${cities.join(', ')}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Time Range:</span>
                <span class="metadata-value">${timeRange}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Generated:</span>
                <span class="metadata-value">${new Date().toLocaleString()}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">AI Model:</span>
                <span class="metadata-value">Google Gemini 1.5 Flash</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>🤖 AI Analysis Report</h2>
            <div class="content">${analysis.report.replace(/\n/g, '<br>')}</div>
          </div>

          ${analysis.insights.length > 0 ? `
          <div class="section">
            <h2>💡 Key Insights</h2>
            <ul>
              ${analysis.insights.map(insight => `<li>${insight}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          ${analysis.recommendations.length > 0 ? `
          <div class="section">
            <h2>🎯 Recommendations</h2>
            <ul>
              ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          ${analysis.anomalies.length > 0 ? `
          <div class="section">
            <h2>🚨 Anomaly Detection Results</h2>
            ${analysis.anomalies.map(anomaly => `
              <div class="anomaly-item">
                <div class="anomaly-header">
                  <span class="anomaly-city">${anomaly.city}</span>
                  <span class="anomaly-severity severity-${anomaly.severity}">${anomaly.severity}</span>
                </div>
                <p><strong>Type:</strong> ${anomaly.type} | <strong>Value:</strong> ${anomaly.value}</p>
                <p>${anomaly.description}</p>
                <p><small><strong>Time:</strong> ${anomaly.timestamp} | <strong>Confidence:</strong> ${Math.round(anomaly.confidence * 100)}%</small></p>
              </div>
            `).join('')}
          </div>
          ` : `
          <div class="section">
            <h2>✅ Anomaly Detection Results</h2>
            <p style="text-align: center; color: #059669; font-weight: bold;">No significant anomalies detected in the analyzed data.</p>
          </div>
          `}

          <div class="footer">
            <p>This report was generated by EcoFresh AI Analytics System using Google Gemini AI.</p>
            <p>For more information, visit our analytics dashboard.</p>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 1000);
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const downloadAIReportAsCSV = () => {
    if (!analysis || chartData.length === 0) {
      alert('Please generate an AI analysis first');
      return;
    }

    const csvContent = `EcoFresh AI Analysis Report
Generated: ${new Date().toLocaleString()}
Chart Type: ${chartType}
Metric: ${metric}
Cities: ${cities.join(', ')}
Time Range: ${timeRange}

AI ANALYSIS:
${analysis.report}

KEY INSIGHTS:
${analysis.insights.map(insight => `- ${insight}`).join('\n')}

RECOMMENDATIONS:
${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

ANOMALY DETECTION:
${analysis.anomalies.length > 0 ? 
  analysis.anomalies.map(anomaly => 
    `${anomaly.city}: ${anomaly.type} (${anomaly.severity}) - ${anomaly.description} [${anomaly.timestamp}]`
  ).join('\n') : 
  'No anomalies detected'
}

DATA SUMMARY:
${chartData.map(cityData => {
  const values = cityData.values.map(v => v.value);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  return `${cityData.city}: Avg ${avg.toFixed(2)}, Max ${max}, Min ${min}`;
}).join('\n')}
`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ecofresh-ai-analysis-${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadAIReportAsJSON = () => {
    if (!analysis || chartData.length === 0) {
      alert('Please generate an AI analysis first');
      return;
    }

    const reportData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        chartType,
        metric,
        cities,
        timeRange,
        aiModel: 'Google Gemini 1.5 Flash'
      },
      analysis: analysis.report,
      insights: analysis.insights,
      recommendations: analysis.recommendations,
      anomalies: analysis.anomalies,
      chartData: chartData.map(cityData => ({
        city: cityData.city,
        summary: {
          dataPoints: cityData.values.length,
          average: cityData.values.reduce((sum, v) => sum + v.value, 0) / cityData.values.length,
          maximum: Math.max(...cityData.values.map(v => v.value)),
          minimum: Math.min(...cityData.values.map(v => v.value))
        },
        values: cityData.values
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ecofresh-ai-analysis-${Date.now()}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!analysis) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4">
        <p className="text-yellow-400 text-sm text-center">
          🤖 Generate an AI analysis first to enable enhanced downloads
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-4 p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-xl">
      <h4 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center space-x-2">
        <span>🤖</span>
        <span>AI Enhanced Downloads</span>
      </h4>
      
      <button 
        onClick={downloadAIReportAsPDF}
        className="w-full p-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 text-sm flex items-center justify-center gap-2"
      >
        📄 Comprehensive AI Report (PDF)
      </button>
      
      <button 
        onClick={downloadAIReportAsCSV}
        className="w-full p-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 text-sm flex items-center justify-center gap-2"
      >
        📊 AI Analysis Report (CSV)
      </button>
      
      <button 
        onClick={downloadAIReportAsJSON}
        className="w-full p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 text-sm flex items-center justify-center gap-2"
      >
        🔧 Structured Data (JSON)
      </button>
    </div>
  );
};

export default AIReportDownload;