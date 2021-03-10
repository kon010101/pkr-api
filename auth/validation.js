const Joi = require("joi");

//registration validation
const registrationValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string()
            .equal(Joi.ref("password"))
            .required()
            .label("Confirmed password")
            .messages({ "any.only": "{{#label}} does not match" }),
    });

    //validation with joi
    return schema.validate(data);
};

//login validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });

    //validation with joi
    return schema.validate(data);
};

module.exports.registrationValidation = registrationValidation;
module.exports.loginValidation = loginValidation;
