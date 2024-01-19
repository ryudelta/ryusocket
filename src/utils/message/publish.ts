export function messageToStream(stream: string, message: any): any {
  const newObject: { [key: string]: any } = {
    [stream]: { ...message },
  };

  return newObject;
}
