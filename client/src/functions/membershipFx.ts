// -------------------------------------------
// Wild Apricot Functions
// -------------------------------------------

//  Interface Imports

import { 
    WildApricotData, 
    WildApricotDups, 
    WildApricotMembershipLapsed,
    SurveyData,
} from '../typeScript/membership'

// =======================================================================================================================================
// Wild Apricot Repeated Clean Up Reports
// =======================================================================================================================================

// ------ Wild Apricot Duplicates -------

export const wildApricotDupsFx = (data: WildApricotData[]): WildApricotDups => {
    let wildApricotDataClean: WildApricotDups = {};

    for (const obj of data) {
        const { 'User ID': userId, 'First name': firstName, 'Last name': lastName, 'Email': email } = obj;
        let uniqueId = `${firstName}-${lastName}-${email}`;

        if (!wildApricotDataClean[uniqueId]) {
            wildApricotDataClean[uniqueId] = {
                dupCount: 0,
                ids: [],
            };
        }

        wildApricotDataClean[uniqueId].dupCount++;
        wildApricotDataClean[uniqueId].ids.push(userId);
    }

    let dupReviews: WildApricotDups = {};
    for (const key in wildApricotDataClean) {
        if (wildApricotDataClean[key].dupCount > 1) {
            dupReviews[key] = wildApricotDataClean[key];
        }
    }

    return dupReviews;
};

// ------ Wild Apricot Lapsed Members Renewal -------

export const wildApricotMemberLapseFx = (
    data: WildApricotData[], 
    monthChosen: number, 
    yearChosen: number
): WildApricotMembershipLapsed[] => {
    let membersLapsed: WildApricotMembershipLapsed[] = [];

    for (const obj of data) {
        const { 
            "User ID": userId, 
            "First name": firstName,
            "Last name": lastName,
            "Email": email,
            "Phone": phone,
            "Membership enabled": membershipEnabled,
            "Membership level": membershipLevel,
            "Membership status": membershipStatus,
            "Member since": memberSince,
            "Renewal due": renewalDue,
            "Renewal date since last changed": renewalDateLastChange,
        } = obj;

        const renewalDate = new Date(renewalDue);
        const renewalMonth = renewalDate.getMonth() + 1; // getMonth returns 0-11, so +1
        const renewalYear = renewalDate.getFullYear();

        if (
            membershipStatus === 'Lapsed' &&
            renewalMonth === monthChosen &&
            renewalYear === yearChosen
        ) {
            membersLapsed.push({
                userId: userId,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                membershipEnabled: membershipEnabled,
                membershipLevel: membershipLevel,
                membershipStatus: membershipStatus,
                memberSince: memberSince,
                renewalDue: renewalDue,
                renewalDateLastChange: renewalDateLastChange,
            });
        }
    }

    return membersLapsed;
};

// =======================================================================================================================================
// Wild Apricot Analysis
// =======================================================================================================================================

