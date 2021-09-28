import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { reqWeather } from '../../api/index'
import menuList from '../../config/menuCofig'
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'
import { momentFormat } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import './index.less'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

class Header extends Component {
    state = {
        currentTime: momentFormat(Date.now()),
        province: '',
        weather: ''
    }
    //第一次render之后执行一次
    //时间
    getTime = () => {
        this.IntervalId = setInterval(() => {
            const currentTime = momentFormat(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }
    //天气
    getWeather = async () => {
        const { province, weather } = await reqWeather(110101)
        // console.log(province, weather);
        this.setState({ province, weather })
    }
    //标题
    getTitle = () => {
        const path = this.props.location.pathname;
        let title
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => cItem.key === path)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }
    loginOut = () => {
        confirm({
            title: '确定要退出登录吗?',
            icon: <ExclamationCircleOutlined />,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                //   console.log('确定');
                storageUtils.removeUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')
            }
        });
    }

    // 发送ajax请求和启动定时器
    componentDidMount() {
        this.getTime();
        this.getWeather();
    }
    componentWillUnmount() {
        clearInterval(this.IntervalId)
    }
    render() {
        const { currentTime, province, weather } = this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()
        return (
            <div className="site-layout-background" >
                <div className="titlename">{title}</div>
                <div className='climate'>
                    <span className='far'>{province}</span>
                    <span className='far'>{weather}</span>
                    <span className='far'>{currentTime}</span>
                    {/* <div className='user-login'>欢迎！{username} <a href="#" onClick={this.loginOut}>退出</a></div> */}
                    <div className='user-login'>欢迎！{username} <LinkButton onClick={this.loginOut}>退出</LinkButton></div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)