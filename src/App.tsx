import {
  Tabs,
  TabsTrigger,
  TabsContent,
  TabsTriggerList,
  TabsPanels,
} from "@/components/retroui/Tab";
import { Text } from "@/components/retroui/Text";

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <Text as="h1" className="mb-8">
        LANChat UI
      </Text>
      <Tabs>
        <TabsTriggerList>
          <TabsTrigger>Home</TabsTrigger>
          <TabsTrigger>About</TabsTrigger>
          <TabsTrigger>Contact</TabsTrigger>
        </TabsTriggerList>
        <TabsPanels>
          <TabsContent>
            <Text>
              Welcome to RetroUI, a retro styled UI library built with React,
              Tailwind CSS & Headless UI.
            </Text>
          </TabsContent>
          <TabsContent>
            <Text>This is the about section!</Text>
          </TabsContent>
          <TabsContent>
            <Text>And, this is the contact section!</Text>
          </TabsContent>
        </TabsPanels>
      </Tabs>
    </div>
  );
}

export default App;
