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
// Content script for BMS Extension
console.log('BMS Extension content script loaded');

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getPageData') {
    // Get relevant data from the current page
    const pageData = {
      title: document.title,
      url: window.location.href
    };
    sendResponse(pageData);
  }
  return true;
}); 