import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  json,
  boolean,
} from "drizzle-orm/pg-core";

export const restrooms = pgTable("restrooms", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  hours: text("hours").notNull(),
  images: json("images").$type<string[]>().notNull(),
  features: json("features").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey(),
  restroomId: uuid("restroom_id")
    .notNull()
    .references(() => restrooms.id),
  userName: text("user_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  helpful: integer("helpful").notNull(),
  unhelpful: integer("unhelpful").notNull(),
  cleanliness: integer("cleanliness").notNull(),
  accessibility: integer("accessibility").notNull(),
  privacy: integer("privacy").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analytics = pgTable("analytics", {
  id: uuid("id").primaryKey(),
  restroomId: uuid("restroom_id")
    .notNull()
    .references(() => restrooms.id),
  pros: json("pros").$type<string[]>().notNull(),
  cons: json("cons").$type<string[]>().notNull(),
  features: json("detected_features").$type<string[]>().notNull(),
});

export const menstrualProducts = pgTable("menstrual_products", {
  id: uuid("id").primaryKey(),
  restroomId: uuid("restroom_id")
    .notNull()
    .references(() => restrooms.id),
  available: boolean("available").notNull(),
  dispenserType: text("dispenser_type").notNull(),
  images: json("images").$type<string[]>().notNull(),
  restockDate: timestamp("restock_date").notNull(),
});

export type RestroomSelect = typeof restrooms.$inferSelect;
export type ReviewSelect = typeof reviews.$inferSelect;
