import { ParsedQs } from "qs";

export type MeasureFindAllDTO = {
  measure_type: string | ParsedQs | string[] | ParsedQs[] | undefined;
  customer_code: string;
};
