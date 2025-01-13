
interface MessageProps {
    message: string
    type: "user" | "system"
}

const parseMessage = (message: string) => {
    const segments = [];
    const regex = /(\*\*.*?\*\*|```[\s\S]*?```|\n)/g; // Updated regex to include newline characters
    let lastIndex = 0;
  
    message.replace(regex, (match, _, offset) => {
      // Add normal text before the match
      if (offset > lastIndex) {
        segments.push({ type: "text", content: message.slice(lastIndex, offset) });
      }
  
      // Handle special cases
      if (match.startsWith("**")) {
        segments.push({ type: "bold", content: match.slice(2, -2) });
      } else if (match.startsWith("```")) {
        segments.push({ type: "quote", content: match.slice(3, -3).trim() }); // Trim extra spaces
      } else if (match === "\n") {
        segments.push({ type: "newline" }); // Add a newline segment
      }
  
      lastIndex = offset + match.length;
      return match;
    });
  
    // Add remaining normal text
    if (lastIndex < message.length) {
      segments.push({ type: "text", content: message.slice(lastIndex) });
    }
  
    return segments;
  };

const UserMessage = ({ message }: { message: string }) => {
    return (
        <div className="flex w-full justify-end">
            <div className="rounded bg-gray-100 p-3">{message}</div>
        </div>

    );
}

const SystemMessage = ({ message }: { message: string }) => {
    const segments = parseMessage(message)
    return (

        <div className="w-full py-5">
            {segments.map((segment, index) => {
                switch (segment.type) {
                    case "bold":
                        return (
                            <span key={index} className="inline-block font-bold">
                                {segment.content}
                            </span>
                        );
                    case "quote":
                        return (
                            <span key={index} className="inline-block bg-gray-200 p-1 rounded">
                                {segment.content}
                            </span>
                        );
                    case "newline":
                        return <br key={index} />;
                    default:
                        return segment.content;
                }
            })}
        </div>
    );
}

const Message = ({ message, type }: MessageProps) => {
    return type === "user" ? <UserMessage message={message} /> : <SystemMessage message={message} />;
}

export default Message;