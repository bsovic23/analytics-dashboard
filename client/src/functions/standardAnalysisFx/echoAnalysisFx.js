/*

Project ECHO Analysis

*/

// =======================================================================================================================
// 2025 data compared to 2024 data
// =======================================================================================================================



// =======================================================================================================================
// Enrollment Analysis
// =======================================================================================================================

// Slide 2

export const enrollmentCountFx = (data) => {
    let enrollmentCounts = {};

    for (const obj of data) {
        const { moduleId, complete } = obj;

        if (!enrollmentCounts[moduleId]) {
            enrollmentCounts[moduleId] = {
                enrollTotal: 0,
                completeTotal: 0,
            };
        }
        

        enrollmentCounts[moduleId].enrollTotal += 1;

        if (complete === 'True') {
            enrollmentCounts[moduleId].completeTotal += 1;
        }
    }

    return enrollmentCounts;
};

// Slide 3

export const completeDemographicsFx = (data) => {
    let demographicsCounts = {
        professionCount: {},
        stateCount: {},
        ageCount: {
            '18-29': 0,
            '30-39': 0,
            '40-49': 0,
            '50-59': 0,
            '60-69': 0,
            '70+': 0
        },
        memberCount: {},
        averageAge: null
    };

    const getAge = (dobString) => {
        const birthDate = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getAgeBracket = (age) => {
        if (age >= 18 && age <= 29) return '18-29';
        if (age >= 30 && age <= 39) return '30-39';
        if (age >= 40 && age <= 49) return '40-49';
        if (age >= 50 && age <= 59) return '50-59';
        if (age >= 60 && age <= 69) return '60-69';
        return '70+';
    };

    let ageSum = 0;
    let ageCount = 0;

    for (const obj of data) {
        const { profession, state, dob, member, complete } = obj;

        if (!complete) continue;

        // Count profession
        if (profession) {
            demographicsCounts.professionCount[profession] = (demographicsCounts.professionCount[profession] || 0) + 1;
        }

        // Count state
        if (state) {
            demographicsCounts.stateCount[state] = (demographicsCounts.stateCount[state] || 0) + 1;
        }

        // Count member
        if (member) {
            demographicsCounts.memberCount[member] = (demographicsCounts.memberCount[member] || 0) + 1;
        }

        // Count age and age brackets
        if (dob) {
            const age = getAge(dob);
            const bracket = getAgeBracket(age);
            if (demographicsCounts.ageCount[bracket] !== undefined) {
                demographicsCounts.ageCount[bracket]++;
            }
            ageSum += age;
            ageCount++;
        }
    }

    if (ageCount > 0) {
        demographicsCounts.averageAge = parseFloat((ageSum / ageCount).toFixed(1));
    }

    return demographicsCounts;
};


// =======================================================================================================================
// Evaluation Analysis
// =======================================================================================================================

export const recruitMethodFx = (data) => {
    const recruitCounts = {
        recruit_brochure: 0,
        recruit_email: 0,
        recruit_fb: 0,
        recruit_google: 0,
        recruit_linkedin: 0,
        recruit_twitter: 0,
        recruit_journal: 0,
        recruit_nkfWebsite: 0,
        recruit_friend: 0,
        recruit_mail: 0,
        recruit_dontKnow: 0,
        recruit_other: 0,
    };

    for (const obj of data) {
        for (const key in recruitCounts) {
            if (obj[key] === true) {
                recruitCounts[key]++;
            }
        }
    }

    return recruitCounts;
};