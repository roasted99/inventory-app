const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {type: String, require: true},
  description: {type: String, require: true},
  category: {type: Schema.Types.ObjectId, ref: 'Category', require: true}, 
  price: {type: Number, require: true},
  number_in_stock: {type: Number, require: true}
});

ItemSchema.virtual('url').get(() => {
  return '/item/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema)