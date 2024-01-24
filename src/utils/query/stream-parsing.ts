// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function QueryStream(data: string): any {
  const regexp = /streams=([^&]+)/g;
  
  const dataWithRegex = data.match(regexp);
  
  if (dataWithRegex !== null){
    const mustBeStreamArray = dataWithRegex.map((item) => {
      return item.split('=')[1];
    });
    return mustBeStreamArray;
  } else {
    return false;
  }

}
