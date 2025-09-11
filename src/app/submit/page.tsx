"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { categoryIcons } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { submitStory } from "@/app/actions";
import { type StoryFormData, countries } from "@/lib/types";

const storySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  category: z.enum(['Language', 'Ritual', 'Craft', 'Folklore', 'Music']),
  mediaUrl: z.string().url("Please enter a valid URL for media."),
  region: z.enum(countries),
});

const storyCategories = Object.keys(categoryIcons);

export default function SubmitPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { user, loading } = useAuth();
    const form = useForm<z.infer<typeof storySchema>>({
        resolver: zodResolver(storySchema),
        defaultValues: {
            title: "",
            description: "",
            mediaUrl: "",
        },
    });

    async function onSubmit(values: z.infer<typeof storySchema>) {
        if (!user) {
            toast({
                variant: "destructive",
                title: "Not logged in",
                description: "You must be logged in to submit a story.",
            });
            return;
        }

        const author = {
            id: user.uid,
            name: user.displayName || "Anonymous",
            avatarUrl: user.photoURL,
        };
        
        const result = await submitStory(values, author);

        if (result.success && result.storyId) {
            toast({
                title: "Story Submitted!",
                description: "Thank you for sharing your heritage with the world.",
            });
            router.push(`/story/${result.storyId}`);
        } else {
             toast({
                variant: "destructive",
                title: "Submission failed",
                description: result.error || "An unknown error occurred.",
            });
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto max-w-2xl px-4 py-12">
                <div className="text-center">
                    <h1 className="font-headline text-4xl font-bold">Share Your Story</h1>
                    <p className="font-body mt-2 text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
             <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
                <h1 className="font-headline text-4xl font-bold">Access Denied</h1>
                <p className="font-body mt-2 text-muted-foreground">
                    You must be logged in to submit a new story.
                </p>
                <Button onClick={() => router.push('/login')} className="mt-4">Log In</Button>
            </div>
        )
    }
  
    return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="text-center">
            <h1 className="font-headline text-4xl font-bold">Share Your Story</h1>
            <p className="font-body mt-2 text-muted-foreground">
                Contribute to our global tapestry of cultural heritage.
            </p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Story Title</FormLabel>
                    <FormControl>
                    <Input placeholder="The Art of Kintsugi" {...field} />
                    </FormControl>
                    <FormDescription>A catchy and descriptive title.</FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="Tell us about the tradition, craft, or tale..."
                        rows={8}
                        {...field}
                    />
                    </FormControl>
                    <FormDescription>
                        Share the details, history, and significance.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {storyCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormDescription>Help us classify this story.</FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="mediaUrl"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Media Link</FormLabel>
                    <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                        A link to an image or video that represents the story. Use https://picsum.photos for placeholder images.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Region / Country of Origin</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {countries.map(country => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormDescription>
                        Where does this story come from?
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" size="lg" className="w-full font-body" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Story'}
            </Button>
            </form>
        </Form>
    </div>
    );
}
