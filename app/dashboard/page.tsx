import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";

type SessionRow = {
  id: string;
  name: string;
  pairing_code: string;
  status: string;
  created_at: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .single();

  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select("id, name, pairing_code, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (sessionsError) {
    console.error("Failed to fetch sessions:", sessionsError);
  }

  const displayName =
    profile?.display_name || user.user_metadata?.name || user.email || "User";

  const avatarInitial = displayName.charAt(0).toUpperCase();

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

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {avatarInitial}
                </div>
              )}

              <div className="leading-tight">
                <p className="text-sm font-medium text-foreground">
                  {displayName}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 md:py-10">
          {/* Hero */}
          <section className="mb-8">
            <Badge variant="secondary" className="mb-4">
              Dashboard
            </Badge>

            <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl">
                  スマホでPowerPointを
                  <br className="hidden md:block" />
                  操作しましょう
                </h1>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  PCで発表セッションを作成し、表示されたQRコードをスマホで読み取るだけで、
                  スライド送り・戻りを操作できます。
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/session/new">
                    <Button size="lg" className="w-full sm:w-auto">
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
                      新しいセッションを作成
                    </Button>
                  </Link>

                  <Link href="/setup">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      セットアップを見る
                    </Button>
                  </Link>
                </div>
              </div>

              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base">使い方</CardTitle>
                  <CardDescription>
                    発表前に以下の流れで接続します。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        1
                      </span>
                      <span>PCでセッションを作成</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        2
                      </span>
                      <span>PC側Node.js受信アプリを起動</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        3
                      </span>
                      <span>スマホでQRコードを読み取って操作</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Recent Sessions */}
            <section className="lg:col-span-2">
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        最近のセッション
                      </CardTitle>
                      <CardDescription>
                        作成した発表セッションの一覧です。
                      </CardDescription>
                    </div>

                    <Link href="/session/new" className="hidden md:block">
                      <Button variant="outline" size="sm">
                        新規作成
                      </Button>
                    </Link>
                  </div>
                </CardHeader>

                <CardContent>
                  {!sessions || sessions.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border py-10 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="mt-4 font-medium text-foreground">
                        まだセッションがありません
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        最初の発表セッションを作成しましょう。
                      </p>
                      <Link href="/session/new" className="mt-5 inline-block">
                        <Button>セッションを作成</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(sessions as SessionRow[]).map((session) => (
                        <Link
                          key={session.id}
                          href={`/session/${session.id}`}
                          className="block"
                        >
                          <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-medium text-foreground">
                                  {session.name}
                                </h3>
                                <Badge
                                  variant={
                                    session.status === "active"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {session.status === "active"
                                    ? "進行中"
                                    : session.status === "ended"
                                      ? "終了"
                                      : "待機中"}
                                </Badge>
                              </div>

                              <p className="mt-1 text-sm text-muted-foreground">
                                コード: {session.pairing_code} ・{" "}
                                {new Date(
                                  session.created_at
                                ).toLocaleDateString("ja-JP")}
                              </p>
                            </div>

                            <svg
                              className="ml-4 h-5 w-5 shrink-0 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
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
            </section>

            {/* Sidebar */}
            <aside className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    セットアップ状況
                  </CardTitle>
                  <CardDescription>
                    PowerPoint操作にはPC側受信アプリが必要です。
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        PC受信アプリ
                      </span>
                      <Badge variant="secondary">未接続</Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    セッション作成後、PC側でNode.js受信アプリを起動すると、
                    スマホからPowerPointを操作できます。
                  </p>

                  <Link href="/setup">
                    <Button variant="outline" className="w-full">
                      セットアップガイドを見る
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">MVPでできること</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>・QRコードでスマホ接続</li>
                    <li>・スライドの次へ / 戻る</li>
                    <li>・発表開始 / 終了</li>
                    <li>・黒画面 / 白画面</li>
                    <li>・接続状態の確認</li>
                  </ul>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}