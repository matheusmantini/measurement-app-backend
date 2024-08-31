import { MeasureSelectFields } from "./MeasureSelectFields";
import { MeasureOrderByFields } from "./MeasureOrderByFields";
import { MeasureType } from "./MeasureType";

export type MeasureQueryConditions = {
  where: {
    customer_code: string;
    type?: MeasureType;
  };
  select: MeasureSelectFields;
  orderBy: MeasureOrderByFields;
};
