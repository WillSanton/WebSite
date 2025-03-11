import { User, InsertUser, Post, InsertPost, Comment, InsertComment, WitchAssistant } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import session from "express-session";
import { posts, users, comments, witchAssistants } from "@shared/schema";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface SearchParams {
  query?: string;
  category?: string;
}

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllPosts(): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost & { authorId: number }): Promise<Post>;
  getPostComments(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment & { authorId: number }): Promise<Comment>;
  searchPosts(params: SearchParams): Promise<Post[]>;
  activateWitchAssistant(userId: number): Promise<void>;
  getWitchAssistant(userId: number): Promise<WitchAssistant | undefined>;
  updateWitchAssistant(userId: number, updates: Partial<WitchAssistant>): Promise<WitchAssistant>;
  updateUserPassword(userId: number, newPassword: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllPosts(): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .orderBy(posts.publishedAt);
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    return post;
  }

  async createPost(data: InsertPost & { authorId: number }): Promise<Post> {
    const [post] = await db.insert(posts).values(data).returning();
    return post;
  }

  async getPostComments(postId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(comments.createdAt);
  }

  async createComment(data: InsertComment & { authorId: number }): Promise<Comment> {
    const [comment] = await db.insert(comments).values(data).returning();
    return comment;
  }

  async searchPosts({ query, category }: SearchParams): Promise<Post[]> {
    let searchQuery = db.select().from(posts);

    if (query) {
      searchQuery = searchQuery.where(
        sql`(
          title ILIKE ${`%${query}%`} OR
          content ILIKE ${`%${query}%`} OR
          excerpt ILIKE ${`%${query}%`}
        )`
      );
    }

    if (category && category !== '_all') {
      searchQuery = searchQuery.where(eq(posts.category, category));
    }

    return await searchQuery.orderBy(posts.publishedAt);
  }
  async activateWitchAssistant(userId: number): Promise<void> {
    // Create default witch assistant for the user
    await db.insert(witchAssistants).values({
      userId,
      name: "Mystic Guide",
      customization: {
        appearance: {
          race: "cat",
          accessories: {
            head: null,
            hand: null,
            body: [],
          },
        },
      },
      active: true,
    });

    console.log(`Witch assistant activated for user ${userId}`); // Debug log
  }

  async getWitchAssistant(userId: number): Promise<WitchAssistant | undefined> {
    console.log(`Fetching witch assistant for user ${userId}`); // Debug log
    const [assistant] = await db
      .select()
      .from(witchAssistants)
      .where(eq(witchAssistants.userId, userId));
    console.log('Assistant found:', assistant); // Debug log
    return assistant;
  }

  async updateWitchAssistant(userId: number, updates: Partial<WitchAssistant>): Promise<WitchAssistant> {
    const [assistant] = await db
      .update(witchAssistants)
      .set(updates)
      .where(eq(witchAssistants.userId, userId))
      .returning();
    return assistant;
  }
  async updateUserPassword(userId: number, newPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: newPassword })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();

// Criar post inicial se não existir
storage.getPostBySlug("welcome-to-third-way").then(async (existingPost) => {
  if (!existingPost) {
    await storage.createPost({
      title: "Welcome to Third Way: A Journey Through Occult Knowledge",
      content: `
        <h2>Embarking on the Path of Ancient Wisdom</h2>
        <p>Welcome to Third Way, a sacred space dedicated to the exploration, study, and practice of occult wisdom. Here, we embark on a journey through the veiled realms of esoteric knowledge, seeking to understand the profound mysteries that have captivated seekers throughout the ages.</p>

        <h3>Our Purpose</h3>
        <p>This blog serves as a gathering point for those who seek deeper understanding of occult practices, mystical experiences, and ancient wisdom. We aim to:</p>
        <ul>
          <li>Share authentic experiences and insights from occult practices</li>
          <li>Explore traditional and contemporary approaches to esoteric studies</li>
          <li>Create a respectful community for practitioners and seekers</li>
          <li>Document the practical applications of occult wisdom in modern life</li>
        </ul>

        <h3>What to Expect</h3>
        <p>Our journey will traverse various paths of occult knowledge, including:</p>
        <ul>
          <li>In-depth explorations of hermetic principles</li>
          <li>Practical guides to ritual and ceremonial practices</li>
          <li>Discussions on ancient mystical texts and their modern interpretations</li>
          <li>Personal accounts of spiritual experiences and insights</li>
        </ul>

        <p>Join us as we delve into these sacred mysteries, sharing knowledge, experiences, and wisdom along the way. Whether you're a seasoned practitioner or newly curious about the occult arts, Third Way welcomes you to this transformative journey.</p>
      `,
      excerpt: "Embark on a journey through occult wisdom, practical experiences, and mystical knowledge at Third Way, your guide to esoteric understanding.",
      category: "Esoteric Philosophy",
      slug: "welcome-to-third-way",
      publishedAt: new Date(),
      authorId: 1
    });
  }
}).catch(console.error);