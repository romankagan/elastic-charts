import { Datum } from './commons';

type UnaryAccessorFn = (datum: Datum) => any;
type BinaryAccessorFn = (datum: Datum, index: number) => any;

export type AccessorFn = UnaryAccessorFn;
export type IndexedAccessorFn = UnaryAccessorFn | BinaryAccessorFn;
type AccessorObjectKey = string;
type AccessorArrayIndex = number;
export type Accessor = AccessorObjectKey | AccessorArrayIndex;

/**
 * Accessor format for _banded_ series as postfix string or accessor function
 */
export type AccessorFormat = string | ((value: string) => string);

/**
 * Return an accessor function using the accessor passed as argument
 * @param accessor the spec accessor
 */
export function getAccessorFn(accessor: Accessor): AccessorFn {
  return (datum: Datum) => {
    return typeof datum === 'object' && datum !== null ? datum[accessor as keyof typeof datum] : undefined;
  };
}

/**
 * Return the accessor label given as `AccessorFormat`
 */
export function getAccessorFormatLabel(accessor: AccessorFormat, label: string): string {
  if (typeof accessor === 'string') {
    return `${label}${accessor}`;
  }

  return accessor(label);
}

/**
 * Helper function to get accessor value from string, number or function
 *
 * @param  {Datum} datum
 * @param  {AccessorString|AccessorFn} accessor
 */
export function getAccessorValue(datum: Datum, accessor: Accessor | AccessorFn) {
  if (typeof accessor === 'function') {
    return accessor(datum);
  }

  return datum[accessor];
}
