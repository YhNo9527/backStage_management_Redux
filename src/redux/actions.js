/* 
    包含n个action creator函数的模块 
    同步action:对象{type: 'xxx', data: 数据值}
    异步action:函数 dispatch => {}
*/
import { message } from 'antd'
import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils'
import { RECEIVE_USER, 
         SET_HEAD_TITLE,
         RESET_USER } from './contant'

/* 设置头部标题的同步action */
export const setHeadTitle = (headTitle) => ({ type: SET_HEAD_TITLE, data: headTitle })

/* 接收用户的同步action */
export const receiveUser = (user) => ({type: RECEIVE_USER, data: user})

/* 登录的异步action */
export const login = (username, password) => {
    return async dispatch => {
        // 1.执行异步ajax请求
        const result = await reqLogin(username, password)
        // 2-1 成功，分发成功的同步action
        if(result.status === 0) {
            message.success('登录成功')

            const user = result.data
            // 保存到local中
            storageUtils.saveUser(user)
            // 分发接收用户的同步action
            dispatch(receiveUser(user))
        } else { // 2-2 失败，分发失败的同步action
            const msg = result.msg
            message.error(msg)
        }
    }
}

/* 退出登录的同步action */
export const logout = () => {
    // 删除local中的user
    storageUtils.removeUser()
    // 返回action对象
    return {type: RESET_USER}
}