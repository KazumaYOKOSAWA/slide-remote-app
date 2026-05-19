import type { User, Session, LogEntry } from "./types";

// Dummy user data
export const dummyUser: User = {
  id: "user_001",
  name: "Kazuma Yokosawa",
  email: "kazuma@example.com",
  avatarUrl: undefined,
};

// Dummy session data
export const dummySession: Session = {
  id: "session_001",
  name: "卒論発表練習",
  code: "428193",
  createdAt: new Date("2024-01-15T10:00:00"),
  userId: "user_001",
  connectionStatus: "connected",
  desktopClientStatus: "connected",
};

// Dummy recent sessions
export const dummyRecentSessions: Session[] = [
  {
    id: "session_001",
    name: "卒論発表練習",
    code: "428193",
    createdAt: new Date("2024-01-15T10:00:00"),
    userId: "user_001",
    connectionStatus: "connected",
    desktopClientStatus: "connected",
  },
  {
    id: "session_002",
    name: "プロジェクト報告会",
    code: "592847",
    createdAt: new Date("2024-01-14T14:30:00"),
    userId: "user_001",
    connectionStatus: "disconnected",
    desktopClientStatus: "not_connected",
  },
  {
    id: "session_003",
    name: "チームミーティング",
    code: "183726",
    createdAt: new Date("2024-01-13T09:00:00"),
    userId: "user_001",
    connectionStatus: "disconnected",
    desktopClientStatus: "not_connected",
  },
];

// Dummy operation logs
export const dummyLogs: LogEntry[] = [
  { timestamp: "05:23", command: "NEXT_SLIDE" },
  { timestamp: "05:20", command: "PREV_SLIDE" },
  { timestamp: "05:10", command: "BLACKOUT" },
  { timestamp: "05:00", command: "START_PRESENTATION" },
];

// Dummy timer value
export const dummyTimer = "05:23";
