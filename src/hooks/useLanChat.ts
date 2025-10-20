import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "@/lib/api";
import type {
  DashboardStats,
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
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isRegistered || !username) {
      return;
    }

    const socket = io(API_BASE_URL, { path: "/socket.io" });
    socketRef.current = socket;

    const handleConnect = () => {
      setIsConnected(true);
      socket.emit("register", { username, type: "human" });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleMessage = (incoming: Message) => {
      setMessages((prev) => [...prev, incoming]);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleDisconnect);
    socket.on("message", handleMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleDisconnect);
      socket.off("message", handleMessage);
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
          setMessages(data.messages ?? []);
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
  }, [isRegistered]);

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

    fetchStats();
    const interval = setInterval(fetchStats, 15000);

    return () => {
      aborted = true;
      clearInterval(interval);
    };
  }, [isRegistered]);

  const sendMessage = (content: string) => {
    if (!socketRef.current) {
      return;
    }

    socketRef.current.emit("message", {
      content,
      type: "chat",
    });
  };

  return {
    messages,
    isConnected,
    dashboardStats,
    sendMessage,
  };
}

