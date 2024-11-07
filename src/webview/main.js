/*
 * @Author: zyg0121 zhouyiguo2012@qq.com
 * @Date: 2024-11-07 17:33:48
 * @LastEditors: zyg0121 zhouyiguo2012@qq.com
 * @LastEditTime: 2024-11-07 17:33:55
 * @FilePath: \vueagile\src\webview\main.js
 * @Description: 
 * 
 * Copyright (c) 2024 by yiguo, All Rights Reserved. 
 */
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';

const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');
