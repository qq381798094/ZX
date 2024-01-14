/**
 * 根据当前小时时间生成祝福语 "早上 | 上午 | 下午 | 晚上"
 * @returns "早上 | 上午 | 下午 | 晚上"
 */
export const getTime = () => {
  let message = ''
  const hour = new Date().getHours()

  if (hour / 12 < 1) {
    if (hour / 9 < 1) message = '早上'
    else message = '上午'
  } else {
    if (hour / 18 >= 1) message = '晚上'
    else message = '下午'
  }

  return message
}
