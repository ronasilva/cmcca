import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { GalleryGrid } from "@/components/GalleryGrid";

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

  const photos = PHOTOS.map((p) => ({ src: p.src, caption: t(p.captionKey) }));

  return (
    <div className="flex flex-col flex-1 text-espresso">
      <Header />

      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <GalleryGrid
          photos={photos}
          labels={{
            close: t("close"),
            previous: t("previous"),
            next: t("next"),
          }}
        />
      </section>

      <Footer />
    </div>
  );
}
