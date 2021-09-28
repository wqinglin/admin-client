//  添加分类的form组件
/* 一些路由组件独有的非路由组件也可以放到pages文件夹的对应路由组件文件夹下 */
/* 不一定非要放在components文件夹下 */

import React, { Component } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';

class UpdateCategory extends Component {
    static propTypes = {
        categoryName: PropTypes.object.isRequired,
        setForm: PropTypes.func.isRequired,
    }
    formRef = React.createRef()
    handleChange = () => {
        // console.log('正在输入框改变的categoryName', this.formRef.current.getFieldValue('categoryName'))
        this.props.setForm(this.formRef.current)
    }
   

    render() {
        const { categoryName: { name } } = this.props
        return (
            <Form ref={this.formRef}>
                <Form.Item
                    name='categoryName'
                    initialValue={name}
                    rules={[
                        {
                            required: true,
                            message: '请输入需要修改分类的名称!'
                        },
                    ]}
                >
                    <Input
                        onChange={this.handleChange}
                        placeholder='请输入分类名称'
                    ></Input>
                </Form.Item>
            </Form>
        )
    }
}

export default UpdateCategory;