import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import type { GameState, Quest } from "@/types/chat";

interface GameSidebarProps {
  gameState: GameState | null;
}

export function GameSidebar({ gameState }: GameSidebarProps) {
  if (!gameState?.gameMode) {
    return null;
  }

  // Clean sidebar with no NPCs section and no duplicate scene info

  return (
    <div className="w-80 bg-background border-2 border-border rounded-lg p-4 space-y-4 overflow-y-auto">
      {/* Current Scene */}
      <Card>
        <Card.Header>
          <Card.Title>Current Scene</Card.Title>
        </Card.Header>
        <Card.Content>
          <Text className="text-sm">
            {gameState.currentScene?.name || "Unknown"}
          </Text>
        </Card.Content>
      </Card>

      {/* Debug Info */}
      <Card>
        <Card.Header>
          <Card.Title>Debug Info</Card.Title>
        </Card.Header>
        <Card.Content>
          <Text className="text-sm">
            Game Mode: {gameState.gameMode ? "true" : "false"}
          </Text>
          <Text className="text-sm">
            Agents Count: {Object.keys(gameState.npcStates).length}
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
            {gameState.activeQuests.map((quest: Quest) => (
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
    </div>
  );
}
