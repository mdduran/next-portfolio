import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { compile } from '@mdx-js/mdx';
import { z } from 'zod';
import { projectFrontmatterSchema, type Project, type ProjectLink, type ProjectWithBody } from '@type';

// Server-only: call from getStaticProps / getStaticPaths.
const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');
const TYPE_ORDER: Record<Project['type'], number> = { game: 0, software: 1 };

function readProject(slug: string): { project: Project; content: string } {
  const file = path.join(PROJECTS_DIR, `${slug}.mdx`);
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const result = projectFrontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid frontmatter in content/projects/${slug}.mdx\n${z.prettifyError(result.error)}`);
  }

  // Resolve asset filenames to public URLs. Only set keys that exist, since
  // Next can't serialize undefined values in props.
  const project: Project = { ...result.data, slug };
  if (project.cover) project.cover = `/projects/${slug}/${project.cover}`;
  if (project.label) project.label = `/projects/${slug}/${project.label}`;

  return { project, content };
}

export function getAllProjects(): Project[] {
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => readProject(file.replace(/\.mdx$/, '')).project)
    .sort((a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type] || b.year - a.year || a.title.localeCompare(b.title));
}

export async function getProjectPage(
  slug: string
): Promise<{ project: ProjectWithBody; prev: ProjectLink | null; next: ProjectLink | null }> {
  const { project, content } = readProject(slug);
  const body = String(await compile(content, { outputFormat: 'function-body' }));

  const all = getAllProjects();
  const index = all.findIndex((p) => p.slug === slug);
  const toLink = (p?: Project): ProjectLink | null => (p ? { slug: p.slug, title: p.title } : null);

  return {
    project: { ...project, body },
    prev: toLink(all[index - 1]),
    next: toLink(all[index + 1])
  };
}
