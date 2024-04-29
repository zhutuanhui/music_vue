/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/music',
  component: Layout,
  redirect: '/music/list',
  name: '网易云音乐',
  meta: {
    title: '网易云音乐',
    icon: 'list'
  },
  children: [
    {
      path: 'music-user',
      component: () => import('@/views/music/user/index'),
      name: '用户列表',
      meta: { title: '用户列表',icon: 'peoples' }
    },
    {
      path: 'system-single',
      component: () => import('@/views/music/single/index'),
      name: '单曲列表',
      meta: { title: '单曲列表',icon: 'star' }
    },
    {
      path: 'music-playlist-index',
      component: () => import('@/views/music/playlist/index'),
      name: '歌单列表',
      meta: { title: '歌单列表',icon: 'icon' }
    }
  ]
}
export default tableRouter
