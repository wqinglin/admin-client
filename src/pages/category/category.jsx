import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd';
import LinkButton from '../../components/link-button'
import { reqCatagory, reqAddCategory, reqUpdateCategory } from '../../api/index'
import { PlusSquareOutlined, ArrowRightOutlined } from '@ant-design/icons'
import './category.less'
import AddForm from './add-form'
import UpdateForm from './update-form'
export default class Category extends Component {
    state = {
        loading: false,//是否正在获取数据
        categoryList: [],//一级分类列表
        subCategoryList: [], //二级分类列表
        parentId: '0', //当前需要显示的父分类id
        parentName: '',//当前需要显示的父分类名称
        ModalVisible: 0 //标识添加或更新的确认确认框是否显示 0-都不显示  1-添加 2-更新  
    }

    //分情况获取一级或二级分类列表数据
    getCategoryList = async () => {
        // 发请求前,显示loading
        this.setState({ loading: true })
        const parentId = this.state.parentId
        //获取一级分类列表数据
        const result = await reqCatagory(parentId)
        //请求完成,隐藏loading
        this.setState({ loading: false })
        //可能是一级分类列表也可能是二级分类列表
        const categoryList = result.data
        if (result.status === 0) {
            if (parentId === '0') {
                this.setState({ categoryList })
            } else {
                this.setState({ subCategoryList: categoryList })
            }
        } else {
            message.error('获取分类列表数据失败')
        }
    }
    //获取二级分类列表数据
    getSubCategoryList = (categoryList) => {
        // console.log('++++', categoryList);
        return () => {
            this.setState({
                parentId: categoryList._id,
                parentName: categoryList.name
            }, () => { //在状态更新且重新render()后执行
                console.log("--", this.state.parentId); //'615145e7f4bb492fc89f1b7b'
                //获取二级分类列表
                this.getCategoryList()
            })
            //setState() 不能立即获取最新的状态，因为setState是异步更新状态的
            // console.log("--", this.state.parentId); //'0'

        }
    }

    //显示一级分类列表数据
    showFirstCategoryList = () => {
        //更新为显示一级列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategoryList: []
        })
    }
    //显示添加模态框
    showAddModel = () => {
        this.setState({
            ModalVisible: 1
        })
    }
    // 显示更新模态框
    showUpdateModel = (category) => {
        this.categoryOne = category
        //更新状态
        this.setState({
            ModalVisible: 2
        })
    }

    //模态框确认按钮
    addCategory = async () => {
        this.setState({
            ModalVisible: 0
        })
        const { parentId, categoryName } = this.addform
        console.log(parentId,categoryName);
        //收集数据,添加分类请求
        const result = await reqAddCategory(parentId, categoryName)
        console.log('**',result);
        // if (result.status === 0) {
        //     //添加的分类就是当前分类列表下的分类
        //     if (parentId === this.state.parentId)
        //         this.getCategoryList()
        //     //在二级分类列表下添加一级列表,重新获取一级列表，但是不需要显示
        // } else if (parentId === 0) {
        //     this.getCategoryList('0')
        // }

        //重新获取分类列表显示
    }
    //关闭模态框
    handleCancel = () => {
        //清除输入数据
        // 隐藏确认
        this.setState({
            ModalVisible: 0
        })
    }
    // 更新分类模态框
    updateCategory = async () => {
        //1.隐藏确认框
        this.setState({
            ModalVisible: 0
        })
        //准备数据
        const categoryId = this.categoryOne._id
        const categoryName = this.updateform.getFieldValue('categoryName')
        //2.发送请求更新分类
        const result = await reqUpdateCategory(categoryId, categoryName)
        if (result.status === 0) {
            //3.重新定义列表
            this.getCategoryList()
        }

    }
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name', //显示数据对应的属性名
                key: 'name',
            },
            {
                title: '操作',
                width: 400,
                render: (categoryList) => ( //返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={() => this.showUpdateModel(categoryList)}>修改分类</LinkButton>
                        {
                            this.state.parentId === '0' ?
                                <LinkButton onClick={this.getSubCategoryList(categoryList)}>查看子分类</LinkButton> : null
                        }
                    </span>
                )
            }
        ];
    }

    //为第一次render准备数据
    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    //此钩子执行异步任务
    componentDidMount() {
        //获取一级分类列表
        this.getCategoryList()
    }
    render() {
        const { parentId, parentName, categoryList, subCategoryList, loading, ModalVisible } = this.state
        const categoryOne = this.categoryOne || {} //如果还没有指定一个空对象
        const title = parentId === '0' ? '一级分类列表' :
            (<span>
                <LinkButton onClick={this.showFirstCategoryList}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{ fontSize: "15px", padding: "0 10px" }} />
                <span>{parentName}</span>
            </span>)

        const extra = (
            <Button type='primary' icon={<PlusSquareOutlined />} onClick={this.showAddModel}>添加</Button>
        )
        return (
            <div>
                <Card title={title} extra={extra} className='card'>
                    <Table rowKey='_id' dataSource={parentId === '0' ? categoryList : subCategoryList} columns={this.columns} bordered
                        pagination={{ defaultPageSize: 5, showQuickJumper: true, loading: { loading } }} />
                </Card>

                <Modal title="添加分类" visible={ModalVisible === 1} onOk={this.addCategory} onCancel={this.handleCancel} destroyOnClose={true}>
                    <AddForm categoryList={categoryList} parentId={parentId} setForm={form => this.addform = form}></AddForm>
                </Modal>

                <Modal title="更新分类" destroyOnClose={true} visible={ModalVisible === 2} onOk={this.updateCategory} onCancel={this.handleCancel}>
                    <UpdateForm categoryName={categoryOne} setForm={form => this.updateform = form}></UpdateForm>
                </Modal>
            </div>
        )
    }
}
