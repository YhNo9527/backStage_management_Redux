import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
    Card,
    Form,
    Input,
    Cascader,
    Button,
    message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '../../components/linkButton/LinkButton'
import { reqAddOrUpdateProduct, reqCategorys } from './../../api/index'
import PicturesWall from './PictureWall'
import RichTextEditor from './RichTextEditor';


/* 
product的添加/更新的子路由组件
*/


const { Item } = Form

const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    xs: { span: 2 },
    sm: { span: 2 }
  },
  wrapperCol: { 
    xs: { span: 8 },
    sm: { span: 8 }
  }
}

export default function ProductAddUpdate() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()

  const [options, setOptions] = useState([]) // 级联列表数组
  const pw = useRef()
  const editor = useRef()

  // componentWillMount
  /* 
    父路由组件中，只在修改按钮上使用navigate方法传递了product，添加商品的按钮上没有传递参数，故当product有值时，代表标题要显示为修改商品，没有值，代表要显示为添加商品
   */
  const product = location.state

  // 定义新product， 提供给form组件用作初始值，考虑到原始product可能没有值，故定义新的product
  const newProduct = product || {}
  const { pCategoryId, categoryId, imgs, detail } = newProduct

  // 接收级联分类Id的数组
  const categoryIds = []
  if(product) {
    // 商品是一个一级分类的商品
    if(pCategoryId==='0') {
      categoryIds.push(categoryId)
    } else {
      // 商品是一个二级分类的商品
      categoryIds.push(pCategoryId)
      categoryIds.push(categoryId)
    }
  }


  const onFinish = (value) => {
    // 进行表单验证
    form.validateFields().then(async () => {
      const imgs = pw.current.getImgs()
      const detail = editor.current.getDetail()

      // 收集数据,并封装成product对象
      const { name, desc, price, categoryIds } = value
      let pCategoryId, categoryId
      if(categoryIds.length === 1) {
        pCategoryId = '0'
        categoryId = categoryIds[0]
      } else {
        pCategoryId = categoryIds[0]
        categoryId = categoryIds[1]
      }

      // 完整提交的product对象
      const fullProduct = { name, desc, price, detail, imgs,pCategoryId, categoryId }

      // 如果是更新, 需要添加_id
      if(product) {
        fullProduct._id = product._id
      }

      // 调用接口请求函数添加/更新
      const result = await reqAddOrUpdateProduct(fullProduct)

      // 结果提示
      if(result.status === 0) {
        message.success(`${product? '更新' : '添加'}商品成功`)
        navigate(-1, {replace:true})
      } else {
        message.error(`${product? '更新' : '添加'}商品失败`)
      }
    })
  }

  const initOptions = async (categorys) => {
    // 根据categorys生成新的option数组
    const options = categorys.map((c) => ({
      value: c._id,
      label: c.name,
      isLeaf: false
    }))

    // 如果是一个二级分类商品的更新
    if(product && pCategoryId !== '0') {
      // 获取对应的二级分类列表
      const subCategorys = await getCategorys(pCategoryId)
      // 生成二级级联列表options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId)
      // 关联到对应的一级option上
      targetOption.children = childOptions
    }
    // 更新options状态
    setOptions(options)
  }


  // 异步获取一级/二级分类列表
  const getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if(result.status === 0) {
      const categorys = result.data
      // 如果是一级分类列表
      if(parentId === 0) {
        initOptions(categorys)
      } else { // 二级列表
        return categorys  // 返回二级列表 => 当前async函数返回的promise成功，且值为categorys
      }
    }
  }

  // 加载下一级列表的回调函数
  const loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // 根据选中的分类，请求获取二级分类列表
    const subCategorys = await getCategorys(targetOption.value)
    if(subCategorys && subCategorys.length > 0) {
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 关联到当前option上
      targetOption.children = childOptions
    } else { // 当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }

    setOptions([...options])
  }


  const title = (
    <span>
      <LinkButton onClick={() => navigate(-1)}>
        <ArrowLeftOutlined />
      </LinkButton>
      <span>{product? '修改商品信息' : '添加商品'}</span>
    </span>
  )

  // componentDidMount
  useEffect(() => {
    getCategorys(0)
  }, [])

  return (
    <Card title={title}>
      <Form {...formItemLayout} form={form} onFinish={onFinish}>
        <Item 
            label='商品名称' 
            name='name'
            initialValue={newProduct.name}
            rules={[{required: true, message: '商品名称不能为空'}]}>
          <Input placeholder='商品名称'></Input>
        </Item>
        <Item 
            label='商品描述'
            name='desc'
            initialValue={newProduct.desc}
            rules={[{required: true, message: '商品描述不能为空'}]}>
          <TextArea placeholder='商品描述' autoSize={{minRows:2}}></TextArea>
        </Item>
        <Item 
            label='商品价格'
            name='price'
            initialValue={newProduct.price}
            rules={[
              {required: true, message: '商品价格不能为空'},
              () => ({
                // 自定义验证
                validator(_, value) {
                  if(value * 1 >= 0) {
                    return Promise.resolve()
                  }
                  
                  return Promise.reject(new Error('商品价格不能小于0'))
                }
              })
            ]}
            >
          <Input type='number' placeholder='商品价格' addonAfter='元'></Input>
        </Item>
        <Item 
            label='商品分类'
            name='categoryIds'
            initialValue={categoryIds}
            rules={[
              {required: true, message: '必须指定商品分类'}
            ]}
            >
          <Cascader
            options={options}  // 需要显示的列表数据  
            loadData={loadData}   // 当选择某个列表项，加载下一级列表的监听回调
            >
          </Cascader>
        </Item>
        <Item label='商品图片'>
          <PicturesWall imgs={imgs} ref={pw}></PicturesWall>
        </Item>
        <Item label='商品详情' labelCol={{span: 2}} wrapperCol={{span: 20}}>
          <RichTextEditor ref={editor} detail={detail}></RichTextEditor>
        </Item>
        <Item>
          <Button type='primary' htmlType='submit' className='addProduct-form-button'>提交</Button>
        </Item>
      </Form>
    </Card>
  )
}
