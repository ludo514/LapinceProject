import { StatusCodes } from "http-status-codes";
import { ReturnResponseError } from "../utils/ReturnResponseError.js";

export function checkData(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      console.log("Erreur Joi :", error.details);
      console.log("Body reçu :", req.body);

      return res.status(400).json({
        error: true,
        details: error.details
      });
    }

    req.body = value;
    next();
  };
}

export function errorHandler(err, _req, res, next) {
  const message = {
    error: true,
    message: err.message,
    details: err.stack,
  };
  console.error(message);
  res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(message);
  next();
}


