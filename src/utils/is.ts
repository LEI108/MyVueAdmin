export function isFunction<T extends (...args: any[]) => unknown>(
  val: unknown,
): val is T {
  return typeof val === 'function'
}
