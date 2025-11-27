import { eq } from 'drizzle-orm'
import { redirect } from 'react-router'
import { db } from '~/db'
import { rating, voter } from '~/db/schema'
import { getServiceSession } from '~/sessions/services.server'
import type { Route } from './+types/vote'

export const loader = () => redirect('/')

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getServiceSession(request.headers.get('Cookie'))
  const credentialId = session.get('credentialId')

  const formData = await request.formData()
  const rateValue = Number(formData.get('rating')) || 1
  const functionaryId = String(formData.get('functionaryId'))

  try {
    const voters = (await db.select().from(voter).where(eq(voter.id, credentialId)).limit(1)) || []
    const voterData = voters[0]

    if (!voterData) throw Error('Voter not found')

    const rate = rateValue <= 0 ? 1 : rateValue > 5 ? 5 : rateValue
    await db
      .insert(rating)
      .values({ functionaryId, rate, voterId: credentialId })
      .onConflictDoUpdate({
        target: [rating.functionaryId, rating.voterId],
        set: { rate },
      })
  } catch (err) {
    console.log(err)
  }

  return redirect(request.headers.get('referer') || '/')
}
