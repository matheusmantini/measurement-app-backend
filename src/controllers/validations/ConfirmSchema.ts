import Joi from "joi";

const confirmSchema = Joi.object({
  measure_uuid: Joi.string().required(),
  confirmed_value: Joi.number().integer().required(),
});

export default confirmSchema;
