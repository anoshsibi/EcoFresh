import React, { useState } from 'react';
import { exportService } from '../services/exportService';
import type { ExportData } from '../services/exportService';

interface EnhancedExportPanelProps {
  data: ExportData;
  chartElementId: string;
  isVisible: boolean;
  className?: string;
}

const EnhancedExportPanel: React.FC<EnhancedExportPanelProps> = ({
  data,
  chartElementId,
  isVisible,
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState<string>('');

  const handleExportPNG = async () => {
    setIsExporting('png');
    setExportProgress('Finding chart element...');
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setExportProgress('Analyzing chart structure...');
      await new Promise(resolve => setTimeout(resolve, 300));
      setExportProgress('Capturing chart visualization...');
      
      await exportService.exportChartAsPNG(chartElementId);
      setExportProgress('Chart image exported successfully!');
      setTimeout(() => setExportProgress(''), 2000);
    } catch (error) {
      console.error('PNG export error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setExportProgress(`PNG export failed: ${errorMessage}`);
      setTimeout(() => setExportProgress(''), 4000);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportCSV = () => {
    setIsExporting('csv');
    setExportProgress('Preparing data...');
    try {
      exportService.exportDataAsCSV(data);
      setExportProgress('Data exported as CSV successfully!');
      setTimeout(() => setExportProgress(''), 2000);
    } catch (error) {
      setExportProgress('Failed to export data as CSV');
      setTimeout(() => setExportProgress(''), 3000);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting('pdf');
    setExportProgress('Preparing AI report...');
    try {
      // Add progress updates
      await new Promise(resolve => setTimeout(resolve, 300));
      setExportProgress('Capturing chart image...');
      await new Promise(resolve => setTimeout(resolve, 500));
      setExportProgress('Generating PDF with chart...');
      
      await exportService.exportComprehensivePDF(data, chartElementId);
      setExportProgress('PDF report with chart downloaded successfully!');
      setTimeout(() => setExportProgress(''), 2000);
    } catch (error) {
      console.error('PDF export error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setExportProgress(`Failed to export PDF: ${errorMessage}`);
      setTimeout(() => setExportProgress(''), 4000);
    } finally {
      setIsExporting(null);
    }
  };



  const hasData = data.chartData && data.chartData.length > 0;
  const hasAnalysis = data.analysis || data.aiReport;

  if (!isVisible || !hasData) {
    return null;
  }

  return (
    <div className={`bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <span className="text-xl">📊</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Export Options</h3>
          <p className="text-gray-400 text-sm">Download your analysis in multiple formats</p>
        </div>
      </div>

      {exportProgress && (
        <div className="mb-4 p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
          <p className="text-blue-300 text-sm flex items-center gap-2">
            {isExporting && (
              <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
            )}
            {exportProgress}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
        {/* PNG Export */}
        <button
          onClick={handleExportPNG}
          disabled={isExporting === 'png'}
          className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl p-4 transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🖼️</span>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-lg">Chart Image</h4>
              <p className="text-purple-100 text-sm">High-resolution PNG</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        </button>

        {/* CSV Export */}
        <button
          onClick={handleExportCSV}
          disabled={isExporting === 'csv'}
          className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl p-4 transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-lg">Raw Data</h4>
              <p className="text-green-100 text-sm">Structured CSV format</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        </button>

        {/* Text Report Export - Only show if analysis is available */}
        {hasAnalysis && (
          <button
            onClick={handleExportPDF}
            disabled={isExporting === 'pdf'}
            className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl p-4 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-lg">AI Report</h4>
                <p className="text-red-100 text-sm">PDF with chart & AI analysis</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        )}


      </div>

      {/* Export Details */}
      <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Export Details</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
          <div>Cities: {data.cities.length}</div>
          <div>Data Points: {data.chartData.reduce((total, city) => total + city.values.length, 0)}</div>
          <div>Chart Type: {data.chartType}</div>
          <div>Metric: {data.metric}</div>
          <div>Time Range: {data.timeRange}</div>
          <div>AI Analysis: {hasAnalysis ? 'Available' : 'Not available'}</div>
        </div>
      </div>

      {!hasAnalysis && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
          <p className="text-yellow-400 text-sm">
            💡 Generate an AI analysis to unlock PDF report export with comprehensive insights
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedExportPanel;
