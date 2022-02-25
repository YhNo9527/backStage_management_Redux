import React from 'react'
import { Form, Input } from 'antd'

const Item = Form.Item
export default function UpdateForm(props) {
    const { category, getInputValue } = props
    const handleBlur = (event) => {
        const value = event.target.value
        getInputValue(value)
    }
  return (
      <>
          <Item name='category' 
                initialValue=''
                rules={[
                    {required: true,
                    message: '分类名称必须输入'}
                ]}>
              <Input 
              placeholder={category.name} 
              onBlur={(event) => handleBlur(event)}></Input>
          </Item>
      </>
  )
}
