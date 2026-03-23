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

import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllPages, getPage, getNavGroups } from "@/lib/docs";
import { mintlifyComponents } from "@/components/mintlify";

export function generateStaticParams() {
  return getAllPages()
    .filter(({ version }) => version === "stable")
    .map(({ version, slug }) => ({
      version,
      slug,
    }));
}

function Sidebar({
  version,
  currentSlug,
}: {
  version: string;
  currentSlug: string;
}) {
  const groups = getNavGroups(version);

  return (
    <nav className="sidebar">
      <div className="sidebar-header">Kagenti ADK</div>
      {groups.map((group) => (
        <div key={group.group}>
          <div className="nav-group-title">{group.group}</div>
          {group.pages.map((page) => {
            if (typeof page !== "string") return null;
            const parts = page.split("/");
            const slug = parts.slice(1).join("/");
            const label = parts[parts.length - 1]
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
            return (
              <Link
                key={page}
                href={`/${page}`}
                className={`nav-link${slug === currentSlug ? " active" : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ version: string; slug: string[] }>;
}) {
  const { version, slug } = await params;
  const page = getPage(version, slug);

  if (!page) {
    notFound();
  }

  // Strip embedme comments and HTML style string attributes (MDX requires object syntax)
  const cleanContent = page.content
    .replace(/\{\/\*\s*<!--\s*embedme\s+[^>]+-->\s*\*\/\}/g, "")
    .replace(/\sstyle="[^"]*"/g, "");

  return (
    <div className="layout">
      <Sidebar version={version} currentSlug={slug.join("/")} />
      <main className="main-content">
        <div className="callout callout-warning" style={{ marginBottom: "1.5rem" }}>
          <div className="callout-content">
            This documentation is under construction. Content may be incomplete or undergoing change.
          </div>
        </div>
        <h1 className="page-title">{page.title}</h1>
        {page.description && (
          <p className="page-description">{page.description}</p>
        )}
        <div className="prose">
          <MDXRemote
            source={cleanContent}
            components={mintlifyComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </div>
      </main>
    </div>
  );
}
