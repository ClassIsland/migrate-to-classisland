import { Profile } from "./models/classisland/Profile";

function mapToObject<TKey, TValue>(map: Map<TKey, TValue>): Map<TKey, TValue> {
    const obj = Object.create(null);
    map.forEach((v, k) => {
        obj[k] = v;
    })
    return obj;
}

export function saveClassIslandProfile(profile: Profile): string {
    const profileNew = Object.create(profile);
    profileNew.ClassPlans = mapToObject(profile.ClassPlans);
    profileNew.TimeLayouts = mapToObject(profile.TimeLayouts);
    profileNew.Subjects = mapToObject(profile.Subjects);
    return JSON.stringify(profileNew);
}
