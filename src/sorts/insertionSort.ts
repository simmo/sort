import type { SorterOptions } from '../types';
import swap from '../utils/swap';

export default function* insertionSort<T>(
  items: T[],
  { onComparison, onOperation, onPointer, onSorted }: SorterOptions
) {
  yield onSorted(0);

  for (let i = 1; i < items.length; i++) {
    yield onPointer();

    for (let j = i - 1; j > -1; j--) {
      onPointer(j);
      yield onComparison(j, j + 1);

      if (items[j + 1] < items[j]) {
        swap(items, j + 1, j);

        yield onOperation(j, j + 1);
      }
    }

    yield onSorted(i);
  }

  return items;
}
