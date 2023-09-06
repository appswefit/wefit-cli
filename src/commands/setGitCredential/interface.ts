enum ChoiceEnum {
  ONE = "1",
  TWO = "2",
  EMPTY = "",
}

type TextChoice = ChoiceEnum.ONE | ChoiceEnum.TWO;

export { ChoiceEnum, TextChoice };
