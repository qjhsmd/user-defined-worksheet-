/*
 * @Description: 
 * @Author: xionglaifu
 * @Date: 2020-05-18 11:10:16
 * @LastEditTime: 2020-06-11 11:16:07
 * @LastEditors: xionglaifu
 */
import Vue from 'vue'
import 'monaco-editor/min/vs/editor/editor.main.css'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/index.scss'
// import '../../../public/index.scss'

import App from './App.vue'
import router from '@/router'
import Tinymce from '@/components/tinymce'
import ElementUI from 'element-ui'


import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
const messages = {
  zh: {
    message: {
      hello: '好好学习，天天向上！'
    }
  },
  en: {
    message: {
      hello: 'good good study, day day up!'
    }
  }
}
const i18n = new VueI18n({

  locale: 'zh-CN',// 定义默认语言为中文?
  
  messages: {
  
  'zh-CN': require('./assets/languages/zh.js'),
  
  'en-US': require('./assets/languages/en.js')
  
   }
  
  });

// const i18n = new VueI18n({ 

//  locale: 'zh', // 定义默认语言为中文 

//  messages

// });

Vue.component('tinymce', Tinymce)
Vue.use(ElementUI)
Vue.config.productionTip = false

window.vm = new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')

