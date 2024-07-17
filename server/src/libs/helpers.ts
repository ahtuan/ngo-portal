import { Parser, Value } from "expr-eval";

export const defaultValue = (value: any): any => {
  if (value === undefined || value === null) {
    return undefined;
  }
  return value;
};

export const evaluateExp = (
  expression?: string | null,
  values?: Value | undefined,
) => {
  if (!expression) {
    return undefined;
  }
  const result = Parser.evaluate(expression, values);
  return result;
};

export const fixed = (value: number, decimals: number = 0) => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};
