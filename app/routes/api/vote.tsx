import { redirect } from 'react-router'
import type { Route } from './+types/vote'

export const loader = () => redirect('/')

export const action = ({ request }: Route.ActionArgs) => {
  console.log(request.signal)

  return null
}
