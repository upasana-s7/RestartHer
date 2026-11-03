

using { restarther } from '../db/schema';

service RestartHERService {

    entity ReturningProfessionals
        as projection on restarther.ReturningProfessionals;

    entity Skills
        as projection on restarther.Skills;

    entity CandidateSkills
        as projection on restarther.CandidateSkills;

    action discoverSkills(
        candidateID : UUID
    ) returns many restarther.SkillResult;

    action recommendCareers(
        candidateID : UUID
    ) returns many restarther.CareerRecommendation;

    action learningPathway(
        candidateID : UUID
    ) returns many restarther.LearningRecommendation;

    action auditBias(
    candidateID : UUID,
    jobDescription : LargeString
) returns many restarther.BiasAuditResult;

// FEATURE 5: MOCK INTERVIEW AGENT

action generateInterview(
    candidateID : UUID,
    role : String(120)
) returns many restarther.MockInterviewQuestion;

action evaluateInterviewAnswer(
    candidateID : UUID,
    questionID : Integer,
    role : String(120),
    question : LargeString,
    candidateAnswer : LargeString
) returns restarther.InterviewFeedback;

    // Server-side Gemini companion. The API key is never sent to the browser.
    action chatWithCompanion(message : LargeString) returns restarther.AICompanionReply;
}
