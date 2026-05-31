import { SiteHeader } from "@/components/site-header";
import { ToolCard } from "@/components/tool-card";
import { categories, getToolsByCategory } from "@/data/tools";

export default function ToolsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero">
        <span className="eyebrow">Tool directory</span>
        <h1>Every tool grouped by the job it belongs to.</h1>
        <p>
          Keep navigation simple now, while leaving space for dedicated file,
          media, link, and AI workflows as the product grows.
        </p>
      </section>

      {categories.map((category) => (
        <section className="section" key={category.id}>
          <div className="section__heading">
            <span className="eyebrow">{category.name}</span>
            <h2>{category.description}</h2>
          </div>
          <div className="tool-grid">
            {getToolsByCategory(category.id).map((tool) => (
              <ToolCard tool={tool} key={tool.href} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
