"use client";

// import { useEffect, useMemo, useState } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { RemoteCommand } from "@/lib/types";


type SessionRow = {
  id: string;
  name: string;
  pairing_code: string;
  pairing_token: string;
  status: string;
};

export default function RemotePage() {
  const params = useParams<{ sessionId: string }>();
  const searchParams = useSearchParams();

  const sessionId = params.sessionId;
  const token = searchParams.get("token");

  const [session, setSession] = useState<SessionRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastCommand, setLastCommand] = useState<RemoteCommand | null>(null);

  const [startTime] = useState(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const lastSentAtRef = useRef(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId || !token) {
        setErrorMessage(
          "接続情報が不足しています。PC画面のQRコードを読み取り直してください。"
        );
        setIsLoading(false);
        return;
      }

      const supabase = createClient();

      const { data, error } = await supabase
        .from("sessions")
        .select("id, name, pairing_code, pairing_token, status")
        .eq("id", sessionId)
        .eq("pairing_token", token)
        .single();

      if (error || !data) {
        console.error("remote session fetch error:", error);
        setErrorMessage(
          "セッションが見つからないか、接続トークンが正しくありません。"
        );
        setSession(null);
        setIsLoading(false);
        return;
      }

      setSession(data as SessionRow);
      setIsLoading(false);
    };

    fetchSession();
  }, [sessionId, token]);

  const elapsedLabel = useMemo(() => {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, [elapsedSeconds]);

  const sendCommand = async (command: RemoteCommand) => {
    if (!session || !token || isSending) return;

    setIsSending(true);
    setErrorMessage("");

    const supabase = createClient();

    const { error } = await supabase.from("commands").insert({
      session_id: session.id,
      command,
      payload: {
        source: "mobile_remote",
        pairing_token: token,
      },
    });

    if (error) {
      console.error("remote command insert error:", error);
      setErrorMessage("コマンド送信に失敗しました。");
      setIsSending(false);
      return;
    }

    setLastCommand(command);
    setIsSending(false);
  };

  const sendPointerMove = async (dx: number, dy: number) => {
  if (!session || !token) return;

  const now = Date.now();
  if (now - lastSentAtRef.current < 60) return;
  lastSentAtRef.current = now;

  const supabase = createClient();

  await supabase.from("commands").insert({
    session_id: session.id,
    command: "POINTER_MOVE",
    payload: {
      source: "mobile_pointer",
      pairing_token: token,
      dx,
      dy,
    },
  });
};

const sendPointerClick = async () => {
  if (!session || !token) return;

  const supabase = createClient();

  await supabase.from("commands").insert({
    session_id: session.id,
    command: "POINTER_CLICK",
    payload: {
      source: "mobile_pointer",
      pairing_token: token,
    },
  });

  setLastCommand("POINTER_CLICK");
};

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <p className="text-sm text-zinc-400">
            リモコン画面を読み込んでいます...
          </p>
        </div>
      </div>
    );
  }

  if (!session || errorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <h1 className="text-lg font-bold">接続できませんでした</h1>
          <p className="mt-2 text-sm text-zinc-400">{errorMessage}</p>

          <Link href="/connect" className="mt-6 block">
            <Button className="w-full">コード入力画面へ</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      <main className="flex flex-1 flex-col px-4 py-5">
        <header className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-zinc-400">接続中</p>
              <h1 className="mt-1 truncate text-base font-semibold">
                {session.name}
              </h1>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-xs text-zinc-400">Time</p>
              <p className="mt-1 font-mono text-lg font-bold">
                {elapsedLabel}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
            <span>Code: {session.pairing_code}</span>
            <span>{isSending ? "送信中..." : "Ready"}</span>
          </div>
        </header>

        <section className="flex flex-1 items-center">
          <Button
            onClick={() => sendCommand("NEXT_SLIDE")}
            disabled={isSending}
            className="h-56 w-full rounded-3xl text-4xl font-bold shadow-lg active:scale-[0.99]"
          >
            次へ
          </Button>
        </section>

        <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div
            className="flex h-48 touch-none select-none items-center justify-center rounded-2xl border border-white/10 bg-zinc-900 text-center text-sm text-zinc-400"
            onTouchStart={(e) => {
              const touch = e.touches[0];
              lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              const last = lastTouchRef.current;
              if (!last) return;

              const dx = touch.clientX - last.x;
              const dy = touch.clientY - last.y;

              lastTouchRef.current = { x: touch.clientX, y: touch.clientY };

              sendPointerMove(dx, dy);
            }}
            onTouchEnd={() => {
              lastTouchRef.current = null;
            }}
          >
            指でなぞるとポインターを動かせます
          </div>

          <Button
            variant="secondary"
            className="mt-3 h-14 w-full rounded-2xl"
            onClick={sendPointerClick}
          >
            クリック
          </Button>
        </section>

        <section className="mt-5 grid grid-cols-3 gap-3">
          <Button
            variant="secondary"
            className="h-20 rounded-2xl text-base"
            disabled={isSending}
            onClick={() => sendCommand("PREV_SLIDE")}
          >
            戻る
          </Button>

          <Button
            variant="secondary"
            className="h-20 rounded-2xl text-base"
            disabled={isSending}
            onClick={() => sendCommand("BLACKOUT")}
          >
            黒画面
          </Button>

          <Button
            variant="secondary"
            className="h-20 rounded-2xl text-base"
            disabled={isSending}
            onClick={() => sendCommand("END_PRESENTATION")}
          >
            終了
          </Button>
        </section>

        <section className="mt-3 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-14 rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            disabled={isSending}
            onClick={() => sendCommand("START_PRESENTATION")}
          >
            発表開始
          </Button>

          <Button
            variant="outline"
            className="h-14 rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            disabled={isSending}
            onClick={() => sendCommand("WHITEOUT")}
          >
            白画面
          </Button>
        </section>

        <footer className="mt-4 min-h-10 text-center text-xs text-zinc-500">
          {lastCommand ? (
            <p>最後に送信: {lastCommand}</p>
          ) : (
            <p>ボタンを押すとPowerPoint操作コマンドを送信します</p>
          )}

          {errorMessage && <p className="mt-2 text-red-400">{errorMessage}</p>}
        </footer>
      </main>
    </div>
  );
}