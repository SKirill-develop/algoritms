import { FC, useState, ChangeEvent, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Stack } from "./helpers";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import styles from "./stack-page.module.css";

type TStackValue = {
  value: string,
  state: ElementStates;
}[];

export const StackPage: FC = () => {
  const [value, setValue] = useState("");
  const [stack, setStack] = useState<Stack<string>>();
  const [stackValue, setStackValue] = useState<TStackValue>([]);

  useEffect(() => {
    const stack = new Stack<string>();
    setStack(stack);
  }, []);

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const pushElement = () => {
    if (value) {
      stack!.push(value);
      setValue("");
      getElements({ startAnim: true });
    };
  };

  const deleteElement = () => {
    animation().then(() => {
      stack!.pop();
      getElements({ startAnim: false });
    });
  };

  const clearStack = () => {
    stack!.clear();
    getElements({ startAnim: false });
  };

  const animation = async (stack: TStackValue = stackValue) => {
    const length = stack.length;
    const lastEl = stack[length - 1];
    stack[length - 1] = { ...lastEl, state: ElementStates.Changing }
    setStackValue([...stack]);
    await new Promise((res, rej) => setTimeout(() => {
      stack[length - 1] = { ...lastEl, state: ElementStates.Default };
      setStackValue([...stack]);
      res('');
    }, SHORT_DELAY_IN_MS))
  }

  const getElements = ({ startAnim }: { startAnim: boolean }) => {
    const elements = stack!.getElements();
    const elementsData: TStackValue = elements.map((item) => ({ value: item, state: ElementStates.Default }));
    setStackValue([...elementsData]);
    if (startAnim) {
      animation(elementsData);
    }
  };

  return (
    <SolutionLayout title="Стек">
      <div className={styles.control}>
        <div className={styles.container}>
          <Input
            value={value}
            onChange={(event) => onChangeInput(event as ChangeEvent<HTMLInputElement>)}
            extraClass={styles.input}
            maxLength={4}
            isLimitText={true}
          />
          <Button text="Добавить" onClick={pushElement} disabled={!value} />
          <Button text="Удалить" onClick={deleteElement} disabled={!stackValue.length} />
        </div>
        <Button text="Очистить" onClick={clearStack} disabled={!stackValue.length} />
      </div>
      <div className={styles.circles}>
        {stackValue.length
          ? stackValue.map((item, index) => (
            <Circle
              state={item.state}
              letter={item.value}
              key={index}
              index={index}
              head={index === stackValue.length - 1 ? "top" : null}
            />
          ))
          : null}
      </div>
    </SolutionLayout>
  );
};
