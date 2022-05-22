import { badRequest, created, serverError } from "../../../helpers/http/http-helper";
import { AddSurveyController } from "./add-survery-controller";
import { AddSurvey, AddSurveyModel, HttpRequest, Validation } from "./add-survey-protocols";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: "any_question",
    answers: [{
      image: "any_image",
      answer: "any_answer",
    }],
  },
});

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyModel): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }

  return new AddSurveyStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

type SutTypes = {
  sut: AddSurveyController;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const addSurveyStub = makeAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);

  return {
    sut,
    validationStub,
    addSurveyStub,
  };
};

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error());
    
    const httpRequest = makeFakeRequest();
    const httResponse = await sut.handle(httpRequest);

    expect(httResponse).toEqual(badRequest(new Error));
  });

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyStub, "add");
    
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut();
    jest.spyOn(addSurveyStub, "add").mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    );
    
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 201 on success', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(created());
  });
});
