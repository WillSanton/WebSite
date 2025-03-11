import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@shared/schema";
import { Link } from "wouter";
import { format } from "date-fns";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/post/${post.slug}`}>
      <Card className="mystic-border cursor-pointer hover:bg-accent/50 transition-all duration-300 transform hover:scale-[1.02]">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className="bg-purple-950/50 text-purple-200">
              {post.category}
            </Badge>
            <span className="text-sm text-purple-300 italic">
              {format(new Date(post.publishedAt), "MMM d, yyyy")}
            </span>
          </div>
          <CardTitle className="text-2xl font-serif bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-200/80">{post.excerpt}</p>
        </CardContent>
      </Card>
    </Link>
  );
}