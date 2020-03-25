import request from '@/utils/request'
import config from './config'
export function getUserList(data) {
  return request({
    url: `${config.BASE_URL}/user/user-list`,
    method: 'get',
    params: data
  })
}

export function disableUser(data) {
  return request({
    url: `${config.BASE_URL}/user/disable-user`,
    method: 'get',
    params: data
  })
}
