import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    Card,
    Select,
    Input,
    Table,
    Button,
    message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import LinkButton from './../../components/linkButton/LinkButton'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from './../../utils/constants'

/* 
    product的默认子路由组件
 */
const Option = Select.Option
export default function ProductHome() {
    const [products, setProducts] = useState([]) // 商品数组
    const [total, setTotal] = useState(0) // 商品总数量
    const [loading, setLoading] = useState(false) // 是否显示loading效果
    const [searchName, setSearchName] = useState('') // 搜索的关键字
    const [searchType, setSearchType] = useState('productName')  // 根据哪个字段搜索
    const [savePageNum, setSavePageNum] = useState(0)
    const navigate = useNavigate()  // 创建navigate方法

    // 根据pageNum 和pageSize获取商品列表信息
    const getProducts = async (pageNum) => {
        setSavePageNum(pageNum) // 保存当前页码
        setLoading(true)  // 显示loading
        // 如果搜索关键字有值，做搜索分页
        let result
        if(searchName) {
            result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
        } else { // 一般分页请求
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        setLoading(false) // 隐藏loading
        if(result.status === 0) {
            // 取出分页数据，更新状态，显示分页列表
            const { total, list } = result.data
            setProducts(list)
            setTotal(total)
        }
    }

    const updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if(result.status===0) {
            message.success('更新商品状态成功')
            getProducts(savePageNum)
        }
    }

    const columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              render: (price) => '￥'+ price
            },
            {
              width: 100,
              title: '状态',
              render: (product) => {
                  const { status, _id } = product
                  const newStatus = status===1 ? 2 : 1
                  return(
                      <span>
                          <Button type='primary' onClick={()=>updateStatus(_id, newStatus)}>
                              {status===1 ? '下架' : '上架'}
                          </Button>
                          <span>{status===1 ? '在售' : '已下架'}</span>
                      </span>
                  )
              }
            },
            {
              title: '操作',
              render: (product) => {
                  return(
                      <span>
                          {/* 将product通过state传递给子路由组件 */}
                          <LinkButton onClick={() => navigate('/product/detail', {state: product})}>详情</LinkButton>
                          <LinkButton onClick={() => navigate('/product/addupdate', {state: product})}>修改</LinkButton>
                      </span>
                  )
              }
            },
        ];

    const title = (
        <span>
            <Select value={searchType} style={{width: 150}} onChange={value => setSearchType(value)}>
                <Option value='productName'>按名称搜索</Option>
                <Option value='productDesc'>按描述搜索</Option>
            </Select>
            <Input placeholder='关键字' style={{width: 150, margin: '0 15px'}} value={searchName} onChange={e => setSearchName(e.target.value)}/>
            <Button type='primary' onClick={() => getProducts(1)}>搜索</Button>
        </span>
    )
    const extra = (
        <Button type='primary' onClick={() => navigate('/product/addupdate')}>
            <PlusOutlined/>
            添加商品
        </Button>
    )
    useEffect(() => {
        getProducts(1)
    },[])
    
  return (
      <Card title={title} extra={extra}>
          <Table
          rowKey='_id'
          dataSource={products} 
          columns={columns}
          bordered
          loading={loading}
          pagination={{
              current: savePageNum,
              defaultPageSize: PAGE_SIZE,
              total,
              showQuickJumper: true,
              onChange: pageNum => getProducts(pageNum)
              }}></Table>
      </Card>
  )
}
 