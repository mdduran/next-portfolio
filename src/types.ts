export type Project = {
  title: string;
  yearDeveloped: number;
  platform?: string;
  genre?: string;
  accomplishments: string;
  splashImage?: string;
  description: string;
  downloadLink?: string;
  trailer?: string;
  website?: string;
};

export type ProjectState = {
    selectedProject: Project;
}
