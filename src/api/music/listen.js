import request from '@/utils/request'

// 查询角色列表
export function listMusicTime(query) {
  return request({
    url: '/musictime/list',
    method: 'post',
    params: query
  })
}

// 查询角色详细
export function getMusicTimeInfo(id) {
  return request({
    url: '/musictime/info',
    method: 'post',
    data: { 'id': id }
  })
}

// 新增角色
export function addMusicTime(data) {
  return request({
    url: '/musictime/add',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateMusicTime(data) {
  return request({
    url: '/musictime',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delMusicTime(id) {
  return request({
    url: '/musictime/delete',
    method: 'post',
    data: { 'id': id }
  })
}
