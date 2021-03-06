const mongoose = require('mongoose');

const { Schema } = mongoose;

const mongoosePaginate = require('mongoose-paginate');

mongoosePaginate.paginate.options = { limit: 3 };

const PetSchema = new Schema({
  name: { type: String, required: true },
  birthday: { type: String, required: true },
  species: { type: String, required: true },
  picUrl: { type: String, required: true },
  picUrlSq: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  favoriteFood: { type: String, required: true },
  description: { type: String, minlength: 140, required: true },
  price: { type: Number, required: true },
},
{
  timestamps: true,
});

PetSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Pet', PetSchema);
