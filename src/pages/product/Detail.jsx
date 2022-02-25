import React, { useState, useEffect } from 'react'
import { 
  Card,
  List,
   } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from './../../components/linkButton/LinkButton'
import { useNavigate, useLocation } from 'react-router-dom'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'

/* 
    product的商品详情子路由组件
 */
const Item = List.Item


export default function ProductDetail() {
  const [categoryName1, setCategoryName1] = useState() // 一级分类名称
  const [categoryName2, setCategoryName2] = useState() // 二级分类名称

  const navigate = useNavigate()

  const location = useLocation()  // 创建location获取父路由组件传递来的state数据
  const { 
        name, 
        desc, 
        price, 
        imgs, 
        detail,
        pCategoryId,
        categoryId } = location.state
  const title = (
    <span>
      <LinkButton>
        <ArrowLeftOutlined 
          onClick={()=>navigate(-1)}/>  {/* 向前跳转 */}
      </LinkButton>
      <span>商品详情</span>
    </span>
  )
  useEffect(() => {
    async function fetchData() {
      if(pCategoryId === '0') {  // 一级分类下的商品
        const result = await reqCategory(categoryId)
        if(result.status === 0) {
          setCategoryName1(result.data.name)
        }
      } else {  // 二级分类下的商品

        /*
        // 通过多个await方式发多个请求：后面的请求是在前一个请求返回结果之后才发送
        const result1 = await reqCategory(pCategoryId)
        const result2 = await reqCategory(categoryId)
        if(result1.status === 0 && result2.status === 0) {
          setCategoryName1(result1.data.name)
          setCategoryName2(result2.data.name)
        } */
        // 通过Promise对象 将所有请求以数组方式统一发送
        const result = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
        setCategoryName1(result[0].data.name)
        setCategoryName2(result[1].data.name)
      }
    }
    fetchData()
  })
  return (
    <Card 
      title={title} 
      className='product-detail'>
      <List itemLayout='left'>
        <Item style={{justifyContent: 'left'}}>
          <span className='left'>商品名称:</span>
          <span>{name}</span>
        </Item>
        <Item style={{justifyContent: 'left'}}>
          <span className='left'>商品描述:</span>
          <span>{desc}</span>
        </Item>
        <Item style={{justifyContent: 'left'}}>
          <span className='left'>价格:</span>
          <span>{price}</span>
        </Item>
        <Item style={{justifyContent: 'left'}}>
          <span className='left'>所属分类:</span>
          <span>{categoryName1} {categoryName2 ? '-->' +  categoryName2 : ''}</span>
        </Item>
        <Item style={{justifyContent: 'left'}}>
          <span className='left'>商品图片:</span>
          <span>
            {
              imgs.map((img) => 
                <img 
                  key={img}
                  className='product-img'
                  src={BASE_IMG_URL + img} 
                  alt='img' />
              )
            }
          </span>
        </Item>
        <Item style={{justifyContent: 'left'}}>
          <span className='left'>商品详情:</span>
          <span dangerouslySetInnerHTML={{__html: detail}}></span>
        </Item>       
      </List>
    </Card>
  )
}
