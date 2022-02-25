import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { reqWeather } from '../../api'
import { formateDate } from '../../utils/dataUtils'
import { logout } from '../../redux/actions'
import LinkButton from '../linkButton/LinkButton'
import withRouter from '../../utils/withRouter'
import './header.less'

function Header(props) {
  // 获取从redux中得到数据
  const { headTitle, user } = props

  // 获取天气信息
  const [weather, setWeather] = useState('') // 当前天气
  const [currentTime, setCurrenTime] = useState(formateDate(Date.now())) // 当前时间
  // let [title, setTitle] = useState('')  // 标题

  const username = user.username // 获取用户名

  const getWeather = async () => {
    const result = await reqWeather(420100)  // 武汉城市代码
    setWeather(result)
  }
  
  /* const getTitle = () => {
    const path = location.pathname
    menuList.forEach(item => {
      if(item.key === path) { // 如果当前item对象的key与path一样，item的title就是需要显示的title
         setTitle(item.title)
      } else if (item.children) {
        // 在所有子item中查找拥有key的属性
        const cItem = item.children.find(cItem => cItem.key === path)
        // 有值表示有key
        if(cItem) {
          setTitle(cItem.title)
        }
      }
    })
  } */


  const { confirm } = Modal
  const logout = () => {
    confirm({
      title: '确定要退出吗',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      onOk() {
        // action中logout
        props.logout()
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }
  // 设置定时器并使用useEffect,在组件第一次挂载之后开始定时器，在卸载组件之前去除定时器

  useEffect(() => {
    let timer = setInterval(() => {
      setCurrenTime(formateDate(Date.now()))
    }, 1000)

    // 调用getWeather方法
    getWeather()

    return (
      () => {
        clearInterval(timer)
      }
    )
  }, [])

  /* useEffect(() => {
    getTitle()
  },[location.pathname]) */


  return (
    <div className='header'>
        <div className='header-top'>
          <span>欢迎, {username} </span>
          <LinkButton onClick={logout}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>
            <span>{headTitle}</span>
          </div>
          <div className='header-bottom-right'>
            <span>{currentTime}</span>
            <img src="" alt="" />
            <span>{weather}</span>
          </div>
        </div>
    </div>
  )
}


export default connect(
  state => (
    { 
      headTitle: state.headTitle,
      user: state.user
    }
  ),{ logout }
)(withRouter(Header)) 
