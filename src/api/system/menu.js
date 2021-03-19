import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/system/menu/lists',
    method: 'get',
    params: query
  })
}

export function getTopLevel() {
  return request({
    url: '/system/menu/getTopLevel',
    method: 'get'
  })
}

export function getSelectOptions() {
  return request({
    url: '/system/menu/getSelectOptions',
    method: 'get'
  })
}

export function createData(data) {
  return request({
    url: '/system/menu/create',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/system/menu/edit',
    method: 'patch',
    data
  })
}

export function destroy(id) {
  return request({
    url: '/system/menu/destroy/'+id,
    method: 'delete'
  })
}

