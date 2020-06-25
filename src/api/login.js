import {request} from './request'

export function GetSms(data) {
    return request({
        method: 'post',
        url: '/getSms/',
        data
    })
}