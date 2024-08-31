import { Request, Response } from "express";
import { MeasureService } from "../services/MeasureService";
import updateSchema from "./validations/UploadSchema";
import { CustomGeminiError } from "../types/custom/CustomGeminiError";
import uploadTemporaryImage from "../utils/UploadTemporaryImage";
import extractValueFromImage from "../utils/ProcessImageWithGemini";
import { DuplicateMeasureTypeError } from "../services/errors/DuplicateMeasureTypeError";
import confirmSchema from "./validations/ConfirmSchema";
import { NotFoundMeasureTypeError } from "../services/errors/NotFoundMeasureTypeError";
import { Measure } from "../models/MeasureModel";
import { InvalidMeasureTypeError } from "../services/errors/InvalidMeasureTypeError";

export class MeasureController {
  constructor(private measureService: MeasureService) {}

  upload = async (req: Request, res: Response) => {
    const { error, value } = updateSchema.validate(req.body);

    if (error) {
      return res.status(400).send({
        error_code: "INVALID_DATA",
        error_description: error?.details[0]?.message,
      });
    }

    const { image, customer_code, measure_datetime, measure_type } = value;

    try {
      await this.measureService.hasMeasureInMonth({
        measure_type,
        customer_code,
        measure_datetime,
      });

      const { tempUrl, imagePath } = await uploadTemporaryImage(image);

      const geminiResult = await extractValueFromImage(imagePath);

      const measure_value = parseInt(geminiResult, 10);

      const measure = await this.measureService.insert({
        measure_datetime,
        measure_type,
        customer_code,
        image_url: tempUrl,
        value: measure_value,
      });

      res.json({
        image_url: tempUrl,
        measure_value,
        measure_uuid: measure?.id,
      });
    } catch (error: any) {
      if (error instanceof DuplicateMeasureTypeError) {
        res.status(409).json({
          error_code: "DOUBLE_REPORT",
          error_description: error.message,
        });
      } else {
        res.status(500).json({
          error_code: "INTERNAL_ERROR",
          error_description:
            (error as CustomGeminiError)?.message || "Internal Server Error",
        });
      }
    }
  };

  confirm = async (req: Request, res: Response) => {
    const { error, value } = confirmSchema.validate(req.body);

    if (error) {
      return res.status(400).send({
        error_code: "INVALID_DATA",
        error_description: error?.details[0]?.message,
      });
    }

    const { measure_uuid, confirmed_value } = value;

    try {
      const measure = await this.measureService.findById({
        measure_uuid,
      });

      if (measure.has_confirmed) {
        return res.status(409).send({
          error_code: "CONFIRMATION_DUPLICATE",
          error_description: "Leitura do mês já realizada",
        });
      }

      await this.measureService.update({ measure_uuid, confirmed_value });

      res.json({
        success: true,
      });
    } catch (error) {
      if (error instanceof NotFoundMeasureTypeError) {
        res.status(404).json({
          error_code: "MEASURE_NOT_FOUND",
          error_description: error.message,
        });
      } else if (error instanceof DuplicateMeasureTypeError) {
        res.status(409).json({
          error_code: "CONFIRMATION_DUPLICATE",
          error_description: error.message,
        });
      } else {
        res.status(500).json({
          error_code: "INTERNAL_ERROR",
          error_description:
            (error as CustomGeminiError)?.message || "Internal Server Error",
        });
      }
    }
  };

  list = async (req: Request, res: Response) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const { customer_code } = req.params;
    const { measure_type } = req.query;

    try {
      const measures = await this.measureService.findAllByCustomersCode({
        measure_type,
        customer_code,
      });

      const formattedMeasures = measures.map((measure: Measure) => ({
        measure_uuid: measure.id,
        measure_datetime: measure.datetime,
        measure_type: measure.type,
        has_confirmed: measure.has_confirmed,
        image_url: `${baseUrl}${measure.image_url}`,
      }));

      res.json({
        customer_code,
        measures: formattedMeasures,
      });
    } catch (error) {
      if (error instanceof NotFoundMeasureTypeError) {
        res.status(404).json({
          error_code: "MEASURE_NOT_FOUND",
          error_description: error.message,
        });
      } else if (error instanceof InvalidMeasureTypeError) {
        res.status(400).json({
          error_code: "INVALID_TYPE",
          error_description: error.message,
        });
      } else {
        res.status(500).json({
          error_code: "INTERNAL_ERROR",
          error_description: "Internal Server Error",
        });
      }
    }
  };
}
