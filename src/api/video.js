import request from '@/utils/request'
import config from './config'

export function getVideoList(data) {
  return request({
    url: `${config.BASE_URL}/video/video-list`,
    method: 'get',
    params: data
  })
}

export function deleteVideo(data) {
  return request({
    url: `${config.BASE_URL}/video/delete`,
    method: 'get',
    params: data
  })
}

export function disbaleVideo(data) {
  return request({
    url: `${config.BASE_URL}/video/disable`,
    method: 'get',
    params: data
  })
}

