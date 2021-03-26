import request from '@/utils/request'


//基础房型
  export function getList(query) {
    return request({
      url: '/group/mrt/roomType/lists',
      method: 'get',
      params: query
    })
  }
  
  export function createData(data) {
    return request({
      url: '/group/mrt/roomType/create',
      method: 'post',
      data
    })
  }
  
  export function updateData(data) {
    return request({
      url: '/group/mrt/roomType/edit',
      method: 'patch',
      data
    })
  }
  
  export function destroy(id) {
    return request({
      url: '/group/mrt/roomType/destroy/'+id,
      method: 'delete'
    })
  }

  export function lookSubRooms(id) {
    return request({
      url: '/group/mrt/roomType/lookSubRooms/'+id,
      method: 'get'
    })
  }
  