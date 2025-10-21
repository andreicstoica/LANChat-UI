export interface MessageMetadata {
  timestamp?: string;
  joinedUser?: string;
  userType?: string;
  localGenerated?: boolean;
  gameEvent?: 'scene_intro' | 'gm_narration' | 'npc_interaction';
  npcType?: 'gm' | 'friendly' | 'suspicious' | 'hostile';
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

export interface NPCState {
  name: string;
  mood: string;
  location: string;
  trustLevel: number; // -100 to 100
  lastInteraction: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed';
}

export interface GameState {
  currentScene: string;
  activeQuests: Quest[];
  npcStates: NPCState[];
  gameMode: boolean;
}