export const activeFyFx = (data: WildApricotData[]) => {
    const updatedData = data.map((item) => {
        return {
            ...item,
            fiscalYears: {
                fy21: false,
                fy22: false,
                fy23: false,
                fy24: false,
                fy25: false,
            },
        };
    });

    const fiscalYearRanges = {
        fy21: { start: new Date("April 1, 2020"), end: new Date("March 31, 2021") },
        fy22: { start: new Date("April 1, 2021"), end: new Date("March 31, 2022") },
        fy23: { start: new Date("April 1, 2022"), end: new Date("March 31, 2023") },
        fy24: { start: new Date("April 1, 2023"), end: new Date("March 31, 2024") },
        fy25: { start: new Date("April 1, 2024"), end: new Date("March 31, 2025") },
    };

    const normalizeLevel = (level: string): string => {
        return level.replace(/ - 2 Yr$/, "");
    };

    for (const obj of updatedData) {
        const {
            "Membership level": membershipLevel,
            "Membership status": membershipStatus,
            "Member since": memberSince,
            "Renewal due": renewalDue,
        } = obj;

        const memberSinceDate = new Date(memberSince);
        const renewalDueDate = new Date(renewalDue);

        // Active Membership Status
        if (membershipStatus === "Active") {
            for (const [year, range] of Object.entries(fiscalYearRanges)) {
                const { start, end } = range;
                if (memberSinceDate <= end) {
                    obj.fiscalYears[year as keyof typeof obj.fiscalYears] = true;
                }
            }
        }

        // Lapsed/Inactive Membership Status
        if (membershipStatus !== "Active") {
            for (const [year, range] of Object.entries(fiscalYearRanges)) {
                const { start, end } = range;
                if (
                    (memberSinceDate <= end && renewalDueDate >= start) || // Membership period overlaps FY
                    (memberSinceDate >= start && memberSinceDate <= end)   // MemberSince falls within FY
                ) {
                    obj.fiscalYears[year as keyof typeof obj.fiscalYears] = true;
                }
            }
        }
    }

    // Count true values for each fiscal year
    const fiscalYearCounts: Record<keyof typeof fiscalYearRanges, number> = {
        fy21: 0,
        fy22: 0,
        fy23: 0,
        fy24: 0,
        fy25: 0,
    };

    // Counts per fiscal year per professional level
    const fiscalYearLevelCounts: Record<keyof typeof fiscalYearRanges, Record<string, number>> = {
        fy21: {},
        fy22: {},
        fy23: {},
        fy24: {},
        fy25: {},
    };

    updatedData.forEach((item) => {
        for (const [year, value] of Object.entries(item.fiscalYears)) {
            if (value === true) {
                fiscalYearCounts[year as keyof typeof fiscalYearCounts]++;

                const level = normalizeLevel(item["Membership level"]);
                const levelCounts = fiscalYearLevelCounts[year as keyof typeof fiscalYearLevelCounts];

                if (level) {

                    
                    levelCounts[level] = (levelCounts[level] || 0) + 1;
                }
            }
        }
    });

    return { fiscalYearCounts, fiscalYearLevelCounts };
};

// Retention Rate

export function calculateFiscalYearRetention(data: WildApricotData[], fiscalYears: string[]) {
    const retention = fiscalYears.reduce((acc, year) => {
        acc[year] = { numerator: 0, denominator: 0 };
        return acc;
    }, {} as Record<string, { numerator: number, denominator: number }>);

    const getFiscalYear = (date: Date): string | undefined => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() returns 0-based month

        if (year === 2019 && month >= 4 || year === 2020 && month <= 3) return 'FY20';
        if (year === 2020 && month >= 4 || year === 2021 && month <= 3) return 'FY21';
        if (year === 2021 && month >= 4 || year === 2022 && month <= 3) return 'FY22';
        if (year === 2022 && month >= 4 || year === 2023 && month <= 3) return 'FY23';
        if (year === 2023 && month >= 4 || year === 2024 && month <= 3) return 'FY24';
        if (year === 2024 && month >= 4) return 'FY25';
        return undefined;
    };

    data.forEach(member => {
        const memberSinceDate = new Date(member['Member since']);
        const renewalDueDate = new Date(member['Renewal due']);
        const membershipStatus = member['Membership status'];

        fiscalYears.forEach(fiscalYear => {
            const memberFiscalYear = getFiscalYear(memberSinceDate);
            const renewalFiscalYear = getFiscalYear(renewalDueDate);

            if (memberFiscalYear && fiscalYear >= memberFiscalYear) {
                if (!renewalFiscalYear || fiscalYear < renewalFiscalYear || (fiscalYear === renewalFiscalYear && membershipStatus === 'Active')) {
                    // Member retained for this fiscal year
                    retention[fiscalYear].numerator += 1;
                }
                // Add to the denominator for each fiscal year the member is considered
                retention[fiscalYear].denominator += 1;
            }
        });
    });

    return retention;
}


// NEW Active Memeber 

