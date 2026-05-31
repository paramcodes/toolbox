import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ToolCard } from "@/components/tool-card";
import { categories, getToolsByCategory, tools } from "@/data/tools";

export default function Home() {
  const priorityTools = tools.filter((tool) => tool.status === "Ready soon");

  return (
    <main>
      <SiteHeader />
      <section className="hero">
        <div className="hero__content">
          <span className="eyebrow">Utility tools, organized like a product</span>
          <h1>Build, launch, and learn from one growing tools platform.</h1>
          <p>
            A category-first workspace for PDF, video, image, link, and AI tools,
            with smooth navigation and room for serious features later.
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/tools">
              Explore tools
            </Link>
            <Link className="button button--secondary" href="/tools/video/transcoder">
              View video path
            </Link>
          </div>
        </div>
        <div className="hero__panel" aria-label="Product map preview">
          {categories.map((category) => (
            <Link className="category-row" href={category.href} key={category.id}>
              <span>{category.name}</span>
              <strong>{getToolsByCategory(category.id).length}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__heading">
          <span className="eyebrow">Start here</span>
          <h2>First tools to build</h2>
        </div>
        <div className="tool-grid">
          {priorityTools.map((tool) => (
            <ToolCard tool={tool} key={tool.href} />
          ))}
        </div>
      </section>

      <section className="section section--split">
        <div>
          <span className="eyebrow">Structure</span>
          <h2>Public URLs stay grouped by domain.</h2>
        </div>
        <div className="structure-list">
          <code>/tools/pdf/compress-pdf</code>
          <code>/tools/video/transcoder</code>
          <code>/tools/image/image-optimizer</code>
          <code>/tools/links/url-shortener</code>
          <code>/tools/ai/voice-agent</code>
        </div>
      </section>
    </main>
  );
}
