import request from '@/utils/request'

// 列表
export function getStocksDailylist(query) {
  return request({
    url: '/stocksDaily/list',
    method: 'post',
    params: query
  })
}

// 详细
export function getStocksDailyInfo(id) {
  return request({
    url: '/stocksDaily/getInfo',
    method: 'post',
    data: { 'id': id }
  })
}

// 新增
export function addStocksDaily(data) {
  return request({
    url: '/stocksDaily/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updateStocksDaily(data) {
  return request({
    url: '/stocksDaily',
    method: 'put',
    data: data
  })
}

// 删除
export function delStocksDaily(id) {
  return request({
    url: '/stocksDaily/delete/',
    method: 'post',
    data: { 'id': id }
  })
}