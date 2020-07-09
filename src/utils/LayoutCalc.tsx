export const getAbsoluteValue = ( width: number, value: number ) => {
  const res = width / 100 * value;
  return res < 0 ? 0 : res;
};