"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ConnectionStatusBadge,
  DesktopClientStatusBadge,
} from "@/components/connection-status-badge";
import { SessionCodeDisplay } from "@/components/session-code-display";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { createClient } from "@/lib/supabase/client";
import type { RemoteCommand } from "@/lib/types";

type SessionRow = {
  id: string;
  name: string;
  pairing_code: string;
  pairing_token: string;
  status: string;
  created_at: string;
};

type ConnectionStatus = "connected" | "waiting" | "disconnected";
type DesktopClientStatus = "connected" | "not_connected";

const COMMAND_LABELS: Record<RemoteCommand, string> = {
  NEXT_SLIDE: "次へ",
  PREV_SLIDE: "戻る",
  START_PRESENTATION: "開始",
  END_PRESENTATION: "終了",
  BLACKOUT: "黒画面",
  WHITEOUT: "白画面",
};

export default function SessionPage() {
  const params = useParams<{ id: string }>();
  const sessionId = params.id;

  const [session, setSession] = useState<SessionRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [connectionStatus] = useState<ConnectionStatus>("waiting");
  const [desktopClientStatus] =
    useState<DesktopClientStatus>("not_connected");

  const [isSending, setIsSending] = useState(false);
  const [lastCommand, setLastCommand] = useState<RemoteCommand | null>(null);
  const [commandMessage, setCommandMessage] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;

      setIsLoading(true);
      setErrorMessage("");

      const supabase = createClient();

      const { data, error } = await supabase
        .from("sessions")
        .select("id, name, pairing_code, pairing_token, status, created_at")
        .eq("id", sessionId)
        .single();

      if (error) {
        console.error("session fetch error:", error);
        setErrorMessage("セッションの取得に失敗しました。");
        setSession(null);
        setIsLoading(false);
        return;
      }

      setSession(data as SessionRow);
      setIsLoading(false);
    };

    fetchSession();
  }, [sessionId]);

  const connectionUrl = useMemo(() => {
    if (!session) return "";

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");

    return `${appUrl}/remote/${session.id}?token=${session.pairing_token}`;
  }, [session]);

  const receiverCommand = useMemo(() => {
    if (!session) return "";
    return `cd receiver && npm run dev -- ${session.pairing_code}`;
  }, [session]);

  const handleCommand = async (command: RemoteCommand) => {
    if (!session) return;

    setIsSending(true);
    setCommandMessage("");

    const supabase = createClient();

    const { error } = await supabase.from("commands").insert({
      session_id: session.id,
      command,
      payload: {
        source: "pc_control_panel",
      },
    });

    if (error) {
      console.error("command insert error:", error);
      setCommandMessage(
        "操作を送信できませんでした。PC側受信アプリの起動状態を確認してください。"
      );
      setIsSending(false);
      return;
    }

    setLastCommand(command);
    setCommandMessage("操作を送信しました。");
    setIsSending(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border-border">
          <CardContent className="py-10 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              セッションを読み込んでいます...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session || errorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border-border">
          <CardHeader className="text-center">
            <CardTitle>セッションが見つかりません</CardTitle>
            <CardDescription>
              セッションが存在しないか、アクセス権限がありません。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
            <Link href="/dashboard">
              <Button>ダッシュボードへ戻る</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-foreground">
              Slide Remote Web
            </span>
          </Link>

          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              ダッシュボードへ
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 md:py-10">
          <section className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {session.name}
                </h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  PC側受信アプリを起動し、スマホでQRコードを読み取ると、
                  スマホからPowerPointを操作できます。
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <ConnectionStatusBadge status={connectionStatus} />
                <DesktopClientStatusBadge status={desktopClientStatus} />
              </div>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">スマホを接続</CardTitle>
                  <CardDescription>
                    QRコードを読み取るか、6桁コードを入力して接続します。
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-6">
                  <div className="w-full rounded-2xl border border-border bg-muted/30 p-5 text-center">
                    <p className="mb-3 text-sm font-medium text-muted-foreground">
                      セッションコード
                    </p>
                    <SessionCodeDisplay
                      code={session.pairing_code}
                      size="lg"
                    />
                  </div>

                  <div className="text-center">
                    <QRCodeDisplay value={connectionUrl} size={220} />
                    <p className="mt-3 text-sm text-muted-foreground">
                      スマホのカメラで読み取ると、リモコン画面に移動します。
                    </p>
                  </div>

                  <div className="w-full rounded-lg bg-muted p-3">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      接続URL
                    </p>
                    <code className="break-all text-xs text-foreground">
                      {connectionUrl}
                    </code>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">PC側受信アプリ</CardTitle>
                  <CardDescription>
                    PowerPointを操作するには、PCで受信アプリを起動してください。
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-border p-4">
                      <p className="mb-2 text-sm font-medium text-foreground">
                        スマホ接続
                      </p>
                      <ConnectionStatusBadge status={connectionStatus} />
                    </div>

                    <div className="rounded-lg border border-border p-4">
                      <p className="mb-2 text-sm font-medium text-foreground">
                        受信アプリ
                      </p>
                      <DesktopClientStatusBadge status={desktopClientStatus} />
                    </div>
                  </div>

                  <div className="rounded-lg bg-zinc-950 p-4 text-white">
                    <p className="mb-2 text-sm font-medium">
                      受信アプリの起動コマンド
                    </p>
                    <code className="block break-all text-xs">
                      {receiverCommand}
                    </code>
                  </div>

                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
                    <p className="text-sm font-medium">発表前の確認</p>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                      <li>PowerPointを開く</li>
                      <li>スライドショーモードにする</li>
                      <li>PC側受信アプリを起動する</li>
                      <li>スマホでQRコードを読み取る</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">PCから操作確認</CardTitle>
                  <CardDescription>
                    スマホ接続前に、PowerPoint操作が反応するか確認できます。
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-16"
                      disabled={isSending}
                      onClick={() => handleCommand("START_PRESENTATION")}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">▶</span>
                        <span className="text-xs">開始</span>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-16"
                      disabled={isSending}
                      onClick={() => handleCommand("END_PRESENTATION")}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">Esc</span>
                        <span className="text-xs">終了</span>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-16"
                      disabled={isSending}
                      onClick={() => handleCommand("PREV_SLIDE")}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">←</span>
                        <span className="text-xs">戻る</span>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-16"
                      disabled={isSending}
                      onClick={() => handleCommand("NEXT_SLIDE")}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">→</span>
                        <span className="text-xs">次へ</span>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-16"
                      disabled={isSending}
                      onClick={() => handleCommand("BLACKOUT")}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">B</span>
                        <span className="text-xs">黒画面</span>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-16"
                      disabled={isSending}
                      onClick={() => handleCommand("WHITEOUT")}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">W</span>
                        <span className="text-xs">白画面</span>
                      </div>
                    </Button>
                  </div>

                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-foreground">
                      操作状態
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {lastCommand
                        ? `最後の操作: ${COMMAND_LABELS[lastCommand]}`
                        : "まだ操作は送信されていません。"}
                    </p>
                    {commandMessage && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {commandMessage}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
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
                        セットアップに困った場合
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        受信アプリの起動方法やスマホ接続の手順を確認できます。
                      </p>
                      <Link href="/setup">
                        <Button
                          variant="link"
                          size="sm"
                          className="mt-2 h-auto p-0 text-primary"
                        >
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