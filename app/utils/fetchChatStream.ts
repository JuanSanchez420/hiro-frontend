export async function fetchChatStream(
  url: string,
  onDataChunk: (chunk: string) => void
): Promise<void> {
  const response = await fetch(url);

  if (!response.body) {
    throw new Error("ReadableStream not supported in this environment");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      onDataChunk(decoder.decode(value));
    }
  }
}