import { useEffect, useRef, type KeyboardEvent } from "react";
import { Text } from "@/components/retroui/Text";
import { Input } from "@/components/retroui/Input";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
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

// Helper functions for game state display
function getNPCTypeColor(npcName: string) {
  const npcTypes: Record<string, string> = {
    "Honcho the GM": "bg-blue-600",
    Elderwyn: "bg-cyan-500",
    Thorne: "bg-purple-500",
    Grimjaw: "bg-slate-600",
  };
  return npcTypes[npcName] || "bg-gray-500";
}

function formatTrustLevel(trust: number) {
  if (trust >= 50) return "Trusted";
  if (trust >= 0) return "Neutral";
  if (trust >= -50) return "Suspicious";
  return "Hostile";
}

function getTrustColor(trust: number) {
  if (trust >= 50) return "text-green-600";
  if (trust >= 0) return "text-yellow-600";
  if (trust >= -50) return "text-orange-600";
  return "text-red-600";
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

  return (
    <div className="flex-1 flex gap-4 min-h-0">
      {/* Game State Panel - 1/4 width */}
      {gameState?.gameMode && (
        <div className="w-1/4 shrink-0">
          <div className="h-full bg-background border-2 border-border rounded-lg p-4 space-y-4 overflow-y-auto">
            {/* Current Scene */}
            <Card>
              <Card.Header>
                <Card.Title>Current Scene</Card.Title>
              </Card.Header>
              <Card.Content>
                <Text className="text-sm">
                  {gameState.currentScene || "Unknown"}
                </Text>
              </Card.Content>
            </Card>

            {/* Active Quests */}
            {gameState.activeQuests.length > 0 && (
              <Card>
                <Card.Header>
                  <Card.Title>Active Quests</Card.Title>
                </Card.Header>
                <Card.Content className="space-y-2">
                  {gameState.activeQuests.map((quest) => (
                    <div
                      key={quest.id}
                      className="border-2 border-border rounded p-2"
                    >
                      <Text className="font-medium text-sm">{quest.title}</Text>
                      <Text className="text-xs text-muted-foreground">
                        {quest.description}
                      </Text>
                    </div>
                  ))}
                </Card.Content>
              </Card>
            )}

            {/* NPCs */}
            <Card>
              <Card.Header>
                <Card.Title>NPCs</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-3">
                {gameState.npcStates.map((npc) => (
                  <div
                    key={npc.name}
                    className="border-2 border-border rounded p-3"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getNPCTypeColor(
                          npc.name
                        )}`}
                      />
                      <Text className="font-medium text-sm">{npc.name}</Text>
                    </div>

                    <div className="space-y-1">
                      <Text className="text-xs">
                        <span className="text-muted-foreground">Mood:</span>{" "}
                        {npc.mood}
                      </Text>
                      <Text className="text-xs">
                        <span className="text-muted-foreground">Location:</span>{" "}
                        {npc.location}
                      </Text>
                      <Text
                        className={`text-xs font-medium ${getTrustColor(
                          npc.trustLevel
                        )}`}
                      >
                        <span className="text-muted-foreground">Trust:</span>{" "}
                        {formatTrustLevel(npc.trustLevel)} ({npc.trustLevel})
                      </Text>
                      <Text className="text-xs">
                        <span className="text-muted-foreground">
                          Last seen:
                        </span>{" "}
                        {new Date(npc.lastInteraction).toLocaleTimeString()}
                      </Text>
                    </div>
                  </div>
                ))}
              </Card.Content>
            </Card>
          </div>
        </div>
      )}

      {/* Chat Panel - 3/4 width */}
      <div
        className={`flex-1 flex flex-col min-h-0 border-2 border-border rounded-lg ${
          !gameState?.gameMode ? "w-full" : ""
        }`}
      >
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
