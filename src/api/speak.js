import request from '@/utils/request'
import config from './config'

// 阶段增删改查

export function getStageList(data) {
  return request({
    url: `${config.BASE_URL}/stage/stage-list`,
    method: 'get',
    params: data
  })
}
export function releaseStage(data) {
  return request({
    url: `${config.BASE_URL}/stage/release-stage`,
    method: 'post',
    data
  })
}

export function updateStage(data) {
  return request({
    url: `${config.BASE_URL}/stage/update-stage`,
    method: 'post',
    data
  })
}
export function deleteState(data) {
  return request({
    url: `${config.BASE_URL}/stage/delete-stage`,
    method: 'get',
    params: data
  })
}

// 问题增删改查

export function getQuestionList(data) {
  return request({
    url: `${config.BASE_URL}/question/question-list-all`,
    method: 'get',
    params: data
  })
}

export function releaseQuestion(data) {
  return request({
    url: `${config.BASE_URL}/question/release-question`,
    method: 'post',
    data
  })
}

export function updateQuestion(data) {
  return request({
    url: `${config.BASE_URL}/question/update-question`,
    method: 'post',
    data
  })
}

export function deleteQuestion(data) {
  return request({
    url: `${config.BASE_URL}/question/delete-question`,
    method: 'get',
    params: data
  })
}
