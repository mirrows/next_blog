import { ArticalParams } from "@/types/blogs";
import { NormalObj, Prettify } from "@/types/common";
import { githubApi, query } from "@/utils/api";
import { stone } from "@/utils/global";

export const queryGithubToken = (data: NormalObj) => {
  return query({
    path: '/github/token',
    method: 'POST',
    params: data
  })
}

export const queryUser = () => {
  return githubApi({ path: '/user' })
}

export const dictQuery = (w: string) => {
  return query({
    path: '/ciba/translation',
    query: { w }
  })
}

export const listArtical = (number?: number) => {
  return query({
    path: '/github/listArticals',
    method: 'get',
    headers: stone.data.token ? { Authorization: `token ${stone.data.token}` } : {},
    ...(String(number) ? { query: {number} } : {})
  })
}


export const addArtical = (params: ArticalParams) => {
  return query({
    path: '/github/addArtical',
    method: 'post',
    headers: stone.data.token ? { Authorization: `token ${stone.data.token}` } : {},
    params,
  })
}

export const editArtical = (params: ArticalParams) => {
  return query({
    path: '/github/editArtical',
    method: 'post',
    headers: stone.data.token ? { Authorization: `token ${stone.data.token}` } : {},
    params,
  })
}

export const bingQuery = (n = 7) => {
  return query({
    path: '/bing',
    query: { n }
  })
}

export const statisticVisitor = (time = 0) => {
  return query({
    path: '/visitor',
    method: 'post',
    params: { time },
    keepalive: true,
  })
}

export const visitorsData = () => {
  return query({
    path: '/visitor',
  })
}
