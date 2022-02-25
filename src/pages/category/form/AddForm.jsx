import React from 'react'
import { Form,
        Select,
        Input } from 'antd'

const Item = Form.Item
const Option = Select.Option

export default function AddForm(props) {
  const {categorys, parentId} = props

  return (
      <>
          <span>所属分类:</span>
          <Item 
            name='parentId' 
            initialValue={parentId} 
            key='parentId'>
            <Select >
                <Option value='0'>一级分类列表</Option>
                {
                  categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                }
            </Select>
          </Item>
          <span>分类名称:</span>
          <Item 
            name='categoryName' 
            initialValue='' 
            key='categoryName'
            rules={[
              {required: true,
              message: '分类名称必须输入'}
            ]}>
            <Input placeholder='请输入分类名称'></Input>
          </Item>
      </>
  )
}
