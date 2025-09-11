import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
  where,
  Query,
  DocumentData,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Story, Comment, Board, User, StoryFormData, Country } from './types';

// Helper to convert Firestore doc to Story, fetching author if needed
async function docToStory(docSnap: any): Promise<Story> {
  const data = docSnap.data();
  // The author is denormalized, so no extra fetch is needed here.
  return {
    id: docSnap.id,
    ...data,
    createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
  } as Story;
}

export const getStories = async (region?: Country): Promise<Story[]> => {
  let storiesQuery: Query<DocumentData> = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));

  if (region) {
    storiesQuery = query(storiesQuery, where('region', '==', region));
  }

  const storySnapshot = await getDocs(storiesQuery);
  const stories: Story[] = await Promise.all(storySnapshot.docs.map(docToStory));
  return stories;
};

export const getStoriesByAuthorId = async (authorId: string): Promise<Story[]> => {
    const storiesCol = collection(db, 'stories');
    const q = query(storiesCol, where('author.id', '==', authorId), orderBy('createdAt', 'desc'));
    const storySnapshot = await getDocs(q);
    const stories: Story[] = await Promise.all(storySnapshot.docs.map(docToStory));
    return stories;
}

export const getStoryById = async (id: string): Promise<Story | undefined> => {
  const storyDocRef = doc(db, 'stories', id);
  const storyDoc = await getDoc(storyDocRef);
  if (storyDoc.exists()) {
    return await docToStory(storyDoc);
  }
  return undefined;
};

export const getCommentsByStoryId = async (storyId: string): Promise<Comment[]> => {
  const commentsColRef = collection(db, 'stories', storyId, 'comments');
  const commentsSnapshot = await getDocs(query(commentsColRef, orderBy('createdAt', 'desc')));
  
  return commentsSnapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
    } as Comment;
  });
};

export const addComment = async (storyId: string, commentText: string, author: User) => {
    const commentsColRef = collection(db, 'stories', storyId, 'comments');
    await addDoc(commentsColRef, {
      text: commentText,
      author: author,
      createdAt: serverTimestamp(),
    });
}

export const addStory = async (storyData: StoryFormData, author: User) => {
    const storiesCol = collection(db, 'stories');
    const newDocRef = await addDoc(storiesCol, {
        ...storyData,
        author,
        mediaType: 'image', // Assuming image for now
        createdAt: serverTimestamp(),
    });
    return newDocRef.id;
}

export const updateStoryInDb = async (storyId: string, storyData: StoryFormData) => {
    const storyDocRef = doc(db, 'stories', storyId);
    await updateDoc(storyDocRef, storyData);
}

export const deleteStoryFromDb = async (storyId: string) => {
    const storyDocRef = doc(db, 'stories', storyId);
    await deleteDoc(storyDocRef);
}


export const getBoards = async (): Promise<Board[]> => {
  // This is a complex operation. For now, we return mock data.
  // A real implementation would involve fetching boards and then resolving story references.
  return [];
};


// Seeding function
export async function seedDatabase() {
  try {
    const storiesCol = collection(db, 'stories');
    const q = query(storiesCol, limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return { success: false, message: 'Database already has stories.' };
    }

    const seedUser: User = {
        id: 'seed_user',
        name: 'Heritage Contributor',
        avatarUrl: `https://i.pravatar.cc/150?u=seed_user`,
    };

    const sampleStories: Omit<Story, 'id' | 'createdAt'>[] = [
      {
        title: 'The Art of Dabke in Lebanon',
        description: 'Dabke is a traditional Levantine folk dance performed at weddings and joyous occasions. The dance line forms from right to left, with the leader alternating between facing the audience and the other dancers. It symbolizes community solidarity and is a vibrant expression of cultural identity.',
        category: 'Ritual',
        mediaUrl: 'https://picsum.photos/800/600?random=1',
        mediaType: 'image',
        region: 'Lebanon',
        author: seedUser,
      },
      {
        title: 'Swedish Midsummer: A Celebration of Light',
        description: 'Midsummer is one of the most important holidays in Sweden. It involves decorating and dancing around a maypole, eating pickled herring with new potatoes, and singing traditional drinking songs. Families and friends gather in the countryside to celebrate the longest day of the year.',
        category: 'Ritual',
        mediaUrl: 'https://picsum.photos/800/600?random=2',
        mediaType: 'image',
        region: 'Sweden',
        author: seedUser,
      },
      {
        title: 'Moroccan Zellige: The Art of Geometric Tiles',
        description: 'Zellige is a style of mosaic tilework made from individually chiseled geometric tiles. This intricate art form is a hallmark of Moroccan architecture, adorning walls, floors, and fountains with stunning patterns. Each piece is handcrafted, making every installation unique.',
        category: 'Craft',
        mediaUrl: 'https://picsum.photos/800/600?random=3',
        mediaType: 'image',
        region: 'Morocco',
        author: seedUser,
      },
      {
        title: 'The Gnaoua Music of Tunisia',
        description: 'Gnaoua music is a rich repertoire of ancient African Islamic spiritual religious songs and rhythms. Its well-preserved heritage combines ritual poetry with traditional music and dancing. Originally practiced for healing, it is now a major part of Tunisia\'s cultural life.',
        category: 'Music',
        mediaUrl: 'https://picsum.photos/800/600?random=4',
        mediaType: 'image',
        region: 'Tunisia',
        author: seedUser,
      },
      {
        title: 'Dutch Windmills: Engineering Marvels',
        description: 'The iconic windmills of the Netherlands are a symbol of the Dutch battle against water. For centuries, these structures have been used to drain land, mill grain, and saw wood. The historic windmills at Kinderdijk are a UNESCO World Heritage site, showcasing Dutch ingenuity.',
        category: 'Craft',
        mediaUrl: 'https://picsum.photos/800/600?random=5',
        mediaType: 'image',
        region: 'Netherlands',
        author: seedUser,
      },
       {
        title: 'The Tarantella: Italy\'s Healing Dance',
        description: 'The Tarantella is a lively folk dance from Southern Italy, once believed to be a cure for the venomous bite of a tarantula. Its frenetic pace and passionate music were thought to sweat out the poison. Today, it is a joyful dance performed at festivals and celebrations.',
        category: 'Folklore',
        mediaUrl: 'https://picsum.photos/800/600?random=6',
        mediaType: 'image',
        region: 'Italy',
        author: seedUser,
      }
    ];

    for (const storyData of sampleStories) {
      await addDoc(storiesCol, {
        ...storyData,
        createdAt: serverTimestamp(),
      });
    }

    return { success: true, message: `${sampleStories.length} stories have been added.` };
  } catch (error) {
    console.error("Error seeding database: ", error);
    if (error instanceof Error) {
        return { success: false, message: `An error occurred: ${error.message}` };
    }
    return { success: false, message: 'An unknown error occurred during seeding.' };
  }
}
