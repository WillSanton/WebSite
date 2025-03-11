import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CommentsSection } from "@/components/blog/comments-section";
import { ShareButton } from "@/components/share-button";

export default function PostPage({ params }: { params: { slug: string } }) {
  const { data: post, isLoading } = useQuery<Post>({
    queryKey: [`/api/posts/${params.slug}`],
  });

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  const shareUrl = window.location.href;

  return (
    <article className="container py-8 max-w-3xl">
      <header className="mb-8 relative">
        <div className="flex items-center gap-4 mb-4">
          <Badge variant="outline">{post.category}</Badge>
          <time className="text-sm text-muted-foreground">
            {format(new Date(post.publishedAt), "MMMM d, yyyy")}
          </time>
          <div className="absolute right-0 top-0">
            <ShareButton 
              url={shareUrl} 
              title={post.title} 
              description={post.excerpt}
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-xl text-muted-foreground">{post.excerpt}</p>
      </header>

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <section className="mt-16">
        <CommentsSection postSlug={post.slug} />
      </section>
    </article>
  );
}