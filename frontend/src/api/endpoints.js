import client from './client';

export const endpoints = {
    // Stage 1: Intake
    createIntake: (rawText) => client.post('/api/intake', { user_id: 1, raw_text: rawText }), // hardcoding user 1 for MVP
    getIntake: (profileId) => client.get(`/api/intake/${profileId}`),
    updateIntake: (profileId, updates) => client.patch(`/api/intake/${profileId}`, updates),
    
    // Stage 2: Paths
    getCareerPaths: (profileId) => client.get(`/api/paths/${profileId}`),
    selectCareerPath: (pathSetId, pathId) => client.post(`/api/paths/${pathSetId}/select`, { path_id: pathId }),
    
    // Stage 3: Bridge
    getSalaryBridge: (pathSetId) => client.get(`/api/bridge/${pathSetId}`),
    getBridgeById: (bridgeId) => client.get(`/api/bridge/by-id/${bridgeId}`),

    
    // Stage 4: Roadmap
    getRoadmap: (bridgeId, horizon = 9) => client.get(`/api/roadmap/${bridgeId}?horizon=${horizon}`),

    
    // Stage 5: Simulator
    runSimulator: (roadmapId, modifiedInputs) => client.post('/api/simulator/run', { roadmap_id: roadmapId, modified_inputs: modifiedInputs })
};
