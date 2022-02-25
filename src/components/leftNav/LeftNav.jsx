import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import withRouter from '../../utils/withRouter'
import menuList from './../../config/menuConfig'
import logo from '../../assets/logo.png'
import { setHeadTitle } from '../../redux/actions'
import './leftNav.less'

const { SubMenu } = Menu

class LeftNav extends Component {
    constructor(props){
        super(props)

        this.menuNodes = this.getMenuNodes(menuList)
    }

    hasAuth = (item) => {
        const { key, isPublic} = item
        const { user } = this.props
        const menus = user.role.menus
        const username = user.username
        /* 1.如果当前用户是admin
           2.如果当前item是公开的
           3.当前用户有此item权限：key有没有在menus中 */
        if(username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children){ // 如果当前用户有此item的某个子Item的权限
            return !!(item.children.find(child => menus.indexOf(child.key) !== -1))
        } else {
            return false
        }
    }
    // 根据menu的数据数组生成对应的标签数组
    // 使用map() + 递归调用
    getMenuNodes = (menuList) => {
        const path = this.props.router.location.pathname
        return menuList.map(           
            (item) => {
                // 如果当前用户有Item对应的权限，就需要显示对应的菜单项
                if(this.hasAuth(item)) {
                    if(!item.children){
                        // 判断item是否是当前对应的item
                        if(item.key === path || path.indexOf(item.key) === 0) {
                            // 更新redux中headTitle中的状态
                            this.props.setHeadTitle(item.title)
                        }
                        return (
                            <Menu.Item key={item.key}>
                                <Link 
                                    to={item.key} 
                                    onClick={() => this.props.setHeadTitle(item.title)}
                                >
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </Menu.Item>
                        )
                    } else {
                        // 查找一个与当前请求路径匹配的子Item
                        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                        // 如果存在，说明当前item的子列表需要打开
    
                        if(cItem){
                            this.openKey = item.key
                        }
                        return (
                            <SubMenu key={item.key} 
                                    icon={item.icon} 
                                    title={item.title}>
                                {/* 递归调用生成动态列表 */}
                                {this.getMenuNodes(item.children)}
                            </SubMenu>
                        )
                    }
                }
            }
        )  
    }
    render() {
        // 得到当前请求的路由路径
        let path = this.props.router.location.pathname
        if(path.indexOf('/product') === 0) { // 当前请求的是商品或其子路由界面
            path = '/product'

        }

        // 得到需要打开菜单项的key
        const openKey = this.openKey

        return (
            <div className='leftNav'>
                <header className='leftNav-header'>
                    <img src={logo} alt="" />
                    <h1>后台</h1>
                </header>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                    >
                    {
                        // this.getMenuNodes(menuList)
                        this.menuNodes
                    }                    
                </Menu>
            </div>
        )
    }
}

export default connect(
    state => (
        {
            user: state.user
        }
    ),{ setHeadTitle }
)(withRouter(LeftNav))


