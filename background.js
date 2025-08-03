// Background script for BMS Extension
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
// Background script for BMS Extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('BMS Extension installed');
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getData') {
    // Handle data requests
    sendResponse({ status: 'success' });
  }
  return true;
}); 