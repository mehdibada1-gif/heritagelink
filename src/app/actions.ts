"use server";

import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import { addComment, addStory, updateStoryInDb, deleteStoryFromDb, getStoryById, seedDatabase } from "@/lib/data";
import type { StoryFormData, User } from "./lib/types";
import { moderateComment } from "@/ai/flows/moderate-comments";

export async function handleSeedDatabase() {
    const result = await seedDatabase();
    if (result.success) {
        revalidatePath('/');
    }
    return result;
}

export async function handleCommentSubmission(
  storyId: string,
  commentText: string,
  user: User,
): Promise<{ success: boolean; error?: string; moderationReason?: string }> {
  if (!user) {
    return { success: false, error: "You must be logged in to comment." };
  }
  if (!commentText.trim()) {
    return { success: false, error: "Comment cannot be empty." };
  }

  try {
    // First, moderate the comment
    const moderationResult = await moderateComment(commentText);

    if (!moderationResult.isSafe) {
        return { success: false, error: 'MODERATION_FAILED', moderationReason: moderationResult.reason || 'Comment was flagged as inappropriate.' };
    }
      
    // If comment is safe, submit it
    await addComment(storyId, commentText, user);
    revalidatePath(`/story/${storyId}`);
    return { success: true };
  } catch (error) {
    console.error("Error submitting comment:", error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}


export async function submitStory(
  formData: StoryFormData,
  user: User
): Promise<{ success: boolean; storyId?: string; error?: string }> {
  if (!user) {
    return { success: false, error: "You must be logged in to submit a story." };
  }

  try {
    const storyId = await addStory(formData, user);
    revalidatePath("/");
    revalidatePath(`/story/${storyId}`);
    return { success: true, storyId };
  } catch (error) {
    console.error("Error submitting story:", error);
    return { success: false, error: "Failed to submit story." };
  }
}

export async function updateStory(
  storyId: string,
  formData: StoryFormData,
  userId: string
): Promise<{ success: boolean; error?: string }> {
    if (!userId) {
        return { success: false, error: "You must be logged in to update a story." };
    }

    try {
        const story = await getStoryById(storyId);
        if (story?.author.id !== userId) {
            return { success: false, error: "You are not authorized to edit this story." };
        }
        await updateStoryInDb(storyId, formData);
        revalidatePath("/");
        revalidatePath(`/story/${storyId}`);
        revalidatePath(`/story/${storyId}/edit`);
        return { success: true };
    } catch (error) {
        console.error("Error updating story:", error);
        return { success: false, error: "Failed to update story." };
    }
}

export async function deleteStory(storyId: string, userId: string) {
    if (!userId) {
        throw new Error("You must be logged in to delete a story.");
    }
    const story = await getStoryById(storyId);
    if (story?.author.id !== userId) {
        throw new Error("You are not authorized to delete this story.");
    }

    try {
        await deleteStoryFromDb(storyId);
    } catch (error) {
        console.error("Error deleting story:", error);
        throw new Error("Failed to delete story.");
    }

    revalidatePath("/");
    revalidatePath("/profile");
    redirect('/');
}
