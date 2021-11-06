const Joi = require("joi");

module.exports.sportsDaySchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1).max(13).required(),
  date: Joi.date().required(),
  events: Joi.object({
    male: Joi.array().items(Joi.string()),
    female: Joi.array().items(Joi.string())
  })
}).required();

module.exports.eventSchema = Joi.object({
  name: Joi.string().required(),
  gender: Joi.string().valid("male", "female").required(),
  template: Joi.string().valid("true"),
}).required();

module.exports.userSchema = Joi.object({
  name: Joi.string().required(),
  house: Joi.string().valid("bison", "wolf", "bear", "lynx").required(),
}).required()

/*
{
  name: 'Jakub',
  year: '12',
  date: '2021-10-15',
  events: {
    male: [ '617154dd1bb81320546765ad' ],
    female: [ '617154dd1bb81320546765ad' ]
  }
}
*/