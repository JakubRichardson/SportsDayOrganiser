const { sportsDaySchema, eventSchema, returnToSchema, studentSchema, studentSchemaNoPass, teacherSchema, templateEventsSchema } = require("./schemas.js");
const AppError = require("../utilities/AppError");

module.exports.validateSportsDay = (req, res, next) => {
    const { error } = sportsDaySchema.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

module.exports.validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

module.exports.validateTemplateEvents = (req, res, next) => {
    const { error } = templateEventsSchema.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

module.exports.validateReturnTo = (req, res, next) => {
    const { error } = returnToSchema.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

module.exports.validateStudent = (req, res, next) => {
    const { error } = studentSchema.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

module.exports.validateStudentNoPass = (req, res, next) => {
    const { error } = studentSchemaNoPass.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

module.exports.validateTeacher = (req, res, next) => {
    const { error } = teacherSchema.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}