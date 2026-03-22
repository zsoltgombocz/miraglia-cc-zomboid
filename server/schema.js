import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const content = sqliteTable('content', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  language: text('language').notNull(),
  section: text('section').notNull(),
  data: text('data', { mode: 'json' }).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  languageSectionUnique: unique().on(table.language, table.section),
}));

export const mods = sqliteTable('mods', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workshopId: text('workshop_id').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  image: text('image'),
  displayOrder: integer('display_order').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const forms = sqliteTable('forms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(),
  steamName: text('steam_name').notNull(),
  message: text('message').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const testimonials = sqliteTable('testimonials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  quote: text('quote').notNull(),
  author: text('author').notNull(),
  initial: text('initial').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});
