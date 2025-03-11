import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertPostSchema, insertCommentSchema } from "@shared/schema";
import { comparePasswords, hashPassword } from "./utils"; // Assuming these functions are in utils.ts
import archiver from "archiver";
import path from "path";
import fs from "fs";
import passport from 'passport'; // Assuming passport is already included


export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error, user: Express.User, info: any) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Login error:", loginErr);
          return next(loginErr);
        }
        return res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) {
          console.error("Login error after registration:", err);
          return next(err);
        }
        res.status(201).json(user);
      });
    } catch (err) {
      console.error("Registration error:", err);
      next(err);
    }
  });

  app.get("/api/posts", async (_req, res) => {
    const posts = await storage.getAllPosts();
    res.json(posts);
  });

  app.get("/api/posts/:slug", async (req, res) => {
    const post = await storage.getPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.json(post);
  });

  app.post("/api/posts", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    const result = insertPostSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    const post = await storage.createPost({
      ...result.data,
      authorId: req.user.id,
    });

    res.status(201).json(post);
  });

  // Listar comentários de um post
  app.get("/api/posts/:slug/comments", async (req, res) => {
    const post = await storage.getPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    const comments = await storage.getPostComments(post.id);
    res.json(comments);
  });

  // Criar comentários
  app.post("/api/posts/:slug/comments", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    const post = await storage.getPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    const result = insertCommentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    const comment = await storage.createComment({
      ...result.data,
      postId: post.id,
      authorId: req.user.id,
    });

    res.status(201).json(comment);
  });


  app.get("/api/download-project", async (req, res) => {
    try {
      // Create ZIP filename with timestamp
      const fileName = `third-way-project-${Date.now()}.zip`;
      const zipPath = path.join("/tmp", fileName);

      // Setup ZIP file stream
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      // Pipe archive data to the file
      archive.pipe(output);

      // Handle archive completion
      output.on("close", () => {
        res.download(zipPath, fileName, (err) => {
          if (err) {
            console.error("Error sending zip file:", err);
            return res.status(500).send({ error: "Failed to send zip file" });
          }
          // Clean up temp file
          fs.unlink(zipPath, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
          });
        });
      });

      // Handle archive errors
      archive.on("error", (err) => {
        console.error("Archive error:", err);
        return res.status(500).send({ error: "Error creating ZIP file" });
      });

      // Add files to archive with proper working directory
      archive.glob("**/*", {
        cwd: process.cwd(),
        ignore: [
          "node_modules/**",
          "dist/**",
          ".git/**",
          "tmp/**",
          "/tmp/**",
          "*.zip"
        ],
        dot: true
      });

      // Finalize archive
      await archive.finalize();

    } catch (error) {
      console.error("Download project error:", error);
      res.status(500).send({ error: "Failed to create project archive" });
    }
  });

  // Buscar posts
  app.get("/api/posts/search", async (req, res) => {
    const { query, category } = req.query;
    const posts = await storage.searchPosts({
      query: query as string,
      category: category as string,
    });
    res.json(posts);
  });

  // Obter o assistente do usuário
  app.get("/api/witch-assistant", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const assistant = await storage.getWitchAssistant(req.user.id);
      res.json(assistant || null);
    } catch (error: any) {
      res.status(500).json({
        message: "Erro ao buscar assistente: " + error.message,
      });
    }
  });

  // Atualizar o assistente do usuário
  app.patch("/api/witch-assistant", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const assistant = await storage.updateWitchAssistant(req.user.id, req.body);
      res.json(assistant);
    } catch (error: any) {
      res.status(500).json({
        message: "Erro ao atualizar assistente: " + error.message,
      });
    }
  });

  // Rota para alterar senha
  app.post("/api/change-password", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    const { currentPassword, newPassword } = req.body;

    try {
      // Verificar se a senha atual está correta
      const user = await storage.getUser(req.user.id);
      if (!user || !(await comparePasswords(currentPassword, user.password))) {
        return res.status(400).send("Senha atual incorreta");
      }

      // Atualizar a senha
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(user.id, hashedPassword);

      res.status(200).json({ message: "Senha alterada com sucesso" });
    } catch (error: any) {
      res.status(500).json({
        message: "Erro ao alterar senha: " + error.message,
      });
    }
  });

  // Rota para exportar posts em formato ZIP
  app.get("/api/export-zip", async (req, res) => {
    try {
      // Criar nome para o arquivo ZIP
      const fileName = `third-way-export-${Date.now()}.zip`;
      const zipPath = path.join("/tmp", fileName);

      // Configurar o arquivo ZIP
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      // Lidar com eventos do arquivo
      output.on("close", () => {
        // Enviar o arquivo para download
        res.download(zipPath, fileName, (err) => {
          if (err) {
            console.error("Error sending zip file:", err);
          }
          // Remover o arquivo temporário após o download
          fs.unlink(zipPath, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
          });
        });
      });

      archive.on("error", (err) => {
        res.status(500).send({ error: "Error creating ZIP file: " + err.message });
      });

      // Anexar o arquivo ZIP ao stream de saída
      archive.pipe(output);

      // Obter todos os posts
      const posts = await storage.getAllPosts();

      // Adicionar posts ao arquivo ZIP como arquivos JSON
      posts.forEach((post) => {
        archive.append(JSON.stringify(post, null, 2), { name: `post-${post.id}-${post.slug}.json` });

        // Adicionar o conteúdo do post como HTML
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${post.title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1>${post.title}</h1>
  <p><strong>Category:</strong> ${post.category}</p>
  <div>${post.content}</div>
</body>
</html>`;

        archive.append(htmlContent, { name: `post-${post.id}-${post.slug}.html` });
      });

      // Finalizar o arquivo ZIP
      archive.finalize();

    } catch (error: any) {
      res.status(500).send({ error: "Failed to export data: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}