import { ValidationError } from 'class-validator';

export class InvalidInstanceException extends Error {
  readonly invalidInstance: any;
  readonly validationErrors: ValidationError[];

  constructor(invalidInstance: object, validationErrors: ValidationError[]) {
    super('InvalidInstanceException');
    this.invalidInstance = invalidInstance;
    this.validationErrors = validationErrors;
  }
}
