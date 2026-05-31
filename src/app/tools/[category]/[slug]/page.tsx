import Link from "next/link";
import { notFound } from "next/navigation";
import { UrlShortenerTool } from "@/components/url-shortener-tool";
import { SiteHeader } from "@/components/site-header";
import { getCategory, getTool, tools } from "@/data/tools";

export function generateStaticParams() {
  return tools.map((tool) => ({
    category: tool.category,
    slug: tool.slug,
  }));
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categoryId, slug } = await params;
  const category = getCategory(categoryId);
  const tool = getTool(categoryId, slug);

  if (!category || !tool) {
    notFound();
  }

  const isUrlShortener = tool.category === "links" && tool.slug === "url-shortener";

  return (
    <main>
      <SiteHeader />
      <section className="tool-hero">
        <Link className="back-link" href={category.href}>
          {category.name}
        </Link>
        <span className="tool-card__status">{tool.status}</span>
        <h1>{tool.name}</h1>
        <p>{tool.description}</p>
      </section>
      {isUrlShortener ? (
        <UrlShortenerTool />
      ) : (
        <section className="workspace">
          <div className="workspace__upload">
            <span className="workspace__icon" style={{ background: tool.accent }} />
            <h2>{tool.name} workspace</h2>
            <p>
              This placeholder marks where the real tool UI will go. We can build
              one feature at a time while keeping the route and navigation stable.
            </p>
            <button type="button">Coming soon</button>
          </div>
          <aside className="workspace__notes">
            <span className="eyebrow">Build notes</span>
            <p>
              Simple tools can live directly in this route. Heavy tools should move
              processing into API routes, background workers, or external services.
            </p>
          </aside>
        </section>
      )}
    </main>
  );
}
