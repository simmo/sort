import type { SorterOptions } from '../types';
import swap from '../utils/swap';

export default function* quickSort<T>(
  rawItems: T[],
  { onComparison, onOperation, onPivot, onPointer, onSorted }: SorterOptions
) {
  function* partition<T>(items: T[], left: number, right: number) {
    const pivot = Math.floor((left + right) / 2);
    const pivotValue = items[pivot];

    onPivot(pivot);
    yield onPointer(left, right);

    while (left <= right) {
      yield onPointer(left, right);

      while (items[left] < pivotValue) {
        left++;
        yield onPointer(left, right);
      }

      while (items[right] > pivotValue) {
        right--;
        yield onPointer(left, right);
      }

      yield onComparison(left, right);

      if (left <= right) {
        swap(items, left, right);

        yield onOperation(left, right);

        left++;
        right--;

        yield onPointer(left, right);
      }
    }

    return left;
  }

  function* sort(
    items: T[],
    left: number = 0,
    right: number = items.length - 1
  ) {
    const pivot = yield* partition(items, left, right);

    yield onComparison(left, pivot - 1);

    if (left < pivot - 1) {
      yield* sort(items, left, pivot - 1);
    }

    yield onComparison(right, pivot);

    if (right > pivot) {
      yield* sort(items, pivot, right);
    }

    yield onSorted(
      ...Array.from({ length: right - left + 1 }, (_, x) => left + x)
    );

    yield items;
  }

  return yield* sort(rawItems);
}
