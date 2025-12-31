# Multi-API Air Quality Integration - EcoFresh Dashboard

## 🌐 Multi-Source API Integration Overview

The EcoFresh Air Quality Dashboard now integrates **multiple APIs** to provide comprehensive global air quality data with enhanced reliability and coverage.

### 🔑 API Configurations

#### 1. OpenWeatherMap API (Primary)
- **API Key**: `741081f2196356e85d5138db13c2f41c`
- **Base URL**: `http://api.openweathermap.org/data/2.5`

- **Geocoding URL**: `http://api.openweathermap.org/geo/1.0`
- **Coverage**: Global
- **Strength**: Reliable, consistent data format

<!-- #### 2. World Air Quality Index (WAQI) API (Secondary)
- **API Key**: `[YOUR_WAQI_TOKEN]` (Register at https://aqicn.org/data-platform/token/)
- **Base URL**: `https://api.waqi.info`
- **Coverage**: 10,000+ stations worldwide
- **Strength**: Extensive global coverage, real-time updates -->

#### 2. OpenAQ API (Secondary) ✅ INTEGRATED
- **API Key**: `7f431ee595f5d727bed0ce6d1fc6d411b651d50ac4883419dcb70768685f03fa`
- **Base URL**: `https://api.openaq.org/v3`
- **Coverage**: Global open data from government sources
- **Authentication**: API Key required
- **Strength**: Open source, government data aggregation, excellent global coverage

## 🌍 Expanded City Coverage

### Current Cities (14 cities across 4 regions): ✅ IMPLEMENTED

#### North America
- New York City, NY, USA ✅
- Los Angeles, CA, USA ✅  
- Seattle, WA, USA ✅
- Miami, FL, USA ✅
- Toronto, ON, Canada ✅
- Mexico City, Mexico ✅

#### Europe
- London, UK ✅
- Paris, France ✅
- Berlin, Germany ✅
- Rome, Italy ✅

#### Asia-Pacific
- Tokyo, Japan ✅
- Beijing, China ✅
- New Delhi, India ✅
- Sydney, Australia ✅

## 📡 Multi-API Endpoints

### OpenWeatherMap API (Primary)
1. **Geocoding API**
```
GET http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit=1&appid={API_key}
```

2. **Current Air Pollution API**
```
GET http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_key}
```

3. **Historical Air Pollution API**
```
GET http://api.openweathermap.org/data/2.5/air_pollution/history?lat={lat}&lon={lon}&start={start}&end={end}&appid={API_key}
```

### OpenAQ API (Secondary/Fallback)
1. **Locations API**
```
GET https://api.openaq.org/v3/locations?city={city}&country={country}&limit=10
Headers: X-API-Key: {API_key}
```

2. **Measurements API**
```
GET https://api.openaq.org/v3/measurements?location_id={location_id}&limit=100&order_by=datetime&sort=desc
Headers: X-API-Key: {API_key}
```

## 🔄 Enhanced Data Flow with Multi-API Support

1. **App Initialization**
   - `useAirQuality` hook loads on mount
   - Fetches data from multiple APIs simultaneously
   - Uses OpenWeatherMap as primary, OpenAQ as fallback

2. **Multi-API Data Processing**
   - Tries OpenWeatherMap first (more reliable format)
   - Falls back to OpenAQ if OpenWeatherMap fails
   - Merges and normalizes data from different sources
   - Converts different AQI scales to US EPA standard

3. **Resilient Data Strategy**
   - **Primary**: OpenWeatherMap (reliable, consistent)
   - **Fallback**: OpenAQ (broader coverage, government data)
   - **Graceful degradation**: Shows data from any available source
   - **Error handling**: Individual city failures don't break entire app

4. **Enhanced Historical Data**
   - OpenWeatherMap provides 24-hour historical data
   - OpenAQ can provide longer historical trends
   - Charts update with the best available data source

## 🎯 Real-Time Features

### ✅ Live Data Display
- **Stats Cards**: Show real AQI values, pollutant levels, and status
- **Color-coded Status**: Excellent, Good, Moderate, Poor, Very Poor
- **Real Coordinates**: Uses actual city coordinates from geocoding

### ✅ Interactive Charts
- **Trend Chart**: 12-hour historical AQI data
- **Pollutant Breakdown**: Real PM2.5, PM10, O₃ concentrations
- **Dynamic Updates**: Charts update with fresh data

### ✅ Smart Map Markers
- **Live Positioning**: Markers show real city data
- **Status Colors**: Green (Good), Orange (Moderate), Red (Poor)
- **Hover Tooltips**: Display AQI values and status
- **Click Interactions**: Show detailed city information

### ✅ Dynamic Alerts
- **Real-time Alerts**: Based on actual air quality conditions
- **Pollution Warnings**: Triggered by poor air quality
- **API Status**: Shows connection to live data source

## ⚡ Performance Features

### Loading States
- **Skeleton screens** while fetching data
- **Spinner animations** on refresh
- **Progressive loading** of components

### Error Handling
- **Network error recovery**
- **Retry mechanisms**
- **Fallback data** when API is unavailable
- **User-friendly error messages**

### Caching Strategy
- **Single API call** per city on load
- **Shared data** across all components using custom hook
- **Efficient re-renders** with React state management

## 🎨 Visual Enhancements

### Status Color Mapping
```javascript
AQI 1 (Excellent) → Green (#10b981)
AQI 2 (Good)      → Light Green (#22c55e)
AQI 3 (Moderate)  → Orange (#f97316)
AQI 4 (Poor)      → Red (#ef4444)
AQI 5 (Very Poor) → Dark Red (#dc2626)
```

### Real-time Indicators
- **Live data badges** on cards
- **"Real-time" timestamps** in alerts
- **Connection status** indicators
- **Data freshness** indicators

## 🛠️ Technical Implementation

### Custom Hook (`useAirQuality`)
- **Centralized state management**
- **API call orchestration**
- **Error handling**
- **Loading state management**

### Type Safety
- **TypeScript interfaces** for API responses
- **Proper error typing**
- **Component prop validation**

### API Rate Limiting
- **Efficient batching** of requests
- **Single calls per city**
- **Reasonable refresh intervals**

## 🚀 Usage

The API integration is automatic and requires no additional configuration. Users can:

1. **View live data** immediately on page load
2. **Refresh data** using the header button
3. **See loading states** during data fetches
4. **Handle errors** with retry options
5. **Interact with real data** on maps and charts

## 📊 Data Accuracy

- **Real-time updates** from OpenWeatherMap
- **Accurate coordinates** from geocoding API
- **Professional-grade data** used by weather services worldwide
- **Consistent with WHO standards**

The integration transforms the dashboard from a static demo into a **fully functional air quality monitoring system** with live, accurate data from a trusted meteorological source.