import { useState, type FormEvent } from "react";
import {
  Tabs,
  TabsTrigger,
  TabsContent,
  TabsTriggerList,
  TabsPanels,
} from "@/components/retroui/Tab";
import { Text } from "@/components/retroui/Text";
import { RegistrationCard } from "@/components/chat/RegistrationCard";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { DashboardPanel } from "@/components/chat/DashboardPanel";
import { GameSidebar } from "@/components/chat/GameSidebar";
import { useLanChat } from "@/hooks/useLanChat";

function App() {
  const [pendingUsername, setPendingUsername] = useState("");
  const [username, setUsername] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  const { messages, isConnected, dashboardStats, gameState, sendMessage } =
    useLanChat(username, isRegistered);

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pendingUsername.trim()) {
      return;
    }

    setUsername(pendingUsername.trim());
    setIsRegistered(true);
  };

  const handleSendMessage = () => {
    const trimmed = messageInput.trim();
    if (!trimmed) {
      return;
    }

    sendMessage(trimmed);
    setMessageInput("");
  };

  if (!isRegistered) {
    return (
      <RegistrationCard
        pendingUsername={pendingUsername}
        onSubmit={handleRegister}
        onUsernameChange={setPendingUsername}
      />
    );
  }

  return (
    <div className="h-screen bg-background p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <Text as="h1" className="mb-8 text-center shrink-0">
          {gameState?.gameMode ? "D&D Adventure" : "LANChat UI"}
        </Text>
        <div className="flex-1 flex gap-6 min-h-0">
          {/* Left Sidebar - Game State */}
          {gameState?.gameMode && (
            <div className="shrink-0">
              <GameSidebar gameState={gameState} />
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <Tabs className="h-full flex flex-col min-h-0">
              <div className="flex justify-center mb-6 shrink-0">
                <TabsTriggerList>
                  <TabsTrigger>Chat</TabsTrigger>
                  <TabsTrigger>Dashboard</TabsTrigger>
                </TabsTriggerList>
              </div>
              <TabsPanels className="flex-1 flex flex-col min-h-0">
                <TabsContent className="flex-1 flex flex-col min-h-0">
                  <ChatPanel
                    messages={messages}
                    username={username}
                    messageInput={messageInput}
                    onMessageChange={setMessageInput}
                    onSendMessage={handleSendMessage}
                    isConnected={isConnected}
                  />
                </TabsContent>
                <TabsContent>
                  <DashboardPanel
                    stats={dashboardStats}
                    isConnected={isConnected}
                  />
                </TabsContent>
              </TabsPanels>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
