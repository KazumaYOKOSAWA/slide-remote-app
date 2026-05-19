# Slide Remote App

スマホをPowerPointリモコンとして使うためのMVPアプリです。  
PCで発表セッションを作成し、スマホでQRコードを読み取ることで、スマホからPowerPointの「次へ」「戻る」などを操作できます。

## 概要

Slide Remote Webは、以下の構成で動作します。

```text
スマホ / Webアプリ
  ↓ コマンド送信
Supabase commands テーブル
  ↓ Realtime購読
PC側 receiver
  ↓ キー入力送信
PowerPoint
```

PowerPointを直接APIで操作するのではなく、PC上で起動しているreceiverがキーボード入力を送ることでスライドショーを操作します。

## 主な機能

- Googleログイン
- 発表セッション作成
- 6桁セッションコード発行
- QRコードによるスマホ接続
- スマホ用リモコン画面
- PowerPoint操作コマンド送信
- PC側receiverによるコマンド受信
- PowerPointへのキー入力送信

## 対応コマンド

| コマンド | PowerPoint操作 |
|---|---|
| NEXT_SLIDE | 次のスライドへ |
| PREV_SLIDE | 前のスライドへ |
| START_PRESENTATION | スライドショー開始 |
| END_PRESENTATION | スライドショー終了 |
| BLACKOUT | 黒画面 |
| WHITEOUT | 白画面 |

## 技術スタック

### Webアプリ

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase PostgreSQL
- Supabase Realtime
- Vercel

### PC側receiver

- Node.js
- TypeScript
- Supabase JavaScript Client
- dotenv
- @nut-tree-fork/nut-js

## ディレクトリ構成

```text
slide-remote-app/
├─ app/
│  ├─ page.tsx
│  ├─ login/
│  ├─ dashboard/
│  ├─ session/
│  │  ├─ new/
│  │  └─ [id]/
│  ├─ remote/
│  │  └─ [sessionId]/
│  ├─ connect/
│  └─ auth/
│     └─ callback/
├─ components/
├─ lib/
│  ├─ supabase/
│  └─ types.ts
├─ receiver/
│  ├─ index.ts
│  ├─ package.json
│  └─ .env
└─ README.md
```

## 事前準備

以下が必要です。

- Node.js
- npm
- Supabaseプロジェクト
- Google OAuth Client
- Vercelアカウント
- PowerPoint

## Webアプリのセットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/KazumaYOKOSAWA/slide-remote-app.git
cd slide-remote-app
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 環境変数を設定

プロジェクト直下に `.env.local` を作成します。

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Vercelにデプロイする場合は、`NEXT_PUBLIC_APP_URL` を本番URLにします。

```env
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

### 4. ローカル起動

```bash
npm run dev
```

ブラウザで以下を開きます。

```text
http://localhost:3000
```

## Supabase設定

### 必要なテーブル

以下のテーブルを使用します。

- profiles
- sessions
- devices
- commands

### sessions

主なカラム：

| カラム | 説明 |
|---|---|
| id | セッションID |
| user_id | 作成ユーザー |
| name | セッション名 |
| pairing_code | 6桁接続コード |
| pairing_token | QR接続用トークン |
| status | waiting / active / ended |
| created_at | 作成日時 |

### commands

主なカラム：

| カラム | 説明 |
|---|---|
| id | コマンドID |
| session_id | 対象セッション |
| command | NEXT_SLIDEなど |
| payload | 追加情報 |
| created_at | 作成日時 |
| executed_at | 実行日時 |

### Realtime設定

`commands` テーブルをSupabase Realtimeの対象にします。

SQL Editorで以下を実行します。

```sql
alter publication supabase_realtime add table public.commands;
```

すでに追加済みの場合はエラーが出ることがありますが、その場合は問題ありません。

### MVP検証用RLS

MVP検証では、receiverやスマホ画面からcommandsを扱えるように、以下のような一時的なpolicyを使用しています。

```sql
drop policy if exists "Allow command read for MVP receiver" on public.commands;
drop policy if exists "Allow command update for MVP receiver" on public.commands;

create policy "Allow command read for MVP receiver"
on public.commands
for select
using (true);

create policy "Allow command update for MVP receiver"
on public.commands
for update
using (true)
with check (true);

drop policy if exists "Allow public command insert for MVP remote" on public.commands;

create policy "Allow public command insert for MVP remote"
on public.commands
for insert
with check (true);
```

スマホ用リモコン画面がログインなしでセッション情報を読む場合は、以下も必要です。

```sql
drop policy if exists "Allow public read session for remote MVP" on public.sessions;

