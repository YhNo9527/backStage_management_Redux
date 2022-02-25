import React from 'react'
import { Form,
         Input } from 'antd'

const Item = Form.Item

export default function AddRole() {

  return (
      <>
          <Item
            name='roleName'
            label='角色名称'
            initialValue='' 
            key='roleName'
            rules={[
              {required: true,
               message: '角色名称必须输入'}
            ]}>
            <Input placeholder='请输入角色名称'></Input>
          </Item>
      </>
  )
}
