export type Role = "assistant" | "user";

export type Message = {
  id: string;
  role: Role;
  text: string;
  createdAt: number;
  pending?: boolean;  // typing bubble
  error?: boolean;    // future use
};
