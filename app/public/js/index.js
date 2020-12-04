// エントリーポイント
const indexModule = (()=>{

  // 検索ボタンをクリックしたときの挙動
 document.getElementById('search-btn').addEventListener('click', () => {
        return searchModule.searchUsers()
      })
  // userモジュールのfetchAllUsersメソットを呼び出す
  return usersModule.fetchAllUsers()
})()