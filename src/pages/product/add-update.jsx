import React, { Component } from 'react'
import PicturesWall from './picture-wall'
import RichTextEditor from './rich-text-editor';
import { Form, Card, Input, Cascader, Button, message } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCatagory, reqAddorUpdateProduct } from '../../api/index'

import { ArrowLeftOutlined } from '@ant-design/icons'
const { Item } = Form
const { TextArea } = Input
export default class AddUpdate extends Component {
    //product可能有，也可能没有，如果是添加没值，否则有值
    product = this.props.location.state
    state = {
        options: [],
        //保存一个是否是更新的标识
        isUpdate: !!this.product,
        product: this.product || {}
    }
    myref = React.createRef()
    imgs = React.createRef()
    editor = React.createRef()
    submit = async () => {
        const imgs = this.imgs.current.getImgs()
        const detail = this.editor.current.getHtmlValue()
        // console.log(detail);
        const { name, desc, price, categoryIds } = this.myref.current.getFieldsValue()
        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
            pCategoryId = '0'
            categoryId = categoryIds[0]
        } else {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        // console.log(pCategoryId,categoryId);
        const product = { name, desc, price, pCategoryId, imgs, detail, categoryId }
        if (this.state.isUpdate) {/* 如果是更新商品，需要添加_id */
            product._id = this.state.product._id
        }
        // 2.调用接口请求函数去添加/更新
        // console.log(product);
        const result = await reqAddorUpdateProduct(product)

        // console.log(result);
        // 3. 根据结果提示
        if (result.status === 0) {
            message.success(`${this.state.isUpdate ? '更新' : '添加'}商品成功！`)
            this.props.history.goBack()
        } else {
            message.error(`${this.state.isUpdate ? '更新' : '添加'}商品失败！`)
        }

    }
    //自定义验证价格函数
    validatePrice = async (_, value) => {
        if (value * 1 < 0) {
            message.error('价格必须大于0')
        }
    }
    //可以获取一级或二级列表
    getCategorys = async (parentId) => {
        const result = await reqCatagory(parentId)
        // console.log(result);
        if (result.status === 0) {
            const categorys = result.data
            //如果是一级分类列表
            if (parentId === '0') {
                this.initOptions(categorys)
            } else {
                //返回二级列表
                return categorys
            }

        }
    }

    initOptions = async (categorys) => {
        //根据category生成option数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,//不确定是否是叶子
        }))
        // 如果是一个二级分类商品的更新
        const { isUpdate, product } = this.state
        const { pCategoryId } = product
        // console.log(categoryId);
        if (isUpdate && pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            // console.log(subCategorys);
            // 生成一个二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            //找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)
            //找到当前商品对应的一级option对象
            targetOption.children = childOptions
        }
        //更新options状态
        this.setState({
            options
        })
    }
    loadData = async selectedOptions => {
        // 得到选择的option对象
        const targetOption = selectedOptions[0]
        // 显示loading
        targetOption.loading = true

        // 根据选中的分类, 请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        // 隐藏loading
        targetOption.loading = false
        // 二级分类数组有数据
        if (subCategorys && subCategorys.length > 0) {
            // 生成一个二级列表的options
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

        // 更新options状态
        this.setState({
            options: [...this.state.options],
        })
    }

    componentDidMount() {
        this.getCategorys('0')
    }
    render() {
        const { isUpdate, product } = this.state
        const { categoryId, pCategoryId, imgs, detail } = product
        //用来接受级联分类ID的数组
        const categoryIds = []
        if (isUpdate) {
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)

            }
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{ paddingRight: 20 }} />
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        const formItemLayout = {
            labelCol: {
                sm: {
                    span: 2
                }
            },
            wrapperCol: {
                sm: {
                    span: 8
                },
            },
        }
        return (
            <Card title={title}>
                <Form {...formItemLayout} ref={this.myref}>
                    
             
                    <Item name='name' label='商品名称' initialValue={product.name} rules={[{ required: true, message: '不允许为空' }]}>
                        <Input placeholder='请输入商品名称'></Input>
                    </Item>
                    <Item name='desc' label='商品描述' initialValue={product.desc} rules={[{ required: true, message: '不允许为空' }]}>
                        <TextArea autoSize={{ minRows: 3, maxRows: 6 }} placeholder="请输入商品描述"></TextArea>
                    </Item>
                    <Item name='price' label='商品价格' initialValue={product.price} rules={[{ required: true, message: '不允许为空' }, { validator: this.validatePrice }]}>
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元'></Input>
                    </Item>
                    <Item name='categoryIds' label='商品分类' initialValue={categoryIds} rules={[{ required: true, message: '不允许为空' }]}>
                        <Cascader
                            placeholder='请指定商品分类'
                            options={this.state.options}  /*需要显示的列表数据数组*/
                            loadData={this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                        />
                    </Item>
                    <Item name='imgs' label='商品图片'>
                        <PicturesWall ref={this.imgs} imgs={imgs}></PicturesWall>
                    </Item>
                    <Item name='detail'
                        initialValue={detail}
                        label='商品详情:'
                        labelCol={{ span: 2 }} //左侧的名称所占栅格数，总栅格数为24
                        wrapperCol={{ span: 17 }} //右侧的表单输入控件所占栅格数，总栅格数为24
                    >
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>添加</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
