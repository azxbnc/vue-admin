import axios from 'axios'
import { Message } from 'element-ui'

const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devApi'
export function request(config) {
    const instance = axios.create({
        baseURL: BASEURL,
        timeout: 1000
    })
    instance.interceptors.request.use(req => {
        return req
    }, err => {
        console.log(err);
        
    })
    instance.interceptors.response.use(res => {
        let data = res.data;
        // console.log(res);
        if(data.resCode!== 0) {
            Message.error(data.message);
            return Promise.reject(data)
        } else {
            return res
        }
        
    }, error => {
        return Promise.reject(error)
        
    })

    return instance(config)
}