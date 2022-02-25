import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { 
  Card,
  Button,
  Table,
  Modal,
  Form,
  message
} from 'antd'
import { reqRoles, reqAddRole, reqUpdateRole } from './../../api'
import AddRole from './AddRole'
import AuthRole from './AuthRole'
import { formateDate } from '../../utils/dataUtils'
import { logout } from '../../redux/actions'

/* 角色管理路由 */

function Role(props) {
  const { user } = props
  const [form] = Form.useForm()
  const [roles, setRoles] = useState([])  // 所有角色的列表
  const [role, setRole] = useState({})  // 选中的角色
  const [isShowAdd, setIsShowAdd] = useState(false) // 是否显示添加角色界面
  const [isShowAuth, setIsShowAuth] = useState(false) // 是否显示设置权限界面

  const auth = useRef()

  const getRoles = async () => {
    const result = await reqRoles()
    if(result.status === 0) {
      const roles = result.data
      setRoles(roles)
    }
  }
  const addRole = () => {
    // 进行表单验证，通过后执行下面操作
    form.validateFields().then(async () => {
      // 搜集输入数据
      const { roleName } = form.getFieldsValue()
      
      // 发送请求添加
      const result = await reqAddRole(roleName)
      if(result.status === 0) {
        // 隐藏确认框
        setIsShowAdd(false)
        // 清除form表单中缓存的数据
        form.resetFields()
        // 根据结果提示/更新列表显示
        message.success('添加角色成功')
        // 重新展示角色列表
        getRoles()
      } else {
        message.error('添加角色失败')
      }
    })
  }


  const authRole = async () => {
    // 获取子组件中最新的roleMenus
    const menus = auth.current.getMenus()
    role.menus = menus
    role.auth_name = user.username
    const result = await reqUpdateRole(role)
    if(result.status === 0) {
      // 如果当前更新的是自己角色的权限，强制退出
      if(role._id === user.role_id) {
        message.warn('当前角色权限已更新,请重新登陆')
        props.logout()
      } else {
        message.success('设置权限成功')
        setIsShowAuth(false)
        // 重新展示角色列表
        getRoles()
      }
    } else {
      message.error('设置角色权限失败')
    }
  }


  const handleAddCancel = () => {
    // 隐藏弹窗
    setIsShowAdd(false)
  }
  const handleAuthCancel = () => {
    // 隐藏弹窗
    setIsShowAuth(false)
    // 重置form中数据缓存
    form.resetFields()
  }

  useEffect(() => {
    getRoles()
  }, [])

  const title = (
    <span>
      <Button 
        type='primary' 
        style={{marginRight: 20}}
        onClick={() => {setIsShowAdd(true)}}>创建角色</Button>
      <Button 
        type='primary' 
        disabled={!role._id}
        onClick={() => {setIsShowAuth(true)}}>设置角色权限</Button>
    </span>
  )

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name'
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      render: formateDate
    },
    {
      title: '授权时间',
      dataIndex: 'auth_time',
      render: formateDate
    },
    {
      title: '授权人',
      dataIndex: 'auth_name'
    },
  ]

  return (
    <Form form={form}>
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={columns}
          pagination={{defaultPageSize: 5}}
          rowSelection={{
              type: 'radio', 
              selectedRowKeys: [role._id],
              onSelect: (role) => {  // 选择某个radio 的回调
                setRole(role)
              }
            }}
          onRow={record => {
            return { 
              onClick: event => {
                setRole(record)
            }}
          }}
          >
        </Table>
        <Modal 
          title='添加角色'
          visible={isShowAdd}
          onOk={addRole}
          onCancel={handleAddCancel}
          >
            <AddRole>

            </AddRole>
        </Modal>
        <Modal 
          title='设置角色权限'
          visible={isShowAuth}
          onOk={authRole}
          onCancel={handleAuthCancel}
          >
            <AuthRole role={role} ref={auth}>

            </AuthRole>
        </Modal>
      </Card>
    </Form>
  )
}

export default connect(
  state => (
    {
      user: state.user
    }
  ),{ logout }
)(Role)
