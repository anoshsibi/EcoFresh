import html2canvas from 'html2canvas';
import type { CityChartData } from '../types/analytics';
import type { AnalysisResponse } from './geminiAI';

interface ExportData {
  chartData: CityChartData[];
  chartType: string;
  metric: string;
  cities: string[];
  timeRange: string;
  analysis?: AnalysisResponse | null;
  aiReport?: string | null;
}

class ExportService {
  // Export chart as PNG
  async exportChartAsPNG(chartElementId: string, filename?: string): Promise<void> {
    try {
      const chartElement = document.getElementById(chartElementId);
      if (!chartElement) {
        throw new Error('Chart element not found. Make sure the chart is rendered before exporting.');
      }

      console.log('Capturing chart for PNG export:', chartElement);
      
      // Wait a moment for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#1a1a1a',
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: true,
        logging: false,
        width: chartElement.offsetWidth,
        height: chartElement.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      });

      console.log('PNG canvas captured:', canvas.width, 'x', canvas.height);

      // Create download link
      const link = document.createElement('a');
      link.download = filename || `ecofresh-chart-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting chart as PNG:', error);
      throw new Error('Failed to export chart as PNG');
    }
  }

  // Export data as CSV
  exportDataAsCSV(data: ExportData, filename?: string): void {
    try {
      const { chartData, chartType, metric, cities, timeRange } = data;
      
      // Create CSV header
      const headers = ['City', 'Timestamp', 'Value', 'AQI', 'PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'CO'];
      
      // Create CSV rows
      const rows: string[] = [headers.join(',')];
      
      chartData.forEach(cityData => {
        cityData.values.forEach(dataPoint => {
          const row = [
            `"${cityData.city}"`,
            `"${dataPoint.time}"`,
            dataPoint.value?.toString() || '',
            dataPoint.aqi?.toString() || '',
            dataPoint.pm25?.toString() || '',
            dataPoint.pm10?.toString() || '',
            dataPoint.o3?.toString() || '',
            dataPoint.no2?.toString() || '',
            dataPoint.so2?.toString() || '',
            dataPoint.co?.toString() || ''
          ];
          rows.push(row.join(','));
        });
      });

      // Add metadata header
      const metadata = [
        '',
        '# EcoFresh Air Quality Data Export',
        `# Generated: ${new Date().toLocaleString()}`,
        `# Chart Type: ${chartType}`,
        `# Metric: ${metric}`,
        `# Cities: ${cities.join(', ')}`,
        `# Time Range: ${timeRange}`,
        '',
        '# Data Format: City, Timestamp, Value, AQI, PM2.5, PM10, O3, NO2, SO2, CO',
        ''
      ];

      const csvContent = metadata.join('\n') + '\n' + rows.join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename || `ecofresh-data-${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data as CSV:', error);
      throw new Error('Failed to export data as CSV');
    }
  }

  // Export comprehensive PDF with chart and AI report (HTML window method)
  async exportComprehensivePDF(
    data: ExportData, 
    chartElementId: string
  ): Promise<void> {
    try {
      const { chartData, chartType, metric, cities, timeRange, analysis, aiReport } = data;
      
      // Capture chart as image first
      const chartElement = document.getElementById(chartElementId);
      if (!chartElement) {
        throw new Error('Chart element not found. Make sure the chart is rendered before exporting.');
      }

      console.log('Capturing chart element for HTML export:', chartElement);
      
      // Wait a moment for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      const chartCanvas = await html2canvas(chartElement, {
        backgroundColor: '#1a1a1a',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: true,
        logging: false,
        width: chartElement.offsetWidth,
        height: chartElement.offsetHeight,
        scrollX: 0,
        scrollY: 0
      });

      const chartImgData = chartCanvas.toDataURL('image/png');
      console.log('Chart captured for HTML export');

      // Open new window with HTML content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Please allow popups to download report');
      }

      const htmlContent = `
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
              .chart-section {
                margin: 30px 0;
                text-align: center;
              }
              .chart-title {
                font-size: 1.4rem;
                font-weight: bold;
                color: #1e293b;
                margin-bottom: 20px;
                border-bottom: 2px solid #06b6d4;
                padding-bottom: 10px;
              }
              .chart-image {
                max-width: 100%;
                height: auto;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
              .data-summary {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 20px;
              }
              .city-data {
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 15px;
              }
              .city-name {
                font-weight: bold;
                color: #06b6d4;
                font-size: 1.1rem;
                margin-bottom: 10px;
              }
              .city-stats {
                font-size: 0.9rem;
                color: #64748b;
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
                  <span class="metadata-label">Data Points:</span>
                  <span class="metadata-value">${chartData.reduce((total, city) => total + city.values.length, 0)}</span>
                </div>
              </div>
            </div>

            <div class="chart-section">
              <h2 class="chart-title">📈 Air Quality Chart</h2>
              <img src="${chartImgData}" alt="Air Quality Chart" class="chart-image" />
            </div>

            ${analysis && aiReport ? `
              <div class="section">
                <h2>🤖 AI Analysis Report</h2>
                <div class="content">${aiReport}</div>
              </div>

              ${analysis.insights && analysis.insights.length > 0 ? `
                <div class="section">
                  <h2>💡 Key Insights</h2>
                  <ul>
                    ${analysis.insights.map(insight => `<li>${insight}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              ${analysis.recommendations && analysis.recommendations.length > 0 ? `
                <div class="section">
                  <h2>📋 Recommendations</h2>
                  <ul>
                    ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            ` : ''}

            <div class="section">
              <h2>📊 Data Summary</h2>
              <div class="data-summary">
                ${chartData.map(cityData => {
                  const values = cityData.values.map(v => v.value);
                  const avg = values.reduce((a, b) => a + b, 0) / values.length;
                  const max = Math.max(...values);
                  const min = Math.min(...values);
                  
                  return `
                    <div class="city-data">
                      <div class="city-name">${cityData.city}</div>
                      <div class="city-stats">
                        <div>Average: ${avg.toFixed(2)}</div>
                        <div>Maximum: ${max}</div>
                        <div>Minimum: ${min}</div>
                        <div>Data Points: ${values.length}</div>
                        <div>Latest: ${values[values.length - 1] || 'N/A'}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <div class="footer">
              <p>Report generated by EcoFresh AI Analytics System</p>
              <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Focus on the new window
      printWindow.focus();
      
      console.log('HTML report window opened successfully');
    } catch (error) {
      console.error('Error exporting comprehensive PDF:', error);
      throw new Error('Failed to export comprehensive PDF');
    }
  }

  // Export all formats
  async exportAll(
    data: ExportData,
    chartElementId: string,
    baseFilename?: string
  ): Promise<void> {
    const timestamp = Date.now();
    const filename = baseFilename || `ecofresh-export-${timestamp}`;
    
    try {
      // Export PNG
      await this.exportChartAsPNG(chartElementId, `${filename}-chart.png`);
      
      // Export CSV
      this.exportDataAsCSV(data, `${filename}-data.csv`);
      
      // Export PDF (if analysis available)
      if (data.analysis || data.aiReport) {
        await this.exportComprehensivePDF(data, chartElementId);
      }
      
      console.log('All exports completed successfully');
    } catch (error) {
      console.error('Error in batch export:', error);
      throw error;
    }
  }
}

export const exportService = new ExportService();
export type { ExportData };
