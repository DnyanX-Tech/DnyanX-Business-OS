export interface PromptInput {
  role: string;
  task: string;
  context: string;
  audience: string;
  format: string;
  tone: string;
  constraints: string;
  secretCode?: string;
}

export class PromptService {
  /**
   * Generates a high-precision prompt based on the 7 Core Pillars & 11 Secret Codes
   */
  public generateMasterPrompt(data: PromptInput): string {
    const secretCodeSection = data.secretCode
      ? `\n[11 SECRET CODES ACTIVATION]: Apply '${data.secretCode}' methodology strictly to optimize logic and depth.`
      : '';

    return `
[SYSTEM ROLE]: You are an elite, world-class ${data.role || 'domain expert and strategist'}.
[CONTEXT & BACKGROUND]: ${data.context || 'General business optimization context'}
[PRIMARY TASK]: ${data.task || 'Deliver high-value actionable solution'}
[TARGET AUDIENCE]: Tailor the output specifically for ${data.audience || 'business stakeholders and customers'}.
[OUTPUT FORMAT]: Deliver the response strictly in ${data.format || 'Structured Markdown with action points'}.
[TONE & STYLE]: Maintain a ${data.tone || 'Professional, highly persuasive, and authoritative'} tone throughout.
[STRICT CONSTRAINTS]: ${data.constraints || 'Zero fluff, highly technical, directly executable, high readability'}.${secretCodeSection}
`.trim();
  }

  /**
   * Provides pre-engineered industry templates for quick generation
   */
  public getIndustryTemplates() {
    return [
      {
        id: 'civil-engineer',
        title: '🏛️ Civil Contractor & Estimation',
        role: 'Senior Civil Engineer & Project Cost Estimator',
        task: 'Generate a detailed BOQ (Bill of Quantities) and RCC material estimate with current market rates',
        context: 'G+2 Residential Building construction in Maharashtra (1500 sq.ft plot)',
        audience: 'Local House Owners & Civil Sub-Contractors',
        format: 'Markdown Table with Material Breakdown, Labor Cost, and Schedule',
        tone: 'Technical, Trustworthy, and Precise',
        constraints: 'Include 10% contingency buffer, state cement-sand-aggregate ratios explicitly',
        secretCode: 'First Principles',
      },
      {
        id: 'merchant-marketing',
        title: '🛍️ Local Merchant WhatsApp Offer',
        role: 'Growth Marketing & Copywriting Expert',
        task: 'Write high-converting WhatsApp promotional messages for a local retail festival sale',
        context: 'Diwali Special 20% discount on groceries and sweet gift hampers',
        audience: 'Local Marathi & Hindi speaking neighborhood families',
        format: '3 short WhatsApp messages with emojis, clear CTA, and store address placeholder',
        tone: 'Warm, Festive, Urgent, and Friendly',
        constraints: 'Keep each message under 80 words, include One-Click WhatsApp order link',
        secretCode: 'Mental Models (Urgency & Scarcity)',
      },
      {
        id: 'youtube-script',
        title: '🎬 YouTuber & Course Creator Hook',
        role: 'Viral Content Strategist and Video Scriptwriter',
        task: 'Write a high-retention 60-second YouTube Shorts / Reels script with a 3-second hook',
        context: 'Educating college students on earning their first ₹10,000 using AI tools',
        audience: 'Marathi & Indian college youth looking for financial independence',
        format: 'Timestamped Script (Hook, Problem, Solution, Call to Action)',
        tone: 'Energetic, Inspiring, Action-Oriented',
        constraints: 'Fast-paced, zero introductory greetings, punchy one-liners',
        secretCode: 'ELI5 (Explain Like I am 5)',
      },
      {
        id: 'coaching-class',
        title: '📚 Coaching Class Lead Magnet',
        role: 'Education Marketing Specialist',
        task: 'Create an irresistible admission flyer copy and WhatsApp reminder for parents',
        context: '10th & 12th Board Exam Revision Crash Course with 100% doubt solving',
        audience: 'Concerned parents and ambitious students',
        format: 'Structured Brochure Outline + WhatsApp Follow-up sequence',
        tone: 'Reassuring, Academic, and Result-Focused',
        constraints: 'Highlight proven past results, limited seats, and early-bird discount',
        secretCode: 'Red Team',
      },
    ];
  }
}

export const promptService = new PromptService();
