import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  // Helper method to convert SVG to PNG directly
  private async svgToPng(svgElement: SVGElement): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        console.log('Converting SVG to PNG...');
        
        // Get SVG dimensions
        const svgRect = svgElement.getBoundingClientRect();
        const svgWidth = svgRect.width || 800;
        const svgHeight = svgRect.height || 400;
        
        console.log('SVG dimensions for conversion:', svgWidth, 'x', svgHeight);
        
        const svgData = new XMLSerializer().serializeToString(svgElement);
        console.log('SVG data length:', svgData.length);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get 2D canvas context'));
          return;
        }
        
        // Set canvas size
        canvas.width = svgWidth;
        canvas.height = svgHeight;
        
        const img = new Image();
        
        // Create a proper SVG blob with namespace
        const svgWithNamespace = svgData.includes('xmlns') 
          ? svgData 
          : svgData.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
          
        const svgBlob = new Blob([svgWithNamespace], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        const timeout = setTimeout(() => {
          URL.revokeObjectURL(url);
          reject(new Error('SVG conversion timeout'));
        }, 10000); // 10 second timeout
        
        img.onload = () => {
          clearTimeout(timeout);
          try {
            // Fill background
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw SVG
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            
            console.log('SVG to PNG conversion successful');
            resolve(canvas.toDataURL('image/png'));
          } catch (drawError) {
            URL.revokeObjectURL(url);
            reject(new Error(`Failed to draw SVG: ${drawError instanceof Error ? drawError.message : 'Unknown draw error'}`));
          }
        };
        
        img.onerror = (errorEvent) => {
          clearTimeout(timeout);
          URL.revokeObjectURL(url);
          console.error('SVG image load error:', errorEvent);
          reject(new Error('Failed to load SVG as image'));
        };
        
        img.src = url;
        
      } catch (error) {
        console.error('SVG conversion setup error:', error);
        reject(new Error(`SVG conversion failed: ${error instanceof Error ? error.message : 'Unknown setup error'}`));
      }
    });
  }

  // Export chart as PNG
  async exportChartAsPNG(chartElementId: string, filename?: string): Promise<void> {
    console.log('=== Starting PNG Export ===');
    
    try {
      // Step 1: Find and validate chart element
      const chartElement = document.getElementById(chartElementId);
      if (!chartElement) {
        throw new Error('Chart element not found. Make sure the chart is rendered before exporting.');
      }

      console.log('Chart element found:', chartElement);
      console.log('Chart element dimensions:', chartElement.offsetWidth, 'x', chartElement.offsetHeight);
      console.log('Chart element visible:', chartElement.offsetParent !== null);
      console.log('Chart element style:', window.getComputedStyle(chartElement).display);
      
      // Ensure the element is visible and has content
      if (chartElement.offsetWidth === 0 || chartElement.offsetHeight === 0) {
        throw new Error('Chart element has no dimensions. Make sure the chart is visible and rendered.');
      }

      // Step 2: Try simple screenshot first (most reliable)
      console.log('Attempting simple chart capture...');
      try {
        const simpleCanvas = await html2canvas(chartElement, {
          backgroundColor: '#1a1a1a',
          scale: 1,
          logging: false,
          useCORS: true,
          allowTaint: true
        });

        if (simpleCanvas.width > 0 && simpleCanvas.height > 0) {
          console.log('Simple capture successful:', simpleCanvas.width, 'x', simpleCanvas.height);
          
          // Download the image
          const link = document.createElement('a');
          link.download = filename || `ecofresh-chart-${Date.now()}.png`;
          link.href = simpleCanvas.toDataURL('image/png');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          console.log('PNG export completed successfully with simple method');
          return;
        }
      } catch (simpleError) {
        console.warn('Simple capture failed:', simpleError);
      }

      // Step 3: Wait for rendering and try advanced capture
      console.log('Waiting for chart rendering...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Find chart content
      const svgElement = chartElement.querySelector('svg');
      const canvasElement = chartElement.querySelector('canvas');
      
      console.log('SVG found:', !!svgElement);
      console.log('Canvas found:', !!canvasElement);
      
      // Step 4: Try SVG direct conversion if available
      if (svgElement) {
        console.log('Attempting SVG direct conversion...');
        try {
          const svgDataUrl = await this.svgToPng(svgElement);
          
          // Download the SVG conversion
          const link = document.createElement('a');
          link.download = filename || `ecofresh-chart-${Date.now()}.png`;
          link.href = svgDataUrl;
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          console.log('SVG direct conversion completed successfully');
          return;
        } catch (svgError) {
          console.warn('SVG conversion failed:', svgError);
        }
      }

      // Step 5: Advanced html2canvas with specific settings
      console.log('Attempting advanced html2canvas capture...');
      const targetElement = svgElement || canvasElement || chartElement;
      
      // Ensure targetElement is HTMLElement for html2canvas
      if (!(targetElement instanceof HTMLElement)) {
        throw new Error('Target element is not an HTMLElement');
      }
      
      const canvas = await html2canvas(targetElement, {
        backgroundColor: '#1a1a1a',
        scale: 1,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        logging: false,
        width: targetElement.offsetWidth || chartElement.offsetWidth,
        height: targetElement.offsetHeight || chartElement.offsetHeight
      });

      console.log('Advanced canvas captured:', canvas.width, 'x', canvas.height);

      // Download the image
      const link = document.createElement('a');
      link.download = filename || `ecofresh-chart-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('PNG export completed successfully with advanced method');
      
    } catch (error) {
      // Step 6: Emergency fallback - create a simple image with text
      console.warn('All capture methods failed, creating fallback image...');
      try {
        const fallbackCanvas = document.createElement('canvas');
        const ctx = fallbackCanvas.getContext('2d');
        
        if (ctx) {
          fallbackCanvas.width = 800;
          fallbackCanvas.height = 400;
          
          // Fill background
          ctx.fillStyle = '#1a1a1a';
          ctx.fillRect(0, 0, 800, 400);
          
          // Add text
          ctx.fillStyle = '#ffffff';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('EcoFresh Chart Export', 400, 150);
          ctx.font = '16px Arial';
          ctx.fillText('Chart visualization could not be captured', 400, 200);
          ctx.fillText('Please try again or check console for details', 400, 230);
          ctx.fillText(new Date().toLocaleString(), 400, 280);
          
          // Download the fallback image
          const link = document.createElement('a');
          link.download = filename || `ecofresh-chart-fallback-${Date.now()}.png`;
          link.href = fallbackCanvas.toDataURL('image/png');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          console.log('Fallback image created and downloaded');
          return;
        }
      } catch (fallbackError) {
        console.error('Even fallback method failed:', fallbackError);
      }
      console.error('=== PNG Export Error ===');
      console.error('Error details:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        errorMessage = JSON.stringify(error);
      }
      
      throw new Error(`PNG export failed: ${errorMessage}`);
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

  // Export comprehensive PDF with AI report only (direct download)
  async exportComprehensivePDF(
    data: ExportData, 
    chartElementId: string, 
    filename?: string
  ): Promise<void> {
    try {
      const { chartData, chartType, metric, cities, timeRange, analysis, aiReport } = data;
      
      console.log('Generating PDF report with chart');

      // Step 1: Capture chart image first
      let chartImageData: string | null = null;
      try {
        console.log('Capturing chart for PDF...');
        const chartElement = document.getElementById(chartElementId);
        
        if (chartElement) {
          // Wait for chart to be fully rendered
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Try simple capture first
          try {
            const canvas = await html2canvas(chartElement, {
              backgroundColor: '#1a1a1a',
              scale: 1,
              useCORS: true,
              allowTaint: true,
              logging: false
            });
            
            if (canvas.width > 0 && canvas.height > 0) {
              chartImageData = canvas.toDataURL('image/jpeg', 0.8);
              console.log('Chart captured for PDF successfully');
            }
          } catch (captureError) {
            console.warn('Chart capture failed, trying SVG method:', captureError);
            
            // Try SVG conversion as fallback
            const svgElement = chartElement.querySelector('svg');
            if (svgElement) {
              try {
                chartImageData = await this.svgToPng(svgElement);
                console.log('Chart captured via SVG conversion for PDF');
              } catch (svgError) {
                console.warn('SVG conversion also failed:', svgError);
              }
            }
          }
        }
      } catch (error) {
        console.warn('Chart capture failed, continuing without chart:', error);
      }

      // Step 2: Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      
      let yPosition = margin;

      // Add header
      pdf.setFillColor(6, 182, 212); // Cyan color
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('EcoFresh', margin, 22);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('AI-Powered Air Quality Analysis Report', margin, 30);
      
      // Add a decorative element
      pdf.setFillColor(255, 255, 255);
      pdf.circle(pageWidth - 25, 17.5, 8, 'F');
      pdf.setTextColor(6, 182, 212);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AQ', pageWidth - 28, 21);
      
      yPosition = 55;

      // Add metadata section
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Report Configuration', margin, yPosition);
      
      // Add a line under the title
      pdf.setDrawColor(6, 182, 212);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition + 2, margin + 80, yPosition + 2);
      yPosition += 12;
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const metadata = [
        `Generated: ${new Date().toLocaleString()}`,
        `Chart Type: ${chartType}`,
        `Metric: ${metric}`,
        `Cities: ${cities.join(', ')}`,
        `Time Range: ${timeRange}`,
        `Data Points: ${chartData.reduce((total, city) => total + city.values.length, 0)}`
      ];
      
      metadata.forEach(item => {
        pdf.text(item, margin + 5, yPosition);
        yPosition += 6;
      });
      
      yPosition += 10;

      // Add chart section if image was captured
      if (chartImageData) {
        // Check if we need a new page for the chart
        if (yPosition > pageHeight - 150) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Air Quality Chart', margin, yPosition);
        
        // Add a line under the title
        pdf.setDrawColor(6, 182, 212);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition + 2, margin + 60, yPosition + 2);
        yPosition += 12;
        
        try {
          // Calculate chart dimensions to fit the page
          const maxChartWidth = contentWidth;
          const maxChartHeight = 100; // Limit chart height
          
          // Create a temporary image to get dimensions
          const tempImg = new Image();
          await new Promise((resolve, reject) => {
            tempImg.onload = resolve;
            tempImg.onerror = reject;
            tempImg.src = chartImageData!;
          });
          
          let chartWidth = maxChartWidth;
          let chartHeight = (tempImg.height * chartWidth) / tempImg.width;
          
          // Scale down if too tall
          if (chartHeight > maxChartHeight) {
            chartHeight = maxChartHeight;
            chartWidth = (tempImg.width * chartHeight) / tempImg.height;
          }
          
          // Add border around chart
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(0.2);
          pdf.rect(margin - 1, yPosition - 1, chartWidth + 2, chartHeight + 2);
          
          // Add the chart image
          pdf.addImage(chartImageData, 'JPEG', margin, yPosition, chartWidth, chartHeight);
          console.log('Chart image added to PDF successfully');
          
          yPosition += chartHeight + 15;
          
        } catch (imageError) {
          console.error('Error adding chart image to PDF:', imageError);
          // Add placeholder text instead
          pdf.setFillColor(240, 240, 240);
          pdf.rect(margin, yPosition, contentWidth, 80, 'F');
          pdf.setTextColor(100, 100, 100);
          pdf.setFontSize(12);
          pdf.text('Chart image could not be rendered in PDF', pageWidth / 2, yPosition + 40, { align: 'center' });
          pdf.setTextColor(0, 0, 0);
          yPosition += 90;
        }
      }

      // Add AI analysis if available
      if (analysis && aiReport) {
        // Check if we need a new page
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('AI Analysis Report', margin, yPosition);
        
        // Add a line under the title
        pdf.setDrawColor(6, 182, 212);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition + 2, margin + 70, yPosition + 2);
        yPosition += 12;
        
        // Split report into lines that fit the page width
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const lines = pdf.splitTextToSize(aiReport, contentWidth);
        
        lines.forEach((line: string) => {
          if (yPosition > pageHeight - margin - 10) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        });
        
        yPosition += 10;

        // Add insights if available
        if (analysis.insights && analysis.insights.length > 0) {
          if (yPosition > pageHeight - 50) {
            pdf.addPage();
            yPosition = margin;
          }
          
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Key Insights', margin, yPosition);
          
          // Add a line under the title
          pdf.setDrawColor(6, 182, 212);
          pdf.setLineWidth(0.3);
          pdf.line(margin, yPosition + 2, margin + 50, yPosition + 2);
          yPosition += 10;
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          analysis.insights.forEach(insight => {
            if (yPosition > pageHeight - margin - 10) {
              pdf.addPage();
              yPosition = margin;
            }
            const insightLines = pdf.splitTextToSize(`• ${insight}`, contentWidth - 10);
            insightLines.forEach((line: string) => {
              pdf.text(line, margin + 5, yPosition);
              yPosition += 5;
            });
            yPosition += 2;
          });
        }

        // Add recommendations if available
        if (analysis.recommendations && analysis.recommendations.length > 0) {
          yPosition += 5;
          if (yPosition > pageHeight - 50) {
            pdf.addPage();
            yPosition = margin;
          }
          
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Recommendations', margin, yPosition);
          
          // Add a line under the title
          pdf.setDrawColor(6, 182, 212);
          pdf.setLineWidth(0.3);
          pdf.line(margin, yPosition + 2, margin + 60, yPosition + 2);
          yPosition += 10;
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          analysis.recommendations.forEach(rec => {
            if (yPosition > pageHeight - margin - 10) {
              pdf.addPage();
              yPosition = margin;
            }
            const recLines = pdf.splitTextToSize(`• ${rec}`, contentWidth - 10);
            recLines.forEach((line: string) => {
              pdf.text(line, margin + 5, yPosition);
              yPosition += 5;
            });
            yPosition += 2;
          });
        }
      }

      // Add data summary
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Data Summary', margin, yPosition);
      
      // Add a line under the title
      pdf.setDrawColor(6, 182, 212);
      pdf.setLineWidth(0.3);
      pdf.line(margin, yPosition + 2, margin + 50, yPosition + 2);
      yPosition += 12;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      chartData.forEach(cityData => {
        if (yPosition > pageHeight - margin - 15) {
          pdf.addPage();
          yPosition = margin;
        }
        
        const values = cityData.values.map(v => v.value);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);
        
        pdf.setFont('helvetica', 'bold');
        pdf.text(cityData.city, margin, yPosition);
        yPosition += 5;
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Average: ${avg.toFixed(2)} | Maximum: ${max} | Minimum: ${min}`, margin + 5, yPosition);
        yPosition += 5;
        pdf.text(`Data Points: ${values.length} | Latest: ${values[values.length - 1] || 'N/A'}`, margin + 5, yPosition);
        yPosition += 8;
      });

      // Add footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(128, 128, 128);
        pdf.text(
          `EcoFresh AI Analytics System - Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Save PDF
      pdf.save(filename || `ecofresh-ai-report-${Date.now()}.pdf`);
      
      console.log('PDF report downloaded successfully');
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
      
      // Export PDF Report (if analysis available)
      if (data.analysis || data.aiReport) {
        await this.exportComprehensivePDF(data, chartElementId, `${filename}-report.pdf`);
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
