import request from '@/utils/request'

// 查询角色列表
export function listCron(query) {
  return request({
    url: '/cron/list',
    method: 'post',
    params: query
  })
}

// 查询角色详细
export function getCronInfo(id) {
  return request({
    url: '/cron/getInfo',
    method: 'post',
    data: { 'id': id }
  })
}

// 新增角色
export function addCron(data) {
  return request({
    url: '/cron/add',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateCron(data) {
  return request({
    url: '/cron',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delCron(cron_id) {
  return request({
    url: '/cron/delete/',
    method: 'post',
    data: { 'id': cron_id }
  })
}

// 用户 是否启用
export function changeCronIsActive(cron_id, status) {
  return request({
    url: '/cron/active/',
    method: 'post',
    data: { 'id': cron_id, 'status': status }
  })
}