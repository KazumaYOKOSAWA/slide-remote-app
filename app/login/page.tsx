import Link from "next/link";
import { Button } from "@/components/ui/button";
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">ログイン</CardTitle>
            <CardDescription>
              PC側でセッションを作成するにはログインが必要です
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Login Button */}
            <Link href="/dashboard">
              <Button className="w-full" size="lg">
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

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">または</span>
              </div>
            </div>

            {/* Mobile Connection Info */}
            <div className="rounded-lg bg-muted/50 p-4">
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
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    スマホで接続する場合
                  </p>
                  <p className="text-sm text-muted-foreground">
                    スマホからQRコードを読み取るか、6桁コードを入力して接続する場合は、ログイン不要です。
                  </p>
                  <Link href="/connect">
                    <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                      スマホ接続画面へ
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex justify-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                トップページに戻る
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
