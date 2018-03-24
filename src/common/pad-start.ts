export function padStart(value: number | string, width: number, padCharacter: string = '0') {
  padCharacter = padCharacter || '0';
  value = value + '';
  return value.length >= width ? value : new Array(width - value.length + 1).join(padCharacter) + value;
}
