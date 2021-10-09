import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'
// const BASEURL = 'http://localhost:5000'
const BASEURL = ''
//登录
export const reqLogin = (username, password) => ajax(BASEURL + '/login', { username, password }, 'POST')
//添加用户
export const reqAddUser = (user) => ajax(BASEURL + '/manage/user/add', user, 'POST')
// jsonp请求天气信息
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=97c30bf2c5fb219a14a84b1184c8ff3b&output=json`;
        jsonp(url, {}, (err, data) => {
            // console.log('jsonp()', err, data);
            if(!err && data.status ==='1'){
                // console.log(data.lives[0]);
                const {province,weather} = data.lives[0]
                resolve({province,weather})
            }else{
                message.error('获取天气信息失败')
            }
        })
    })
}
//获取一级或某个二级分类列表
export const reqCatagory =(parentId) =>ajax(BASEURL + '/manage/category/list',{parentId})
//添加分类
export const reqAddCategory = (parentId,categoryName) =>ajax(BASEURL +'/manage/category/add',{parentId,categoryName},'POST')
//更新分类
export const reqUpdateCategory = (categoryId,categoryName) =>ajax(BASEURL + '/manage/category/update',{categoryId,categoryName},'POST')
//获取商品分页列表
export const reqProducts = (pageNum,pageSize) =>ajax(BASEURL+'/manage/product/list',{pageNum,pageSize})
//搜索商品分页列表
// searchType:搜索类型,productName/productDesc
export const reqSearchProduct = ({pageNum,pageSize,searchName,searchType})=>
ajax(BASEURL+'/manage/product/search',{pageNum,pageSize,[searchType]:searchName})
// 根据分类ID获取分类
export const reqCatagoryById = (categoryId) =>ajax('/manage/category/info',{categoryId})
//更新商品状态(上架/下架)
export const reqChangeStatus = (productId,status) =>ajax(BASEURL+'/manage/product/updateStatus',{productId,status},'POST')
// 删除图片
export const reqDeltePicture = (name) => ajax(BASEURL + '/manage/img/delete', {name}, 'POST')
// 添加或更新商品
export const reqAddorUpdateProduct = (product) => ajax(BASEURL + '/manage/product/' + (product._id ? 'update': 'add'), product, 'POST')/* 注意这里product本身就是一个对象，所以就不需要再加花括号 */