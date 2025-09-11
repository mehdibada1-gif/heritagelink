import { getBoards } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function BoardsPage() {
  const boards = await getBoards();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <div>
          <h1 className="font-headline text-4xl font-bold">Heritage Boards</h1>
          <p className="font-body mt-2 text-muted-foreground">
            Curated collections of stories, weaving together cultural threads.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Board
        </Button>
      </div>

      <div className="mt-12">
        {boards.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <Card key={board.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline">{board.name}</CardTitle>
                  <CardDescription className="font-body">{board.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    {board.stories.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                            {board.stories.slice(0, 3).map((story, index) => (
                                <div key={story.id} className="aspect-square relative rounded-md overflow-hidden">
                                    <Image 
                                        src={story.mediaUrl}
                                        alt={story.title}
                                        fill
                                        className="object-cover"
                                        data-ai-hint="heritage culture"
                                    />
                                    {index === 2 && board.stories.length > 3 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg">
                                            +{board.stories.length - 3}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full aspect-video bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground">No stories yet</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={board.creator.avatarUrl || undefined} alt={board.creator.name} />
                            <AvatarFallback>{board.creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>Curated by {board.creator.name}</span>
                    </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
                <h3 className="font-headline text-2xl font-bold">No Boards Yet</h3>
                <p className="font-body mt-2 text-muted-foreground">
                    Why not create the first one?
                </p>
                 <Button className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Board
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}
