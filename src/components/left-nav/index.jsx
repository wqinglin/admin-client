import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import menuList from '../../config/menuCofig'

import './index.less'

import { Menu } from 'antd'
const { SubMenu } = Menu;


class LeftNav extends Component {
    //map()+递归调用 
    // getMenuNodes = (menuList) => {
    //     return menuList.map(item => {
    //         if (!item.children) {
    //             return (
    //                 <Menu.Item key={item.key} icon={item.icon}>
    //                     <Link to={item.key}>
    //                         {item.title}
    //                     </Link>
    //                 </Menu.Item>
    //             )
    //         } else {
    //             return (
    //                 <SubMenu key={item.key} icon={item.icon} title={item.title}>
    //                     {this.getMenuNodes(item.children)}
    //                 </SubMenu>
    //             )
    //         }
    //     })
    // }

    // reduce()+递归调用
    getMenuNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            if (!item.children) {
                pre.push((
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>
                            {item.title}
                        </Link>
                    </Menu.Item>
                ))
            } else {
                const path = this.props.location.pathname
                //查找一个与当前路径匹配的子cItem
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                //如果存在，说明当前Item的子列表需要打开
                if (cItem) {
                    this.openKeys = item.key
                }

                pre.push((
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))
            }
            return pre
        }, [])
    }
    UNSAFE_componentWillMount() {
        this.MenuNodes = this.getMenuNodes(menuList)
    }

    render() {
        //得到当前请求的路由路径
        let path = this.props.location.pathname
        //当前请求的是商品或子路由的路径
        if (path.indexOf('/product/product') === 0) {
            path = '/product/product'
        }
        const openKeys = this.openKeys
        return (
            <div className="left-nav">
                <Link className="logo" to='/' >
                    <img src="../../images/favicon.ico" alt="" />
                    <div className='title'>后台管理系统</div>
                </Link>
                <Menu
                    defaultOpenKeys={[openKeys]}
                    selectedKeys={[path]}
                    mode="inline"
                    theme="dark"
                >
                    {
                        this.MenuNodes
                    }
                </Menu>
            </div>
        )
    }
}
export default withRouter(LeftNav)