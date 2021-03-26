import type { SorterOptions } from '../types';
import swap from '../utils/swap';

export default function* cocktailSort<T>(
  items: T[],
  { onComparison, onOperation, onPointer, onSorted }: SorterOptions
) {
  let start = 0;
  let end = items.length - 1;
  let sorted = false;

  while (!sorted) {
    sorted = true;

    for (let i = start; i < end; i++) {
      onPointer(i);
      yield onComparison(i, i + 1);

      if (items[i] > items[i + 1]) {
        swap(items, i, i + 1);

        yield onOperation(i, i + 1);

        sorted = false;
      }
    }

    yield onSorted(end);

    end--;

    if (sorted) break;

    sorted = true;

    for (let i = end; i > start; i--) {
      onPointer(i);
      yield onComparison(i, i - 1);

      if (items[i - 1] > items[i]) {
        swap(items, i, i - 1);

        yield onOperation(i, i - 1);

        sorted = false;
      }
    }

    yield onSorted(start);

    start++;
  }

  yield onSorted(
    ...Array.from({ length: end - start + 1 }, (_, x) => start + x)
  );

  return items;
}
