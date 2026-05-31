import Link from "next/link";
import { categories, getToolsByCategory } from "@/data/tools";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Toolhouse home">
        <span className="brand__mark">T</span>
        <span>Toolhouse</span>
      </Link>

      <nav className="nav" aria-label="Main navigation">
        {categories.map((category) => {
          const categoryTools = getToolsByCategory(category.id);

          return (
            <div className="nav__item" key={category.id}>
              <Link href={category.href}>{category.name}</Link>
              <div className="mega-menu mega-menu--category" aria-label={`${category.name} menu`}>
                <div className="mega-menu__aside">
                  <span className="eyebrow">{category.name} tools</span>
                  <h2>{category.description}</h2>
                  <p>
                    Keep this area focused on one type of work, so each domain
                    can grow without making the product feel cluttered.
                  </p>
                </div>
                <div className="mega-menu__tools">
                  {categoryTools.map((tool) => (
                    <Link className="mega-menu__tool" href={tool.href} key={tool.href}>
                      <span className="tool-card__accent" style={{ background: tool.accent }} />
                      <strong>{tool.name}</strong>
                      <small>{tool.description}</small>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        <Link href="/tools">All tools</Link>
      </nav>

      <Link className="header-cta" href="/tools">
        Browse
      </Link>
    </header>
  );
}
