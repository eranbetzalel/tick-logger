exports = module.exports = Tick;

function Tick(tickData) {
  if(!tickData.price)
    throw new Error('Could not initialize tick with null price.');

  this.price = tickData.price;
  this.createdAt = tickData.createdAt || Date.now();
}