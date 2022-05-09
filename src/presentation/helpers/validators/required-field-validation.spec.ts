import { MissingParamError } from "../../errors";
import { RequiredFieldValidation } from "./required-field-validation";

describe('RequiredField Validation', () => {
  it('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation("any_field");
    const error = sut.validate({});
    expect(error).toEqual(new MissingParamError("any_field"));
  });

  it('Should not return if validation success ', () => {
    const sut = new RequiredFieldValidation("any_field");
    const error = sut.validate({ any_field: "any_value" });
    expect(error).toBeFalsy();
  });
});
