export type RefType = {
  afterUpload: () => Promise<void>
}

export type Pic = {
  download_url: string,
  cdn_url: string,
  sha: string,
  path: string,
  name: string
}