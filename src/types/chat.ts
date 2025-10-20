export interface MessageMetadata {
  timestamp?: string;
  [key: string]: unknown;
}

export interface Message {
  id: string;
  type: string;
  username: string;
  content: string;
  metadata?: MessageMetadata;
}

export interface HistoryResponse {
  messages?: Message[];
}

export interface StatsResponse {
  connectedUsers?: number;
  connectedAgents?: number;
  totalMessages?: number;
  uptime?: number;
}

export interface DashboardStats {
  connectedUsers: number;
  connectedAgents: number;
  totalMessages: number;
  uptime: number;
}

