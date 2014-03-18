exports = module.exports = Tick;

function Tick(tickData) {
  this.amount = tickData.amount;
  this.price = tickData.price;
  this.createdAt = Date.now();
}