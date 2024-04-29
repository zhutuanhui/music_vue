import request from '@/utils/request'

// 查询角色列表
export function listAdmin(query) {
  return request({
    url: '/admin/list',
    method: 'post',
    params: query
  })
}

// 查询角色详细
export function getAdmin(admin_id) {
  return request({
    url: '/admin/Info',
    method: 'post',
    data: { 'admin_id': admin_id }
  })
}

// 查询角色详细
export function getAdminInfo(admin_id) {
  return request({
    url: '/admin/getInfo',
    method: 'post',
    data: { 'admin_id': admin_id }
  })
}

// 新增角色
export function addAdmin(data) {
  return request({
    url: '/admin/add',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateAdmin(data) {
  return request({
    url: '/admin',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delAdmin(admin_id) {
  return request({
    url: '/admin/delete/',
    method: 'post',
    data: { 'admin_id': admin_id }
  })
}

// 修改密码
export function updateAdminUserPassword(data) {
  return request({
    url: '/admin/updatePassword',
    method: 'post',
    data
  })
}

// 用户 是否启用
export function changeAdminIsActive(admin_id, is_active) {
  return request({
    url: '/api/v1/sysUser',
    method: 'post',
    data: { 'admin_id': admin_id, 'is_active': is_active }
  })
}