create policy "Allow public read session for remote MVP"
on public.sessions
for select
using (true);
```

> 注意: 上記はMVP検証用の緩いRLSです。本番運用では、pairing_tokenやAPI Routeを使って制限を強化してください。

## Googleログイン設定

Supabase AuthのGoogle Providerを有効化します。

### Google Cloud Console

OAuth Clientの設定：

Authorized JavaScript origins:

```text
http://localhost:3000
https://your-vercel-url.vercel.app
```

Authorized redirect URIs:

```text
https://your-project.supabase.co/auth/v1/callback
```

### Supabase URL Configuration

Site URL:

```text
https://your-vercel-url.vercel.app
```

Redirect URLs:

```text
http://localhost:3000/auth/callback
https://your-vercel-url.vercel.app/auth/callback
https://*.vercel.app/auth/callback
```

## PC側receiverのセットアップ

receiverは、Supabaseのcommandsテーブルを監視し、受け取ったコマンドに応じてPowerPointへキー入力を送ります。

### 1. receiverディレクトリへ移動

```bash
cd receiver
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 環境変数を設定

`receiver/.env` を作成します。

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. receiverを起動

PC画面に表示される6桁セッションコードを指定して起動します。

```bash
npm run dev -- 428193
```

例：

```text
Receiver started
Pairing code: 428193
Session: 卒論発表練習
Watching session: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Subscription status: SUBSCRIBED
```

## 使い方

### 1. PCでセッションを作成

1. Webアプリにアクセス
2. Googleログイン
3. ダッシュボードから「新しいセッションを作成」
4. セッション名を入力
5. セッション画面を開く

### 2. receiverを起動

PCのターミナルで以下を実行します。

```bash
cd receiver
npm run dev -- <6桁コード>
```

例：

```bash
npm run dev -- 428193
```

### 3. PowerPointを開く

PowerPointを開き、スライドショーモードにします。

### 4. スマホでQRコードを読み取る

PCのセッション画面に表示されたQRコードをスマホで読み取ります。  
スマホ用リモコン画面が開きます。

### 5. スマホから操作

スマホ画面のボタンを押すと、Supabase経由でPC側receiverにコマンドが送信されます。  
receiverがPowerPointへキー入力を送り、スライドが操作されます。

## Vercelへのデプロイ

### 1. GitHubへpush

```bash
git add .
git commit -m "Update slide remote MVP"
git push
```

### 2. Vercelに環境変数を設定

VercelのProject Settingsから以下を設定します。

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

設定後、Redeployしてください。

## npm / pnpmについて

このプロジェクトはnpmで管理します。  
`pnpm-lock.yaml` があると、Vercelがpnpmプロジェクトとして扱い、lockfile不一致でビルドに失敗することがあります。

npmに統一する場合は、`pnpm-lock.yaml` を削除し、`package-lock.json` をcommitしてください。

```bash
Remove-Item pnpm-lock.yaml
npm install
git add package.json package-lock.json
git add -u
git commit -m "Use npm instead of pnpm"
git push
```

## トラブルシュート

### Googleログイン後にログインページへ戻る

以下を確認してください。

- Supabase Google ProviderがONになっている
- Google CloudのClient ID / Secretが正しい
- Google CloudのAuthorized redirect URIにSupabase callback URLが入っている
- Supabase URL Configurationに `/auth/callback` が入っている
- `.env.local` が正しい
- 開発サーバーを再起動した

### `/remote/...` が404になる

以下のファイルが存在するか確認してください。

```text
app/remote/[sessionId]/page.tsx
```

GitHubにpushされていない場合、Vercel上では404になります。

### receiverにログが出ない

以下を確認してください。

- `commands` テーブルにinsertされているか
- receiverのSupabase URLがWebアプリと同じか
- commandsテーブルがRealtime publicationに入っているか
- RLSでreceiverからcommandsが読めるか
- receiver起動後に新しいコマンドを送っているか

### `Initial commands: []` になる

Supabase Table Editorにはcommandsがあるのにreceiverでは空の場合、以下を確認してください。

- receiverの `.env` が正しい
- Webアプリとreceiverが同じSupabaseプロジェクトを見ている
- RLSでselectが許可されている

### PowerPointが動かない

以下を確認してください。

- receiverに `Received command` が出ているか
- receiverに `Executed` が出ているか
- PowerPointがスライドショーモードになっているか
- PowerPointが前面にあるか
- OSがNode.jsからのキー入力を許可しているか

## 今後の改善案

- receiverをexe化する
- receiverをElectron/TauriでGUI化する
- PC画面にreceiver起動コマンドを表示する
- `/connect` で6桁コード接続を強化する
- RLSを本番向けに締める
- セッション終了機能を追加する
- 接続状態をRealtimeで表示する
- PowerPoint Add-in方式を検証する
- スライド番号や発表タイマーを強化する

## 注意事項

このMVPは、PowerPoint APIを直接使うのではなく、PC側receiverがキーボード入力を送ることでPowerPointを操作します。  
そのため、PowerPointのスライドショー画面が前面にある状態で使うことを想定しています。

また、MVP検証用にRLSを緩めている場合があります。本番利用する場合は、認証・pairing_token・API Routeなどを用いて権限制御を強化してください。
