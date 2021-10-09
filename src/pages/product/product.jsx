import React, { Component } from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import Home from './home'
import Detail from './detail'
import AddUpdate from './add-update'
import './product.less'

export default class Product extends Component {
    render() {
        return (
            <Switch>
               <Route path='/product/product' component = {Home} exact></Route>
               <Route path='/product/product/detail' component ={Detail}></Route>
               <Route path='/product/product/addupdate' component={AddUpdate}></Route>
              <Redirect to='/product/product'></Redirect>
            </Switch>
        )
    }
}
