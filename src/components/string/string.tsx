import { FC, ChangeEvent, useState, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { DELAY_IN_MS } from "../../constants/delays";
import { getReversingStringSteps } from "./helpers";
import styles from "./string.module.css";

export type TSplitString = {
  status: ElementStates,
  value: string
}[];

export const StringComponent: FC = () => {
  const [stringValue, setStringValue] = useState<string>("");
  const [splitString, setSplitString] = useState<TSplitString>([]);
  const [arraySteps, setArraySteps] = useState<TSplitString[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [reverseButtonState, setReverseButtonState] = useState<'default' | 'inProgress'>('default');

  useEffect(() => {
    if (arraySteps.length) {
      startAnim();
    }
  }, [arraySteps]);

  const onChangeString = (event: ChangeEvent<HTMLInputElement>) => {
    setStringValue(event.target.value);
  };

  const onClickButton = () => {
    const splitString = stringValue.split("").map((item) => ({ status: ElementStates.Default, value: item }));
    setReverseButtonState('inProgress');
    setSplitString(splitString);
    setArraySteps(getReversingStringSteps(splitString));
  };

  const startAnim = () => {
    const interval = setInterval(() => {
      setCurrentStep((currentStep) => {

        if (arraySteps.length === 1) {
          setReverseButtonState('default');
          clearInterval(interval);
          return 0;
        }
        const nextStep = currentStep + 1;

        if (nextStep >= arraySteps.length - 1 && interval) {
          setReverseButtonState('default');
          clearInterval(interval);
        }

        return nextStep;
      });
    }, DELAY_IN_MS);
  };

  return (
    <SolutionLayout title="Строка">
      <div className={styles.container}>
        <Input
          value={stringValue}
          isLimitText={true}
          maxLength={11}
          onChange={(e) => onChangeString(e as ChangeEvent<HTMLInputElement>)}
        />
        <Button
          text="Развернуть"
          onClick={onClickButton}
          disabled={!stringValue}
          isLoader={reverseButtonState === 'inProgress'}
        />
      </div>
      <div className={styles.circle}>
        {splitString.length
          ? (arraySteps.length ? arraySteps[currentStep] : splitString).map((item, index) => (
            <Circle letter={item.value} state={item.status} key={index} />
          ))
          : null}
      </div>
    </SolutionLayout>
  );
};
