import { SidebarLink } from '@/types'

export const themes = [
  { value: 'light', label: 'Light', icon: '/assets/icons/sun.svg' },
  { value: 'dark', label: 'Dark', icon: '/assets/icons/moon.svg' },
  { value: 'system', label: 'System', icon: '/assets/icons/computer.svg' }
]

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: '/assets/icons/home.svg',
    route: '/',
    label: 'Home'
  },
  {
    imgURL: '/assets/icons/users.svg',
    route: '/community',
    label: 'Community'
  },
  {
    imgURL: '/assets/icons/star.svg',
    route: '/collection',
    label: 'Collections'
  },
  {
    imgURL: '/assets/icons/suitcase.svg',
    route: '/jobs',
    label: 'Find Jobs'
  },
  {
    imgURL: '/assets/icons/tag.svg',
    route: '/tags',
    label: 'Tags'
  },
  {
    imgURL: '/assets/icons/user.svg',
    route: '/profile',
    label: 'Profile'
  },
  {
    imgURL: '/assets/icons/question.svg',
    route: '/ask-question',
    label: 'Ask a question'
  }
]

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000
  }
}

export const TOP_QUESTIONS = [
  {
    _id: '1',
    title:
      'Would it be appropriate to point out an error in another paper during a referee report?'
  },
  { _id: '2', title: 'How can an airconditioning machine exist?' },
  { _id: '3', title: 'Interrogated every time crossing UK Border as citizen' },
  { _id: '4', title: 'Low digit addition generator' },
  {
    _id: '5',
    title: 'What is an example of 3 numbers that do not make up a vector?'
  }
]

export const POPULAR_TAGS = [
  { _id: '1', name: 'Javascript', totalQuestions: 100 },
  { _id: '2', name: 'Typescript', totalQuestions: 200 },
  { _id: '3', name: 'Next.JS', totalQuestions: 300 },
  { _id: '4', name: 'React.JS', totalQuestions: 400 },
  { _id: '5', name: 'NodeJS', totalQuestions: 250 }
]
