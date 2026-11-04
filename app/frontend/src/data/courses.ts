import type { Course } from '@/types/content';

// SAP Hackathon catalogue: six SAP courses first, followed by four partner courses.
export const COURSES: Course[] = [
  {
    id: 'sap-analytics-cloud-data-analyst', title: 'Becoming a Certified Data Analyst in SAP Analytics Cloud', provider: 'SAP Learning',
    providerUrl: 'https://learning.sap.com/learning-journeys/becoming-a-certified-data-analyst-in-sap-analytics-cloud', category: 'Data Analytics',
    skills: ['Data analysis', 'Data modelling', 'Dashboards', 'Data visualisation', 'Planning', 'SAP Analytics Cloud'], level: 'Intermediate',
    duration: 'Self-paced learning journey', cost: 'Free', hasCertificate: true,
    certificateNote: 'Learning journey prepares for SAP certification; certification exam may have separate requirements or costs. Check SAP Learning.',
    summary: 'Build skills in creating models and stories, analysing data, and working with planning features in SAP Analytics Cloud.',
  },
  {
    id: 'sap-business-data-cloud', title: 'Exploring SAP Business Data Cloud', provider: 'SAP Learning',
    providerUrl: 'https://learning.sap.com/learning-journeys/exploring-sap-business-data-cloud', category: 'Data Analytics',
    skills: ['Business data', 'Data products', 'Data strategy', 'SAP Datasphere', 'Analytics'], level: 'Beginner',
    duration: 'Self-paced learning journey', cost: 'Free', hasCertificate: false,
    certificateNote: 'Check the learning journey page for current completion recognition.',
    summary: 'Understand business data challenges, SAP Business Data Cloud architecture, data products and analytics use cases.',
  },
  {
    id: 'sap-bw4hana', title: 'Exploring SAP BW/4HANA', provider: 'SAP Learning',
    providerUrl: 'https://learning.sap.com/learning-journeys/exploring-sap-bw-4hana', category: 'Data Analytics',
    skills: ['Data warehousing', 'Data modelling', 'Data integration', 'Analytics', 'SAP BW/4HANA'], level: 'Intermediate',
    duration: 'Self-paced learning journey', cost: 'Free', hasCertificate: false,
    certificateNote: 'Check SAP Learning for current completion recognition and certification pathways.',
    summary: 'Explore core data warehousing concepts, modelling, integration, analytics and lifecycle management.',
  },
  {
    id: 'sap-ai-fundamentals', title: 'Introducing AI Fundamentals', provider: 'SAP Learning',
    providerUrl: 'https://learning.sap.com/courses/introducing-ai-fundamentals', category: 'Artificial Intelligence',
    skills: ['Artificial intelligence', 'Machine learning', 'Deep learning', 'Generative AI', 'Responsible AI'], level: 'Beginner',
    duration: 'Self-paced course', cost: 'Free', hasCertificate: true,
    certificateNote: 'Verify current course-completion recognition and requirements on SAP Learning.',
    summary: 'Refresh foundational AI concepts, understand machine learning and generative AI, and explore responsible AI in business.',
  },
  {
    id: 'sap-generative-ai-hub', title: "Solving Business Problems using SAP's Generative AI Hub", provider: 'SAP Learning',
    providerUrl: 'https://learning.sap.com/learning-journeys/solving-business-problems-using-sap-s-generative-ai-hub', category: 'Artificial Intelligence',
    skills: ['Generative AI', 'Large language models', 'Prompt engineering', 'AI workflows', 'SAP AI Core'], level: 'Intermediate',
    duration: 'Self-paced learning journey', cost: 'Free', hasCertificate: false,
    certificateNote: 'Check the SAP Learning page for current completion recognition and certification options.',
    summary: 'Learn how SAP Generative AI Hub supports model access, prompt workflows and grounded enterprise AI solutions.',
  },
  {
    id: 'sap-s4hana-cloud', title: 'Implementing SAP S/4HANA Cloud Public Edition', provider: 'SAP Learning',
    providerUrl: 'https://learning.sap.com/learning-journeys/implementing-sap-s-4hana-cloud-public-edition', category: 'Business & Technology',
    skills: ['ERP', 'Business processes', 'Cloud implementation', 'Data migration', 'SAP S/4HANA'], level: 'Advanced',
    duration: 'Self-paced learning journey', cost: 'Free', hasCertificate: true,
    certificateNote: 'Learning journey supports certification preparation; exam conditions and fees may apply.',
    summary: 'Understand implementation tasks, business-process configuration, integrations, data migration and testing.',
  },
  {
    id: 'ibm-data-analytics', title: 'Data Analytics and AI Learning', provider: 'IBM SkillsBuild',
    providerUrl: 'https://skillsbuild.org/', category: 'Data Analytics',
    skills: ['Data analytics', 'AI', 'Data literacy', 'Professional skills'], level: 'Beginner',
    duration: 'Varies by learning path', cost: 'Free', hasCertificate: true,
    certificateNote: 'IBM SkillsBuild offers selected credentials; eligibility and completion requirements vary.',
    summary: 'Explore IBM learning paths and digital credentials in data, AI and workplace skills.',
  },
  {
    id: 'cisco-data-analytics', title: 'Data Analytics Essentials', provider: 'Cisco Skills for All',
    providerUrl: 'https://skillsforall.com/', category: 'Data Analytics',
    skills: ['Data analytics', 'Data visualisation', 'Data storytelling'], level: 'Beginner',
    duration: 'Self-paced; check provider', cost: 'Free', hasCertificate: true,
    certificateNote: 'Check Cisco Skills for All for current course availability and digital-badge conditions.',
    summary: 'Explore Cisco\'s entry-level data analytics learning and practical data skills.',
  },
  {
    id: 'google-data-analytics', title: 'Google Data Analytics Certificate', provider: 'Google Career Certificates',
    providerUrl: 'https://grow.google/certificates/data-analytics/', category: 'Data Analytics',
    skills: ['Data analysis', 'Spreadsheets', 'SQL', 'Visualisation', 'R'], level: 'Beginner',
    duration: 'Self-paced; provider estimate varies', cost: 'Paid', hasCertificate: true,
    certificateNote: 'Professional certificate subscription or fees may apply; check Google for current pricing.',
    summary: 'Build job-relevant data analytics foundations through Google\'s professional certificate programme.',
  },
  {
    id: 'microsoft-powerbi', title: 'Power BI Learning Paths', provider: 'Microsoft Learn',
    providerUrl: 'https://learn.microsoft.com/training/powerplatform/power-bi', category: 'Data Analytics',
    skills: ['Power BI', 'Data modelling', 'Dashboards', 'Data visualisation'], level: 'Beginner',
    duration: 'Self-paced modules', cost: 'Free', hasCertificate: false,
    certificateNote: 'Learning modules are free; separate Microsoft certification exams may cost extra.',
    summary: 'Learn to connect, model and visualise data with Power BI using Microsoft\'s official training.',
  },
];

export const COURSE_CATEGORIES = Array.from(new Set(COURSES.map((course) => course.category)));
export const COURSE_PROVIDERS = Array.from(new Set(COURSES.map((course) => course.provider)));
