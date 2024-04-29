import request from '@/utils/request'

// 列表
export function getStockslist(query) {
  return request({
    url: '/stocks/list',
    method: 'post',
    params: query
  })
}

// 详细
export function getStocksInfo(id) {
  return request({
    url: '/stocks/getInfo',
    method: 'post',
    data: { 'id': id }
  })
}

// 新增
export function addStocks(data) {
  return request({
    url: '/stocks/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updateStocks(data) {
  return request({
    url: '/stocks',
    method: 'put',
    data: data
  })
}

// 删除
export function delStocks(id) {
  return request({
    url: '/stocks/delete/',
    method: 'post',
    data: { 'id': id }
  })
}