export const activeMemberNewFx = (data: WildApricotData[]) => {
    // Helper function to determine fiscal year
    const getFiscalYear = (dateStr: string): string | null => {
        const date = new Date(dateStr);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1; // Month is 0-indexed

        if ((year === 2020 && month >= 4) || (year === 2021 && month <= 3)) return 'FY21';
        if ((year === 2021 && month >= 4) || (year === 2022 && month <= 3)) return 'FY22';
        if ((year === 2022 && month >= 4) || (year === 2023 && month <= 3)) return 'FY23';
        if ((year === 2023 && month >= 4) || (year === 2024 && month <= 3)) return 'FY24';
        if ((year === 2024 && month >= 4) || (year === 2025 && month <= 3)) return 'FY25';
        return null; // If date doesn't fall within any FY
    };

    // Initialize data structures
    const totals: { [fy: string]: number } = {};
    const membershipBreakdown: { [membershipLevel: string]: { [fy: string]: number } } = {};

    // Iterate through data
    for (const obj of data) {
        const {
            "Membership level": membershipLevel,
            "Membership status": membershipStatus,
            "Member since": memberSince,
        } = obj;

        const fy = getFiscalYear(memberSince);
        if (!fy) continue; // Skip if no fiscal year is found

        // Normalize membership levels (merge " - 2 Yr" into base levels)
        const normalizedMembershipLevel = membershipLevel?.replace(" - 2 Yr", "");

        // Increment total count for the fiscal year
        totals[fy] = (totals[fy] || 0) + 1;

        // Increment membership level-specific count for the fiscal year
        if (normalizedMembershipLevel) {
            if (!membershipBreakdown[normalizedMembershipLevel]) {
                membershipBreakdown[normalizedMembershipLevel] = {};
            }
            membershipBreakdown[normalizedMembershipLevel][fy] =
                (membershipBreakdown[normalizedMembershipLevel][fy] || 0) + 1;
        }
    }

    // Function to sort fiscal years
    const sortFiscalYears = (obj: { [fy: string]: number }) => {
        const ordered: { [fy: string]: number } = {};
        Object.keys(obj)
            .sort() // Sort fiscal years alphabetically (FY20, FY21, etc.)
            .forEach((key) => {
                ordered[key] = obj[key];
            });
        return ordered;
    };

    // Sort totals
    const sortedTotals = sortFiscalYears(totals);

    // Sort membership breakdown
    const sortedMembershipBreakdown: { [membershipLevel: string]: { [fy: string]: number } } = {};
    for (const [membershipLevel, fyData] of Object.entries(membershipBreakdown)) {
        sortedMembershipBreakdown[membershipLevel] = sortFiscalYears(fyData);
    }

    // Return the sorted final aggregated data
    return { totals: sortedTotals, membershipBreakdown: sortedMembershipBreakdown };
};

// WILD APRICOT Last Clicked

export const newFunctions = (data: WildApricotData[]) => {
    let finalData: Record<string, any> = {
        paidMemberships: 0,
        nonPaidMemberships: 0,
        activityByMonth2024: {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0
        }
    };

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    for (const obj of data) {
        const { 
            "Membership level": membershipLevel, 
            "Last login": lastLogin
        } = obj;

        // Count paid vs. non-paid memberships
        if (membershipLevel === "Student" || membershipLevel === "Fellow" || membershipLevel === "Resident") {
            finalData.nonPaidMemberships++;
        } else {
            finalData.paidMemberships++;
        }

        // Count activity by month for 2024
        if (lastLogin) {
            const lastLoginDate = new Date(lastLogin);
            const year = lastLoginDate.getFullYear();
            const month = lastLoginDate.getMonth(); // getMonth() is 0-based

            if (year === 2024) {
                const monthName = months[month]; // Get month name from the array
                finalData.activityByMonth2024[monthName]++;
            }
        }
    }

    return finalData;
};

export const quarterAnalysis = (data: WildApricotData[]) => {
    let finalData = {
        'Q1 (Apr-Jun)': 0,
        'Q2 (Jul-Sept)': 0,
        'Q3 (Oct-Dec)': 0,
        'Q4 (Jan-Mar)': 0,
    };

    for (const obj of data) {
        const { "Member since": memberSince } = obj;

        // Convert the "Member since" date to a JavaScript Date object
        const memberSinceDate = new Date(memberSince);

        // Extract the year and month
        const year = memberSinceDate.getFullYear();
        const month = memberSinceDate.getMonth() + 1; // Months are 0-based, so +1

        // Only count if the year is 2024
        if (year === 2024 || year === 2025) {
            if (month >= 4  && month <= 6 && year === 2024) {
                finalData['Q1 (Apr-Jun)'] += 1;
            } else if (month >= 7 && month <= 9 && year === 2024) {
                finalData['Q2 (Jul-Sept)'] += 1;
            } else if (month >= 10 && month <= 12 && year === 2024) {
                finalData['Q3 (Oct-Dec)'] += 1;
            } else if (month >= 1 && month <= 3 && year === 2025) {
                finalData['Q4 (Jan-Mar)'] += 1;
            } else {
                console.log("error" + memberSinceDate)
            }
        }
    }

    return finalData;
}

