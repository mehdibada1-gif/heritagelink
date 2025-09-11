import { getStoryById, getCommentsByStoryId } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Pencil, Trash2 } from 'lucide-react';
import { CategoryIcon } from '@/components/icons';
import { CommentSection } from '@/components/comment-section';
import { getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { DeleteStoryButton } from '@/components/delete-button';


type StoryPageProps = {
  params: {
    id: string;
  };
};

export default async function StoryPage({ params }: StoryPageProps) {
  const story = await getStoryById(params.id);
  const user = await getCurrentUser();
  
  if (!story) {
    notFound();
  }

  const comments = await getCommentsByStoryId(params.id);
  const isAuthor = user && user.uid === story.author.id;

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
            <Badge variant="secondary" className="w-fit">
                <CategoryIcon category={story.category} className="mr-2 h-4 w-4"/>
                {story.category}
            </Badge>
            {isAuthor && (
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/story/${story.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <DeleteStoryButton storyId={story.id} userId={user.uid} />
                </div>
            )}
        </div>
        <h1 className="font-headline text-4xl font-bold md:text-5xl">{story.title}</h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={story.author.avatarUrl || undefined} alt={story.author.name} />
                    <AvatarFallback>{story.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{story.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{story.region}</span>
            </div>
        </div>
      </div>
      
      <div className="my-8 aspect-video relative w-full overflow-hidden rounded-lg shadow-lg">
        <Image
          src={story.mediaUrl}
          alt={story.title}
          fill
          className="object-cover"
          data-ai-hint="heritage culture"
        />
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none font-body">
        <p>{story.description}</p>
      </div>

      <div className="mt-12 md:mt-20">
        <CommentSection storyId={story.id} initialComments={comments} />
      </div>
    </article>
  );
}
