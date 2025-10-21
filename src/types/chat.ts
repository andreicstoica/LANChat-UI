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

export interface NPC {
  name: string;
  role: string;
  personality: string;
}

export interface LevelDescription {
  name: string;
  description: string;
  objectives: string[];
}

export interface GameState {
  // Level tracking
  currentLevel: number;
  levelName: string;
  isFinalLevel: boolean;

  // Player progress
  learnedConcepts: string[];
  npcTrustLevels: Record<string, number>; // -100 to 100

  // Level descriptions
  levelDescriptions: Record<string, LevelDescription>;

  // NPC info
  npcs: NPC[];

  gameMode: boolean;
}
