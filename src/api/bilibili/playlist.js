import request from '@/utils/request'

// 查询角色列表
export function listMusicPlaylist(query) {
  return request({
    url: '/musicplaylist/list',
    method: 'post',
    params: query
  })
}

// 查询角色详细
export function getMusicPlaylistInfo(id) {
  return request({
    url: '/musicplaylist/info',
    method: 'post',
    data: { 'id': id }
  })
}

// 新增角色
export function addMusicPlaylist(data) {
  return request({
    url: '/musicplaylist/add',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateMusicPlaylist(data) {
  return request({
    url: '/musicplaylist',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delMusicPlaylist(id) {
  return request({
    url: '/musicplaylist/delete',
    method: 'post',
    data: { 'id': id }
  })
}
