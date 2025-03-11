import { useAuth } from "@/hooks/use-auth";
import { Comment, insertCommentSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface CommentsSectionProps {
  postSlug: string;
}

export function CommentsSection({ postSlug }: CommentsSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: [`/api/posts/${postSlug}/comments`],
  });

  const form = useForm({
    resolver: zodResolver(insertCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (data: { content: string }) => {
      const res = await apiRequest(
        "POST",
        `/api/posts/${postSlug}/comments`,
        data,
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/posts/${postSlug}/comments`],
      });
      form.reset();
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif text-purple-300">Comments</h2>

      {user && (
        <form
          onSubmit={form.handleSubmit((data) => commentMutation.mutate(data))}
          className="space-y-4"
        >
          <Textarea
            placeholder="Share your thoughts..."
            className="min-h-[100px]"
            {...form.register("content")}
          />
          {form.formState.errors.content && (
            <p className="text-sm text-destructive">
              {form.formState.errors.content.message}
            </p>
          )}
          <Button
            type="submit"
            disabled={commentMutation.isPending}
            className="w-full"
          >
            {commentMutation.isPending ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="mystic-border">
            <CardHeader>
              <span className="text-sm text-purple-300">
                Posted on {format(new Date(comment.createdAt), "MMMM d, yyyy")}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{comment.content}</p>
            </CardContent>
          </Card>
        ))}

        {comments.length === 0 && (
          <p className="text-center text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  );
}
