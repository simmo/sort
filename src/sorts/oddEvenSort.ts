import type { SorterOptions } from '../types';
import swap from '../utils/swap';

export default function* oddEvenSort<T>(
  items: T[],
  { onComparison, onOperation, onPointer, onSorted }: SorterOptions
) {
  const size = items.length - 1;
  let sorted = false;

  while (!sorted) {
    sorted = true;

    for (let i = 1; i <= size; i += 2) {
      onPointer(i);
      yield onComparison(i, i + 1);

      if (items[i] > items[i + 1]) {
        swap(items, i, i + 1);

        yield onOperation(i, i + 1);

        sorted = false;
      }
    }

    for (let i = 0; i <= size; i += 2) {
      onPointer(i);
      yield onComparison(i, i + 1);

      if (items[i] > items[i + 1]) {
        swap(items, i, i + 1);

        yield onOperation(i, i + 1);

        sorted = false;
      }
    }
  }

  yield onSorted(...items.map((_, x) => x));

  return items;
}
