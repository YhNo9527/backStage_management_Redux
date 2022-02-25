import React, { useState, useEffect } from 'react'
import { Card, 
        Table,
        Button,
        Modal,
        Form } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import LinkButton from '../../components/linkButton/LinkButton'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api'
import { message } from 'antd'
import AddForm from './form/AddForm'
import UpdateForm from './form/UpdateForm'


/* 商品分类路由 */
export default function Category() {
  const [form] = Form.useForm()
  const [categorys, changeCategory] = useState([])    // 一级分类列表
  const [loading, changeLoading] = useState(false)    //  是否展示loading
  const [parentId, changeParentId] = useState('0')  // parentId 初始获取一级列表
  const [subCategorys, changeSubCategorys] = useState([])  // 二级分类列表
  const [parentName, changeParentName] = useState('') // 当前需要显示的分类列表的父分类名称
  const [showStatus, changeShowStatus] = useState(0) // 确认框的显示状态，0：显示  1：显示add框  2：显示update框
  const [currentCategory, changeCurrentCategory] = useState({}) // 当前列表对象

  // 异步获取一级(或二级)列表数据
  const getCategorys = async () => {
    // 在发送请求前，开启loading
    changeLoading(true)
    // 异步ajax请求，获取数据
    const result = await reqCategorys(parentId)
    // 在请求完成之后 关闭loading
    changeLoading(false)
    if(result.status === 0) {
      // 取出分类列表(可能是一级  也可能是二级)
      const categorys = result.data
      if(parentId === '0'){
        changeCategory(categorys)
      } else {
        changeSubCategorys(categorys)
      }
    } else {
      message.error('获取分类列表失败')
    }
  }

  // 显示二级列表
  const showSubCategorys = (category) => {
    changeParentId(category._id)
    changeParentName(category.name)
    // getCategorys()  // 由于状态更新是异步的  在更新状态之后获取状态，因为是异步的 获取到的状态是没被更新时的状态
  }

  // 更新为一级列表
  const showCategorys = () => {
    changeParentId('0')
    changeParentName('')
    changeSubCategorys([])
  }

  // 隐藏确认框
  const handleCancel = () => {
    // 隐藏确认框
    changeShowStatus(0)

    // 重置form属性
    form.resetFields()
  }

  // 显示添加的确认框
  const showAdd = () => {
    // 设置name为parentId的fromItem的默认值
    form.setFieldsValue({parentId})

    // 显示添加框
    changeShowStatus(1)
  }

  // 添加分类
  const addCategory = () => {
    // 进行表单验证
    form.validateFields(['categoryName']).then(async ()=>{
          // 隐藏确认框
        changeShowStatus(0)

        // 准备数据
        const {categoryName, parentId} = form.getFieldsValue(['categoryName', 'parentId'])
        
        // 清除输入数据
        form.resetFields()

        // 提交添加分类请求
        const result = await reqAddCategory(categoryName, parentId)
        if(result.status === 0) {
          // 重新获取并展示分类列表
          getCategorys()
        }
      }
    )
  }
    
  // 显示更新的确认框
  const showUpdate = (category) => {
    changeCurrentCategory(category)
    changeShowStatus(2)
  }

  // 获取需要更新的input中的值
  let inputValue
  const getInputValue = (Value) => {
    inputValue = Value
    return inputValue
  }

  // 更新分类
  const updateCategory = () => {
    // 进行表单验证，验证通过执行下面语句
    form.validateFields(['category']).then(async ()=>{
      // 隐藏确定框
    changeShowStatus(0)

    // 准备需要请求的数据
    const categoryId = currentCategory._id
    const categoryName = inputValue

    form.resetFields()

    // 请求数据
    const result = await reqUpdateCategory({categoryId, categoryName})
    if(result.status === 0) {
      // 重新展示分类
      getCategorys()
    }
    })
  }

  // 发送ajax异步请求
  useEffect(() => {
    // 获取请求数据
    getCategorys()
  },[parentId])   // 监听parentId 在parentId一被更新 就执行getCategorys,保证此时状态为最新状态


  // card左侧
  const title = parentId === '0' ? '一级分类列表' : (
    <span>
      <LinkButton onClick={showCategorys}>一级分类列表</LinkButton>
      <ArrowRightOutlined />
      <span style={{margin:'5px'}}>{parentName}</span>
    </span>
  )
  // card右侧
  const extra = (
    <Button type='primary' onClick={showAdd}>
      <PlusOutlined />
      添加
    </Button>
  )
  
  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
    },
    {
      width: '300px',
      title: '操作',
      render: (category) => (
        <span>
          <LinkButton onClick={() => showUpdate(category)}>修改分类</LinkButton>
          {
            parentId === '0' ? <LinkButton onClick={() => showSubCategorys(category)}>查看子分类</LinkButton> : null
          }
        </span>
      )
    }
  ]

  return (
    <Form form={form} style={{ width: '100%', height: '100%' }}>
      <Card title={title} extra={extra}>
        <Table
            bordered
            loading={loading}
            dataSource={parentId==='0' ? categorys : subCategorys} 
            columns={columns}
            rowKey='_id'
            pagination={{defaultPageSize: 5, showQuickJumper: true}}
            ></Table>
      </Card>
      <Modal title="添加分类" visible={showStatus === 1} onCancel={handleCancel} onOk={addCategory} forceRender>
        <AddForm categorys={categorys} parentId={parentId}/>
      </Modal>
      <Modal title="更新分类" visible={showStatus === 2} onCancel={handleCancel} onOk={updateCategory} forceRender> 
        <UpdateForm category={currentCategory} getInputValue={getInputValue}/>
      </Modal>
    </Form>
  )
}
