export function headerValidate(source: any, checked: string): boolean {
  let result = false;
  if (source[checked] !== undefined) {
    result = true;
  } else {
    result = false;
  }

  return result;
}
