// 本地存储
import store from 'store'
const USER_KEY = 'user_key'
const storage = {
   //保存user
   //存入的对象，要求存入字符串，默认会调用toString方法,转化为[object object]
    saveUser(user){
        // localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(USER_KEY,user)
    },
    //读取user
    //没有数据返回 null
    getUser(){
    //    return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
    return store.get(USER_KEY) || {}
},
    //删除user
    removeUser(){
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }

}

export default storage