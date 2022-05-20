import { MissingParamError } from "../../presentation/errors";
import { Validation } from "../../presentation/protocols/validation";
import { ValidationComposite } from "./validation-composite";

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
}

type SutTypes = {
  sut: Validation;
  validationStubs: Validation[];
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);

  return {
    sut,
    validationStubs,
  };
}

describe('ValidationComposite', () => {
  it('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({});
    expect(error).toEqual(new MissingParamError("field"));
  });

  it('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new Error());
    jest.spyOn(validationStubs[1], "validate").mockReturnValueOnce(new MissingParamError("field"));

    const error = sut.validate({});
    expect(error).toEqual(new Error());
  });

  it('Should not return an error if validation succeeds', () => {
    const { sut } = makeSut();
    const error = sut.validate({});
    expect(error).toBeFalsy();
  });
});
