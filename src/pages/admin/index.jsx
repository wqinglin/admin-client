import React, { Component } from 'react'
import { Redirect,Route,Switch } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import { Layout } from 'antd'

import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../chart/bar'
import Line from '../chart/line'
import Pie from '../chart/pie'
const { Footer, Sider, Content } = Layout;


export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        // console.log(user);
        //没有登陆
        //如果内存中没有user,说明用户没有登陆
        if (!user || !user._id) {
            return <Redirect to='/login'></Redirect>
        }

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider>
                    <LeftNav></LeftNav>
                </Sider>
                <Layout>
                    <Header></Header>
                    <Content style={{margin:'15px',backgroundColor:'#fff'}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/product/category' component={Category}/>
                            <Route path='/product/product' component={Product}/>
                            <Route path='/user' component={User}/>
                            <Route path='/role' component={Role}/>
                            <Route path="/chart/bar" component={Bar}/>
                            <Route path="/chart/pie" component={Pie}/>
                            <Route path="/chart/line" component={Line}/>
                            <Redirect to ='/home'></Redirect>
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', backgroundColor: '#fff' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        )
    }
}