// Active Members Over Last 24 Months

export const activeMemberByMonth = (data: WildApricotData[]) => {
    let finalData: { [key: string]: number } = {};

    const startPeriod = new Date("01/01/2023");
    const endPeriod = new Date("11/30/2024");
    const today = new Date("12/10/2024");

    // Generate an array of months between startPeriod and endPeriod
    const getMonthsArray = (start: Date, end: Date): string[] => {
        const months = [];
        let current = new Date(start);
        current.setDate(1); // Set to the first of the month

        while (current <= end) {
            const yearMonth = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
            months.push(yearMonth);
            current.setMonth(current.getMonth() + 1); // Move to the next month
        }
        return months;
    };

    const monthsArray = getMonthsArray(startPeriod, endPeriod);

    // Initialize finalData with each month and a count of 0
    for (const month of monthsArray) {
        finalData[month] = 0;
    }

    // Calculate active members for each month
    for (const obj of data) {
        const {
            "Membership level": membershipLevel,
            "Member since": memberSince,
            "Renewal due": renewalDue,
            "Membership status": memberStatus,
        } = obj;

        const memberStart = new Date(memberSince);
        const memberEnd =
            memberStatus === "Active"
                ? today // Active members are active up to today
                : new Date(renewalDue);

        // Iterate through the months and check for overlap
        for (const month of monthsArray) {
            const [year, monthIndex] = month.split("-");
            const monthStart = new Date(parseInt(year), parseInt(monthIndex) - 1, 1);
            const monthEnd = new Date(parseInt(year), parseInt(monthIndex), 0); // Last day of the month

            // Check if the member is active during the month
            if (memberStart <= monthEnd && memberEnd >= monthStart) {
                finalData[month]++;
            }
        }
    }

    return finalData;
};

// Top State active members

export const activeMemberByState = (data: WildApricotData[]) => {
    let finalData: { [ key: string ]: number } = {};

    for (const obj of data) {
        const {
         "Membership status": membershipStatus,
         "State/Province": state,
         "Country": country,
         } = obj;

        if (membershipStatus === 'Active' && country === 'United States') {
            finalData[state] = (finalData[state] || 0 ) + 1;
        }
    }

    const sortedStates = Object.entries(finalData).sort((a, b) => b[1] - a[1]);

    const topFiveStates = sortedStates.slice(0,5);

    return {
        finalData,
        topFiveStates,
    }
};

// Subscription Source

export const subscriptionSourceFx = (data: WildApricotData[]) => {
    let finalData: { [key: string]: number } = {};

    for (const obj of data) {
        const {
            "How did you learn about NKF Professional Membership?": nkfSource,
            "Membership status": membershipStatus,
        } = obj;

        if (nkfSource) {
            // Split the nkfSource string by commas and process each source
            const sources = nkfSource.split(',').map(source => source.trim());
            for (const source of sources) {
                // Increment count for source
                finalData[source] = (finalData[source] || 0) + 1;

                // If the membership is active, increment active count
                if (membershipStatus === "Active") {
                    const activeKey = `active_${source}`;
                    finalData[activeKey] = (finalData[activeKey] || 0) + 1;

                }
            }
        }
    }

    return finalData;
};

// Age Analysis

