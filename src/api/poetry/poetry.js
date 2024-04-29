import request from '@/utils/request'

// 列表
export function getPoetrylist(query) {
  return request({
    url: '/poetry/list',
    method: 'post',
    params: query
  })
}

// 详细
export function getPoetryInfo(id) {
  return request({
    url: '/poetry/getInfo',
    method: 'post',
    data: { 'id': id }
  })
}

// 新增
export function addPoetry(data) {
  return request({
    url: '/poetry/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updatePoetry(data) {
  return request({
    url: '/poetry',
    method: 'put',
    data: data
  })
}

// 删除
export function delPoetry(id) {
  return request({
    url: '/poetry/delete/',
    method: 'post',
    data: { 'id': id }
  })
}