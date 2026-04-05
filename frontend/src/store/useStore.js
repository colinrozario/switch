import { create } from 'zustand';

const useStore = create((set) => ({
    profileId: null,
    setProfileId: (id) => set({ profileId: id }),

    pathSetId: null,
    setPathSetId: (id) => set({ pathSetId: id }),

    bridgeId: null,
    setBridgeId: (id) => set({ bridgeId: id }),

    careerOptions: [],
    setCareerOptions: (options) => set({ careerOptions: options }),

    selectedOption: null,
    setSelectedOption: (option) => set({ selectedOption: option }),

    currentPlan: null,
    setCurrentPlan: (plan) => set({ currentPlan: plan }),

    // Diagnosis State
    diagnosis: {
        currentRole: '',
        yearsExperience: 5,
        industry: '',
        constraints: {
            location: 'Flexible',
            hours: '10-15',
            dependents: 'None'
        },
        financials: {
            expenses: 45000,
            savings: 300000,
            hasStableIncome: true
        },
        goal: {
            targetRole: '',
            type: 'unsure', // 'target' or 'unsure'
            motivations: []
        }
    },
    setDiagnosis: (fullDiagnosis) => set({ diagnosis: fullDiagnosis }),
    updateDiagnosis: (field, value) => set((state) => ({
        diagnosis: { ...state.diagnosis, [field]: value }
    })),
}));

export default useStore;
