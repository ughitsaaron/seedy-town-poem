import { random } from 'lodash';

export function selectRandomArrayElement(arr: ArrayLike<any>): any {
  const index: number = random(0, arr.length - 1);

  return arr[index];
}
