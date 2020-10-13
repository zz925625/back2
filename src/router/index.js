import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Log from '../views/Log.vue'
import Userlist from '@/views/home/Userlist'
// import Usercreate from '@/views/home/Usercreate'
import Usercreate from '@/views/home/ceshi'


// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}


Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		redirect: '/home'
	},
	{
		path: '/log',
		component: Log,
	},
	{
		path: '/home',
		component: Home,
		redirect: '/home/userlist',
		children: [
			{
				path: '/home/userlist',
				component: Userlist,
				breadcrumbName: '用户列表'
			}, {
				path: '/home/usercreate',
				breadcrumbName: '用户新建',
				component: Usercreate,
			}
		]
	},

]

const router = new VueRouter({
	routes
})
router.beforeEach((to, from, next) => {
	if (to.path === '/log') {
		if (localStorage.getItem('token')) {
			router.push('/home')
		} else {
			next()
		}
	}

	if (localStorage.getItem('token')) {
		next()
	} else {
		router.push('/log')
	}
})
export default router
