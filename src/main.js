import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/css样式文件.css'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import axios from 'axios'
import VueDraggableResizable from "vue-draggable-resizable";

Vue.component("vue-draggable-resizable", VueDraggableResizable);
Vue.config.productionTip = false

Vue.use(Antd);
Vue.prototype.$axios = axios

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
