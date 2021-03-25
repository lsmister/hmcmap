import request from '@/utils/request'


export function getList(query) {
  return request({
    url: '/group/mrt/hotel/lists',
    method: 'get',
    params: query
  })
}

export function createData(data) {
  return request({
    url: '/group/mrt/hotel/create',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/group/mrt/hotel/edit',
    method: 'patch',
    data
  })
}

export function destroy(id) {
  return request({
    url: '/group/mrt/hotel/destroy/'+id,
    method: 'delete'
  })
}