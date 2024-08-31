import { MeasureQueryConditions } from "../types/custom/MeasureQueryConditions";
import { prisma } from "../packages/PrismaClient";
import { MeasureInsertDTO } from "../types/dtos/MeasureInsertDTO";
import { MeasureUpdateDTO } from "../types/dtos/MeasureUpdateDTO";
import { MeasurefindByIdDTO } from "../types/dtos/MeasurefindByIdDTO";
import { MeasurefindAllByCustomersCodeDTO } from "../types/dtos/MeasurefindAllByCustomersCodeDTO";
import { HasMeasureInMonthDTO } from "../types/dtos/HasMeasureInMonthDTO";
import { MeasureType } from "../types/custom/MeasureType";

export class MeasureRepository {
  insert = async (dtoData: MeasureInsertDTO) => {
    return await prisma.measure.create({
      data: {
        datetime: dtoData.measure_datetime,
        type: dtoData.measure_type,
        customer_code: dtoData.customer_code,
        image_url: dtoData.image_url,
        value: dtoData.value,
      },
    });
  };

  update = async (dtoData: MeasureUpdateDTO) => {
    await prisma.measure.update({
      where: { id: dtoData.measure_uuid },
      data: { value: dtoData.confirmed_value, has_confirmed: true },
    });
  };

  findById = async (dtoData: MeasurefindByIdDTO) => {
    return await prisma.measure.findUnique({
      where: { id: dtoData.measure_uuid },
    });
  };

  findAllByCustomersCode = async (
    dtoData: MeasurefindAllByCustomersCodeDTO
  ) => {
    const queryConditions: MeasureQueryConditions = {
      where: {
        customer_code: dtoData.customer_code,
        ...(dtoData.normalizedMeasureType
          ? { type: dtoData.normalizedMeasureType as MeasureType }
          : {}),
      },
      select: {
        id: true,
        datetime: true,
        type: true,
        has_confirmed: true,
        image_url: true,
      },
      orderBy: {
        datetime: "desc",
      },
    };

    return await prisma.measure.findMany(queryConditions);
  };

  hasMeasureInMonth = async (dtoData: HasMeasureInMonthDTO) => {
    const date = new Date(dtoData.measure_datetime);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    return await prisma.measure.findFirst({
      where: {
        type: dtoData.measure_type,
        customer_code: dtoData.customer_code,
        datetime: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
  };
}
