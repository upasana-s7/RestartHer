import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { Section } from '@/hooks/useSectionRoute';
import { ARTICLES, TESTIMONIALS } from '@/data/editorial';
import type { Article, Testimonial } from '@/types/content';
import Masthead from '@/components/edition/Masthead';
import Hero from '@/components/edition/Hero';
import Ticker from '@/components/edition/Ticker';
import EmotionalIntro from '@/components/edition/EmotionalIntro';
import ArticlePanel, { type Tone } from '@/components/edition/ArticlePanel';
import ReadingModal from '@/components/edition/ReadingModal';
import Statement from '@/components/edition/Statement';
import Testimonials from '@/components/edition/Testimonials';
import JourneyCards from '@/components/edition/JourneyCards';
import FinalCta from '@/components/edition/FinalCta';

const ARTICLE_TONES: Tone[] = ['white', 'burgundy', 'cream', 'ink'];

interface EditionPageProps {
  onNavigate: (section: Section) => void;
}

export default function EditionPage({ onNavigate }: EditionPageProps) {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set());
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    if (!userId) return;
    try { setSavedArticles(new Set(JSON.parse(localStorage.getItem('restarther_saved_stories_v1_' + userId) || '[]') as string[])); }
    catch { setSavedArticles(new Set()); }
  }, [userId]);

  const toggleSavedStory = (articleId: string) => setSavedArticles((current) => {
    const next = new Set(current);
    if (next.has(articleId)) next.delete(articleId); else next.add(articleId);
    if (userId) localStorage.setItem('restarther_saved_stories_v1_' + userId, JSON.stringify(Array.from(next)));
    return next;
  });

  return (
    <div>
      <Masthead />
      <Hero onNavigate={onNavigate} />
      <Ticker />
      <EmotionalIntro onNavigate={onNavigate} />

      <section id="stories" className="scroll-mt-24 px-5 pb-12 sm:px-8 lg:px-12" aria-label="Editorial stories">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          {ARTICLES.map((article, index) => (
            <ArticlePanel
              key={article.id}
              article={article}
              tone={ARTICLE_TONES[index]}
              imageOnLeft={index % 2 === 0}
              onRead={setActiveArticle}
              saved={savedArticles.has(article.id)}
              onToggleSave={() => toggleSavedStory(article.id)}
            />
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-6xl font-label text-xs uppercase tracking-wider text-muted">
          Editorial content is illustrative and written for this prototype.
        </p>
      </section>

      <Statement />
      <Testimonials testimonials={TESTIMONIALS} onRead={setActiveTestimonial} />
      <JourneyCards onNavigate={onNavigate} />
      <FinalCta onNavigate={onNavigate} />

      <ReadingModal
        open={activeArticle !== null}
        onClose={() => setActiveArticle(null)}
        eyebrow={activeArticle ? `${activeArticle.number} · ${activeArticle.category}` : ''}
        title={activeArticle?.headline ?? ''}
        lead={activeArticle?.preview}
        paragraphs={activeArticle?.body ?? []}
        disclaimer="Illustrative editorial content written for this prototype. It is not a real person’s story."
      />

      <ReadingModal
        open={activeTestimonial !== null}
        onClose={() => setActiveTestimonial(null)}
        eyebrow="Her comeback story · Illustrative sample"
        title={activeTestimonial?.name ?? ''}
        subtitle={activeTestimonial?.journey}
        lead={activeTestimonial?.quote}
        paragraphs={activeTestimonial?.body ?? []}
        disclaimer="Sample testimonial for this prototype. Real stories will be shown only with the author’s consent."
      />
    </div>
  );
}
