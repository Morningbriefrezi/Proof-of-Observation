import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const observationLog = pgTable('observation_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  wallet: text('wallet').notNull(),
  target: text('target').notNull(),
  stars: integer('stars').notNull().default(0),
  confidence: text('confidence').notNull(),
  mintTx: text('mint_tx'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
