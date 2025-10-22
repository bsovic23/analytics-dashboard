/*

Functions

demographicsFx: Counts all the demogrpahics for initial
fySurveyCountsFx: will help to do a heat map of number of surveys completed each fiscal year
pamScoringFx: Calcualtes the Activation score based on the totalScore and the Activation Level
increasedScoreAllFx: Total number of people that have increased from first survey to most recent survey regardless of FY start/finish
activationLevelCountFx: 
activationLevelFyFx: 

initialConnectionFx: Average PAM Score * type of connection

to do future:
() retentionPercent: maybe go back and include the date of surveys to figure out how many people have lapsed more than 3 months past their most recent survey
() retentionPercentFy: same as above but figure out what fy they dropped off from to look at retention fy to fy

to do:
() avgScoreChangeFx: Averge Score change from initial to follow up
() surveyMinimumFilledOut: How many filled out at least initial + 1 follow up survey
() avgScoreAmountChangeFx: average amount score changed ?
() scoreAnalysisFx: do initial level 1,2 group vs level 3,4 group and see the average change to see if those who came in with lower level changed more than higher level
() individualSurveyCountFx: How many surveys filled out per person (1,2,3,4,5)
*/


export const demographicsFx = (data) => {
   
    const demographics = {
        genderCount: {},
        primaryConnectionCount: {},
        typeConnectionCount: {},
        causeKidneyCount: {},
    };

    for (const obj of data) {
        const { 
            "Gender__": gender, 
            "What_is_your_primary_connection": primaryConnection, 
            "Type_of_connection__": typeConnection,
            "What_is_the_cause_of_your_kidney": causeKidney,
        } = obj;

        // Gender Demographics
        if (gender) {
            demographics.genderCount[gender] = (demographics.genderCount[gender] || 0) + 1;
        }

        // Primary Connection Demographics
        if (primaryConnection) {
            demographics.primaryConnectionCount[primaryConnection] = (demographics.primaryConnectionCount[primaryConnection] || 0) + 1;
        }

        // Type Connection Demographics
        if (typeConnection) {
            demographics.typeConnectionCount[typeConnection] = (demographics.typeConnectionCount[typeConnection] || 0) + 1;
        }

        // Cause Kidney Demographics
        if (causeKidney) {
            demographics.causeKidneyCount[causeKidney] = (demographics.causeKidneyCount[causeKidney] || 0) + 1;
        }
    }  

    return demographics;
}

export const fySurveyCountsFx = (data) => {

    const fyCounts = {};

    for (const obj of data) {
        for (const key of ['fyM0', 'fyM3', 'fyM6', 'fyM9', 'fyM12']) {
            const fy = obj[key]?.trim();

            if (!fy) continue;

            if (!fyCounts[key]) {
                fyCounts[key] = {
                    FY23: 0,
                    FY24: 0,
                    FY25: 0,
                    other: 0,
                };
            }


            if ( fy ==='FY23' || fy === 'FY24' || fy === 'FY25') {
                fyCounts[key][fy]++;
            } else {
                fyCounts[key].other++;
            }
        }
    }
    
    return fyCounts;
}

