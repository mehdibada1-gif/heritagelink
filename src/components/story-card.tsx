import Link from 'next/link';
import Image from 'next/image';
import type { Story } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CategoryIcon } from './icons';

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Link href={`/story/${story.id}`}>
      <Card className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <CardHeader className="p-0">
          <div className="aspect-video relative">
            <Image
              src={story.mediaUrl}
              alt={story.title}
              fill
              className="object-cover"
              data-ai-hint="heritage culture"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-headline text-xl font-bold leading-tight">{story.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{story.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Badge variant="secondary" className="flex items-center gap-2">
            <CategoryIcon category={story.category} className="h-4 w-4" />
            <span>{story.category}</span>
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
