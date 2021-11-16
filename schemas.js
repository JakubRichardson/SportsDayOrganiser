const Joi = require("joi");

const template = Joi.object({
  id: Joi.string(),
  limit: Joi.number().empty("").integer().min(0)
})

module.exports.sportsDaySchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1).max(13).required(),
  date: Joi.date().required(),
  events: Joi.object({
    male: Joi.array().items(template),
    female: Joi.array().items(template)
  })
}).required();

module.exports.eventSchema = Joi.object({
  name: Joi.string().required(),
  gender: Joi.string().valid("male", "female").required(),
  limit: Joi.number().integer().min(1),
  template: Joi.string().valid("true"),
}).required();

const userAndPass = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
}).required()

module.exports.studentSchemaNoPass = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  year: Joi.number().integer().min(-1).max(13).required(),
  house: Joi.string().valid("bison", "wolf", "bear", "lynx").required(),
  gender: Joi.string().valid("male", "female").required()
}).required()


module.exports.studentSchema = this.studentSchemaNoPass.concat(userAndPass);

const teacherBase = Joi.object({
  masterPassword: Joi.string().required()
}).required()

module.exports.teacherSchema = teacherBase.concat(userAndPass);

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