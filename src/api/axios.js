import axios from 'axios'
import qs from 'qs'

// 配置
axios.defaults.baseURL = 'http://kg.zhaodashen.cn/v2';
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
	// 在发送请求之前做些什么  统一加token、content-type数据编码等等
	config.headers['token'] = localStorage.getItem('token') || 'adf7cbdcdc62b07d94f86339e5687ca51'
	return config;
}, function (error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
	// 对响应数据做点什么  统一错误处理
	return response;
}, function (error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});



export let get = function (url, params) {
	return axios.get(url, { params })
}
export let post = function (url, params) {
	return axios.post(url, params)
}
// export let postLogin = params => {
// 	return axios.post("users/login.php", qs.stringify(params)).then(res => { res.data })
// }
export const postLoginApi = (url, params) => { // params => {uname, pwd, question, answer}
	return axios.post(url, qs.stringify(params))
}
export const postLoginApi2 = (url, params) => { // params => {uname, pwd, question, answer}
	return axios.post(url, qs.stringify(params))
}
export const getgoodlist = params => {
	return axios.get('/goods/type/index.php', { params }).then(res => res.data)
}
export const getgoodlist2 = (url, params) => {
	return axios.get(url, { params })
}

export const deluserlist = (url, params) => {
	return axios.delete(url, { params })
}
export const codelog = (url, params) => {
	return axios.post(url, qs.stringify(params))
}
export const getnum = (url, params) => {
	return axios.post(url, qs.stringify(params))
}
export const captchalog = (url, params) => {
	return axios.post(url, qs.stringify(params))
}