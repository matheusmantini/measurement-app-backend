export class NotFoundMeasureTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundMeasureTypeError";
  }
}
