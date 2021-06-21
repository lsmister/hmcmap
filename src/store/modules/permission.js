import { asyncRoutes, constantRoutes } from '@/router'
import { getAsyncMenus } from '@/api/system/role'
import Layout from '@/layout'
import { componentMap } from '@/utils/component-map'


/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(role, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role)
  } else {
    return true
  }
}


export function filterAsyncRoutes(routes) {
  const res = []

  routes.forEach(route => {
    // console.log(route)
    const tmp = { ...route }
    if (tmp.component) {
      // tmp.component = () => import('@/views/system/user')
      // tmp.component = (resolve) => require([`@/views/${tmp.component}`], resolve)
      tmp.component = componentMap[tmp.component]
    }else {
      tmp.component = Layout
      // delete tmp['component']
    }
    console.log(tmp.component)
    if (route.children) {
      tmp.children = filterAsyncRoutes(tmp.children)
    }

    res.push(tmp)
    
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  async generateRoutes({ commit }, role) {
    let accessedRoutes
    const result = await getAsyncMenus(role);
    if (!result.data || result.data.length < 1) {
      accessedRoutes = []
    }else {
      accessedRoutes = filterAsyncRoutes(result.data)
    }

    console.log(accessedRoutes)

    commit('SET_ROUTES', accessedRoutes)

    return new Promise(resolve => {
      resolve(accessedRoutes)
    })
    
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
