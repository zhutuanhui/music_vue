import request from '@/utils/request'

// 查询角色列表
export function listMusicSingle(query) {
  return request({
    url: '/musicsingle/list',
    method: 'post',
    params: query
  })
}

// 查询角色详细
export function getMusicSingleInfo(id) {
  return request({
    url: '/musicsingle/info',
    method: 'post',
    data: { 'id': id }
  })
}

// 新增角色
export function addMusicSingle(data) {
  return request({
    url: '/musicsingle/add',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateMusicSingle(data) {
  return request({
    url: '/musicsingle',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delMusicSingle(id) {
  return request({
    url: '/musicsingle/delete',
    method: 'post',
    data: { 'id': id }
  })
}

// 更新歌曲数次
export function playrecoldMusicSingle(id) {
  return request({
    url: '/musicsingle/playrecold',
    method: 'post',
    data: { 'id': id }
  })
}

// 更新歌曲数次
export function flashNewMusicSingle(id) {
  return request({
    url: '/musicsingle/flashmusic',
    method: 'post',
    data: { 'id': id }
  })
}
