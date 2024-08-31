export class DuplicateMeasureTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateMeasureTypeError";
  }
}
