import React, { useState } from 'react';
import { FileText, TrendingUp, PieChart, Target, DollarSign, Download, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MBAToolkit = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const tools = [
    {
      id: 'business-case',
      name: 'Business Case Generator',
      icon: FileText,
      color: 'from-cyan-400 to-blue-500',
      glowColor: 'shadow-cyan-500/50',
      description: 'Transform an idea into a complete business case',
      fields: [
        { name: 'idea', label: 'Business Idea', type: 'textarea', placeholder: 'Describe your idea in 2-3 sentences...' },
        { name: 'market', label: 'Target Market', type: 'text', placeholder: 'e.g., B2B SaaS, Europe' },
        { name: 'budget', label: 'Available Budget', type: 'text', placeholder: 'e.g., €50K' },
        { name: 'timeline', label: 'Timeline', type: 'text', placeholder: 'e.g., launch in 6 months' }
      ]
    },
    {
      id: 'strategic-analysis',
      name: 'Strategic Frameworks Analyzer',
      icon: TrendingUp,
      color: 'from-pink-500 to-rose-500',
      glowColor: 'shadow-pink-500/50',
      description: 'Apply multiple strategic frameworks instantly',
      fields: [
        { name: 'company', label: 'Company/Situation', type: 'textarea', placeholder: 'Describe the company, industry, current situation...' },
        { name: 'size', label: 'Size', type: 'select', options: ['Startup', 'SME', 'Large Enterprise'] },
        { name: 'stage', label: 'Stage', type: 'select', options: ['Early-stage', 'Growth', 'Maturity'] },
        { name: 'focus', label: 'Analysis Focus', type: 'text', placeholder: 'e.g., expansion, new product' }
      ]
    },
    {
      id: 'pitch-deck',
      name: 'Pitch Deck Architect',
      icon: PieChart,
      color: 'from-purple-500 to-pink-500',
      glowColor: 'shadow-purple-500/50',
      description: 'Create complete pitch deck structure',
      fields: [
        { name: 'business', label: 'About the Business', type: 'textarea', placeholder: 'What it does, for whom, what problem it solves...' },
        { name: 'audience', label: 'Audience', type: 'select', options: ['VCs', 'Angels', 'Accelerators', 'Corporate'] },
        { name: 'round', label: 'Funding Round', type: 'select', options: ['Pre-seed', 'Seed', 'Series A'] },
        { name: 'amount', label: 'Amount to Raise', type: 'text', placeholder: 'e.g., €500K' }
      ]
    },
    {
      id: 'competitor-analysis',
      name: 'Competitive Intelligence',
      icon: Target,
      color: 'from-cyan-500 to-teal-500',
      glowColor: 'shadow-cyan-500/50',
      description: 'Deep competitor analysis',
      fields: [
        { name: 'competitor', label: 'Company to Analyze', type: 'text', placeholder: 'Competitor company name' },
        { name: 'industry', label: 'Industry', type: 'text', placeholder: 'e.g., SaaS, Fintech' },
        { name: 'focus', label: 'Focus', type: 'select', options: ['Strategy', 'Product', 'Go-to-Market', 'Complete'] }
      ]
    },
    {
      id: 'financial-model',
      name: 'Financial Model Builder',
      icon: DollarSign,
      color: 'from-rose-500 to-pink-500',
      glowColor: 'shadow-rose-500/50',
      description: 'Create financial model structure',
      fields: [
        { name: 'business', label: 'About the Business', type: 'textarea', placeholder: 'Business model, pricing, current stage...' },
        { name: 'revenue', label: 'Current Revenue/Month', type: 'text', placeholder: 'e.g., €10K' },
        { name: 'costs', label: 'Fixed Costs/Month', type: 'text', placeholder: 'e.g., €5K' },
        { name: 'objective', label: 'Objective', type: 'select', options: ['Fundraising', 'Planning', 'Scenario Analysis'] }
      ]
    }
  ];

  const prompts = {
    'business-case': (data) => `Act as a senior strategy consultant from McKinsey. I'll give you a business idea and I need you to develop a complete and professional business case.

BUSINESS IDEA:
${data.idea}

ADDITIONAL CONTEXT:
- Target market: ${data.market || 'Not specified'}
- Available budget: ${data.budget || 'Not specified'}
- Timeline: ${data.timeline || 'Not specified'}

Please create a structured business case. Use clear section headers (##) and organize content with simple bullet points (-). Keep formatting clean and professional.

## EXECUTIVE SUMMARY
Provide a concise 3-4 sentence overview covering:
- The opportunity in one sentence
- Unique value proposition
- Market potential
- Key success factors

## PROBLEM STATEMENT
What specific problem does this solve?
- Who experiences this problem?
- What does it cost them (time, money, opportunity)?
- Why do current solutions fail to address it adequately?
- What's the urgency or catalyst for change?

## SOLUTION
Describe the proposed solution:
- Core offering and how it works
- Key features or components
- How it solves the problem better than alternatives
- Unique advantages or "moat"

## MARKET ANALYSIS
Provide market sizing with clear methodology:

TAM (Total Addressable Market):
- Size estimate and methodology
- Market definition

SAM (Serviceable Addressable Market):
- Realistic segment size
- Geographic or demographic focus

SOM (Serviceable Obtainable Market):
- Near-term achievable market share
- Time horizon

Additional analysis:
- Priority customer segments with characteristics
- Key market trends supporting growth
- Market growth rate and drivers

## COMPETITIVE LANDSCAPE
Analyze the competition:
- 3-5 main competitors (direct and indirect)
- Key competitive dimensions
- Your differentiation and positioning
- Barriers to entry you can create

## BUSINESS MODEL
Explain how you'll make money:
- Primary revenue streams
- Pricing strategy with rationale
- Key cost drivers
- Unit economics estimates (CAC, LTV, gross margin)
- Path to profitability

## GO-TO-MARKET STRATEGY
Outline customer acquisition approach:
- Priority acquisition channels with rationale
- Customer acquisition process for first 100 customers
- Partnerships or distribution strategies
- Sales cycle expectations

## FINANCIAL PROJECTIONS
Provide high-level 3-year projections:

Year 1:
- Revenue target
- Key costs
- Expected EBITDA

Year 2-3:
- Revenue trajectory
- Scaling assumptions
- Break-even point (month/year)
- Funding requirements

## KEY RISKS AND MITIGATION
Identify top 5 risks:
1. [Risk category]: Specific risk and mitigation strategy
2. [Risk category]: Specific risk and mitigation strategy
(Continue for all 5)

## NEXT STEPS AND MILESTONES
90-Day Action Plan:
- Month 1: Key actions
- Month 2: Key actions  
- Month 3: Key actions

Critical success metrics to track from day one.

FORMATTING INSTRUCTIONS:
- Use ## for main sections
- Use clear subsection labels
- Use simple bullet points with - 
- Keep numbers specific and realistic
- Make it scannable and professional
- Avoid excessive formatting symbols`,

    'strategic-analysis': (data) => `Act as an experienced business strategist. I'll describe a business situation and I need you to apply the main strategic frameworks in a clear, structured way.

SITUATION / COMPANY:
${data.company}

CONTEXT:
- Size: ${data.size || 'Not specified'}
- Stage: ${data.stage || 'Not specified'}
- Analysis focus: ${data.focus || 'Not specified'}

Please analyze using these frameworks. Use clean formatting with ## for main sections and simple bullets.

## PORTER'S FIVE FORCES ANALYSIS

Analyze each competitive force on a scale of 1-5 (where 5 = very intense):

Competitive Rivalry [Score: X/5]
- Current state of competition
- Number and strength of competitors
- Market growth rate impact
- Strategic implications

Threat of New Entrants [Score: X/5]
- Barriers to entry analysis
- Capital requirements
- Economies of scale
- Strategic implications

Bargaining Power of Suppliers [Score: X/5]
- Supplier concentration
- Switching costs
- Strategic implications

Bargaining Power of Customers [Score: X/5]
- Customer concentration
- Price sensitivity
- Strategic implications

Threat of Substitutes [Score: X/5]
- Available alternatives
- Relative price-performance
- Strategic implications

Overall Industry Attractiveness: [High/Medium/Low] with brief justification

## SWOT ANALYSIS

STRENGTHS (Internal Advantages):
- List 4-5 key internal strengths
- Be specific and evidence-based

WEAKNESSES (Internal Limitations):
- List 4-5 key internal weaknesses
- Be honest and specific

OPPORTUNITIES (External Possibilities):
- List 4-5 key external opportunities
- Focus on actionable ones

THREATS (External Risks):
- List 4-5 key external threats
- Include mitigation considerations

Strategic Options:
- SO Strategy: Using strengths to capture opportunities
- WO Strategy: Overcoming weaknesses to pursue opportunities
- ST Strategy: Using strengths to mitigate threats
- WT Strategy: Defensive strategies to minimize weaknesses and threats

## VRIO ANALYSIS

Analyze key resources and capabilities:

For each major resource/capability, assess:
- Valuable: Does it enable competitive advantage?
- Rare: Is it scarce in the industry?
- Inimitable: Is it difficult to copy?
- Organized: Can the firm exploit it?

Present findings in clear format showing which resources provide sustained competitive advantage.

## VALUE CHAIN ANALYSIS

Primary Activities:
- Inbound Logistics: Analysis and opportunities
- Operations: Analysis and opportunities
- Outbound Logistics: Analysis and opportunities
- Marketing & Sales: Analysis and opportunities
- Service: Analysis and opportunities

Support Activities:
- Firm Infrastructure: Analysis
- Human Resource Management: Analysis
- Technology Development: Analysis
- Procurement: Analysis

Value Creation Focus:
Identify 2-3 activities where the most value is created.

## ANSOFF GROWTH MATRIX

Evaluate each strategic option:

Market Penetration (Existing Products, Existing Markets):
- Current approach and potential
- Recommended tactics
- Risk level: [Low/Medium/High]

Product Development (New Products, Existing Markets):
- Opportunities identified
- Recommended approach
- Risk level: [Low/Medium/High]

Market Development (Existing Products, New Markets):
- Target markets identified
- Entry strategy
- Risk level: [Low/Medium/High]

Diversification (New Products, New Markets):
- Opportunities if any
- Type: Related or Unrelated
- Risk level: [Low/Medium/High]

Recommended Growth Strategy: [Specify which quadrant to prioritize and why]

## INTEGRATED STRATEGIC SYNTHESIS

Top 3 Strategic Priorities (Next 12 Months):
1. Priority with clear rationale
2. Priority with clear rationale
3. Priority with clear rationale

Quick Wins (Next 90 Days):
- List 3-4 high-impact, fast actions

Strategic Bets (Long-term Investments):
- List 2-3 major strategic initiatives

Critical Risk Factors:
- List 3-4 key risks to monitor

One-Line Strategy Summary:
[Provide a single compelling sentence that captures the recommended strategic direction]

FORMATTING: Use clean headers (##), simple bullets (-), and keep it scannable and professional.`,

    'pitch-deck': (data) => `Act as an experienced venture capital partner. I'll describe my business and I need you to create the complete structure of an investor-ready pitch deck.

ABOUT THE BUSINESS:
${data.business}

PITCH CONTEXT:
- Audience: ${data.audience || 'VCs'}
- Funding round: ${data.round || 'Seed'}
- Amount to raise: ${data.amount || 'Not specified'}

Create a pitch deck with the following 12-slide structure. For each slide, provide specific content, NOT generic placeholders:

## SLIDE 1: OPENING
- Company name and tagline (create a compelling one)
- One-sentence pitch that captures attention
- Visual suggestion: Hero image or product screenshot

## SLIDE 2: PROBLEM / UNMET NEED
- 3-4 specific pain points the target customer faces
- Quantify the problem (costs, time wasted, frustration level)
- Current alternatives and why they fail
- Visual suggestion: Problem illustration or customer quote

## SLIDE 3: SOLUTION / PRODUCT
- Clear description of what the product/service does
- 3-4 key features that directly address the problems
- How it's different from current solutions
- Visual suggestion: Product demo screenshot or diagram

## SLIDE 4: MARKET / OPPORTUNITY
- TAM (Total Addressable Market) with methodology
- SAM (Serviceable Addressable Market)
- SOM (Serviceable Obtainable Market) - realistic first target
- Market growth rate and key drivers
- Visual suggestion: Market size pyramid or growth chart

## SLIDE 5: VALUE PROPOSITION
- Clear value proposition statement
- Key benefits for customers (quantified when possible)
- Why customers will switch/adopt
- Early customer testimonials or interest signals
- Visual suggestion: Value prop diagram or benefit icons

## SLIDE 6: COMPETITION / ADVANTAGE
- Competitive landscape overview
- 2x2 positioning matrix (choose relevant axes)
- Your unique competitive advantages (moats)
- Why you'll win
- Visual suggestion: Competitive matrix or comparison table

## SLIDE 7: REVENUE / COST MODEL
- Revenue model (how you make money)
- Pricing strategy and tiers
- Unit economics: CAC, LTV, gross margin
- Path to profitability
- Visual suggestion: Revenue model diagram or pricing table

## SLIDE 8: FINANCIAL PROJECTIONS
- 3-year revenue projections
- Key cost drivers
- Path to break-even
- Key assumptions clearly stated
- Visual suggestion: Revenue growth chart

## SLIDE 9: INVESTMENT PLAN
- Amount seeking to raise
- Use of funds breakdown (percentages and amounts)
- Key milestones this funding enables
- Timeline to next funding round or profitability
- Visual suggestion: Use of funds pie chart

## SLIDE 10: ACHIEVEMENTS / MILESTONES
- Traction to date (users, revenue, partnerships)
- Key milestones achieved
- Proof points (pilots, LOIs, waitlist)
- Awards or recognition
- Visual suggestion: Timeline or metrics dashboard

## SLIDE 11: TEAM / ADVISORS
- Founders with relevant background (1-2 sentences each)
- Key team members if relevant
- Notable advisors or board members
- Why this team will win
- Visual suggestion: Team photos with brief bios

## SLIDE 12: CLOSING
- Restate the opportunity in one compelling sentence
- The ask (investment amount and terms if relevant)
- Contact information
- Call to action
- Visual suggestion: Compelling closing image

CRITICAL INSTRUCTIONS:
- Be specific with numbers, names, and details
- Use clear, jargon-free language
- Each slide should be concise (3-5 bullet points max)
- Include "Visual suggestion" for each slide
- Make it compelling and investor-ready
- Base projections on realistic assumptions`,

    'competitor-analysis': (data) => `Act as a competitive intelligence analyst. I need a deep, structured analysis of a competitor based on publicly available information.

COMPANY TO ANALYZE:
${data.competitor}

CONTEXT:
- Industry: ${data.industry || 'Not specified'}
- Focus: ${data.focus || 'Complete'}

Please provide a comprehensive analysis with clean formatting using ## for sections.

## COMPANY OVERVIEW

Basic Information:
- Founded: [Year, founders, location]
- Funding: [Total raised, recent rounds, key investors]
- Size: [Estimated employees, revenue range if available]
- Locations: [HQ and other offices]
- Stage: [Startup/Growth/Mature]

## PRODUCT AND SERVICE OFFERING

Core Product/Service:
- Detailed description of main offering
- Key features and capabilities
- Technology stack (if identifiable)
- Recent product launches or updates

Pricing Structure:
- Pricing model (if public)
- Product tiers or packages
- Estimated price points

Product Roadmap Signals:
- Hints from job postings, press releases, etc.

## CUSTOMER BASE

Target Customer Profile:
- Primary ICP (Ideal Customer Profile)
- Company size, industry, geography focus
- Buyer personas targeted

Known Customers:
- Public case studies or logos
- Estimated customer count
- Customer segments served

Customer Feedback Analysis:
- What customers love (from reviews/testimonials)
- Common complaints or friction points
- Overall satisfaction indicators
- Review ratings on G2, Capterra, etc.

## GO-TO-MARKET STRATEGY

Sales Model:
- Self-serve, sales-led, or hybrid
- Sales cycle indicators
- Channel strategy

Marketing Approach:
- Active marketing channels
- Content strategy and frequency
- Social media presence and engagement
- Events and sponsorships
- Ad spend signals

Partnership Strategy:
- Key partnerships announced
- Integration ecosystem
- Channel partners

## POSITIONING AND MESSAGING

Value Proposition:
- Main tagline or positioning statement
- Key messages on website
- Differentiation claims

Brand Voice:
- Tone and style
- Target audience signals

Competitive Claims:
- Who they position against
- Claimed advantages

## TEAM AND CULTURE

Leadership Team:
- Founders and C-suite backgrounds
- Notable previous companies
- Domain expertise

Team Composition:
- Estimated team size by function (from LinkedIn)
- Recent hiring patterns
- Job openings analysis (what they're building)

Culture Indicators:
- Glassdoor ratings if available
- Values and mission statements
- Remote/office policy

Advisors and Board:
- Notable advisors or board members
- Their relevant expertise

## TRACTION AND MOMENTUM

Growth Indicators:
- Website traffic trends (if available)
- Social media following and growth
- Hiring velocity
- Office expansions

Public Milestones:
- Press mentions and media coverage
- Awards or recognition
- Partnership announcements
- Funding announcements

Market Signals:
- Customer acquisition patterns
- Geographic expansion
- Product line expansion

## COMPETITIVE STRENGTHS

Top 5 Strengths:
1. [Specific strength with evidence]
2. [Specific strength with evidence]
3. [Specific strength with evidence]
4. [Specific strength with evidence]
5. [Specific strength with evidence]

## COMPETITIVE WEAKNESSES

Top 5 Vulnerabilities:
1. [Specific weakness with evidence]
2. [Specific weakness with evidence]
3. [Specific weakness with evidence]
4. [Specific weakness with evidence]
5. [Specific weakness with evidence]

Common Customer Complaints:
- Recurring themes from reviews
- Feature gaps mentioned
- Service or support issues

## STRATEGIC INSIGHTS

Likely Next Moves:
- Based on hiring, funding, and market signals
- Product development direction
- Market expansion plans

Where They're Vulnerable:
- Gaps we can exploit
- Areas where they're not investing
- Customer segments they're missing

How to Differentiate:
- Specific strategies to out-position them
- Features or services to emphasize
- Market segments to target

Recommended Competitive Response:
- Key actions to take
- Areas to invest in
- Messaging to emphasize

IMPORTANT: Clearly indicate "Estimated" vs "Confirmed" for all data points. Cite sources where possible (website, LinkedIn, Crunchbase, etc.).`,

    'financial-model': (data) => `Act as an experienced CFO in startups. I need help building a comprehensive financial model structure that can be implemented in Excel or Google Sheets.

ABOUT THE BUSINESS:
${data.business}

CURRENT DATA:
- Current revenue/month: ${data.revenue || 'Not specified'}
- Fixed costs/month: ${data.costs || 'Not specified'}

OBJECTIVE:
${data.objective || 'Planning'}

Please create a detailed financial model structure with clean formatting using ## for sections.

## MODEL OVERVIEW

Model Purpose: [Fundraising / Planning / Scenario Analysis]
Time Horizon: 3-5 years
Update Frequency: Monthly Year 1, Quarterly Years 2-3

## ASSUMPTIONS TAB

Document all key assumptions that drive the model:

Revenue Assumptions:
- Pricing per tier: [List pricing]
- Customer acquisition rate: [New customers per month]
- Customer churn rate: [% per month]
- Average contract value (ACV): [Amount]
- Upsell/expansion rate: [% per year]
- Sales cycle length: [Months]
- Seasonality factors: [If any]

Cost Assumptions:
- Customer Acquisition Cost (CAC): [Amount per customer]
- CAC payback period: [Months]
- Gross margin target: [%]
- Cost per employee (fully loaded): [Amount]
- Infrastructure costs: [Per customer or fixed]
- Software and tools: [Monthly total]
- Office and overhead: [Monthly total]

Growth Assumptions:
- Monthly revenue growth rate: [%]
- Team growth plan: [Hires per quarter]
- Marketing spend: [% of revenue or fixed amount]
- R&D investment: [% of revenue or fixed amount]

## PROFIT & LOSS PROJECTION

Structure for Monthly (Year 1) and Quarterly (Years 2-3):

REVENUE:
- New customer revenue
- Existing customer revenue (retention)
- Upsell and expansion revenue
- TOTAL REVENUE
  Formula: SUM(new + existing + expansion)

COST OF REVENUE:
- Hosting and infrastructure
- Customer support costs
- Third-party fees and licenses
- TOTAL COST OF REVENUE
  Formula: SUM(all direct costs)
- GROSS PROFIT
  Formula: Revenue - Cost of Revenue
- GROSS MARGIN %
  Formula: (Gross Profit / Revenue) * 100

OPERATING EXPENSES:

Sales & Marketing:
- Sales team salaries
- Marketing team salaries
- Advertising and paid acquisition
- Events and conferences
- Tools and software
- TOTAL S&M
- S&M as % of Revenue

Research & Development:
- Engineering salaries
- Product/Design salaries
- Development tools and infrastructure
- TOTAL R&D
- R&D as % of Revenue

General & Administrative:
- Leadership salaries
- Office and facilities
- Legal and accounting
- Insurance and other
- TOTAL G&A
- G&A as % of Revenue

TOTAL OPERATING EXPENSES
Formula: S&M + R&D + G&A

EBITDA
Formula: Gross Profit - Operating Expenses

EBITDA MARGIN %
Formula: (EBITDA / Revenue) * 100

NET INCOME
Formula: EBITDA (simplified, can add D&A if needed)

## CASH FLOW PROJECTION

Operating Cash Flow:
- Net Income
- Add: Non-cash expenses (if any)
- Changes in working capital
- CASH FROM OPERATIONS

Investing Cash Flow:
- CapEx investments
- CASH FROM INVESTING

Financing Cash Flow:
- Equity funding raised
- Debt proceeds (if any)
- CASH FROM FINANCING

NET CASH FLOW
Formula: Operations + Investing + Financing

ENDING CASH BALANCE
Formula: Beginning Cash + Net Cash Flow

MONTHS OF RUNWAY
Formula: Cash Balance / Monthly Burn Rate

## KEY METRICS DASHBOARD

Track these metrics monthly/quarterly:

Revenue Metrics:
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- Formula: MRR * 12
- YoY Growth %
- MoM Growth %

Customer Metrics:
- Total Customers
- New Customers (period)
- Churned Customers (period)
- Net New Customers
- Churn Rate %

Unit Economics:
- CAC (Customer Acquisition Cost)
- LTV (Customer Lifetime Value)
  Formula: ARPU / Churn Rate
- LTV:CAC Ratio
  Formula: LTV / CAC
- CAC Payback Period (months)
- ARPU (Average Revenue Per User)

Efficiency Metrics:
- Gross Margin %
- EBITDA Margin %
- Magic Number (S&M Efficiency)
  Formula: Net New ARR / S&M Spend
- Rule of 40
  Formula: Revenue Growth % + EBITDA Margin %

Cash Metrics:
- Monthly Burn Rate
- Runway (months)
- Cash Balance

## SCENARIO ANALYSIS

Create three scenarios with different assumptions:

BASE CASE:
- Assumptions: [List key assumptions]
- Year 3 Revenue: [Amount]
- Break-even: [Month/Quarter]
- Funding Need: [Amount and timing]

OPTIMISTIC CASE:
- Key differences: [Higher growth, lower churn, etc.]
- Year 3 Revenue: [Amount]
- Break-even: [Month/Quarter]
- Funding Need: [Amount and timing]

CONSERVATIVE CASE:
- Key differences: [Lower growth, higher CAC, etc.]
- Year 3 Revenue: [Amount]
- Break-even: [Month/Quarter]
- Funding Need: [Amount and timing]

## BREAK-EVEN ANALYSIS

Calculate break-even point:
- Required Monthly Revenue: [Amount]
- Required Number of Customers: [Count]
- Timeline to Break-even (Base Case): [Month/Year]
- Key Drivers:
  - Fixed costs per month
  - Contribution margin per customer

## FUNDING REQUIREMENTS

Current Situation:
- Current Cash Balance: [Amount]
- Current Monthly Burn: [Amount]
- Current Runway: [Months]

This Raise:
- Amount Seeking: [Amount]
- Proposed Use of Funds:
  - Team (X%): [Amount]
  - Marketing (X%): [Amount]
  - Product (X%): [Amount]
  - Operations (X%): [Amount]
  - Reserve (X%): [Amount]

Post-Funding:
- New Runway: [Months]
- Milestones This Funding Enables:
  1. [Milestone with timing]
  2. [Milestone with timing]
  3. [Milestone with timing]

Next Funding Round:
- Expected Timing: [Month/Year]
- Expected Traction Needed: [Metrics]

## SENSITIVITY ANALYSIS

Test impact of key variable changes:

What if CAC increases 50%?
- Impact on: LTV:CAC, Payback, Burn Rate, Runway

What if Churn increases 2 percentage points?
- Impact on: LTV, Revenue, Unit Economics

What if Growth Rate decreases 30%?
- Impact on: Revenue, Break-even timing, Funding needs

What if Pricing increases 20%?
- Impact on: Revenue, Conversion, Unit Economics

What if Headcount Growth is 50% slower?
- Impact on: Costs, Revenue capacity, Runway

## IMPLEMENTATION NOTES

Excel/Sheets Setup:
- Use separate tabs for: Assumptions, P&L, Cash Flow, Metrics, Scenarios
- Color code: Inputs (blue), Formulas (black), Outputs (green)
- Link assumptions tab to all other tabs
- Use data validation for drop-downs
- Protect formula cells

Key Formulas to Implement:
[List critical Excel formulas with cell references as examples]

Validation Checklist:
- All months/quarters sum correctly
- Cash flow reconciles with P&L
- Customer counts make sense
- Growth rates are consistent
- All assumptions have sources

FORMATTING: Use ## for main sections, clear subsections, and present all numbers with units (%, $, months, etc.). Make it easy to implement in a spreadsheet.`
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');

    try {
      const prompt = prompts[selectedTool.id](formData);
      
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await response.json();
      setResult(data.content[0].text);
    } catch (error) {
      setResult("Error generating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTool.name.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-6xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 animate-pulse">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Stratify
              </h1>
            </div>
            <p className="text-2xl text-slate-700 font-medium mb-6">
              Professional Strategy Tools
            </p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all">
              <Sparkles className="w-4 h-4" />
              AI-Powered Analysis
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  className="group cursor-pointer bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-all duration-300 border-2 border-slate-200 hover:border-transparent hover:shadow-2xl relative overflow-hidden"
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  {/* Gradient border effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl p-[2px]" 
                       style={{background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                               backgroundImage: tool.color.includes('cyan') ? 'linear-gradient(135deg, #06b6d4, #ec4899)' : 
                                              tool.color.includes('pink') ? 'linear-gradient(135deg, #ec4899, #f43f5e)' :
                                              tool.color.includes('purple') ? 'linear-gradient(135deg, #a855f7, #ec4899)' :
                                              tool.color.includes('rose') ? 'linear-gradient(135deg, #f43f5e, #ec4899)' :
                                              'linear-gradient(135deg, #06b6d4, #14b8a6)'}}>
                    <div className="absolute inset-[2px] bg-white rounded-2xl"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg ${tool.glowColor} group-hover:shadow-2xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all">
                      {tool.name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="inline-block bg-white/60 backdrop-blur-sm rounded-2xl px-8 py-4 border border-slate-200 shadow-lg">
              <p className="text-slate-600 font-medium">
                ✨ Built for entrepreneurs and business professionals
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const Icon = selectedTool.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Back Button */}
        <button
          onClick={() => {
            setSelectedTool(null);
            setFormData({});
            setResult('');
          }}
          className="mb-8 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 font-semibold text-lg group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          Back to tools
        </button>

        {/* Tool Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8 border-2 border-slate-200 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br opacity-5" 
               style={{backgroundImage: selectedTool.color.includes('cyan') ? 'linear-gradient(135deg, #06b6d4, #ec4899)' : 
                                      selectedTool.color.includes('pink') ? 'linear-gradient(135deg, #ec4899, #f43f5e)' :
                                      selectedTool.color.includes('purple') ? 'linear-gradient(135deg, #a855f7, #ec4899)' :
                                      selectedTool.color.includes('rose') ? 'linear-gradient(135deg, #f43f5e, #ec4899)' :
                                      'linear-gradient(135deg, #06b6d4, #14b8a6)'}}></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedTool.color} flex items-center justify-center shadow-2xl ${selectedTool.glowColor}`}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">{selectedTool.name}</h2>
              <p className="text-slate-600 text-lg">{selectedTool.description}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-slate-200 shadow-xl">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className={`w-2 h-8 rounded-full bg-gradient-to-b ${selectedTool.color}`}></span>
              Input
            </h3>
            <div className="space-y-5">
              {selectedTool.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      className="w-full bg-white text-slate-800 rounded-xl px-4 py-3 border-2 border-slate-200 focus:border-transparent focus:ring-4 focus:ring-cyan-500/30 focus:outline-none min-h-[120px] transition-all placeholder:text-slate-400"
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      className="w-full bg-white text-slate-800 rounded-xl px-4 py-3 border-2 border-slate-200 focus:border-transparent focus:ring-4 focus:ring-cyan-500/30 focus:outline-none transition-all"
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    >
                      <option value="">Select...</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="w-full bg-white text-slate-800 rounded-xl px-4 py-3 border-2 border-slate-200 focus:border-transparent focus:ring-4 focus:ring-cyan-500/30 focus:outline-none transition-all placeholder:text-slate-400"
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full bg-gradient-to-r ${selectedTool.color} text-white rounded-xl px-6 py-4 font-bold text-lg hover:shadow-2xl ${selectedTool.glowColor} hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-6`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Generating analysis...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Analysis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-slate-200 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className={`w-2 h-8 rounded-full bg-gradient-to-b ${selectedTool.color}`}></span>
                Output
              </h3>
              {result && (
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 text-sm bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-5 py-2.5 rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              )}
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 min-h-[500px] max-h-[600px] overflow-y-auto border-2 border-slate-200">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedTool.color} flex items-center justify-center animate-pulse shadow-2xl ${selectedTool.glowColor}`}>
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <p className="text-slate-600 font-semibold">Generating your analysis...</p>
                </div>
              ) : result ? (
                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-3 pb-2 border-b-2 border-slate-200" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-slate-700 mt-4 mb-2" {...props} />,
                      p: ({node, ...props}) => <p className="text-slate-600 leading-relaxed mb-3" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 mb-4 text-slate-600" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1 mb-4 text-slate-600" {...props} />,
                      li: ({node, ...props}) => <li className="ml-4" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-slate-800" {...props} />,
                      em: ({node, ...props}) => <em className="italic text-slate-700" {...props} />,
                      code: ({node, inline, ...props}) => 
                        inline ? 
                          <code className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props} /> :
                          <code className="block bg-slate-100 p-3 rounded-lg text-sm font-mono overflow-x-auto" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-slate-600 my-4" {...props} />,
                      table: ({node, ...props}) => <table className="w-full border-collapse border border-slate-300 my-4" {...props} />,
                      thead: ({node, ...props}) => <thead className="bg-slate-100" {...props} />,
                      th: ({node, ...props}) => <th className="border border-slate-300 px-4 py-2 text-left font-semibold text-slate-700" {...props} />,
                      td: ({node, ...props}) => <td className="border border-slate-300 px-4 py-2 text-slate-600" {...props} />,
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedTool.color} flex items-center justify-center mx-auto mb-4 opacity-50`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-slate-500 font-medium">
                      Fill the form and click "Generate Analysis"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MBAToolkit;