


namespace restarther;

using { cuid, managed } from '@sap/cds/common';

// Stores information about returning professionals
entity ReturningProfessionals : cuid, managed {

    firstName         : String(80);
    lastName          : String(80);

    previousRole      : String(120);
    yearsExperience   : Integer;
    careerBreakYears  : Integer;

    responsibilities  : LargeString;
    careerGoal        : String(200);

    consentToProcess  : Boolean default false;
}

// Stores skills recognized by RestartHER
entity Skills : cuid {

    name        : String(100);
    category    : String(40);
    description : LargeString;
}

// Connects candidates with their discovered skills
entity CandidateSkills : cuid, managed {

    candidate  : Association to ReturningProfessionals;
    skill      : Association to Skills;

    evidence   : LargeString;
    confidence : Decimal(5,2);
}

// Results returned by Skills Discovery
type SkillResult {
    skill    : String(100);
    category : String(40);
    evidence : LargeString;
}

// Results returned by Career Recommendation Agent
type CareerRecommendation {
    role            : String(120);
    explanation     : LargeString;
    matchingSkills  : LargeString;
    skillGaps       : LargeString;
}

// Results returned by Learning Pathway Agent
type LearningRecommendation {
    skill             : String(100);
    topic             : String(120);
    description       : LargeString;
    sequence          : Integer;
    estimatedDuration : String(40);
}

// Results returned by Bias Audit Agent
type BiasAuditResult {
    area        : String(100);
    severity    : String(30);
    finding     : LargeString;
    explanation : LargeString;
    suggestion  : LargeString;
}
// Results returned by Mock Interview Agent
type MockInterviewQuestion {
    questionID   : Integer;
    role         : String(120);
    question     : LargeString;
    questionType : String(50);
}

// Feedback returned after candidate submits an answer
type InterviewFeedback {
    questionID       : Integer;
    question         : LargeString;
    candidateAnswer  : LargeString;
    relevanceScore   : Integer;
    clarityScore     : Integer;
    completenessScore: Integer;
    totalScore       : Integer;
    feedback         : LargeString;
    improvementTips  : LargeString;
}





// Response returned by the Gemini-powered RestartHER companion
type AICompanionReply {
    reply : LargeString;
}
