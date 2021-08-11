# GraphQLサーバ

サーバ起動

```
node src/index.js
```

ホットリロード

```
npm install --save-dev nodemon
npx nodemon src/index.js
```

``localhost:4000``で確認

クエリ

```
query {
    feed {
    id
    url
    description
    }
}
```


prismaをインストール

```
npm install prisma --save-dev
npm install @prisma/client
```

マイグレーション

```
npx prisma migrate dev
```

prisma client をジェネレート

```
npx prisma generate
```

テスト実行

```
node src/script.js
```

Prisma Studio 表示

```
npx prisma studio
```
