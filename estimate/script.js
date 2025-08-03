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
// Vehicle Data
const vehicles = {
  cars: [
    {
      id: 1,
      model: 'Seal',
      manufacturer: 'BYD',
      battery: '61.4 kWh / 82.5 kWh',
      range: '420 km / 540 km',
      efficiency: '85%',
      energyConsumption: '0.146 / 0.153 kWh/km',
      weight: '2150 kg', 
      batteryType: 'LFP / NMC',
      imageUrl: './images/cars/byd-seal.png'
    },
    {
      id: 2,
      model: 'Spectre',
      manufacturer: 'Rolls-Royce',
      battery: '120.0 kWh',
      range: '420 km',
      efficiency: '80%',
      energyConsumption: '0.286 kWh/km',
      weight: '2975 kg',
      batteryType: 'NMC',
      imageUrl: './images/cars/rolls-royale.png'
    },
    {
      id: 3,
      model: 'Nexon EV',
      manufacturer: 'Tata Motors',
      battery: '30.2 kWh / 40.5 kWh',
      range: '200 km / 270 km',
      efficiency: '80%',
      energyConsumption: '0.151 / 0.150 kWh/km',
      weight: '1400 kg',
      batteryType: 'LFP',
      imageUrl: './images/cars/tata-nexon.png'
    },
    {
      id: 4,
      model: 'Punch EV',
      manufacturer: 'Tata Motors',
      battery: '25.0 kWh / 35.0 kWh',
      range: '170 km / 230 km',
      efficiency: '80%',
      energyConsumption: '0.147 / 0.152 kWh/km',
      weight: '1200 kg',
      batteryType: 'LFP',
      imageUrl: './images/cars/tata-punch.png'
    },
    {
      id: 5,
      model: 'ZS EV',
      manufacturer: 'MG Motor India',
      battery: '50.3 kWh',
      range: '320 km',
      efficiency: '82%',
      energyConsumption: '0.157 kWh/km',
      weight: '1540 kg',
      batteryType: 'LFP',
      imageUrl: './images/cars/Mg-zs-ev.png'
    },
    {
      id: 6,
      model: 'Creta EV',
      manufacturer: 'Hyundai',
      battery: '39.2 kWh',
      range: '250 km',
      efficiency: '80%',
      energyConsumption: '0.157 kWh/km',
      weight: '1530 kg',
      batteryType: 'LFP',
      imageUrl: './images/cars/hyundai-creta.png'
    },
    {
      id: 7,
      model: 'XUV400 EV',
      manufacturer: 'Mahindra',
      battery: '34.5 kWh / 39.4 kWh',
      range: '180 km / 220 km',
      efficiency: '78%',
      energyConsumption: '0.192 / 0.179 kWh/km',
      weight: '1570 kg',
      batteryType: 'LFP',
      imageUrl: './images/cars/xuv400.png'
    },
    {
      id: 8,
      model: 'BE 6',
      manufacturer: 'Mahindra',
      battery: '60.0 kWh',
      range: '350 km',
      efficiency: '80%',
      energyConsumption: '0.171 kWh/km',
      weight: '1800 kg',
      batteryType: 'LFP',
      imageUrl: './images/cars/b6-ev.png'
    },
    {
      id: 9,
      model: 'XUV.e9',
      manufacturer: 'Mahindra',
      battery: '60.0 kWh',
      range: '350 km',
      efficiency: '80%',
      energyConsumption: '0.171 kWh/km',
      weight: '1800 kg',
      batteryType: 'LFP',
      imageUrl: './images/cars/xuve69.png'
    },
    {
      id: 10,
      model: 'Atto 3',
      manufacturer: 'BYD',
      battery: '60.48 kWh',
      range: '350 km',
      efficiency: '82%',
      energyConsumption: '0.173 kWh/km',
      weight: '1750 kg',
      batteryType: 'LFP',
      imageUrl: './images/cars/byd-atto-4.png'
    },
    {
      id: 11,
      model: 'Sealion 7',
      manufacturer: 'BYD',
      battery: '82.5 kWh',
      range: '480 km',
      efficiency: '80%',
      energyConsumption: '0.172 kWh/km',
      weight: '2150 kg',
      batteryType: 'NMC',
      imageUrl: './images/cars/byd-seal.png'
    },
    {
      id: 12,
      model: 'Comet EV',
      manufacturer: 'MG Motor India',
      battery: '17.3 kWh',
      range: '140 km',
      efficiency: '75%',
      energyConsumption: '0.124 kWh/km',
      weight: '775 kg',
      batteryType: 'LFP',
      imageUrl: './images/cars/MG-COMET-EV.png'
    },
    {
      id: 13,
      model: 'Tiago EV',
      manufacturer: 'Tata Motors',
      battery: '19.2 kWh / 24 kWh',
      range: '120 km / 160 km',
      efficiency: '78%',
      energyConsumption: '0.160 / 0.150 kWh/km',
      weight: '1235 kg',
      batteryType: 'LFP',
      imageUrl: './images/cars/Tiago-ev.png'
    },
    {
      id: 14,
      model: 'eC3',
      manufacturer: 'Citroën',
      battery: '29.2 kWh',
      range: '180 km',
      efficiency: '78%',
      energyConsumption: '0.162 kWh/km',
      weight: '1316 kg',
      batteryType: 'LFP',
      imageUrl: './images/cars/citroen-ec3.png'
    },
    {
      id: 15,
      model: 'EaS E',
      manufacturer: 'PMV Electric',
      battery: '10.0 kWh',
      range: '80 km',
      efficiency: '70%',
      energyConsumption: '0.125 kWh/km',
      weight: '550 kg',
      batteryType: 'LFP',
      imageUrl: './images/cars/eas-e.png'
    },
    {
      id: 16,
      model: 'Tigor EV',
      manufacturer: 'Tata Motors',
      battery: '26.0 kWh',
      range: '160 km',
      efficiency: '78%',
      energyConsumption: '0.163 kWh/km',
      weight: '1235 kg',
      batteryType: 'LFP',
      imageUrl: './images/cars/tigor-ev.png'
    },
    {
      id: 17,
      model: 'EV6',
      manufacturer: 'Kia',
      battery: '77.4 kWh',
      range: '400 km',
      efficiency: '80%',
      energyConsumption: '0.194 kWh/km',
      weight: '1990 kg',
      batteryType: 'NMC',
      imageUrl: './images/cars/kia-ev6.png'
    },
    {
      id: 18,
      model: 'Ioniq 5',
      manufacturer: 'Hyundai',
      battery: '72.6 kWh',
      range: '380 km',
      efficiency: '80%',
      energyConsumption: '0.191 kWh/km',
      weight: '1830 kg',
      batteryType: 'NMC',
      imageUrl: './images/cars/ioniq-5.png'
    },
    {
      id: 19,
      model: 'iX1',
      manufacturer: 'BMW',
      battery: '66.5 kWh',
      range: '350 km',
      efficiency: '80%',
      energyConsumption: '0.190 kWh/km',
      weight: '2085 kg',
      batteryType: 'NMC',
      imageUrl: './images/cars/bmw-ix1.png'
    },
    {
      id: 20,
      model: 'iX',
      manufacturer: 'BMW',
      battery: '111.5 kWh',
      range: '500 km',
      efficiency: '80%',
      energyConsumption: '0.223 kWh/km',
      weight: '2440 kg',
      batteryType: 'NMC',
      imageUrl: './images/cars/bmw-ix.png'
    },
    {
      id: 21,
      model: 'EQS SUV',
      manufacturer: 'Mercedes-Benz',
      battery: '108.4 kWh',
      range: '520 km',
      efficiency: '80%',
      energyConsumption: '0.208 kWh/km',
      weight: '2585 kg',
      batteryType: 'NMC',
      imageUrl: './images/cars/merc-eqs-suv.png'
    },
    {
      id: 22,
      model: 'e6 / eMAX 7',
      manufacturer: 'BYD',
      battery: '71.7 kWh',
      range: '400 km',
      efficiency: '80%',
      energyConsumption: '0.179 kWh/km',
      weight: '1930 kg',
      batteryType: 'LFP',
      imageUrl: './images/cars/byd-emax-7.png'
    }
  ],
  bikes: [
    {
      id: 1,
      model: 'S1 Air',
      manufacturer: 'Ola Electric',
      battery: '2 kWh / 3 kWh / 4 kWh',
      range: '60 km / 90 km / 120 km',
      efficiency: '70%',
      energyConsumption: '0.033 / 0.033 / 0.033 kWh/km',
      weight: '99 kg',
      batteryType: 'LFP',
      imageUrl: './images/bikes/ola-s1-air.png'
    },
    {
      id: 2,
      model: 'S1X',
      manufacturer: 'Ola Electric',
      battery: '2 kWh / 3 kWh / 4 kWh',
      range: '65 km / 100 km / 125 km',
      efficiency: '70%',
      energyConsumption: '0.031 / 0.030 / 0.032 kWh/km',
      weight: '101 kg',
      batteryType: 'LFP',
      imageUrl: './images/bikes/ola-s1x.png'
    },
    {
      id: 3,
      model: '450X Gen 3',
      manufacturer: 'Ather Energy',
      battery: '3.7 kWh',
      range: '85 km',
      efficiency: '72%',
      energyConsumption: '0.044 kWh/km',
      weight: '111 kg',
      batteryType: 'LFP',
      imageUrl: './images/bikes/ather450x-gen3.png'
    },
    {
      id: 4,
      model: '450 Apex',
      manufacturer: 'Ather Energy',
      battery: '3.7 kWh',
      range: '90 km',
      efficiency: '72%',
      energyConsumption: '0.041 kWh/km',
      weight: '111 kg',
      batteryType: 'LFP',
      imageUrl: './images/bikes/ather-apex.png'
    },
    {
      id: 5,
      model: 'Chetak Premium 2024',
      manufacturer: 'Bajaj Auto',
      battery: '3.2 kWh',
      range: '80 km',
      efficiency: '70%',
      energyConsumption: '0.040 kWh/km',
      weight: '134 kg',
      batteryType: 'LFP',
      imageUrl: './images/bikes/bajaj-chetak.png'
    },
    {
      id: 6,
      model: 'iQube ST',
      manufacturer: 'TVS Motor',
      battery: '5.1 kWh',
      range: '110 km',
      efficiency: '72%',
      energyConsumption: '0.046 kWh/km',
      weight: '128 kg',
      batteryType: 'LFP',
      imageUrl: './images/bikes/tvs-iqube-st.png'
    },
    {
      id: 8,
      model: 'Vida V1 Pro',
      manufacturer: 'Hero MotoCorp',
      battery: '3.94 kWh',
      range: '90 km',
      efficiency: '70%',
      energyConsumption: '0.044 kWh/km',
      weight: '125 kg',
      batteryType: 'LFP',
      imageUrl: './images/bikes/vida-v1.png'
    },
    {
      id: 9,
      model: 'S1 Pro Gen 2',
      manufacturer: 'Ola Electric',
      battery: '4 kWh',
      range: '120 km',
      efficiency: '72%',
      energyConsumption: '0.033 kWh/km',
      weight: '116 kg',
      batteryType: 'LFP',
      imageUrl: './images/bikes/ola-s1pro-gen2.png'
    }
  ]
};

