import type { Article, Testimonial } from '@/types/content';

export const INSPIRATION_QUOTES = [
  'Your career break does not define your potential.',
  'Experience does not expire when you step away from it.',
  'A pause is a chapter, not the whole story.',
  'Every comeback starts with one small, honest step.',
];

export const TICKER_PHRASES = [
  'Her experience matters',
  'Her career isn’t over',
  'Her next chapter starts here',
  'She is not starting from zero',
  'She deserves another opportunity',
];

export const ARTICLES: Article[] = [
  {
    id: 'her-story',
    number: '01',
    category: 'Her Story',
    headline: 'She Took a Break. She Didn’t Lose Her Ambition.',
    preview:
      'Sometimes life asks us to pause. But a pause does not mean the dream disappears. Discover how a career break can become the beginning of a different kind of strength.',
    body: [
      'Life rarely asks permission before it changes our plans. A new baby, a family illness, a move across the country, or simply the need to step back for a while can pull a career off its path. When that happens, it is easy to believe that the ambition went with it.',
      'It usually did not. Ambition tends to live quietly. It shows up as the book you kept meaning to read, the idea you sketched on the back of a receipt, or the question you still ask yourself when you see someone doing work you admire.',
      'A career break can also teach things a steady job never did: how to manage competing priorities, how to make hard decisions under pressure, and how to keep going when nobody is watching. These strengths belong to you. The next step is simply deciding which direction you want to move in.',
    ],
    readingTime: '4 min read',
    image: 'https://images.pexels.com/photos/4963415/pexels-photo-4963415.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'A professional woman in a suit walking confidently through an urban street',
  },
  {
    id: 'skills-confidence',
    number: '02',
    category: 'Skills & Confidence',
    headline: 'Her Skills Were Never Gone. They Were Waiting to Be Rediscovered.',
    preview:
      'Experience does not disappear when you step away. Sometimes it simply needs a little space, practice, and confidence to find its way back.',
    body: [
      'Many women who return to work say the same thing: they feel rusty. The tools have changed, the vocabulary has shifted, and the last time they used a particular system may feel like a lifetime ago. That feeling is real, but it does not mean the underlying knowledge is gone.',
      'Skills often fade in their details long before they fade in their logic. Someone who once managed budgets, coordinated teams, or wrote clear reports still knows how to do those things. What she often needs is a little practice with current tools and a chance to describe her experience in today’s language.',
      'A helpful first exercise is to list what you did, not just the job titles you held. Write down the problems you solved, the people you supported, and the results you helped create. You may be surprised how much of it translates to the roles you are considering now.',
    ],
    readingTime: '5 min read',
    image: 'https://images.pexels.com/photos/9159664/pexels-photo-9159664.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'A woman studying at a desk with a laptop and workbook',
  },
  {
    id: 'different-timeline',
    number: '03',
    category: 'A Different Timeline',
    headline: 'A Different Timeline. The Same Potential.',
    preview:
      'Careers are not competitions against the clock. There is no single correct age, path, or timeline for building a professional future.',
    body: [
      'There is a quiet pressure in many careers to be at a certain place by a certain age. Those milestones are rarely written down anywhere, yet they can make a pause feel like falling behind.',
      'Careers are rarely straight lines. Many professionals change fields, take sabbaticals, study later in life, or build a second career after years in another profession. Experience gained in one season often becomes an advantage in the next.',
      'A different timeline is not a lesser timeline. Setting a pace that fits your energy, your responsibilities, and your goals is a sensible way to rebuild. Progress made in small, steady steps still counts.',
    ],
    readingTime: '4 min read',
    image: 'https://images.pexels.com/photos/5717324/pexels-photo-5717324.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'A businesswoman walking past a glass-fronted office building',
  },
  {
    id: 'courage-to-begin',
    number: '04',
    category: 'The Comeback',
    headline: 'The Courage to Begin Again.',
    preview:
      'Beginning again is not starting over from nothing. It is moving forward with everything you have learned along the way.',
    body: [
      'Beginning again takes a particular kind of courage. It means sending the first message, updating an old résumé, or admitting in an interview that you have been away for a while. None of these things is easy, and all of them are worth doing.',
      'Starting again does not mean starting from nothing. Every project you completed, every difficult conversation you handled, and every lesson you learned along the way is still part of who you are. A comeback is built on that foundation.',
      'You do not need every answer before taking the next step. Choose one small action for this week, take it, and let the following one become clearer from there.',
    ],
    readingTime: '3 min read',
    image: 'https://images.pexels.com/photos/19905192/pexels-photo-19905192.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'A close-up of a woman writing goals in a notebook',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'maya',
    name: 'Maya R.',
    journey: 'Former marketing manager · returning after five years',
    quote: 'I thought my résumé had a hole in it. It turned out to have a story, and I learned how to tell it.',
    body: [
      'After five years at home with my children, I assumed recruiters would see only the gap. Writing down the campaigns I had run before the break changed how I saw my own experience.',
      'The story I now tell is simple: what I did, what I learned while away, and what I want to do next. It has made every conversation feel more natural.',
    ],
    portrait: 'https://images.pexels.com/photos/4428045/pexels-photo-4428045.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    portraitAlt: 'Portrait of a woman in a tailored blazer',
  },
  {
    id: 'lena',
    name: 'Lena K.',
    journey: 'Data analyst · after a caregiving break',
    quote: 'I did not need someone to tell me I was capable. I needed a clear path that showed me how to prove it.',
    body: [
      'Caring for a family member took most of my energy for two years. When I felt ready to return, I was unsure which skills still counted.',
      'Breaking my goal into small weekly tasks gave me momentum. Each finished task reminded me that I was still building something.',
    ],
    portrait: 'https://images.pexels.com/photos/13801472/pexels-photo-13801472.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    portraitAlt: 'Portrait of a professional woman with a briefcase outdoors',
  },
  {
    id: 'aisha',
    name: 'Aisha O.',
    journey: 'Finance professional · after relocating',
    quote: 'Starting small made the difference. A few focused hours each week added up faster than I expected.',
    body: [
      'Moving countries meant starting my professional life again from a new base. I could not commit to long study sessions, so I learned in short bursts.',
      'Within a few months I had refreshed my technical knowledge and started conversations I would have been too nervous to start a year earlier.',
    ],
    portrait: 'https://images.pexels.com/photos/5908493/pexels-photo-5908493.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    portraitAlt: 'Smiling woman with glasses working on a laptop',
  },
  {
    id: 'grace',
    name: 'Grace T.',
    journey: 'HR specialist · moving into a new field',
    quote: 'Coming back did not mean going backwards. My people skills became the bridge into a new role.',
    body: [
      'I wanted to move from HR into a new area, and I felt I had to start from scratch. In reality, the skills I had built in hiring and team support were exactly what the new role needed.',
      'Seeing my experience as a foundation rather than a gap changed how confidently I approached every application.',
    ],
    portrait: 'https://images.pexels.com/photos/8530137/pexels-photo-8530137.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    portraitAlt: 'Two businesswomen in conversation in a bright office',
  },
];
