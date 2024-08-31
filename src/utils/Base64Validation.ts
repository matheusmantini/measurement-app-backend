import { CustomHelpers, ErrorReport } from "joi";

/**
 * Custom function to validate a base64 string with Joi.
 * @param {string} value - A base64 string.
 * @returns {Boolean} - It returns true if the provided string has a valid base64 format and false if it's not.
 */

const base64ImageValidator = (
  value: string,
  helpers: CustomHelpers
): string | ErrorReport => {
  const base64ImagePattern = /^data:image\/(jpeg|png|gif|bmp|webp);base64,/;

  if (!base64ImagePattern.test(value)) {
    return helpers.error("any.invalid");
  }

  const base64Data = value.replace(base64ImagePattern, "");

  const base64Pattern = /^[A-Za-z0-9+/=]+$/;

  if (!base64Pattern.test(base64Data)) {
    return helpers.error("any.invalid");
  }

  if (base64Data.length % 4 !== 0) {
    return helpers.error("any.invalid");
  }

  return value;
};

export default base64ImageValidator;
