const enum Dataset {
  Random = 'RANDOM',
  Reversed = 'REVERSED',
}

export type Sorter = <T>(
  items: T[],
  options: SorterOptions
) => Generator<void, T[]>;

export type SorterOptions = {
  onComparison?: (...indices: number[]) => void;
  onOperation?: (...indices: number[]) => void;
  onPivot?: (...indices: number[]) => void;
  onPointer?: (...indices: number[]) => void;
  onSorted?: (...indices: number[]) => void;
};

export enum ItemState {
  Idle,
  Comparing,
  Swapping,
  Swapped,
  Sorted,
}
