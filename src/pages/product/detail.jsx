import React, { Component } from 'react'
import LinkButton from '../../components/link-button'
import { reqCatagoryById } from '../../api/index'
import { Card, List } from 'antd'
import { BASE_IMG_URL } from '../../utils/constants';
import { ArrowLeftOutlined } from '@ant-design/icons'
const Item = List.Item
export default class Detail extends Component {
    state = {
        cName1: '',//一级分类名称
        cName2: '',//二级分类名称
    }
    async componentDidMount() {
        //得到当前商品的分类Id
        const { pCategoryId, categoryId } = this.props.location.state
        console.log(this.props.location.state);
        //一级分类下的商品
        if (pCategoryId === '0') {
            const result = await reqCatagoryById(categoryId)
            const cName1 = result.data.name
            this.setState({ cName1 })
            //二级分类下的商品
        } else {
            // const result1 = await reqCatagoryById(pCategoryId)
            // const result2 = await reqCatagoryById(categoryId)
            // const cName1 = result1.data.name
            // const cName2 = result2.data.name
            const result1 = await Promise.all([reqCatagoryById(pCategoryId), reqCatagoryById(categoryId)])
          console.log(result1);
            const cName1 = result1[0].data.name
            const cName2 = result1[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }
    render() {
        let { name, imgs, price, detail, desc } = this.props.location.state
        const { cName1, cName2 } = this.state
        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined style={{ paddingRight: 20 }} onClick={() => { this.props.history.goBack() }} />
                </LinkButton>

                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title}>
                <List >
                    <Item className='item'>
                        <span className='left'>商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>商品价格:</span>
                        <span>{price}</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>所属分类:</span>
                        <span>{cName1}{cName2 ? '-->' + cName2 : ''}</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>商品图片:</span>
                        <span>
                            {
                                imgs.map(img => (<img className='product-img' key={img} src={BASE_IMG_URL+img} alt='img'></img>))
                            }
                        </span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>商品详情:</span>
                        <span style={{display:'inline-block'}} dangerouslySetInnerHTML={{ __html: detail }}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
