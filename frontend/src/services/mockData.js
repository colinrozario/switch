// Mock AI Response for Career Paths
export const getMockPaths = () => {
    return [
        {
            id: 1,
            title: "Product Management",
            matchParams: ["Skill Overlap: 75%", "Transition Time: 4 Months"],
            description: "Shift from engineering to product strategy. Use your technical background while building market focus.",
            salaryBridge: "-₹2,50,000 total for 3 months",
            riskScore: 35,
            riskLabel: "Safe Bet",
            color: "bg-green-50 text-green-700",
            roadmap: [
                {
                    phase: "Phase 1: Skill Bridging",
                    duration: "Months 1-2",
                    status: "active",
                    financialImpact: "Burn Rate: -₹50,000/mo (Savings Dip)",
                    milestones: ["Complete Product Certification", "Network in PM Communities"],
                },
                {
                    phase: "Phase 2: Transition",
                    duration: "Months 3-4",
                    status: "upcoming",
                    financialImpact: "Projected Salary: ₹22LPA (+₹6LPA vs current)",
                    milestones: ["Offer Negotiation", "Start Date"],
                }
            ]
        }
    ];
};
