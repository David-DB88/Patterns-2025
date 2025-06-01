'use strict';
import { data, meta } from './data.js';

class NormalizeData {
  #data;
  constructor(data) {
    this.#data = data;
  }

  getSplitedTrimmedRows() {
    return this.#data.split('\n').map((row) => row.trim());
  }
}

class ObjectsToArray {
  #data;
  constructor(data) {
    this.#data = data;
  }

  parseRowsToObjects() {
    const newData = [];
    for (let i = 1; i < this.#data.length; i++) {
      const row = this.#data[i].split(',');
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
}

class MaxByDensity {
  #data;
  constructor(data) {
    this.#data = data;
  }
  getMaxByDensity() {
    const getAllDensities = this.#data.map((i) => i.density);

    return Math.max(...getAllDensities);
  }
}

class DensityPercentage {
  #data;
  #maxDensity;
  constructor(data, maxDensity) {
    this.#data = data;
    this.#maxDensity = maxDensity;
  }

  addDensityPercentage() {
    const newData = this.#data.map((row) => {
      const densityPercentage = Math.round(
        (row.density * 100) / this.#maxDensity,
      );
      return {
        ...row,
        densityPercentage,
      };
    });
    return newData;
  }
}

class SortByDensityPercentage {
  #data;
  constructor(data) {
    this.#data = data;
  }
  getSortedData() {
    return this.#data.toSorted(
      (a, b) => b['densityPercentage'] - a['densityPercentage'],
    );
  }
}

class GenerateTable {
  #data;
  #metaData;
  constructor(data, metaData) {
    this.#data = data;
    this.#metaData = metaData;
  }

  createTableData() {
    const table = this.#data.map((row) => {
      let s = '';
      for (const { name, width, align } of this.#metaData) {
        const value = row[name].toString();
        s += align === 'left' ? value.padEnd(width) : value.padStart(width);
      }
      return s;
    });
    return table;
  }
}

const normalizedData = new NormalizeData(data).getSplitedTrimmedRows();
const objectsInArray = new ObjectsToArray(normalizedData).parseRowsToObjects();
const maxDensity = new MaxByDensity(objectsInArray).getMaxByDensity();

const addedDensityPercentageData = new DensityPercentage(
  objectsInArray,
  maxDensity,
).addDensityPercentage();

const sortedDataByDensityPercentage = new SortByDensityPercentage(
  addedDensityPercentageData,
).getSortedData();

const tableData = new GenerateTable(
  sortedDataByDensityPercentage,
  meta,
).createTableData();

console.log(tableData);
