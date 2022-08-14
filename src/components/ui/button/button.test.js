import renderer from "react-test-renderer";
import { render, getByTestId, fireEvent } from "@testing-library/react";
import { Button } from "./button";

const randomString = "Text";
describe("Кнопка рендерится без ошибок", () => {
  it("Кнопка с текстом", () => {
    const button = renderer.create(<Button text={randomString} />).toJSON();
    expect(button).toMatchSnapshot();
  });

  it("Кнопка без текста", () => {
    const button = renderer.create(<Button />).toJSON();
    expect(button).toMatchSnapshot();
  });

  it("Заблокированная кнопка", () => {
    const button = renderer.create(<Button disabled={true} />).toJSON();
    expect(button).toMatchSnapshot();
  });

  it("Кнопка с лоадером", () => {
    const button = renderer.create(<Button isLoader={true} />).toJSON();
    expect(button).toMatchSnapshot();
  });

  it("Нажатие на кнопку вызывает корректный alert", () => {
    window.alert = jest.fn();
    const { container } = render(
      <Button onClick={alert("Клик по кнопке!")} data-testid="button" />
    );
    const button = getByTestId(container, "button");
    fireEvent.click(button);
    expect(window.alert).toHaveBeenCalledWith("Клик по кнопке!");
  });
});
