// Connection status types
export type ConnectionStatus = "connected" | "waiting" | "disconnected";

// Desktop client status types
export type DesktopClientStatus = "connected" | "not_connected";

// Remote command types
// export type RemoteCommand =
//   | "NEXT_SLIDE"
//   | "PREV_SLIDE"
//   | "START_PRESENTATION"
//   | "END_PRESENTATION"
//   | "BLACKOUT"
//   | "WHITEOUT";

export type RemoteCommand =
  | "NEXT_SLIDE"
  | "PREV_SLIDE"
  | "START_PRESENTATION"
  | "END_PRESENTATION"
  | "BLACKOUT"
  | "WHITEOUT"
  | "POINTER_MODE"
  | "POINTER_CLICK"
  | "START_FROM_CURRENT_SLIDE";

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

// Session type
export interface Session {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  userId: string;
  connectionStatus: ConnectionStatus;
  desktopClientStatus: DesktopClientStatus;
}

// Log entry type
export interface LogEntry {
  timestamp: string;
  command: RemoteCommand;
}

// Operation log item type
export type OperationLogItem = {
  timestamp: string;
  command: RemoteCommand;
};

// Command display mapping
export const COMMAND_LABELS: Record<RemoteCommand, string> = {
  NEXT_SLIDE: "Next Slide",
  PREV_SLIDE: "Previous Slide",
  START_PRESENTATION: "Start Presentation",
  START_FROM_CURRENT_SLIDE: "Start from Current Slide",
  END_PRESENTATION: "End Presentation",
  BLACKOUT: "Black Screen",
  WHITEOUT: "White Screen",
  POINTER_MODE: "Pointer Mode",
  POINTER_CLICK: "Pointer Click"
};

// Command display mapping Japanese
export const COMMAND_LABELS_JA: Record<RemoteCommand, string> = {
  NEXT_SLIDE: "次へ",
  PREV_SLIDE: "戻る",
  START_PRESENTATION: "発表開始",
  START_FROM_CURRENT_SLIDE: "現在のスライドから開始",
  END_PRESENTATION: "発表終了",
  BLACKOUT: "黒画面",
  WHITEOUT: "白画面",
  POINTER_MODE: "ポインター モード",
  POINTER_CLICK: "ポインタークリック"
};