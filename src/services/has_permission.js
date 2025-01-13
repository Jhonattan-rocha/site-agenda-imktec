export default function hasPermission(profile, entity, action){
    try{
        const entityPermissions = profile.permissions.find(p => p.entity_name === entity);
        return entityPermissions?.[action] || false;
    }catch(err){
        return false;
    }
    // return true;
};