import type { CityChartData } from '../types/analytics';

const GEMINI_API_KEY = 'AIzaSyBRGy3fZNq0ENZ6fyVDpfVHLrNOeCm3iG0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

interface AnalysisResponse {
  report: string;
  anomalies: AnomalyDetection[];
  insights: string[];
  recommendations: string[];
}

interface AnomalyDetection {
  city: string;
  type: 'spike' | 'drop' | 'pattern' | 'threshold';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  value: number;
  confidence: number;
}

interface ChartAnalysisData {
  chartType: string;
  metric: string;
  cities: string[];
  timeRange: string;
  data: CityChartData[];
}

class GeminiAIService {
  private async callGeminiAPI(prompt: string): Promise<string> {
    try {
      console.log('Calling Gemini API with prompt length:', prompt.length);
      
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini API response received successfully');
      
      const result = data.candidates[0]?.content?.parts[0]?.text;
      if (!result) {
        console.error('No content in Gemini API response:', data);
        throw new Error('No response generated from Gemini API');
      }
      
      return result;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate AI analysis');
    }
  }

  async analyzeChart(chartData: ChartAnalysisData): Promise<AnalysisResponse> {
    const prompt = this.buildAnalysisPrompt(chartData);
    const response = await this.callGeminiAPI(prompt);
    
    return this.parseAnalysisResponse(response);
  }

  async detectAnomalies(chartData: ChartAnalysisData): Promise<AnomalyDetection[]> {
    const prompt = this.buildAnomalyDetectionPrompt(chartData);
    const response = await this.callGeminiAPI(prompt);
    
    return this.parseAnomalyResponse(response);
  }

  async generatePresetAnalysis(presetType: string, chartData: ChartAnalysisData): Promise<string> {
    // Validate input data
    if (!chartData || !chartData.data || chartData.data.length === 0) {
      throw new Error('No chart data provided for analysis');
    }
    
    if (!chartData.cities || chartData.cities.length === 0) {
      throw new Error('No cities selected for analysis');
    }
    
    console.log('Generating preset analysis for:', presetType, 'with', chartData.data.length, 'city datasets');
    
    const prompt = this.buildPresetPrompt(presetType, chartData);
    return await this.callGeminiAPI(prompt);
  }

  private buildAnalysisPrompt(chartData: ChartAnalysisData): string {
    const { chartType, metric, cities, timeRange, data } = chartData;
    
    const dataAnalysis = data.map(cityData => {
      const values = cityData.values.map(v => v.value);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);
      
      return `${cityData.city}: Average ${avg.toFixed(2)}, Max ${max}, Min ${min}, Data points: ${values.join(', ')}`;
    }).join('\n');

