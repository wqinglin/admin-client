import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { reqLogin } from '../../api/index'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './login.less'

const Item = Form.Item  //不能写在import之前

export default class Login extends Component {
    formRef = React.createRef();
    validatePwd = async (rule, value) => {
        if (!value) {
            throw new Error('密码不能为空');
        } else if (value.length < 4) {
            throw new Error('密码至多4位');
        } else if (value.length > 12) {
            throw new Error('密码至多12位');
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            throw new Error('密码必须需是英文，数字或下划线组成');
        }
    }
    // onFinish = () => {
    //     console.log(this.formRef.current);
    //     this.formRef.current.validateFields()
    //         .then((values) => {
    //             const {username,password} = values
    //             reqLogin(username,password).then(response =>{
    //                 console.log('成功了',response.data);
    //             })
    //         }).catch((error) => {
    //             console.log(error)
    //         })
    // }
    onFinish = async () => {
        const { username, password } = await this.formRef.current.validateFields()
        const result = await reqLogin(username, password)
        // console.log('成功了', result);
        const user = result.data
        memoryUtils.user = user //保存在内存中
        storageUtils.saveUser(user)//保存在本地中
        if (result.status === 0) { //登陆成功
            message.success('登陆成功')
            this.props.history.replace('/')
        } else { //登陆失败
            message.error(result.msg)
        }

    }
    render() {
        //已经登录
        //如果用户已经登录，跳转至管理界面
        const user = memoryUtils.user
        if (user && user._id) {
            return <Redirect to='/'></Redirect>
        }
        return (
            <div className="login">
                <div className="login-content">
                    <div className="login-title">后台管理系统</div>
                    <Form
                        name="normal_login"
                        className="login-form"
                        onFinish={this.onFinish}
                        ref={this.formRef}
                    >
                        <Item
                            name="username"
                            className="FormItem"
                            //声明式验证：直接使用别人定义好的验证规则进行验证
                            rules={[
                                { required: true, message: '用户名不能为空' },
                                { min: 4, message: '用户名至少4位' },
                                { max: 12, message: '用户名至多12位' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须需是英文，数字或下划线组成' },
                            ]}
                            initialValue="admin"
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Item>
                        <Form.Item
                            name="password"
                            className="FormItem"
                            initialValue="admin"
                            rules={[{ validator: this.validatePwd }]}>
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>

                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}
