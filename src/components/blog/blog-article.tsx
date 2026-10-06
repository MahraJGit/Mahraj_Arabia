import { LexicalArticle } from "@/components/blog/lexical-article";
import type { PublicMedia } from "@/lib/public/media";

export function BlogArticleBody({
  data,
  mediaById = {},
}: {
  data: unknown;
  mediaById?: Record<string, PublicMedia>;
}) {
  return (
    <div
      className={[
        "max-w-none text-base leading-relaxed text-body",
        "[&_h2]:mt-12 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink",
        "[&_h3]:mt-9 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink",
        "[&_h2+p]:mt-3 [&_h3+p]:mt-3",
        "[&_p]:mt-5 [&_p]:max-w-[68ch]",
        "[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-6",
        "[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:ps-6",
        "[&_li]:marker:text-brand [&_li]:ps-1",
        "[&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-brand-dark",
        "[&_blockquote]:mt-7 [&_blockquote]:rounded-md [&_blockquote]:bg-surface-alt",
        "[&_blockquote]:border-s-4 [&_blockquote]:border-brand [&_blockquote]:px-5 [&_blockquote]:py-4",
        "[&_blockquote]:text-ink [&_blockquote]:italic",
        "[&_figure]:my-8 [&_figure]:max-w-full",
        "[&_figure_img]:mt-0 [&_figure_img]:h-auto [&_figure_img]:w-full [&_figure_img]:rounded-md [&_figure_img]:bg-surface-alt",
        "[&_hr]:my-10 [&_hr]:border-border",
        "[&_strong]:font-semibold [&_strong]:text-ink",
        "[&_pre]:mt-6 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-ink [&_pre]:p-4 [&_pre]:text-sm [&_pre]:text-white",
        "[&_figcaption]:mt-2 [&_figcaption]:text-sm [&_figcaption]:text-body",
      ].join(" ")}
    >
      <LexicalArticle data={data} mediaById={mediaById} />
    </div>
  );
}
