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

export default function NewSessionPage() {
  const router = useRouter();
  const [sessionName, setSessionName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName.trim()) return;

    setIsCreating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Navigate to session page with dummy ID
    router.push("/session/session_001");
  };

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
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">新しいセッションを作成</CardTitle>
            <CardDescription>
              発表セッションの名前を入力してください
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
                />
                <p className="text-xs text-muted-foreground">
                  発表内容がわかりやすい名前をつけると便利です
                </p>
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
      </main>
    </div>
  );
}
