import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const Option = Select.Option

export default class AddForm extends Component {
    formRef = React.createRef()
    static propTypes = {
        categoryList: PropTypes.array.isRequired, //一级分类的数组
        parentId: PropTypes.string.isRequired, //父分类Id
        setForm: PropTypes.func.isRequired, //父传子回调函数
    }

    handleChange = () => {
        // console.log(this.formRef.current.getFieldsValue());
        this.props.setForm(this.formRef.current)
    }
    render() {
        const { categoryList, parentId } = this.props
        return (

            <Form ref={this.formRef}>
                <Item name="parentId" initialValue={parentId}>
                    <Select>
                        <Option value="0">一级分类</Option>
                        {/* 一级分类的Id作为二级分类的父Id */}
                        {
                            categoryList.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Item>
                <Item rules={[{ required: true, message: '不允许为空' }]} name="categoryName" initialValue=''>
                    <Input placeholder="请输入分类名称" onChange={this.handleChange} ></Input>
                </Item>
            </Form>
        )
    }
}
