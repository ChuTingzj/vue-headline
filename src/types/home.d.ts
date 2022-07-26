interface channelItem {
  id: number
  name: string
}
interface cover {
  images: Array<string>
  type: number
}
interface articleItem {
  art_id: string
  aut_id: string
  aut_name: string
  comm_count: string
  cover: cover
  is_top: number
  pubdate: string
  title: string
}
interface reportItem {
  type: number
  label: string
}
interface channels {
  id: number
  seq: number
}
export { channelItem, articleItem, reportItem, channels }
