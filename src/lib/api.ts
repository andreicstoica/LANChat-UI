export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function fetchGameState(): Promise<import("@/types/chat").GameState | null> {
  try {
    console.log('Fetching game state from:', `${API_BASE_URL}/api/game/state`);
    const response = await fetch(`${API_BASE_URL}/api/game/state`);
    console.log('Game state response status:', response.status);
    if (!response.ok) {
      console.log('Game state response not ok:', response.status, response.statusText);
      return null;
    }
    const data = await response.json();
    console.log('Game state response data:', data);
    return data;
  } catch (error) {
    console.log('Game state fetch error:', error);
    return null;
  }
}

