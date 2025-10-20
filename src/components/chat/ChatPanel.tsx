import { useEffect, useRef, type KeyboardEvent } from "react";
import { Text } from "@/components/retroui/Text";
import { Input } from "@/components/retroui/Input";
import { Button } from "@/components/retroui/Button";
import type { Message } from "@/types/chat";

interface ChatPanelProps {
  messages: Message[];
  username: string;
  messageInput: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  isConnected: boolean;
}

export function ChatPanel({
  messages,
  username,
  messageInput,
  onMessageChange,
  onSendMessage,
  isConnected,
}: ChatPanelProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSendMessage();
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) {
      return "";
    }

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 border-2 border-border rounded-lg">
      <div className="flex-1 flex flex-col space-y-4 min-h-0">
        {!isConnected && (
          <div className="p-3 bg-red-50 border-b border-red-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <Text className="text-sm text-red-700">
                Not connected to server
              </Text>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 min-h-0">
          <div className="space-y-2 min-h-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Text className="text-muted-foreground">
                  {isConnected
                    ? "Start a conversation"
                    : "Connecting to server..."}
                </Text>
              </div>
            ) : (
              messages.map((msg) => {
                const isSystem =
                  msg.type === "system" ||
                  msg.type === "join" ||
                  msg.type === "leave";
                const isOwnMessage = msg.username === username;

                return (
                  <div
                    key={msg.id}
                    className={`p-3 max-w-[80%] ${
                      isSystem
                        ? "bg-muted text-muted-foreground text-center rounded-lg mx-auto"
                        : isOwnMessage
                        ? "bg-primary text-primary-foreground ml-auto rounded-t-lg rounded-br-none rounded-bl-lg"
                        : "bg-secondary text-secondary-foreground mr-auto rounded-t-lg rounded-bl-none rounded-br-lg"
                    }`}
                  >
                    <Text className="text-sm whitespace-pre-wrap wrap-break-word">
                      {!isSystem && (
                        <span className="font-medium">{msg.username}: </span>
                      )}
                      {msg.content}
                    </Text>
                    <Text className="text-xs opacity-70 mt-1">
                      {formatTimestamp(msg.metadata?.timestamp)}
                    </Text>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
        <div className="flex items-center space-x-2 mx-4 mb-4 p-2 shrink-0 border-2 border-border rounded-lg">
          <Input
            type="text"
            value={messageInput}
            onChange={(event) => onMessageChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 border-0 shadow-none"
            disabled={!isConnected}
          />
          <Button
            onClick={onSendMessage}
            disabled={!messageInput.trim() || !isConnected}
            className="shrink-0"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
