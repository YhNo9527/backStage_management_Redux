import React, { useState, useEffect } from 'react'
import {  
  Card,
  Button,
  Table,
  Modal,
  message,
  Form
} from 'antd'
import { formateDate } from './../../utils/dataUtils'
import LinkButton from './../../components/linkButton/LinkButton'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from './../../api/index'
import AddUser from '../user/AddUser'

/* 用户管理路由 */
export default function User() {
  const [form] = Form.useForm()
  const [users, setUsers] = useState([])
  const [isShow, setIsShow] = useState(false)
  const [roles, setRoles] = useState([])
  const [saveUser, setSaveUser] = useState({})

  const addOrUpdateUser = () => {
    form.validateFields().then(async () => {
      
      // 收集数据
      const user = form.getFieldsValue()
      console.log('user :>> ', user);
      setIsShow(false)
      
      if(saveUser) {
        console.log('user :>> ', saveUser)
        user._id = saveUser._id
      }
      // 提交请求
      const result = await reqAddOrUpdateUser(user)
      if(result.status === 0) {
        message.success(`${saveUser? '修改' : '添加'}用户成功`)
        getUsers()
      } else {
        message.error(result.msg)
      }
    
      form.resetFields()
      
    })
  }

  const getUsers = async () => {
    const result = await reqUsers()
    if(result.status === 0) {
      const { users, roles } = result.data
      setUsers(users)
      setRoles(roles)
    }
  }

  const deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if(result.status === 0) {
          message.success('删除当前用户成功')
          getUsers()
        }
      }
    })
  }

  const handleCreateUserClick = () => {
    setIsShow(true)
    setSaveUser()
  }
  
  const showUpdateUser = (user) => {
    setIsShow(true)
    setSaveUser(user)
  }

  const handleCancel = () => {
    setIsShow(false)
    form.resetFields()
  }

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    form.resetFields()
  }, [saveUser])

  const title = (
    <Button type='primary' onClick={handleCreateUserClick}>创建用户</Button>
  )
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '电话',
      dataIndex: 'phone'
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      render: formateDate
    },
    {
      title: '所属角色',
      dataIndex: 'role_id',
      render: (role_id) => (roles.find(role => role_id === role._id) || {}).name
      // 从roles中查找与用户中role_id属性相等的role,并取出name属性
    },
    {
      title: '操作',
      render: (user) => (
        <span>
          <LinkButton onClick={() => showUpdateUser(user)}>修改</LinkButton>
          <LinkButton onClick={() => deleteUser(user)}>删除</LinkButton>
        </span>
      ) 
    },
  ]
  return (
    <Form form={form}>
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={users}
          columns={columns}
          pagination={{defaultPageSize: 5, showQuickJumper: true}}
          >  
        </Table>
        <Modal
          title={saveUser? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={addOrUpdateUser}
          onCancel={handleCancel}
          >
            <AddUser saveUser={saveUser} roles={roles}>

            </AddUser>
        </Modal>
      </Card>
    </Form>
  )
}
