import { z } from 'zod';

// Frontmatter of content/projects/<slug>.mdx. The slug comes from the filename.
export const projectFrontmatterSchema = z.strictObject({
  title: z.string().min(1),
  type: z.enum(['game', 'software']),
  year: z.number().int(),
  summary: z.string().min(1),
  platform: z.string().optional(),
  genre: z.string().optional(),
  tags: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  trailer: z.url().optional(),
  website: z.url().optional(),
  download: z.url().optional(),
  // Filenames inside public/projects/<slug>/
  cover: z.string().optional(),
  label: z.string().optional(),
  featured: z.boolean().default(false)
});

export type ProjectType = z.infer<typeof projectFrontmatterSchema>['type'];

export type Project = z.infer<typeof projectFrontmatterSchema> & {
  slug: string;
};

export type ProjectLink = Pick<Project, 'slug' | 'title'>;

export type ProjectWithBody = Project & {
  // MDX compiled to a function body (see MdxContent)
  body: string;
};
