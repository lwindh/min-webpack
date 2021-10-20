import axios from 'axios'
import { addPendingRequest, deletePendingRequest } from './preventRepeatedHttp'

const instance = axios.create({
    baseUrl: '/api'
})

instance.interceptors.request.use(async config => {
    let headerToken = token

    if (headerToken) {
        console.log('token已存在', headerToken)
    } else {
        console.log('token不存在发起请求')
        // toDo getToken
    }

    addPendingRequest(config)
    config.headers.token = headerToken

    return config
})

instance.interceptors.response.use(res => {
    deletePendingRequest(res.config)

    return res.data
}, error => {
    if (axios.isCancel(error)) {
        console.error('此请求被取消', error)
    }

    return Promise.reject(error)
})
