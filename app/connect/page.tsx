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
import { createClient } from "@/lib/supabase/client";

export default function ConnectPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleConnect = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pairingCode = code.trim();
    if (!pairingCode || isConnecting) return;

    setIsConnecting(true);
    setErrorMessage("");

    const supabase = createClient();

    const { data, error } = await supabase
      .from("sessions")
      .select("id, pairing_token, status")
      .eq("pairing_code", pairingCode)
      .single();

    if (error || !data) {
      console.error("connect error:", error);
      setErrorMessage("セッションが見つかりません。コードを確認してください。");
      setIsConnecting(false);
      return;
    }

    if (data.status === "ended") {
      setErrorMessage("このセッションは終了しています。");
      setIsConnecting(false);
      return;
    }

    router.push(`/remote/${data.id}?token=${data.pairing_token}`);
  };

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

          <Link href="/">
            <Button variant="ghost" size="sm">
              トップへ
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              スマホで接続
            </CardTitle>
            <CardDescription>
              PC画面に表示された6桁コードを入力してください。
              QRコードを読み取った場合は、この画面を使う必要はありません。
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleConnect} className="space-y-5">
              <div className="space-y-2">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="例: 428193"
                  inputMode="numeric"
                  maxLength={6}
                  className="h-14 text-center text-2xl font-bold tracking-widest"
                />
                <p className="text-center text-xs text-muted-foreground">
                  セッションコードはPC用セッション画面に表示されています。
                </p>
              </div>

              {errorMessage && (
                <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {errorMessage}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={code.trim().length < 6 || isConnecting}
              >
                {isConnecting ? "接続中..." : "リモコン画面へ"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}