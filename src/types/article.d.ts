interface articleInfo {
  art_id: string
  attitude: number
  aut_id: string
  aut_name: string
  aut_photo: string
  comm_count: string
  content: string
  is_collected: boolean
  is_followed: boolean
  like_count: number
  pubdate: string
  title: string
}
interface commentItem {
  aut_id: string
  aut_name: string
  aut_photo: string
  com_id: string
  content: string
  is_followed: boolean
  is_liking: boolean
  like_count: number
  pubdate: string
  reply_count: number
}
export { articleInfo, commentItem }
