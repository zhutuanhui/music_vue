import request from '@/utils/request'

// 查询角色列表
export function listMusicUser(query) {
  return request({
    url: '/musicuser/list',
    method: 'post',
    params: query
  })
}

// 查询角色详细
export function getMusicUserInfo(id) {
  return request({
    url: '/musicuser/info',
    method: 'post',
    data: { 'id': id }
  })
}

// 新增角色
export function addMusicUser(data) {
  return request({
    url: '/musicuser/add',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateMusicUser(data) {
  return request({
    url: '/musicuser',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delMusicUser(id) {
  return request({
    url: '/musicuser/musicuser/',
    method: 'post',
    data: { 'id': id }
  })
}


// 删除角色
export function updateMusicUserInfo(id) {
  return request({
    url: '/musicuser/updateUserInfo/',
    method: 'post',
    data: { 'id': id }
  })
}

// 添加单曲
export function addMusicSingle(data) {
  return request({
    url: '/musicsingle/add',
    method: 'post',
    data: data
  })
}

// 听歌排行
export function getMusicRank(data) {
  return request({
    url: '/musicuser/musicrank',
    method: 'post',
    data: data
  })
}

// 获取二维码
export function getMusicQrcode(data) {
  return request({
    url: '/musicuser/codekey',
    method: 'post',
    data: data
  })
}

// 校验二维码是否扫码登录
export function checkMusicQrcode(data) {
  return request({
    url: '/musicuser/checkqrcode',
    method: 'post',
    data: data
  })
}

// 刷等级
export function apiFlushMusicLevel(id) {
  return request({
    url: '/musicuser/flashmusiclevel/',
    method: 'post',
    data: { 'id': id }
  })
}

// 获取用户歌单list
export function userPlaylist(data) {
  return request({
    url: '/musicuser/userplaylist',
    method: 'post',
    data: data
  })
}
