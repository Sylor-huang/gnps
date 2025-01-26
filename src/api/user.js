import requestReq from '@/utils/axiosReq'

export function getUsers(data) {
  return requestReq({
    url: '/api/users',
    method: 'get',
    data
  })
}

export function userLogin(data) {
  return requestReq({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function SendEmail(data) {
  return requestReq({
    url: '/api/send_email',
    method: 'post',
    data
  })
}

export function Register(data) {
  return requestReq({
    url: '/api/register',
    method: 'post',
    data
  })
}

export function getUserInfo(data) {
  return requestReq({
    url: '/api/user_info',
    method: 'get',
    data
  })
}

export function updateUserInfo(data) {
  return requestReq({
    url: '/api/update_user',
    method: 'post',
    data
  })
}

export function updateUserPasswd(data) {
  return requestReq({
    url: '/api/update_passwd',
    method: 'post',
    data
  })
}

export function updateTimes() {
  return requestReq({
    url: '/api/update_times',
    method: 'post'
  })
}