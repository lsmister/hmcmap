import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/system/user/logout',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  })
}


export function getList(query) {
  return request({
    url: '/system/user/lists',
    method: 'get',
    params: query
  })
}

export function createData(data) {
  return request({
    url: '/system/user/create',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/system/user/edit',
    method: 'patch',
    data
  })
}

export function destroy(id) {
  return request({
    url: '/system/user/destroy/'+id,
    method: 'delete'
  })
}

export function allotRole(method, data = '') {
  let url = '/system/user/allotRole'
  if(method == 'get') {
    return request({
      url: url,
      method: 'get',
      params: data
    })
  }else {
    return request({
      url: url,
      method: method,
      data
    })
  }
  
}

export function updatePassword(data) {
  return request({
    url: '/system/user/updatePassword',
    method: 'patch',
    data
  })
}
