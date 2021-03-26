<script lang="ts">
  import { onMount } from 'svelte';

  import Button from './Button.svelte';
  import type { Sorter } from './types';

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

  const dpr = window.devicePixelRatio || 2;

  function draw() {
    const ctx = canvas.getContext('2d');
    const gap = 1 * dpr;
    const indicator = 5 * dpr;
    const barWidth =
      (canvas.width - (sortedItems.length - 1) * gap) / sortedItems.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, canvas.height - indicator, canvas.width, indicator);

    sortedItems.forEach((item, index) => {
      const barHeight = canvas.height * (item / sortedItems.length) - indicator;
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
  }

  onMount(() => {
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    frameId = window.requestAnimationFrame(reset);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  });

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
    const nextStep = () => {
      state = State.Running;
      operations = [];

      const { done } = sorter.next();

      frameId = window.requestAnimationFrame(draw);

      if (done) {
        comparisions = [];
        pointers = [];
        pivots = [];
        state = State.Done;
      } else {
        intervalId = setTimeout(nextStep, speed);
      }
    };

    nextStep();
  }

  function pause() {
    clearInterval(intervalId);
    intervalId = undefined;
    state = State.Paused;
  }
</script>

<section>
  <header>
    <h2>{name}</h2>
    <Button disabled={complete} on:click={running ? pause : start}>
      <img
        alt={running ? 'Pause' : 'Start'}
        src={`${running ? 'pause' : 'start'}.svg`}
      />
    </Button>
    <Button disabled={!complete && !paused} on:click={reset}>
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
    background-color: #ecf0f1;
    border-radius: 0.3rem;
    display: grid;
    gap: 1rem;
    padding: 1rem;
  }

  header {
    align-items: center;
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 1fr auto auto;
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
