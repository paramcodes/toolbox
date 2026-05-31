import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ToolCard } from "@/components/tool-card";
import { categories, getCategory, getToolsByCategory } from "@/data/tools";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.id }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);

  if (!category) {
    notFound();
  }

  const categoryTools = getToolsByCategory(category.id);

  return (
    <main>
      <SiteHeader />
      <section className="page-hero">
        <span className="eyebrow">{category.name} tools</span>
        <h1>{category.description}</h1>
        <p>
          This category can contain simple UI-only tools first, then dedicated
          server workflows when uploads, queues, or AI providers are needed.
        </p>
      </section>
      <section className="section">
        <div className="tool-grid">
          {categoryTools.map((tool) => (
            <ToolCard tool={tool} key={tool.href} />
          ))}
        </div>
      </section>
    </main>
  );
}
