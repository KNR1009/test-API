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
// jsonで読み取れるようにしている
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
    if(!rows){
      res.status(404).send({errror: 'Not Found'})
    }else{
      res.status(200).send(res.json(rows))
    }
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

  // DBリクエストを実行するための関数を作成
    const run = async(sql, db) => {
      return new Promise ((resolve, reject) => {
        // SQLクエリを実行するようなsqlite3のメソット
        db.run(sql, (err) => {
          if(err){
            // 以下の文でtry&catch構文で後者に回る
            return reject(err);
          }else{
            return resolve();
          }
        })
      })
    }

// Create a new user
app.post('/api/v1/users', async (req, res) => {
  // エラー処理
  if(req.body.name === ""){
    // ユーザー名が入力されていなかっt場合
    res.status(400).send({error: "ユーザー名が空です"})
  }else{
      // Connect database
    const db = new sqlite3.Database(dbPath)
    const name = req.body.name
    const profile = req.body.profile ? req.body.profile : ""
    const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : ""

    try {
      // 処理がサーバがで受理された場合
      await run(
        `INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${dateOfBirth}")`,
        db
      )
      res.status(201).send({message: '新規登録に成功しました'})
    } catch (error) {
      res.status(500).send({error})
    }
    db.close()
  }
})
 

// 値を更新するメソットを作成
app.put('/api/v1/users/:id', async (req, res) => {
  if (!req.body.name || req.body.name === "") {
    res.status(400).send({error: "ユーザー名が指定されていません。"})
  } else {
    // Connect database
    const db = new sqlite3.Database(dbPath)
    const id = req.params.id

    // 現在のユーザー情報を取得する
    db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {

      if (!row) {
        res.status(404).send({error: "指定されたユーザーが見つかりません。"})
      } else {
        const name = req.body.name ? req.body.name : row.name
        const profile = req.body.profile ? req.body.profile : row.profile
        const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : row.date_of_birth

        try {
          await run(
            `UPDATE users SET name="${name}", profile="${profile}", date_of_birth="${dateOfBirth}" WHERE id=${id}`,
            db
          )
          res.status(200).send({message: "ユーザー情報を更新しました。"})
        } catch (e) {
          res.status(500).send({error: e})
        }
      }
    })

    db.close()
  }
})

// 削除用のAPIの作成
app.delete('/api/v1/users/:id', async (req, res) => {
     // Connect database
    const db = new sqlite3.Database(dbPath)
    // idの取得
    const id = req.params.id

    db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
        if (!row) {
          res.status(404).send({error: "指定されたユーザーが見つかりません。"})
        } else {
          try {
            await run(
                `DELETE FROM users WHERE id=${id}`,
                db,
                )
            res.status(200).send({message: "ユーザーを削除しました"})
          } catch (e) {
            res.status(500).send({error: e})
          }
        }
        db.close()
      })
})


  


  

// ポート番号の指定(環境変数を参照orポート番号3000の指定)
const port = process.env.PORT || 3000;
app.listen(port);
// 成功でログとポート番号を表示
console.log("Listen on port" + port);

