import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/adminrole/list',
    method: 'post',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/adminrole/info',
    method: 'post',
    data: { 'role_id': roleId }
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/adminrole/add',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/adminrole',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/adminrole/delete/',
    method: 'post',
    data: { 'role_id': roleId }
  })
}

// 查询角色列表
export function allRole(query) {
  return request({
    url: '/adminrole/all',
    method: 'post',
    params: query
  })
}

// 用户 是否启用
export function changeRoleStatus(admin_id, is_active) {
  return request({
    url: '/adminrole/sysUser',
    method: 'post',
    data: { 'admin_id': admin_id, 'is_active': is_active }
  })
}

// 用户 是否启用
export function dataScope(query) {
  return request({
    url: '/adminrole/sysUser',
    method: 'post',
    data: query
  })
}
