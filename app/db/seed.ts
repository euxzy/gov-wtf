import { db } from '.'
import { functionary } from './schema'

const _functionaries = []

export const seed = async () => {
  try {
    await db.insert(functionary).values([
      {
        name: '',
        position: '',
        id: '',
      },
    ])
  } catch (err) {
    console.log(err)
  }
}
