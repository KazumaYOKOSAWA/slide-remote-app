"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

function generatePairingCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generatePairingToken() {
  return crypto.randomUUID();
}

export default function NewSessionPage() {
  const router = useRouter();
  const [sessionName, setSessionName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const trimmedName = sessionName.trim();
  //   if (!trimmedName || isCreating) return;

  //   setIsCreating(true);

  //   // TODO: Supabase接続後は、ここでsessionsテーブルにinsertする
  //   // 現時点ではMVP用の仮IDを生成してセッション画面へ遷移する
  //   await new Promise((resolve) => setTimeout(resolve, 500));

  //   const demoSessionId = `demo-${Date.now()}`;
  //   router.push(`/session/${demoSessionId}`);
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const trimmedName = sessionName.trim();
  if (!trimmedName || isCreating) return;

  setIsCreating(true);

  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("user fetch error:", userError);
    setIsCreating(false);
    router.push("/login");
    return;
  }

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      user_id: user.id,
      name: trimmedName,
      pairing_code: generatePairingCode(),
      pairing_token: generatePairingToken(),
      status: "waiting",
    })
    .select("id")
    .single();

  if (error) {
    console.error("session create error:", error);
    setIsCreating(false);
    return;
  }

  router.push(`/session/${data.id}`);
};

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

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <p className="text-sm font-medium text-primary">
              発表セッション作成
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              新しいセッションを作成
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              PCでセッションを作成すると、スマホ接続用のQRコードと6桁コードが表示されます。
            </p>
          </div>

          <Card className="border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold">
                セッション情報
              </CardTitle>
              <CardDescription>
                発表内容がわかる名前を入力してください。
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionName">セッション名</Label>
                  <Input
                    id="sessionName"
                    type="text"
                    placeholder="例: 卒論発表練習"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="text-base"
                    autoFocus
                    maxLength={50}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                      後から見ても分かる名前にすると便利です。
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sessionName.trim().length}/50
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <p className="text-sm font-medium text-foreground">
                    作成後にできること
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>・スマホ接続用QRコードの表示</li>
                    <li>・6桁セッションコードの表示</li>
                    <li>・PC受信アプリの接続状態確認</li>
                    <li>・テスト操作と操作ログの確認</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!sessionName.trim() || isCreating}
                >
                  {isCreating ? (
                    <>
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      作成中...
                    </>
                  ) : (
                    <>
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      セッションを作成
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0"
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
              <div>
                <p className="text-sm font-medium">
                  PowerPoint操作にはPC側受信アプリが必要です
                </p>
                <p className="mt-1 text-sm">
                  セッション作成後、Node.js受信アプリを起動してから発表を開始してください。
                </p>
                <Link href="/setup">
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-2 h-auto p-0 text-amber-900 underline"
                  >
                    セットアップ方法を見る
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                ダッシュボードに戻る
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}