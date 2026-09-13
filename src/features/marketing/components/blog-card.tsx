import Image from "next/image";
import Link from "next/link";

import { formatDate, toIsoDate } from "@/shared/utils/format";

export const SERVICE_BLOG_IMAGES: Record<string, string> = {
  "architecting-real-world-software-discovery-vs-delivery": "/images/blog/strategy-discovery.jpg",
  "designing-for-operational-density-high-stakes-ux": "/images/blog/product-ux-design.jpg",
  "zero-jank-web-engineering-nextjs-core-web-vitals": "/images/blog/web-digital-experiences.jpg",
  "engineering-resilient-enterprise-portals-rbac-relational-data": "/images/blog/application-development.jpg",
  "infrastructure-as-discipline-containers-cicd-production-reliability": "/images/blog/cloud-infrastructure.jpg",
  "practical-ai-enterprise-systems-resilient-llm-pipelines": "/images/blog/ai-intelligent-automation.jpg",
  "event-driven-system-integration-webhooks-resilient-apis": "/images/blog/data-integrations-systems.jpg",
  "beyond-day-one-continuous-observability-codebase-evolution": "/images/blog/deployment-support-continuous-engineering.jpg",
};

export interface BlogCardData {
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  category: { name: string; slug: string } | null;
  coverMedia: { url: string | null; altText?: string | null } | null;
  tags?: { name: string; slug: string }[] | string[];
}

export function BlogCard({
  post,
  priority = false,
}: {
  post: BlogCardData;
  priority?: boolean;
}) {
  const imageUrl =
    post.coverMedia?.url ||
    SERVICE_BLOG_IMAGES[post.slug] ||
    "/images/blog/strategy-discovery.jpg";

  return (
    <article className="group mcx-card flex flex-col justify-between overflow-hidden rounded-2xl border border-black/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
      <div>
        {/* Card Cover Illustration */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-ice mb-4">
          <Image
            src={imageUrl}
            alt={post.coverMedia?.altText || post.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Category & Date */}
        <div className="flex items-center gap-2 text-[11.5px] font-semibold tracking-wider text-ink-muted uppercase">
          <span>{post.category?.name || "INSIGHTS"}</span>
          {post.publishedAt ? (
            <>
              <span className="text-black/20">•</span>
              <time dateTime={toIsoDate(post.publishedAt)}>
                {formatDate(post.publishedAt)}
              </time>
            </>
          ) : null}
        </div>

        {/* Post Title */}
        <h3 className="mt-2.5 text-[18px] sm:text-[19px] font-semibold leading-snug tracking-[-0.015em] text-ink group-hover:text-brand transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt ? (
          <p className="mt-2.5 line-clamp-3 text-[14px] leading-relaxed text-ink-muted">
            {post.excerpt}
          </p>
        ) : null}
      </div>

      {/* Card Action Link */}
      <div className="mt-6 pt-4 border-t border-hairline-light flex items-center justify-between">
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink group-hover:text-brand transition-colors"
        >
          Read more
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}
