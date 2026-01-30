import client from './client';

export const api = {
    // Profiles
    createProfile: (text) => client.post('/profiles/intake', null, { params: { input_text: text } }),

    // Plans
    getCareerOptions: (profileId) => client.post('/plans/generate-options', null, { params: { profile_id: profileId } }),

    buildPlan: (profileId, targetRoleKey, horizon) => client.post(`/plans/${uuidv4()}/build`, null, {
        params: {
            profile_id: profileId,
            target_role_key: targetRoleKey,
            horizon: horizon
        }
    }),

    // Note: The build endpoint in plans.py uses UUID generation inside if not passed? 
    // Actually the logic I wrote was: @router.post("/{id}/build")
    // So the ID is a path param. I should generate one here or let backend handle if I change API.
    // Backend API: @router.post("/{id}/build") -> id is path param.
    // So frontend must generate a UUID.
};

// Helper for UUID if needed, or import uuid lib
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

// Updating endpoints to match backend exact signature
export const endpoints = {
    createProfile: (text) => client.post('/profiles/intake', { input_text: text }),

    getCareerOptions: (profileId) => client.post('/plans/generate-options', null, { params: { profile_id: profileId } }),

    buildPlan: (profileId, targetRoleKey, horizon) => {
        const planId = uuidv4();
        return client.post(`/plans/${planId}/build?profile_id=${profileId}&target_role_key=${encodeURIComponent(targetRoleKey)}&horizon=${horizon}`);
    }
};
