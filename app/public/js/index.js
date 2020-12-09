// エントリーポイント
const indexModule = (()=>{
  const path = window.location.pathname
  
  switch(path){
    case '/':
      // 検索ボタンをクリックしたときの挙動
      document.getElementById('search-btn').addEventListener('click', () => {
            return searchModule.searchUsers()
          })
      // userモジュールのfetchAllUsersメソットを呼び出す
      return usersModule.fetchAllUsers()
      break;

    case '/create.html':
      document.getElementById('save-btn').addEventListener('click', () => {
        return usersModule.createUser()
      })
  }



  // 新規作成ボタンをクリック
  
})()
