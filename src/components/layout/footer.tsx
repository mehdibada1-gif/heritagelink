import Link from "next/link";
import { Landmark } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background/95">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 py-6 sm:flex-row">
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-muted-foreground">
            © 2025 Heritagelink. All rights reserved by{' '}
            <a
                href="https://dare4.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
            >
                Dare4.0
            </a>
            </p>
        </div>
      </div>
    </footer>
  );
}