    return `
You are an expert air quality analyst. Analyze this ${chartType} chart showing ${metric} data for ${cities.length} cities over ${timeRange}.

Chart Configuration:
- Chart Type: ${chartType}
- Metric: ${metric}
- Cities: ${cities.join(', ')}
- Time Range: ${timeRange}

Data Analysis:
${dataAnalysis}

Please provide a comprehensive analysis including:

1. **Overall Summary**: General overview of air quality patterns across all cities
2. **Individual City Analysis**: Detailed analysis for each city separately, including:
   - Current air quality status
   - Trends and patterns observed
   - Notable spikes or improvements
   - Health implications
3. **Comparative Analysis**: How cities compare to each other
4. **Health Recommendations**: Specific advice based on the data
5. **Environmental Factors**: Possible causes for observed patterns
6. **Data Quality Assessment**: Reliability and completeness of the data

Format the response in clear sections with headers. Be specific about numbers and trends. If any city shows concerning patterns, highlight them prominently.

Use professional but accessible language suitable for both experts and general public.
`;
  }

  private buildAnomalyDetectionPrompt(chartData: ChartAnalysisData): string {
    const { data } = chartData;
    
    const dataString = data.map(cityData => {
      return `${cityData.city}: ${cityData.values.map(v => `${v.time}:${v.value}`).join(', ')}`;
    }).join('\n');

    return `
You are an expert environmental data scientist specializing in anomaly detection for air quality data.

Analyze the following air quality data for unusual patterns, anomalies, and early warning signs:

${dataString}

Identify and return ONLY a JSON array of anomalies in this exact format:
[
  {
    "city": "City Name",
    "type": "spike|drop|pattern|threshold",
    "severity": "low|medium|high|critical",
    "description": "Brief description of the anomaly",
    "timestamp": "Time when anomaly occurred",
    "value": numerical_value,
    "confidence": 0.0-1.0
  }
]

Detection Criteria:
- Spike: Sudden increase >50% from average
- Drop: Sudden decrease >40% from average  
- Pattern: Unusual recurring patterns
- Threshold: Values exceeding safe limits (AQI >150)

Severity Levels:
- Low: Minor variations within normal range
- Medium: Noticeable deviations requiring attention
- High: Significant deviations with health implications
- Critical: Dangerous levels requiring immediate action

Return ONLY the JSON array, no additional text.
`;
  }

  private buildPresetPrompt(presetType: string, chartData: ChartAnalysisData): string {
    const { chartType, metric, cities, timeRange, data } = chartData;
    
    // Include actual data analysis in the prompt
    const dataAnalysis = data.map(cityData => {
      const values = cityData.values.map(v => v.value);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);
      
      return `${cityData.city}: Average ${avg.toFixed(2)}, Max ${max}, Min ${min}, Recent values: ${values.slice(-5).join(', ')}`;
    }).join('\n');
    
    const baseData = `Chart Type: ${chartType}
Metric: ${metric}
Cities: ${cities.join(', ')}
Time Range: ${timeRange}

Data Summary:
${dataAnalysis}`;
    
    const prompts = {
      'health-impact': `${baseData}\n\nProvide a detailed health impact assessment based on this air quality data. Focus on health recommendations for vulnerable populations, outdoor activity guidance, and preventive measures. Use the actual data values to provide specific recommendations.`,
      
      'trend-analysis': `${baseData}\n\nAnalyze the trends in this air quality data. Identify improving or deteriorating conditions, seasonal patterns, and predict future trends based on current data. Reference the specific values shown above.`,
      
      'pollution-sources': `${baseData}\n\nAnalyze potential pollution sources that could be causing these air quality patterns. Consider industrial activity, traffic, weather patterns, and seasonal factors. Use the data values to support your analysis.`,
      
      'comparison-report': `${baseData}\n\nProvide a detailed comparison between all cities in the dataset. Rank them by air quality, identify best and worst performers, and explain the differences based on the actual data values shown.`,
      
      'emergency-assessment': `${baseData}\n\nAssess if there are any emergency conditions or critical air quality events in this data that require immediate attention or public health warnings. Base your assessment on the actual data values.`,
      
      'environmental-correlation': `${baseData}\n\nAnalyze how environmental factors (weather, geography, urban planning) might be influencing these air quality patterns. Reference the specific data patterns shown above.`
    };

    return prompts[presetType as keyof typeof prompts] || prompts['health-impact'];
  }

  private parseAnalysisResponse(response: string): AnalysisResponse {
    // Extract insights and recommendations from the response
    const insights = this.extractInsights(response);
    const recommendations = this.extractRecommendations(response);
    
    return {
      report: response,
      anomalies: [], // Will be populated separately by detectAnomalies
      insights,
      recommendations
    };
  }

  private parseAnomalyResponse(response: string): AnomalyDetection[] {
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn('No JSON found in anomaly response');
        return [];
      }
      
      const anomalies = JSON.parse(jsonMatch[0]);
      return Array.isArray(anomalies) ? anomalies : [];
    } catch (error) {
      console.error('Error parsing anomaly response:', error);
      return [];
    }
  }

  private extractInsights(text: string): string[] {
    const insights: string[] = [];
    const lines = text.split('\n');
    
    let inInsightSection = false;
    for (const line of lines) {
      if (line.toLowerCase().includes('insight') || line.toLowerCase().includes('key finding')) {
        inInsightSection = true;
        continue;
      }
      
      if (inInsightSection && line.startsWith('- ')) {
        insights.push(line.substring(2));
      } else if (inInsightSection && line.trim() === '') {
        break;
      }
    }
    
    // If no explicit insights section, extract bullet points from the whole text
    if (insights.length === 0) {
      const bulletPoints = text.match(/^- .+$/gm);
      if (bulletPoints) {
        insights.push(...bulletPoints.map(bp => bp.substring(2)));
      }
    }
    
    return insights.slice(0, 5); // Limit to 5 key insights
  }

  private extractRecommendations(text: string): string[] {
    const recommendations: string[] = [];
    const lines = text.split('\n');
    
    let inRecommendationSection = false;
    for (const line of lines) {
      if (line.toLowerCase().includes('recommendation') || line.toLowerCase().includes('advice')) {
        inRecommendationSection = true;
        continue;
      }
      
      if (inRecommendationSection && line.startsWith('- ')) {
        recommendations.push(line.substring(2));
      } else if (inRecommendationSection && line.trim() === '') {
        break;
      }
    }
    
    return recommendations.slice(0, 3); // Limit to 3 key recommendations
  }

  // Utility method to format analysis for download
  formatAnalysisForExport(analysis: AnalysisResponse, chartData: ChartAnalysisData): string {
    const timestamp = new Date().toLocaleString();
    
    return `
# EcoFresh Air Quality AI Analysis Report
Generated: ${timestamp}

## Chart Configuration
- Chart Type: ${chartData.chartType}
- Metric: ${chartData.metric}
- Cities: ${chartData.cities.join(', ')}
- Time Range: ${chartData.timeRange}

## AI Analysis Report
${analysis.report}

## Key Insights
${analysis.insights.map(insight => `• ${insight}`).join('\n')}

## Recommendations
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

## Anomaly Detection Summary
${analysis.anomalies.length > 0 ? 
  analysis.anomalies.map(anomaly => 
    `• ${anomaly.city}: ${anomaly.type} anomaly (${anomaly.severity} severity) - ${anomaly.description}`
  ).join('\n') : 
  '• No significant anomalies detected'
}

---
Report generated by EcoFresh AI Analytics System using Gemini AI
    `.trim();
  }
}

export const geminiAI = new GeminiAIService();
export type { AnalysisResponse, AnomalyDetection, ChartAnalysisData };