// Add this function at the top after vehicles is defined:
function fixVehicleImagePaths(vehicles) {
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
    vehicles.cars.forEach(car => {
      if (car.imageUrl && !car.imageUrl.startsWith('chrome-extension://')) {
        car.imageUrl = chrome.runtime.getURL(car.imageUrl.replace('./', ''));
      }
    });
    vehicles.bikes.forEach(bike => {
      if (bike.imageUrl && !bike.imageUrl.startsWith('chrome-extension://')) {
        bike.imageUrl = chrome.runtime.getURL(bike.imageUrl.replace('./', ''));
      }
    });
  }
}
fixVehicleImagePaths(vehicles);

// State Management
let state = {
  selectedVehicle: null,
  selectedSpec: null,
  batteryInfo: null,
  vehicles: { cars: [], bikes: [] },
  showSuccessMessage: false,
  selectedVehicleType: null
};

// Load saved state from localStorage
function loadSavedState() {
  const savedState = localStorage.getItem('evbmsState');
  if (savedState) {
    state = JSON.parse(savedState);
    // Ensure vehicles property always exists
    if (!state.vehicles || (!state.vehicles.cars.length && !state.vehicles.bikes.length)) {
      state.vehicles = vehicles;
    }
  } else {
    state.vehicles = vehicles;
  }
  state.showSuccessMessage = false; // Always reset this flag on load
  updateUI();
}

// Save state to localStorage
function saveState() {
  // Create a copy of state without showSuccessMessage
  const { showSuccessMessage, ...stateToSave } = state;
  localStorage.setItem('evbmsState', JSON.stringify(stateToSave));
}

// Helper function to check if a vehicle has multiple specifications
function hasMultipleSpecs(vehicle) {
  return vehicle.battery.includes('/') || vehicle.range.includes('/');
}

// Helper function to parse vehicle specs
function parseVehicleSpecs(vehicle) {
  const specs = [];
  
  const batteryValues = vehicle.battery.split('/').map(b => b.trim());
  const rangeValues = vehicle.range.split('/').map(r => r.trim());
  const energyValues = vehicle.energyConsumption.includes('/')
    ? vehicle.energyConsumption.split('/').map(e => e.trim())
    : [vehicle.energyConsumption];
  const batteryTypes = vehicle.batteryType.includes('/')
    ? vehicle.batteryType.split('/').map(t => t.trim())
    : [vehicle.batteryType];
  
  const count = Math.max(batteryValues.length, rangeValues.length);
  
  for (let i = 0; i < count; i++) {
    specs.push({
      battery: batteryValues[i < batteryValues.length ? i : 0],
      range: rangeValues[i < rangeValues.length ? i : 0],
      energyConsumption: energyValues[i < energyValues.length ? i : 0],
      batteryType: batteryTypes[i < batteryTypes.length ? i : 0]
    });
  }
  
  return specs;
}

// Helper function to format values and always append unit
function formatWithUnit(value, unit) {
  // Remove any existing unit and append the correct one
  return value
    .split('/')
    .map(v => v.trim().replace(new RegExp(`\\s*${unit}\\s*`, 'i'), '') + unit)
    .join('/');
}

// Create vehicle card
function createVehicleCard(vehicle) {
  const card = document.createElement('div');
  card.className = `vehicle-card flex-shrink-0 bg-white border rounded-lg p-4 w-full max-w-[90vw] min-w-[200px] cursor-pointer transition-all duration-300 ${state.selectedVehicle?.id === vehicle.id ? 'selected' : ''}`;

  // Format battery, range, and energyConsumption
  const battery = formatWithUnit(vehicle.battery, 'kWh');
  const range = formatWithUnit(vehicle.range, 'km');
  const energyConsumption = formatWithUnit(vehicle.energyConsumption, 'kWh/km');

  card.innerHTML = `
    <div class="w-24 h-24 mx-auto mb-3 flex items-center justify-center">
      ${vehicle.imageUrl
        ? `<img src="${vehicle.imageUrl}" alt="${vehicle.model}" class="w-full h-full object-contain">`
        : `<div class="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">No image</div>`
      }
    </div>
    <h3 class="text-center font-semibold text-lg">${vehicle.manufacturer} ${vehicle.model}</h3>
    <p class="text-center text-gray-600 text-sm mt-1">Battery: ${battery}</p>
    <p class="text-center text-gray-600 text-sm">Range: ${range}</p>
    ${hasMultipleSpecs(vehicle) 
      ? '<div class="mt-2 text-center"><span class="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">Multiple Specs</span></div>'
      : ''
    }
    ${state.selectedVehicle?.id === vehicle.id
      ? '<div class="mt-2 text-center"><span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Selected</span></div>'
      : ''
    }
  `;

  card.onclick = () => selectVehicle(vehicle);
  return card;
}

// Select vehicle
function selectVehicle(vehicle) {
  state.selectedVehicle = vehicle;
  state.selectedSpec = null;
  const specSelector = document.getElementById('specificationSelector');
  if (hasMultipleSpecs(vehicle)) {
    populateSpecSelector(vehicle);
    if (specSelector) {
      specSelector.classList.remove('hidden');
      specSelector.style.display = '';
    }
  } else {
    if (specSelector) {
      specSelector.classList.add('hidden');
      specSelector.style.display = 'none';
    }
  }
  // Show battery section when vehicle is selected
  const batterySection = document.getElementById('batterySection');
  if (batterySection) batterySection.classList.remove('hidden');
  updateUI();
  saveState();
}