export const pamScoringFx = (data) => {
    const scoreMap = {
      13: 0, 14: 8.2, 15: 13.3, 16: 16.5, 17: 18.9, 18: 20.9, 19: 22.7,
      20: 24.3, 21: 25.7, 22: 27.1, 23: 28.4, 24: 29.7, 25: 31, 26: 32.2,
      27: 33.5, 28: 34.7, 29: 36, 30: 37.3, 31: 38.7, 32: 40.1, 33: 41.7,
      34: 43.4, 35: 45.2, 36: 47.4, 37: 49.9, 38: 52.9, 39: 56.4, 40: 60,
      41: 63.2, 42: 66, 43: 68.5, 44: 70.8, 45: 73.1, 46: 75.3, 47: 77.5,
      48: 80, 49: 82.8, 50: 86.3, 51: 91.6, 52: 100
    };

    const levelMap = [
        { level: 1, min: 0, max: 45.2 },
        { level: 2, min: 47.4, max: 52.9 },
        { level: 3, min: 56.4, max: 66 },
        { level: 4, min: 68.5, max: 100 }
      ];
  
      const scoreFields = [
        { key: 'totalScoreInitial', scoreKey: 'activationScoreInitial', levelKey: 'activationLevelInitial' },
        { key: 'totalScoreM3', scoreKey: 'activationScoreM3', levelKey: 'activationLevelM3' },
        { key: 'totalScoreM6', scoreKey: 'activationScoreM6', levelKey: 'activationLevelM6' },
        { key: 'totalScoreM9', scoreKey: 'activationScoreM9', levelKey: 'activationLevelM9' },
        { key: 'totalScoreM12', scoreKey: 'activationScoreM12', levelKey: 'activationLevelM12' }
      ];
  
      return data.map(entry => {
        const updatedEntry = { ...entry };
    
        scoreFields.forEach(({ key, scoreKey, levelKey }) => {
          const raw = entry[key];
          if (raw !== undefined && raw !== null && raw !== '') {
            const numericScore = Number(raw);
            const activationScore = scoreMap[numericScore] ?? null;
            updatedEntry[scoreKey] = activationScore;
    
            // Assign activation level based on score range
            if (activationScore !== null) {
              const matchedLevel = levelMap.find(
                ({ min, max }) => activationScore >= min && activationScore <= max
              );
              updatedEntry[levelKey] = matchedLevel ? matchedLevel.level : null;
            } else {
              updatedEntry[levelKey] = null;
            }
          }
        });
    
        return updatedEntry;
      });
  };

export const increasedScoreAllFx = (data) => {
  const increasedScoreCounts = {
    initial_m3: 0,
    m3_m6: 0,
    m6_m9: 0,
    m9_m12: 0,
    initial_to_latest: 0,
    averageChangeInitialToLatest: null, // new field
  };

  let totalChange = 0;
  let changeCount = 0;

  for (const obj of data) {
    const {
      totalScoreInitial,
      totalScoreM3,
      totalScoreM6,
      totalScoreM9,
      totalScoreM12,
    } = obj;

    if (typeof totalScoreInitial === 'number' && typeof totalScoreM3 === 'number') {
      if (totalScoreM3 > totalScoreInitial) {
        increasedScoreCounts.initial_m3++;
      }
    }

    if (typeof totalScoreM3 === 'number' && typeof totalScoreM6 === 'number') {
      if (totalScoreM6 > totalScoreM3) {
        increasedScoreCounts.m3_m6++;
      }
    }

    if (typeof totalScoreM6 === 'number' && typeof totalScoreM9 === 'number') {
      if (totalScoreM9 > totalScoreM6) {
        increasedScoreCounts.m6_m9++;
      }
    }

    if (typeof totalScoreM9 === 'number' && typeof totalScoreM12 === 'number') {
      if (totalScoreM12 > totalScoreM9) {
        increasedScoreCounts.m9_m12++;
      }
    }

    if (typeof totalScoreInitial === 'number') {
      let mostRecentScore = null;

      if (typeof totalScoreM12 === 'number') {
        mostRecentScore = totalScoreM12;
      } else if (typeof totalScoreM9 === 'number') {
        mostRecentScore = totalScoreM9;
      } else if (typeof totalScoreM6 === 'number') {
        mostRecentScore = totalScoreM6;
      } else if (typeof totalScoreM3 === 'number') {
        mostRecentScore = totalScoreM3;
      }

      if (mostRecentScore !== null) {
        const change = mostRecentScore - totalScoreInitial;

        if (change > 0) {
          increasedScoreCounts.initial_to_latest++;
        }

        // Add to total and count for average
        totalChange += change;
        changeCount++;
      }
    }
  }

  // Calculate average change
  if (changeCount > 0) {
    increasedScoreCounts.averageChangeInitialToLatest = totalChange / changeCount;
  }

  return increasedScoreCounts;
};

export const activationLevelCountFx = (pamData) => {
    const totalLevels = {
        1: 0,
        2: 0,
        3: 0,
        4: 0
      };
    
      const levelKeys = [
        'activationLevelInitial',
        'activationLevelM3',
        'activationLevelM6',
        'activationLevelM9',
        'activationLevelM12'
      ];
    
      pamData.forEach((person) => {
        levelKeys.forEach((key) => {
          const level = person[key];
          if (level && totalLevels[level] !== undefined) {
            totalLevels[level]++;
          }
        });
      });
    
      return totalLevels;
}

