export type Project = {
  title: string;
  projectType: 'game' | 'software';
  yearDeveloped?: number;
  platform?: string;
  genre?: string;
  accomplishments?: string;
  splashImage?: string;
  description?: string;
  downloadLink?: string;
  trailer?: string;
  website?: string;
};
