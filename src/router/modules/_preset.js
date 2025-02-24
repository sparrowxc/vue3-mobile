/** @type {import('vue-router').RouteRecordItem[]} */
export default [
  {
    // 404
    path: '/:path(.*)*',
    name: 'PageNotFound',
    meta: { title: '404', auth: false, alive: false },
    component: () => import('@/views/_preset/exceptions/404.vue'),
  },
]
