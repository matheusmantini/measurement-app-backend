export class InvalidMeasureTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidMeasureTypeError";
  }
}
