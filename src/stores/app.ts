import { derived, writable } from 'svelte/store';

type Data = {
  dataset: number[];
  playing: boolean;
  speed: number;
};

const createStore = () => {
  const initialItems = Array.from({ length: 50 }, (_, x) => x + 1);

  const { set, subscribe, update } = writable<Data>({
    dataset: Array.from({ length: 50 }, (_, x) => x + 1),
    playing: false,
    speed: 10,
  });

  return {
    playPause: () => update((prev) => ({ ...prev, playing: !prev.playing })),
    set,
    subscribe,
  };
};

export default createStore();
