import { BADGE_CRITERIA } from '@/constants'
import {
  BadgeCounts,
  BadgeParam,
  RemoveUrlQueryParams,
  UrlQueryParams
} from '@/types'
import { clsx, type ClassValue } from 'clsx'
import qs from 'query-string'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimeStamp = (createdAt: Date): string => {
  const now = new Date()
  const timeDifferenceInSeconds = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000
  )

  if (timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds} seconds ago`
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(timeDifferenceInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}

export const formatLargeNumber = (number: number): string => {
  if (number >= 1000000) {
    const formattedNumber = (number / 1000000).toFixed(1)
    return `${formattedNumber}M`
  } else if (number >= 1000) {
    const formattedNumber = (number / 1000).toFixed(1)
    return `${formattedNumber}K`
  } else {
    return number.toString()
  }
}

export const getJoinedDate = (date: Date): string => {
  // Extract the month and year from the Date object
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()

  // Create the joined date string (e.g., "September 2023")
  const joinedDate = `${month} ${year}`

  return joinedDate
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params)

  currentUrl[key] = value

  return qs.stringifyUrl(
    { url: window.location.pathname, query: currentUrl },
    {
      skipNull: true
    }
  )
}

export const removeKeysFromQuery = ({ params, keys }: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params)

  keys.forEach((key) => {
    delete currentUrl[key]
  })

  return qs.stringifyUrl(
    { url: window.location.pathname, query: currentUrl },
    {
      skipNull: true
    }
  )
}

export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0
  }

  const { criteria } = params

  criteria.forEach((item) => {
    const { type, count } = item
    const badgeLevels: any = BADGE_CRITERIA[type]

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1
      }
    })
  })

  return badgeCounts
}
