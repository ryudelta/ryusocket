// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function QueryStream(data: string): string[] {
  console.log(data);

  const regexp = /streams=([^&]+)/g;

  const dataWithRegex = data.match(regexp);
  const mustBeStreamArray = dataWithRegex.map((item) => {
    return item.split('=')[1];
  });

  return mustBeStreamArray;
}
