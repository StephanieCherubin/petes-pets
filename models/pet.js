'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const mongoosePaginate = require('mongoose-paginate');

mongoosePaginate.paginate.options = { limit: 3 };

const PetSchema = new Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  birthday: { type: Date },
  picUrl: { type: String },
  picUrlSq: { type: String },
  avatarUrl: { type: String },
  favoriteFood: { type: String, required: true },
  description: { type: String, minlength: 140, required: true },
},
{
  timestamps: true,
});

PetSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Pet', PetSchema);
