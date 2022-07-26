interface cover {
  type: number
  images: string[]
}
interface searchItem {
  art_id: string
  aut_id: string
  aut_name: string
  collect_count: string
  comm_count: number
  cover: cover
  like_count: number
  pubdate: string
  title: string
}
export { searchItem }
