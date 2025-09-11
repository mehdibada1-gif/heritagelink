"use client";

import { useTransition, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { handleCommentSubmission } from "@/app/actions";
import type { Comment } from "@/lib/types";
import { useAuth, AuthLoading } from "@/hooks/use-auth";
import Link from "next/link";
import { format } from 'date-fns';

interface CommentSectionProps {
  storyId: string;
  initialComments: Comment[];
}

export function CommentSection({ storyId, initialComments }: CommentSectionProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!commentText.trim()) return;

    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to comment.",
        });
        return;
    }
    
    startTransition(async () => {
        try {
            const author = {
                id: user.uid,
                name: user.displayName || 'Anonymous',
                avatarUrl: user.photoURL
            };
            const result = await handleCommentSubmission(storyId, commentText, author);

            if (result.success) {
                formRef.current?.reset();
                setCommentText("");
                toast({
                title: "Success!",
                description: "Your comment has been posted.",
                });
            } else {
                if (result.error === 'MODERATION_FAILED') {
                    toast({
                        variant: "destructive",
                        title: "Comment Blocked",
                        description: result.moderationReason
                    });
                } else {
                     toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: result.error || "Failed to post comment.",
                    });
                }
            }
        } catch (error) {
            console.error("Error during comment submission:", error);
            toast({
                variant: "destructive",
                title: "An unexpected error occurred",
                description: "Could not process your comment.",
            });
        }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Community Voices</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AuthLoading>
            { user ? (
                <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
                  <Textarea
                    name="comment"
                    placeholder="Share your thoughts or add to the story..."
                    rows={4}
                    className="font-body"
                    disabled={isPending}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit Comment"}
                  </Button>
                </form>
            ) : (
                <div className="text-center text-muted-foreground font-body rounded-lg border-2 border-dashed p-8">
                    <p>You must be logged in to leave a comment.</p>
                    <Button asChild variant="link">
                        <Link href="/login">Log In or Sign Up</Link>
                    </Button>
                </div>
            )}
        </AuthLoading>


        <div className="space-y-6">
          {initialComments.length > 0 ? (
            initialComments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar>
                  <AvatarImage src={comment.author.avatarUrl || undefined} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="font-bold">{comment.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                       {format(new Date(comment.createdAt), 'PP')}
                    </p>
                  </div>
                  <p className="font-body mt-1 text-foreground">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="font-body text-center text-muted-foreground">Be the first to share your voice.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
