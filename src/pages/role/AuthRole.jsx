import React, { Component } from 'react'
import { Form,
         Input,
         Tree } from 'antd'
import menuList from '../../config/menuConfig'


const Item = Form.Item
export default class AuthRole extends Component {
    constructor(props) {
        super(props)
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }
    
    getMenus = () => this.state.checkedKeys

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                {
                    title: item.title,
                    key: item.key,
                    children: item.children ? this.getTreeNodes(item.children) : null
                }
            )
            return pre
        } ,[])
    }

    onCheck = (checkedKeys) => {
        this.setState({checkedKeys})
    }

    componentDidUpdate(preProps) {
        if(this.props.role !== preProps.role) {
            this.setState(
                {checkedKeys: this.props.role.menus}
            )
        }
    }

  render() {
      const { role } = this.props
      const { checkedKeys } = this.state
      const treeData = this.getTreeNodes(menuList)
    return (
        <>
            <Item
                name='roleName'
                label='角色名称'
                >
                <Input placeholder={role.name} disabled></Input>
            </Item>
            <Item>
                <b>平台权限:</b>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                    treeData={treeData}
                    />
            </Item>
        </>
    )
  }
}

