/* 
    根据接收到的state 和指定的action生成返回新的state的纯函数
 */
import { combineReducers } from "redux"
import storageUtils from '../utils/storageUtils'
import { SET_HEAD_TITLE, RECEIVE_USER } from "./contant"
import { RESET_USER } from './contant';


/* 管理当前首页标题 */
const initHeadTitle = "首页"
const headTitle = (preState = initHeadTitle, action) => { 
    const { type, data } = action
    switch(type) {
        case SET_HEAD_TITLE: 
            return data
        default:
            return preState
    }
}


/* 管理当前用户名 */
const initUser = storageUtils.getUser()
const user = (preState = initUser, action) => { 
    const { type, data } = action
    switch(type) {
        case RECEIVE_USER:
            return data
        case RESET_USER:
            return {}
        default:
            return preState
    }
}


/* 向外暴露所有reducer函数合并之后的总的reducer函数 */
export default combineReducers({
    headTitle,
    user
})