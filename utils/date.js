import dayjs from 'dayjs'
import 'dayjs/locale/id'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('id')
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)

export const formatDate = (value, format = 'D MMMM YYYY') => {
  if (!value) { return 'INVALID DATE' }
  if (format === 'relative') {
    return dayjs(value).fromNow()
  }
  return dayjs(value).format(format)
}
