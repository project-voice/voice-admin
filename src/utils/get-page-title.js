import defaultSettings from '@/settings'

const title = defaultSettings.title || '语声后台管理'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
