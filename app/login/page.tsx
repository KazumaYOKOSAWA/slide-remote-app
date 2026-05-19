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

          <Link href="/connect" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              スマホで接続
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <p className="text-sm font-medium text-primary">
              PC側セッション作成
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              Googleでログイン
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              発表セッションを作成し、QRコードを表示するにはログインが必要です。
            </p>
          </div>

          <Card className="border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold">
                セッション管理を始める
              </CardTitle>
              <CardDescription>
                ログイン後、PCで発表セッションを作成できます。
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google Login Button */}
              {/* TODO: Supabase Auth 実装後は、LinkではなくGoogle OAuthの関数を呼び出す */}
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
                      MVPではログイン処理は仮実装です
                    </p>
                    <p className="text-sm text-muted-foreground">
                      現時点ではボタンを押すとダッシュボードへ進みます。
                      Supabase Auth実装後にGoogleログインへ差し替えます。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Connection Info */}
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
                    スマホからQRコードを読み取る、または6桁コードを入力して接続する場合はログイン不要です。
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
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                トップページに戻る
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}