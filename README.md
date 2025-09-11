# Heritagelink

This is a Next.js application for preserving and sharing cultural stories from around the world. It is built with Next.js, TypeScript, Tailwind CSS, ShadCN UI, Firebase, and Genkit.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Deploying to Vercel

This application is ready to be deployed to Vercel.

### 1. Push to GitHub

Push your code to a GitHub repository.

### 2. Import Project to Vercel

Log in to your Vercel account and import the project from your GitHub repository. Vercel will automatically detect that it is a Next.js application and configure the build settings.

### 3. Configure Environment Variables

For the application to connect to your Firebase project, you must add your Firebase configuration as Environment Variables in Vercel.

Go to your project's **Settings > Environment Variables** in Vercel and add the following keys with their corresponding values from your Firebase project configuration:

- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`

### 4. Deploy

Once the environment variables are set, trigger a new deployment from your Vercel project dashboard. Vercel will build and deploy your application.

### 5. Set Firestore Security Rules

For the database to function correctly, you must update your Firestore security rules in the Firebase Console.

Navigate to **Firestore Database > Rules** and replace the existing rules with the following:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Stories can be read by anyone.
    // They can only be created, updated, or deleted by authenticated users
    // who are the author of the story.
    match /stories/{storyId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.author.id == request.auth.uid;

      // Comments can be read by anyone.
      // They can only be created by authenticated users.
      // Comments cannot be edited or deleted through the client.
      match /comments/{commentId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow update, delete: if false;
      }
    }

    // Boards are not yet implemented.
    match /boards/{boardId} {
      allow read, write: if false;
    }
  }
}
```

Click **Publish** to save the new rules. Your application should now be fully functional.
