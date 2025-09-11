import { getStories } from '@/lib/data';
import { Country, countries } from '@/lib/types';
import { StoryFilter } from '@/components/story-filter';
import { StoryCard } from '@/components/story-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Landmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type HomePageProps = {
  searchParams: {
    region?: Country;
  }
}

export default async function Home({ searchParams }: HomePageProps) {
  const stories = await getStories(searchParams.region);

  return (
    <div>
      <section className="container mx-auto px-4 py-12 text-center">
        <Landmark className="mx-auto h-16 w-16 text-primary" />
        <h1 className="font-headline mt-4 text-5xl font-bold md:text-6xl">Heritagelink</h1>
        <p className="font-body mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Weaving the threads of our shared past into a vibrant digital tapestry for future generations.
        </p>
        <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="font-body">
              <Link href="/submit">Share Your Story</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-body">
              <Link href="/boards">Explore Boards</Link>
            </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">About The Project</CardTitle>
            </CardHeader>
            <CardContent className="font-body text-base space-y-4">
               <p>
                Heritagelink is a digital sanctuary dedicated to preserving and sharing the rich, diverse cultural stories from around the world. In an era of rapid globalization, many unique traditions, languages, and crafts are at risk of being forgotten. Our mission is to create a living archive, a place where these invaluable pieces of human heritage can be documented, celebrated, and passed on to future generations.
               </p>
               <p>
                Whether it's the intricate steps of a traditional dance, the secret recipe of a festive dish, a nearly-lost dialect, or the masterful technique of an ancient craft, every story matters. By contributing, you help build a global community connected by the histories that shape us.
               </p>
            </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 pb-12 md:pb-20">
        <div className="mb-8 text-center">
          <h2 className="font-headline text-4xl font-bold">Featured Stories</h2>
          <p className="font-body mt-2 text-muted-foreground">Filter stories by country to explore specific heritages.</p>
        </div>
        
        <div className="mb-8 flex justify-center">
          <StoryFilter />
        </div>

        {stories.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-8">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
            <h3 className="font-headline text-2xl font-bold">No Stories Found</h3>
            <p className="font-body mt-2 text-muted-foreground">
              There are no stories for the selected country yet. Why not be the first to share one?
            </p>
             <Button asChild className="mt-4">
                <Link href="/submit">Share a Story</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="border-t">
        <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-16">
          <p className="text-sm text-muted-foreground">
            Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor EACEA can be held responsible for them.
          </p>
          <div className="relative h-24">
            <Image
              src="https://dare4.masterpeace.org/wp-content/uploads/sites/19/2024/03/EN-Co-Funded-by-the-EU_PANTONE-1536x322.png"
              alt="Co-funded by the European Union"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
