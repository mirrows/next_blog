import { query } from "@/utils/api"
import { stone } from "@/utils/global"

type UploadMiniParams = {
  content: string,
  path: string
}

export const uploadBase64 = (params: UploadMiniParams) => {
  return query({
    path: '/demos/uploadBase64',
    method: 'put',
    headers: {
      'content-type': 'application/json',
      ...(stone.data.token ? { Authorization: `token ${stone.data.token}` } : {})
    },
    params,
  })
}

type UploadUrlParams = {
  url: string,
  path: string
}

export const uploadUrl = (params: UploadUrlParams) => {
  return query({
    path: '/demos/uploadUrl',
    method: 'put',
    headers: {
      'content-type': 'application/json',
      ...(stone.data.token ? { Authorization: `token ${stone.data.token}` } : {})
    },
    params,
  })
}