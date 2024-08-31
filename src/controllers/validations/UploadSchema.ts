import Joi from "joi";
import base64ImageValidator from "../../utils/Base64Validation";

const uploadSchema = Joi.object({
  image: Joi.string()
    .custom(base64ImageValidator, "Base64 Image Validation")
    .required(),
  customer_code: Joi.string().required(),
  measure_datetime: Joi.date().iso().required(),
  measure_type: Joi.string().valid("WATER", "GAS").required(),
});

export default uploadSchema;
