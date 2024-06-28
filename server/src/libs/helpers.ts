export const defaultValue = (value: any): any => {
  if (value === undefined || value === null) {
    return undefined;
  }
  return value;
};
