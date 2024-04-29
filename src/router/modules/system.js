/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/admin',
  name: '系统管理',
  meta: {
    title: '系统管理',
    icon: 'table'
  },
  children: [
    {
      path: 'system-admin',
      component: () => import('@/views/system/admin/index'),
      name: '用户管理',
      meta: { title: '用户管理',icon: 'user' }
    },
    {
      path: 'system-role',
      component: () => import('@/views/system/role/index'),
      name: '角色管理',
      meta: { title: '角色管理',icon: 'icon' }
    },
    {
      path: 'system-menu-index',
      component: () => import('@/views/system/menu/index'),
      name: '菜单管理',
      meta: { title: '菜单管理',icon: 'icon' }
    },
    {
      path: 'icon',
      component: () => import('@/views/icons/index'),
      name: 'Icons',
      meta: { title: 'Icons', icon: 'icon', noCache: true }
    }
  ]
}
export default tableRouter
