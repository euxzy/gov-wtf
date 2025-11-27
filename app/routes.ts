import { index, layout, prefix, type RouteConfig, route } from '@react-router/dev/routes'

export default [
  layout('routes/_layouts/root.tsx', [index('routes/index.tsx')]),
  ...prefix('api', [route('vote', 'routes/api/vote.tsx')]),
] satisfies RouteConfig
