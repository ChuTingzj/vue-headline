export default function throttle(fn: (...args: any[]) => void, delay = 300) {
  let flag = true
  return function (this: any, ...args: any[]) {
    if (!flag) return
    flag = false
    setTimeout(() => {
      fn.apply(this, args)
      flag = true
    }, delay)
  }
}
