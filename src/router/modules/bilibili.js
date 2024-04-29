/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/bilibili',
  component: Layout,
  redirect: '/bilibili/list',
  name: '哔哩哔哩',
  alwaysShow: true, // 就是这行显隐起作用的
  meta: {
    title: '哔哩哔哩',
    icon: 'list'
  },
  children: [
    {
      path: 'bilibili-user',
      component: () => import('@/views/bilibili/user/index'),
      name: '用户列表',
      meta: { title: '用户列表',icon: 'peoples' }
    }
  ]
}
export default tableRouter
