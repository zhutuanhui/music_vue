import request from '@/utils/request'

// 列表
export function listAuthor(query) {
  return request({
    url: '/poetryauthor/list',
    method: 'post',
    params: query
  })
}

// 详细
export function getAuthorInfo(id) {
  return request({
    url: '/poetryauthor/getInfo',
    method: 'post',
    data: { 'id': id }
  })
}

// 新增
export function addAuthor(data) {
  return request({
    url: '/poetryauthor/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updateAuthor(data) {
  return request({
    url: '/poetryauthor',
    method: 'put',
    data: data
  })
}

// 删除
export function delAuthor(id) {
  return request({
    url: '/poetryauthor/delete/',
    method: 'post',
    data: { 'id': id }
  })
}
