import { MeasureType } from "../../types/custom/MeasureType";

export type MeasureInsertDTO = {
  measure_datetime: Date;
  measure_type: MeasureType;
  customer_code: string;
  image_url: string;
  value: number;
};
