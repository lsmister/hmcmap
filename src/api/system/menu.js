import request from '@/utils/request'

export function getLevelOptions() {
  return request({
    url: '/system/menu/getLevelOptions',
    method: 'get'
  })
}

export function getMenuInfo(id) {
  return request({
    url: '/system/menu/getMenuInfo/'+id,
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

