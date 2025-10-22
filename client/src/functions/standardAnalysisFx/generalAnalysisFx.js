//


// ===

export const goalsCountFx = (data) => {

    let goalCount = {};

    for (const obj of data) {
        const { goals } = obj;

        if (goals) {
            const individualGoals = goals.split(',').map(g => g.trim());

            for (const goal of individualGoals) {
                goalCount[goal] = (goalCount[goal] || 0) + 1;
            }
        }
    }

    const sortedGoalCount = Object.entries(goalCount)
        .sort((a, b) => b[1] - a[1])
        .map(([goal, count]) => ({ goal, count }));

    return sortedGoalCount;
}

export const goalCombinationCountFx = (data) => {
    const comboCount = {};

    for (const obj of data) {
        const { goals } = obj;

        if (goals) {
            const individualGoals = goals
                .split(',')
                .map(g => g.trim())
                .filter(g => g.length > 0);

            // Sort alphabetically to normalize combination
            const sortedCombo = individualGoals.sort().join(' | '); // use " | " to avoid accidental collisions

            comboCount[sortedCombo] = (comboCount[sortedCombo] || 0) + 1;
        }
    }

    // Convert to array and sort by count descending
    const sortedCombos = Object.entries(comboCount)
        .sort((a, b) => b[1] - a[1])
        .map(([combo, count]) => ({ combo, count }));

    return sortedCombos;
};