export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function fetchGameState(): Promise<import("@/types/chat").GameState | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/game/state`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
}

