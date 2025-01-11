import { integer, pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Attachments Table
export const attachmentsTable = pgTable('attachments_table', {
  id: serial('id').primaryKey(),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
});

// Users Table
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Hosts Table
export const hostsTable = pgTable('hosts_table', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  propertyIds: jsonb('property_ids').notNull().default([]),
});

// Homestays Table
export const homestaysTable = pgTable('homestays_table', {
  id: serial('id').primaryKey(),
  hostId: integer('host_id')
    .notNull()
    .references(() => hostsTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  location: jsonb('location').notNull(),
  pricePerNight: integer('price_per_night').notNull(),
  amenities: jsonb('amenities').notNull().default([]),
  rating: integer('rating').default(0),
  availability: jsonb('availability').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

// Homestay Attachments Table (New Table)
export const homestayAttachmentsTable = pgTable('homestay_attachments_table', {
  homestayId: integer('homestay_id')
    .notNull()
    .references(() => homestaysTable.id, { onDelete: 'cascade' }),
  attachmentId: integer('attachment_id')
    .notNull()
    .references(() => attachmentsTable.id, { onDelete: 'cascade' }),
});

// Bookings Table
export const bookingsTable = pgTable('bookings_table', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  homestayId: integer('homestay_id')
    .notNull()
    .references(() => homestaysTable.id, { onDelete: 'cascade' }),
  checkIn: timestamp('check_in').notNull(),
  checkOut: timestamp('check_out').notNull(),
  totalPrice: integer('total_price').notNull(),
  foodSelection: jsonb('food_selection').default([]),
  status: text('status').default('confirmed'),
});

// Menu Items Table
export const menuItemsTable = pgTable('menu_items_table', {
  id: serial('id').primaryKey(),
  homestayId: integer('homestay_id')
    .notNull()
    .references(() => homestaysTable.id, { onDelete: 'cascade' }),
  attachmentId: integer('attachment_id')
    .references(() => attachmentsTable.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  type: text('type').notNull(),
});

// Chats Table
export const chatsTable = pgTable('chats_table', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  hostId: integer('host_id')
    .notNull()
    .references(() => hostsTable.id, { onDelete: 'cascade' }),
  messages: jsonb('messages').notNull().default([]),
});

// Infer Types
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertHost = typeof hostsTable.$inferInsert;
export type SelectHost = typeof hostsTable.$inferSelect;

export type InsertHomestay = typeof homestaysTable.$inferInsert;
export type SelectHomestay = typeof homestaysTable.$inferSelect;

export type InsertHomestayAttachment = typeof homestayAttachmentsTable.$inferInsert;
export type SelectHomestayAttachment = typeof homestayAttachmentsTable.$inferSelect;

export type InsertBooking = typeof bookingsTable.$inferInsert;
export type SelectBooking = typeof bookingsTable.$inferSelect;

export type InsertMenuItem = typeof menuItemsTable.$inferInsert;
export type SelectMenuItem = typeof menuItemsTable.$inferSelect;

export type InsertChat = typeof chatsTable.$inferInsert;
export type SelectChat = typeof chatsTable.$inferSelect;

export type InsertAttachment = typeof attachmentsTable.$inferInsert;
export type SelectAttachment = typeof attachmentsTable.$inferSelect;
