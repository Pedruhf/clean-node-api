import { MissingParamError } from "../../errors";
import { Validation } from "./validation";
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
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new ValidationComposite([validationStub]);

  return {
    sut,
    validationStub,
  };
}

describe('ValidationComposite', () => {
  it('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({});
    expect(error).toEqual(new MissingParamError("field"));
  });
});
