export default function fetchChatStream(
  url: string,
  onDataChunk: (chunk: string) => void
): EventSource {

  const eventSource = new EventSource(url);

  // Listen for default message events (for the streamed chunks)
  eventSource.onmessage = (event: MessageEvent) => {
    const parsedData = JSON.parse(event.data)
      onDataChunk(parsedData);
  };

    eventSource.addEventListener('functionCallResult', (event: MessageEvent) => {
      try {
        console.log('functionCallResult', event.data)
        const parsedData = JSON.parse(event.data);
        // onCustomEvent(parsedData);
      } catch (error) {
        console.error('Error parsing custom event data:', error);
      }
    });


  eventSource.addEventListener('end', () => {
    eventSource.close();
  })

  eventSource.onerror = (err: Event) => {
    console.error('EventSource error:', err);
    eventSource.close();
  };

  return eventSource;
}