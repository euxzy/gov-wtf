import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const functionary = sqliteTable('functionary', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  photo: text('photo'),
  position: text('position').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
})

export const rating = sqliteTable(
  'rating',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    functionaryId: text('functionary_id').references(() => functionary.id),
    rate: integer('rate').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [index('idx_functionary_id').on(table.functionaryId)],
)

export const functionaryRelation = relations(functionary, ({ many }) => ({
  ratings: many(rating),
}))

export const ratingRelation = relations(rating, ({ one }) => ({
  functionary: one(functionary, {
    fields: [rating.functionaryId],
    references: [functionary.id],
  }),
}))
