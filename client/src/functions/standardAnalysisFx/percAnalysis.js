/*
    Functions

    totalModuleCountFx: Total completions per module

*/

export const totalModuleCountFx = (data) => {
    const moduleMap = {};

    for (const obj of data) {
        const { resourceName, resourceId, count } = obj;

        if (!moduleMap[resourceId]) {
            moduleMap[resourceId] = {
                id: resourceId,
                name: resourceName,
                total: 0,
                months: 0,
            };
        }

        moduleMap[resourceId].total += count;
        moduleMap[resourceId].months += 1;
    }

    // Convert the map into an array of objects
    return Object.values(moduleMap);
};