import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export type Functionary = typeof functionary.$inferSelect
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

export type Rating = typeof rating.$inferSelect
export const rating = sqliteTable(
  'rating',
  {
    functionaryId: text('functionary_id').references(() => functionary.id),
    voterId: text('voter_id').references(() => voter.id),
    rate: integer('rate').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_functionary_id').on(table.functionaryId),
    index('idx_voter_id').on(table.voterId),
    primaryKey({ columns: [table.functionaryId, table.voterId] }),
  ],
)

export const voter = sqliteTable('voter', {
  id: text('id').primaryKey(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
})

export const functionaryRelation = relations(functionary, ({ many }) => ({
  ratings: many(rating),
}))

export const ratingRelation = relations(rating, ({ one }) => ({
  functionary: one(functionary, {
    fields: [rating.functionaryId],
    references: [functionary.id],
  }),
}))

export const voterRelation = relations(voter, ({ many }) => ({
  ratings: many(rating),
}))
