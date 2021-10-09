import React, { Component } from 'react'
import LinkButton from '../../components/link-button'
import { PlusSquareOutlined } from '@ant-design/icons'
import { reqProducts, reqSearchProduct, reqChangeStatus } from '../../api/index'
import { PAGE_SIZE } from '../../utils/constants'
import { Card, Select, Input, Button, Table, Form, message } from 'antd'

const Option = Select.Option
const Item = Form.Item
export default class Home extends Component {
    state = {
        total: 0,
        products: [], //商品数组
        loading: false,
        searchName: '',//搜索的关键字
        searchType: 'productName' //搜索类型
    }

    //初始化table的列数组
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                width: 150,
                //当前指定了对应的属性，传入的是对应的属性值
                render: price => '¥' + price
            },
            {
                title: '状态',
                width: 100,
                // dataIndex: 'status',
                render: products => {
                    const { status, _id } = products
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button type='primary' onClick={() => { this.alterStatus(_id, newStatus) }}>
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span> {status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width: 150,
                render: (products) => {
                    return (
                        <span>
                            {/* 将product对象使用state传递给目标路由组件 */}
                            <LinkButton onClick={() => this.props.history.push('/product/product/detail', products)}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/product/addupdate', products)}>修改</LinkButton>
                        </span>
                    )

                }
            },
        ]
    }
    getProducts = async (pageNum) => {
        this.pageNum = pageNum //保存pageNum，让其他方法可以看到
        //显示loading
        this.setState({
            loading: true
        })
        //如果搜索关键字有值，进行搜索分页
        let result
        const { searchName, searchType } = this.state
        if (searchName) {
            console.log(searchName, searchType);
            result = await reqSearchProduct({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        // console.log(result);
        //隐藏loading
        this.setState({
            loading: false
        })
        if (result.status === 0) {
            const { total, list } = result.data
            this.setState({
                total,
                products: list
            })
        }
    }
    //修改状态
    changeStatus = (value) => {
        this.setState({
            searchType: value
        })
    }
    //搜索关键字
    searchKeys = (e) => {
        this.setState({
            searchName: e.target.value
        })
    }
    //更新上下价状态
    alterStatus = async (productId, status) => {
        const result = await reqChangeStatus(productId, status)
        if (result.status === 0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }
    UNSAFE_componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getProducts(1)
    }
    render() {
        const { products, total, loading, searchName, searchType } = this.state

        const title = (
            <Form style={{ display: 'flex', position: 'absolute', top: 16 }}>
                <Item>
                    <Select style={{ width: 120 }} value={searchType} onChange={this.changeStatus}>
                        <Option value='productName'>按名称搜索</Option>
                        <Option value='productDesc'>按描述搜索</Option>
                    </Select>
                </Item>
                <Item>
                    <Input placeholder="请输入关键字" onChange={this.searchKeys} name='searchName' style={{ width: 200, margin: '0 10px' }} value={searchName}></Input>
                </Item>
                <Item>
                    <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
                </Item>

            </Form>
        )
        const extra = (
            <Button type='primary' icon={<PlusSquareOutlined />} onClick={() => { this.props.history.push('/product/product/addupdate') }}>添加商品</Button>
        )
        return (
            <Card title={title} extra={extra} className="card">
                <Table dataSource={products} columns={this.columns} bordered rowKey='_id'
                    loading={loading}
                    pagination={{
                        defaultPageSize: PAGE_SIZE, showQuickJumper: true, total,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}
