export default function debounce<T extends Function>(
  fn: T,
  timeout: number = 300
) {
  let timer: ReturnType<typeof setTimeout>;

  return <A>(...args: A[]) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, timeout);
  };
}
