import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";

const PHOTOS = [
  { src: "/images/gallery/photo-01.jpg", captionKey: "caption1" as const },
  { src: "/images/gallery/photo-02.jpg", captionKey: "caption2" as const },
  { src: "/images/gallery/photo-03.jpg", captionKey: "caption3" as const },
  { src: "/images/gallery/photo-04.jpg", captionKey: "caption4" as const },
  { src: "/images/gallery/photo-05.jpg", captionKey: "caption5" as const },
  { src: "/images/gallery/photo-06.jpg", captionKey: "caption6" as const },
  { src: "/images/gallery/photo-07.jpg", captionKey: "caption7" as const },
  { src: "/images/gallery/photo-08.jpg", captionKey: "caption8" as const },
  { src: "/images/gallery/photo-09.jpg", captionKey: "caption9" as const },
];

export default async function GaleriaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("GalleryPage");

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PHOTOS.map((p, i) => (
            <li key={p.src} className="group">
              <figure>
                <div className="overflow-hidden rounded-sm border border-espresso/15 bg-cream-2/40">
                  <Image
                    src={p.src}
                    alt={t(p.captionKey)}
                    width={1200}
                    height={1200}
                    className="aspect-square h-auto w-full object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={i < 3}
                  />
                </div>
                <figcaption className="mt-3 flex items-baseline gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-terracotta">
                    N°&nbsp;{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-base italic text-espresso">
                    {t(p.captionKey)}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </div>
  );
}
