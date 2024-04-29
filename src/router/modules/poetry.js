/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/poetry',
  component: Layout,
  redirect: '/poetry/list',
  name: '古诗',
  alwaysShow: true, // 就是这行显隐起作用的
  meta: {
    title: '古诗',
    icon: 'list'
  },
  children: [
    {
      path: 'bilibili-user',
      component: () => import('@/views/poetry/user/index'),
      name: '作者管理',
      meta: { title: '作者管理', icon: 'peoples' }
    },
    {
      path: 'poetry-list',
      component: () => import('@/views/poetry/poetry/index'),
      name: '古诗管理',
      meta: { title: '古诗管理', icon: 'peoples' }
    },
    {
      path: 'poetry-detail',
      component: () => import('@/views/poetry/poetry/detail'),
      name: '古诗详情',
      meta: { title: '古诗详情', icon: 'peoples' },
      hidden: true
    }
  ]
}
export default tableRouter
