export type ToolCategory = {
  id: string;
  name: string;
  href: string;
  description: string;
};

export type Tool = {
  name: string;
  slug: string;
  category: ToolCategory["id"];
  href: string;
  description: string;
  status: "Ready soon" | "Planned" | "Research";
  accent: string;
};

export const categories: ToolCategory[] = [
  {
    id: "pdf",
    name: "PDF",
    href: "/tools/pdf",
    description: "Compress, merge, split, convert, and protect documents.",
  },
  {
    id: "video",
    name: "Video",
    href: "/tools/video",
    description: "Transcode, compress, resize, caption, and prepare clips.",
  },
  {
    id: "image",
    name: "Image",
    href: "/tools/image",
    description: "Compress, resize, convert, remove backgrounds, and optimize.",
  },
  {
    id: "links",
    name: "Links",
    href: "/tools/links",
    description: "Short links, bio pages, saved links, and public profiles.",
  },
  {
    id: "ai",
    name: "AI",
    href: "/tools/ai",
    description: "Chatbots, voice agents, talking heads, and creative agents.",
  },
];

export const tools: Tool[] = [
  {
    name: "Compress PDF",
    slug: "compress-pdf",
    category: "pdf",
    href: "/tools/pdf/compress-pdf",
    description: "Reduce document size while keeping text and images clear.",
    status: "Ready soon",
    accent: "#e14d2a",
  },
  {
    name: "PDF Toolkit",
    slug: "pdf-toolkit",
    category: "pdf",
    href: "/tools/pdf/pdf-toolkit",
    description: "Merge, split, reorder, rotate, and protect PDF files.",
    status: "Planned",
    accent: "#d13f71",
  },
  {
    name: "Video Transcoder",
    slug: "transcoder",
    category: "video",
    href: "/tools/video/transcoder",
    description: "Convert videos between common formats and resolutions.",
    status: "Research",
    accent: "#1f8a70",
  },
  {
    name: "Compress Video",
    slug: "compress-video",
    category: "video",
    href: "/tools/video/compress-video",
    description: "Shrink clips for sharing while controlling quality and size.",
    status: "Research",
    accent: "#227c9d",
  },
  {
    name: "Image Optimizer",
    slug: "image-optimizer",
    category: "image",
    href: "/tools/image/image-optimizer",
    description: "Resize, compress, and convert images for web publishing.",
    status: "Ready soon",
    accent: "#f2a541",
  },
  {
    name: "URL Shortener",
    slug: "url-shortener",
    category: "links",
    href: "/tools/links/url-shortener",
    description: "Create short, trackable links with clean redirects.",
    status: "Ready soon",
    accent: "#5b6cfa",
  },
  {
    name: "Bio Link",
    slug: "bio-link",
    category: "links",
    href: "/tools/links/bio-link",
    description: "Publish one profile page that points to everything important.",
    status: "Planned",
    accent: "#8a5cf6",
  },
  {
    name: "Link Saver",
    slug: "link-saver",
    category: "links",
    href: "/tools/links/link-saver",
    description: "Save, tag, and search useful links from one private library.",
    status: "Planned",
    accent: "#2d9c72",
  },
  {
    name: "AI Chatbot",
    slug: "chatbot",
    category: "ai",
    href: "/tools/ai/chatbot",
    description: "Build a focused assistant with memory, tools, and guardrails.",
    status: "Planned",
    accent: "#111827",
  },
  {
    name: "Voice Agent",
    slug: "voice-agent",
    category: "ai",
    href: "/tools/ai/voice-agent",
    description: "Prototype spoken agents for calls, support, and onboarding.",
    status: "Research",
    accent: "#0f766e",
  },
  {
    name: "Talking Head",
    slug: "talking-head",
    category: "ai",
    href: "/tools/ai/talking-head",
    description: "Generate avatar videos from scripts, voices, and references.",
    status: "Research",
    accent: "#b45309",
  },
];

export function getCategory(categoryId: string) {
  return categories.find((category) => category.id === categoryId);
}

export function getToolsByCategory(categoryId: string) {
  return tools.filter((tool) => tool.category === categoryId);
}

export function getTool(categoryId: string, slug: string) {
  return tools.find((tool) => tool.category === categoryId && tool.slug === slug);
}
