# Anime-Management-Front-To-Supabase

アニメ視聴管理アプリケーション - Supabaseを使用したフロントエンド実装

## 概要

このアプリケーションは、アニメの視聴状況を管理するためのウェブアプリケーションです。ユーザーは視聴中のアニメ、過去に視聴したアニメ、視聴済みのアニメを管理することができます。Supabaseをバックエンドとして使用し、Next.jsとReactで構築されています。

## 主な機能

- **ユーザー認証**: Supabaseの認証機能を使用したログイン/ログアウト
- **アニメ登録**: 新しいアニメの登録（今期のアニメまたは過去のアニメ）
- **現在アニメ管理**: 現在視聴中のアニメの管理、話数のカウント、配信日時の表示
- **過去アニメ管理**: 過去に視聴したアニメの記録
- **視聴済みアニメ管理**: 視聴完了したアニメの管理

## 技術スタック

- **フロントエンド**: Next.js 15.1.7, React 19, TypeScript
- **スタイリング**: TailwindCSS
- **バックエンド**: Supabase (PostgreSQL, 認証, ストレージ)
- **コンテナ化**: Docker, Docker Compose

## データモデル

アプリケーションは以下のデータモデルを使用しています：

- **anime**: 基本的なアニメ情報（タイトル、話数、お気に入りキャラクター等）
- **current_anime**: 現在視聴中のアニメ（配信曜日、時間等）
- **past_anime**: 過去に視聴したアニメ
- **viewed_anime**: 視聴完了したアニメ

## 開発環境のセットアップ

### 前提条件

- Node.js
- npm または yarn
- Docker と Docker Compose（オプション）

### ローカル開発

1. リポジトリをクローン
   ```
   git clone <repository-url>
   cd Anime-Management-Front-To-Supabase/app
   ```

2. 依存関係のインストール
   ```
   npm install
   ```

3. 環境変数の設定
   `.env.example` ファイルを `.env` にコピーし、Supabaseの認証情報を設定

4. 開発サーバーの起動
   ```
   npm run dev
   ```

### Dockerを使用した開発

1. Docker Composeでアプリケーションを起動
   ```
   docker-compose up -d
   ```

## デプロイ

1. アプリケーションのビルド
   ```
   npm run build
   ```

2. 静的ファイルの生成（オプション）
   ```
   npm run export
   ```

3. 生成されたファイルをホスティングサービスにデプロイ
