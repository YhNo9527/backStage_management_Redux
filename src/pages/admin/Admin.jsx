import React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import Header from '../../components/header/Header'
import LeftNav from '../../components/leftNav/LeftNav'
import Home from './../home/Home'
import Category from './../category/Category'
import Product from './../product/Product'
import User from './../user/User'
import Role from './../role/Role'
import Bar from './../charts/Bar'
import Line from './../charts/Line'
import Pie from './../charts/Pie'
import Order from './../order/Order'

/* 
后台管理路由组件
 */
const { Footer, Sider, Content } = Layout
function Admin(props) {
    const user = props.user
    // 如果内存没有存储user ==> 当前没有登录
    if(!user || !user._id){
        return <Navigate to='/login'/>
    }
    return (
        <Layout style={{minHeight:'100%'}}>
            <Sider>
                <LeftNav/>
            </Sider>
            <Layout>
                <Header>Header</Header>
                <Content style={{margin:'20px', backgroundColor:'white', minHeight: '50%'}}>
                    <Routes>
                        <Route path='home' element={<Home/>}/>
                        <Route path='category' element={<Category/>}/>
                        <Route path='product/*' element={<Product/>}/>
                        <Route path='user' element={<User/>}/>
                        <Route path='role' element={<Role/>}/>
                        <Route path='bar' element={<Bar/>}/>
                        <Route path='line' element={<Line/>}/>
                        <Route path='pie' element={<Pie/>}/>
                        <Route path='order' element={<Order/>}/>
                        <Route index element={<Navigate to='home'/>}/>
                    </Routes>
                </Content>
                <Footer style={{textAlign:'center', color:'grey',}} >YH</Footer>
            </Layout>
        </Layout>
    )
}

export default connect(
    state => (
        {
            user: state.user
        }
    )
)(Admin)

