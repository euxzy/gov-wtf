import { createCookieSessionStorage } from 'react-router'

export const serviceSession = createCookieSessionStorage({
  cookie: {
    path: '/',
    name: '__ss_',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 365 * 24 * 60 * 60,
    secure: process.env.NODE_ENV === 'production',
    secrets: [String(process.env.SESSION_PUBLIC_SECRET)],
  },
})

export const {
  getSession: getServiceSession,
  commitSession: commitServiceSession,
  destroySession: destroyServiceSession,
} = serviceSession
