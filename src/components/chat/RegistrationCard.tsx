import { FormEvent } from "react";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { Input } from "@/components/retroui/Input";
import { Button } from "@/components/retroui/Button";

interface RegistrationCardProps {
  pendingUsername: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUsernameChange: (value: string) => void;
}

export function RegistrationCard({
  pendingUsername,
  onSubmit,
  onUsernameChange,
}: RegistrationCardProps) {
  return (
    <div className="h-screen bg-background p-8 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <Card.Header>
          <Card.Title>Welcome to LANChat</Card.Title>
          <Text className="text-muted-foreground">
            Choose a display name and join the room.
          </Text>
        </Card.Header>
        <Card.Content>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Text as="label" className="block text-sm font-medium">
                Display name
              </Text>
              <Input
                value={pendingUsername}
                onChange={(event) => onUsernameChange(event.target.value)}
                placeholder="Type your name"
              />
            </div>
            <Button type="submit" disabled={!pendingUsername.trim()}>
              Join Chat
            </Button>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}

