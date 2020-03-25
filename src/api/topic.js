import request from '@/utils/request'
import config from './config'

export function getTopicList(data) {
  return request({
    url: `${config.BASE_URL}/topic/topic-list`,
    method: 'get',
    params: data
  })
}
export function deleteTopic(data) {
  return request({
    url: `${config.BASE_URL}/topic/delete`,
    method: 'get',
    params: data
  })
}
export function disableTopic(data) {
  return request({
    url: `${config.BASE_URL}/topic/disable`,
    method: 'get',
    params: data
  })
}
