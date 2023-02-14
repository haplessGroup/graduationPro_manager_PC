//获得年月日时分秒
//传入日期//例：2020-10-27T14:36:23
export const timeFormatSeconds = (time: string | number | Date) => {
  var d = time ? new Date(time) : new Date()
  var year = d.getFullYear()
  var month: string | number = d.getMonth() + 1
  var day: string | number = d.getDate()
  var hours: string | number = d.getHours()
  var min: string | number = d.getMinutes()
  var seconds: string | number = d.getSeconds()

  if (month < 10) month = '0' + month
  if (day < 10) day = '0' + day
  if (hours < 0) hours = '0' + hours
  if (min < 10) min = '0' + min
  if (seconds < 10) seconds = '0' + seconds

  return (
    year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + seconds
  )
}
