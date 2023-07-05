import type { Application, HookContext, NextFunction } from '../declarations'
import { User } from '../services/users/users.schema'
import { generateAvatar } from './utils';

const getProfile = async (app: Application, userId: number) => {
    
    try {
        // Get the associated profile object based on the user_id
        const profilesService = app.service('profile');
        const profile = await profilesService._find({ query: {userId} });
        return profile;
    } catch (error) {
        return {};
    }
}

export const populateProfile = async (context: HookContext) => {
    const { app, result } = context;

    if (result.data) {
        const usersWithProfile = await Promise.all(result.data.map(async (user: User) => {
            return { ...user, profile: await getProfile(app, user.id)}
        }));
    
        // Modify the result to include the profile object
        context.result = usersWithProfile;

    } else if (result.id) {
        context.result = { ...result, profile: await getProfile(app, result.id)};
    }

    return context;
};

export const createProfile = async (context: HookContext) => {

    try {
        const { app, params, result,  } = context;
        params.user = result
        
        await app.service('profile')._create({
            userId: result.id,
            name: params.query.name, 
            avatar: generateAvatar(result.email)
        })
        return context;
    } catch (error) {
        throw error
    }
}

export const addUserNameToQueryParams = async (context: HookContext) => {
    const { params, data } = context;

    if (data.name) {
        const _name = data.name;
        // remove the name from the data
        delete data.name;
        // add the name to the query
        params.query = {
            ...params.query,
            name: _name
        }
    }

    return context
}