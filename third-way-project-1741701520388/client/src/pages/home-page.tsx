import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { PostCard } from "@/components/blog/post-card";
import { Loader2 } from "lucide-react";
import { SearchBar } from "@/components/blog/search-bar";

export default function HomePage() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-purple-950/20">
      <div className="container py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-300 via-purple-100 to-purple-300 bg-clip-text text-transparent">
            Mysteries of the Occult
          </h1>
          <p className="text-xl text-purple-200/80 max-w-2xl mx-auto italic">
            Explore the hidden knowledge of the ancient arts and esoteric wisdom
          </p>
        </div>

        <div className="mb-16">
          <SearchBar />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}