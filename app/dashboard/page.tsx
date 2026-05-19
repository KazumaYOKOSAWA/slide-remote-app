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
import { dummyUser, dummyRecentSessions } from "@/lib/dummy-data";

export default function DashboardPage() {
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {dummyUser.name.charAt(0)}
              </div>
              <span className="hidden text-sm font-medium text-foreground md:inline">
                {dummyUser.name}
              </span>
            </div>
            <Link href="/">
              <Button variant="ghost" size="sm">
                ログアウト
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              ようこそ、{dummyUser.name}さん
            </h1>
            <p className="mt-2 text-muted-foreground">
              発表セッションを作成して、スマホからプレゼンをコントロールしましょう
            </p>
          </div>

          {/* Create Session Button */}
          <div className="mb-8">
            <Link href="/session/new">
              <Button size="lg" className="w-full md:w-auto">
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
                新しい発表セッションを作成
              </Button>
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Recent Sessions */}
            <div className="lg:col-span-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">最近のセッション</CardTitle>
                  <CardDescription>
                    過去に作成したセッションの一覧
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {dummyRecentSessions.length === 0 ? (
                    <div className="py-8 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="mt-4 text-muted-foreground">
                        まだセッションがありません
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dummyRecentSessions.map((session) => (
                        <Link
                          key={session.id}
                          href={`/session/${session.id}`}
                          className="block"
                        >
                          <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-foreground">
                                  {session.name}
                                </h3>
                                <Badge
                                  variant={
                                    session.connectionStatus === "connected"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {session.connectionStatus === "connected"
                                    ? "接続中"
                                    : "切断"}
                                </Badge>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                コード: {session.code} ・{" "}
                                {session.createdAt.toLocaleDateString("ja-JP")}
                              </p>
                            </div>
                            <svg
                              className="h-5 w-5 text-muted-foreground"
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
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Setup Guide Card */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    セットアップ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    PC側でNode.js受信アプリを起動すると、スマホからPowerPointを操作できるようになります。
                  </p>
                  <Link href="/setup">
                    <Button variant="outline" className="w-full">
                      セットアップガイドを見る
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Free MVP Info */}
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
                        完全無料MVPです
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Vercel無料枠とSupabase無料枠で運用しています。個人利用の範囲でご自由にお使いください。
                      </p>
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
