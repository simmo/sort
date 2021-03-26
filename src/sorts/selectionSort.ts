import type { SorterOptions } from '../types';
import swap from '../utils/swap';

export default function* selectionSort<T>(
  items: T[],
  { onComparison, onOperation, onPointer, onSorted }: SorterOptions
) {
  const size = items.length;
  let min: number;

  for (let i = 0; i < size; i++) {
    onPointer();

    min = i;

    for (let j = i + 1; j < size; j++) {
      onPointer(j);
      yield onComparison(j, min);

      if (items[j] < items[min]) {
        min = j;
      }
    }

    yield onComparison(i, min);

    if (min !== i) {
      swap(items, i, min);

      yield onOperation(i, min);
    }

    yield onSorted(i);
  }

  return items;
}
