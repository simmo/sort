<button {...$$props} on:click>
  <slot />
</button>

<style>
  button {
    appearance: none;
    background-color: #f9f9f9;
    border-radius: 0.3rem;
    border: 1px solid #ddd;
    display: inline-grid;
    line-height: 1;
    margin: 0;
    padding: 0.5rem;
  }

  button:not(:disabled) {
    cursor: pointer;
    transition: border 0.3s;
  }

  button:not(:disabled):hover,
  button:not(:disabled):focus {
    color: var(--light-green);
    border-color: var(--light-green);
  }

  button:disabled {
    border-color: var(--grey);
    filter: grayscale(1);
    opacity: 0.6;
  }
</style>
