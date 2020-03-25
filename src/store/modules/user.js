import { login } from '@/api/admin'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    imageUrl: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_IMAGE: (state, imageurl) => {
    state.imageUrl = imageurl
  },
  SET_PASSWORD: (state, password) => {
    state.password = password
  }
}

const actions = {
  // 用户登录
  resetUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      try {
        const userInfo = getToken().split('*')
        const name = userInfo[0]
        const image = userInfo[1]
        commit('SET_NAME', name)
        commit('SET_IMAGE', image)
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },
  login({ commit }, userInfo) {
    // 获取到用户名和密码
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        user_name: username.trim(),
        user_password: password,
        platform: 'pc'
      })
        .then(response => {
          const { data } = response
          console.log(data)
          commit('SET_NAME', data.data.user_name)
          commit('SET_IMAGE', data.data.user_image)
          setToken(`${data.data.user_name}*${data.data.user_image}`)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken()
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
