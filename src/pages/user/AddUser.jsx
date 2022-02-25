import React from 'react'
import { Form,
         Input,
         Select } from 'antd'

const Item = Form.Item
const Option = Select.Option

export default function AddUser(props) {
  const { roles, saveUser } = props
  // 由于创建角色是没有user值,user的值可能有也可能没有,所以创建新的user对象
  const newUser = saveUser || {}

  return (
      <>
          <Item
            name='username'
            label='用户名'
            initialValue={newUser.username}
            key='username'
            rules={[
              {required: true,
               message: '角色名称必须输入'}
            ]}>
            <Input placeholder='请输入角色名称'></Input>
          </Item>
          {
            // 空对象做判断条件时 为真 与布尔值比较时 为假
            newUser._id ? null : 
            (<Item
              name='password'
              label='密码'
              initialValue='' 
              key='password'
              rules={[
                {required: true,
                 message: '密码必须输入'}
              ]}>
              <Input type='password' placeholder='请输入密码'></Input>
            </Item>)
          }
          <Item
            name='phone'
            label='手机号'
            initialValue={newUser.phone} 
            key='phone'
            rules={[
              {required: true,
               message: '手机号必须输入'}
            ]}>
            <Input placeholder='请输入手机号'></Input>
          </Item>
          <Item
            name='email'
            label='邮箱'
            initialValue={newUser.email}
            key='email'
            rules={[
              {required: true,
               message: '邮箱必须输入'}
            ]}>
            <Input placeholder='请输入邮箱'></Input>
          </Item>
          <Item
            name='role_id'
            label='角色'
            initialValue={newUser.role_id}
            key='role_id'
            rules={[
              {required: true,
               message: '邮箱必须输入'}
            ]}>
            <Select>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
            </Select>
          </Item>
      </>
  )
}