// Populate specification selector
function populateSpecSelector(vehicle) {
  const specOptions = document.getElementById('specOptions');
  if (!specOptions) return;
  specOptions.innerHTML = '';
  
  const specs = parseVehicleSpecs(vehicle);
  
  specs.forEach((spec, index) => {
    const battery = formatWithUnit(spec.battery, 'kWh');
    const range = formatWithUnit(spec.range, 'km');
    const option = document.createElement('div');
    option.className = `spec-option p-3 cursor-pointer border-b last:border-b-0 ${(state.selectedSpec !== null && index === state.selectedSpec) ? 'selected' : ''}`;
    option.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <div class="font-medium">Variant ${index + 1}</div>
          <div class="text-sm">Battery: ${battery}</div>
          <div class="text-sm">Range: ${range}</div>
        </div>
        ${(state.selectedSpec !== null && index === state.selectedSpec) 
          ? '<div class="text-indigo-600">✓</div>'
          : ''
        }
      </div>
    `;
    
    option.onclick = () => {
      state.selectedSpec = index;
      updateUI();
      saveState();
    };
    
    specOptions.appendChild(option);
  });
}

// Toggle SoH info modal
function toggleSohInfo() {
  const modal = document.getElementById('sohInfoModal');
  modal.classList.toggle('hidden');
}

// Function to handle battery information
function saveBatteryInfo() {
  const rangeInput = document.getElementById('inputRange');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  const nextBtn = document.getElementById('nextBtn');
  const saveBtn = document.getElementById('saveBtn');

  // Clear previous messages
  if (errorMessage) errorMessage.classList.add('hidden');
  if (successMessage) successMessage.classList.add('hidden');

  // Get and validate range input
  const rangeValue = rangeInput ? rangeInput.value.trim() : '';
  if (!rangeValue) {
    if (errorMessage) {
      errorMessage.textContent = 'Please enter your vehicle\'s range';
      errorMessage.classList.remove('hidden');
    }
    return;
  }

  // Extract numeric value from range input
  const rangeMatch = rangeValue.match(/(\d+(?:\.\d+)?)/);
  if (!rangeMatch) {
    if (errorMessage) {
      errorMessage.textContent = 'Please enter a valid range value';
      errorMessage.classList.remove('hidden');
    }
    return;
  }

  const range = parseFloat(rangeMatch[1]);
  if (isNaN(range) || range <= 0) {
    if (errorMessage) {
      errorMessage.textContent = 'Please enter a valid range value';
      errorMessage.classList.remove('hidden');
    }
    return;
  }

  // Calculate SoH based on range
  const selectedVehicle = state.selectedVehicle;
  if (!selectedVehicle) {
    if (errorMessage) {
      errorMessage.textContent = 'Please select a vehicle first';
      errorMessage.classList.remove('hidden');
    }
    return;
  }

  // Get the original range from the selected specification
  const specs = parseVehicleSpecs(selectedVehicle);
  let specIdx = (typeof state.selectedSpec === 'number' && state.selectedSpec >= 0 && state.selectedSpec < specs.length) ? state.selectedSpec : 0;
  const currentSpec = specs[specIdx];
  if (!currentSpec || !currentSpec.range) {
    if (errorMessage) {
      errorMessage.textContent = 'Invalid vehicle range specification';
      errorMessage.classList.remove('hidden');
    }
    return;
  }
  const originalRangeMatch = currentSpec.range.match(/(\d+(?:\.\d+)?)/);
  if (!originalRangeMatch) {
    if (errorMessage) {
      errorMessage.textContent = 'Invalid vehicle range specification';
      errorMessage.classList.remove('hidden');
    }
    return;
  }

  const originalRange = parseFloat(originalRangeMatch[1]);
  const calculatedSoH = ((range / originalRange) * 100).toFixed(2);
  if (parseFloat(calculatedSoH) > 100) {
    if (errorMessage) {
      errorMessage.textContent = 'Calculated SoH cannot be greater than 100%. Please enter a correct range.';
      errorMessage.classList.remove('hidden');
    }
    return;
  }

  // Save the calculated SoH and range
  state.batteryInfo = {
    type: 'range',
    value: range.toString(),
    estimatedSoH: `${calculatedSoH}%`
  };
  state.showSuccessMessage = true;
  saveState();

  // Update UI
  updateUI();
  if (saveBtn) saveBtn.disabled = true;
  if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.classList.remove('opacity-75', 'cursor-not-allowed');
  }
}

// Function to show battery input field
function showBatteryField(type) {
  const sohField = document.getElementById('sohField');
  const rangeField = document.getElementById('rangeField');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');

  // Clear any existing messages
  if (errorMessage) errorMessage.classList.add('hidden');
  if (successMessage) successMessage.classList.add('hidden');

  if (type === 'soh') {
    if (sohField) sohField.classList.remove('hidden');
    if (rangeField) rangeField.classList.add('hidden');
    if (btnYes) btnYes.classList.add('bg-blue-600');
    if (btnNo) btnNo.classList.remove('bg-blue-600');
  } else {
    if (sohField) sohField.classList.add('hidden');
    if (rangeField) rangeField.classList.remove('hidden');
    if (btnYes) btnYes.classList.remove('bg-blue-600');
    if (btnNo) btnNo.classList.add('bg-blue-600');
  }
  const inputRangeElem = document.getElementById('inputRange');
  if (inputRangeElem && errorMessage) {
    inputRangeElem.addEventListener('input', function() {
      errorMessage.classList.add('hidden');
      errorMessage.innerHTML = '';
    });
  }
}

// Function to clear all selections
function clearSelections() {
  state = {
    selectedVehicle: null,
    selectedSpec: null,
    batteryInfo: null,
    vehicles: { cars: [], bikes: [] },
    showSuccessMessage: false,
    selectedVehicleType: null
  };
  saveState();

  // Reset UI elements
  const vehicleTypeElem = document.getElementById('vehicleType');
  if (vehicleTypeElem) vehicleTypeElem.value = '';
  const vehicleModelsElem = document.getElementById('vehicleModels');
  if (vehicleModelsElem) vehicleModelsElem.classList.add('hidden');
  const carModelsElem = document.getElementById('carModels');
  if (carModelsElem) carModelsElem.classList.add('hidden');
  const bikeModelsElem = document.getElementById('bikeModels');
  if (bikeModelsElem) bikeModelsElem.classList.add('hidden');
  const specificationSelectorElem = document.getElementById('specificationSelector');
  if (specificationSelectorElem) {
    specificationSelectorElem.classList.add('hidden');
    specificationSelectorElem.style.display = 'none';
  }
  const batterySectionElem = document.getElementById('batterySection');
  if (batterySectionElem) batterySectionElem.classList.add('hidden');
  const inputRangeElem = document.getElementById('inputRange');
  if (inputRangeElem) inputRangeElem.value = '';
  const errorMessageElem = document.getElementById('errorMessage');
  if (errorMessageElem) errorMessageElem.classList.add('hidden');
  const successMessageElem = document.getElementById('successMessage');
  if (successMessageElem) successMessageElem.classList.add('hidden');
  const saveBtnElem = document.getElementById('saveBtn');
  if (saveBtnElem) saveBtnElem.disabled = false;
  const nextBtnElem = document.getElementById('nextBtn');
  if (nextBtnElem) {
    nextBtnElem.disabled = true;
    nextBtnElem.classList.add('opacity-75', 'cursor-not-allowed');
  }
  // Reset progress indicators
  const step1Elem = document.getElementById('step1');
  if (step1Elem) {
    step1Elem.classList.remove('bg-blue-500');
    step1Elem.classList.add('bg-gray-200', 'text-gray-500');
  }
  const step2Elem = document.getElementById('step2');
  if (step2Elem) {
    step2Elem.classList.remove('bg-blue-500');
    step2Elem.classList.add('bg-gray-200', 'text-gray-500');
  }
  const step3Elem = document.getElementById('step3');
  if (step3Elem) {
    step3Elem.classList.remove('bg-blue-500');
    step3Elem.classList.add('bg-gray-200', 'text-gray-500');
  }
  const connector1Elem = document.getElementById('connector1');
  if (connector1Elem) {
    connector1Elem.classList.remove('bg-blue-500');
    connector1Elem.classList.add('bg-gray-200');
  }
  const connector2Elem = document.getElementById('connector2');
  if (connector2Elem) {
    connector2Elem.classList.remove('bg-blue-500');
    connector2Elem.classList.add('bg-gray-200');
  }

  // Reset chatbot UI to initial state
  const chatbotContainer = document.getElementById('chatbot-container');
  if (chatbotContainer) {
    chatbotContainer.innerHTML = `
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-actions" id="chat-actions"></div>
      <form class="chat-input-area" id="chat-form" autocomplete="off" style="margin-top:0.5rem;">
        <div class="input-box">
          <input id="chat-input" type="text" placeholder="Type your response..." autocomplete="off" />
          <button id="send-btn" type="submit" aria-label="Send">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </form>
    `;
    const chatMessages = document.getElementById('chat-messages');
    const chatActions = document.getElementById('chat-actions');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    // Add initial bot message
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.textContent = "Hi ! Let's get started with your EV details";
    chatMessages.appendChild(botBubble);
    // Add auto suggestion buttons (TOP ONLY)
    const suggestions = ['Sure!', "Let's go!", 'Ready!'];
    const suggestionRow = document.createElement('div');
    suggestionRow.className = 'suggestion-row';
    suggestions.forEach(text => {
      const btn = document.createElement('button');
      btn.textContent = text;
      btn.className = 'chat-btn-suggestion';
      btn.addEventListener('click', function() {
        // Show user bubble with selected suggestion
        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble user';
        userBubble.textContent = text;
        chatMessages.appendChild(userBubble);
        suggestionRow.remove(); // Remove the suggestion row after selection
        chatForm.style.display = 'none';
        // Move to next step: Ask for vehicle type
        const botReply = document.createElement('div');
        botReply.className = 'chat-bubble bot';
        // Place text and buttons in separate blocks for next-line layout
        const vehicleTypeText = document.createElement('div');
        vehicleTypeText.textContent = 'Please select your vehicle type';
        vehicleTypeText.style.marginBottom = '0.7rem';
        botReply.appendChild(vehicleTypeText);
        const buttonRow = document.createElement('div');
        buttonRow.style.display = 'flex';
        buttonRow.style.justifyContent = 'center';
        buttonRow.style.gap = '0.7rem';
        buttonRow.style.marginBottom = '2.5rem';
        ['Car', 'Bike'].forEach(type => {
          const btn2 = document.createElement('button');
          btn2.textContent = type;
          btn2.className = 'chat-btn-suggestion';
          btn2.addEventListener('click', function() {
            if (state.selectedVehicleType && state.selectedVehicleType !== type) {
              alert('Please clear your selection before choosing another vehicle type.');
              return;
            }
            state.selectedVehicleType = type;
            const userBubble2 = document.createElement('div');
            userBubble2.className = 'chat-bubble user';
            userBubble2.textContent = type;
            chatMessages.appendChild(userBubble2);
            chatActions.innerHTML = '';
            chatActions.classList.remove('center-actions');
            chatActions.classList.remove('tight-below');
            // Show car cards if Car is selected
            if (type === 'Car') {
              const botReply2 = document.createElement('div');
              botReply2.className = 'chat-bubble bot';
              botReply2.textContent = 'Please select your car';
              chatMessages.appendChild(botReply2);
              // Create car cards container
              const carCardsContainer = document.createElement('div');
              carCardsContainer.className = 'vehicle-cards-scroll';
              vehicles.cars.forEach(car => {
                const card = document.createElement('div');
                card.className = 'vehicle-card-select';
                card.innerHTML = `
                  <img src="${car.imageUrl}" alt="${car.model}" class="vehicle-card-img" />
                  <div class="vehicle-card-title">${car.manufacturer} ${car.model}</div>
                  <div class="vehicle-card-detail">Battery: ${car.battery}</div>
                  <div class="vehicle-card-detail">Range: ${car.range}</div>
                  ${car.battery.includes('/') || car.range.includes('/') ? '<div class="vehicle-card-multispec">Multiple Specs</div>' : ''}
                `;
                card.addEventListener('click', function() {
                  removePreviousVehicleBubbles();
                  state.selectedVehicle = car;
                  state.selectedSpec = null;
                  updateSelectedVehicleInfo(car, null);
                  if (hasMultipleSpecs(car)) {
                    showVariantSelection(car);
                  } else {
                    showRangeQuestion();
                  }
                  updateUI();
                });
                carCardsContainer.appendChild(card);
              });
              chatMessages.appendChild(carCardsContainer);
              chatbotContainer.appendChild(carCardsContainer);
            }
            // Further steps for Bike can be added here
            if (type === 'Bike') {
              const botReply2 = document.createElement('div');
              botReply2.className = 'chat-bubble bot';
              botReply2.textContent = 'Please select your bike';
              chatMessages.appendChild(botReply2);
              // Create bike cards container
              const bikeCardsContainer = document.createElement('div');
              bikeCardsContainer.className = 'vehicle-cards-scroll';
              vehicles.bikes.forEach(bike => {
                const card = document.createElement('div');
                card.className = 'vehicle-card-select';
                card.innerHTML = `
                  <img src="${bike.imageUrl}" alt="${bike.model}" class="vehicle-card-img" />
                  <div class="vehicle-card-title">${bike.manufacturer} ${bike.model}</div>
                  <div class="vehicle-card-detail">Battery: ${bike.battery}</div>
                  <div class="vehicle-card-detail">Range: ${bike.range}</div>
                  ${bike.battery.includes('/') || bike.range.includes('/') ? '<div class="vehicle-card-multispec">Multiple Specs</div>' : ''}
                `;
                card.addEventListener('click', function() {
                  removePreviousVehicleBubbles();
                  state.selectedVehicle = bike;
                  state.selectedSpec = null;
                  updateSelectedVehicleInfo(bike, null);
                  if (hasMultipleSpecs(bike)) {
                    showVariantSelection(bike);
                  } else {
                    showRangeQuestion();
                  }
                  updateUI();
                });
                bikeCardsContainer.appendChild(card);
              });
              chatMessages.appendChild(bikeCardsContainer);
              chatbotContainer.appendChild(bikeCardsContainer);
            }
          });
          buttonRow.appendChild(btn2);
        });
        botReply.appendChild(buttonRow);
        chatMessages.appendChild(botReply);
        chatActions.innerHTML = '';
        chatActions.classList.remove('center-actions');
        chatActions.classList.remove('tight-below');
      });
      suggestionRow.appendChild(btn);
    });
    chatMessages.appendChild(suggestionRow);
  }

  // Clear all main UI sections except chatbot
  const selectedVehicleInfo = document.getElementById('selected-vehicle-info');
  if (selectedVehicleInfo) selectedVehicleInfo.innerHTML = '';
  const rangeQuestionContainer = document.getElementById('range-question-container');
  if (rangeQuestionContainer) rangeQuestionContainer.innerHTML = '';
  const variantSelectionContainer = document.getElementById('variant-selection-container');
  if (variantSelectionContainer) variantSelectionContainer.innerHTML = '';

  updateUI(); // Ensure UI is refreshed after clearing
}

// Function to handle next button click
function handleNext() {
  if (!state.selectedVehicle || !state.batteryInfo) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = 'Please save battery information first';
    errorMessage.classList.remove('hidden');
    return;
  }

  // Get the current specification
  const specs = parseVehicleSpecs(state.selectedVehicle);
  const currentSpec = specs[Math.min(state.selectedSpec, specs.length - 1)];

  // Create URL parameters
  const params = new URLSearchParams();
  params.append('vehicleId', state.selectedVehicle.id);
  const vehicleTypeElem = document.getElementById('vehicleType');
  params.append('vehicleType', vehicleTypeElem ? vehicleTypeElem.value : (state.selectedVehicleType ? state.selectedVehicleType.toLowerCase() : ''));
  params.append('manufacturer', state.selectedVehicle.manufacturer);
  params.append('model', state.selectedVehicle.model);
  
  // Technical specifications
  params.append('battery', currentSpec.battery);
  params.append('range', currentSpec.range);
  params.append('efficiency', state.selectedVehicle.efficiency || '');
  params.append('energyConsumption', currentSpec.energyConsumption);
  params.append('weight', state.selectedVehicle.weight || '');
  params.append('batteryType', currentSpec.batteryType);
  
  // Battery health information
  params.append('soh', state.batteryInfo.estimatedSoH);
  params.append('sohType', state.batteryInfo.type);
  params.append('sohValue', state.batteryInfo.value);

  // Navigate to map.html with parameters
  window.location.href = `../map/map.html?${params.toString()}`;
}

// Update UI based on state
function updateUI() {
  const vehicleTypeElem = document.getElementById('vehicleType');
  const carModels = document.getElementById('carModels');
  const bikeModels = document.getElementById('bikeModels');
  const specSelector = document.getElementById('specificationSelector');

  // Always hide spec selector unless a vehicle is selected and has multiple specs
  if (specSelector) {
    specSelector.classList.add('hidden');
    specSelector.style.display = 'none';
  }

  if (vehicleTypeElem && carModels && bikeModels) {
    if (vehicleTypeElem.value === 'car') {
      carModels.classList.remove('hidden');
      bikeModels.classList.add('hidden');
    } else if (vehicleTypeElem.value === 'bike') {
      bikeModels.classList.remove('hidden');
      carModels.classList.add('hidden');
    } else {
      carModels.classList.add('hidden');
      bikeModels.classList.add('hidden');
    }
    // Debug patch: force display property
    carModels.style.display = (vehicleTypeElem.value === 'car') ? '' : 'none';
    bikeModels.style.display = (vehicleTypeElem.value === 'bike') ? '' : 'none';
  }
  
  if (state.selectedVehicle && hasMultipleSpecs(state.selectedVehicle)) {
    populateSpecSelector(state.selectedVehicle);
    if (specSelector) {
      specSelector.classList.remove('hidden');
      specSelector.style.display = '';
    }
  }

  const batterySection = document.getElementById('batterySection');
  const nextBtn = document.getElementById('nextBtn');

  if (state.selectedVehicle) {
    if (batterySection) {
      batterySection.classList.remove('opacity-70');
      batterySection.classList.remove('hidden');
    }
  } else {
    if (batterySection) {
      batterySection.classList.add('opacity-70');
      batterySection.classList.add('hidden');
    }
  }

  // Update progress indicators
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  const connector1 = document.getElementById('connector1');
  const connector2 = document.getElementById('connector2');

  // Reset all steps to default state
  if (step1) {
    step1.classList.remove('bg-blue-500', 'bg-green-500');
    step1.classList.add('bg-gray-200', 'text-gray-500');
  }
  if (step2) {
    step2.classList.remove('bg-blue-500', 'bg-green-500');
    step2.classList.add('bg-gray-200', 'text-gray-500');
  }
  if (step3) {
    step3.classList.remove('bg-blue-500', 'bg-green-500');
    step3.classList.add('bg-gray-200', 'text-gray-500');
  }
  if (connector1) {
    connector1.classList.remove('bg-blue-500', 'bg-green-500');
    connector1.classList.add('bg-gray-200');
  }
  if (connector2) {
    connector2.classList.remove('bg-blue-500', 'bg-green-500');
    connector2.classList.add('bg-gray-200');
  }

  // Update steps based on progress
  if (state.selectedVehicle) {
    if (step1) {
      step1.classList.remove('bg-gray-200', 'text-gray-500');
      step1.classList.add('bg-green-500', 'text-white');
    }
    if (connector1) {
      connector1.classList.remove('bg-gray-200');
      connector1.classList.add('bg-green-500');
    }
    if (step2) {
      step2.classList.remove('bg-gray-200', 'text-gray-500');
      step2.classList.add('bg-blue-500', 'text-white');
    }
  }

  if (state.batteryInfo) {
    if (step2) {
      step2.classList.remove('bg-blue-500');
      step2.classList.add('bg-green-500');
    }
    if (connector2) {
      connector2.classList.remove('bg-gray-200');
      connector2.classList.add('bg-green-500');
    }
    if (step3) {
      step3.classList.remove('bg-gray-200', 'text-gray-500');
      step3.classList.add('bg-blue-500', 'text-white');
    }
    if (nextBtn) {
      nextBtn.classList.remove('opacity-75', 'cursor-not-allowed');
      nextBtn.disabled = false;
    }
  }

  const successMessage = document.getElementById('successMessage');
  if (successMessage) {
    if (state.showSuccessMessage) {
      successMessage.classList.remove('hidden');
    } else {
      successMessage.classList.add('hidden');
    }
    // Always reset the flag after showing
    state.showSuccessMessage = false;
  }

  renderActionBar();
}

// Initialize
loadSavedState();

// Helper function to group vehicles by type (heuristic: if model or manufacturer matches known bikes, else car)
function groupVehiclesByType(vehicles) {
  // List of known bike manufacturers/models (expand as needed)
  const bikeManufacturers = [
    'Ola Electric', 'Ather Energy', 'Bajaj Auto', 'TVS Motor', 'Hero MotoCorp'
  ];
  const bikeModels = [
    'S1 Air', 'S1X', '450X Gen 3', '450 Apex', 'Chetak Premium 2024', 'iQube ST', 'Vida V1 Pro', 'S1 Pro Gen 2'
  ];
  const cars = [];
  const bikes = [];
  vehicles.forEach(v => {
    if (bikeManufacturers.includes(v.manufacturer) || bikeModels.includes(v.model)) {
      bikes.push(mapDbVehicleToFrontend(v));
    } else {
      cars.push(mapDbVehicleToFrontend(v));
    }
  });
  return { cars, bikes };
}

// Map DB vehicle fields to frontend format
function mapDbVehicleToFrontend(v) {
  return {
    id: v.vehicle_id,
    model: v.model,
    manufacturer: v.manufacturer,
    battery: v.battery_capacity ? v.battery_capacity + ' kWh' : '',
    range: v.range ? v.range + ' km' : '',
    efficiency: v.efficiency ? v.efficiency + '%' : '',
    energyConsumption: v.energy_consumption ? v.energy_consumption + ' kWh/km' : '',
    weight: v.weight ? v.weight + ' kg' : '',
    batteryType: v.battery_type || '',
    imageUrl: v.image_url || ''
  };
}

// Fetch vehicles from backend and initialize
async function fetchVehiclesFromBackend() {
  try {
    console.log('Fetching vehicles from backend...');
    const response = await fetch('http://127.0.0.1:5001/api/vehicles');
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    const vehicles = await response.json();
    console.log('Fetched vehicles:', vehicles);
    return vehicles;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }
}

// Initialize the application
async function initializeApp() {
  console.log('Initializing app...');
  try {
    // Load saved state
    loadSavedState();
    console.log('Saved state loaded');

    console.log('App initialization complete');
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// Call initializeApp when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, starting initialization...');
  initializeApp();

  // Main action buttons
  const clearBtn = document.getElementById('clearBtn');
  const saveBtn = document.getElementById('saveBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (clearBtn) clearBtn.addEventListener('click', clearSelections);
  if (saveBtn) saveBtn.addEventListener('click', saveBatteryInfo);
  if (nextBtn) nextBtn.addEventListener('click', handleNext);

  // Clear the page automatically when the user lands on the estimate page (first load)
  (function() {
    if (performance && performance.navigation && performance.navigation.type === 1) {
      // This is a reload, don't clear again
      return;
    }
    if (!sessionStorage.getItem('estimatePageCleared')) {
      clearSelections();
      sessionStorage.setItem('estimatePageCleared', 'true');
    }
  })();

  // Chatbot main logic
  const chatbotContainer = document.getElementById('chatbot-container');
  if (chatbotContainer) {
    chatbotContainer.innerHTML = `
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-actions" id="chat-actions"></div>
      <form class="chat-input-area" id="chat-form" autocomplete="off" style="margin-top:0.5rem;">
        <div class="input-box">
          <input id="chat-input" type="text" placeholder="Type your response..." autocomplete="off" />
          <button id="send-btn" type="submit" aria-label="Send">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </form>
    `;
    const chatMessages = document.getElementById('chat-messages');
    const chatActions = document.getElementById('chat-actions');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    // Add initial bot message
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.textContent = "Hi ! Let's get started with your EV details";
    chatMessages.appendChild(botBubble);
    // Add auto suggestion buttons (TOP ONLY)
    const suggestions = ['Sure!', "Let's go!", 'Ready!'];
    const suggestionRow = document.createElement('div');
    suggestionRow.className = 'suggestion-row';
    suggestions.forEach(text => {
      const btn = document.createElement('button');
      btn.textContent = text;
      btn.className = 'chat-btn-suggestion';
      btn.addEventListener('click', function() {
        // Show user bubble with selected suggestion
        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble user';
        userBubble.textContent = text;
        chatMessages.appendChild(userBubble);
        suggestionRow.remove(); // Remove the suggestion row after selection
        chatForm.style.display = 'none';
        // Move to next step: Ask for vehicle type
        const botReply = document.createElement('div');
        botReply.className = 'chat-bubble bot';
        // Place text and buttons in separate blocks for next-line layout
        const vehicleTypeText = document.createElement('div');
        vehicleTypeText.textContent = 'Please select your vehicle type';
        vehicleTypeText.style.marginBottom = '0.7rem';
        botReply.appendChild(vehicleTypeText);
        const buttonRow = document.createElement('div');
        buttonRow.style.display = 'flex';
        buttonRow.style.justifyContent = 'center';
        buttonRow.style.gap = '0.7rem';
        buttonRow.style.marginBottom = '2.5rem';
        ['Car', 'Bike'].forEach(type => {
          const btn2 = document.createElement('button');
          btn2.textContent = type;
          btn2.className = 'chat-btn-suggestion';
          btn2.addEventListener('click', function() {
            if (state.selectedVehicleType && state.selectedVehicleType !== type) {
              alert('Please clear your selection before choosing another vehicle type.');
              return;
            }
            state.selectedVehicleType = type;
            const userBubble2 = document.createElement('div');
            userBubble2.className = 'chat-bubble user';
            userBubble2.textContent = type;
            chatMessages.appendChild(userBubble2);
            chatActions.innerHTML = '';
            chatActions.classList.remove('center-actions');
            chatActions.classList.remove('tight-below');
            // Show car cards if Car is selected
            if (type === 'Car') {
              const botReply2 = document.createElement('div');
              botReply2.className = 'chat-bubble bot';
              botReply2.textContent = 'Please select your car';
              chatMessages.appendChild(botReply2);
              // Create car cards container
              const carCardsContainer = document.createElement('div');
              carCardsContainer.className = 'vehicle-cards-scroll';
              vehicles.cars.forEach(car => {
                const card = document.createElement('div');
                card.className = 'vehicle-card-select';
                card.innerHTML = `
                  <img src="${car.imageUrl}" alt="${car.model}" class="vehicle-card-img" />
                  <div class="vehicle-card-title">${car.manufacturer} ${car.model}</div>
                  <div class="vehicle-card-detail">Battery: ${car.battery}</div>
                  <div class="vehicle-card-detail">Range: ${car.range}</div>
                  ${car.battery.includes('/') || car.range.includes('/') ? '<div class="vehicle-card-multispec">Multiple Specs</div>' : ''}
                `;
                card.addEventListener('click', function() {
                  removePreviousVehicleBubbles();
                  state.selectedVehicle = car;
                  state.selectedSpec = null;
                  updateSelectedVehicleInfo(car, null);
                  if (hasMultipleSpecs(car)) {
                    showVariantSelection(car);
                  } else {
                    showRangeQuestion();
                  }
                  updateUI();
                });
                carCardsContainer.appendChild(card);
              });
              chatMessages.appendChild(carCardsContainer);
              chatbotContainer.appendChild(carCardsContainer);
            }
            // Further steps for Bike can be added here
            if (type === 'Bike') {
              const botReply2 = document.createElement('div');
              botReply2.className = 'chat-bubble bot';
              botReply2.textContent = 'Please select your bike';
              chatMessages.appendChild(botReply2);
              // Create bike cards container
              const bikeCardsContainer = document.createElement('div');
              bikeCardsContainer.className = 'vehicle-cards-scroll';
              vehicles.bikes.forEach(bike => {
                const card = document.createElement('div');
                card.className = 'vehicle-card-select';
                card.innerHTML = `
                  <img src="${bike.imageUrl}" alt="${bike.model}" class="vehicle-card-img" />
                  <div class="vehicle-card-title">${bike.manufacturer} ${bike.model}</div>
                  <div class="vehicle-card-detail">Battery: ${bike.battery}</div>
                  <div class="vehicle-card-detail">Range: ${bike.range}</div>
                  ${bike.battery.includes('/') || bike.range.includes('/') ? '<div class="vehicle-card-multispec">Multiple Specs</div>' : ''}
                `;
                card.addEventListener('click', function() {
                  removePreviousVehicleBubbles();
                  state.selectedVehicle = bike;
                  state.selectedSpec = null;
                  updateSelectedVehicleInfo(bike, null);
                  if (hasMultipleSpecs(bike)) {
                    showVariantSelection(bike);
                  } else {
                    showRangeQuestion();
                  }
                  updateUI();
                });
                bikeCardsContainer.appendChild(card);
              });
              chatMessages.appendChild(bikeCardsContainer);
              chatbotContainer.appendChild(bikeCardsContainer);
            }
          });
          buttonRow.appendChild(btn2);
        });
        botReply.appendChild(buttonRow);
        chatMessages.appendChild(botReply);
        chatActions.innerHTML = '';
        chatActions.classList.remove('center-actions');
        chatActions.classList.remove('tight-below');
      });
      suggestionRow.appendChild(btn);
    });
    chatMessages.appendChild(suggestionRow);

    // Opt-out phrases
    const optOutPhrases = [
      'Not now', 'Maybe later', 'Skip this step', "I'll do it later", 'Can I skip this?',
      "Don't want to do this now", "I'm not ready", 'This is not for me', 'No thanks',
      "I don't feel like it", "I don't want to share", "I'm just looking around",
      'Just exploring', "I don't own any EV", "I haven't bought one yet",
      "I'm not an EV user", 'I use a petrol car', 'I use public transport',
      "I don't have a vehicle", "I'm here just to see how this works",
      "I'm not interested in this", "I don't want to add my details",
      "I don't want to proceed", 'Why do you need that?', 'Is that necessary?',
      'Do I have to?', "What if I don't?", 'What does that mean?',
      'What do you mean by EV details?', 'This is confusing',
      'I came here by mistake', 'Wrong app', 'Just testing this',
      'Just checking things', 'Leave me alone', 'Stop asking', 'No',
      'Nope', 'Nah', 'Never mind', 'Cancel', 'Go back', 'Exit', 'Back',
      'I changed my mind', 'This is annoying', "Don't ask again",
      'Is there a guest mode?', 'Can I use this without adding a vehicle?',
      'I want to explore first', "I'll add details later",
      "I don't remember my EV model", "I'm using someone else's vehicle",
      
      "It's a shared EV, not mine", "I'm just comparing prices",
      'I only want to check charging stations', "I'm just here for the battery calculator",
      'Just here for news', 'Just here for updates'
    ];
    // Handle text input submit
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const value = chatInput.value.trim();
      if (!value) return;
      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble user';
      userBubble.textContent = value;
      chatMessages.appendChild(userBubble);
      chatActions.innerHTML = '';
      chatForm.style.display = 'none';
      chatInput.value = '';
      // Check for opt-out
      const normalized = value.replace(/'/g, "'").toLowerCase();
      const isOptOut = optOutPhrases.some(phrase => normalized === phrase.replace(/'/g, "'").toLowerCase());
      if (isOptOut) {
        const botReply = document.createElement('div');
        botReply.className = 'chat-bubble bot';
        botReply.textContent = 'No problem !';
        chatMessages.appendChild(botReply);
        return;
      }
      // Move Car and Bike buttons inline with the message
      const botReply = document.createElement('div');
      botReply.className = 'chat-bubble bot';
      // Place text and buttons in separate blocks for next-line layout
      const vehicleTypeText = document.createElement('div');
      vehicleTypeText.textContent = 'Please select your vehicle type';
      vehicleTypeText.style.marginBottom = '0.7rem';
      botReply.appendChild(vehicleTypeText);
      const buttonRow = document.createElement('div');
      buttonRow.style.display = 'flex';
      buttonRow.style.justifyContent = 'center';
      buttonRow.style.gap = '0.7rem';
      buttonRow.style.marginBottom = '2.5rem';
      ['Car', 'Bike'].forEach(type => {
        const btn2 = document.createElement('button');
        btn2.textContent = type;
        btn2.className = 'chat-btn-suggestion';
        btn2.addEventListener('click', function() {
          if (state.selectedVehicleType && state.selectedVehicleType !== type) {
            alert('Please clear your selection before choosing another vehicle type.');
            return;
          }
          state.selectedVehicleType = type;
          const userBubble2 = document.createElement('div');
          userBubble2.className = 'chat-bubble user';
          userBubble2.textContent = type;
          chatMessages.appendChild(userBubble2);
          chatActions.innerHTML = '';
          chatActions.classList.remove('center-actions');
          chatActions.classList.remove('tight-below');
          // Show car cards if Car is selected
          if (type === 'Car') {
            const botReply2 = document.createElement('div');
            botReply2.className = 'chat-bubble bot';
            botReply2.textContent = 'Please select your car';
            chatMessages.appendChild(botReply2);
            // Create car cards container
            const carCardsContainer = document.createElement('div');
            carCardsContainer.className = 'vehicle-cards-scroll';
            vehicles.cars.forEach(car => {
              const card = document.createElement('div');
              card.className = 'vehicle-card-select';
              card.innerHTML = `
                <img src="${car.imageUrl}" alt="${car.model}" class="vehicle-card-img" />
                <div class="vehicle-card-title">${car.manufacturer} ${car.model}</div>
                <div class="vehicle-card-detail">Battery: ${car.battery}</div>
                <div class="vehicle-card-detail">Range: ${car.range}</div>
                ${car.battery.includes('/') || car.range.includes('/') ? '<div class="vehicle-card-multispec">Multiple Specs</div>' : ''}
              `;
              card.addEventListener('click', function() {
                removePreviousVehicleBubbles();
                state.selectedVehicle = car;
                state.selectedSpec = null;
                updateSelectedVehicleInfo(car, null);
                if (hasMultipleSpecs(car)) {
                  showVariantSelection(car);
                } else {
                  showRangeQuestion();
                }
                updateUI();
              });
              carCardsContainer.appendChild(card);
            });
            chatMessages.appendChild(carCardsContainer);
            chatbotContainer.appendChild(carCardsContainer);
          }
          // Further steps for Bike can be added here
          if (type === 'Bike') {
            const botReply2 = document.createElement('div');
            botReply2.className = 'chat-bubble bot';
            botReply2.textContent = 'Please select your bike';
            chatMessages.appendChild(botReply2);
            // Create bike cards container
            const bikeCardsContainer = document.createElement('div');
            bikeCardsContainer.className = 'vehicle-cards-scroll';
            vehicles.bikes.forEach(bike => {
              const card = document.createElement('div');
              card.className = 'vehicle-card-select';
              card.innerHTML = `
                <img src="${bike.imageUrl}" alt="${bike.model}" class="vehicle-card-img" />
                <div class="vehicle-card-title">${bike.manufacturer} ${bike.model}</div>
                <div class="vehicle-card-detail">Battery: ${bike.battery}</div>
                <div class="vehicle-card-detail">Range: ${bike.range}</div>
                ${bike.battery.includes('/') || bike.range.includes('/') ? '<div class="vehicle-card-multispec">Multiple Specs</div>' : ''}
              `;
              card.addEventListener('click', function() {
                removePreviousVehicleBubbles();
                state.selectedVehicle = bike;
                state.selectedSpec = null;
                updateSelectedVehicleInfo(bike, null);
                if (hasMultipleSpecs(bike)) {
                  showVariantSelection(bike);
                } else {
                  showRangeQuestion();
                }
                updateUI();
              });
              bikeCardsContainer.appendChild(card);
            });
            chatMessages.appendChild(bikeCardsContainer);
            chatbotContainer.appendChild(bikeCardsContainer);
          }
        });
        buttonRow.appendChild(btn2);
      });
      botReply.appendChild(buttonRow);
      chatMessages.appendChild(botReply);
      chatActions.innerHTML = '';
      chatActions.classList.remove('center-actions');
      chatActions.classList.remove('tight-below');
    });
  }
});

// In the car/bike card click handler, before appending a new user bubble for vehicle selection:
// Remove previous vehicle selection bubbles from chatMessages
const removePreviousVehicleBubbles = () => {
  const chatMessages = document.getElementById('chat-messages');
  if (!chatMessages) return;
  // Remove all user bubbles that match a vehicle selection (by class or by content pattern)
  const userBubbles = chatMessages.querySelectorAll('.chat-bubble.user');
  userBubbles.forEach(bubble => {
    // Optionally, use a more specific check if needed
    if (bubble.textContent && (bubble.textContent.includes('Ola Electric') || bubble.textContent.includes('Ather Energy') || bubble.textContent.includes('Tata Motors') || bubble.textContent.includes('BYD') || bubble.textContent.includes('Mahindra') || bubble.textContent.includes('MG Motor India') || bubble.textContent.includes('Hyundai') || bubble.textContent.includes('BMW') || bubble.textContent.includes('Mercedes-Benz') || bubble.textContent.includes('Citroën') || bubble.textContent.includes('PMV Electric'))) {
      bubble.remove();
    }
  });
};

// Helper to update the selected vehicle info display
function updateSelectedVehicleInfo(vehicle, variantIdx) {
  const infoDiv = document.getElementById('selected-vehicle-info');
  if (!infoDiv) return;
  if (!vehicle) {
    infoDiv.innerHTML = '';
    return;
  }
  let battery = vehicle.battery;
  let range = vehicle.range;
  if (hasMultipleSpecs(vehicle) && typeof variantIdx === 'number') {
    const specs = parseVehicleSpecs(vehicle);
    const spec = specs[variantIdx];
    battery = spec.battery;
    range = spec.range;
  }
  infoDiv.innerHTML = `
    <div class="selected-vehicle-card-responsive" style="background:#f8fafc;border-radius:1.2rem;padding:1.2rem 1.5rem;margin:0 auto 2.5rem auto;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.04);font-size:1.15rem;max-width:420px;">
      <b>${vehicle.manufacturer} ${vehicle.model}</b>
      <div style="margin-top:0.5rem;font-size:1rem;">
        Battery: <b>${battery}</b><br>Range: <b>${range}</b>
      </div>
    </div>
  `;

  // Add responsive padding for small screens
  const styleId = 'selected-vehicle-card-responsive-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @media (max-width: 600px) {
        .selected-vehicle-card-responsive {
          padding-left: 0.7rem !important;
          padding-right: 0.7rem !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Helper to update the variant selection UI below the carousel
function showVariantSelection(vehicle) {
  const container = document.getElementById('variant-selection-container');
  if (!container) return;
  container.innerHTML = '';
  const specs = parseVehicleSpecs(vehicle);
  if (specs.length <= 1) {
    // Do not show variant selection UI or message if 0 or 1 variant
    return;
  }
  // Show variant selection UI and message if more than one variant
  const label = document.createElement('div');
  label.textContent = 'Please select your variant:';
  label.style.marginBottom = '0.7rem';
  label.style.fontWeight = 'bold';
  label.style.fontSize = '1.1rem';
  container.appendChild(label);
  const variantList = document.createElement('div');
  variantList.style.display = 'flex';
  variantList.style.flexDirection = 'column';
  variantList.style.gap = '0.5rem';
  specs.forEach((spec, idx) => {
    const btn = document.createElement('button');
    btn.textContent = `Variant ${idx + 1}: Battery ${spec.battery}, Range ${spec.range}`;
    btn.className = 'chat-btn-suggestion';
    btn.onclick = function() {
      state.selectedSpec = idx;
      updateSelectedVehicleInfo(vehicle, idx);
      container.innerHTML = '';
      showRangeQuestion();
    };
    variantList.appendChild(btn);
  });
  container.appendChild(variantList);
}

// Place showRangeQuestion here, after utility functions but before any code that calls it
function showRangeQuestion() {
  // Always move the range question container to the correct place
  const container = document.getElementById('range-question-container');
  const variantContainer = document.getElementById('variant-selection-container');
  const selectedVehicleInfo = document.getElementById('selected-vehicle-info');
  if (!container) return;

  // Place after variant selection if present and visible, else after selected vehicle info
  if (variantContainer && variantContainer.parentNode && variantContainer.innerHTML.trim() !== '') {
    variantContainer.parentNode.insertBefore(container, variantContainer.nextSibling);
  } else if (selectedVehicleInfo && selectedVehicleInfo.parentNode) {
    selectedVehicleInfo.parentNode.insertBefore(container, selectedVehicleInfo.nextSibling);
  }

  // Now render the range question UI as before
  container.innerHTML = '';

  // Add the question as a label
  const label = document.createElement('div');
  label.textContent = 'How many kilometers does your vehicle run on a single full charge?';
  label.className = 'range-question-label';
  container.appendChild(label);

  // Add input box
  const input = document.createElement('input');
  input.type = 'number';
  input.id = 'inputRange';
  input.placeholder = 'Enter your vehicle\'s range (km)';
  input.style.marginBottom = '0.7rem';
  input.style.width = '100%';
  input.style.maxWidth = '320px';
  input.className = 'input-range';
  container.appendChild(input);

  // Add error message
  const errorMessage = document.createElement('div');
  errorMessage.id = 'errorMessage';
  errorMessage.style.color = '#d32f2f';
  errorMessage.style.fontSize = '0.98rem';
  errorMessage.style.marginBottom = '0.5rem';
  errorMessage.classList.add('hidden');
  container.appendChild(errorMessage);

  // Add input event to clear error message when user types
  input.addEventListener('input', function() {
    errorMessage.classList.add('hidden');
    errorMessage.innerHTML = '';
    sohMessage.classList.add('hidden');
    sohMessage.textContent = '';
  });

  // Add a flex container for the button row
  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.alignItems = 'center';
  btnRow.style.justifyContent = 'center';
  btnRow.style.gap = '1rem';

  // Add calculate button
  const calcBtn = document.createElement('button');
  calcBtn.textContent = 'Calculate SoH';
  calcBtn.className = 'chat-btn-suggestion';
  calcBtn.style.marginTop = '0.2rem';
  btnRow.appendChild(calcBtn);

  // Add question mark button next to Calculate SoH with 1rem spacing
  const sohInfoBtn = document.createElement('button');
  sohInfoBtn.id = 'sohInfoBtn';
  sohInfoBtn.textContent = '?';
  sohInfoBtn.title = 'What is SoH?';
  sohInfoBtn.style.fontSize = '1.1em';
  sohInfoBtn.style.cursor = 'pointer';
  sohInfoBtn.style.height = '32px';
  sohInfoBtn.style.width = '32px';
  sohInfoBtn.style.display = 'flex';
  sohInfoBtn.style.alignItems = 'center';
  sohInfoBtn.style.justifyContent = 'center';
  sohInfoBtn.style.background = '#222';
  sohInfoBtn.style.color = '#fff';
  sohInfoBtn.style.border = 'none';
  sohInfoBtn.style.borderRadius = '8px';
  sohInfoBtn.style.marginTop = '0.2rem';
  // Remove any marginLeft, as gap will handle spacing
  btnRow.appendChild(sohInfoBtn);

  container.appendChild(btnRow);

  // Add info box (hidden by default)
  const sohInfoBox = document.createElement('div');
  sohInfoBox.id = 'sohInfoBox';
  sohInfoBox.style.display = 'none';
  sohInfoBox.style.background = '#f1f8e9';
  sohInfoBox.style.color = '#222';
  sohInfoBox.style.border = '1px solid #b2dfdb';
  sohInfoBox.style.borderRadius = '8px';
  sohInfoBox.style.padding = '1em';
  sohInfoBox.style.marginTop = '5em';
  sohInfoBox.style.fontSize = '1.05em';
  sohInfoBox.style.maxWidth = '420px';
  sohInfoBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
  sohInfoBox.innerHTML = `
    <span id="closeSohInfoBox" style="position:absolute;top:6px;right:18px;font-size:1.4em;font-weight:bold;cursor:pointer;color:#388e3c;line-height:1.2;">&times;</span>
    <b>What is SoH?</b><br>
    State of Health (SoH) shows how good or strong a battery is compared to when it was new. It is written as a percentage. If the number is high, the battery is still in good condition. If the number is low, the battery is getting weak and can't work as well. SoH helps us know if the battery is still good or needs to be changed.
  `;
  sohInfoBox.style.position = 'relative';
  sohInfoBox.style.margin = '0 auto';
  container.appendChild(sohInfoBox);

  sohInfoBtn.addEventListener('click', function(e) {
    e.preventDefault();
    sohInfoBox.style.display = sohInfoBox.style.display === 'none' ? 'block' : 'none';
  });
  sohInfoBox.querySelector('#closeSohInfoBox').onclick = function() {
    sohInfoBox.style.display = 'none';
  };

  // Add SoH result message (now after the button)
  const sohMessage = document.createElement('div');
  sohMessage.id = 'sohMessage';
  sohMessage.style.color = '#388e3c';
  sohMessage.style.fontSize = '1.05rem';
  sohMessage.style.marginTop = '1rem';
  sohMessage.style.fontWeight = '500';
  sohMessage.classList.add('hidden');
  container.appendChild(sohMessage);

  function hideSavedMessage() {}
  input.addEventListener('input', hideSavedMessage);
  calcBtn.addEventListener('click', hideSavedMessage);

  // Only enable Save button in footer after Calculate SoH
  const saveBtnFooter = document.getElementById('saveBtn');
  if (saveBtnFooter) {
    saveBtnFooter.disabled = true;
    saveBtnFooter.classList.add('opacity-75', 'cursor-not-allowed');
  }

  calcBtn.onclick = function() {
    errorMessage.classList.add('hidden');
    sohMessage.classList.add('hidden');
    const rangeValue = input.value.trim();
    if (!rangeValue) {
      errorMessage.textContent = 'Please enter your vehicle\'s range';
      errorMessage.classList.remove('hidden');
      return;
    }
    const rangeMatch = rangeValue.match(/(\d+(?:\.\d+)?)/);
    if (!rangeMatch) {
      errorMessage.textContent = 'Please enter a valid range value';
      errorMessage.classList.remove('hidden');
      return;
    }
    const range = parseFloat(rangeMatch[1]);
    if (isNaN(range) || range <= 0) {
      errorMessage.textContent = 'Please enter a valid range value';
      errorMessage.classList.remove('hidden');
      return;
    }
    const selectedVehicle = state.selectedVehicle;
    if (!selectedVehicle) {
      errorMessage.textContent = 'Please select a vehicle first';
      errorMessage.classList.remove('hidden');
      return;
    }
    const specs = parseVehicleSpecs(selectedVehicle);
    let specIdx = (typeof state.selectedSpec === 'number' && state.selectedSpec >= 0 && state.selectedSpec < specs.length) ? state.selectedSpec : 0;
    const currentSpec = specs[specIdx];
    if (!currentSpec || !currentSpec.range) {
      errorMessage.textContent = 'Invalid vehicle range specification';
      errorMessage.classList.remove('hidden');
      return;
    }
    const originalRangeMatch = currentSpec.range.match(/(\d+(?:\.\d+)?)/);
    if (!originalRangeMatch) {
      errorMessage.textContent = 'Invalid vehicle range specification';
      errorMessage.classList.remove('hidden');
      return;
    }
    const originalRange = parseFloat(originalRangeMatch[1]);
    const calculatedSoH = ((range / originalRange) * 100).toFixed(2);
    if (parseFloat(calculatedSoH) > 100) {
      if (errorMessage) {
        errorMessage.innerHTML = '<span style="font-size:1.3em;margin-right:0.4em;vertical-align:middle;">⚠️</span>Calculated SoH cannot be greater than 100%. Please enter a correct range.';
        errorMessage.style.textAlign = 'center';
        errorMessage.classList.remove('hidden');
      }
      return;
    }
    sohMessage.textContent = `Estimated State of Health (SoH): ${calculatedSoH}%`;
    sohMessage.classList.remove('hidden');
    // Optionally, update state
    state.batteryInfo = {
      type: 'range',
      value: range.toString(),
      estimatedSoH: `${calculatedSoH}%`
    };
    state.showSuccessMessage = true;
    saveState();
    // Enable Save button in footer if present
    const saveBtnFooterNow = document.getElementById('saveBtn');
    if (saveBtnFooterNow) {
      saveBtnFooterNow.disabled = false;
      saveBtnFooterNow.classList.remove('opacity-75', 'cursor-not-allowed');
    }
  };
}

function renderActionBar() {
  let actionBar = document.getElementById('action-bar');
  if (!actionBar) {
    actionBar = document.createElement('div');
    actionBar.id = 'action-bar';
    actionBar.style.position = 'fixed';
    actionBar.style.left = '0';
    actionBar.style.right = '0';
    actionBar.style.bottom = '0';
    actionBar.style.zIndex = '2001';
    actionBar.style.background = 'rgba(255,255,255,0.97)';
    actionBar.style.display = 'flex';
    actionBar.style.justifyContent = 'center';
    actionBar.style.alignItems = 'center';
    actionBar.style.padding = '0.7rem 0';
    actionBar.style.boxShadow = '0 -2px 8px rgba(0,0,0,0.04)';
    actionBar.style.fontSize = '1.1rem';
    actionBar.style.fontFamily = 'inherit';
    document.body.appendChild(actionBar);
  }
  actionBar.innerHTML = '';
  // Clear button
  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear';
  clearBtn.className = 'chat-btn-suggestion';
  clearBtn.onclick = clearSelections;
  actionBar.appendChild(clearBtn);
  // Save button
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'chat-btn-suggestion';
  saveBtn.id = 'saveBtn';
  saveBtn.onclick = saveBatteryInfo;
  // Enable only if range is entered
  const rangeInput = document.getElementById('inputRange');
  if (!rangeInput || !rangeInput.value.trim()) {
    saveBtn.disabled = true;
    saveBtn.classList.add('opacity-75', 'cursor-not-allowed');
  } else {
    saveBtn.disabled = false;
    saveBtn.classList.remove('opacity-75', 'cursor-not-allowed');
  }
  actionBar.appendChild(saveBtn);
  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.className = 'chat-btn-suggestion';
  nextBtn.id = 'nextBtn';
  nextBtn.onclick = handleNext;
  // Enable only if state.batteryInfo is set
  if (!state.batteryInfo) {
    nextBtn.disabled = true;
    nextBtn.classList.add('opacity-75', 'cursor-not-allowed');
  } else {
    nextBtn.disabled = false;
    nextBtn.classList.remove('opacity-75', 'cursor-not-allowed');
  }
  actionBar.appendChild(nextBtn);
}