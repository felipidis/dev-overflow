import { BADGE_CRITERIA } from '@/constants'

export type SidebarLink = {
  imgURL: string
  route: string
  label: string
}

export type Job = {
  id?: string
  employer_name?: string
  employer_logo?: string | undefined
  employer_website?: string
  job_employment_type?: string
  job_title?: string
  job_description?: string
  job_apply_link?: string
  job_city?: string
  job_state?: string
  job_country?: string
}

export type Country = {
  name: {
    common: string
  }
}

export type ParamsProps = {
  params: { id: string }
}

export type SearchParamsProps = {
  searchParams: { [key: string]: string | undefined }
}

export type URLProps = {
  params: { id: string }
  searchParams: { [key: string]: string | undefined }
}

export type BadgeCounts = {
  GOLD: number
  SILVER: number
  BRONZE: number
}

export type UrlQueryParams = {
  params: string
  key: string
  value: string | null
}

export type RemoveUrlQueryParams = {
  params: string
  keys: string[]
}

export type BadgeParam = {
  criteria: {
    type: keyof typeof BADGE_CRITERIA
    count: number
  }[]
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA
