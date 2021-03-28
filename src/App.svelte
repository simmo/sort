<script lang="ts">
  import Graph from './Graph.svelte';
  import bubbleSort from './sorts/bubbleSort';
  import cocktailSort from './sorts/cocktailSort';
  import insertionSort from './sorts/insertionSort';
  import oddEvenSort from './sorts/oddEvenSort';
  import quickSort from './sorts/quickSort';
  import selectionSort from './sorts/selectionSort';
  import debounce from './utils/debounce';

  import shuffle from './utils/shuffle';
  import track from './utils/track';

  const enum Dataset {
    Random = 'RANDOM',
    Reversed = 'REVERSED',
  }

  let initialItems: number[] = Array.from({ length: 50 }, (_, x) => x + 1);
  let dataset: Dataset = Dataset.Random;
  let items = initialItems;

  $: {
    switch (dataset) {
      case Dataset.Reversed:
        items = [...initialItems].reverse();
        break;
      case Dataset.Random:
        items = shuffle(items);
        break;
    }
  }

  const fastest = 0;
  const slowest = 100;
  let speed = 0;

  const trackSpeed = debounce(() => {
    track('change', {
      category: 'app',
      label: 'speed',
      value: speed,
    });
  }, 100);
</script>

<div class="page">
  <header>
    <div>
      <h1 class="heading">Sorting</h1>
      <p class="subHeading">
        Using visualisation to explore different sorting algorithms.
      </p>
    </div>
    <p>
      This project is built with <a href="https://svelte.dev">Svelte</a> and
      <a href="https://www.typescriptlang.org">TypeScript</a>. The sorting
      algorithms use nested
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator"
        >generator functions</a
      >, to asynchronously execute logic, render to
      <a href="https://developer.mozilla.org/ms/docs/Web/API/Canvas_API"
        >HTML canvas</a
      > and resume execution.
    </p>
    <p>
      <label for="speed"
        >Speed
        <small>Fast to Slow</small></label
      >
      <input
        min={fastest}
        max={slowest}
        step="10"
        type="range"
        bind:value={speed}
        on:input={trackSpeed}
      />
    </p>
  </header>
  <main>
    <Graph {speed} name="Bubble" {items} sort={bubbleSort} />
    <Graph {speed} name="Cocktail" {items} sort={cocktailSort} />
    <Graph {speed} name="Insertion" {items} sort={insertionSort} />
    <Graph {speed} name="Odd-Even" {items} sort={oddEvenSort} />
    <Graph {speed} name="Quick" {items} sort={quickSort} />
    <Graph {speed} name="Selection" {items} sort={selectionSort} />
  </main>
  <footer>
    Made by <a href="https://mike.id">Mike</a>
  </footer>
</div>

<style>
  .page {
    display: grid;
    gap: 2rem;
    max-width: 60rem;
    min-width: 320px;
    margin: 0 auto;
    padding: 5vw;
  }

  header {
    border-bottom: 1px solid var(--grey);
    display: grid;
    gap: 1.5rem;
    padding-bottom: 1rem;
  }

  .heading {
    font-size: 2.6rem;
    margin: 0;
  }

  .subHeading {
    font-size: 1.4rem;
  }

  header p {
    margin: 0;
  }

  main {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  }

  footer {
    border-top: 1px solid var(--grey);
    padding-top: 1rem;
    text-align: center;
  }
</style>
