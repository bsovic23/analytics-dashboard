// Functions

import {
    // TypeScript Data Structure Imports
    Registration,
    InformedConsent,
    CoreSurvey,
    EQ5D5L,
    KDQOL,
} from '../typeScript/patientPortal';

// ======================================================================================================================================
// Function 1 - Duplicates Function
// ======================================================================================================================================

export const dupsFx = (data: { id: string | number }[]): Record<string | number, number> => {
    const dups: Record<string | number, number> = {};
    const idCounts: Record<string | number, number> = {};

    for (const obj of data) {
        const id = obj.id;
        if (idCounts[id]) {
            idCounts[id] += 1;
        } else {
            idCounts[id] = 1;
        }
    }

    for (const id in idCounts) {
        if (idCounts[id] > 1) {
            dups[id] = idCounts[id];
        }
    }

    return dups;
};

// ======================================================================================================================================
// Function 2 - Update Surveys with additional Variables
// ======================================================================================================================================

const fiscalYears = {
    FY24: { start: new Date("April 1, 2023"), end: new Date("May 30, 2024") },
    FY25: { start: new Date("April 1, 2024"), end: new Date("May 30, 2025") },
    FY26: { start: new Date("April 1, 2025"), end: new Date("May 30, 2026") },
};

export const registrationFxUpdate = (data: Registration[]): Registration[] => {
    const registrationDataNew: Registration[] = data.map((obj) => {
        const registrationDate = new Date(obj.registrationDate);

        let reg_FY: string | null = null;
        for (const [fy, range] of Object.entries(fiscalYears)) {
            if (registrationDate >= range.start && registrationDate <= range.end) {
                reg_FY = fy;
                break;
            }
        }

        const ageRegistration = obj.reg_dob && obj.reg_registrationDate ? Math.floor(
          (new Date(obj.reg_registrationDate).getTime() - new Date(obj.reg_dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
        ) : null;

        const ageCurrent = obj.reg_dob ? Math.floor(
            (new Date().getTime() - new Date(obj.reg_dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
        ) : null;

        return {
            ...obj,
            reg_ageRegistration: ageRegistration,
            reg_ageCurrent: ageCurrent,
            reg_FormComplete: obj.gender && obj.dob && obj.zipcode && obj.language && obj.country && obj.zipcode ? true : false, // If all have answers then complete
            reg_FY,
        };
    });

    return registrationDataNew;
};

export const informedConsentFxUpdate = (data: InformedConsent[]): InformedConsent[] => {
    const informedConsentDataNew: InformedConsent[] = data.map((obj) => {

        return {
            ...obj,
            icf_Formcomplete: obj.icf_dateSigned && obj.icf_option1 && obj.icf_option2 && obj.icf_option3 ? true : false, // If ICF signed and all 3 options completed
        };
    });

    return informedConsentDataNew;
};

export const coreSurveyFxUpdate = (data: CoreSurvey[]): CoreSurvey[] => {
    const coreSurveyDataNew: CoreSurvey[] = data.map((obj) => {

        return {
            ...obj,
            c_Formcomplete: obj.c_submittedDate ? true : false, // If there is a submitted date then survey completed
        };
    });

    return coreSurveyDataNew;
};

export const eq5d5lSurveyFxUpdate = (data: EQ5D5L[]): EQ5D5L[] => {
    const e15d5lSurveyDataNew: EQ5D5L[] = data.map((obj) => {

        return {
            ...obj,
            c_Formcomplete: obj.eq_mobility && obj.eq_selfCare && obj.eq_activitiy && obj.eq_pain && obj.eq_anxiety && obj.eq_healthLevel ? true : false,
        };
    });

    return e15d5lSurveyDataNew;
}

export const kdqolSurveyFxUpdate = (data: KDQOL[]): KDQOL[] => {
    const kdqolSurveyDataNew: KDQOL[] = data.map((obj) => {

        return {
            ...obj,
            c_Formcomplete: obj.kdqol_stress && obj.kdqol_sexLife ? true : false,
        };
    });

    return kdqolSurveyDataNew;
}

// ======================================================================================================================================
// Function 3 - Determining which Core Survey Variables are changing the most for each person
// ======================================================================================================================================

export const coreSurveyVariableCountFx = (data: CoreSurvey[]) => {
  // Step 1: Group surveys by ID
  const groupedById: Record<string, CoreSurvey[]> = {};

  data.forEach((survey) => {
    if (!groupedById[survey.id]) groupedById[survey.id] = [];
    groupedById[survey.id].push(survey);
  });

  // Step 2: Filter IDs with more than one survey
  const filteredIds = Object.keys(groupedById).filter(
    (id) => groupedById[id].length > 1
  );

  // Step 3: Initialize a tracker for variable changes
  const changeTracker: Record<string, number> = {};

  // Step 4: Compare all surveys for each ID
  filteredIds.forEach((id) => {
    const surveys = groupedById[id];

    // Compare each pair of surveys
    for (let i = 0; i < surveys.length; i++) {
      for (let j = i + 1; j < surveys.length; j++) {
        const surveyA = surveys[i];
        const surveyB = surveys[j];

        // Compare all keys/variables except 'id'
        Object.keys(surveyA).forEach((key) => {
          if (key === "id") return;

          const valueA = surveyA[key as keyof CoreSurvey];
          const valueB = surveyB[key as keyof CoreSurvey];

          if (valueA !== valueB) {
            // Increment change count for the variable
            if (!changeTracker[key]) changeTracker[key] = 0;
            changeTracker[key]++;
          }
        });
      }
    }
  });

  // Step 5: Sort the variables by the number of changes (descending)
  const sortedChanges = Object.entries(changeTracker)
    .sort((a, b) => b[1] - a[1]) // Sort by count of changes
    .slice(0, 60); // Take top 20 variables

  // Step 6: Return the top 20 variables with their change counts
  const finalData = sortedChanges.map(([variable, count]) => ({
    variable,
    count,
  }));

  return finalData;
};

// ======================================================================================================================================
// Function 4 - Combine Surveys
// ======================================================================================================================================

export interface NkfCleanData {
    id: string; // Patient identifier
    reg_registrationDate?: string;
    icf_dateSigned?: string;
    c_row178?: string; // Core survey date
    eq_submittedDate?: string; // EQ-5D-5L date
    kdqol_submittedDate?: string; // KDQOL date
    surveyTime?: number; // Time point: 0 = baseline, 1 = follow-up 6 months, etc.
}
 
// RE LOOK AT THE DATE FORMAT FOR THE EMTIRE SURVEYS

export const patientPortalComboNew = (
    registration: NkfCleanData[],
    icf: NkfCleanData[],
    coreSurvey: NkfCleanData[],
    eq5d5l: NkfCleanData[],
    kdqol: NkfCleanData[],
  ): NkfCleanData[] => {
    const combinedData: NkfCleanData[] = [];
  
    // Helper function: Group by ID and sort by date
    const groupAndSortByDate = (data: NkfCleanData[], dateKey: keyof NkfCleanData) => {
      const grouped: Record<string, NkfCleanData[]> = {};
      data.forEach((item) => {
        const id = item.id;
        if (!grouped[id]) grouped[id] = [];
        grouped[id].push(item);
      });
      Object.keys(grouped).forEach((id) => {
        grouped[id].sort((a, b) => {
          const dateA = a[dateKey] ? new Date(a[dateKey] as string).getTime() : 0;
          const dateB = b[dateKey] ? new Date(b[dateKey] as string).getTime() : 0;
          return dateA - dateB;
        });
      });
      return grouped;
    };
  
    // Group and sort datasets by their respective dates
    const coreGrouped = groupAndSortByDate(coreSurvey, "c_row178");
    const eq5d5lGrouped = groupAndSortByDate(eq5d5l, "eq_submittedDate");
    const kdqolGrouped = groupAndSortByDate(kdqol, "kdqol_submittedDate");
  
    // Set of all unique IDs across all datasets
    const allIds = new Set<string>([
      ...registration.map((r) => r.id),
      ...icf.map((i) => i.id),
      ...coreSurvey.map((c) => c.id),
      ...eq5d5l.map((e) => e.id),
      ...kdqol.map((k) => k.id),
    ]);
  
    // Process each ID
    allIds.forEach((id) => {
      const baseline: NkfCleanData = { id, surveyTime: 0 };
  
      // Add registration and ICF data for baseline
      const regData = registration.find((r) => r.id === id);
      const icfData = icf.find((i) => i.id === id);
      if (regData) Object.assign(baseline, regData);
      if (icfData) Object.assign(baseline, icfData);
  
      // Extract KDQOL baseline (first KDQOL entry regardless of date)
      const kdqolEntries = kdqolGrouped[id] || [];
      if (kdqolEntries.length > 0) Object.assign(baseline, kdqolEntries.shift());
  
      // Extract first core and EQ5D5L surveys
      const coreEntries = coreGrouped[id] || [];
      const eqEntries = eq5d5lGrouped[id] || [];
      if (coreEntries.length > 0) Object.assign(baseline, coreEntries.shift());
      if (eqEntries.length > 0) Object.assign(baseline, eqEntries.shift());
  
      // Push baseline row
      combinedData.push(baseline);
  
      // Process follow-up surveys
      let surveyTime = 1;
      while (coreEntries.length > 0 || eqEntries.length > 0 || kdqolEntries.length > 0) {
        const followUp: NkfCleanData = { id, surveyTime };
  
        if (coreEntries.length > 0) Object.assign(followUp, coreEntries.shift());
        if (eqEntries.length > 0) Object.assign(followUp, eqEntries.shift());
        if (kdqolEntries.length > 0) Object.assign(followUp, kdqolEntries.shift());
  
        combinedData.push(followUp);
        surveyTime++;
      }
    });
  
  return combinedData;
};

// ======================================================================================================================================
// Function 5 - Combine Core Surveys into one based on rules, export core survey questions that SHOULD change into repeating survey
// ======================================================================================================================================






// ======================================================================================================================================
// Function 6 - Stat Functions for counts
// ======================================================================================================================================

// Number of people by race 
export const countByCategory = (data: any[], key: string) => {
  return data.reduce((acc, obj) => {
    const category = obj[key];

    if (obj.surveyTime === 0 && category && category.trim() !== "") {
      // Split the category string by commas and trim each item
      const categories = category.split(",").map((item: string) => item.trim());

      // Increment count for each individual category value
      categories.forEach((cat: string) => {
        if (cat) {
          acc[cat] = (acc[cat] || 0) + 1;
        }
      });

      // Only increment totalCount once per object, no matter how many categories it has
      acc.totalCount = (acc.totalCount || 0) + 1;
    }

    return acc;
  }, {} as Record<string, number>);
};

// number of people who registered by age group
export const ageFx = (data: any[], key: string) => {
  return data.reduce((acc, obj) => {
    const ageRegistration = obj[key];

    function ageCategoryFx(age: number): string {
      if (age >= 18 && age <= 29) return '18-29';
      if (age >= 30 && age <= 39) return '30-39';
      if (age >= 40 && age <= 49) return '40-49';
      if (age >= 50 && age <= 59) return '50-59';
      if (age >= 60 && age <= 69) return '60-69';
      if (age >= 70 && age <= 80) return '70-80';
      if (age > 80) return '>80';
      else return `invalid age: ${age}`;
    }
      
    if (obj.surveyTime === 0 && ageRegistration) {
      const ageCategory = ageCategoryFx(ageRegistration);

      acc[ageCategory] = (acc[ageCategory] || 0) +1;
    }

    return acc;
  }, {} as Record<string,number>);
}

// ======================================================================================================================================
// Function 7 - Tab3 "Dashboard Functions"
// ======================================================================================================================================

export const surveyCounts = (data: any[], time: number, surveyDataVariable: string) => {
  return data.reduce((acc, obj) => {
    const surveyCompletedData = obj[surveyDataVariable];
    
    if (obj.surveyTime === time && surveyCompletedData) {
      acc += 1
    }

    return acc
  }, 0);
}


export const surveyCountsBySite = (data: any[], time: number, surveyDataVariable: string, siteVariable: string) => {
  return data.reduce((acc, obj) => {
    const surveyCompletedData = obj[surveyDataVariable];
    const siteHealthSystem = obj[siteVariable]
    
    if (obj.surveyTime === time && surveyCompletedData && siteHealthSystem === 'geisinger') {
      acc += 1
    }

    return acc
  }, 0);
}