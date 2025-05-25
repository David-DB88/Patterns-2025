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
  { name: 'Keyboard', price: 100 },
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
  }

  add(item) {
    if (this.total + item.price >= this.limit) return;
    this.total += item.price;
    this.items.push(item);
  }

  end() {
    const { items, total, callback } = this;
    return {
      then(resolve) {
        resolve(callback(items, total));
      },
    };
  }
}

const main = async () => {
  const goods = PurchaseIterator.create(purchase);
  const basket = new Basket({ limit: 1600 }, (items, total) => {
    console.log(total);
    return items;
  });
  // Hint: call async function without await
  for await (const item of goods) {
    basket.add(item);
    // console.log(item)
  }
  basket.end().then(console.log);
};

main();
