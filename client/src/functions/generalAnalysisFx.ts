// ========================================================================================================================
//  General Analysis/Cleanup Functions
// ========================================================================================================================

import { 
  // Medication Clean Up
  Medications,
  MedicationsClean,

  // 
  EgfrDups,
  UacrDups,
  EgfrFollowUpDups,
  UacrFollowUpDups,

  // klc analytics
  AllData,
  ModuleData,

  // Dialysis
  DialysisData,
} from "../typeScript/generalAnalysis";

// Medication Clean Up

export const medicationCleanUpFx = (data: Medications[]): MedicationsClean => {
  let cleanMedData: MedicationsClean = {};

  for (const obj of data) {
    const { med, mrn, startDate, stopDate } = obj;
    const identifier = `${mrn}-${med}`;

    // Ignore entries without valid start and stop dates
    if (!startDate) continue;

    if (!cleanMedData[identifier]) {
      // Create new entry for mrn-med combination
      cleanMedData[identifier] = {
        mrn: mrn,
        medType: med,
        medStartDate: startDate,
        medStopDate: stopDate || "Still on medication", // Default to ongoing if no stopDate provided
      };
    } else {
      // Update the start date to the earliest date
      if (new Date(cleanMedData[identifier].medStartDate) > new Date(startDate)) {
        cleanMedData[identifier].medStartDate = startDate;
      }

      // Logic for stop date
      if (stopDate) {
        if (!cleanMedData[identifier].medStopDate || new Date(cleanMedData[identifier].medStopDate) < new Date(stopDate)) {
          cleanMedData[identifier].medStopDate = stopDate;
        }
      } else {
        // Ensure that ongoing medication status is protected
        cleanMedData[identifier].medStopDate = "Still on medication";
      }
    }
  }
  
  return cleanMedData;
};

// Duplicate Cleaning

export const dupLabClean = (data: Array<UacrFollowUpDups>): Array<{ mrn: number; date: string; value: number }> => {
  // Custom date parsing function
  const parseDate = (dateStr: string): Date | null => {
    const parsedDate = new Date(dateStr);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  // Parse dates and filter out invalid ones, then sort by MRN and date descending
  const parsedData = data
    .map(d => ({ ...d, parsedDate: parseDate(d.followUpUACRDate) }))
    .filter(d => d.parsedDate !== null)
    .sort((a, b) => (b.parsedDate as Date).getTime() - (a.parsedDate as Date).getTime() || b.mrn - a.mrn);

  const result = new Map<number, { mrn: number; date: string; value: number }>();

  // Filter for most recent non-blank value per MRN
  parsedData.forEach(item => {
    if (item.followUpUACRValue !== undefined && item.followUpUACRValue !== null && !result.has(item.mrn)) {
      result.set(item.mrn, { mrn: item.mrn, date: item.followUpUACRDate, value: item.followUpUACRValue });
    }
  });

  return Array.from(result.values());
};

export const klcCourseAnalysisFx = (dataAll: AllData[], courseData: ModuleData[]) => {
  let counts = {
    notEnrolled: 0, // Users in dataAll but not in moduleData
    enrolledAll: 0, // Unique users in courseData (whether completed or not)
    enrolledNotCompleted: 0, // Users in moduleData but never completed a course
  };

  // Step 1: Get all unique emails from courseData
  const enrolledEmails = new Set(courseData.map(course => course.email));

  // Step 2: Count users in dataAll but not in moduleData (never enrolled)
  counts.notEnrolled = dataAll.filter(user => !enrolledEmails.has(user.email)).length;

  // Step 3: Set enrolledAll to the count of unique enrolled users
  counts.enrolledAll = enrolledEmails.size;

  // Step 4: Identify users who enrolled but never completed a course
  const enrollmentMap = new Map<string, boolean>();

  for (const { email, courseComplete } of courseData) {
    if (!enrollmentMap.has(email)) {
      enrollmentMap.set(email, false); // Assume they haven't completed any course
    }
    if (courseComplete) {
      enrollmentMap.set(email, true); // Mark as completed at least one course
    }
  }

  // Step 5: Count users who enrolled but never completed a single course
  counts.enrolledNotCompleted = Array.from(enrollmentMap.values()).filter(v => !v).length;

  return counts;
};

export const dialysisFx = (data: DialysisData[]): DialysisData[] => {
  const regionGroups: { [key: string]: DialysisData[] } = {};

  // Group data by region
  data.forEach((entry) => {
    if (!regionGroups[entry.region]) {
      regionGroups[entry.region] = [];
    }
    regionGroups[entry.region].push(entry);
  });

  let selectedData: DialysisData[] = [];

  // Select a diverse mix from each region
  Object.values(regionGroups).forEach((regionData) => {
    // Sort by pdUsePct for diversity
    regionData.sort((a, b) => a.pdUsePct - b.pdUsePct);

    // Split data into low, mid, and high pdUsePct
    const third = Math.floor(regionData.length / 3);
    const low = regionData.slice(0, third);
    const mid = regionData.slice(third, 2 * third);
    const high = regionData.slice(2 * third);

    // Randomly pick a few from each category
    const pickRandom = (arr: DialysisData[], num: number) =>
      arr.sort(() => 0.5 - Math.random()).slice(0, num);

    selectedData.push(...pickRandom(low, 3));
    selectedData.push(...pickRandom(mid, 3));
    selectedData.push(...pickRandom(high, 3));
  });

  // Shuffle final selection and limit to 30-40 items
  selectedData = selectedData.sort(() => 0.5 - Math.random()).slice(0, 40);

  return selectedData;
};