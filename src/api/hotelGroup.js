import request from '@/utils/request'


export function getList(query) {
  return request({
    url: '/hotelGroup/lists',
    method: 'get',
    params: query
  })
}

export function createData(data) {
  return request({
    url: '/hotelGroup/create',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/hotelGroup/edit',
    method: 'patch',
    data
  })
}

export function destroy(id) {
  return request({
    url: '/hotelGroup/destroy/'+id,
    method: 'delete'
  })
}