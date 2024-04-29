/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/bill',
  component: Layout,
  redirect: '/bill/list',
  name: '账单',
  alwaysShow: true, // 就是这行显隐起作用的
  meta: {
    title: '账单',
    icon: 'list'
  },
  children: [
    {
      path: 'bill-list',
      component: () => import('@/views/bill/bill/index'),
      name: '账单管理',
      meta: { title: '账单管理', icon: 'peoples' }
    }
  ]
}
export default tableRouter
