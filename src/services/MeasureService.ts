import { MeasureRepository } from "../repository/MeasureRepository";
import { InvalidMeasureTypeError } from "./errors/InvalidMeasureTypeError";
import { MeasureFindAllDTO } from "../types/dtos/MeasureFindAllDTO";
import { MeasureInsertDTO } from "../types/dtos/MeasureInsertDTO";
import { MeasureUpdateDTO } from "../types/dtos/MeasureUpdateDTO";
import { MeasurefindByIdDTO } from "../types/dtos/MeasurefindByIdDTO";
import { HasMeasureInMonthDTO } from "../types/dtos/HasMeasureInMonthDTO";
import { NotFoundMeasureTypeError } from "./errors/NotFoundMeasureTypeError";
import { DuplicateMeasureTypeError } from "./errors/DuplicateMeasureTypeError";

export class MeasureService {
  constructor(private measureRepository: MeasureRepository) {}

  insert = async (dtoData: MeasureInsertDTO) => {
    return await this.measureRepository.insert({
      measure_datetime: dtoData.measure_datetime,
      measure_type: dtoData.measure_type,
      customer_code: dtoData.customer_code,
      image_url: dtoData.image_url,
      value: dtoData.value,
    });
  };

  update = async (dtoData: MeasureUpdateDTO) => {
    await this.measureRepository.update({
      measure_uuid: dtoData.measure_uuid,
      confirmed_value: dtoData.confirmed_value,
    });
  };

  findById = async (dtoData: MeasurefindByIdDTO) => {
    const measure = await this.measureRepository.findById({
      measure_uuid: dtoData.measure_uuid,
    });

    if (!measure) {
      throw new NotFoundMeasureTypeError("Leitura do mês já realizada");
    }

    return measure;
  };

  findAllByCustomersCode = async (measureFindAllDTO: MeasureFindAllDTO) => {
    const normalizedMeasureType = measureFindAllDTO.measure_type
      ? (measureFindAllDTO.measure_type as String).toUpperCase()
      : undefined;
      
    if (
      normalizedMeasureType !== undefined &&
      normalizedMeasureType !== "WATER" &&
      normalizedMeasureType !== "GAS"
    ) {
      throw new InvalidMeasureTypeError("Tipo de medição não permitida");
    }

    const measures = await this.measureRepository.findAllByCustomersCode({
      normalizedMeasureType,
      customer_code: measureFindAllDTO.customer_code,
    });

    if (measures.length === 0) {
      throw new NotFoundMeasureTypeError("Leitura do mês já realizada");
    }

    return measures;
  };

  hasMeasureInMonth = async (dtoData: HasMeasureInMonthDTO) => {
    const measure = await this.measureRepository.hasMeasureInMonth({
      measure_type: dtoData.measure_type,
      customer_code: dtoData.customer_code,
      measure_datetime: dtoData.measure_datetime,
    });

    if (measure) {
      throw new DuplicateMeasureTypeError("Leitura do mês já realizada");
    }
  };
}
