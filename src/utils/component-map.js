
// 静态路由映射列表


export const componentMap = {
	'system/user': () => import('@/views/system/user'),
	'system/role': () => import('@/views/system/role'),
	'system/menu': () => import('@/views/system/menu')
}