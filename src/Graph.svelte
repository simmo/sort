<script lang="ts">
  import { onMount } from 'svelte';

  import Button from './Button.svelte';
  import type { Sorter } from './types';
  import track from './utils/track';

  export let items: number[];
  export let name: string;
  export let sort: Sorter;
  export let speed: number = 0;

  const enum State {
    Idle = 'IDLE',
    Running = 'RUNNING',
    Paused = 'PAUSED',
    Done = 'DONE',
  }

  let sortedItems: number[];
  let intervalId: number;

  let comparisonsCount: number = 0;
  let iterationsCount: number = 0;
  let operationsCount: number = 0;

  let pointers: number[] = [];
  let pivots: number[] = [];
  let comparisions: number[] = [];
  let operations: number[] = [];
  let sorted: number[] = [];

  let sorter: ReturnType<Sorter>;
  let state = State.Idle;
  let canvas: HTMLCanvasElement;
  let frameId: number;

  $: running = state === State.Running;
  $: paused = state === State.Paused;
  $: complete = state === State.Done;

  const dpr = window.devicePixelRatio || 1;

  function draw() {
    frameId = window.requestAnimationFrame(() => {
      const ctx = canvas.getContext('2d');
      const gap = 1 * dpr;
      const indicator = 5 * dpr;
      const barWidth =
        (canvas.width - (sortedItems.length - 1) * gap) / sortedItems.length;
      const maxBarHeight = canvas.height - indicator - gap;
      const minBarHeight = maxBarHeight / sortedItems.length;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ddd';
      ctx.fillRect(0, canvas.height - indicator, canvas.width, indicator);

      sortedItems.forEach((item, index) => {
        const barHeight = minBarHeight * item;
        const isPointer = pointers.includes(index);
        const isPivot = pivots.includes(index);

        if (isPointer || isPivot) {
          ctx.fillStyle = isPointer ? '#f39c12' : '#c0392b';

          ctx.fillRect(
            index * barWidth + index * gap,
            canvas.height - indicator,
            barWidth,
            indicator
          );
        }

        if (operations.includes(index)) {
          ctx.fillStyle = '#27ae60';
        } else if (comparisions.includes(index)) {
          ctx.fillStyle = '#f1c40f';
        } else if (sorted.includes(index)) {
          ctx.fillStyle = '#34495e';
        } else {
          ctx.fillStyle = '#bdc3c7';
        }

        ctx.fillRect(
          index * barWidth + index * gap,
          canvas.height - barHeight - indicator - gap,
          barWidth,
          barHeight
        );
      });
    });
  }

  function update() {
    operations = [];

    const { done } = sorter.next();

    draw();

    if (done) {
      comparisions = [];
      pointers = [];
      pivots = [];
      state = State.Done;
    }

    if (state === State.Running) {
      intervalId = setTimeout(update, speed);
    }
  }

  function reset() {
    state = State.Idle;
    comparisonsCount = 0;
    operationsCount = 0;
    iterationsCount = 0;
    sorted = [];
    comparisions = [];
    pointers = [];
    operations = [];
    pivots = [];

    sortedItems = [...items];

    sorter = sort(sortedItems, {
      onComparison: (...indicies) => {
        comparisonsCount++;
        comparisions = indicies;
      },
      onOperation: (...indicies) => {
        operationsCount++;
        operations = indicies;
      },
      onPivot: (...indicies) => {
        pivots = indicies;
      },
      onPointer: (...indicies) => {
        iterationsCount++;
        pointers = indicies;
      },
      onSorted: (...indicies) => {
        sorted = [...sorted, ...indicies];
      },
    });

    draw();
  }

  function start() {
    state = State.Running;

    update();

    track('click', { category: name, label: 'start' });
  }

  function next() {
    state = State.Paused;

    update();

    track('click', { category: name, label: 'next' });
  }

  function pause() {
    state = State.Paused;

    clearInterval(intervalId);

    track('click', { category: name, label: 'pause' });
  }

  onMount(() => {
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    reset();

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  });
</script>

<svelte:window on:resize={draw} />

<section>
  <header>
    <h2>{name}</h2>
    <Button disabled={complete} on:click={running ? pause : start}>
      {#if running}
        <img alt="Pause" src="pause.svg" />
      {:else}
        <img alt="Start" src="start.svg" />
      {/if}
    </Button>
    <Button disabled={complete || running} on:click={next}>
      <img alt="Next" src="next.svg" />
    </Button>
    <Button
      disabled={!complete && !paused}
      on:click={() => {
        track('click', { category: name, label: 'reset' });
        reset();
      }}
    >
      <img alt="Reset" src="reset.svg" />
    </Button>
  </header>
  <canvas class="canvas" bind:this={canvas} width="1800" height="900" />
  <footer>
    <ul class="details">
      <li>
        Iterations: <strong>{iterationsCount}</strong>
      </li>
      <li>
        Operations: <strong>{operationsCount}</strong>
      </li>
      <li>
        Comparisons: <strong>{comparisonsCount}</strong>
      </li>
    </ul>
  </footer>
</section>

<style>
  canvas {
    width: 100%;
  }

  section {
    background-color: var(--light-grey);
    border-radius: 0.3rem;
    display: grid;
    gap: 1rem;
    padding: 1rem;
  }

  header {
    align-items: center;
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 1fr auto auto auto;
  }

  footer {
    font-size: 0.9rem;
  }

  .details {
    display: grid;
    gap: 0.25rem 2rem;
    grid-template-columns: 1fr 1fr;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .details li {
    display: grid;
    gap: 0.25rem;
    grid-template-columns: 1fr auto;
  }

  h2 {
    margin: 0;
  }

  img {
    height: 1rem;
    width: 1rem;
  }
</style>
