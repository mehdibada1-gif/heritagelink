"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getStoriesByAuthorId } from "@/lib/data";
import type { Story } from "@/lib/types";
import { StoryCard } from "@/components/story-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    async function fetchStories() {
      setLoadingStories(true);
      const userStories = await getStoriesByAuthorId(user.uid);
      setStories(userStories);
      setLoadingStories(false);
    }

    fetchStories();
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
       <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-64" />
            </div>
             <div className="mt-12">
                <Skeleton className="h-10 w-1/3 mb-8" />
                <div className="grid grid-cols-1 gap-8">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
       </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <Avatar className="h-24 w-24 border-4 border-primary">
          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ""} />
          <AvatarFallback className="text-3xl">
            {user.displayName?.charAt(0) || user.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h1 className="font-headline text-4xl font-bold">{user.displayName}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div className="mt-12">
        <h2 className="font-headline text-3xl font-bold mb-8">My Contributions</h2>
        {loadingStories ? (
             <div className="grid grid-cols-1 gap-8">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
            <h3 className="font-headline text-2xl font-bold">No Stories Yet</h3>
            <p className="font-body mt-2 text-muted-foreground">
              You haven't shared any stories. Let's change that!
            </p>
            <Button onClick={() => router.push('/submit')} className="mt-4">
              Share Your First Story
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
