'use strict';

// Create Iterator for given dataset with Symbol.asyncIterator
// Use for..of to iterate it and pass data to Basket
// Basket is limited to certain amount
// After iteration ended Basket should return Thenable
// to notify us with final list of items, total and
// escalated errors

const purchase = [
  { name: 'Laptop', price: 1500 },
  { name: 'Mouse', price: 25 },
  { name: 'Keyboard', price: -100 },
  { name: 'HDMI cable', price: 10 },
  { name: 'Bag', price: 50 },
  { name: 'Mouse pad', price: 5 },
];

class PurchaseIterator {
  constructor(purchase) {
    this.purchase = purchase;
  }

  static create(purchase) {
    return new PurchaseIterator(purchase);
  }

  [Symbol.asyncIterator]() {
    const purchase = this.purchase;
    let index = 0;
    const itarator = {
      async next() {
        return {
          value: purchase[index++],
          done: index >= purchase.length,
        };
      },
    };
    return itarator;
  }
}

class Basket {
  constructor(limit, callback) {
    this.limit = limit.limit;
    this.callback = callback;
    this.total = 0;
    this.items = [];
    this._thenQueue = [];
    this._resolved = false;
    this._errors = [];
  }

  add(item) {
    if (this.total + item.price > this.limit) return;

    if (!item || item.price < 0) {
      this._errors.push(new Error(`Invalid item: ${JSON.stringify(item)}`));
      return;
    }

    this.total += item.price;
    this.items.push(item);
  }

  end() {
    if (this._resolved) return;
    this._resolved = true;

    const result = this._getResult();

    this._thenQueue.forEach((fn) => fn(result));
  }

  then(resolve) {
    if (this._resolved) {
      resolve(this._getResult());
    } else {
      this._thenQueue.push(resolve);
    }
  }

  _getResult() {
    return this.callback(this._errors, this.items, this.total);
  }
}

const main = async () => {
  const goods = PurchaseIterator.create(purchase);
  const basket = new Basket({ limit: 1050 }, (errors, items, total) => {
    console.log(total);
    console.log(errors);
    return items;
  });
  // Hint: call async function without await

  basket.then(console.log);
  basket.then(console.log);
  basket.then(console.log);

  for await (const item of goods) {
    basket.add(item);
    // console.log(item)
  }
  // Hint: Add backet.end();
  basket.end();
};

main();
