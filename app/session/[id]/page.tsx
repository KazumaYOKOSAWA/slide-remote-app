"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConnectionStatusBadge, DesktopClientStatusBadge } from "@/components/connection-status-badge";
import { QRCodePlaceholder } from "@/components/qr-code-placeholder";
import { SessionCodeDisplay } from "@/components/session-code-display";
import { OperationLog } from "@/components/operation-log";
import { dummySession, dummyLogs } from "@/lib/dummy-data";
import { COMMAND_LABELS_JA } from "@/lib/types";

export default function SessionPage() {
  const [connectionStatus, setConnectionStatus] = useState(dummySession.connectionStatus);
  const [desktopClientStatus, setDesktopClientStatus] = useState(dummySession.desktopClientStatus);
  const [logs, setLogs] = useState(dummyLogs);

  const handleTestCommand = (command: "NEXT_SLIDE" | "PREV_SLIDE" | "BLACKOUT") => {
    const now = new Date();
    const timestamp = `${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setLogs((prev) => [{ timestamp, command }, ...prev.slice(0, 9)]);
  };

  const connectionUrl = `https://slide-remote.example.com/remote/${dummySession.code}`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-lg font-bold text-foreground">Slide Remote Web</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              ダッシュボードに戻る
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Session Header */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  {dummySession.name}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  PC用セッション画面
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ConnectionStatusBadge status={connectionStatus} />
                <DesktopClientStatusBadge status={desktopClientStatus} />
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* QR Code & Connection Section */}
            <div className="space-y-6">
              {/* Session Code Card */}
              <Card className="border-border">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">セッションコード</CardTitle>
                  <CardDescription>
                    スマホでこのコードを入力して接続
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                  <SessionCodeDisplay code={dummySession.code} size="lg" />
                  
                  {/* QR Code */}
                  <div className="text-center">
                    <QRCodePlaceholder sessionCode={dummySession.code} size="lg" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      スマホのカメラでスキャン
                    </p>
                  </div>

                  {/* Connection URL */}
                  <div className="w-full rounded-lg bg-muted p-3">
                    <p className="mb-1 text-xs text-muted-foreground">接続URL</p>
                    <code className="break-all text-xs text-foreground">
                      {connectionUrl}
                    </code>
                  </div>
                </CardContent>
              </Card>

              {/* Status Demo Controls */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">ステータスデモ</CardTitle>
                  <CardDescription>
                    接続状態を切り替えて表示を確認
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">スマホ接続状態</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={connectionStatus === "connected" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setConnectionStatus("connected")}
                      >
                        Connected
                      </Button>
                      <Button
                        variant={connectionStatus === "waiting" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setConnectionStatus("waiting")}
                      >
                        Waiting
                      </Button>
                      <Button
                        variant={connectionStatus === "disconnected" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setConnectionStatus("disconnected")}
                      >
                        Disconnected
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">PC側アプリ状態</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={desktopClientStatus === "connected" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDesktopClientStatus("connected")}
                      >
                        Connected
                      </Button>
                      <Button
                        variant={desktopClientStatus === "not_connected" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDesktopClientStatus("not_connected")}
                      >
                        Not Connected
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Control & Logs Section */}
            <div className="space-y-6">
              {/* Test Commands */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">テスト操作</CardTitle>
                  <CardDescription>
                    PowerPointに送信されるコマンドをテスト
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      className="h-16"
                      onClick={() => handleTestCommand("PREV_SLIDE")}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        <span className="text-xs">戻るテスト</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-16"
                      onClick={() => handleTestCommand("NEXT_SLIDE")}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        <span className="text-xs">次へテスト</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-16"
                      onClick={() => handleTestCommand("BLACKOUT")}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        <span className="text-xs">黒画面テスト</span>
                      </div>
                    </Button>
                  </div>

                  {/* Warning */}
                  <div className="rounded-lg bg-warning/10 p-3">
                    <div className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-warning"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <p className="text-sm text-warning-foreground">
                        PowerPointをスライドショーモードにしてから操作してください
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operation Logs */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">操作ログ</CardTitle>
                  <CardDescription>
                    直近の操作履歴（最新10件）
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OperationLog logs={logs} commandLabels={COMMAND_LABELS_JA} />
                </CardContent>
              </Card>

              {/* Setup Reminder */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h3 className="font-medium text-foreground">
                        PC側受信アプリの準備
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Node.jsローカル受信アプリを起動すると、スマホからの操作がPowerPointに送信されます。
                      </p>
                      <Link href="/setup">
                        <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-primary">
                          セットアップガイドを見る
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
