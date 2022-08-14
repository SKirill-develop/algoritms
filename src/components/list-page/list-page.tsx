import { FC, useState, useEffect, ChangeEvent, ReactElement } from "react";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { LinkedList } from "./helpers";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import styles from "./list-page.module.css";

type TElState = {
  value: number | string | undefined;
  state: ElementStates;
  head: "head" | ReactElement | null;
  tail: "tail" | ReactElement | null;
};

type TDefaultButtonsState = "default" | "disabled" | "isLoader";

type TButtonsState = {
  addToHead: TDefaultButtonsState;
  addToTail: TDefaultButtonsState;
  deleteFromHead: TDefaultButtonsState;
  deleteFromTail: TDefaultButtonsState;
  addByIndex: TDefaultButtonsState;
  deleteByIndex: TDefaultButtonsState;
  indexInputValue: TDefaultButtonsState;
  elInputValue: TDefaultButtonsState;
};

export const ListPage: FC = () => {
  const [linkedList, setLinkedList] = useState<LinkedList<number | string>>();
  const [linkedListValue, setLinkedListValue] = useState<TElState[] | null>(
    null
  );
  const [indexInputValue, setIndexInputValue] = useState('');
  const [elInputValue, setElInputValue] = useState("");
  const [arraySteps, setArraySteps] = useState<TElState[][]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const defaultButtonsState: TButtonsState = {
    addToHead: "default",
    addToTail: "default",
    deleteFromHead: "default",
    deleteFromTail: "default",
    addByIndex: "default",
    deleteByIndex: "default",
    indexInputValue: "default",
    elInputValue: "default"
  };

  const [buttonsState, setButtonsState] =
    useState<TButtonsState>(defaultButtonsState);

  useEffect(() => {
    const newLinkedList = new LinkedList<number | string>(getRandomArr());
    setLinkedList(newLinkedList);
  }, []);

  useEffect(() => {
    if (arraySteps.length) {
      startAnim();
    }
  }, [arraySteps]);

  useEffect(() => {
    if (linkedList) {
      updateLinkedListValue();
    }
  }, [linkedList]);


  const startAnim = () => {
    const interval = setInterval(() => {
      setCurrentStep((currentStep) => {
        const nextStep = currentStep + 1;

        if (nextStep >= arraySteps.length - 1 && interval) {
          clearInterval(interval);
          setElInputValue("");
          setIndexInputValue("");
          setCurrentStep(0);
          setArraySteps([]);

          setButtonsState(defaultButtonsState);
        }

        return nextStep;
      });
    }, SHORT_DELAY_IN_MS);
  };

  const getDefaultLinkedListValue = (array: (number | string)[] | null) => {
    if (!array) {
      return [];
    }
    const res: TElState[] = [];
    array.forEach((el, index) => {
      res.push({
        value: el,
        state: ElementStates.Default,
        head: index === 0 ? "head" : null,
        tail: index === array.length - 1 ? "tail" : null,
      });
    });
    return res;
  };

  const updateLinkedListValue = () => {
    setLinkedListValue(getDefaultLinkedListValue(linkedList!.toArray()));
  };

  const getRandomArr = () => {
    const randomArray: (number | string)[] = [];

    const maxValue = 9999;
    const minValue = 1;

    const minLengthArray = 3;
    const maxLengthArray = 6;

    const lengthArr = Math.floor(
      Math.random() * (maxLengthArray - minLengthArray + 1) + minLengthArray
    );

    for (let i = 0; i < lengthArr; i++) {
      const value = Math.floor(
        Math.random() * (maxValue - minValue + 1) + minValue
      );
      randomArray.push(value);
    }

    return randomArray;
  };

  const onChangeEl = (event: ChangeEvent<HTMLInputElement>) => {
    setElInputValue(event.target.value);
  };

  const onChangeIndex = (event: ChangeEvent<HTMLInputElement>) => {
    setIndexInputValue(event.target.value);
  };

  const pushElToHead = () => {
    setButtonsStateInProcess('addToHead');
    const arraySteps = [];
    const initialArr = linkedListValue!;
    if (initialArr.length) {
      initialArr[0].head = (
        <Circle
          isSmall={true}
          letter={elInputValue}
          state={ElementStates.Changing}
        />
      );
    }
    arraySteps.push(copyArray(initialArr));

    linkedList?.prepend(+elInputValue || elInputValue);
    updateLinkedListValue();

    let newArray = getDefaultLinkedListValue(linkedList!.toArray());
    if (newArray[1]) {
      newArray[1].head = null;
    }
    newArray[0].state = ElementStates.Modified;
    arraySteps.push(copyArray(newArray));

    newArray[0].state = ElementStates.Default;
    arraySteps.push(copyArray(newArray));

    newArray = getDefaultLinkedListValue(linkedList!.toArray());
    arraySteps.push(copyArray(newArray));

    setArraySteps(arraySteps);
  };

  const copyArray = (array: TElState[]) => {
    const cloneArray: TElState[] = [];
    array.forEach((item, index) => {
      let newEl: TElState | {} = {};
      for (let key in item) {
      //@ts-ignore
        newEl[key] = item[key];
      }
      //@ts-ignore
      cloneArray[index] = newEl;
    });
    return cloneArray;
  };

  const pushElToTail = () => {
    setButtonsStateInProcess('addToTail');
    const arraySteps = [];
    const initialArr = linkedListValue!;
    if (initialArr.length) {
      initialArr[initialArr.length - 1].head = (
        <Circle
          isSmall={true}
          letter={elInputValue}
          state={ElementStates.Changing}
        />
      );
    }

    arraySteps.push(copyArray(initialArr));

    linkedList?.append(+elInputValue || elInputValue);
    updateLinkedListValue();

    let newArray = getDefaultLinkedListValue(linkedList!.toArray());
    if (newArray[newArray.length - 2]) {
      newArray[newArray.length - 2].head = null;
    }
    newArray[newArray.length - 1].state = ElementStates.Modified;
    arraySteps.push(copyArray(newArray));

    newArray[newArray.length - 1].state = ElementStates.Default;
    arraySteps.push(copyArray(newArray));

    newArray = getDefaultLinkedListValue(linkedList!.toArray());
    arraySteps.push(copyArray(newArray));

    setArraySteps(arraySteps);
  };

  const deleteHead = () => {
    setButtonsStateInProcess('deleteFromHead');
    const arraySteps = [];
    const initialArr = linkedListValue!;
    initialArr[0].tail = (
      <Circle
        isSmall={true}
        letter={`${initialArr[0].value}`}
        state={ElementStates.Changing}
      />
    );
    initialArr[0].value = undefined;
    arraySteps.push(copyArray(initialArr));

    linkedList?.deleteHead();
    updateLinkedListValue();

    let newArray = getDefaultLinkedListValue(linkedList!.toArray());
    arraySteps.push(copyArray(newArray));

    setArraySteps(arraySteps);
  };

  const deleteTail = () => {
    setButtonsStateInProcess('deleteFromTail');
    const arraySteps = [];
    const initialArr = linkedListValue!;
    initialArr[initialArr.length - 1].tail = (
      <Circle
        isSmall={true}
        letter={`${initialArr[0].value}`}
        state={ElementStates.Changing}
      />
    );
    initialArr[initialArr.length - 1].value = undefined;
    arraySteps.push(copyArray(initialArr));

    linkedList?.deleteTail();
    updateLinkedListValue();

    let newArr = getDefaultLinkedListValue(linkedList!.toArray());
    arraySteps.push(copyArray(newArr));

    setArraySteps(arraySteps);
  };

  const deleteByIndex = () => {
    if (isNaN(+indexInputValue)) {
      alert('Индекс должен быть числом!')
      return
    }
    if (Number(indexInputValue) < 0 || Number(indexInputValue) > linkedListValue?.length! - 1) {
      alert('Введите корректный индекс!')
      return
    }
    const arraySteps = [];
    const initialArr = linkedListValue!;

    linkedList?.deleteByIndex(Number(indexInputValue));
    updateLinkedListValue();

    let i = 0;
    while (i <= Number(indexInputValue)) {
      initialArr[i].state = ElementStates.Changing;
      arraySteps.push(copyArray(initialArr));

      i++;
    }

    initialArr[i - 1].state = ElementStates.Default;
    initialArr[i - 1].tail = (
      <Circle
        isSmall={true}
        letter={`${initialArr[i - 1].value}`}
        state={ElementStates.Changing}
      />
    );
    initialArr[i - 1].value = undefined;
    arraySteps.push(copyArray(initialArr));

    let newArr = getDefaultLinkedListValue(linkedList!.toArray());
    arraySteps.push(copyArray(newArr));

    setArraySteps(arraySteps);
  };

  const pushByIndex = () => {
    if (isNaN(+indexInputValue)) {
      alert('Индекс должен быть числом!')
      return
    }
    if (Number(indexInputValue) < 0 || Number(indexInputValue) > linkedListValue?.length! - 1) {
      alert('Введите корректный индекс!')
      return
    }
    const arraySteps = [];
    const initialArr = linkedListValue!;

    linkedList?.addByIndex(+elInputValue || elInputValue, Number(indexInputValue));
    updateLinkedListValue();

    initialArr[0].head = (
      <Circle
        isSmall={true}
        letter={elInputValue}
        state={ElementStates.Changing}
      />
    )
    arraySteps.push(copyArray(initialArr));

    if (Number(indexInputValue) === 0) {
      let newArray = getDefaultLinkedListValue(linkedList!.toArray());
      newArray[Number(indexInputValue)].state = ElementStates.Modified;
      arraySteps.push(copyArray(newArray));

      newArray = getDefaultLinkedListValue(linkedList!.toArray());
      arraySteps.push(copyArray(newArray));

      setArraySteps(arraySteps);
      return;
    }

    initialArr[0].head = 'head';
    let i = 1;
    while (i < Number(indexInputValue)) {
      initialArr[i - 1].state = ElementStates.Changing;
      if (i - 1 !== 0) {
        initialArr[i - 1].head = null;
      }
      initialArr[i].head = (
        <Circle
          isSmall={true}
          letter={elInputValue}
          state={ElementStates.Changing}
        />
      )
      arraySteps.push(copyArray(initialArr));
      i++;
    }
    if (i - 1 !== 0) {
      initialArr[i - 1].head = null;
    }
    initialArr[i - 1].state = ElementStates.Changing;
    initialArr[i].head = (
      <Circle
        isSmall={true}
        letter={elInputValue}
        state={ElementStates.Changing}
      />
    )
    arraySteps.push(copyArray(initialArr));

    let newArray = getDefaultLinkedListValue(linkedList!.toArray());
    newArray[Number(indexInputValue)].state = ElementStates.Modified;
    arraySteps.push(copyArray(newArray));

    newArray = getDefaultLinkedListValue(linkedList!.toArray());
    arraySteps.push(copyArray(newArray));

    setArraySteps(arraySteps);
  };

  const setButtonsStateInProcess = (
    typeAnim:
      | "addToHead"
      | "addToTail"
      | "deleteFromHead"
      | "deleteFromTail"
      | "addByIndex"
      | "deleteByIndex"
  ) => {
    const buttonState = buttonsState;
    for (let key in buttonState) {
      if (key === typeAnim) {
        buttonState[key] = 'isLoader'
      } else {
        //@ts-ignore
        buttonState[key] = 'disabled'
      }
    }
    setCurrentStep(0);
  };

  return (
    <SolutionLayout title="Связный список">
      <div className={styles.container}>
        <Input
          isLimitText={true}
          maxLength={4}
          placeholder="Введите значение"
          onChange={onChangeEl}
          value={elInputValue}
          data-testid="elInput"
          disabled={buttonsState.elInputValue === 'disabled'}
        />
        <Button
          text="Добавить в head"
          onClick={pushElToHead}
          disabled={buttonsState.addToHead === "disabled" || !elInputValue}
          data-testid="addToHeadButton"
          isLoader={buttonsState.addToHead === "isLoader"}
        />
        <Button
          text="Добавить в tail"
          onClick={pushElToTail}
          disabled={buttonsState.addToTail === "disabled" || !elInputValue}
          data-testid="addToTailButton"
          isLoader={buttonsState.addToTail === "isLoader"}
        />
        <Button
          text="Удалить из head"
          onClick={deleteHead}
          disabled={buttonsState.deleteFromHead === "disabled" || linkedListValue?.length === 0}
          data-testid="removeFromHeadButton"
          isLoader={buttonsState.deleteFromHead === "isLoader"}
        />
        <Button
          text="Удалить из tail"
          onClick={deleteTail}
          disabled={buttonsState.deleteFromTail === "disabled" || linkedListValue?.length === 0}
          data-testid="removeFromTailButton"
          isLoader={buttonsState.deleteFromTail === "isLoader"}
        />
        <Input
          placeholder="Введите индекс"
          onChange={onChangeIndex}
          value={`${indexInputValue}`}
          data-testid="indexInput"
          disabled={buttonsState.indexInputValue === 'disabled'}
        />
        <Button
          text="Добавить по индексу"
          extraClass={styles.addIndexButton}
          onClick={pushByIndex}
          disabled={buttonsState.addByIndex === "disabled" || (!elInputValue || !indexInputValue)}
          data-testid="addByIndexButton"
          isLoader={buttonsState.addByIndex === "isLoader"}
        />
        <Button
          text="Удалить по индексу"
          extraClass={styles.deleteIndexButton}
          onClick={deleteByIndex}
          disabled={buttonsState.deleteByIndex === "disabled" || !indexInputValue}
          data-testid="deleteByIndexButton"
          isLoader={buttonsState.deleteByIndex === "isLoader"}
        />
      </div>
      <div className={styles.circles}>
        {linkedListValue &&
          (arraySteps.length ? arraySteps[currentStep] : linkedListValue).map(
            (item, index) => (
              <div
                className={styles.circle}
                key={`container ${index}`}
              >
                {index !== 0 ? <ArrowIcon key={`arrow ${index}`} /> : null}
                <Circle
                  letter={item.value || item.value === 0 ? `${item.value}` : undefined}
                  key={`circle ${index}`}
                  index={index}
                  head={item.head}
                  tail={item.tail}
                  state={item.state}
                />
              </div>
            )
          )}
      </div>
    </SolutionLayout>
  );
};
