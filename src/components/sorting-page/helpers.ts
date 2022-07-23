import { TArray, TColumnData } from "./sorting-page";
import { BLUE, GREEN, VIOLET } from "../../constants/colors";

export const getBubbleSortSteps = (
  initialArray: TArray,
  method: "ascending" | "descending"
) => {
  const arraySteps: TArray[] = [];
  let sortableArray = copyArray(initialArray);
  const length = sortableArray.length;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length - i - 1; j++) {
      if (sortableArray[j - 1]) {
        sortableArray[j - 1].color = BLUE;
      }
      sortableArray[j].color = VIOLET;
      sortableArray[j + 1].color = VIOLET;
      arraySteps.push(copyArray(sortableArray));
      if (method === "ascending") {
        if (sortableArray[j + 1].value < sortableArray[j].value) {
          swap(sortableArray, j, j + 1);
        }
      } else {
        if (sortableArray[j + 1].value > sortableArray[j].value) {
          swap(sortableArray, j, j + 1);
        }
      }
      if (j === length - i - 2) {
        sortableArray[j + 1].color = GREEN;
        sortableArray[j].color = BLUE;
        arraySteps.push(copyArray(sortableArray));
      }
      if (j === 0) {
        sortableArray[j].color = GREEN;
        arraySteps.push(copyArray(sortableArray));
      }
    }
  }
  return arraySteps;
};

export const getSelectionSortSteps = (
  initialArray: TArray,
  method: "ascending" | "descending"
) => {
  const arrSteps: TArray[] = [];
  arrSteps.push(copyArray(initialArray));
  let sortableArray = copyArray(initialArray);
  const length = sortableArray.length;
  const cycle = (i: number) => {
    if (i < length) {
      let maxInd = i;
      sortableArray[i].color = VIOLET;
      arrSteps.push(copyArray(sortableArray));

      const findMax = (j: number) => {
        if (j < length) {
          sortableArray[j].color = VIOLET;
          arrSteps.push(copyArray(sortableArray));

          if (method === "ascending") {
            if (sortableArray[j].value < sortableArray[maxInd].value) {
              maxInd = j;
            }
          } else {
            if (sortableArray[j].value > sortableArray[maxInd].value) {
              maxInd = j;
            }
          }
          if (i !== j) {
            sortableArray[j].color = BLUE;
            arrSteps.push(copyArray(sortableArray));
          }

          findMax(j + 1);
        }
      };

      findMax(i);
      if (maxInd !== i) {
        swap(sortableArray, maxInd, i);
        sortableArray[i].color = GREEN;
        sortableArray[maxInd].color = BLUE;
        arrSteps.push(copyArray(sortableArray));
      } else {
        sortableArray[maxInd].color = GREEN;
        arrSteps.push(copyArray(sortableArray));
      }

      cycle(i + 1);
    }
  };
  cycle(0);
  return arrSteps;
};

const swap = (arr: TArray, firstIndex: number, secondIndex: number): void => {
  const temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
};

const copyArray = (arr: TArray) => {
  const cloneArray: TArray = [];
  arr.forEach((item, index) => {
    let newEl: TColumnData | {} = {};
    for (let key in item) {
      //@ts-ignore
      newEl[key] = item[key];
    }
    //@ts-ignore
    cloneArray[index] = newEl;
  });
  return cloneArray;
};