export const activationLevelFyFx = (pamData) => {
    const levelFyCount = {
        FY23: { 1: 0, 2: 0, 3: 0, 4: 0 },
        FY24: { 1: 0, 2: 0, 3: 0, 4: 0 },
        FY25: { 1: 0, 2: 0, 3: 0, 4: 0 },
      };
    
      const timepoints = [
        { levelKey: 'activationLevelInitial', fyKey: 'fyM0' },
        { levelKey: 'activationLevelM3', fyKey: 'fyM3' },
        { levelKey: 'activationLevelM6', fyKey: 'fyM6' },
        { levelKey: 'activationLevelM9', fyKey: 'fyM9' },
        { levelKey: 'activationLevelM12', fyKey: 'fyM12' },
      ];
    
      pamData.forEach((person) => {
        timepoints.forEach(({ levelKey, fyKey }) => {
          const level = person[levelKey];
          const fy = person[fyKey];
          if (level && fy && levelFyCount[fy] && levelFyCount[fy][level] !== undefined) {
            levelFyCount[fy][level]++;
          }
        });
      });
    
      return levelFyCount;
}

// New Functions

export const intialConnectionFx = (data) => {
  const connectionTotals = {}; // { connectionType: { sum: number, count: number } }

  for (const obj of data) {
    const typeConnection = obj["Type_of_connection__"];
    const totalScoreInitial = obj.totalScoreInitial;

    // check for non-null/undefined and that it's a number
    if (typeConnection && typeof totalScoreInitial === 'number') {
      if (!connectionTotals[typeConnection]) {
        connectionTotals[typeConnection] = { sum: 0, count: 0 };
      }

      connectionTotals[typeConnection].sum += totalScoreInitial;
      connectionTotals[typeConnection].count += 1;
    }
  }

  // Now calculate averages
  const connectionAvgScore = {};
  for (const [key, value] of Object.entries(connectionTotals)) {
    connectionAvgScore[key] = value.sum / value.count;
  }

  return connectionAvgScore;
};

export const surveyMinimumFilledOut = (data) => {
  let count = 0;

  for (const obj of data) {
    const { totalScoreInitial, totalScoreM3, totalScoreM6, totalScoreM9, totalScoreM12 } = obj;

    const hasInitial = typeof totalScoreInitial === 'number';
    const hasAtLeastOneFollowUp = 
      typeof totalScoreM3 === 'number' || 
      typeof totalScoreM6 === 'number' || 
      typeof totalScoreM9 === 'number' || 
      typeof totalScoreM12 === 'number';

    if (hasInitial && hasAtLeastOneFollowUp) {
      count++;
    }
  }

  return count;
};

export const individualSurveyCountFx = (data) => {
  const surveyCounts = {
    completed_5_surveys: 0,
    completed_4_surveys: 0,
    completed_3_surveys: 0,
    completed_2_surveys: 0,
    completed_1_survey: 0,
    completed_0_surveys: 0 // optional, just in case
  };

  for (const obj of data) {
    const {
      totalScoreInitial,
      totalScoreM3,
      totalScoreM6,
      totalScoreM9,
      totalScoreM12
    } = obj;

    let completed = 0;

    if (typeof totalScoreInitial === 'number') completed++;
    if (typeof totalScoreM3 === 'number') completed++;
    if (typeof totalScoreM6 === 'number') completed++;
    if (typeof totalScoreM9 === 'number') completed++;
    if (typeof totalScoreM12 === 'number') completed++;

    if (completed === 5) surveyCounts.completed_5_surveys++;
    else if (completed === 4) surveyCounts.completed_4_surveys++;
    else if (completed === 3) surveyCounts.completed_3_surveys++;
    else if (completed === 2) surveyCounts.completed_2_surveys++;
    else if (completed === 1) surveyCounts.completed_1_survey++;
    else surveyCounts.completed_0_surveys++; // rare but safe to track
  }

  return surveyCounts;
};


// Future

export const scoreAnalysisFx = (data) => {

};