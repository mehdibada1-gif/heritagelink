"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
import { updateStory } from "@/app/actions";
import { type StoryFormData, type Story, countries } from "@/lib/types";
import { getStoryById } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

const storySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  category: z.enum(['Language', 'Ritual', 'Craft', 'Folklore', 'Music']),
  mediaUrl: z.string().url("Please enter a valid URL for media."),
  region: z.enum(countries),
});

const storyCategories = Object.keys(categoryIcons);

type EditStoryPageProps = {
    params: {
        id: string;
    }
}

export default function EditStoryPage({ params }: EditStoryPageProps) {
    const { toast } = useToast();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [story, setStory] = useState<Story | null>(null);
    const [loadingStory, setLoadingStory] = useState(true);
    
    const form = useForm<z.infer<typeof storySchema>>({
        resolver: zodResolver(storySchema),
        defaultValues: {
            title: "",
            description: "",
            mediaUrl: "",
        },
    });

    useEffect(() => {
        const fetchStory = async () => {
            const fetchedStory = await getStoryById(params.id);
            if (fetchedStory) {
                setStory(fetchedStory);
                form.reset(fetchedStory);
            }
            setLoadingStory(false);
        };
        fetchStory();
    }, [params.id, form]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
        if (!authLoading && user && story && user.uid !== story.author.id) {
            toast({ variant: 'destructive', title: "Unauthorized", description: "You cannot edit this story."});
            router.push(`/story/${params.id}`);
        }
    }, [authLoading, user, story, router, params.id, toast]);


    async function onSubmit(values: z.infer<typeof storySchema>) {
        if (!user) {
            toast({ variant: "destructive", title: "Not logged in" });
            return;
        }

        const result = await updateStory(params.id, values, user.uid);

        if (result.success) {
            toast({
                title: "Story Updated!",
                description: "Your story has been successfully updated.",
            });
            router.push(`/story/${params.id}`);
        } else {
             toast({
                variant: "destructive",
                title: "Update failed",
                description: result.error || "An unknown error occurred.",
            });
        }
    }

    if (authLoading || loadingStory) {
        return (
            <div className="container mx-auto max-w-2xl px-4 py-12 space-y-8">
                 <div className="text-center">
                    <h1 className="font-headline text-4xl font-bold">Edit Your Story</h1>
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        )
    }

    if (!story) {
        return (
             <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
                <h1 className="font-headline text-4xl font-bold">Story Not Found</h1>
            </div>
        )
    }
  
    return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="text-center">
            <h1 className="font-headline text-4xl font-bold">Edit Your Story</h1>
            <p className="font-body mt-2 text-muted-foreground">
                Make changes to your cultural treasure.
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
                    <Input {...field} />
                    </FormControl>
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
                        rows={8}
                        {...field}
                    />
                    </FormControl>
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
                    <Input {...field} />
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
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" size="lg" className="w-full font-body" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </Button>
            </form>
        </Form>
    </div>
    );
}
