export const countries = ['Italy', 'Netherlands', 'Sweden', 'Lebanon', 'Tunisia', 'Morocco'] as const;
export type Country = (typeof countries)[number];

export type User = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type Story = {
  id: string;
  title: string;
  description: string;
  category: 'Language' | 'Ritual' | 'Craft' | 'Folklore' | 'Music';
  mediaUrl: string;
  mediaType: 'image' | 'video';
  region: Country;
  author: User;
  createdAt: string; // Should be ISO 8601 format
};

export type Comment = {
  id: string;
  text: string;
  author: User;
  createdAt: string; // Should be ISO 8601 format
};

export type Board = {
  id: string;
  name: string;
  description: string;
  creator: User;
  stories: Story[];
};

export type StoryFormData = {
  title: string;
  description: string;
  category: 'Language' | 'Ritual' | 'Craft' | 'Folklore' | 'Music';
  mediaUrl: string;
  region: Country;
}
