/*
 * Battery Estimation System (BES) – Chrome Extension
 * Copyright (C) 2025  SyvoltOrg.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
// Add this at the beginning of the script section
// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const vehicleId = urlParams.get('vehicleId');
const vehicleType = urlParams.get('vehicleType');
const manufacturer = urlParams.get('manufacturer');
const model = urlParams.get('model');
const battery = urlParams.get('battery');
const range = urlParams.get('range');
const batteryType = urlParams.get('batteryType');
const specIndex = urlParams.get('specIndex');
const soh = urlParams.get('soh');
const sohType = urlParams.get('sohType');
const sohValue = urlParams.get('sohValue');

// Display vehicle information
function displayVehicleInfo() {
  if (manufacturer && model) {
    // Basic vehicle info
    var el;
    el = document.getElementById('vehicleManufacturer');
    if (el) el.textContent = manufacturer;
    el = document.getElementById('vehicleModel');
    if (el) el.textContent = model;
    // Technical specifications
    const efficiency = urlParams.get('efficiency');
    const energyConsumption = urlParams.get('energyConsumption');
    const weight = urlParams.get('weight');
    // Debug log all URL parameters
    console.log('All URL Parameters:', {
      battery: battery,
      range: range,
      efficiency: efficiency,
      energyConsumption: energyConsumption,
      weight: weight,
      batteryType: batteryType,
      soh: soh
    });
    // Helper function to check and format units
    const formatWithUnit = (value, unit) => {
      if (!value) return 'N/A';
      // If value already contains the unit (case-insensitive), just return as is
      if (value.toLowerCase().includes(unit.toLowerCase())) return value.trim();
      // Otherwise, append the unit
      return value.trim() + ` ${unit}`;
    };
    el = document.getElementById('vehicleBattery');
    if (el) el.textContent = formatWithUnit(battery, 'kWh');
    el = document.getElementById('vehicleRange');
    if (el) el.textContent = formatWithUnit(range, 'km');
    el = document.getElementById('vehicleBatteryType');
    if (el) el.textContent = batteryType || 'N/A';
    el = document.getElementById('vehicleEfficiency');
    if (el) el.textContent = efficiency ? efficiency.replace('%', '') + '%' : 'N/A';
    el = document.getElementById('vehicleEnergyConsumption');
    if (el) el.textContent = formatWithUnit(energyConsumption, 'kWh/km');
    el = document.getElementById('vehicleWeight');
    if (el) el.textContent = formatWithUnit(weight, 'kg');
    // Display SoH with appropriate styling
    if (soh) {
      const sohValueNum = parseFloat(soh.replace('%', ''));
      el = document.getElementById('vehicleSoh');
      if (el) {
        el.textContent = soh + (sohType === 'range' && sohValue ? ` (${sohValue} km)` : '');
        el.style.color = sohValueNum >= 90 ? '#27ae60' : sohValueNum >= 75 ? '#f1c40f' : '#e74c3c';
      }
    }
  }
}

// Initialize the form with default values
function initForm() {
  displayVehicleInfo();
  var routeForm = document.getElementById('routeForm');
  if (routeForm) {
    routeForm.addEventListener('submit', function(event) {
      calculateRoute(event);
    });
  }
}



let savedLocations = JSON.parse(localStorage.getItem('savedLocations') || '[]');

// Helper: Debounce function to limit API calls
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Store the last calculated route
let lastRoute = null;
let lastTrafficData = null;
let lastElevationData = null;
let lastWeatherData = null;
let lastRoadConditions = null;

// Update summary in real-time (if route is already calculated)
function updateSummaryRealtime() {
  if (lastRoute && lastTrafficData && lastElevationData && lastWeatherData && lastRoadConditions) {
    displayResults(lastRoute, lastTrafficData, lastElevationData, lastWeatherData, lastRoadConditions);
  }
}

// --- CHARGING STATION LOGIC START ---

// Helper: Fetch charging stations using Google Maps Places API
async function fetchChargingStations(lat, lng, radiusMeters = 5000) { // default to 5km
  const OPENCHARGEMAP_API_KEY = 'feb43967-dd99-4776-8474-0e6cef3d1d98';
  const radiusKm = Math.max(5, Math.round(radiusMeters / 1000));
  const url = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lng}&distance=${radiusKm}&distanceunit=KM&maxresults=50&key=${OPENCHARGEMAP_API_KEY}`;
  const response = await fetch(url);
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    return data.map(station => {
      // ... your mapping logic ...
      let category = '⚠️ Unverified';
      // Guest-only keywords (case-insensitive, joined by | for regex)
      const guestKeywords = [
        'hotel','hotels','inn','residency','residence','stay','palace','lodge','guest house','guesthouse','homestay','bnb','retreat','resort','suites','hostel','villa',
        'taj','vivanta','jw marriott','marriott','welcomhotel','itc','sheraton','radisson','hyatt','ibis','lemon tree','oyo','fabhotel','fortune','southern star','goldfinch','kanishka','sheetal residency','signature inn','sairam residency','crn canary','om shakthi','hlv grand','golden metro','nalapad hotel','vividus hotel','37th crescent','bell hotel','sandesh kingston','fortuner palace','manpho bell','shankar residency','new golden residency','amshi','canary inn'
      ];
      const guestRegex = new RegExp(guestKeywords.map(k=>k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|'), 'i');
      // Public/verified keywords (case-insensitive, joined by | for regex)
      const publicKeywords = [
        'ather grid','bescom','tatapower','tata power','chargezone','zeon','relux','exicom','blusmart','bp pulse','statiq','fortum','magneta','magenta chargegrid','jio-bp','delta ev','evre','revolt','goe','chargeup','electricpe','e-fill','tves','ntpc','esl','okaya','numocity','plugngo','chargegrid','servotech','voltup','log9','sunfuel','charzer','ecocharge','elocity','pulse energy','snap e','recharge city','byd','govt of india','municipal corporation','power grid','state electricity board','public sector undertaking','energy efficiency services limited','bppl'
      ];
      const publicRegex = new RegExp(publicKeywords.map(k=>k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|'), 'i');
      const title = station.AddressInfo.Title || '';
      const address = station.AddressInfo.AddressLine1 || '';
      if (guestRegex.test(title) || guestRegex.test(address)) {
        category = '🏨 Guest-Only';
      } else if (
        (station.UsageType && station.UsageType.IsPublic) || publicRegex.test(title) || publicRegex.test(address)
      ) {
        category = '✅ Public';
      } else if (station.UsageType && station.UsageType.IsPrivateUse) {
        category = '🏨 Guest-Only';
      } else if (
        /showroom|dealer|motors|auto/i.test(title) ||
        /showroom|dealer|motors|auto/i.test(address)
      ) {
        category = '🏬 Showroom';
      }
      return {
        id: station.ID,
        name: station.AddressInfo.Title,
        vicinity: station.AddressInfo.AddressLine1 + (station.AddressInfo.Town ? ', ' + station.AddressInfo.Town : ''),
        geometry: {
          location: {
            lat: station.AddressInfo.Latitude,
            lng: station.AddressInfo.Longitude
          }
        },
        category
      };
    });
  } catch (e) {
    if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
      throw new Error('Open Charge Map API rate limit exceeded or service unavailable. Please try again later.');
    }
    throw new Error('Unexpected response from Open Charge Map API.');
  }
}

// Helper: Fetch charging stations along the route (sampled points)
async function fetchStationsAlongRoute(route, intervalMeters = 5000, maxPoints = 8) { // sample every 5km, max 8 points
  const polyline = route.overview_polyline && route.overview_polyline.points;
  if (!polyline) return [];
  const path = decodePolyline(polyline);
  // Sample points along the route every intervalMeters
  const sampled = [path[0]];
  let last = path[0];
  let dist = 0;
  for (let i = 1; i < path.length && sampled.length < maxPoints; i++) {
    const dx = (path[i].lat - last.lat) * 111320; // rough meters per degree latitude
    const dy = (path[i].lng - last.lng) * 40075000 * Math.cos(path[i].lat * Math.PI / 180) / 360;
    dist += Math.sqrt(dx*dx + dy*dy);
    if (dist >= intervalMeters) {
      sampled.push(path[i]);
      last = path[i];
      dist = 0;
    }
  }
  // Fetch stations for each sampled point (in parallel)
  const allStationsNested = await Promise.all(sampled.map(pt => fetchChargingStations(pt.lat, pt.lng, 5000)));
  const allStations = allStationsNested.flat();
  console.log('[DEBUG] All stations from all sampled points:', allStations);
  // Deduplicate by OCM ID
  const unique = {};
  allStations.forEach(st => { if (st.id) unique[st.id] = st; });
  return Object.values(unique);
}

// Helper: Show charging stations on the map
function showChargingStationsOnMap(stations) {
  if (!leafletMap) return;
  // Remove previous station markers
  if (window.chargingStationMarkers) {
    window.chargingStationMarkers.forEach(m => leafletMap.removeLayer(m));
  }
  window.chargingStationMarkers = stations.map(st => {
    const iconUrl = 'markers/icons8-map-pin-30.png';
    const marker = L.marker([st.geometry.location.lat, st.geometry.location.lng], {
      icon: L.icon({
        iconUrl,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      })
    }).addTo(leafletMap).bindPopup(`<b>${st.name}</b><br>${st.vicinity}`);
    return marker;
  });
}

// Helper: Show charging stations as a list
function showChargingStationsList(stations) {
  let html = '<h3 style="margin-bottom:18px;">EV Charging Stations</h3>';
  if (!stations.length) {
    html += '<div>No EV charging stations found along your route or near start/destination.</div>';
  } else {
    html += `<div class="charging-stations-list">` + stations.map(st => `
      <div class="charging-station-list-item">
        <div class="charging-station-list-title">
          <span class="station-icon">${st.category && st.category.startsWith('✅') ? '✅' : st.category && st.category.startsWith('🏨') ? '🏨' : st.category && st.category.startsWith('⚠️') ? '⚠️' : '🔌'}</span>
          ${st.name ? `<span>${st.name}</span>` : ''}
        </div>
        <div class="charging-station-list-address">${st.vicinity || ''}</div>
        ${st.distance ? `<div class="charging-station-list-distance">~${st.distance} km from route</div>` : ''}
      </div>
    `).join('') + '</div>';
  }
  // Append after consumption factors
  const resultsContent = document.getElementById('resultsContent');
  if (resultsContent) {
    // Remove any previous station lists
    const prev = resultsContent.querySelector('.charging-stations-list');
    if (prev) prev.parentNode.removeChild(prev);
    resultsContent.innerHTML += html;
  }
}

// --- CHARGING STATION LOGIC END ---

// Remove chargingStationIcon, chargingStationMapMarkers, fetchNearbyChargingStations, curatedChargingStations, renderStationsList, clearChargingStationMarkers, addChargingStationsToMap, and all charging station logic from calculateRoute.

// Patch: After route is calculated, store the data for real-time updates
async function calculateRoute(event) {
  if (event) event.preventDefault();
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const calculateBtn = document.getElementById('calculateBtn');
  const errorMessage = document.getElementById('errorMessage');
  
  if (!from || !to) {
    errorMessage.textContent = 'Please fill in both start and destination.';
    return;
  }
  
  calculateBtn.disabled = true;
  errorMessage.textContent = '';
  showLoading();
  
  try {
    // Show the map container when calculation starts
    document.getElementById('routeMap').style.display = 'block';
    const result = await getOptimizedRoute(from, to);
    if (!result || !result.routes || result.routes.length === 0) {
      throw new Error('No routes found between these locations.');
    }
    const route = result.routes[0];
    
    // Get road type from the form
    const roadType = document.getElementById('roadType').value;
    
    // Collect all the data in parallel for better performance
    const [trafficData, elevationData, weatherData, roadConditions] = await Promise.all([
      getTrafficData(route),
      fetchElevationData(route),
      fetchWeatherData(to),
      fetchRoadConditions(route)  // Now using the actual API
    ]);
    
    // Store for real-time updates
    lastRoute = route;
    lastTrafficData = trafficData;
    lastElevationData = elevationData;
    lastWeatherData = weatherData;
    lastRoadConditions = roadConditions;
    
    // Fetch and show charging stations after results
    const startLoc = route.legs[0].start_location;
    const endLoc = route.legs[0].end_location;
    const stationsStart = await fetchChargingStations(startLoc.lat, startLoc.lng, 1000);
    const stationsEnd = await fetchChargingStations(endLoc.lat, endLoc.lng, 1000);
    const stationsAlong = await fetchStationsAlongRoute(route, 2000);
    // Merge and deduplicate
    const allStations = [...stationsStart, ...stationsEnd, ...stationsAlong];
    const uniqueStations = {};
    allStations.forEach(st => { uniqueStations[st.id] = st; });
    const authorizedStations = Object.values(uniqueStations);
    
    displayResults(route, trafficData, elevationData, weatherData, roadConditions, authorizedStations);
    showChargingStationsOnMap(authorizedStations);
    // showChargingStationsList(authorizedStations); // Now called from displayResults
  } catch (error) {
    console.error('Route calculation error:', error);
    errorMessage.textContent = error.message || 'Could not calculate route. Please try again.';
    if (error.message && error.message.includes('NOT_FOUND')) {
      errorMessage.textContent = 'One or both locations could not be found. Please check the addresses.';
    } else if (error.message && error.message.includes('ZERO_RESULTS')) {
      errorMessage.textContent = 'No route could be found between these locations. They may be too far apart or not accessible by road.';
    } else if (error.message && error.message.includes('OVER_QUERY_LIMIT')) {
      errorMessage.textContent = 'Too many requests. Please try again later.';
    }
  } finally {
    calculateBtn.disabled = false;
    hideLoading();
  }
}

// Replace getOptimizedRoute with a placeholder
async function getOptimizedRoute(from, to) {
  const apiKey = GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&key=${apiKey}`;
  const response = await fetch(url);
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    if (data.status !== 'OK') {
      throw new Error(data.error_message || 'No route found');
    }
    return data;
  } catch (e) {
    if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
      throw new Error('Route service unavailable or API error (received HTML instead of JSON). Please check your API key, quota, or network.');
    }
    throw new Error('Unexpected response from route service.');
  }
}

// Get traffic data from route
async function getTrafficData(route) {
  try {
    const segments = route.legs[0].steps;
    let totalDuration = 0;
    let trafficDuration = 0;

    segments.forEach(segment => {
      totalDuration += segment.duration.value;
      if (segment.duration_in_traffic) {
        trafficDuration += segment.duration_in_traffic.value;
      }
    });

    // If traffic info is not available, estimate based on time of day
    if (trafficDuration === 0) {
      const hour = new Date().getHours();
      // Simulate rush hours
      if ((hour >= 7 && hour <= 10) || (hour >= 16 && hour <= 19)) {
        trafficDuration = totalDuration * 1.3; // 30% increase during rush hours
      } else {
        trafficDuration = totalDuration * 1.1; // 10% increase during non-rush hours
      }
    }

    const trafficFactor = trafficDuration / totalDuration;
    
    return {
      factor: trafficFactor > 1 ? trafficFactor - 1 : 0,
      level: trafficFactor <= 1.1 ? 'low' : trafficFactor <= 1.3 ? 'medium' : 'high',
      delay: Math.max(0, trafficDuration - totalDuration)
    };
  } catch (error) {
    console.error('Error calculating traffic data:', error);
    // Return default traffic data if there's an error
    return { factor: 0.1, level: 'low', delay: 0 };
  }
}

// Polyline decoding function (Google Encoded Polyline Algorithm Format)
function decodePolyline(encoded) {
  let points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;
    points.push({
      lat: lat / 1e5,
      lng: lng / 1e5
    });
  }
  return points;
}

// Fetch elevation data using Google Elevation REST API
async function fetchElevationData(route) {
  try {
    // 1. Decode polyline from route
    const polyline = route.overview_polyline && route.overview_polyline.points;
    if (!polyline) throw new Error('No polyline found in route');
    let path = decodePolyline(polyline);
    // 2. Sample up to 100 points
    const sampleCount = Math.min(100, path.length);
    if (sampleCount < 2) throw new Error('Not enough points for elevation');
    const step = Math.max(1, Math.floor(path.length / sampleCount));
    let sampled = [];
    for (let i = 0; i < path.length; i += step) {
      sampled.push(path[i]);
    }
    // 3. Build locations string for API
    const locations = sampled.map(p => `${p.lat},${p.lng}`).join('|');
    const apiKey = GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/elevation/json?locations=${locations}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.status !== 'OK' || !data.results || data.results.length < 2) {
      throw new Error('Elevation API error or insufficient results');
    }
    // 4. Calculate total climb
    let totalClimb = 0;
    for (let i = 1; i < data.results.length; i++) {
      const gain = data.results[i].elevation - data.results[i-1].elevation;
      if (gain > 0) totalClimb += gain;
    }
    // 5. Return climb and factor
    return {
      totalClimb,
      factor: totalClimb > 100 ? 0.10 : totalClimb > 50 ? 0.05 : 0.02
    };
  } catch (error) {
    console.error('Elevation data error:', error);
    // Fallback to road type estimate
    const roadType = document.getElementById('roadType').value;
    const estimatedClimb = roadType === 'hilly' ? 200 : 50;
    const estimatedFactor = roadType === 'hilly' ? 0.20 : 0.05;
    return {
      totalClimb: estimatedClimb,
      factor: estimatedFactor
    };
  }
}

// Fetch weather data with better fallback mechanism
async function fetchWeatherData(location) {
  async function tryGeocode(loc) {
    const geoResp = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(loc)}&count=1&language=en&format=json`);
    const geoData = await geoResp.json();
    if (geoData.results && geoData.results[0]) {
      return geoData.results[0];
    }
    return null;
  }

  // 1. Try Weatherstack API first
  try {
    if (!location || location.trim() === '') {
      throw new Error('Location for weather API is empty.');
    }
    const weatherstackUrl = `https://api.weatherstack.com/current?access_key=${WEATHERSTACK_API_KEY}&query=${encodeURIComponent(location)}`;
    console.log('Weatherstack request:', weatherstackUrl);
    const response = await fetch(weatherstackUrl);
    if (!response.ok) {
      throw new Error(`Weatherstack API responded with status: ${response.status}`);
    }
    const data = await response.json();
    if (data.error) {
      console.error('Weatherstack error:', data.error);
      throw new Error(data.error.info || 'Unknown Weatherstack API error');
    }
    if (!data.current) {
      throw new Error('Weatherstack: Weather data not available for this location');
    }
    return analyzeWeather(data.current);
  } catch (wsError) {
    console.warn('Weatherstack failed, falling back to Open-Meteo:', wsError);
    // 2. Fallback: Open-Meteo with robust geocoding
    try {
      // Try full location first
      let geoResult = await tryGeocode(location);
      // If not found, try first part before comma
      if (!geoResult && location.includes(',')) {
        geoResult = await tryGeocode(location.split(',')[0].trim());
      }
      // If still not found, try last part (city) after last comma
      if (!geoResult && location.includes(',')) {
        const parts = location.split(',');
        geoResult = await tryGeocode(parts[parts.length - 1].trim());
      }
      // If still not found, throw error
      if (!geoResult) throw new Error('Could not geocode location');
      const lat = geoResult.latitude;
      const lng = geoResult.longitude;
      // Fetch weather data from Open-Meteo
      const weatherResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
      const weatherData = await weatherResp.json();
      if (!weatherData.current_weather) throw new Error('Weather data not available for this location');
      // Map Open-Meteo weathercode to description
      const weatherCodeMap = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
      };
      const current = weatherData.current_weather;
      const temp = current.temperature;
      const windSpeed = current.windspeed;
      const windDir = current.winddirection;
      const code = current.weathercode;
      const condition = weatherCodeMap[code] || 'Unknown';
      return analyzeWeather({
        temperature: temp,
        wind_speed: windSpeed,
        weather_descriptions: [condition],
        wind_degree: windDir
      });
    } catch (error) {
      console.error('Weather data error:', error);
      // Fallback: generate reasonable weather data based on current date
      const today = new Date();
      const month = today.getMonth();
      // Simulate seasonal temperatures and conditions
      let temp, condition, windSpeed;
      // Northern hemisphere seasons (approximate)
      if (month >= 2 && month <= 4) {
        // Spring
        temp = 20;
        condition = 'partly cloudy';
        windSpeed = 8;
      } else if (month >= 5 && month <= 7) {
        // Summer
        temp = 28;
        condition = 'sunny';
        windSpeed = 5;
      } else if (month >= 8 && month <= 10) {
        // Fall
        temp = 15;
        condition = 'cloudy';
        windSpeed = 10;
      } else {
        // Winter
        temp = 5;
        condition = 'cold';
        windSpeed = 12;
      }
      return analyzeWeather({
        temperature: temp,
        wind_speed: windSpeed,
        weather_descriptions: [condition],
        wind_degree: Math.random() * 360
      });
    }
  }
}

// Analyze weather impact
function analyzeWeather(weather) {
  const temp = weather.temperature;
  const windSpeed = weather.wind_speed;
  const condition = Array.isArray(weather.weather_descriptions) && weather.weather_descriptions.length > 0 
    ? weather.weather_descriptions[0].toLowerCase() 
    : 'mild';
  const windDir = weather.wind_degree || 0;

  // Temperature Impact Factors
  let tempFactor = 0;
  if (temp < -10) {
    tempFactor = 0.45;  // Extreme cold - maximum heating needed
  } else if (temp >= -10 && temp < 0) {
    tempFactor = 0.35;  // Very cold - significant heating needed
  } else if (temp >= 0 && temp < 5) {
    tempFactor = 0.25;  // Cold - moderate heating needed
  } else if (temp >= 5 && temp < 10) {
    tempFactor = 0.15;  // Cool - light heating needed
  } else if (temp >= 10 && temp < 15) {
    tempFactor = 0.10;  // Mild cool - minimal heating
  } else if (temp >= 15 && temp < 20) {
    tempFactor = 0.05;  // Slightly cool - very light heating
  } else if (temp >= 20 && temp < 30) {
    tempFactor = 0.00;  // Optimal range (20-30°C) - no additional consumption
  } else if (temp >= 30 && temp < 35) {
    tempFactor = 0.10;  // Warm - light cooling needed
  } else if (temp >= 35 && temp < 40) {
    tempFactor = 0.20;  // Hot - moderate cooling needed
  } else {
    tempFactor = 0.30;  // Extreme hot - maximum cooling needed
  }

  // Weather Condition Impact Factors
  let weatherFactor = 0;
  if (condition.includes('heavy snow') || condition.includes('blizzard')) {
    weatherFactor = 0.25;  // Extreme winter conditions - maximum impact
  } else if (condition.includes('snow') || condition.includes('sleet')) {
    weatherFactor = 0.20;  // Snow conditions - significant impact
  } else if (condition.includes('heavy rain') || condition.includes('thunderstorm')) {
    weatherFactor = 0.15;  // Heavy rain - moderate impact
  } else if (condition.includes('rain') || condition.includes('drizzle')) {
    weatherFactor = 0.10;  // Light to moderate rain - light impact
  } else if (condition.includes('fog') || condition.includes('mist')) {
    weatherFactor = 0.05;  // Reduced visibility - minimal impact
  } else if (condition.includes('partly cloudy') || condition.includes('scattered clouds')) {
    weatherFactor = 0.02;  // Partly cloudy - very minimal impact
  } else if (condition.includes('overcast') || condition.includes('cloudy')) {
    weatherFactor = 0.03;  // Overcast - minimal impact
  }

  // Wind Impact Factors
  let windFactor = 0;
  if (windSpeed > 20) {
    windFactor = 0.15;  // Strong wind - significant impact
  } else if (windSpeed > 15) {
    windFactor = 0.10;  // Moderate wind - moderate impact
  } else if (windSpeed > 10) {
    windFactor = 0.05;  // Light wind - minimal impact
  }

  return { 
    temp, 
    windSpeed, 
    windDir, 
    condition, 
    tempFactor, 
    weatherFactor,
    windFactor,
    tempRange: getTemperatureRange(temp)
  };
}

// Helper function to get temperature range description
function getTemperatureRange(temp) {
  if (temp < -10) return 'Extreme Cold';
  if (temp < 0) return 'Very Cold';
  if (temp < 5) return 'Cold';
  if (temp < 10) return 'Cool';
  if (temp < 15) return 'Mild Cool';
  if (temp < 25) return 'Optimal';
  if (temp < 30) return 'Warm';
  if (temp < 35) return 'Hot';
  if (temp < 40) return 'Very Hot';
  return 'Extreme Hot';
}

// Fetch road conditions with improved fallback
async function fetchRoadConditions(route) {
  try {
    const routeCoordinates = extractRouteCoordinates(route);
    
    // Take fewer samples for longer routes to avoid API limits
    const sampleCount = Math.min(routeCoordinates.length / 5, 10);
    const sampledPoints = sampleRoutePoints(routeCoordinates, sampleCount);
    
    // Use Promise.allSettled to allow partial failures
    const roadConditionsPromises = sampledPoints.map(point => 
      fetchConditionForLocation(point.lat, point.lng)
    );
    
    const results = await Promise.allSettled(roadConditionsPromises);
    
    // Filter out the failed promises and keep only the fulfilled ones
    const roadConditions = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
    
    // If no road conditions were successfully fetched, use default conditions
    if (roadConditions.length === 0) {
      console.warn('No road conditions fetched, using default conditions');
      return getDefaultRoadConditions(route);
    }
    
    return analyzeRoadConditions(roadConditions, route);
  } catch (error) {
    console.error('Road condition data error:', error);
    return getDefaultRoadConditions(route);
  }
}

// Updated function to get default road conditions for any location
function getDefaultRoadConditions(route) {
  const distanceKm = route.legs[0].distance.value / 1000;
  const roadType = document.getElementById('roadType').value;
  
  console.log('Getting default road conditions for:', {
    roadType,
    distanceKm
  });

  // Common road conditions for any location
  const conditions = [];
  let overallFactor = 0;

  switch (roadType) {
    case 'city':
      conditions.push(
        {
          type: 'urban traffic',
          severity: 'medium',
          count: 1,
          factor: 0.06,  // 6% impact from urban traffic
          percentage: 40,
          distance: distanceKm * 0.4
        },
        {
          type: 'traffic signals',
          severity: 'medium',
          count: 1,
          factor: 0.03,  // 3% impact from traffic signals
          percentage: 30,
          distance: distanceKm * 0.3
        },
        {
          type: 'normal road',
          severity: 'low',
          count: 1,
          factor: 0.015,  // 1.5% impact from normal city roads
          percentage: 30,
          distance: distanceKm * 0.3
        }
      );
      overallFactor = 0.037; // Weighted average: (0.06 * 0.4) + (0.03 * 0.3) + (0.015 * 0.3)
      break;

    case 'highway':
      conditions.push(
        {
          type: 'highway',
          severity: 'low',
          count: 1,
          factor: 0.05,  // 5% impact from highway driving
          percentage: 70,
          distance: distanceKm * 0.7
        },
        {
          type: 'toll plaza',
          severity: 'low',
          count: 1,
          factor: 0.03,  // 3% impact from toll plazas
          percentage: 10,
          distance: distanceKm * 0.1
        },
        {
          type: 'normal road',
          severity: 'low',
          count: 1,
          factor: 0.02,  // 2% impact from normal roads
          percentage: 20,
          distance: distanceKm * 0.2
        }
      );
      overallFactor = 0.043; // Weighted average: (0.05 * 0.7) + (0.03 * 0.1) + (0.02 * 0.2)
      break;

    case 'hilly':
      conditions.push(
        {
          type: 'hilly terrain',
          severity: 'high',
          count: 1,
          factor: 0.25,  // 25% impact from hilly terrain
          percentage: 50,
          distance: distanceKm * 0.5
        },
        {
          type: 'curves',
          severity: 'medium',
          count: 1,
          factor: 0.15,  // 15% impact from curves
          percentage: 30,
          distance: distanceKm * 0.3
        },
        {
          type: 'normal road',
          severity: 'low',
          count: 1,
          factor: 0.05,  // 5% impact from normal roads
          percentage: 20,
          distance: distanceKm * 0.2
        }
      );
      overallFactor = 0.185; // Weighted average: (0.25 * 0.5) + (0.15 * 0.3) + (0.05 * 0.2)
      break;

    case 'rural':
      conditions.push(
        {
          type: 'rural road',
          severity: 'medium',
          count: 1,
          factor: 0.15,  // 15% impact from rural roads
          percentage: 60,
          distance: distanceKm * 0.6
        },
        {
          type: 'unpaved sections',
          severity: 'high',
          count: 1,
          factor: 0.20,  // 20% impact from unpaved sections
          percentage: 20,
          distance: distanceKm * 0.2
        },
        {
          type: 'normal road',
          severity: 'low',
          count: 1,
          factor: 0.05,  // 5% impact from normal roads
          percentage: 20,
          distance: distanceKm * 0.2
        }
      );
      overallFactor = 0.14; // Weighted average: (0.15 * 0.6) + (0.20 * 0.2) + (0.05 * 0.2)
      break;

    case 'mixed':
      conditions.push(
        {
          type: 'urban traffic',
          severity: 'medium',
          count: 1,
          factor: 0.15,  // 15% impact from urban traffic
          percentage: 30,
          distance: distanceKm * 0.3
        },
        {
          type: 'highway',
          severity: 'low',
          count: 1,
          factor: 0.05,  // 5% impact from highway
          percentage: 40,
          distance: distanceKm * 0.4
        },
        {
          type: 'rural road',
          severity: 'medium',
          count: 1,
          factor: 0.15,  // 15% impact from rural roads
          percentage: 30,
          distance: distanceKm * 0.3
        }
      );
      overallFactor = 0.11; // Weighted average: (0.15 * 0.3) + (0.05 * 0.4) + (0.15 * 0.3)
      break;

    default:
      conditions.push(
        {
          type: 'normal road',
          severity: 'low',
          count: 1,
          factor: 0.05,  // 5% impact from normal roads
          percentage: 100,
          distance: distanceKm
        }
      );
      overallFactor = 0.05;
  }

  const result = {
    conditions,
    factor: overallFactor,
    isDefault: true
  };

  console.log('Calculated road conditions:', result);
  return result;
}

// Update extractRouteCoordinates to avoid using overview_path
function extractRouteCoordinates(route) {
  try {
    const polyline = route.overview_polyline && route.overview_polyline.points;
    if (!polyline) return [];
    return decodePolyline(polyline);
  } catch (error) {
    console.error('Error extracting route coordinates:', error);
    return [];
  }
}

function sampleRoutePoints(points, sampleCount) {
  if (!points || points.length === 0) return [];
  if (points.length <= sampleCount) return points;
  
  const result = [];
  const step = Math.floor(points.length / sampleCount);
  
  for (let i = 0; i < points.length && result.length < sampleCount; i += step) {
    result.push(points[i]);
  }
  
  return result;
}

async function fetchConditionForLocation(lat, lng) {
  try {
    const response = await fetch(
      `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_API_KEY}&point=${lat},${lng}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return interpretRoadCondition(data, lat, lng);
  } catch (error) {
    console.error('Error fetching road condition:', error);
    return {
      lat,
      lng,
      type: 'unknown',
      severity: 'none',
      factor: 0
    };
  }
}

function interpretRoadCondition(data, lat, lng) {
  let type = 'normal';
  let severity = 'none';
  let factor = 0;
  
  try {
    if (data && data.flowSegmentData) {
      const segmentData = data.flowSegmentData;
      
      // Get current speed and free flow speed
      const currentSpeed = segmentData.currentSpeed || 0;
      const freeFlowSpeed = segmentData.freeFlowSpeed || 1;
      const speedRatio = currentSpeed / freeFlowSpeed;
      
      // Check for road closures
      const roadCategory = segmentData.roadClosure ? 'closed' : 
                        segmentData.roadCategory || 'unknown';
                        
      // Get weather conditions
      const weather = segmentData.weatherCategory || 'unknown';
      
      // Determine road condition based on speed ratio
      if (roadCategory === 'closed') {
        type = 'closed';
        severity = 'high';
        factor = 1.0;
      } else if (speedRatio < 0.3) {
        type = 'poor/muddy';
        severity = 'high';
        factor = 0.35;
      } else if (speedRatio < 0.5) {
        type = 'rough';
        severity = 'medium';
        factor = 0.25;
      } else if (speedRatio < 0.7) {
        type = 'uneven';
        severity = 'low';
        factor = 0.15;
      }
      
      // Adjust for weather conditions
      if (weather === 'rain') {
        type = 'wet';
        severity = severity === 'none' ? 'low' : severity;
        factor = Math.max(factor, 0.1);
      } else if (weather === 'snow') {
        type = 'snow';
        severity = 'high';
        factor = Math.max(factor, 0.3);
      }
    }
  } catch (error) {
    console.error('Error interpreting road condition:', error);
  }
  
  return { lat, lng, type, severity, factor };
}

function analyzeRoadConditions(conditions, route) {
  if (!conditions || conditions.length === 0) {
    return { conditions: [], factor: 0 };
  }
  
  const distanceKm = route.legs[0].distance.value / 1000;
  
  const conditionSummary = conditions.reduce((acc, condition) => {
    if (condition.type !== 'normal' && condition.type !== 'unknown') {
      const existingCondition = acc.find(c => c.type === condition.type);
      if (existingCondition) {
        existingCondition.count++;
      } else {
        acc.push({
          type: condition.type,
          severity: condition.severity,
          count: 1,
          factor: condition.factor
        });
      }
    }
    return acc;
  }, []);
  
  conditionSummary.forEach(condition => {
    condition.percentage = (condition.count / conditions.length) * 100;
    condition.distance = (condition.percentage / 100) * distanceKm;
  });
  
  const overallFactor = conditionSummary.reduce((total, condition) => {
    return total + (condition.factor * (condition.percentage / 100));
  }, 0);
  
  return {
    conditions: conditionSummary,
    factor: overallFactor
  };
}

function calculateConsumptionFactors(
  drivingStyle,
  batterySOH,
  avgSpeed,
  windFactor,
  roadType,
  loadLevel,
  hvac,
  weatherData,
  elevationData,
  trafficData,
  roadConditions
) {
  // Debug logging
  console.log('Calculating consumption factors with:', {
    roadType,
    roadConditions,
    roadConditionFactor: roadConditions ? roadConditions.factor : 0
  });

  // Calculate SoH from range if not provided
  if (!batterySOH || isNaN(batterySOH)) {
    const vehicleMaxRange = parseFloat(range);
    const currentRange = parseFloat(urlParams.get('sohValue'));
    if (vehicleMaxRange && currentRange) {
      batterySOH = (currentRange / vehicleMaxRange) * 100;
    } else {
      batterySOH = 100; // Default to 100% if can't calculate
    }
  }

  // 1. Driving Style Impact
  let drivingStyleFactor = 0;
  switch(drivingStyle) {
    case 'normal':
      drivingStyleFactor = 0.0; // Base consumption - normal driving
      break;
    case 'sport':
      drivingStyleFactor = 0.25; // 25% more consumption due to aggressive driving
      break;
    default:
      drivingStyleFactor = 0.0;
  }

  // 2. Road Type Impact
  let roadTypeFactor = 0;
  switch(roadType) {
    case 'city':
      roadTypeFactor = 0.10; // 10% more consumption due to frequent stops
      break;
    case 'highway':
      roadTypeFactor = 0.05; // 5% more consumption due to higher speeds
      break;
    case 'hilly':
      roadTypeFactor = 0.20; // 20% more consumption due to elevation changes
      break;
    case 'rural':
      roadTypeFactor = 0.15; // 15% more consumption due to rough roads
      break;
    case 'mixed':
      roadTypeFactor = 0.12; // 12% more consumption for mixed conditions
      break;
    default:
      roadTypeFactor = 0.0;
  }

  // 3. Speed Impact - Updated with road type consideration
  let speedFactor = 0;
  const vehicleType = urlParams.get('vehicleType') || 'car';

  // Optimal speed ranges for different vehicle types and road conditions
  const optimalSpeedRanges = {
    car: {
      city: { min: 30, max: 50, optimal: 40 },
      highway: { min: 70, max: 90, optimal: 80 },
      rural: { min: 50, max: 70, optimal: 60 },
      hilly: { min: 40, max: 60, optimal: 50 }
    },
    twowheeler: {
      city: { min: 25, max: 45, optimal: 35 },
      highway: { min: 60, max: 80, optimal: 70 },
      rural: { min: 45, max: 65, optimal: 55 },
      hilly: { min: 35, max: 55, optimal: 45 }
    }
  };

  // Get optimal speed range based on vehicle type and road type
  const speedRange = optimalSpeedRanges[vehicleType]?.[roadType] || optimalSpeedRanges.car.city;

  // Calculate speed impact based on deviation from optimal range
  if (avgSpeed < speedRange.min) {
    // Below optimal range - up to 20% increase
    const deviation = speedRange.min - avgSpeed;
    speedFactor = Math.min(0.20, (deviation / speedRange.optimal) * 0.15);
  } else if (avgSpeed > speedRange.max) {
    // Above optimal range - up to 30% increase
    const deviation = avgSpeed - speedRange.max;
    speedFactor = Math.min(0.30, (deviation / speedRange.optimal) * 0.25);
  } else {
    // Within optimal range - minimal impact
    const deviation = Math.abs(avgSpeed - speedRange.optimal);
    speedFactor = Math.min(0.05, (deviation / speedRange.optimal) * 0.05);
  }

  // 4. Load Level Impact
  let loadFactor = 0;
  switch(loadLevel) {
    case 'light':
      loadFactor = 0.0; // Base consumption - driver only
      break;
    case 'medium':
      loadFactor = 0.10; // 10% more consumption - 2-3 passengers
      break;
    case 'full':
      loadFactor = 0.20; // 20% more consumption - 4-5 passengers
      break;
    case 'cargo':
      loadFactor = 0.25; // 25% more consumption - heavy cargo
      break;
    case 'heavy':
      loadFactor = 0.35; // 35% more consumption - maximum capacity
      break;
    default:
      loadFactor = 0.0;
  }

  // 5. HVAC Impact
  let hvacFactor = 0;
  switch(hvac) {
    case 'none':
      hvacFactor = 0.0; // No additional consumption
      break;
    case 'ac':
      hvacFactor = 0.15; // 15% more consumption with AC
      break;
    case 'heater':
      hvacFactor = 0.30; // 30% more consumption with heater
      break;
    default:
      hvacFactor = 0.0;
  }

  // 6. Battery Health Impact
  let batterySohFactor = 0.0;
  if (batterySOH < 60) batterySOH = 60; // Enforce minimum
  if (batterySOH > 100) {
    console.warn('Battery SoH exceeds 100%. This may indicate a measurement error or calibration issue.');
  }
  batterySohFactor = (100 - batterySOH) / 100; // Linear degradation impact

  // 7. Traffic Impact
  const trafficFactor = trafficData && typeof trafficData.factor === 'number' ? 
    Math.min(0.12, trafficData.factor * 0.3) : 0;  // Cap at 12%
  
  // 8. Weather Impact (combined temperature and condition effects)
  const weatherTempFactor = weatherData && typeof weatherData.tempFactor === 'number' ? 
    weatherData.tempFactor : 0;
  const weatherConditionFactor = weatherData && typeof weatherData.weatherFactor === 'number' ? 
    weatherData.weatherFactor : 0;
  
  // 9. Road Condition Impact
  const roadConditionFactor = roadConditions && typeof roadConditions.factor === 'number' ? 
    roadConditions.factor : 0;

  // 10. Elevation Impact
  const elevationFactor = elevationData && typeof elevationData.factor === 'number' ? 
    elevationData.factor : 0;

  // Calculate total impact
  const total = (
    drivingStyleFactor +
    roadTypeFactor +
    speedFactor +
    loadFactor +
    hvacFactor +
    batterySohFactor +
    weatherTempFactor +
    weatherConditionFactor +
    windFactor +
    elevationFactor +
    trafficFactor +
    roadConditionFactor
  );

  return {
    drivingStyle: drivingStyleFactor,
    roadType: roadTypeFactor,
    speed: speedFactor,
    load: loadFactor,
    hvac: hvacFactor,
    batterySoh: batterySohFactor,
    weather: weatherTempFactor + weatherConditionFactor,
    wind: windFactor,
    elevation: elevationFactor,
    traffic: trafficFactor,
    roadCondition: roadConditionFactor,
    total
  };
}

function displayResults(route, trafficData, elevationData, weatherData, roadConditions, chargingStations) {
  if (!route || !route.legs || !route.legs[0]) {
    console.error('Invalid route data');
    document.getElementById('errorMessage').textContent = 'Route calculation failed. Please try again.';
    return;
  }

  // Ensure the map container is visible and has proper dimensions
  const mapContainer = document.getElementById('routeMap');
  if (mapContainer) {
    mapContainer.classList.add('show'); // Use CSS class for visibility
    console.log('Map container made visible');
    
    // Wait for the container to be properly rendered before initializing map
    setTimeout(() => {
      // Initialize and draw the map with the route
      const startLoc = route.legs[0].start_location;
      if (startLoc) {
        initLeafletMap([startLoc.lat, startLoc.lng], 12);
      } else {
        initLeafletMap();
      }
      
      // Add another delay to ensure map is ready before drawing route
      setTimeout(() => {
        drawRouteOnLeafletMap(route);
        console.log('Route drawn on map');
        
        // Add charging station markers after route is drawn
        if (chargingStations && Array.isArray(chargingStations) && chargingStations.length > 0) {
          addChargingStationMarkers(chargingStations);
          console.log('Charging station markers added to map');
        }
      }, 200);
    }, 100);
  }
  
  const distanceKm = route.legs[0].distance.value / 1000;
  const baseTime = route.legs[0].duration.value / 3600;
  const trafficTime = baseTime * (1 + (trafficData ? trafficData.factor : 0));
  
  const avgSpeed = parseFloat(document.getElementById('avgSpeed').value || 40);
  const drivingStyle = document.getElementById('drivingStyle').value;
  const batterySOH = parseFloat(urlParams.get('soh')) || 100;
  const roadType = document.getElementById('roadType').value;
  const loadLevel = document.getElementById('loadLevel').value;
  const hvac = document.getElementById('hvac').value;

  // Calculate consumption factors
  const consumptionFactors = calculateConsumptionFactors(
    drivingStyle,
    batterySOH,
    avgSpeed,
    weatherData.windFactor || 0,
    roadType,
    loadLevel,
    hvac,
    weatherData,
    elevationData,
    trafficData,
    roadConditions
  );

  // Calculate energy consumption
  let energyConsumption = parseFloat(urlParams.get('energyConsumption'));
  if (isNaN(energyConsumption)) {
    const selectedVehicleId = parseInt(urlParams.get('vehicleId'));
    const selectedVehicle = vehicles.cars.find(car => car.id === selectedVehicleId);
    if (selectedVehicle) {
      const energyValues = selectedVehicle.energyConsumption.split('/').map(e => parseFloat(e.trim()));
      energyConsumption = energyValues[0];
    } else {
      energyConsumption = 0.14;
    }
  }
  
  const adjustedEnergyConsumption = energyConsumption * (1 + consumptionFactors.total);
  const totalEnergyKWh = distanceKm * adjustedEnergyConsumption;

  // Calculate battery capacity and percentage needed
  let batterySpec = urlParams.get('battery');
  let batteryCapacity = 25;
  if (batterySpec) {
    const match = batterySpec.match(/([\d.]+)/);
    if (match) {
      batteryCapacity = parseFloat(match[1]);
    }
  }
  
  let usableBattery = batteryCapacity;
  if (!isNaN(batterySOH)) {
    usableBattery = batteryCapacity * (batterySOH / 100);
  }
  
  const batteryPercentageNeeded = (totalEnergyKWh / usableBattery) * 100;
  let bufferPercent = 10;
  if (distanceKm < 20) {
    bufferPercent = 7;
  } else if (distanceKm < 100) {
    bufferPercent = 12;
  } else {
    bufferPercent = 18;
  }
  
  const batteryPercentageNeededWithBuffer = batteryPercentageNeeded + bufferPercent;
  
  // Add warning if battery percentage needed exceeds 100%
  let warningMessage = '';
  if (batteryPercentageNeededWithBuffer > 100) {
    warningMessage = `<div class="warning-message bg-yellow-100 text-yellow-800 p-3 rounded-md mt-4">
      <strong>Warning:</strong> The calculated battery percentage needed (${batteryPercentageNeededWithBuffer.toFixed(1)}%) exceeds 100%. 
      This may indicate that the route requires more energy than your battery can provide. 
      Consider planning for charging stops or choosing a different route.
    </div>`;
  }

  // Generate the results content in the new layout
  let content = '';
  content += `
    <div class="route-summary-flex" style="display: flex; gap: 2.5rem; align-items: flex-start; justify-content: center; flex-wrap: wrap; margin-bottom: 1.2rem; width: 100%;">
      <div class="route-summary-left" style="display: flex; flex-direction: column; gap: 1.2rem; min-width: 220px;">
        <div class="summary-card-light" style="background: #f8f9fa; border-radius: 20px; padding: 1.3rem 1.7rem 1.1rem 1.7rem; min-width: 180px; min-height: 70px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.03);">
          <div style="color: #6c757d; font-size: 1rem; font-weight: 500; margin-bottom: 0.3rem;">Distance</div>
          <div style="font-size: 1.45rem; font-weight: 700; color: #232933;">${route.legs[0].distance.text}</div>
        </div>
        <div class="summary-card-light" style="background: #f8f9fa; border-radius: 20px; padding: 1.3rem 1.7rem 1.1rem 1.7rem; min-width: 180px; min-height: 70px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.03);">
          <div style="color: #6c757d; font-size: 1rem; font-weight: 500; margin-bottom: 0.3rem;">Travel Time</div>
          <div style="font-size: 1.45rem; font-weight: 700; color: #232933;">${Math.round(trafficTime * 60)} mins</div>
        </div>
        <div class="summary-card-light" style="background: #f8f9fa; border-radius: 20px; padding: 1.3rem 1.7rem 1.1rem 1.7rem; min-width: 180px; min-height: 70px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.03);">
          <div style="color: #6c757d; font-size: 1rem; font-weight: 500; margin-bottom: 0.3rem;">Weather</div>
          <div style="font-size: 1.45rem; font-weight: 700; color: #232933;">${weatherData.temp}°C, ${weatherData.condition}</div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 420px;">
        <div class="route-summary-right" style="background: #111; color: #fff; border-radius: 20px; padding: 2rem 2.5rem 1.2rem 2.5rem; min-width: 220px; min-height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 24px 0 rgba(0,0,0,0.10); width: 100%; max-width: 420px;">
          <div style="font-size: 1.15rem; font-weight: 500; color: #eaeaea; margin-bottom: 0.5rem;">Battery Required</div>
          <div style="font-size: 2.2rem; font-weight: 700; line-height: 1; color: ${batteryPercentageNeededWithBuffer > 100 ? '#e74c3c' : '#fff'};">${batteryPercentageNeededWithBuffer.toFixed(1)}%</div>
          <div style="font-size: 0.95rem; color: #d1d5db; margin-top: 0.3rem;">of total battery capacity</div>
        </div>
        ${warningMessage ? `<div style=\"margin-top: 18px;\">${warningMessage}</div>` : ''}
      </div>
    </div>
  `;

  // Show charging stations list after consumption factors
  if (chargingStations && Array.isArray(chargingStations)) {
    // Insert EV Charge Zones heading just above the charging station list and below battery required box
    let evHeading = '';
    if (chargingStations.length) {
      evHeading = '<h2 class="text-2xl font-bold mb-4 text-gray-800 ev-charge-zones-heading">EV Charge Zones</h2>';
    }
    if (!chargingStations.length) {
      content += '<div>No EV charging stations found along your route or near start/destination.</div>';
    } else {
      content += evHeading;
      content += '<ul class="ev-charge-zones-list">' + chargingStations.map(st => {
        // Only show the emoji, not the text label
        let emoji = '';
        if (st.category.startsWith('✅')) emoji = '✅';
        else if (st.category.startsWith('🏨')) emoji = '🏨';
        else if (st.category.startsWith('🏬')) emoji = '🏬';
        else emoji = '⚠️';
        return `<li style=\"white-space:normal;overflow:visible;text-overflow:unset;display:flex;align-items:center;gap:8px;flex-wrap:wrap;\"><span class=\"station-icon\">${emoji}</span><span class=\"station-name\"><b>${st.name}</b></span> - <span class=\"station-address\">${st.vicinity}</span></li>`;
      }).join('') + '</ul>';
      // Add legend at the end
      content += `<div style="margin-top:1em;font-size:0.95em;opacity:0.85"><b>Legend:</b> ✅ Public & Verified &nbsp;🏨 Guest-Only &nbsp;🏬 Showroom &nbsp;⚠️ Unverified</div>`;
      content += `<div style="margin-top:1.5em; text-align:center; font-size:0.95em; opacity:0.7;">
        Charging station data powered by <a href="https://openchargemap.org/" target="_blank" rel="noopener noreferrer">OpenChargeMap</a>
      </div>`;
    }
  }

  document.getElementById('resultsContent').innerHTML = content;
  document.getElementById('resultsSection').style.display = 'block';
}

function createFactorBar(label, percentage) {
  // Ensure percentage is a valid number and convert string to number if needed
  const validPercentage = parseFloat(percentage) || 0;
  
  return `
    <div class="factor-bar">
      <div class="factor-label">
        <span>${label}</span>
        <span class="factor-value">${validPercentage.toFixed(1)}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${Math.min(100, Math.max(0, validPercentage))}%"></div>
      </div>
    </div>
  `;
}

function hideResults() {
  // document.getElementById('resultsPanel').classList.remove('show');
}

// Add real-time listeners to all form fields
function addRealtimeListeners() {
  const fields = [
    'drivingStyle', 'roadType', 'avgSpeed', 'loadLevel', 'hvac'
  ];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', debounce(updateSummaryRealtime, 200));
      el.addEventListener('change', debounce(updateSummaryRealtime, 200));
    }
  });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  displayVehicleInfo();
  initForm();
  addRealtimeListeners();
  setupAutocomplete('from', 'from-suggestions');
  setupAutocomplete('to', 'to-suggestions');
  var backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function(e) {
      // Clear all form fields
      var from = document.getElementById('from');
      var to = document.getElementById('to');
      if (from) from.value = '';
      if (to) to.value = '';
      // Clear results section
      var resultsContent = document.getElementById('resultsContent');
      if (resultsContent) resultsContent.innerHTML = '';
      var resultsSection = document.getElementById('resultsSection');
      if (resultsSection) resultsSection.style.display = 'none';
      // Hide the map container
      var routeMap = document.getElementById('routeMap');
      if (routeMap) routeMap.style.display = 'none';
      // Clear error messages
      var errorMessage = document.getElementById('errorMessage');
      if (errorMessage) errorMessage.textContent = '';
      // Clear overlays
      var loadingOverlay = document.getElementById('loadingOverlay');
      if (loadingOverlay) loadingOverlay.classList.remove('active');
      // Clear any map page specific storage
      localStorage.removeItem('mapPageState');
      sessionStorage.removeItem('mapPageState');
      // Navigation will proceed
    });
  }
  // Yes/No button logic for vehicle info confirmation
  const yesBtn = document.querySelector('.chat-btn-suggestion:nth-child(1)');
  const noBtn = document.querySelector('.chat-btn-suggestion:nth-child(2)');
  const routeForm = document.getElementById('routeForm');
  const routeFormSection = document.querySelector('.route-form-section');
  const chatMessages = document.querySelector('.chat-messages');
  if (yesBtn && noBtn && routeForm && chatMessages && routeFormSection) {
    // Hide the form section initially
    routeFormSection.style.display = 'none';
    function showUserResponse(text) {
      // Remove any previous user response bubbles (optional, or keep stacking)
      const container = document.getElementById('userResponseContainer');
      if (container) {
        container.innerHTML = '';
        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble user';
        userBubble.style.fontSize = '1.13rem';
        userBubble.style.fontWeight = '500';
        userBubble.textContent = text;
        container.appendChild(userBubble);
      }
    }
    yesBtn.addEventListener('click', function() {
      routeFormSection.style.display = '';
      showUserResponse('Yes');
    });
    noBtn.addEventListener('click', function() {
      showUserResponse('No');
      setTimeout(function() {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '../page4/estimate.html';
      }, 700);
    });
  }
});

// Add this new function
function updateSavedLocationsList() {
  const container = document.getElementById('savedLocations');
  container.innerHTML = savedLocations.map((loc, index) => `
    <div class="saved-location-item" onclick="useSavedLocation(${index})">
      ${loc.name}
    </div>
  `).join('');
}

// Add this new function
function useSavedLocation(index) {
  const location = savedLocations[index];
  document.getElementById('from').value = location.name;
  // Optionally, set 'to' if you want to support destination as well
}

function setupAutocomplete(inputId, suggestionsId) {
  const input = document.getElementById(inputId);
  const suggestions = document.getElementById(suggestionsId);
  let debounceTimeout = null;
  let activeIndex = -1;

  // Ensure parent is relative for dropdown
  if (input && input.parentElement) {
    input.parentElement.style.position = 'relative';
  }

  input.addEventListener('input', function() {
    const query = input.value.trim();
    if (debounceTimeout) clearTimeout(debounceTimeout);
    if (!query) {
      suggestions.style.display = 'none';
      suggestions.innerHTML = '';
      return;
    }
    debounceTimeout = setTimeout(async () => {
      const apiKey = GOOGLE_MAPS_API_KEY;
      // Remove types=geocode to allow POIs (colleges, hospitals, etc)
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}&components=country:in`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'OK') {
          suggestions.innerHTML = '';
          data.predictions.forEach((pred, idx) => {
            const div = document.createElement('div');
            div.className = 'autocomplete-suggestion';
            div.textContent = pred.description;
            div.onclick = () => {
              input.value = pred.description;
              suggestions.style.display = 'none';
            };
            suggestions.appendChild(div);
          });
          suggestions.style.display = 'block';
        } else {
          suggestions.style.display = 'none';
          suggestions.innerHTML = '';
        }
      } catch (e) {
        suggestions.style.display = 'none';
        suggestions.innerHTML = '';
      }
    }, 300);
  });

  // Hide suggestions on blur
  input.addEventListener('blur', () => setTimeout(() => suggestions.style.display = 'none', 200));
  input.addEventListener('focus', () => {
    if (suggestions.innerHTML) suggestions.style.display = 'block';
  });
}

function showLoading() {
  var overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.add('active');
}

function hideLoading() {
  var overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.remove('active');
}

// Leaflet map variables
let leafletMap, leafletRouteLayer;
let leafletStartMarker, leafletEndMarker;

function initLeafletMap(center = [20.5937, 78.9629], zoom = 6) {
  try {
    if (!leafletMap) {
      console.log('Initializing Leaflet map with center:', center, 'zoom:', zoom);
      const mapElement = document.getElementById('routeMap');
      if (!mapElement) {
        console.error('Map container element not found!');
        return;
      }
      
      // Check if container is visible and has dimensions
      const containerRect = mapElement.getBoundingClientRect();
      if (containerRect.width === 0 || containerRect.height === 0) {
        console.warn('Map container has no dimensions. Width:', containerRect.width, 'Height:', containerRect.height);
        // Don't manually set dimensions - they should be handled by CSS
        return;
      }
      
      console.log('Map container dimensions:', containerRect.width, 'x', containerRect.height);
      
      leafletMap = L.map('routeMap').setView(center, zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(leafletMap);
      
      console.log('Leaflet map initialized successfully');
      
      // Force map to resize after initialization
      setTimeout(() => {
        if (leafletMap) {
          leafletMap.invalidateSize();
          console.log('Map size invalidated and refreshed');
        }
      }, 300);
    } else {
      console.log('Map already exists, updating view to:', center, 'zoom:', zoom);
      leafletMap.setView(center, zoom);
      // Also invalidate size when updating existing map
      setTimeout(() => {
        if (leafletMap) {
          leafletMap.invalidateSize();
        }
      }, 100);
    }
  } catch (error) {
    console.error('Error initializing Leaflet map:', error);
  }
}

function drawRouteOnLeafletMap(route) {
  try {
    console.log('Drawing route on map:', route);
    
    if (!leafletMap) {
      console.error('Leaflet map not initialized!');
      return;
    }
    
    if (!route) {
      console.error('No route data provided!');
      return;
    }
    
    // Remove previous route layer if exists
    if (leafletRouteLayer) {
      leafletMap.removeLayer(leafletRouteLayer);
    }
    // Remove previous markers if exist
    if (leafletStartMarker) {
      leafletMap.removeLayer(leafletStartMarker);
      leafletStartMarker = null;
    }
    if (leafletEndMarker) {
      leafletMap.removeLayer(leafletEndMarker);
      leafletEndMarker = null;
    }
    
    // Decode polyline
    const polyline = route.overview_polyline && route.overview_polyline.points;
    if (!polyline) {
      console.error('No polyline data in route!');
      return;
    }
    
    console.log('Decoding polyline:', polyline);
    const path = decodePolyline(polyline).map(pt => [pt.lat, pt.lng]);
    console.log('Decoded path points:', path.length);
    
    leafletRouteLayer = L.polyline(path, { color: '#4285F4', weight: 5 }).addTo(leafletMap);
    leafletMap.fitBounds(leafletRouteLayer.getBounds());
    
    console.log('Route polyline added to map');
    
    // Add start and end markers using actual start/end locations from the route
    if (route.legs && route.legs[0]) {
      const startLoc = route.legs[0].start_location;
      const endLoc = route.legs[0].end_location;
      
      if (startLoc) {
        console.log('Adding start marker at:', startLoc);
        leafletStartMarker = L.marker([startLoc.lat, startLoc.lng], { icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          shadowSize: [41, 41],
          shadowAnchor: [12, 41]
        }) }).addTo(leafletMap).bindPopup('Start');
      }
      
      if (endLoc) {
        console.log('Adding end marker at:', endLoc);
        leafletEndMarker = L.marker([endLoc.lat, endLoc.lng], { icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          shadowSize: [41, 41],
          shadowAnchor: [12, 41]
        }) }).addTo(leafletMap).bindPopup('Destination');
      }
    }
    
    console.log('Route drawing completed successfully');
    
  } catch (error) {
    console.error('Error drawing route on map:', error);
  }
}

// --- Charging Station Markers ---
let chargingStationMarkers = [];

function addChargingStationMarkers(chargingStations) {
  if (!leafletMap) {
    console.error('Cannot add charging station markers: Leaflet map not initialized');
    return;
  }
  
  if (!chargingStations || !Array.isArray(chargingStations)) {
    console.warn('Cannot add charging station markers: no stations data or not an array', chargingStations);
    return;
  }

  // Clear existing charging station markers
  clearChargingStationMarkers();

  console.log('Adding', chargingStations.length, 'charging station markers to map');
  console.log('Sample charging station data:', chargingStations[0]);

  chargingStations.forEach((station, index) => {
    // Extract coordinates from multiple possible data structures
    let lat, lng;
    
    // Try different coordinate access patterns
    if (station.geometry?.location?.lat && station.geometry?.location?.lng) {
      lat = station.geometry.location.lat;
      lng = station.geometry.location.lng;
    } else if (station.lat && station.lng) {
      lat = station.lat;
      lng = station.lng;
    } else if (station.AddressInfo?.Latitude && station.AddressInfo?.Longitude) {
      lat = station.AddressInfo.Latitude;
      lng = station.AddressInfo.Longitude;
    }
    
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      console.warn(`Skipping station ${index + 1} with missing/invalid coordinates:`, {
        name: station.name || station.AddressInfo?.Title || 'Unknown',
        lat: lat,
        lng: lng,
        stationKeys: Object.keys(station)
      });
      return;
    }
    
    console.log(`✓ Station ${index + 1}: ${station.name || station.AddressInfo?.Title} at [${lat}, ${lng}]`);

    // Determine marker color based on category
    let markerColor = 'orange'; // default
    let iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
    
    if (station.category.startsWith('✅')) {
      markerColor = 'violet';
      iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png';
    } else if (station.category.startsWith('🏨')) {
      markerColor = 'yellow';
      iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
    } else if (station.category.startsWith('🏬')) {
      markerColor = 'blue';
      iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
    }

    // Create custom icon for charging station
    const chargingIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [20, 32],
      iconAnchor: [10, 32],
      popupAnchor: [0, -32],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      shadowSize: [20, 32],
      shadowAnchor: [7, 32]
    });

    // Create marker
    const marker = L.marker([lat, lng], { icon: chargingIcon });

    // Create popup content
    const popupContent = `
      <div style="min-width: 200px;">
        <h4 style="margin: 0 0 8px 0; color: #333;">${station.name}</h4>
        <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${station.vicinity}</p>
        <p style="margin: 0; font-size: 11px; font-weight: bold; color: ${markerColor === 'violet' ? '#8e44ad' : markerColor === 'yellow' ? '#ffc107' : markerColor === 'blue' ? '#007bff' : '#fd7e14'};">${station.category}</p>
      </div>
    `;

    marker.bindPopup(popupContent);
    marker.addTo(leafletMap);
    
    // Store marker for later cleanup
    chargingStationMarkers.push(marker);
  });

  console.log('Successfully added', chargingStationMarkers.length, 'charging station markers');
}

function clearChargingStationMarkers() {
  if (chargingStationMarkers && chargingStationMarkers.length > 0) {
    chargingStationMarkers.forEach(marker => {
      if (leafletMap && marker) {
        leafletMap.removeLayer(marker);
      }
    });
    chargingStationMarkers = [];
    console.log('Cleared existing charging station markers');
  }
}
