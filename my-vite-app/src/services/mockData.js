// Mock AI Response for Career Paths
export const getMockPaths = () => {
    return [
        {
            id: 1,
            title: "Product Marketing Manager",
            matchParams: ["Skill Overlap: 75%", "Transition Time: 4 Months"],
            description: "Leverage your campaign experience but shift focus to product strategy. High demand, safer transition.",
            salaryBridge: "-$2,000/mo for 3 months",
            riskScore: 35, // Low
            riskLabel: "Safe Bet",
            color: "bg-green-50 text-green-700",
            roadmap: [
                {
                    phase: "Phase 1: Skill Bridging",
                    duration: "Months 1-2",
                    status: "active",
                    financialImpact: "Burn Rate: -$3,000/mo (Savings Dip)",
                    milestones: ["Complete 'Product Strategy' Certification", "Revamp LinkedIn for PMM keywords", "Join 2 PMM Communities"],
                },
                {
                    phase: "Phase 2: Market Validation",
                    duration: "Month 3",
                    status: "upcoming",
                    financialImpact: "Burn Rate: -$3,000/mo",
                    milestones: ["Conduct 5 informational interviews", "Apply to 10 'Friendly' roles", "Customize Resume for B2B SaaS"],
                },
                {
                    phase: "Phase 3: Transition & Breakeven",
                    duration: "Month 4+",
                    status: "upcoming",
                    financialImpact: "Projected Salary: $110k (+$1,500/mo vs current)",
                    milestones: ["Interview Rounds", "Offer Negotiation", "Start Date"],
                }
            ]
        },
        {
            id: 2,
            title: "Customer Success Lead",
            matchParams: ["Skill Overlap: 90%", "Transition Time: 2 Months"],
            description: "Immediate transferability. Lower upside initially, but nearly zero risk of unemployment.",
            salaryBridge: "$0 Gap",
            riskScore: 15, // Very Low
            riskLabel: "Safety Net",
            color: "bg-blue-50 text-blue-700",
            roadmap: [
                {
                    phase: "Phase 1: Repositioning",
                    duration: "Month 1",
                    status: "active",
                    financialImpact: "Burn Rate: $0 (Keep Current Job)",
                    milestones: ["Highlight 'Client Retention' in Resume", "Apply to Senior CS roles"],
                },
                {
                    phase: "Phase 2: Hired",
                    duration: "Month 2",
                    status: "upcoming",
                    financialImpact: "Salary: $95k (Lateral Move)",
                    milestones: ["Interviews", "Offer Acceptance"],
                }
            ]
        },
        {
            id: 3,
            title: "Growth Product Manager",
            matchParams: ["Skill Overlap: 50%", "Transition Time: 8 Months"],
            description: "High upside, but requires learning SQL and data modeling. Higher risk of gap.",
            salaryBridge: "-$4,000/mo for 6 months",
            riskScore: 65, // Moderate
            riskLabel: "High Reward",
            color: "bg-purple-50 text-purple-700",
            roadmap: [
                {
                    phase: "Phase 1: Deep Skilling (Technical)",
                    duration: "Months 1-4",
                    status: "upcoming",
                    financialImpact: "Burn Rate: -$200 (Course Fees)",
                    milestones: ["Learn SQL & Python Basics", "Complete Reforge Growth Series"],
                },
                {
                    phase: "Phase 2: Portfolio Building",
                    duration: "Months 5-6",
                    status: "upcoming",
                    financialImpact: "Burn Rate: -$3,000 (Quit current role)",
                    milestones: ["Build Growth Model Project", "Publish Case Study"],
                },
                {
                    phase: "Phase 3: Aggressive Job Search",
                    duration: "Months 7-8",
                    status: "upcoming",
                    financialImpact: "Burn Rate: -$3,000 (Savings Critical)",
                    milestones: ["Apply to top-tier Tech firms", "Technical Interviews"],
                }
            ]
        }
    ];
};
