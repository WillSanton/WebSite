import { Post } from "@shared/schema";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface PostPreviewProps {
  post: Partial<Post>;
}

export function PostPreview({ post }: PostPreviewProps) {
  return (
    <div className="max-w-3xl mx-auto border rounded-lg p-6 bg-card">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {post.category && (
            <Badge variant="outline">{post.category}</Badge>
          )}
          <time className="text-sm text-muted-foreground">
            {post.publishedAt && format(new Date(post.publishedAt), "MMMM d, yyyy")}
          </time>
        </div>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.excerpt && (
          <p className="text-xl text-muted-foreground">{post.excerpt}</p>
        )}
      </header>

      {post.content && (
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}
    </div>
  );
}
