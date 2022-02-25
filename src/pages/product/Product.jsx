import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProductHome from './Home'
import ProductDetail from './Detail'
import ProductAddUpdate from './AddUpdate'
import './style-product/product.less'

/* 商品路由 */
export default function Product() {
  return (
    <Routes>
      <Route path='/' element={<ProductHome/>}/>
      <Route path='addupdate' element={<ProductAddUpdate/>}/>
      <Route path='detail' element={<ProductDetail/>}/>
    </Routes>
  )
}
