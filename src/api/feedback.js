import request from '@/utils/request'
import config from './config'

export function getFeedbackList(data) {
  return request({
    url: `${config.BASE_URL}/feedback/get-feedback-list`,
    method: 'get',
    params: data
  })
}

export function deleteFeedback(data) {
  return request({
    url: `${config.BASE_URL}/feedback/delete-feedback`,
    method: 'get',
    params: data
  })
}

export function updateStatus(data) {
  return request({
    url: `${config.BASE_URL}/feedback/update-status`,
    method: 'get',
    params: data
  })
}
