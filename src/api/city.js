import request from '@/utils/request'


export function getList(query) {
  return request({
    url: '/city/lists',
    method: 'get',
    params: query
  })
}

export function createData(data) {
  return request({
    url: '/city/create',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/city/edit',
    method: 'patch',
    data
  })
}

export function destroy(id) {
  return request({
    url: '/city/destroy/'+id,
    method: 'delete'
  })
}

