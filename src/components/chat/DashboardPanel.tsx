import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import type { DashboardStats } from "@/types/chat";

interface DashboardPanelProps {
  stats: DashboardStats;
  isConnected: boolean;
}

export function DashboardPanel({ stats, isConnected }: DashboardPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className={!isConnected ? "opacity-50" : ""}>
        <Card.Header>
          <Card.Title>Connected Users</Card.Title>
        </Card.Header>
        <Card.Content>
          <Text
            className={`text-3xl font-bold ${
              isConnected ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {isConnected ? stats.connectedUsers : "--"}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {isConnected ? "Active participants" : "Not connected"}
          </Text>
        </Card.Content>
      </Card>

      <Card className={!isConnected ? "opacity-50" : ""}>
        <Card.Header>
          <Card.Title>Total Messages</Card.Title>
        </Card.Header>
        <Card.Content>
          <Text
            className={`text-3xl font-bold ${
              isConnected ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {isConnected ? stats.totalMessages.toLocaleString() : "--"}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {isConnected ? "All-time in this room" : "Not connected"}
          </Text>
        </Card.Content>
      </Card>

      <Card className={!isConnected ? "opacity-50" : ""}>
        <Card.Header>
          <Card.Title>AI Agents</Card.Title>
        </Card.Header>
        <Card.Content>
          <Text
            className={`text-3xl font-bold ${
              isConnected ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {isConnected ? stats.connectedAgents : "--"}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {isConnected ? "Available agents" : "Not connected"}
          </Text>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Server Status</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <Text className="text-sm">
              {isConnected ? "Connected" : "Not connected"}
            </Text>
          </div>
        </Card.Content>
      </Card>

      <Card className={!isConnected ? "opacity-50" : ""}>
        <Card.Header>
          <Card.Title>Uptime (seconds)</Card.Title>
        </Card.Header>
        <Card.Content>
          <Text
            className={`text-3xl font-bold ${
              isConnected ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {isConnected ? stats.uptime.toFixed(0) : "--"}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {isConnected ? "Server uptime" : "Not connected"}
          </Text>
        </Card.Content>
      </Card>
    </div>
  );
}

