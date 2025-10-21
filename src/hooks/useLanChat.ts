import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { API_BASE_URL, fetchGameState, restartGame } from "@/lib/api";
import type {
  DashboardStats,
  GameState,
  HistoryResponse,
  Message,
  StatsResponse,
} from "@/types/chat";

const INITIAL_STATS: DashboardStats = {
  connectedUsers: 0,
  connectedAgents: 0,
  totalMessages: 0,
  uptime: 0,
};

export function useLanChat(username: string, isRegistered: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [dashboardStats, setDashboardStats] =
    useState<DashboardStats>(INITIAL_STATS);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartError, setRestartError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isRegistered || !username) {
      return;
    }

    const socket = io(API_BASE_URL, { path: "/socket.io" });
    socketRef.current = socket;

    const addLocalJoinMessage = () => {
      const timestamp = new Date().toISOString();

      setMessages((prev) => [
        ...prev,
        {
          id: `local-join-${timestamp}`,
          type: "join",
          username: "system",
          content: `${username} (human) joined the chat`,
          metadata: {
            timestamp,
            joinedUser: username,
            userType: "human",
            localGenerated: true,
          },
        },
      ]);
    };

    const handleConnect = () => {
      setIsConnected(true);
      socket.emit("register", { username, type: "human" });
      addLocalJoinMessage();
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleMessage = (incoming: Message) => {
      setMessages((prev) => {
        let nextMessages = prev;

        if (
          incoming.type === "join" &&
          incoming.metadata?.joinedUser === username
        ) {
          nextMessages = prev.filter(
            (message) =>
              !(
                message.type === "join" &&
                message.metadata?.localGenerated &&
                message.metadata.joinedUser === username
              ),
          );
        }

        return [...nextMessages, incoming];
      });
    };

    const handleGameState = (state: GameState) => {
      console.log('Received game state via socket:', state);
      setGameState(state);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleDisconnect);
    socket.on("message", handleMessage);
    socket.on("game:state", handleGameState);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleDisconnect);
      socket.off("message", handleMessage);
      socket.off("game:state", handleGameState);
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [isRegistered, username]);

  useEffect(() => {
    if (!isRegistered) {
      return;
    }

    let aborted = false;

    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/history?limit=50`);
        if (!aborted && response.ok) {
          const data: HistoryResponse = await response.json();
          if (!data.messages) {
            return;
          }

          setMessages((prevMessages) => {
            const hasSelfJoin = data.messages?.some(
              (message) =>
                message.type === "join" &&
                message.metadata?.joinedUser === username,
            );

            const baseMessages = hasSelfJoin
              ? prevMessages.filter(
                (message) =>
                  !(
                    message.type === "join" &&
                    message.metadata?.localGenerated &&
                    message.metadata.joinedUser === username
                  ),
              )
              : prevMessages;

            const prevIds = new Set(baseMessages.map((message) => message.id));
            const merged = [...baseMessages];

            for (const message of data.messages ?? []) {
              if (!prevIds.has(message.id)) {
                merged.push(message);
              }
            }

            return merged.sort((a, b) => {
              const aTime = a.metadata?.timestamp
                ? Date.parse(a.metadata.timestamp)
                : 0;
              const bTime = b.metadata?.timestamp
                ? Date.parse(b.metadata.timestamp)
                : 0;

              if (Number.isNaN(aTime) && Number.isNaN(bTime)) {
                return a.id.localeCompare(b.id);
              }

              if (Number.isNaN(aTime)) {
                return -1;
              }

              if (Number.isNaN(bTime)) {
                return 1;
              }

              if (aTime === bTime) {
                return a.id.localeCompare(b.id);
              }

              return aTime - bTime;
            });
          });
        }
      } catch {
        if (!aborted) {
          setIsConnected(false);
        }
      }
    };

    fetchHistory();

    return () => {
      aborted = true;
    };
  }, [isRegistered, username]);

  useEffect(() => {
    if (!isRegistered) {
      return;
    }

    let aborted = false;

    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stats`);
        if (!aborted && response.ok) {
          const stats: StatsResponse = await response.json();
          setDashboardStats({
            connectedUsers: stats.connectedUsers ?? 0,
            connectedAgents: stats.connectedAgents ?? 0,
            totalMessages: stats.totalMessages ?? 0,
            uptime: stats.uptime ?? 0,
          });
        }
      } catch {
        if (!aborted) {
          setIsConnected(false);
        }
      }
    };

    const fetchGameStateData = async () => {
      try {
        const state = await fetchGameState();
        console.log('Fetched game state:', state);
        if (!aborted && state) {
          setGameState(state);
        }
      } catch (error) {
        console.log('Game state fetch error:', error);
        // Game state fetch failure is not critical
      }
    };

    fetchStats();
    fetchGameStateData();
    const statsInterval = setInterval(fetchStats, 15000);
    const gameStateInterval = setInterval(fetchGameStateData, 12000);

    return () => {
      aborted = true;
      clearInterval(statsInterval);
      clearInterval(gameStateInterval);
    };
  }, [isRegistered]);

  const sendMessage = (content: string) => {
    if (!socketRef.current) {
      return;
    }

    socketRef.current.emit("chat", {
      content,
    });
  };

  const handleRestart = async () => {
    if (isRestarting) return;
    
    setIsRestarting(true);
    setRestartError(null);
    
    try {
      const result = await restartGame();
      if (result) {
        console.log('Game restarted successfully, new session ID:', result.sessionId);
        
        // Disconnect current socket
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        
        // Clear messages and reset state
        setMessages([]);
        setGameState(null);
        setDashboardStats(INITIAL_STATS);
        
        // Reconnect after a brief delay
        setTimeout(() => {
          if (socketRef.current) {
            socketRef.current.connect();
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Restart failed:', error);
      if (error instanceof Error && error.message === 'restart_already_in_progress') {
        setRestartError('Restart already in progress');
        // Disable button briefly before retrying
        setTimeout(() => {
          setRestartError(null);
        }, 3000);
      } else {
        setRestartError('Failed to restart game');
      }
    } finally {
      setIsRestarting(false);
    }
  };

  return {
    messages,
    isConnected,
    dashboardStats,
    gameState,
    sendMessage,
    handleRestart,
    isRestarting,
    restartError,
  };
}
