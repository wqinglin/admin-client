import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

//读取本地中保存的user,保存到内存中
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'
//为什么要读取本地中保存的user,保存到内存中？？？
//1.在内存中读取更快，2.页面刷新内容不丢失     
const user = storageUtils.getUser()
memoryUtils.user  = user
ReactDOM.render(
	<BrowserRouter>
		<App/>
	</BrowserRouter>,
	document.getElementById('root')
)
   
  


 