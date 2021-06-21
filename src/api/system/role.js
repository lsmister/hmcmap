import request from '@/utils/request'


export function getList(query) {
  return request({
    url: '/system/role/lists',
    method: 'get',
    params: query
  })
}

export function createData(data) {
  return request({
    url: '/system/role/create',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/system/role/edit',
    method: 'patch',
    data
  })
}

export function destroy(id) {
  return request({
    url: '/system/role/destroy/'+id,
    method: 'delete'
  })
}

export function allotPermission(method, data = '') {
    let url = '/system/role/allotPermission'
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

export function getAsyncMenus(role_name) {
  return request({
    url: '/system/role/getAsyncMenus/'+role_name,
    method: 'get'
  })
}

