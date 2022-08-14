import { TSplitString } from "./string";
import { ElementStates } from "../../types/element-states";

export const getReversingStringSteps = (
  splitString: TSplitString | []
): TSplitString[] | null => {
  const arraySteps: TSplitString[] = [];

  const expandString = (
    array = copyArray(splitString),
    start: number = 0,
    end: number = array.length - 1
  ) => {

    if (!splitString.length) {
      return arraySteps;
    }

    if (start >= end || array.length < 2) {
      array[start].status = ElementStates.Modified;
      arraySteps.push(copyArray(array));
      return arraySteps;
    }

    array[start].status = ElementStates.Changing;
    array[end].status = ElementStates.Changing;
    arraySteps.push(copyArray(array));

    const temp = array[start];
    array[start] = array[end];
    array[end] = temp;
    array[start].status = ElementStates.Modified;
    array[end].status = ElementStates.Modified;
    arraySteps.push(copyArray(array));

    expandString(array, start + 1, end - 1);
  };
  expandString();

  return arraySteps;
};

const copyArray = (array: TSplitString) => {
  const cloneArray: TSplitString = [];
  array.forEach((item, index) => {
    let newEl: TSplitString | {} = {};
    for (let key in item) {
      //@ts-ignore
      newEl[key] = item[key];
    }
    //@ts-ignore
    cloneArray[index] = newEl;
  });
  return cloneArray;
};
