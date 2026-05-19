import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
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

          <nav className="flex items-center gap-2">
            <Link href="/setup" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                セットアップ
              </Button>
            </Link>

            <Link href="/connect" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                スマホで接続
              </Button>
            </Link>

            <Link href="/login">
              <Button size="sm">ログイン</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16 text-center md:py-24">
          <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            スマホでPowerPoint操作
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            スマホを
            <span className="text-primary"> PowerPointリモコン </span>
            に
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            専用リモコンなしで、スマホからスライド送り・戻りを操作できます。
            <br className="hidden md:block" />
            研究発表、ゼミ発表、ビジネスプレゼンのためのシンプルなリモコンアプリです。
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                PCでログインして始める
              </Button>
            </Link>

            <Link href="/connect">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                スマホで接続する
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            PCでセッションを作成し、スマホはQRコードまたは6桁コードで接続します。
          </p>

          <div className="mt-4">
            <Link href="/setup">
              <Button variant="link" className="text-muted-foreground">
                セットアップを見る
              </Button>
            </Link>
          </div>
        </section>

        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
              3ステップでかんたん操作
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Card className="relative border-border">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    1
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    PCでセッション作成
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    PCのブラウザからログインし、発表用のセッションを作成します。
                  </p>
                </CardContent>
              </Card>

              <Card className="relative border-border">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    2
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    スマホでQRコードを読み取り
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    PC画面に表示されるQRコードをスマホで読み取ります。6桁コードでも接続できます。
                  </p>
                </CardContent>
              </Card>

              <Card className="relative border-border">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    3
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    スマホからスライド操作
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    「次へ」「戻る」などのボタンで、PowerPointのスライドを操作します。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
              <div>
                <p className="text-sm font-medium text-primary">仕組み</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  WebアプリとPC側受信アプリを組み合わせて操作します
                </h2>
                <p className="mt-4 text-muted-foreground">
                  スマホの操作はWebアプリから送信され、PC側で起動している受信アプリが受け取ります。
                  受信アプリがPowerPointにキーボード入力を送ることで、スライドを操作します。
                </p>
              </div>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3 rounded-lg bg-background p-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        1
                      </span>
                      <span>スマホで操作ボタンをタップ</span>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-background p-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        2
                      </span>
                      <span>操作内容をPC側受信アプリへ送信</span>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-background p-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        3
                      </span>
                      <span>受信アプリがPowerPointへキー入力</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
              主な機能
            </h2>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <FeatureItem
                title="QRコード接続"
                description="PC画面のQRコードをスマホで読み取るだけで、リモコン画面に移動できます。"
              />
              <FeatureItem
                title="6桁コード接続"
                description="QRコードが読み取れない場合でも、6桁コードを入力して接続できます。"
              />
              <FeatureItem
                title="スマホ最適化UI"
                description="片手で操作しやすい大きなボタンで、発表中でも迷わず操作できます。"
              />
              <FeatureItem
                title="PowerPoint操作"
                description="次へ、戻る、開始、終了、黒画面、白画面などの基本操作に対応しています。"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-2">
              <svg
                className="h-6 w-6 text-muted-foreground"
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
              <span className="text-sm font-medium text-muted-foreground">
                Slide Remote Web
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              スマホでPowerPointを操作するリモコンアプリ
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
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
      </div>

      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}