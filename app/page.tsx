import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
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
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/setup">
              <Button variant="ghost" size="sm">
                セットアップ
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">ログイン</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16 text-center md:py-24">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            スマホを
            <span className="text-primary">PowerPointリモコン</span>
            に
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            専用リモコンなしで、スマホからスライド送り・戻りを操作できます。
            <br className="hidden md:block" />
            研究発表、ビジネスプレゼンに最適。完全無料で使えます。
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                <svg
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Googleでログイン
              </Button>
            </Link>
            <Link href="/connect">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
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
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                スマホで接続する
              </Button>
            </Link>
          </div>

          <div className="mt-4">
            <Link href="/setup">
              <Button variant="link" className="text-muted-foreground">
                セットアップを見る
              </Button>
            </Link>
          </div>
        </section>

        {/* Steps Section */}
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
              3ステップでかんたん操作
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <Card className="relative border-border">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    1
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    PCでGoogleログイン
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    PCのブラウザからGoogleアカウントでログインし、発表セッションを作成します。
                  </p>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="relative border-border">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    2
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    QRコードをスキャン
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    PC画面に表示されるQRコードをスマホで読み取ります。6桁コードの入力でも接続可能です。
                  </p>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="relative border-border">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    3
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    スマホで操作
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    スマホがリモコンに変身。「次へ」「戻る」ボタンでスライドを自在にコントロール。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
              特徴
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">完全無料</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Vercel無料枠とSupabase無料枠で運用可能。追加費用なし。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">セキュア</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    セッションごとに固有のコードを発行。第三者からの操作を防止。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">リアルタイム</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Supabase Realtimeでスマホの操作を即座にPCへ反映。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
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
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">スマホ最適化</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    片手で操作しやすい大きなボタン。発表中でも見やすい高コントラスト。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-2">
              <svg
                className="h-6 w-6 text-muted-foreground"
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
              <span className="text-sm font-medium text-muted-foreground">
                Slide Remote Web
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              完全無料で使えるプレゼンテーションリモコン
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
