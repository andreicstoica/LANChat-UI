import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import type { GameState } from "@/types/chat";

interface GameSidebarProps {
  gameState: GameState | null;
}

export function GameSidebar({ gameState }: GameSidebarProps) {
  if (!gameState?.gameMode) {
    return null;
  }

  const getNPCTypeColor = (npcName: string) => {
    // Map known NPCs to their types based on backend info
    const npcTypes: Record<string, string> = {
      "Honcho the GM": "bg-blue-600",
      Elderwyn: "bg-cyan-500",
      Thorne: "bg-purple-500",
      Grimjaw: "bg-slate-600",
    };

    return npcTypes[npcName] || "bg-gray-500";
  };

  const formatTrustLevel = (trust: number) => {
    if (trust >= 50) return "Trusted";
    if (trust >= 0) return "Neutral";
    if (trust >= -50) return "Suspicious";
    return "Hostile";
  };

  const getTrustColor = (trust: number) => {
    if (trust >= 50) return "text-green-600";
    if (trust >= 0) return "text-yellow-600";
    if (trust >= -50) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="w-80 bg-background border-2 border-border rounded-lg p-4 space-y-4 overflow-y-auto">
      {/* Current Scene */}
      <Card>
        <Card.Header>
          <Card.Title>Current Scene</Card.Title>
        </Card.Header>
        <Card.Content>
          <Text className="text-sm">{gameState.currentScene || "Unknown"}</Text>
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
            <div key={npc.name} className="border-2 border-border rounded p-3">
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
                  <span className="text-muted-foreground">Last seen:</span>{" "}
                  {new Date(npc.lastInteraction).toLocaleTimeString()}
                </Text>
              </div>
            </div>
          ))}
        </Card.Content>
      </Card>
    </div>
  );
}
