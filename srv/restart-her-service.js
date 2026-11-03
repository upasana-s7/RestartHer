


import cds from '@sap/cds';

export default class RestartHERService extends cds.ApplicationService {

    async init() {

        // FEATURE 1: SKILLS DISCOVERY
        this.on('discoverSkills', async (req) => {

            const { candidateID } = req.data;

            const candidate = await SELECT.one
                .from('restarther.ReturningProfessionals')
                .where({ ID: candidateID });

            if (!candidate) {
                return req.error(404, 'Candidate profile not found.');
            }

            if (!candidate.consentToProcess) {
                return req.error(403, 'Candidate consent is required.');
            }

            const profileFields = [
                {
                    name: 'Previous Role',
                    value: candidate.previousRole
                },
                {
                    name: 'Responsibilities',
                    value: candidate.responsibilities
                },
                {
                    name: 'Career Goal',
                    value: candidate.careerGoal
                }
            ].filter(field => field.value);

            const text = profileFields
                .map(field => field.value)
                .join(' ')
                .toLowerCase();

            const skillRules = [
                {
                    skill: 'Team Coordination',
                    category: 'Management',
                    keywords: ['team', 'coordinate', 'manage']
                },
                {
                    skill: 'Communication',
                    category: 'Soft Skills',
                    keywords: ['communicate', 'customer', 'client']
                },
                {
                    skill: 'Data Analysis',
                    category: 'Technical',
                    keywords: ['data', 'analysis', 'report', 'excel']
                },
                {
                    skill: 'Project Management',
                    category: 'Management',
                    keywords: ['project', 'planning', 'schedule']
                },
                {
                    skill: 'Problem Solving',
                    category: 'Soft Skills',
                    keywords: ['problem', 'resolve', 'solution']
                }
            ];

            function findEvidence(keywords) {

                for (const field of profileFields) {

                    const sentences = field.value.split(/[,;\n.!?]+/);

                    for (const sentence of sentences) {

                        const phrase = sentence.trim();

                        const matchedKeyword = keywords.some(keyword =>
                            phrase.toLowerCase().includes(keyword)
                        );

                        if (matchedKeyword) {
                            return phrase;
                        }
                    }
                }

                return 'Matching information found in the candidate profile.';
            }

            const results = [];

            for (const rule of skillRules) {

                const matched = rule.keywords.some(keyword =>
                    text.includes(keyword)
                );

                if (matched) {

                    results.push({
                        skill: rule.skill,
                        category: rule.category,
                        evidence: findEvidence(rule.keywords)
                    });

                }
            }

            return results;
        });


        // FEATURE 2: CAREER RECOMMENDATIONS
        this.on('recommendCareers', async (req) => {

            const { candidateID } = req.data;

            const candidate = await SELECT.one
                .from('restarther.ReturningProfessionals')
                .where({ ID: candidateID });

            if (!candidate) {
                return req.error(404, 'Candidate profile not found.');
            }

            if (!candidate.consentToProcess) {
                return req.error(403, 'Candidate consent is required.');
            }

            const profileText = [
                candidate.previousRole,
                candidate.responsibilities,
                candidate.careerGoal
            ].filter(Boolean).join(' ').toLowerCase();

            const skillRules = [
                {
                    skill: 'Team Coordination',
                    keywords: ['team', 'coordinate', 'manage']
                },
                {
                    skill: 'Communication',
                    keywords: ['communicate', 'customer', 'client']
                },
                {
                    skill: 'Data Analysis',
                    keywords: ['data', 'analysis', 'report', 'excel']
                },
                {
                    skill: 'Project Management',
                    keywords: ['project', 'planning', 'schedule']
                },
                {
                    skill: 'Problem Solving',
                    keywords: ['problem', 'resolve', 'solution']
                }
            ];

            const candidateSkills = skillRules
                .filter(rule =>
                    rule.keywords.some(keyword =>
                        profileText.includes(keyword)
                    )
                )
                .map(rule => rule.skill);

            const careerRoles = [
                {
                    role: 'Business Operations Analyst',
                    requiredSkills: [
                        'Team Coordination',
                        'Communication',
                        'Data Analysis'
                    ],
                    goalKeywords: ['business', 'operations'],
                    skillGaps: [
                        'Advanced Excel',
                        'SQL',
                        'Business Analytics'
                    ]
                },
                {
                    role: 'Operations Coordinator',
                    requiredSkills: [
                        'Team Coordination',
                        'Communication'
                    ],
                    goalKeywords: ['operations', 'coordination'],
                    skillGaps: [
                        'Process Management',
                        'Project Planning'
                    ]
                },
                {
                    role: 'Project Coordinator',
                    requiredSkills: [
                        'Team Coordination',
                        'Communication',
                        'Project Management'
                    ],
                    goalKeywords: ['project', 'coordination'],
                    skillGaps: [
                        'Project Management',
                        'Agile Fundamentals'
                    ]
                }
            ];

            const recommendations = [];

            for (const career of careerRoles) {

                const matchingSkills = career.requiredSkills.filter(skill =>
                    candidateSkills.includes(skill)
                );

                const goalMatch = career.goalKeywords.some(keyword =>
                    (candidate.careerGoal || '')
                        .toLowerCase()
                        .includes(keyword)
                );

                if (goalMatch || matchingSkills.length >= 2) {

                    const explanation = goalMatch
                        ? `This role aligns with your career goal of ${candidate.careerGoal}. Your existing skills also provide a foundation for this career path.`
                        : `Your existing skills in ${matchingSkills.join(', ')} are relevant to this role.`;

                    recommendations.push({
                        role: career.role,
                        explanation: explanation,
                        matchingSkills: matchingSkills.join(', '),
                        skillGaps: career.skillGaps.join(', ')
                    });

                }
            }

            return recommendations;
        });


        // FEATURE 3: PERSONALIZED LEARNING PATHWAY
        this.on('learningPathway', async (req) => {

            const { candidateID } = req.data;

            // Find candidate profile
            const candidate = await SELECT.one
                .from('restarther.ReturningProfessionals')
                .where({ ID: candidateID });

            if (!candidate) {
                return req.error(404, 'Candidate profile not found.');
            }

            // Check consent
            if (!candidate.consentToProcess) {
                return req.error(403, 'Candidate consent is required.');
            }

            // Identify candidate's existing skills
            const profileText = [
                candidate.previousRole,
                candidate.responsibilities,
                candidate.careerGoal
            ].filter(Boolean).join(' ').toLowerCase();

            const skillRules = [
                {
                    skill: 'Team Coordination',
                    keywords: ['team', 'coordinate', 'manage']
                },
                {
                    skill: 'Communication',
                    keywords: ['communicate', 'customer', 'client']
                },
                {
                    skill: 'Data Analysis',
                    keywords: ['data', 'analysis', 'report', 'excel']
                },
                {
                    skill: 'Project Management',
                    keywords: ['project', 'planning', 'schedule']
                },
                {
                    skill: 'Problem Solving',
                    keywords: ['problem', 'resolve', 'solution']
                }
            ];

            const candidateSkills = skillRules
                .filter(rule =>
                    rule.keywords.some(keyword =>
                        profileText.includes(keyword)
                    )
                )
                .map(rule => rule.skill);

            // Career paths and their learning requirements
            const careerRoles = [
                {
                    role: 'Business Operations Analyst',
                    requiredSkills: [
                        'Team Coordination',
                        'Communication',
                        'Data Analysis'
                    ],
                    goalKeywords: ['business', 'operations'],
                    skillGaps: [
                        'Advanced Excel',
                        'SQL',
                        'Business Analytics'
                    ]
                },
                {
                    role: 'Operations Coordinator',
                    requiredSkills: [
                        'Team Coordination',
                        'Communication'
                    ],
                    goalKeywords: ['operations', 'coordination'],
                    skillGaps: [
                        'Process Management',
                        'Project Planning'
                    ]
                },
                {
                    role: 'Project Coordinator',
                    requiredSkills: [
                        'Team Coordination',
                        'Communication',
                        'Project Management'
                    ],
                    goalKeywords: ['project', 'coordination'],
                    skillGaps: [
                        'Project Management',
                        'Agile Fundamentals'
                    ]
                }
            ];

            // Select career paths relevant to the candidate
            const selectedCareers = careerRoles.filter(career => {

                const goalMatch = career.goalKeywords.some(keyword =>
                    (candidate.careerGoal || '')
                        .toLowerCase()
                        .includes(keyword)
                );

                const matchingSkills = career.requiredSkills.filter(skill =>
                    candidateSkills.includes(skill)
                );

                return goalMatch || matchingSkills.length >= 2;
            });

            // Learning content for identified skill gaps
            const learningModules = {

                'Advanced Excel': {
                    topic: 'Advanced Excel for Professionals',
                    description: 'Learn advanced formulas, pivot tables, charts and professional data reporting.',
                    duration: '2 weeks'
                },

                'SQL': {
                    topic: 'SQL and Database Fundamentals',
                    description: 'Understand databases, SELECT queries, filtering, sorting and joining tables.',
                    duration: '2 weeks'
                },

                'Business Analytics': {
                    topic: 'Introduction to Business Analytics',
                    description: 'Learn how to interpret business data, understand key performance indicators and support decisions.',
                    duration: '2 weeks'
                },

                'Process Management': {
                    topic: 'Business Process Management',
                    description: 'Understand business workflows, process mapping and ways to improve operational efficiency.',
                    duration: '1 week'
                },

                'Project Planning': {
                    topic: 'Project Planning and Coordination',
                    description: 'Learn to plan tasks, set milestones, manage timelines and coordinate project activities.',
                    duration: '1 week'
                },

                'Project Management': {
                    topic: 'Project Management Fundamentals',
                    description: 'Understand project scope, planning, resource allocation and project monitoring.',
                    duration: '2 weeks'
                },

                'Agile Fundamentals': {
                    topic: 'Agile and Scrum Fundamentals',
                    description: 'Learn Agile principles, Scrum roles, sprint planning and collaborative project delivery.',
                    duration: '1 week'
                }

            };

            // Build an ordered and personalized learning pathway
            const selectedGaps = [
                ...new Set(
                    selectedCareers.flatMap(career => career.skillGaps)
                )
            ];

            const learningRecommendations = selectedGaps
                .filter(skill => learningModules[skill])
                .map((skill, index) => ({
                    skill: skill,
                    topic: learningModules[skill].topic,
                    description: learningModules[skill].description,
                    sequence: index + 1,
                    estimatedDuration: learningModules[skill].duration
                }));

            if (learningRecommendations.length === 0) {
                return req.error(
                    404,
                    'No learning pathway could be generated. Please update the candidate profile or career goal.'
                );
            }

            return learningRecommendations;
        });
        
        // FEATURE 4: BIAS AUDIT AGENT
        this.on('auditBias', async (req) => {

            const { candidateID, jobDescription } = req.data;

            // Find candidate profile
            const candidate = await SELECT.one
                .from('restarther.ReturningProfessionals')
                .where({ ID: candidateID });

            if (!candidate) {
                return req.error(404, 'Candidate profile not found.');
            }

            // Check consent
            if (!candidate.consentToProcess) {
                return req.error(403, 'Candidate consent is required.');
            }

            // Validate job description
            if (!jobDescription || !jobDescription.trim()) {
                return req.error(400, 'Please provide a job description for the audit.');
            }

            const text = jobDescription.toLowerCase();

            const results = [];

            // Check 1: Career-break restrictions
            const careerBreakPhrases = [
                'no career gaps',
                'without career gaps',
                'continuous employment required',
                'uninterrupted work history',
                'must have continuous employment',
                'no employment gaps'
            ];

            for (const phrase of careerBreakPhrases) {

                if (text.includes(phrase)) {

                    results.push({
                        area: 'Career Break Bias',
                        severity: 'High',
                        finding: `Potentially restrictive wording detected: "${phrase}".`,
                        explanation: 'This wording may unfairly exclude qualified applicants who have taken career breaks.',
                        suggestion: 'Evaluate relevant skills, experience and current capabilities instead of requiring an uninterrupted work history.'
                    });

                }
            }

            // Check 2: Potentially exclusionary language
            const biasedPhrases = [
                'young and energetic',
                'digital native',
                'male candidates only',
                'men only',
                'women need not apply',
                'rockstar',
                'ninja'
            ];

            for (const phrase of biasedPhrases) {

                if (text.includes(phrase)) {

                    results.push({
                        area: 'Exclusionary Language',
                        severity: 'High',
                        finding: `Potentially exclusionary phrase detected: "${phrase}".`,
                        explanation: 'This wording may discourage or exclude certain applicants even when they have the required abilities.',
                        suggestion: 'Use inclusive, professional language that focuses on the actual responsibilities and skills required.'
                    });

                }
            }

            // Check 3: Excessive experience requirements
            const experiencePattern =
                /(?:at least\s+|minimum(?: of)?\s+|min\.?\s*)?(\d{1,2})\s*\+?\s*years?/gi;

            const experienceMatches = [
                ...text.matchAll(experiencePattern)
            ];

            for (const match of experienceMatches) {

                const years = Number(match[1]);

                if (years >= 8) {

                    results.push({
                        area: 'Experience Requirement',
                        severity: 'Medium',
                        finding: `The job description mentions ${years} years of experience.`,
                        explanation: 'A high experience threshold may unnecessarily limit applications from capable professionals returning after a career break. However, the requirement may be justified for some senior roles.',
                        suggestion: 'Review whether the experience requirement is essential. Consider relevant skills, demonstrated achievements and equivalent experience.'
                    });

                    break;
                }
            }

            // Check 4: Degree-only requirements
            const degreePhrases = [
                'degree mandatory',
                'must have a degree',
                'degree is compulsory',
                'bachelor degree required',
                'degree is mandatory'
            ];

            for (const phrase of degreePhrases) {

                if (text.includes(phrase)) {

                    results.push({
                        area: 'Qualification Requirement',
                        severity: 'Low',
                        finding: 'The job description contains a strict degree requirement.',
                        explanation: 'A strict qualification requirement may overlook candidates with relevant practical skills or equivalent experience.',
                        suggestion: 'Where appropriate for the role, consider accepting equivalent qualifications, relevant certifications or demonstrated experience.'
                    });

                    break;
                }
            }

            // Check 5: Fairness and skills-based assessment
            if (
                !text.includes('skills') &&
                !text.includes('competencies') &&
                !text.includes('abilities')
            ) {

                results.push({
                    area: 'Skills-Based Assessment',
                    severity: 'Low',
                    finding: 'The job description does not clearly mention skills-based assessment.',
                    explanation: 'Candidates should have an opportunity to demonstrate their abilities rather than being evaluated only through formal requirements.',
                    suggestion: 'Clearly mention the relevant skills, competencies and practical abilities needed for the role.'
                });

            }

            // Return a result if no potential issues are found
            if (results.length === 0) {

                results.push({
                    area: 'Overall Review',
                    severity: 'Low',
                    finding: 'No predefined bias indicators were detected.',
                    explanation: 'The job description passed the limited wording checks performed by this prototype.',
                    suggestion: 'Continue reviewing the job requirements to ensure they are relevant, inclusive and skills-focused.'
                });

            }

            return results;

        });

        // FEATURE 5: MOCK INTERVIEW AGENT

        const interviewQuestions = {
            "Business Operations Analyst": [
                {
                    questionID: 1,
                    question: "Tell me about your previous work experience and the skills you developed.",
                    questionType: "Behavioral"
                },
                {
                    questionID: 2,
                    question: "How would you use Excel to organize and analyze business data?",
                    questionType: "Technical"
                },
                {
                    questionID: 3,
                    question: "How would you handle a situation where a team report contains incorrect data?",
                    questionType: "Situational"
                },
                {
                    questionID: 4,
                    question: "How do you prioritize multiple tasks with approaching deadlines?",
                    questionType: "Situational"
                },
                {
                    questionID: 5,
                    question: "How would you explain your return to the workforce after a career break?",
                    questionType: "Behavioral"
                }
            ],

            "Operations Coordinator": [
                {
                    questionID: 1,
                    question: "How would you coordinate tasks between different team members?",
                    questionType: "Situational"
                },
                {
                    questionID: 2,
                    question: "What steps would you take if an important task was delayed?",
                    questionType: "Situational"
                },
                {
                    questionID: 3,
                    question: "How do you maintain accurate records and reports?",
                    questionType: "Technical"
                },
                {
                    questionID: 4,
                    question: "Describe a situation where you solved a workplace problem.",
                    questionType: "Behavioral"
                },
                {
                    questionID: 5,
                    question: "How would you manage your responsibilities when returning to work?",
                    questionType: "Behavioral"
                }
            ],

            "Project Coordinator": [
                {
                    questionID: 1,
                    question: "How would you plan and organize a new project?",
                    questionType: "Technical"
                },
                {
                    questionID: 2,
                    question: "How would you handle a project deadline that is at risk?",
                    questionType: "Situational"
                },
                {
                    questionID: 3,
                    question: "How do you communicate project updates to team members?",
                    questionType: "Behavioral"
                },
                {
                    questionID: 4,
                    question: "What would you do if two team members disagreed about a project task?",
                    questionType: "Situational"
                },
                {
                    questionID: 5,
                    question: "How would you update your project management skills after a career break?",
                    questionType: "Behavioral"
                }
            ]
        };

        // Generate interview questions
        this.on("generateInterview", async (req) => {
            const { candidateID, role } = req.data;

            const candidate = await cds.tx(req).run(
                cds.ql.SELECT.one
                    .from("restarther.ReturningProfessionals")
                    .where({ ID: candidateID })
            );

            if (!candidate) {
                return req.reject(404, "Candidate not found.");
            }

            if (!candidate.consentToProcess) {
                return req.reject(403, "Candidate consent is required.");
            }

            if (!interviewQuestions[role]) {
                return req.reject(400, "Invalid interview role.");
            }

            return interviewQuestions[role].map((item) => ({
                ...item,
                role: role
            }));
        });

        // Evaluate candidate's interview answer
        this.on("evaluateInterviewAnswer", async (req) => {
            const {
                candidateID,
                questionID,
                role,
                question,
                candidateAnswer
            } = req.data;

            const candidate = await cds.tx(req).run(
                cds.ql.SELECT.one
                    .from("restarther.ReturningProfessionals")
                    .where({ ID: candidateID })
            );

            if (!candidate) {
                return req.reject(404, "Candidate not found.");
            }

            if (!candidate.consentToProcess) {
                return req.reject(403, "Candidate consent is required.");
            }

            if (!interviewQuestions[role]) {
                return req.reject(400, "Invalid interview role.");
            }

            if (
                !Number.isInteger(questionID) ||
                questionID < 1 ||
                questionID > 5
            ) {
                return req.reject(400, "Invalid question ID.");
            }

            if (!candidateAnswer || !candidateAnswer.trim()) {
                return req.reject(400, "Please enter an answer.");
            }

            const answer = candidateAnswer.toLowerCase();
            const words = answer.trim().split(/\s+/);

            const keywords = [
                "team", "planning", "communication",
                "data", "excel", "project",
                "problem", "solution", "organize",
                "manage", "result", "customer",
                "report", "task", "experience",
                "process", "deadline", "coordinate"
            ];

            const matchedKeywords = keywords.filter(
                word => answer.includes(word)
            ).length;

            // Relevance score: out of 10
            const relevanceScore = Math.min(
                10,
                matchedKeywords * 2
            );

            // Clarity score: based on answer length and structure,
            // not grammar, accent or English proficiency.
            const clarityScore =
                words.length >= 40 ? 10 :
                words.length >= 25 ? 8 :
                words.length >= 12 ? 6 :
                words.length >= 5 ? 4 : 2;

            // Completeness score
            const structureWords = [
                "because", "example", "result",
                "first", "then", "finally",
                "achieved", "improved", "solved"
            ];

            const structureCount = structureWords.filter(
                word => answer.includes(word)
            ).length;

            const completenessScore = Math.min(
                10,
                (words.length >= 25 ? 5 : words.length >= 10 ? 3 : 1)
                + structureCount
            );

            const totalScore =
                relevanceScore + clarityScore + completenessScore;

            let feedback;

            if (totalScore >= 24) {
                feedback = "Good answer! You have included relevant information and explained your response well.";
            } else if (totalScore >= 15) {
                feedback = "Good attempt! You have addressed some important points. Try adding more supporting details.";
            } else {
                feedback = "Your answer is a starting point. Try explaining your approach with a specific example.";
            }

            const improvementTips = [
                "Use a real example from your previous work, studies or other relevant experience.",
                "Explain the steps you took to handle the situation.",
                "Mention the outcome or result of your actions."
            ].join(" ");

            return {
                questionID,
                question,
                candidateAnswer,
                relevanceScore,
                clarityScore,
                completenessScore,
                totalScore,
                feedback,
                improvementTips
            };
        });



        // FEATURE 6: GEMINI-POWERED AI COMPANION
        this.on('chatWithCompanion', async (req) => {
            const message = typeof req.data.message === 'string' ? req.data.message.trim() : '';

            if (!message) {
                return req.reject(400, 'Please enter a message.');
            }
            if (message.length > 4000) {
                return req.reject(400, 'Please keep messages under 4,000 characters.');
            }

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                return req.reject(503, 'The AI companion is not configured yet. Add GEMINI_API_KEY to the backend environment.');
            }

            const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
            const systemInstruction = [
                'You are RestartHER, a warm, practical career-reentry companion.',
                'Help people returning to work after a career break with skills, learning plans, confidence, interviews and career planning.',
                'Be respectful, inclusive, encouraging and realistic. Do not shame people for career gaps.',
                'Do not invent current job openings, course availability, salaries, deadlines or provider facts. Explain when something needs verification.',
                'Ask at most one focused follow-up question when needed. Keep replies clear and reasonably concise.',
                'Do not claim to access or change the user account, profile, roadmap or database.'
            ].join(' ');

            let response;
            try {
                response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-goog-api-key': apiKey
                        },
                        body: JSON.stringify({
                            systemInstruction: { parts: [{ text: systemInstruction }] },
                            contents: [{ role: 'user', parts: [{ text: message }] }],
                            generationConfig: { maxOutputTokens: 600 }
                        }),
                        signal: AbortSignal.timeout(30000)
                    }
                );
            } catch (error) {
                console.error('Gemini request failed:', error?.name || 'network error');
                return req.reject(502, 'The AI companion could not be reached. Please try again.');
            }

            if (!response.ok) {
                console.error('Gemini API returned status:', response.status);
                return req.reject(502, 'The AI companion service returned an error. Please try again later.');
            }

            let payload;
            try {
                payload = await response.json();
            } catch {
                return req.reject(502, 'The AI companion returned an unreadable response.');
            }

            const reply = payload?.candidates?.[0]?.content?.parts
                ?.map((part) => typeof part.text === 'string' ? part.text : '')
                .join('')
                .trim();

            if (!reply) {
                return req.reject(502, 'The AI companion could not generate a reply. Please rephrase your message.');
            }

            return { reply };
        });

        await super.init();
    }
}



