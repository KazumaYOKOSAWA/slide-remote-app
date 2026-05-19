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
import { Badge } from "@/components/ui/badge";
import {
  ConnectionStatusBadge,
  DesktopClientStatusBadge,
} from "@/components/connection-status-badge";
import { QRCodePlaceholder } from "@/components/qr-code-placeholder";
import { SessionCodeDisplay } from "@/components/session-code-display";
import { createClient } from "@/lib/supabase/client";
import type { RemoteCommand } from "@/lib/types";
import { QRCodeDisplay } from "@/components/qr-code-display";

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
        .select(
          "id, name, pairing_code, pairing_token, status, created_at"
        )
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

  const handleTestCommand = async (command: RemoteCommand) => {
    if (!session) return;

    setIsSending(true);
    setCommandMessage("");

    const supabase = createClient();

    const { error } = await supabase.from("commands").insert({
      session_id: session.id,
      command,
      payload: {
        source: "pc_test_button",
      },
    });

    if (error) {
      console.error("command insert error:", error);
      setCommandMessage(
        "コマンド送信に失敗しました。RLS設定やcommandsテーブルを確認してください。"
      );
      setIsSending(false);
      return;
    }

    setLastCommand(command);
    setCommandMessage("コマンドを送信しました。PC側受信アプリを起動していれば反応します。");
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
      {/* Header */}
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
          {/* Session Header */}
          <section className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <Badge variant="secondary" className="mb-3">
                  PC用セッション画面
                </Badge>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {session.name}
                </h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  この画面をPCで開いたまま、スマホでQRコードを読み取って接続してください。
                  PowerPoint操作にはPC側Node.js受信アプリの起動が必要です。
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <ConnectionStatusBadge status={connectionStatus} />
                <DesktopClientStatusBadge status={desktopClientStatus} />
              </div>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Left Column */}
            <div className="space-y-6">
              {/* QR Code & Session Code */}
              <Card className="border-border">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">
                    スマホを接続する
                  </CardTitle>
                  <CardDescription>
                    QRコードを読み取るか、6桁コードを入力してください。
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
                    {/* <QRCodePlaceholder
                      sessionCode={session.pairing_code}
                      size="lg"
                    /> */}
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

              {/* Setup Status */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">接続チェック</CardTitle>
                  <CardDescription>
                    発表前にスマホとPC受信アプリの状態を確認します。
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-border p-4">
                      <p className="mb-2 text-sm font-medium text-foreground">
                        スマホ接続
                      </p>
                      <ConnectionStatusBadge status={connectionStatus} />
                      <p className="mt-2 text-xs text-muted-foreground">
                        現時点では手動表示です。remote画面実装後に自動更新します。
                      </p>
                    </div>

                    <div className="rounded-lg border border-border p-4">
                      <p className="mb-2 text-sm font-medium text-foreground">
                        PC受信アプリ
                      </p>
                      <DesktopClientStatusBadge status={desktopClientStatus} />
                      <p className="mt-2 text-xs text-muted-foreground">
                        Node.js受信アプリ側の接続確認は次の実装で行います。
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
                    <p className="text-sm font-medium">
                      PowerPoint操作の確認手順
                    </p>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                      <li>PowerPointを開く</li>
                      <li>スライドショーモードにする</li>
                      <li>PC側Node.js受信アプリを起動する</li>
                      <li>右側の「次へ」テストを押す</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Test Commands */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">テスト操作</CardTitle>
                  <CardDescription>
                    ボタンを押すと、commandsテーブルにコマンドを送信します。
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-16"
                      disabled={isSending}
                      onClick={() => handleTestCommand("START_PRESENTATION")}
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
                      onClick={() => handleTestCommand("END_PRESENTATION")}
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
                      onClick={() => handleTestCommand("PREV_SLIDE")}
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
                      onClick={() => handleTestCommand("NEXT_SLIDE")}
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
                      onClick={() => handleTestCommand("BLACKOUT")}
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
                      onClick={() => handleTestCommand("WHITEOUT")}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">W</span>
                        <span className="text-xs">白画面</span>
                      </div>
                    </Button>
                  </div>

                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-foreground">
                      送信状態
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {lastCommand
                        ? `最後に送信したコマンド: ${lastCommand}`
                        : "まだコマンドは送信されていません。"}
                    </p>
                    {commandMessage && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {commandMessage}
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
                    <div className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <p className="text-sm">
                        実際にPowerPointを操作するには、PC側Node.js受信アプリがcommandsテーブルを購読している必要があります。
                      </p>
                    </div>
                  </div>
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
                        次はPC側受信アプリを作成します
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        この画面からcommandsテーブルへ送信できたら、
                        次にNode.jsアプリでコマンドを受け取り、PowerPointへキー入力を送ります。
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