import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoogleLoginButton } from "@/components/google-login-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
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

          <Link href="/connect" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              スマホで接続
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <p className="text-sm font-medium text-primary">
              PCでセッションを作成
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              Googleでログイン
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              発表セッションを作成し、スマホ接続用のQRコードを表示できます。
            </p>
          </div>

          <Card className="border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold">
                セッション管理を始める
              </CardTitle>
              <CardDescription>
                PCから発表セッションを作成・管理します。
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <GoogleLoginButton />

              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex gap-3">
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

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      PCでの操作について
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PowerPointを操作するには、ログイン後にセッションを作成し、
                      PC側受信アプリを起動してください。
                    </p>
                  </div>
                </div>
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
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    スマホで接続する場合
                  </p>
                  <p className="text-sm text-muted-foreground">
                    QRコードを読み取るか、6桁コードを入力して接続する場合はログイン不要です。
                  </p>

                  <Link href="/connect">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-primary"
                    >
                      スマホ接続画面へ
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                トップページに戻る
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}