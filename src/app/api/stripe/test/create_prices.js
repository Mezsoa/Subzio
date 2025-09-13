const stripe = require('stripe')('sk_test_51S4kMqRrdmDJlTxgbYlb43Qnt4m9KjuHFKFBFCJ2502M5Q5ADrXuSeA3C4I8gF9njjUeCPNQdkR1y44g7d5ZLlZZ0065v2IU1t');

stripe.products.create({
  name: 'Starter Subscription',
  description: '$12/Month subscription',
}).then(product => {
  stripe.prices.create({
    unit_amount: 1200,
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
    product: product.id,
  }).then(price => {
    console.log('Success! Here is your starter subscription product id: ' + product.id);
    console.log('Success! Here is your starter subscription price id: ' + price.id);
  });
});