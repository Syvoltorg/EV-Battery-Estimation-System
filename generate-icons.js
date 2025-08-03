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
const sharp = require('sharp');
const fs = require('fs');

const sizes = [16, 48, 128];

async function generateIcons() {
  const svgBuffer = fs.readFileSync('./icons/EV_icon.svg');

  // Generate icons in ./icons/
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(`./icons/icon${size}.png`);
  }

  // Generate icons in ./dist/icons/
  // Ensure dist/icons directory exists
  fs.mkdirSync('./dist/icons', { recursive: true });
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(`./dist/icons/icon${size}.png`);
  }
}

generateIcons().catch(console.error); 