// exporess(webフレームワーク)を利用する準備
const express = require('express')
const app = express()

// sqliteを利用できるように設定する
const sqlite3 = require('sqlite3')
const dbPath = "app/db/database.sqlite3"
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

    const run = async(sql) => {
      return new Promise ((resolve, reject) => {
        db.run(sql, (err) => {
          if(err){
            res.status(500).send(err);
            return reject();
          }else{
            res.json({message: '新規登録成功しました'})
            return resolve
          }
        })
      })
    }
    
    await run(
        `INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${dateOfBirth}")`
      )
    db.close()
})
  


  

// ポート番号の指定(環境変数を参照orポート番号3000の指定)
const port = process.env.PORT || 3000;
app.listen(port);
// 成功でログとポート番号を表示
console.log("Listen on port" + port);

