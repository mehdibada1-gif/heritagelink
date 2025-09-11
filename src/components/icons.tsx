import React from 'react';
import { Languages, Sparkles, Paintbrush, BookOpenText, Music2 } from 'lucide-react';

export const categoryIcons: { [key: string]: React.ElementType } = {
  'Language': Languages,
  'Ritual': Sparkles,
  'Craft': Paintbrush,
  'Folklore': BookOpenText,
  'Music': Music2,
};

type CategoryIconProps = {
  category: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className }) => {
  const Icon = categoryIcons[category] || BookOpenText; // Default icon
  return <Icon className={className} />;
};
