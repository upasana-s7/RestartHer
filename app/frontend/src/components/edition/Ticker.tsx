import { TICKER_PHRASES } from '@/data/editorial';

export default function Ticker() {
  const phrases = [...TICKER_PHRASES, ...TICKER_PHRASES];
  return (
    <div className="overflow-hidden bg-burgundy py-4 text-cream" aria-label="Editorial ticker">
      <div className="ticker-track flex w-max whitespace-nowrap">
        {phrases.map((phrase, index) => (
          <span
            key={`${phrase}-${index}`}
            aria-hidden={index >= TICKER_PHRASES.length}
            className="flex items-center font-label text-sm font-semibold uppercase tracking-[0.18em]"
          >
            {phrase}
            <span className="mx-8 text-cream/50" aria-hidden="true">
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
