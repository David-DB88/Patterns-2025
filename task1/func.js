'use strict';
import  {data , meta}  from './data.js';



const objectsInArray = (data) => {
  const newData = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i].split(',');
    newData.push({
      city: row[0],
      population: row[1],
      area: row[2],
      density: parseInt(row[3]),
      country: row[4],
    });
  }
  return newData;
}

export const normalizeData = (data) => {
  const slpited = data.split('\n');
  const trimed = slpited.map((row) => row.trim());
  
  return objectsInArray(trimed)  
}

export const getMaxByDensity = (data) => {
 const max = data.toSorted((a, b) => a.density - b.density)[data.length - 1];
  return max['density'];
}

const addDensityPercentage = (data, max) => {
  const newData = data.map((row) => {
    const densityPercentage = Math.round((row.density * 100) / max);
    return {
      ...row,
      densityPercentage: densityPercentage,
    };
  });
  return newData;
}

const createTableData = (data, metaDatas) => {
    const table = data.map((row) => {
          let s = ''
          for (const {name, width, align} of metaDatas) {
            const value = row[name].toString()
            s += align === 'left'? value.padEnd(width): value.padStart(width);
            }
          return s;
        })
  return table;
}

const dataPrezentedTableFormat = (data, metaDatas) => {
  const normalizedData = normalizeData(data);
  const maxDensity = getMaxByDensity(normalizedData)
  const addedDensityPercentageData = addDensityPercentage(normalizedData, maxDensity);
  const sortedDataByDensityPercentage = addedDensityPercentageData.toSorted((a, b) => b['densityPercentage'] - a['densityPercentage']);

  return createTableData(sortedDataByDensityPercentage, metaDatas);
}

console.log(dataPrezentedTableFormat(data, meta));
