/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/stocks',
  component: Layout,
  redirect: '/stocks/list',
  name: '股票',
  alwaysShow: true, // 就是这行显隐起作用的
  meta: {
    title: '股票',
    icon: 'list'
  },
  children: [
    {
      path: 'stocks-list',
      component: () => import('@/views/stocks/list/index'),
      name: '股票管理',
      meta: { title: '股票管理', icon: 'peoples' }
    },
    {
      path: 'stocks-daily',
      component: () => import('@/views/stocks/daily/index'),
      name: '股票每日涨跌',
      meta: { title: '股票每日涨跌', icon: 'peoples' }
    },
  ]
}
export default tableRouter
