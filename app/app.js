// exporess(webフレームワーク)を利用する準備
const express = require('express')
const app = express()
// sqliteを利用できるように設定する
const sqlite3 = require('sqlite3')
const dbPath = "app/db/database.sqlite3"

const path = require('path')
// publicディレクトリを静的ファイル群のルートディレクトリとして設定
app.use(express.static(path.join(__dirname, 'public')))


// 全てのデータを取得するAPI
app.get('/api/v1/users', (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  db.all('SELECT * FROM users', (err, rows) => {
    res.json(rows)
  })
  db.close()
})

// idによって一部取得するAPI
app.get('/api/v1/users/:id', (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id
  db.get(`SELECT * FROM users WHERE ${id}`, (err, rows) => {
    res.json(rows)
  })
  db.close()
})

// Search users matching keyword
app.get('/api/v1/search', (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  const keyword = req.query.q
  db.all(`SELECT * FROM users WHERE name LIKE "%${keyword}%"`, (err, rows) => {
    res.json(rows)
  })
  db.close()
})

// ポート番号の指定(環境変数を参照orポート番号3000の指定)
const port = process.env.PORT || 3000;
app.listen(port);
// 成功でログとポート番号を表示
console.log("Listen on port" + port);
