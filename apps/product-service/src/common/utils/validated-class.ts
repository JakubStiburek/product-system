import { validateSync } from 'class-validator';
import { InvalidInstanceException } from './exceptions/invalid-instance.exception';

export abstract class ValidatedClass {
  /**
   * Generic create method that all child classes inherit
   * Handles instantiation and validation in one step
   *
   * @param this Constructor of the class extending ValidatedClass
   * @param args Constructor arguments for the specific class
   * @returns The validated instance
   * @throws InvalidInstanceException if validation fails
   */
  static create<T extends ValidatedClass, Args extends any[]>(
    this: new (...args: Args) => T,
    ...args: Args
  ) {
    const instance = new this(...args);
    return ValidatedClass.validateInstance(instance);
  }

  private static validateInstance<T extends object>(instance: T): T {
    const validationErrors = validateSync(instance, {
      forbidUnknownValues: false,
    });
    if (validationErrors.length > 0) {
      throw new InvalidInstanceException(instance, validationErrors);
    }
    return instance;
  }
}
