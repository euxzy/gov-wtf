import { db } from '.'
import { functionaryFactory } from './factory/functionary'
import { functionary } from './schema'

const main = async () => {
  try {
    console.log('Seeding...')
    await db.insert(functionary).values(functionaryFactory)
    console.log('Seeding complete')
  } catch (err) {
    console.log('Error seeding')
    console.log(err)
  }
}

main()
