import { MeasureType } from "../../types/custom/MeasureType";

export type HasMeasureInMonthDTO = {
  measure_type: MeasureType;
  customer_code: string;
  measure_datetime: Date;
};
