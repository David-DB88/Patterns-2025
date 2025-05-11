import { getMaxByDensity, normalizeData } from './func.js';

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    console.error(`❌ ${message}: expected ${expected}, got ${actual}`);
  } else {
    console.log(`✅ ${message}`);
  }
}

assertEqual(getMaxByDensity([
  { density: 10 }, { density: 25 }, { density: 15 }
]), 25, 'Max density from sample array');


const sampleCsv = `city,population,area,density,country
TestCity,100000,100,1000,Testland`;

const normalized = normalizeData(sampleCsv);
console.log(normalized.length === 1, 'Should return one city');
console.log(normalized[0].city === 'TestCity', 'City name should match');
console.log(normalized[0].density === 1000, 'Density should be parsed as integer');