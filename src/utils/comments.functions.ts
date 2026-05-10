import { createServerFn } from "@tanstack/react-start";
import { storage } from "@server/storage";

// Public: list approved comments
export const listApprovedComments = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const rows = await storage.listApprovedComments(50);
    return rows.map((c) => ({
      id: c.id,
      author_name: c.authorName,
      message: c.message,
      created_at: c.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error("[comments] listApprovedComments failed:", err);
    return [];
  }
});

// Public: post a new comment (starts as 'pending' until an admin approves it)
export const postComment = createServerFn({ method: "POST" })
  .inputValidator((input: { authorName: string; message: string }) => {
    if (!input || typeof input.authorName !== "string" || typeof input.message !== "string") {
      throw new Error("Invalid input");
    }
    const authorName = input.authorName.trim();
    const message = input.message.trim();
    if (authorName.length < 1 || authorName.length > 80) throw new Error("Invalid name");
    if (message.length < 1 || message.length > 1000) throw new Error("Invalid message");
    return { authorName, message };
  })
  .handler(async ({ data }) => {
    const row = await storage.insertPendingComment(data);
    return {
      id: row.id,
      author_name: row.authorName,
      message: row.message,
      created_at: row.createdAt.toISOString(),
      status: row.status,
    };
  });
