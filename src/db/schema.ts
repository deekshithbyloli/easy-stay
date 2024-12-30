import { integer, pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('user'), 
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const hostsTable = pgTable('hosts_table', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  propertyIds: jsonb('property_ids').notNull().default([]), // Array of homestay IDs
});

export const homestaysTable = pgTable('homestays_table', {
  id: serial('id').primaryKey(),
  hostId: integer('host_id')
    .notNull()
    .references(() => hostsTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  photos: jsonb('photos').notNull().default([]), // Array of photo URLs
  location: jsonb('location').notNull(), // { lat: number, lng: number, address: string }
  pricePerNight: integer('price_per_night').notNull(),
  amenities: jsonb('amenities').notNull().default([]), // e.g., ["WiFi", "Pool"]
  rating: integer('rating').default(0),
  availability: jsonb('availability').notNull(), // Array of dates with availability status
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});


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
  foodSelection: jsonb('food_selection').default([]), // Selected food items
  status: text('status').default('confirmed'), // 'confirmed', 'canceled', etc.
});

export const menuItemsTable = pgTable('menu_items_table', {
  id: serial('id').primaryKey(),
  homestayId: integer('homestay_id')
    .notNull()
    .references(() => homestaysTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  type: text('type').notNull(), // 'breakfast', 'lunch', 'dinner'
});

export const chatsTable = pgTable('chats_table', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  hostId: integer('host_id')
    .notNull()
    .references(() => hostsTable.id, { onDelete: 'cascade' }),
  messages: jsonb('messages').notNull().default([]), // Array of { senderId, text, timestamp }
});

// Infer Types
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertHost = typeof hostsTable.$inferInsert;
export type SelectHost = typeof hostsTable.$inferSelect;

export type InsertHomestay = typeof homestaysTable.$inferInsert;
export type SelectHomestay = typeof homestaysTable.$inferSelect;

export type InsertBooking = typeof bookingsTable.$inferInsert;
export type SelectBooking = typeof bookingsTable.$inferSelect;

export type InsertMenuItem = typeof menuItemsTable.$inferInsert;
export type SelectMenuItem = typeof menuItemsTable.$inferSelect;

export type InsertChat = typeof chatsTable.$inferInsert;
export type SelectChat = typeof chatsTable.$inferSelect;
