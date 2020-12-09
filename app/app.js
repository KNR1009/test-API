// exporess(webフレームワーク)を利用する準備
const express = require('express')
const app = express()

// sqliteを利用できるように設定する
const sqlite3 = require('sqlite3')
const dbPath = "app/db/database.sqlite3"

// HTMLのinputを受け取る
const bodyParser = require('body-parser');

// publicディレクトリを静的ファイル群のルートディレクトリとして設定
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

// リクエストのbodyを読み取る設定
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


// 全てのデータを取得するAPI
app.get('/api/v1/users', (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  db.all('SELECT * FROM users', (err, rows) => {
    res.json(rows)
  })
  db.close()
})

// idごとに取得できるAPI
app.get('/api/v1/users/:id', (req, res)=>{
  const db = new sqlite3.Database(dbPath);
  const id = req.params.id
  db.get(`SELECT * FROM users WHERE id=${id}`, (err, rows)=>{
    res.json(rows)
  })
  db.close()
})

  // DBリクエストを実行するための関数を作成
    const run = async(sql, db, res, message) => {
      return new Promise ((resolve, reject) => {
        db.run(sql, (err) => {
          if(err){
            res.status(500).send(err);
            return reject();
          }else{
            res.json({message: message})
            return resolve
          }
        })
      })
    }

 

// 値を更新するメソットを作成
app.put('/api/v1/users/:id', async (req, res) => {
    // Connect database
    const db = new sqlite3.Database(dbPath)

    // idの取得
    const id = req.params.id

    // 既存データを取得し変数に格納する
     db.get(`SELECT * FROM users WHERE id=${id}`,  (err, rows)=>{
        const name = req.body.name ? req.body.name : rows.name
        const profile = req.body.profile ? req.body.profile : rows.profile
        const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : rows.date_of_birth
     }) 
    const name = req.body.name
    const profile = req.body.profile ? req.body.profile : ""
    const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : ""

    await run(
        `UPDATE users SET name="${name}", profile="${profile}", date_of_birth="${dateOfBirth}" WHERE id=${id}`,
        db,
        res,
        'ユーザー情報を更新しました'
      )
    db.close()
})

// 削除用のAPIの作成
app.delete('/api/v1/users/:id', async (req, res) => {
    // Connect database
    const db = new sqlite3.Database(dbPath)

    // idの取得
    const id = req.params.id

    await run(
        `DELETE FROM users WHERE id=${id}`,
        db,
        res,
        'ユーザー情報を削除しました'
      )
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

// Create a new user
app.post('/api/v1/users', async (req, res) => {
  // Connect database
    const db = new sqlite3.Database(dbPath)
    const name = req.body.name
    const profile = req.body.profile ? req.body.profile : ""
    const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : ""

    await run(
        `INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${dateOfBirth}")`,
        db,
        res,
        '新規登録に成功しました'
      )
    db.close()
})
  


  

// ポート番号の指定(環境変数を参照orポート番号3000の指定)
const port = process.env.PORT || 3000;
app.listen(port);
// 成功でログとポート番号を表示
console.log("Listen on port" + port);

