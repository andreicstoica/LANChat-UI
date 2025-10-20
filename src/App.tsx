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

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
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
            <TabsContent className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 flex flex-col space-y-4 min-h-0">
                <div className="flex-1 overflow-y-auto border-2 border-border rounded p-4 min-h-0">
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
                <div className="flex items-center space-x-2 border-2 border-border rounded p-2 shrink-0">
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
                <Card>
                  <Card.Header>
                    <Card.Title>Active Users</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Text className="text-3xl font-bold text-primary">24</Text>
                    <Text className="text-sm text-muted-foreground">
                      +3 from last hour
                    </Text>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title>Messages Sent</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Text className="text-3xl font-bold text-primary">
                      1,247
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      +127 today
                    </Text>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title>AI Agents</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Text className="text-3xl font-bold text-primary">8</Text>
                    <Text className="text-sm text-muted-foreground">
                      All online
                    </Text>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title>Server Status</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <Text className="text-sm">All systems operational</Text>
                    </div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title>Response Time</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Text className="text-3xl font-bold text-primary">
                      45ms
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Average
                    </Text>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title>Uptime</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Text className="text-3xl font-bold text-primary">
                      99.9%
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Last 30 days
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
