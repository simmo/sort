import type { SorterOptions } from '../types';
import swap from '../utils/swap';

export default function* bubbleSort<T>(
  items: T[],
  { onComparison, onOperation, onPointer, onSorted }: SorterOptions
) {
  const size = items.length;

  for (let i = 0; i < size; i++) {
    onPointer();

    const end = size - i - 1;

    for (let j = 0; j < end; j++) {
      onPointer(j);
      yield onComparison(j, j + 1);

      if (items[j + 1] < items[j]) {
        swap(items, j + 1, j);

        yield onOperation(j, j + 1);
      }
    }

    yield onSorted(end);
  }

  return items;
}
