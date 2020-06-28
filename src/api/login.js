import {request} from './request'

export function GetSms(data) {
    return request({
        method: 'post',
        url: '/getSms/',
        data
    })
}

export function Register(data) {
    return request({
        method: 'post',
        url: '/register/',
        data
    })
}

export function Login(data) {
    return request({
        method: 'post',
        url: '/login/',
        data
    })
}