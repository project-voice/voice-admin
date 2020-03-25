import request from '@/utils/request'
import config from './config'
export function login(data) {
  return request({
    url: `${config.BASE_URL}/user/login`,
    method: 'post',
    data
  })
}
