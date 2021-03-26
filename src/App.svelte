<script lang="ts">
  import Graph from './Graph.svelte';
  import bubbleSort from './sorts/bubbleSort';
  import cocktailSort from './sorts/cocktailSort';
  import insertionSort from './sorts/insertionSort';
  import oddEvenSort from './sorts/oddEvenSort';
  import quickSort from './sorts/quickSort';
  import selectionSort from './sorts/selectionSort';

  import shuffle from './utils/shuffle';

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
  const slowest = 500;
  let speed = 0;
</script>

<div class="page">
  <header>
    <h1>Sorting</h1>
    <p>Using visualisation to explore different sorting algorithms.</p>
    <p>
      <label for="speed">Speed (Fast to Slow)</label>
      <input
        min={fastest}
        max={slowest}
        step="1"
        type="range"
        bind:value={speed}
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
    border-bottom: 1px solid #eee;
    display: grid;
    gap: 1rem;
    padding-bottom: 1rem;
  }

  header h1 {
    margin: 0;
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
    border-top: 1px solid #eee;
    padding-top: 2rem;
    text-align: center;
  }
</style>