export const ageAnalysisFx = (data: WildApricotData[]) => {
    const ages: number[] = [];
    const currentYear = new Date().getFullYear();

    // Extract ages from the dataset
    for (const obj of data) {
        const dob = obj["Date of Birth"];
        if (dob) {
            const birthYear = new Date(dob).getFullYear();
            const age = currentYear - birthYear;
            ages.push(age);
        }
    }

    // Sort ages for range and median calculation
    ages.sort((a, b) => a - b);

    // Calculate range
    const range = ages.length > 0 ? ages[ages.length - 1] - ages[0] : 0;

    // Calculate mean
    const total = ages.reduce((sum, age) => sum + age, 0);
    const mean = ages.length > 0 ? total / ages.length : 0;

    // Calculate median
    const mid = Math.floor(ages.length / 2);
    const median =
        ages.length % 2 === 0
            ? (ages[mid - 1] + ages[mid]) / 2
            : ages[mid];

    // Calculate mode
    const frequencyMap: Record<number, number> = {};
    for (const age of ages) {
        frequencyMap[age] = (frequencyMap[age] || 0) + 1;
    }
    const maxFrequency = Math.max(...Object.values(frequencyMap));
    const modes = Object.keys(frequencyMap)
        .filter((key) => frequencyMap[+key] === maxFrequency)
        .map(Number);

    return {
        range,
        mean: +mean.toFixed(2), // Optional: rounding to 2 decimal places
        median,
        mode: modes, // Return all modes if there's a tie
    };
};

// Add on analysis

export const addOnAnalysisFx = (data: WildApricotData[]) => {
    let finalData: {
        [addOnType: string]: number;
    } = {};

    for (const obj of data) {
        const {
            "Add-On E-Subscription to NKF Journals": nkfJournal,
            "Add-On E-Subscription to NKF Journals 2 Year": nkfJournal2Year,
            "Add-On Print Subscription to Advances in Kidney Disease and Health (AKDH) - RN/PHYS": advanceRn,
            "Add-On Print Subscription to Advances in Kidney Disease and Health (AKDH) - RN/PHYS 2 Year": advanceRn2Year,
            "Add-On Print Subscription to Advances in Kidney Disease and Health (AKDH)": advance,
            "Add-On Print Subscription to Advances in Kidney Disease and Health (AKDH) 2 Year": advance2Year,
            "Add-On Print Subscription to American Journal of Kidney Diseases (AJKD)": americanJournal,
            "Add-On Print Subscription to American Journal of Kidney Diseases (AJKD) 2 Year": americanJournal2Year,
            "Add-On Print Subscription to Journal of Renal Nutrition": renalNutrition,
            "Add-On Print Subscription to Journal of Renal Nutrition 2 Year": renalNutrition2Year,
            "Add-On International Society of Nutrition and Metabolism (ISRNM) Membership - Physician": nutritionPhy,
            "Add-On International Society of Nutrition and Metabolism (ISRNM) Membership - Physician 2 Year": nutritionPhy2Year,
            "Add-On International Society of Nutrition and Metabolism (ISRNM) Membership - Dietitian": nutritionDiet,
            "Add-On International Society of Nutrition and Metabolism (ISRNM) Membership - Dietitian 2 Year": nutritionDiet2Year,
        } = obj;

        const addOns = {
            nkfJournal,
            nkfJournal2Year,
            advanceRn,
            advanceRn2Year,
            advance,
            advance2Year,
            americanJournal,
            americanJournal2Year,
            renalNutrition,
            renalNutrition2Year,
            nutritionPhy,
            nutritionPhy2Year,
            nutritionDiet,
            nutritionDiet2Year,
        };

        for (const [addOnType, value] of Object.entries(addOns)) {
            if (value) {
                // Increment the count for the add-on type
                finalData[addOnType] = (finalData[addOnType] || 0) + 1;
            }
        }
    }

    return finalData;
};


// =======================================================================================================================================
// Wild Apricot Analysis
// =======================================================================================================================================

export const membershipSurveyFx = (surveyData: SurveyData[]) => {
    let finalData = {
        featuresCount: {} as Record<string, number>,
        benefitsCount: {} as Record<string, number>,
        educationCount: {} as Record<string, number>,
        eventsCount: {} as Record<string, number>,
    };
    
    // Helper function that goes through the answers
    const processCounts = (data: string | undefined, countObj: Record<string, number>) => {
        if (!data) return;

        const selections = data.split("\n").map(item=> item.trim());

        for (const selection of selections) {
            if (selection) {
                countObj[selection] = (countObj[selection] || 0) + 1;
            }
        }
    }

    for (const obj of surveyData) {
        const {
            features,
            benefits,
            educationFormat,
            events,
        } = obj;

        processCounts(features, finalData.featuresCount);
        processCounts(benefits, finalData.benefitsCount);
        processCounts(educationFormat, finalData.educationCount);
        processCounts(events, finalData.eventsCount);
    }

    return finalData;
}