import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Landmark } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <Landmark className="h-12 w-12 text-primary mb-4" />
        <h1 className="font-headline text-5xl font-bold">Help Center</h1>
        <p className="font-body mt-2 text-muted-foreground max-w-2xl">
          Welcome to the Heritagelink knowledge base. Here you can find answers to common questions about how to use the platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-body font-semibold">How do I create an account?</AccordionTrigger>
              <AccordionContent className="font-body">
                To create an account, click the "Sign Up" button in the top-right corner of the header. You will need to provide your full name, a valid email address, and a password that is at least six characters long. After signing up, you will be automatically logged in.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-body font-semibold">How do I share a new story?</AccordionTrigger>
              <AccordionContent className="font-body">
                Once you are logged in, you can share a story by clicking the "Submit Story" link in the header. This will take you to a form where you need to provide a title, a detailed description, a category, a link to an image or video, and the story's country of origin from the provided list.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="font-body font-semibold">How do I find stories from a specific country?</AccordionTrigger>
              <AccordionContent className="font-body">
                On the home page, just below the main banner, you will find a series of filter buttons. You can click on any country name (e.g., Italy, Morocco) to see only the stories from that region. Click "All" to remove the filter and view stories from every country.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="font-body font-semibold">Can I edit or delete a story I posted?</AccordionTrigger>
              <AccordionContent className="font-body">
                Yes. If you are logged in and viewing a story that you posted, you will see "Edit" and "Delete" buttons at the top of the story page. Clicking "Edit" will take you to a form where you can change the story's details. Clicking "Delete" will prompt you to confirm before permanently removing your story. You cannot edit or delete stories posted by other users.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="font-body font-semibold">How do I comment on a story?</AccordionTrigger>
              <AccordionContent className="font-body">
                At the bottom of every story page, there is a "Community Voices" section. If you are logged in, you will see a text box where you can type your comment and submit it. If you are not logged in, you will be prompted to log in or sign up first.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="font-body font-semibold">What are "Boards"?</AccordionTrigger>
              <AccordionContent className="font-body">
                "Boards" are a feature for curating collections of stories around a specific theme. For example, a user could create a board dedicated to "Mediterranean Music Traditions" and add relevant stories to it. This feature is still under development.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
