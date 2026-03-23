/**
 * Copyright 2025 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DOCS_ROOT = path.join(process.cwd(), "..", "..", "docs");

export interface DocPage {
  version: string;
  slug: string[];
  title: string;
  description: string;
  content: string;
}

export interface NavGroup {
  group: string;
  pages: (string | { group: string; openapi: string })[];
}

export interface NavVersion {
  version: string;
  groups: NavGroup[];
}

export function getNavigation(): NavVersion[] {
  const docsJson = JSON.parse(
    fs.readFileSync(path.join(DOCS_ROOT, "docs.json"), "utf-8"),
  );
  return docsJson.navigation.versions;
}

export function getAllPages(): { version: string; slug: string[] }[] {
  const nav = getNavigation();
  const pages: { version: string; slug: string[] }[] = [];

  for (const ver of nav) {
    for (const group of ver.groups) {
      for (const page of group.pages) {
        if (typeof page === "string") {
          const parts = page.split("/");
          const version = parts[0];
          const slug = parts.slice(1);
          pages.push({ version, slug });
        }
      }
    }
  }

  return pages;
}

export function getPage(version: string, slug: string[]): DocPage | null {
  const filePath = path.join(DOCS_ROOT, version, ...slug) + ".mdx";

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    version,
    slug,
    title: (data.title as string) || slug[slug.length - 1],
    description: (data.description as string) || "",
    content,
  };
}

export function getNavGroups(version: string): NavGroup[] {
  const nav = getNavigation();
  const ver = nav.find((v) => v.version === version);
  return ver?.groups || [];
}
