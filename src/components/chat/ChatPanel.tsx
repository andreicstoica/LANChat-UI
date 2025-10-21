import { useEffect, useRef, type KeyboardEvent } from "react";
import { Text } from "@/components/retroui/Text";
import { Input } from "@/components/retroui/Input";
import { Button } from "@/components/retroui/Button";
import type { Message, GameState } from "@/types/chat";

// Helper function to determine message color based on sender
function getMessageColor(msg: Message, username: string): string {
  const isOwnMessage = msg.username === username;
  if (isOwnMessage) {
    return "bg-primary text-primary-foreground ml-auto rounded-t-lg rounded-br-none rounded-bl-lg";
  }

  // Check if it's a system message
  const isSystem =
    msg.type === "system" || msg.type === "join" || msg.type === "leave";
  if (isSystem) {
    return "bg-muted text-muted-foreground text-center rounded-lg mx-auto";
  }

  // Check metadata for NPC type
  const npcType = msg.metadata?.npcType;
  if (npcType) {
    switch (npcType) {
      case "gm":
        return "bg-blue-600 text-white mr-auto rounded-t-lg rounded-bl-none rounded-br-lg";
      case "friendly":
        return "bg-cyan-500 text-white mr-auto rounded-t-lg rounded-bl-none rounded-br-lg";
      case "suspicious":
        return "bg-purple-500 text-white mr-auto rounded-t-lg rounded-bl-none rounded-br-lg";
      case "hostile":
        return "bg-slate-600 text-white mr-auto rounded-t-lg rounded-bl-none rounded-br-lg";
    }
  }

  // Check username against known NPCs
  const npcColors: Record<string, string> = {
    "Honcho the GM":
      "bg-blue-600 text-white mr-auto rounded-t-lg rounded-bl-none rounded-br-lg",
    Elderwyn:
      "bg-cyan-500 text-white mr-auto rounded-t-lg rounded-bl-none rounded-br-lg",
    Thorne:
      "bg-purple-500 text-white mr-auto rounded-t-lg rounded-bl-none rounded-br-lg",
    Grimjaw:
      "bg-slate-600 text-white mr-auto rounded-t-lg rounded-bl-none rounded-br-lg",
  };

  if (npcColors[msg.username]) {
    return npcColors[msg.username];
  }

  // Default to human player colors (warm tones)
  const humanColors = [
    "bg-orange-500 text-white mr-auto rounded-t-lg rounded-bl-none rounded-br-lg",
    "bg-amber-500 text-white mr-auto rounded-t-lg rounded-bl-none rounded-br-lg",
    "bg-yellow-500 text-black mr-auto rounded-t-lg rounded-bl-none rounded-br-lg",
    "bg-red-500 text-white mr-auto rounded-t-lg rounded-bl-none rounded-br-lg",
  ];

  // Simple hash to consistently assign colors to usernames
  let hash = 0;
  for (let i = 0; i < msg.username.length; i++) {
    hash = ((hash << 5) - hash + msg.username.charCodeAt(i)) & 0xffffffff;
  }
  return humanColors[Math.abs(hash) % humanColors.length];
}

interface ChatPanelProps {
  messages: Message[];
  username: string;
  messageInput: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  isConnected: boolean;
  gameState?: GameState | null;
}

export function ChatPanel({
  messages,
  username,
  messageInput,
  onMessageChange,
  onSendMessage,
  isConnected,
  gameState,
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

  const currentLevelData =
    gameState?.levelDescriptions?.[gameState.currentLevel.toString()];

  return (
    <div className="flex-1 flex gap-4 min-h-0">
      {/* Game State Panel - 1/4 width */}
      <div className="w-1/4 shrink-0">
        <div className="h-full bg-background border-2 border-border rounded-lg p-4 space-y-4 overflow-y-auto">
          {gameState?.gameMode ? (
            /* Game Info */
            <div>
              <Text as="h3" className="mb-2">
                Level {gameState.currentLevel + 1} /{" "}
                {Object.keys(gameState.levelDescriptions).length}
                {gameState.isFinalLevel && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded ml-2">
                    Final Level
                  </span>
                )}
              </Text>
              <Text className="text-muted-foreground font-bold text-xl mb-2">
                {gameState.levelName}
              </Text>

              <div className="space-y-4">
                {/* Characters */}
                <div>
                  <Text as="h3" className="mb-2">
                    Characters
                  </Text>
                  <div className="space-y-2">
                    {gameState.npcs.map((npc) => (
                      <div
                        key={npc.name}
                        className="border-2 border-border rounded-lg p-3"
                      >
                        <Text as="h3" className="text-sm font-medium">
                          {npc.name}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {npc.role}
                        </Text>
                        <Text className="text-sm text-muted-foreground italic">
                          {npc.personality}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Objectives */}
                {currentLevelData?.objectives &&
                  currentLevelData.objectives.length > 0 && (
                    <div>
                      <Text as="h3" className="mb-2">
                        Objectives
                      </Text>
                      <ul className="space-y-1 ml-4">
                        {currentLevelData.objectives.map((objective, index) => {
                          // Check if objective is completed based on learned concepts or other criteria
                          const isCompleted = gameState.learnedConcepts.some(
                            (concept) =>
                              objective
                                .toLowerCase()
                                .includes(concept.toLowerCase()) ||
                              concept
                                .toLowerCase()
                                .includes(objective.toLowerCase())
                          );

                          return (
                            <li
                              key={index}
                              className={`text-sm flex items-start space-x-2 ${
                                isCompleted
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <span
                                className={`mt-0.5 ${
                                  isCompleted
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {isCompleted ? "✓" : "○"}
                              </span>
                              <span
                                className={isCompleted ? "line-through" : ""}
                              >
                                {objective}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          ) : (
            /* Disconnected State */
            <div className="flex items-center justify-center h-full">
              <Text className="text-muted-foreground text-center">
                {!isConnected
                  ? "Connecting to server..."
                  : "Waiting for game to start..."}
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Chat Panel - 3/4 width */}
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
                  const messageColorClass = getMessageColor(msg, username);

                  return (
                    <div
                      key={msg.id}
                      className={`p-3 max-w-[80%] ${messageColorClass}`}
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
    </div>
  );
}
