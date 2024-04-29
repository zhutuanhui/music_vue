import request from '@/utils/request'

// 查询角色列表
export function getgeetest(query) {
  return request({
    url: '/bilibili/geetest',
    method: 'post',
    params: query
  })
}

// 查询角色列表
export function addBilibiliUser(data) {
  return request({
    url: '/bilibili/add',
    method: 'post',
    data: data
  })
}
