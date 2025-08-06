export interface Message {
  id: number;
  match_id: number;
  sender_id: number;
  text: string;
  timestamp: string; // viene como string ISO desde el backend
  sender: {
    id: number;
    name: string;
  };
}
