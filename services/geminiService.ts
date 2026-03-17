import { GoogleGenAI, Type } from "@google/genai";
import { CompanyProfile, VdrData, AiTabFeedback } from '../types';

// Initialize with process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTabAnalysis = async (
  tabTitle: string, 
  tabData: Record<string, string>, 
  companyProfile: CompanyProfile
): Promise<AiTabFeedback> => {
  const prompt = `
    As a elite Investment Banker and VC Auditor, perform a DEEP EVALUATION of the following VDR (Virtual Data Room) section.
    
    Company Profile:
    Name: ${companyProfile.companyName}
    Industry: ${companyProfile.industryType}
    Stage: ${companyProfile.organizationType}
    
    VDR Section: ${tabTitle}
    Documents Presence: ${JSON.stringify(tabData)}
    
    Analyze for completeness, legal risk, and investment readiness.
    
    Provide your analysis in JSON format with these keys:
    1. evaluator: Precise roles needed for professional review (e.g. "Tier-1 Legal Counsel", "Senior Tech Lead").
    2. improver: Roles responsible for remediating gaps.
    3. nextStep: The single most critical action to make this section "Investor Ready".
    4. riskScore: A number from 1 to 10 (10 being high risk).
    5. complianceNotes: A 2-sentence expert summary of the documentation status and missing critical items.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            evaluator: { type: Type.STRING },
            improver: { type: Type.STRING },
            nextStep: { type: Type.STRING },
            riskScore: { type: Type.NUMBER },
            complianceNotes: { type: Type.STRING },
          },
          required: ['evaluator', 'improver', 'nextStep', 'riskScore', 'complianceNotes'],
        },
      },
    });

    // response.text is a property, not a method
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      evaluator: "Specialized Legal or Financial Auditor.",
      improver: "Executive Management.",
      nextStep: "Conduct an internal audit of all submitted documentation.",
      riskScore: 5,
      complianceNotes: "Standard documentation review required. Ensure all signatures are present on uploaded files."
    };
  }
};

export const getFullReport = async (
  vdrData: VdrData, 
  companyProfile: CompanyProfile
) => {
  const prompt = `
    Generate a 5-star VENTURE CAPITAL INVESTMENT READINESS REPORT for ${companyProfile.companyName}.
    
    VDR Context: ${JSON.stringify(vdrData)}
    
    Provide:
    1. Overall Investment Thesis (Executive Summary).
    2. Deep Dive Analysis of the provided Virtual Data Room documents.
    3. Top 5 Red Flags that could kill a deal.
    4. 5 Strategic Recommendations to improve valuation.
    5. Final Verdict on Fundraising Preparedness.
    
    Style: Sharp, professional, direct, and highly insightful. Format in clear Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    // response.text is a property, not a method
    return response.text;
  } catch (error) {
    console.error("Gemini Report Error:", error);
    return "Audit generation failed. Please check connection and try again.";
  }
};