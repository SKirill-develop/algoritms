import { FC, ChangeEvent, useState, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Circle } from "../ui/circle/circle";
import { Button } from "../ui/button/button";
import { Input } from "../ui/input/input";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { getFibonacciNumbers } from "./helpers";
import styles from "./fibonacci-page.module.css";

export const FibonacciPage: FC = () => {
  const [value, setValue] = useState("");
  const [fibonacciNumbers, setFibonacciNumbers] = useState<number[]>([]);
  const [counter, setCounter] = useState({ value: 0 });
  const [algorithmState, setAlgorithmState] = useState({ inProgress: false });
  const [startButtonIsDisabled, setStartButtonIsDisabled] = useState<boolean>(true);

  const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue(value);
    if (+value < 20 && +value > 0 && startButtonIsDisabled) {
      setStartButtonIsDisabled(false);
    } else if (!startButtonIsDisabled) {
      setStartButtonIsDisabled(true);
    }
  };

  const onButtonClick = (value: number) => {
    setAlgorithmState({ inProgress: true });
    setCounter({ value: 0 });
    setFibonacciNumbers(getFibonacciNumbers(Math.floor(value)));
  };

  useEffect(() => {
    if (fibonacciNumbers.length) {
      const interval = setInterval(
        () => setCounter({ value: counter.value++ }),
        SHORT_DELAY_IN_MS
      );

      if (counter.value === fibonacciNumbers.length) {
        clearInterval(interval);
        setAlgorithmState({ inProgress: false });
      }

      return () => {
        clearInterval(interval);
      };
    }
  }, [fibonacciNumbers.length, counter.value]);

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <div className={styles.container}>
        <Input
          value={value}
          isLimitText={true}
          type={""}
          max={19}
          onChange={(event) => onChangeValue(event as ChangeEvent<HTMLInputElement>)}
        />
        <Button
          disabled={startButtonIsDisabled}
          text="Рассчитать"
          onClick={() => onButtonClick(+value)}
          isLoader={algorithmState.inProgress}
        />
      </div>
      <div className={styles.circle}>
        {fibonacciNumbers.length
          ? fibonacciNumbers.map((item, index) => {
            if (index <= counter.value) {
              return <Circle letter={`${item}`} key={index} index={index} />;
            }
            return null;
          })
          : null}
      </div>
    </SolutionLayout>
  );
};
