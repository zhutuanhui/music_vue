import request from '@/utils/request'

// 列表
export function getBilllist(query) {
  return request({
    url: '/bill/list',
    method: 'post',
    params: query
  })
}

// 详细
export function getBillInfo(id) {
  return request({
    url: '/bill/getInfo',
    method: 'post',
    data: { 'id': id }
  })
}

// 新增
export function addBill(data) {
  return request({
    url: '/bill/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updateBill(data) {
  return request({
    url: '/bill',
    method: 'put',
    data: data
  })
}

// 删除
export function delBill(id) {
  return request({
    url: '/bill/delete/',
    method: 'post',
    data: { 'id': id }
  })
}

// 删除
export function getMoney(data) {
  return request({
    url: '/bill/getmoney',
    method: 'post',
    data: data
  })
}