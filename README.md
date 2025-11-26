# Express API App

このプロジェクトは、Express.jsを使用してユーザー情報のCRUD処理を行うWeb APIアプリケーションです。

## プロジェクト構成

- **src/app.js**: アプリケーションのエントリーポイント。Expressアプリのインスタンスを作成し、ミドルウェアやルートを設定します。
- **src/controllers/userController.js**: ユーザー情報のCRUD処理を行う`UserController`クラスを含みます。
- **src/routes/userRoutes.js**: ユーザー関連のルートを設定します。
- **src/models/userModel.js**: ユーザーデータを管理する`User`モデルを含みます。
- **src/middleware/errorHandler.js**: エラーハンドリングのミドルウェアを提供します。
- **src/config/database.js**: データベース接続の設定を行います。
- **package.json**: プロジェクトの依存関係やスクリプトがリストされています。

## インストール

プロジェクトをクローンした後、以下のコマンドを実行して依存関係をインストールしてください。

```
npm install
```

## 使用方法

アプリケーションを起動するには、以下のコマンドを実行します。

```
npm start
```

## APIエンドポイント

- `POST /users`: 新しいユーザーを作成します。
- `GET /users/:id`: 指定されたIDのユーザー情報を取得します。
- `PUT /users/:id`: 指定されたIDのユーザー情報を更新します。
- `DELETE /users/:id`: 指定されたIDのユーザー情報を削除します。

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。