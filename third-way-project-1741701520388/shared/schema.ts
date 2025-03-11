import { pgTable, text, serial, timestamp, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  slug: text("slug").notNull().unique(),
  authorId: integer("author_id").notNull(),
  publishedAt: timestamp("published_at").notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull(),
  postId: integer("post_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  authorId: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  authorId: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export const BLOG_CATEGORIES = [
  "Hermeticism",
  "Alchemy",
  "Tarot",
  "Astrology",
  "Mysticism",
  "Sacred Geometry",
  "Esoteric Philosophy"
] as const;

export const witchAssistants = pgTable("witch_assistants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  customization: json("customization").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWitchAssistantSchema = createInsertSchema(witchAssistants).omit({
  id: true,
  createdAt: true,
});

export type WitchAssistant = typeof witchAssistants.$inferSelect;
export type InsertWitchAssistant = z.infer<typeof insertWitchAssistantSchema>;

export const HEAD_ACCESSORIES = [
  'witch_hat',        // Chapéu de Bruxa
  'wizard_hat',       // Chapéu de Mago
  'round_glasses',    // Óculos Redondos
] as const;

export const HAND_ACCESSORIES = [
  'magic_wand',       // Varinha Mágica
  'witch_broom',      // Vassoura de Bruxa
  'white_candle',     // Vela Branca
  'spellbook',        // Livro de Feitiços
  'dagger',           // Adaga
] as const;

export const BODY_ACCESSORIES = [
  'magic_cloak',      // Capa Mágica
  'herb_pouch',       // Bolsinha de Ervas
  'amulet_necklace',  // Colar Amuleto
] as const;

export const witchCustomizationSchema = z.object({
  appearance: z.object({
    race: z.enum([
      'bat',      // Morcego - *squeak squeak*
      'toad',     // Sapo - *ribbit*
      'moth',     // Mariposa - *flutter*
      'beetle',   // Besouro - *buzz*
      'cat',      // Gato - *meow*
      'dog',      // Cachorro - *woof*
      'goat',     // Bode - *baah*
    ]),
    accessories: z.object({
      head: z.enum(HEAD_ACCESSORIES).nullable(),
      hand: z.enum(HAND_ACCESSORIES).nullable(),
      body: z.array(z.enum(BODY_ACCESSORIES)).default([]),
    }),
  }),
});

export type WitchCustomization = z.infer<typeof witchCustomizationSchema>;
export type HeadAccessory = z.infer<typeof witchCustomizationSchema.shape.appearance.shape.accessories.shape.head>;
export type HandAccessory = z.infer<typeof witchCustomizationSchema.shape.appearance.shape.accessories.shape.hand>;
export type BodyAccessory = typeof BODY_ACCESSORIES[number];
export type FamiliarType = z.infer<typeof witchCustomizationSchema.shape.appearance.shape.race>;