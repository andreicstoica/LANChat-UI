import {
  Tabs,
  TabsTrigger,
  TabsContent,
  TabsTriggerList,
  TabsPanels,
} from "@/components/retroui/Tab";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Card } from "@/components/retroui/Card";
import { useState, useEffect, useRef } from "react";

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
}

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [dashboardData] = useState({
    activeUsers: 0,
    messagesSent: 0,
    aiAgents: 0,
    responseTime: 0,
    uptime: 0,
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setMessage("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: `AI Agent: I received your message: "${message}". This is a simulated response.`,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Server connection check
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // TODO: Replace with actual server endpoint
        // const response = await fetch('/api/health');
        // setIsConnected(response.ok);

        // TODO: Fetch dashboard data when connected
        // if (response.ok) {
        //   const data = await response.json();
        //   setDashboardData(data);
        // }

        // For now, simulate no connection
        setIsConnected(false);
      } catch {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-background p-8 overflow-hidden">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <Text as="h1" className="mb-8 text-center shrink-0">
          LANChat UI
        </Text>
        <Tabs className="flex-1 flex flex-col min-h-0">
          <div className="flex justify-center mb-6 shrink-0">
            <TabsTriggerList>
              <TabsTrigger>Chat</TabsTrigger>
              <TabsTrigger>Dashboard</TabsTrigger>
            </TabsTriggerList>
          </div>
          <TabsPanels className="flex-1 flex flex-col min-h-0">
            <TabsContent className="flex-1 flex flex-col min-h-0 border-2 border-border rounded-lg">
              <div className="flex-1 flex flex-col space-y-4 min-h-0">
                <div className="flex-1 overflow-y-auto p-4 min-h-0">
                  <div className="space-y-3">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <Text className="text-muted-foreground">
                          Start a conversation
                        </Text>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded ${
                            msg.sender === "user"
                              ? "bg-primary text-primary-foreground ml-8"
                              : msg.sender === "ai"
                              ? "bg-secondary text-secondary-foreground mr-8"
                              : "bg-muted text-muted-foreground text-center"
                          }`}
                        >
                          <Text className="text-sm">{msg.text}</Text>
                          <Text className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString()}
                          </Text>
                        </div>
                      ))
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2 shrink-0 border-2 border-border rounded-lg">
                  <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 border-0 shadow-none"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="shrink-0"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className={!isConnected ? "opacity-50" : ""}>
                  <Card.Header>
                    <Card.Title>Active Users</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Text
                      className={`text-3xl font-bold ${
                        isConnected ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {isConnected ? dashboardData.activeUsers : "--"}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {isConnected ? "Connected users" : "Not connected"}
                    </Text>
                  </Card.Content>
                </Card>

                <Card className={!isConnected ? "opacity-50" : ""}>
                  <Card.Header>
                    <Card.Title>Messages Sent</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Text
                      className={`text-3xl font-bold ${
                        isConnected ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {isConnected
                        ? dashboardData.messagesSent.toLocaleString()
                        : "--"}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {isConnected ? "Total messages" : "Not connected"}
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
                      {isConnected ? dashboardData.aiAgents : "--"}
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
                    <Card.Title>Response Time</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Text
                      className={`text-3xl font-bold ${
                        isConnected ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {isConnected ? `${dashboardData.responseTime}ms` : "--"}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {isConnected ? "Average" : "Not connected"}
                    </Text>
                  </Card.Content>
                </Card>

                <Card className={!isConnected ? "opacity-50" : ""}>
                  <Card.Header>
                    <Card.Title>Uptime</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Text
                      className={`text-3xl font-bold ${
                        isConnected ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {isConnected ? `${dashboardData.uptime}%` : "--"}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {isConnected ? "Last 30 days" : "Not connected"}
                    </Text>
                  </Card.Content>
                </Card>
              </div>
            </TabsContent>
          </TabsPanels>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
