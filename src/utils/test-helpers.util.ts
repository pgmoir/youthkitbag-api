export function expectNoProperty(obj: object, prop: string) {
  expect(Object.prototype.hasOwnProperty.call(obj, prop)).toBe(false);
}
