export type SurveyAsnwer = {
  image: string;
  answer: string;
};

export interface AddSurveyModel {
  question: string;
  answers: SurveyAsnwer[]
}

export interface AddSurvey {
  add (data: AddSurveyModel): Promise<void>
}
