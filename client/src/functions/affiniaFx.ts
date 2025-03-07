import {
    // ====================
    // Data Imports
    // ====================

    // All Pt
    AllMrn,
    AllMedicationData,
    AllZipInsurance,

    // Pre Intervention
    PreInterventionData,

    // Post Intervention
    PostInterventionData,
    PostFollowUpInterventionData,

    // Survey Monkey
    SurveyMonkey,

    // ====================
    // Cleaned Data Sets 
    // ====================

    PatientData,
    Demographics,
    HealthConditions,

    // ====================
    // Analysis Outputs
    // ====================

    // Outcome Measures
    OutcomeMeasures,
    OutcomeMeasuresFollowUp,

    // Secondary Outcomes Interface
    SecondaryOutcomesDataPre,
    SecondaryOutcomesDataPost,
    MedicationAnalysis,

    // Demographics Outcomes Interface
    DemographicsOutcomes,

} from "../typeScript/affinia";

// =======================================================================
// CLEAN UP DATASET AFFINIA FX
// =======================================================================

// ------------------------
// Pre Intervention Data CleanUp
// ------------------------

export const formatPreInterventionData = (preInterventionData:PreInterventionData[]): { [key: number]: PatientData } => {
    let finalData: { [key: number]: PatientData } = {};

    preInterventionData.forEach((item) => {
        let identifier = item.mrn;
        
        if (!finalData[identifier]) {
            finalData[identifier] = {
                kitReturned: false,
                demographics: {
                    Gender: 'Missing',
                    Race: 'Missing',
                    Ethnicity: 'Missing',
                    Language: 'Missing',
                },
                healthConditions: {
                    'A1C Date Pre': '',
                    'A1C Result Pre': null,
                    'BP Date Pre': '',
                    'BP Systolic Pre': null,
                    'BP Diastolic Pre': null,
                    'Hypertension': 'Missing',
                    'Diabetes': 'Missing',
                    'Both Hypertension and Diabetes': 'Missing'
                }
            };
        }

        finalData[identifier].kitReturned = item.kitReturned;

        finalData[identifier]['demographics'] = {
            // Demographics
            'Gender': item.gender || 'Missing',
            'Race': item.race || 'Missing',
            "Ethnicity": item.ethnicity || 'Missing',
            "Language": item.language || 'Missing',
        };

        finalData[identifier]['healthConditions'] = {
            'A1C Date Pre': item.a1c_date_pre || '',
            'A1C Result Pre': item.a1c_result_pre, 
            'BP Date Pre': item.bp_date_pre || '',
            'BP Systolic Pre': item.bp_systolic_pre,
            'BP Diastolic Pre': item.bp_diastolic_pre,
            'Hypertension': item.htn_yn_pre || 'Missing',
            'Diabetes': item.dm_yn_pre || 'Missing',
            'Both Hypertension and Diabetes': item.htn_bp_yn_pre || 'Missing'
        };
    });

    return finalData; 
};


// ------------------------
// Post Intervention Data CleanUp
// ------------------------

// Dont Need

// =======================================================================
// Affinia Analysis Functions
// =======================================================================
/*

Table of contents:

Function 1: Outcome Measures - Post Intervention Measure
Function 2: Medication analysis
Function 3: Demographic Data Points analysis

*/

// -----------------------------------------------------------------------------------------------------------------------------------------------
// Function 1 - 
// -----------------------------------------------------------------------------------------------------------------------------------------------

export const functionOne = (data: PostInterventionData[]): OutcomeMeasures => {
    let postData: OutcomeMeasures = {
        resultCategory: {},
        ckdStage: {
            g1: 0,
            g2: 0,
            g3a: 0,
            g3b: 0,
            g4: 0,
            g5: 0,
            g1NoUacr: 0,
            g2NoUacr: 0,
            missingEgfr: 0,
        },
        mrns: {
            g1: [],
            g2: [],
            g3a: [],
            g3b: [],
            g4: [],
            g5: [],
            g1NoUacr: [],
            g2NoUacr: [],
            missingEgfr: [],
        },
    };

    const rangeUp = new Date("08/15/2023");
    const rangeDown = new Date("06/30/2024");

    for (const obj of data) {
        // resultCategory
        const result = obj.testResult;
        postData.resultCategory[result] = (postData.resultCategory[result] || 0) + 1;

        // ckdStage
        const egfrValue = obj.eGFRValue;
        const egfrDate = new Date(obj.eGFRDate);
        const uacrValue = obj.post_uacr;
        const uacrDate = new Date(obj.post_uacrDate);

        // Check for missing eGFR value
        if (egfrValue === null || egfrValue === undefined) {
            postData.ckdStage.missingEgfr += 1;
            postData.mrns.missingEgfr.push(String(obj.mrn));  // Convert mrn to string
        } else {
            // Evaluate eGFR and UACR values only if eGFR is present
            if (egfrValue >= 90 && uacrValue > 30 && egfrDate >= rangeUp && egfrDate <= rangeDown && uacrDate >= rangeUp && uacrDate <= rangeDown) {
                postData.ckdStage.g1 += 1;
                postData.mrns.g1.push(String(obj.mrn));  // Convert mrn to string
            } else if (egfrValue >= 60 && uacrValue > 30 && egfrDate >= rangeUp && egfrDate <= rangeDown && uacrDate >= rangeUp && uacrDate <= rangeDown) {
                postData.ckdStage.g2 += 1;
                postData.mrns.g2.push(String(obj.mrn));  // Convert mrn to string
            } else if (egfrValue >= 45 && egfrValue < 60 && egfrDate >= rangeUp && egfrDate <= rangeDown) {
                postData.ckdStage.g3a += 1;
                postData.mrns.g3a.push(String(obj.mrn));  // Convert mrn to string
            } else if (egfrValue >= 30 && egfrValue < 45 && egfrDate >= rangeUp && egfrDate <= rangeDown) {
                postData.ckdStage.g3b += 1;
                postData.mrns.g3b.push(String(obj.mrn));  // Convert mrn to string
            } else if (egfrValue >= 15 && egfrValue < 30 && egfrDate >= rangeUp && egfrDate <= rangeDown) {
                postData.ckdStage.g4 += 1;
                postData.mrns.g4.push(String(obj.mrn));  // Convert mrn to string
            } else if (egfrValue < 15 && egfrDate >= rangeUp && egfrDate <= rangeDown) {
                postData.ckdStage.g5 += 1;
                postData.mrns.g5.push(String(obj.mrn));  // Convert mrn to string
            } else if (egfrValue >= 90 && egfrDate >= rangeUp && egfrDate <= rangeDown) {
                postData.ckdStage.g1NoUacr += 1;
                postData.mrns.g1NoUacr.push(String(obj.mrn));  // Convert mrn to string
            } else if (egfrValue >= 60 && egfrDate >= rangeUp && egfrDate <= rangeDown) {
                postData.ckdStage.g2NoUacr += 1;
                postData.mrns.g2NoUacr.push(String(obj.mrn));  // Convert mrn to string
            }
        }
    }

    return postData;
};


export const functionOneFollowUpOnly = (data: PostFollowUpInterventionData[]): OutcomeMeasures => {
    let postData: OutcomeMeasures = {
        resultCategory: {},
        ckdStage: {
            g1: 0,
            g2: 0,
            g3a: 0,
            g3b: 0,
            g4: 0,
            g5: 0,
            g1NoUacr: 0,
            g2NoUacr: 0,
            missingEgfr: 0,
        },
        mrns: {
            g1: [],
            g2: [],
            g3a: [],
            g3b: [],
            g4: [],
            g5: [],
            g1NoUacr: [],
            g2NoUacr: [],
            missingEgfr: [],
        },
    };

    let under30yesEGFR = 0;

    for (const obj of data) {
        
        // ckdStage
        const egfrValue = obj.followUpEGFRValue;
        const uacrValue = obj.followUpUACRValue;

        // Check for missing eGFR value
        if (egfrValue === null || egfrValue === undefined) {
            postData.ckdStage.missingEgfr += 1;
            postData.mrns.missingEgfr.push(String(obj.mrn)); // Convert mrn to string
            // Check UACR < 30 even if eGFR is missing
            if (uacrValue !== null && uacrValue !== undefined && uacrValue < 30) {
                under30yesEGFR += 1;
            }
        } else {
            // Evaluate eGFR and UACR values only if eGFR is present
            if (egfrValue >= 90 && uacrValue > 30) {
                postData.ckdStage.g1 += 1;
                postData.mrns.g1.push(String(obj.mrn));
            } else if (egfrValue >= 60 && uacrValue > 30) {
                postData.ckdStage.g2 += 1;
                postData.mrns.g2.push(String(obj.mrn));
            } else if (egfrValue >= 45 && egfrValue < 60) {
                postData.ckdStage.g3a += 1;
                postData.mrns.g3a.push(String(obj.mrn));
            } else if (egfrValue >= 30 && egfrValue < 45) {
                postData.ckdStage.g3b += 1;
                postData.mrns.g3b.push(String(obj.mrn));
            } else if (egfrValue >= 15 && egfrValue < 30) {
                postData.ckdStage.g4 += 1;
                postData.mrns.g4.push(String(obj.mrn));
            } else if (egfrValue < 15) {
                postData.ckdStage.g5 += 1;
                postData.mrns.g5.push(String(obj.mrn));
            } else if (egfrValue >= 90) {
                postData.ckdStage.g1NoUacr += 1;
                postData.mrns.g1NoUacr.push(String(obj.mrn));
            } else if (egfrValue >= 60) {
                postData.ckdStage.g2NoUacr += 1;
                postData.mrns.g2NoUacr.push(String(obj.mrn));
            }
        
            // Check UACR < 30 when eGFR is present
            if (uacrValue !== null && uacrValue !== undefined && uacrValue < 30) {
                under30yesEGFR += 1;
            }
        }
    }
    return postData;
};

// -----------------------------------------------------------------------------------------------------------------------------------------------
// Function 2 - 
// -----------------------------------------------------------------------------------------------------------------------------------------------

export const functionOneFollowUp = (
    data: PostFollowUpInterventionData[]
): { finalData: OutcomeMeasuresFollowUp; breReviewData: { bOne: number[]; bTwo: number[] } } => {
    let finalData: OutcomeMeasuresFollowUp = {
        followUpCompleted: 0,
        followUpCompletedNo: 0,
        followUpUACRCompleted: 0,
        followUpUACRCompletedNo: 0,
        followUpEGFRCompleted: 0,
        followUpEGFRCompletedNo: 0,
        followUpBothCompleted: 0,
        followUpBothCompletedNo: 0,
    };
    
    let breReviewData = {
        bOne: [] as number[],
        bTwo: [] as number[],
    };

    for (const obj of data) {
        const { mrn, followUpCompleted, followUpTestOrdered, followUpTestComplete, followUpEGFRValue, followUpUACRValue } = obj;

        // Follow Up Scheduled and Completed VS follow up and cancel
        if (followUpCompleted === 'Yes') {
            finalData.followUpCompleted += 1;
        } else if (followUpCompleted === 'No') {
            finalData.followUpCompletedNo += 1;
        }

        // Follow Up Complete + UACR     VS     Follow Up UACR order but no result
        if (followUpCompleted === 'Yes') {
            if (followUpUACRValue !== null && followUpUACRValue !== undefined) {
                finalData.followUpUACRCompleted += 1;
            } else {
                finalData.followUpUACRCompletedNo += 1;
            }
        }

        // Follow Up Complete + EGFR     VS     Follow Up EGFR order but no result
        if (followUpCompleted === 'Yes') {
            if (followUpEGFRValue !== null && followUpEGFRValue !== undefined) {
                finalData.followUpEGFRCompleted += 1;
            } else {
                finalData.followUpEGFRCompletedNo += 1;
            }
        }

        // Bre Review

        if (followUpCompleted === 'Yes') {
            // bOne
            if (
                followUpEGFRValue !== null &&
                followUpEGFRValue !== undefined &&
                (followUpUACRValue === null || followUpUACRValue === undefined)
            ) {
                breReviewData.bOne.push(mrn);
            }

            // bTwo
            if (
                followUpUACRValue !== null &&
                followUpUACRValue !== undefined &&
                (followUpEGFRValue === null || followUpEGFRValue === undefined)
            ) {
                breReviewData.bTwo.push(mrn);
            }
        }

    

        // Follow Up Complete + EGFR + UACR    VS     Follow Up EGFR order and/or UACR but no result
        if (followUpCompleted === 'Yes') {
            if (followUpEGFRValue !== null && followUpEGFRValue !== undefined && followUpUACRValue !== null && followUpUACRValue !== undefined) {
                finalData.followUpBothCompleted += 1;
            } else {
                finalData.followUpBothCompletedNo += 1;
            }
        }
    }

    return { finalData, breReviewData };
};

// -----------------------------------------------------------------------------------------------------------------------------------------------
// Function 2 - 
// -----------------------------------------------------------------------------------------------------------------------------------------------

export const functionTwoPre = (data: PatientData[]): SecondaryOutcomesDataPre => {

    let secondaryOutcomesData: SecondaryOutcomesDataPre = {
        chronicDiseaseMgmtPre: {
            a1cControl: {
                '>9%': 0,
                '7-9%': 0,
                '<7%': 0,
                'Not Found': 0,
            },
            bpControl: {
                '>140/90': 0,
                '140/90-130/80': 0,
                '<130/80': 0,
                'None of the above': 0
            }
        }
    };

    const BP_SYS_HIGH = 140;
    const BP_DIA_HIGH = 90;

    const BP_SYS_NORMAL = 130;
    const BP_DIA_NORMAL = 80;

    const { chronicDiseaseMgmtPre } = secondaryOutcomesData;

    for (const key in data) {
        let obj = data[key];

        const rangeUp = new Date("02/01/2022");
        const rangeDown = new Date("07/30/2023");

        if (!obj.healthConditions) {
            continue;
        }

        const health = obj.healthConditions;

        // Chronic Disease Management - A1C
        if (health["A1C Date Pre"] !== null) {
            const a1cDatePre = new Date(health["A1C Date Pre"]); 
            if (a1cDatePre >= rangeUp && a1cDatePre <= rangeDown) {
                if (health['A1C Result Pre'] !== null && health['A1C Result Pre'] !== undefined) {
                    if (health['A1C Result Pre'] > 9) {
                        chronicDiseaseMgmtPre.a1cControl['>9%']++;
                    } else if (health['A1C Result Pre'] >= 7) {
                        chronicDiseaseMgmtPre.a1cControl['7-9%']++;
                    } else if (health['A1C Result Pre'] < 7) {
                        chronicDiseaseMgmtPre.a1cControl['<7%']++;
                    }
                } else {
                    chronicDiseaseMgmtPre.a1cControl['Not Found']++;
                }
            }
        }

        // Chronic Disease Management - Blood Pressure
        if (health["BP Date Pre"] !== null) {
            const bpDatePre = new Date(health["BP Date Pre"]); 
            if (bpDatePre >= rangeUp && bpDatePre <= rangeDown) {
                if (health['BP Systolic Pre'] !== null && health['BP Diastolic Pre'] !== null) {
                    if (health['BP Systolic Pre'] > BP_SYS_HIGH && health['BP Diastolic Pre'] > BP_DIA_HIGH) {
                        chronicDiseaseMgmtPre.bpControl['>140/90']++;
                    } else if ((health['BP Systolic Pre'] <= BP_SYS_HIGH && health['BP Systolic Pre'] > BP_SYS_NORMAL) &&
                               (health['BP Diastolic Pre'] <= BP_DIA_HIGH && health['BP Diastolic Pre'] > BP_DIA_NORMAL)) {
                        chronicDiseaseMgmtPre.bpControl['140/90-130/80']++;
                    } else if (health['BP Systolic Pre'] <= BP_SYS_NORMAL && health['BP Diastolic Pre'] <= BP_DIA_NORMAL) {
                        chronicDiseaseMgmtPre.bpControl['<130/80']++;
                    } else if (health['BP Systolic Pre'] > BP_SYS_HIGH) {
                        chronicDiseaseMgmtPre.bpControl['>140/90']++;
                    } else if (health['BP Systolic Pre'] > BP_SYS_NORMAL) {
                        chronicDiseaseMgmtPre.bpControl['140/90-130/80']++;
                    } else if (health['BP Systolic Pre'] < BP_SYS_NORMAL) {
                        chronicDiseaseMgmtPre.bpControl['<130/80']++;
                    } else {
                        chronicDiseaseMgmtPre.bpControl['None of the above']++;
                    }
                } else {
                    chronicDiseaseMgmtPre.bpControl['None of the above']++;
                }
            }
        }
    }

    return secondaryOutcomesData;
};

// -----------------------------------------------------------------------------------------------------------------------------------------------
// Function 1 - 
// -----------------------------------------------------------------------------------------------------------------------------------------------

export const functionTwoPost = (data: PostInterventionData[]): SecondaryOutcomesDataPost => {

    let secondaryOutcomesData: SecondaryOutcomesDataPost = {
        chronicDiseaseMgmtPost: {
            a1cControl: {
                '>9%': 0,
                '7-9%': 0,
                '<7%': 0,
                'Not Found': 0,
            },
            bpControl: {
                '>140/90': 0,
                '140/90-130/80': 0,
                '<130/80': 0,
                'None of the above': 0
            }
        }
    };

    const BP_SYS_HIGH = 140;
    const BP_DIA_HIGH = 90;

    const BP_SYS_NORMAL = 130;
    const BP_DIA_NORMAL = 80;

    const { chronicDiseaseMgmtPost } = secondaryOutcomesData;

    const rangeUp = new Date("08/15/2023");
    const rangeDown = new Date("06/30/2024");

    for (const obj of data) {
        // Convert string date fields to Date objects
        const postA1cDate = new Date(obj.post_a1cDate);
        const postBpDate = new Date(obj.post_bpDate);

        // Safeguard against null/undefined values
        const a1cResult = obj?.post_a1c;
        const bpSysResult = obj?.post_sys;
        const bpDiaResult = obj?.post_dia;

        // Chronic Disease Management - A1C
        if (postA1cDate >= rangeUp && postA1cDate <= rangeDown) {
            if (a1cResult !== null && a1cResult !== undefined) {
                if (a1cResult > 9) {
                    chronicDiseaseMgmtPost.a1cControl['>9%']++;
                } else if (a1cResult >= 7) {
                    chronicDiseaseMgmtPost.a1cControl['7-9%']++;
                } else if (a1cResult < 7) {
                    chronicDiseaseMgmtPost.a1cControl['<7%']++;
                }
            } else {
                chronicDiseaseMgmtPost.a1cControl['Not Found']++;
            }
        }

        // Chronic Disease Management - Blood Pressure
        if (postBpDate >= rangeUp && postBpDate <= rangeDown) {
            if (bpSysResult !== null && bpSysResult !== undefined && bpDiaResult !== null && bpDiaResult !== undefined) {
                if (bpSysResult === BP_SYS_NORMAL && bpDiaResult > BP_DIA_NORMAL && bpDiaResult <= BP_DIA_HIGH) {
                    chronicDiseaseMgmtPost.bpControl['140/90-130/80']++;
                } else if (bpSysResult > BP_SYS_HIGH && bpDiaResult > BP_DIA_HIGH) {
                    chronicDiseaseMgmtPost.bpControl['>140/90']++;
                } else if ((bpSysResult <= BP_SYS_HIGH && bpSysResult > BP_SYS_NORMAL) &&
                        (bpDiaResult <= BP_DIA_HIGH && bpDiaResult > BP_DIA_NORMAL)) {
                    chronicDiseaseMgmtPost.bpControl['140/90-130/80']++;
                } else if (bpSysResult <= BP_SYS_NORMAL && bpDiaResult <= BP_DIA_NORMAL) {
                    chronicDiseaseMgmtPost.bpControl['<130/80']++;
                } else if (bpSysResult > BP_SYS_HIGH) {
                    chronicDiseaseMgmtPost.bpControl['>140/90']++;
                } else if (bpSysResult >= BP_SYS_NORMAL) {
                    chronicDiseaseMgmtPost.bpControl['140/90-130/80']++;
                } else if (bpSysResult < BP_SYS_NORMAL && bpDiaResult <= BP_DIA_HIGH && bpDiaResult > BP_DIA_NORMAL) {
                    chronicDiseaseMgmtPost.bpControl['140/90-130/80']++;
                } else {
                    chronicDiseaseMgmtPost.bpControl['None of the above']++;
                }
            } else {
                chronicDiseaseMgmtPost.bpControl['None of the above']++;
            }
        }
    }

    return secondaryOutcomesData;
};

// -----------------------------------------------------------------------------------------------------------------------------------------------
// Function NORMAL AND ABNORAL BP /A1C 
// -----------------------------------------------------------------------------------------------------------------------------------------------


export const functionBpA1cFx = (preData: PreInterventionData[], postData: PostInterventionData[]) => {
    let preDataOutputNormal = {
        chronicDiseaseMgmtPost: {
            a1cControl: {
                '>9%': 0,
                '7-9%': 0,
                '<7%': 0,
                'Not Found': 0,
            },
            bpControl: {
                '>140/90': 0,
                '140/90-130/80': 0,
                '<130/80': 0,
                'None of the above': 0,
            },
        },
    };

    let preDataOutputAbnormal = {
        chronicDiseaseMgmtPost: {
            a1cControl: {
                '>9%': 0,
                '7-9%': 0,
                '<7%': 0,
                'Not Found': 0,
            },
            bpControl: {
                '>140/90': 0,
                '140/90-130/80': 0,
                '<130/80': 0,
                'None of the above': 0,
            },
        },
    };

    let postDataOutputNormal = {
        chronicDiseaseMgmtPost: {
            a1cControl: {
                '>9%': 0,
                '7-9%': 0,
                '<7%': 0,
                'Not Found': 0,
            },
            bpControl: {
                '>140/90': 0,
                '140/90-130/80': 0,
                '<130/80': 0,
                'None of the above': 0,
            },
        },
    };

    let postDataOutputAbnormal = {
        chronicDiseaseMgmtPost: {
            a1cControl: {
                '>9%': 0,
                '7-9%': 0,
                '<7%': 0,
                'Not Found': 0,
            },
            bpControl: {
                '>140/90': 0,
                '140/90-130/80': 0,
                '<130/80': 0,
                'None of the above': 0,
            },
        },
    };

    const BP_SYS_HIGH = 140;
    const BP_DIA_HIGH = 90;
    const BP_SYS_NORMAL = 130;
    const BP_DIA_NORMAL = 80;

    const preRangeUp = new Date("02/01/2022");
    const preRangeDown = new Date("07/01/2023");

    const postRangeUp = new Date("08/15/2023");
    const postRangeDown = new Date("06/30/2024");

    const isInPreRange = (dateStr: string) => {
        const date = new Date(dateStr);
        return date >= preRangeUp && date <= preRangeDown;
    };

    const isInPostRange = (dateStr: string) => {
        const date = new Date(dateStr);
        return date >= postRangeUp && date <= postRangeDown;
    };

    for (const postObj of postData) {
        const mrn = postObj.mrn;
        const testResult = postObj.testResult;

        const preObj = preData.find(p => p.mrn === mrn);

        if (preObj) {
            if (isInPreRange(preObj.a1c_date_pre)) {
                if (testResult === "Normal") {
                    if (preObj.a1c_result_pre > 9) {
                        preDataOutputNormal.chronicDiseaseMgmtPost.a1cControl['>9%']++;
                    } else if (preObj.a1c_result_pre >= 7) {
                        preDataOutputNormal.chronicDiseaseMgmtPost.a1cControl['7-9%']++;
                    } else if (preObj.a1c_result_pre < 7) {
                        preDataOutputNormal.chronicDiseaseMgmtPost.a1cControl['<7%']++;
                    } else {
                        preDataOutputNormal.chronicDiseaseMgmtPost.a1cControl['Not Found']++;
                    }
                } else if (testResult === "High Abnormal" || testResult === "Abnormal") {
                    if (preObj.a1c_result_pre > 9) {
                        preDataOutputAbnormal.chronicDiseaseMgmtPost.a1cControl['>9%']++;
                    } else if (preObj.a1c_result_pre >= 7) {
                        preDataOutputAbnormal.chronicDiseaseMgmtPost.a1cControl['7-9%']++;
                    } else if (preObj.a1c_result_pre < 7) {
                        preDataOutputAbnormal.chronicDiseaseMgmtPost.a1cControl['<7%']++;
                    } else {
                        preDataOutputAbnormal.chronicDiseaseMgmtPost.a1cControl['Not Found']++;
                    }
                }
            }

            if (isInPreRange(preObj.bp_date_pre)) {
                if (testResult === "Normal") {
                    if (preObj.bp_systolic_pre > BP_SYS_HIGH || preObj.bp_diastolic_pre > BP_DIA_HIGH) {
                        preDataOutputNormal.chronicDiseaseMgmtPost.bpControl['>140/90']++;
                    } else if (preObj.bp_systolic_pre <= BP_SYS_NORMAL && preObj.bp_diastolic_pre <= BP_DIA_NORMAL) {
                        preDataOutputNormal.chronicDiseaseMgmtPost.bpControl['<130/80']++;
                    } else {
                        preDataOutputNormal.chronicDiseaseMgmtPost.bpControl['140/90-130/80']++;
                    }
                } else if (testResult === "High Abnormal" || testResult === "Abnormal") {
                    if (preObj.bp_systolic_pre > BP_SYS_HIGH || preObj.bp_diastolic_pre > BP_DIA_HIGH) {
                        preDataOutputAbnormal.chronicDiseaseMgmtPost.bpControl['>140/90']++;
                    } else if (preObj.bp_systolic_pre <= BP_SYS_NORMAL && preObj.bp_diastolic_pre <= BP_DIA_NORMAL) {
                        preDataOutputAbnormal.chronicDiseaseMgmtPost.bpControl['<130/80']++;
                    } else {
                        preDataOutputAbnormal.chronicDiseaseMgmtPost.bpControl['140/90-130/80']++;
                    }
                }
            }
        }

        if (isInPostRange(postObj.post_a1cDate)) {
            if (testResult === "Normal") {
                if (postObj.post_a1c > 9) {
                    postDataOutputNormal.chronicDiseaseMgmtPost.a1cControl['>9%']++;
                } else if (postObj.post_a1c >= 7) {
                    postDataOutputNormal.chronicDiseaseMgmtPost.a1cControl['7-9%']++;
                } else if (postObj.post_a1c < 7) {
                    postDataOutputNormal.chronicDiseaseMgmtPost.a1cControl['<7%']++;
                } else {
                    postDataOutputNormal.chronicDiseaseMgmtPost.a1cControl['Not Found']++;
                }
            } else if (testResult === "High Abnormal" || testResult === "Abnormal") {
                if (postObj.post_a1c > 9) {
                    postDataOutputAbnormal.chronicDiseaseMgmtPost.a1cControl['>9%']++;
                } else if (postObj.post_a1c >= 7) {
                    postDataOutputAbnormal.chronicDiseaseMgmtPost.a1cControl['7-9%']++;
                } else if (postObj.post_a1c < 7) {
                    postDataOutputAbnormal.chronicDiseaseMgmtPost.a1cControl['<7%']++;
                } else {
                    postDataOutputAbnormal.chronicDiseaseMgmtPost.a1cControl['Not Found']++;
                }
            }
        }

        if (isInPostRange(postObj.post_bpDate)) {
            if (testResult === "Normal") {
                if (postObj.post_sys > BP_SYS_HIGH || postObj.post_dia > BP_DIA_HIGH) {
                    postDataOutputNormal.chronicDiseaseMgmtPost.bpControl['>140/90']++;
                } else if (postObj.post_sys <= BP_SYS_NORMAL && postObj.post_dia <= BP_DIA_NORMAL) {
                    postDataOutputNormal.chronicDiseaseMgmtPost.bpControl['<130/80']++;
                } else {
                    postDataOutputNormal.chronicDiseaseMgmtPost.bpControl['140/90-130/80']++;
                }
            } else if (testResult === "High Abnormal" || testResult === "Abnormal") {
                if (postObj.post_sys > BP_SYS_HIGH || postObj.post_dia > BP_DIA_HIGH) {
                    postDataOutputAbnormal.chronicDiseaseMgmtPost.bpControl['>140/90']++;
                } else if (postObj.post_sys <= BP_SYS_NORMAL && postObj.post_dia <= BP_DIA_NORMAL) {
                    postDataOutputAbnormal.chronicDiseaseMgmtPost.bpControl['<130/80']++;
                } else {
                    postDataOutputAbnormal.chronicDiseaseMgmtPost.bpControl['140/90-130/80']++;
                }
            }
        }
    }

    return {
        preDataOutputNormal,
        preDataOutputAbnormal,
        postDataOutputNormal,
        postDataOutputAbnormal,
    };
};

// -----------------------------------------------------------------------------------------------------------------------------------------------
// Function - Medication Analaysis
// -----------------------------------------------------------------------------------------------------------------------------------------------

// Original Medication Analysis

export const medicationCountAnalysis = (medicationData: AllMedicationData[]): MedicationAnalysis => {
    let finalData: MedicationAnalysis = {
        preMedCount: {},
        postMedCount: {}
    };

    // Define pre and post periods
    const preStart = new Date('February 1, 2022').getTime();
    const preEnd = new Date('July 30, 2023').getTime();

    const postStart = new Date('August 15, 2023').getTime();
    const postEnd = new Date('June 30, 2024').getTime();

    const currentDate = new Date('October 26, 2024').getTime();

    // Loop through each medication record
    for (const obj of medicationData) {
        const { medType, medStartDate, medStopDate } = obj;

        // Parse the start and stop dates
        const startDate = new Date(medStartDate).getTime();
        let stopDate = medStopDate === 'Still on medication'
            ? currentDate  // If still on medication, use the current date
            : new Date(medStopDate).getTime();

        // Verify that dates are valid
        if (isNaN(startDate) || isNaN(stopDate)) {
            console.error(`Invalid date for medication: ${medType}, start: ${medStartDate}, stop: ${medStopDate}`);
            continue;  // Skip this medication if dates are invalid
        }

        // Function to check if a medication is active during a period
        const isActiveDuringPeriod = (periodStart: number, periodEnd: number) =>
            (startDate <= periodEnd && stopDate >= periodStart); // Check for overlap or full containment

        // Check if medication is active during the pre period
        if (isActiveDuringPeriod(preStart, preEnd)) {
            finalData.preMedCount[medType] = (finalData.preMedCount[medType] || 0) + 1;
        }

        // Check if medication is active during the post period
        if (isActiveDuringPeriod(postStart, postEnd)) {
            finalData.postMedCount[medType] = (finalData.postMedCount[medType] || 0) + 1;
        }
    }

    return finalData;
};

// New Medication Analysis
export const medicationCountAnalysisFxNew = (medicationData: AllMedicationData[], testResultData: PostInterventionData[]) => {
    let finalData = {
        normalCount: 0,
        abnormalCount: 0,
        preNormal: {} as Record<string, number>,
        postNormal: {} as Record<string, number>,
        preAbnormal: {} as Record<string, number>,
        postAbnormal: {} as Record<string, number>,
    };

    // Define pre and post periods
    const preStart = new Date('February 1, 2022').getTime();
    const preEnd = new Date('July 30, 2023').getTime();

    const postStart = new Date('August 15, 2023').getTime();
    const postEnd = new Date('June 30, 2024').getTime();

    const currentDate = new Date('October 26, 2024').getTime();

    // Function
    for (const obj of testResultData) {
        const { mrn, testResult } = obj;

        if (testResult === "Normal") {
            finalData.normalCount ++;
            const filteredMedication = medicationData.filter(med => med.mrn === mrn);

            for (const med of filteredMedication) {  // Changed loop variable to med
                const { medType, medStartDate, medStopDate } = med;

                // Parse the start and stop dates
                const startDate = new Date(medStartDate).getTime();
                let stopDate = medStopDate === 'Still on medication'
                    ? currentDate  // If still on medication, use the current date
                    : new Date(medStopDate).getTime();

                // Verify that dates are valid
                if (isNaN(startDate) || isNaN(stopDate)) {
                    console.error(`Invalid date for medication: ${medType}, start: ${medStartDate}, stop: ${medStopDate}`);
                    continue;  // Skip this medication if dates are invalid
                }

                // Function to check if a medication is active during a period
                const isActiveDuringPeriod = (periodStart: number, periodEnd: number) =>
                    (startDate <= periodEnd && stopDate >= periodStart); // Check for overlap or full containment

                // Check if medication is active during the pre period
                if (isActiveDuringPeriod(preStart, preEnd)) {
                    finalData.preNormal[medType] = (finalData.preNormal[medType] || 0) + 1;
                }

                // Check if medication is active during the post period
                if (isActiveDuringPeriod(postStart, postEnd)) {
                    finalData.postNormal[medType] = (finalData.postNormal[medType] || 0) + 1;
                }
            }

        } else if (testResult === "High Abnormal" || testResult === "Abnormal") {
            finalData.abnormalCount ++;
            const filteredMedication = medicationData.filter(med => med.mrn === mrn);

            for (const med of filteredMedication) {  // Changed loop variable to med
                const { medType, medStartDate, medStopDate } = med;

                // Parse the start and stop dates
                const startDate = new Date(medStartDate).getTime();
                let stopDate = medStopDate === 'Still on medication'
                    ? currentDate  // If still on medication, use the current date
                    : new Date(medStopDate).getTime();

                // Verify that dates are valid
                if (isNaN(startDate) || isNaN(stopDate)) {
                    console.error(`Invalid date for medication: ${medType}, start: ${medStartDate}, stop: ${medStopDate}`);
                    continue;  // Skip this medication if dates are invalid
                }

                // Function to check if a medication is active during a period
                const isActiveDuringPeriod = (periodStart: number, periodEnd: number) =>
                    (startDate <= periodEnd && stopDate >= periodStart); // Check for overlap or full containment

                // Check if medication is active during the pre period
                if (isActiveDuringPeriod(preStart, preEnd)) {
                    finalData.preAbnormal[medType] = (finalData.preAbnormal[medType] || 0) + 1;
                }

                // Check if medication is active during the post period
                if (isActiveDuringPeriod(postStart, postEnd)) {
                    finalData.postAbnormal[medType] = (finalData.postAbnormal[medType] || 0) + 1;
                }
            }
        }
    }

    return finalData;
};

// -----------------------------------------------------------------------------------------------------------------------------------------------
// Function 1 - 
// -----------------------------------------------------------------------------------------------------------------------------------------------

export const functionThree = (data: { [key: string]: PatientData }, kitReturnedCondition: 'all' | 'yes' | 'no'): DemographicsOutcomes => {
    let demographics: DemographicsOutcomes = {
        "diabetes only": 0,
        "hypertension only": 0,
        "diabetes and hypertension": 0,
        "neither diabetes or hypertension": 0,
        gender: {},
        race: {},
        ethnicity: {},
        language: {},
    };

    // Convert the object of objects into an array of objects
    const dataArray = Object.values(data);

    // Filter data based on the kitReturnedCondition
    const filteredData = dataArray.filter(obj => {
        if (kitReturnedCondition === 'yes') {
            return obj.kitReturned === true;
        } else if (kitReturnedCondition === 'no') {
            return obj.kitReturned === false;
        }
        return true; // 'all' condition, no filtering
    });

    // Iterate over the filtered data
    for (const obj of filteredData) {
        // Health conditions
        const healthConditions = obj.healthConditions;

        if (healthConditions['Both Hypertension and Diabetes'] === 'Yes') {
            demographics['diabetes and hypertension']++;
        } else if (healthConditions.Hypertension === 'Yes' && healthConditions.Diabetes === 'No') {
            demographics['hypertension only']++;
        } else if (healthConditions.Diabetes === 'Yes' && healthConditions.Hypertension === 'No') {
            demographics['diabetes only']++;
        } else if (
            healthConditions.Diabetes === 'No' &&
            healthConditions.Hypertension === 'No' &&
            healthConditions['Both Hypertension and Diabetes'] === 'No'
        ) {
            demographics['neither diabetes or hypertension']++;
        } else {
            console.log("BP HTN ERROR: HTN:" + obj.healthConditions.Hypertension + " diabetes:" + obj.healthConditions.Diabetes);
        }

        // Demographics - gender, race, ethnicity, language
        const demo = obj.demographics;

        // Gender
        demographics.gender[demo.Gender] = (demographics.gender[demo.Gender] || 0) + 1;

        // Race
        demographics.race[demo.Race] = (demographics.race[demo.Race] || 0) + 1;

        // Ethnicity
        demographics.ethnicity[demo.Ethnicity] = (demographics.ethnicity[demo.Ethnicity] || 0) + 1;

        // Language
        demographics.language[demo.Language] = (demographics.language[demo.Language] || 0) + 1;
    }

    return demographics;
};

// -----------------------------------------------------------------------------------------------------------------------------------------------
// A1-3 + healthy io and affinia test result confirmations Analysis 
// -----------------------------------------------------------------------------------------------------------------------------------------------

export const katelynTable = (data: PostInterventionData[]) => {
    let finalData = {
        abnormal: {
            a1: 0,
            a2: 0,
            a3: 0
        },
        normal: {
            a1: 0,
            a2: 0,
            a3: 0
        },
        highAbnormal: {
            a1: 0,
            a2: 0,
            a3: 0
        },
        missingLabs: {
            normal: 0,
            abnormal: 0,
            highAbnormal: 0
        }
    };

    for (const obj of data) {
        const { testResult, post_uacr } = obj;

        if (post_uacr === null || post_uacr === undefined) {
            // Increment the count in `missingLabs` based on `testResult`
            if (testResult === "Normal") {
                finalData.missingLabs.normal++;
            } else if (testResult === "Abnormal") {
                finalData.missingLabs.abnormal++;
            } else if (testResult === "High Abnormal") {
                finalData.missingLabs.highAbnormal++;
            }
            continue; // Skip further processing for this entry
        }

        // Determine the group based on `post_uacr`
        let group: 'a1' | 'a2' | 'a3';
        if (post_uacr < 3) {
            group = 'a1';
        } else if (post_uacr >= 3 && post_uacr <= 29) {
            group = 'a2';
        } else if (post_uacr > 29) {
            group = 'a3';
        } else {
            continue; // If `post_uacr` is invalid, skip this entry
        }

        // Count into the respective result category
        if (testResult === "Normal") {
            finalData.normal[group]++;
        } else if (testResult === "Abnormal") {
            finalData.abnormal[group]++;
        } else if (testResult === "High Abnormal") {
            finalData.highAbnormal[group]++;
        }
    }

    return finalData;
};

// -----------------------------------------------------------------------------------------------------------------------------------------------
// V9.0 Additional Functions - Eth Completion vs non Complete
// -----------------------------------------------------------------------------------------------------------------------------------------------


export const ethnicityFxCount = (data: PreInterventionData[]) => {
    let finalData = {
        returned: {} as Record<string, number>,
        notReturned: {} as Record<string, number>,
    };

    for (const obj of data) {
        const { ethnicity, kitReturned } = obj;

        if (kitReturned) {
            finalData.returned[ethnicity] = (finalData.returned[ethnicity] || 0) + 1;
        } else if (kitReturned === false) {
            finalData.notReturned[ethnicity] = (finalData.notReturned[ethnicity] || 0) + 1;
        }
    }
    return finalData;
};


export const zipInsuranceAll = (
    allZipInsurance: AllZipInsurance[],
    testReturnedData: PreInterventionData[]
) => {
    // Initialize counters
    const insuranceCount: { [key: string]: { true: number; false: number } } = {};
    const zipCount: { [key: string]: { [zip: string]: number } } = { true: {}, false: {} };

    // Count insurance classes and ZIP occurrences for kitReturned = true/false
    for (const test of testReturnedData) {
        const { mrn, kitReturned } = test;

        // Convert boolean to string for indexing
        const kitReturnedKey = kitReturned ? "true" : "false";

        // Find corresponding insurance and zip from allZipInsurance
        const matchingData = allZipInsurance.find(data => data.mrn === mrn);
        if (matchingData) {
            const { zip, insuranceClass } = matchingData;

            // Count ZIPs separately for kitReturned = true/false
            zipCount[kitReturnedKey][zip] = (zipCount[kitReturnedKey][zip] || 0) + 1;

            // Count insurance classes for kitReturned true/false
            if (!insuranceCount[insuranceClass]) {
                insuranceCount[insuranceClass] = { true: 0, false: 0 };
            }
            insuranceCount[insuranceClass][kitReturnedKey]++;
        }
    }

    // Get the top 5 ZIP codes for completed (true) and not completed (false) with counts
    const topZipsWithCounts = {
        true: Object.entries(zipCount["true"])
            .sort(([, countA], [, countB]) => countB - countA) // Sort by count descending
            .slice(0, 5) // Take the top 5
            .map(([zip, count]) => ({ zip, count })), // Create objects with zip and count
        false: Object.entries(zipCount["false"])
            .sort(([, countA], [, countB]) => countB - countA) // Sort by count descending
            .slice(0, 5) // Take the top 5
            .map(([zip, count]) => ({ zip, count })), // Create objects with zip and count
    };

    return { insuranceCount, topZipsWithCounts };
};


export const tableV9 = (
    testData: PostInterventionData[],
    followUpData: PostFollowUpInterventionData[]
) => {
    let finalData = {
        followUpComplete: 0,
        abnormal: {
            a1: 0,
            a2: 0,
            a3: 0,
        },
        normal: {
            a1: 0,
            a2: 0,
            a3: 0,
        },
        highAbnormal: {
            a1: 0,
            a2: 0,
            a3: 0,
        },
        missingLabs: {
            normal: 0,
            abnormal: 0,
            highAbnormal: 0,
        },
        missingTestMrn: [] as string[], // MRNs without test results
        review: [] as { mrn: string; followUpUACRValue: number }[], // MRNs to review
    };

    // Create a map from testData for quick lookup by `mrn`
    const testDataMap = new Map(
        testData.map(({ mrn, testResult }) => [mrn.toString(), { testResult }])
    );

    for (const followUp of followUpData) {
        const { mrn, followUpCompleted, followUpUACRValue } = followUp;

        // Process only if follow-up is completed
        if (followUpCompleted !== 'Yes') {
            continue;
        }

        // Increment the follow-up complete count
        finalData.followUpComplete++;

        const testEntry = testDataMap.get(mrn.toString());

        if (!testEntry) {
            // No test result found for this `mrn`
            finalData.missingTestMrn.push(mrn.toString());
            continue;
        }

        const { testResult } = testEntry;

        if (followUpUACRValue === null || followUpUACRValue === undefined) {
            // If `followUpUACRValue` is missing, increment the count in `missingLabs`
            if (testResult === 'Normal') {
                finalData.missingLabs.normal++;
            } else if (testResult === 'Abnormal') {
                finalData.missingLabs.abnormal++;
            } else if (testResult === 'High Abnormal') {
                finalData.missingLabs.highAbnormal++;
            }
            continue;
        }

        // Determine the group based on `followUpUACRValue`
        let group: 'a1' | 'a2' | 'a3' | null = null;
        if (followUpUACRValue < 3) {
            group = 'a1';
        } else if (followUpUACRValue >= 3 && followUpUACRValue <= 29) {
            group = 'a2';
        } else if (followUpUACRValue > 29) {
            group = 'a3';
        }

        if (!group) {
            // If `followUpUACRValue` does not fit any group, add to review list
            finalData.review.push({ mrn: mrn.toString(), followUpUACRValue });
            continue;
        }

        // Increment the respective group count based on `testResult`
        if (testResult === 'Normal') {
            finalData.normal[group]++;
        } else if (testResult === 'Abnormal') {
            finalData.abnormal[group]++;
        } else if (testResult === 'High Abnormal') {
            finalData.highAbnormal[group]++;
        }
    }

    return finalData;
};



export const zipDistanceFx = (zipData: AllZipInsurance[], testData: PostInterventionData[]) => {
    let finalData: {
        [kitReturned: string]: {
            resultCount: number;
            milesCount: number;
        };
    } = {
        yesReturned: {
            resultCount: 0,
            milesCount: 0,
        },
        noReturned: {
            resultCount: 0,
            milesCount: 0,
        },
    };

    for (const obj of zipData) {
        const { mrn, zipDistanceAffinia } = obj;

        // Check if MRN exists in PostInterventionData
        const mrnMatches = testData.filter((data) => data.mrn === mrn);

        if (mrnMatches.length > 0) {
            // If MRN exists, categorize as 'yesReturned'
            for (const match of mrnMatches) {
                const { testResult } = match;

                finalData['yesReturned'].resultCount += testResult ? 1 : 0;
                finalData['yesReturned'].milesCount += zipDistanceAffinia || 0;
            }
        } else {
            // If MRN does not exist, categorize as 'noReturned'
            finalData['noReturned'].resultCount += 1;
            finalData['noReturned'].milesCount += zipDistanceAffinia || 0;
        }
    }

    return finalData;
};



// -----------------------------------------------------------------------------------------------------------------------------------------------
// VERSION 11 FINAL TABLES
// -----------------------------------------------------------------------------------------------------------------------------------------------

export const v11Table = (data: PostInterventionData[]) => {
    let finalData = {
       a1: { g1: 0, g2: 0, g3a: 0, g3b: 0, g4: 0, g5: 0 },
       a2: { g1: 0, g2: 0, g3a: 0, g3b: 0, g4: 0, g5: 0 },
       a3: { g1: 0, g2: 0, g3a: 0, g3b: 0, g4: 0, g5: 0 },
       egfrMissing: { a1: 0, a2: 0, a3: 0 },
       uacrMissing: { g1: 0, g2: 0, g3a: 0, g3b: 0, g4: 0, g5: 0 },
       missingBothLabs: 0,
    };

    for (const obj of data) {
        const { post_uacr, eGFRValue } = obj;

        if (post_uacr == null && eGFRValue == null) {
            finalData.missingBothLabs++;
        } else if (post_uacr == null) {
            // Missing UACR, categorize based on eGFRValue
            let gCategory: keyof typeof finalData.uacrMissing;
            if (eGFRValue >= 90) gCategory = 'g1';
            else if (eGFRValue >= 60) gCategory = 'g2';
            else if (eGFRValue >= 45) gCategory = 'g3a';
            else if (eGFRValue >= 30) gCategory = 'g3b';
            else if (eGFRValue >= 15) gCategory = 'g4';
            else gCategory = 'g5';
            finalData.uacrMissing[gCategory]++;
        } else if (eGFRValue == null) {
            // Missing eGFR, categorize based on post_uacr
            let aCategory: keyof typeof finalData.egfrMissing;
            if (post_uacr < 3) aCategory = 'a1';
            else if (post_uacr <= 29) aCategory = 'a2';
            else aCategory = 'a3';
            finalData.egfrMissing[aCategory]++;
        } else {
            // Both values present, categorize fully
            let aCategory: keyof typeof finalData;
            let gCategory: keyof typeof finalData.a1;

            if (post_uacr < 3) aCategory = 'a1';
            else if (post_uacr <= 29) aCategory = 'a2';
            else aCategory = 'a3';

            if (eGFRValue >= 90) gCategory = 'g1';
            else if (eGFRValue >= 60) gCategory = 'g2';
            else if (eGFRValue >= 45) gCategory = 'g3a';
            else if (eGFRValue >= 30) gCategory = 'g3b';
            else if (eGFRValue >= 15) gCategory = 'g4';
            else gCategory = 'g5';

            finalData[aCategory][gCategory]++;
        }
    }

    return finalData;
};

export const v11TableFollowUp = (data: PostFollowUpInterventionData[]) => {
    let finalData = {
       a1: { g1: 0, g2: 0, g3a: 0, g3b: 0, g4: 0, g5: 0 },
       a2: { g1: 0, g2: 0, g3a: 0, g3b: 0, g4: 0, g5: 0 },
       a3: { g1: 0, g2: 0, g3a: 0, g3b: 0, g4: 0, g5: 0 },
       egfrMissing: { a1: 0, a2: 0, a3: 0 },
       uacrMissing: { g1: 0, g2: 0, g3a: 0, g3b: 0, g4: 0, g5: 0 },
       missingBothLabs: 0,
    };

    for (const obj of data) {
        const { followUpUACRValue, followUpEGFRValue } = obj;

        if (followUpUACRValue == null && followUpEGFRValue == null) {
            finalData.missingBothLabs++;
        } else if (followUpUACRValue == null) {
            // Missing UACR, categorize based on followUpEGFR
            let gCategory: keyof typeof finalData.uacrMissing;
            if (followUpEGFRValue >= 90) gCategory = 'g1';
            else if (followUpEGFRValue >= 60) gCategory = 'g2';
            else if (followUpEGFRValue >= 45) gCategory = 'g3a';
            else if (followUpEGFRValue >= 30) gCategory = 'g3b';
            else if (followUpEGFRValue >= 15) gCategory = 'g4';
            else gCategory = 'g5';
            finalData.uacrMissing[gCategory]++;
        } else if (followUpEGFRValue == null) {
            // Missing eGFR, categorize based on followUpUACR
            let aCategory: keyof typeof finalData.egfrMissing;
            if (followUpUACRValue < 3) aCategory = 'a1';
            else if (followUpUACRValue <= 29) aCategory = 'a2';
            else aCategory = 'a3';
            finalData.egfrMissing[aCategory]++;
        } else {
            // Both values present, categorize fully
            let aCategory: keyof typeof finalData;
            let gCategory: keyof typeof finalData.a1;

            if (followUpUACRValue < 3) aCategory = 'a1';
            else if (followUpUACRValue <= 29) aCategory = 'a2';
            else aCategory = 'a3';

            if (followUpEGFRValue >= 90) gCategory = 'g1';
            else if (followUpEGFRValue >= 60) gCategory = 'g2';
            else if (followUpEGFRValue >= 45) gCategory = 'g3a';
            else if (followUpEGFRValue >= 30) gCategory = 'g3b';
            else if (followUpEGFRValue >= 15) gCategory = 'g4';
            else gCategory = 'g5';

            finalData[aCategory][gCategory]++;
        }
    }

    return finalData;
};


export const v11FollowUpCountsNew = (data: PostFollowUpInterventionData[]) => {
    let finalData = {
        visitComplete: 0,
        visitNotComplete: 0,
        egfrComplete: 0,
        egfrNotComplete: 0,
        uacrComplete: 0,
        uacrNotComplete: 0,
        bothTestsComplete: 0,
        oneTestNotComplete: 0,
    };

    for (const obj of data) {
        const {
            followUpCompleted, 
            followUpTestOrdered,
            followUpTestComplete,
            followUpEGFRValue,
            followUpUACRValue,
        } = obj;

        // Normalize null/empty values
        const egfrValid = followUpEGFRValue !== null && followUpEGFRValue !== undefined;
        const uacrValid = followUpUACRValue !== null && followUpUACRValue !== undefined;

        // Determine Visit Completion
        const visitComplete = (
            followUpCompleted === 'Yes' ||
            followUpTestOrdered === 'Yes' ||
            followUpTestComplete === 'Yes' ||
            egfrValid ||
            uacrValid
        );

        if (visitComplete) {
            finalData.visitComplete++;
        } else {
            finalData.visitNotComplete++;
        }

        // EGFR Counts
        if (egfrValid) {
            finalData.egfrComplete++;
        } else {
            finalData.egfrNotComplete++;
        }

        // UACR Counts
        if (uacrValid) {
            finalData.uacrComplete++;
        } else {
            finalData.uacrNotComplete++;
        }

        // Both Tests & One Test Logic
        if (egfrValid && uacrValid) {
            finalData.bothTestsComplete++;
        } else if (egfrValid || uacrValid) {
            finalData.oneTestNotComplete++;
        }
    }

    return finalData;
};




export const v11TableMegan = (
    data: PostInterventionData[],
    followUpData: PostFollowUpInterventionData[]
) => {
    let finalData = {
        abnormal: { a1: 0, a2: 0, a3: 0 },
        normal: { a1: 0, a2: 0, a3: 0 },
        highAbnormal: { a1: 0, a2: 0, a3: 0 },
        missingLabs: { normal: 0, abnormal: 0, highAbnormal: 0 }
    };

    // Create a map of follow-up UACR values by MRN for quick lookup
    const followUpMap = new Map<string, number | null>();
    for (const followUp of followUpData) {
        followUpMap.set(followUp.mrn.toString(), followUp.followUpUACRValue);
    }

    for (const obj of data) {
        const { mrn, testResult } = obj;
        const post_uacr = followUpMap.get(mrn.toString()) ?? null; // Get corresponding followUpUACRValue

        if (post_uacr === null) {
            // Increment missing lab count based on test result
            if (testResult === "Normal") {
                finalData.missingLabs.normal++;
            } else if (testResult === "Abnormal") {
                finalData.missingLabs.abnormal++;
            } else if (testResult === "High Abnormal") {
                finalData.missingLabs.highAbnormal++;
            }
            continue;
        }

        // Determine UACR category
        let group: "a1" | "a2" | "a3";
        if (post_uacr < 3) {
            group = "a1";
        } else if (post_uacr >= 3 && post_uacr <= 29) {
            group = "a2";
        } else {
            group = "a3";
        }

        // Increment the corresponding category
        if (testResult === "Normal") {
            finalData.normal[group]++;
        } else if (testResult === "Abnormal") {
            finalData.abnormal[group]++;
        } else if (testResult === "High Abnormal") {
            finalData.highAbnormal[group]++;
        }
    }

    return finalData;
};


// -----------------------------------------------------------------------------------------------------------------------------------------------
// Survey Monkey Analysis 
// -----------------------------------------------------------------------------------------------------------------------------------------------

export const countSurveyResponses = (data: SurveyMonkey[]): Record<string, Record<string, number>> => {
    const counts: Record<string, Record<string, number>> = {};

    // Iterate over each survey response
    for (const response of data) {
        // Iterate over each key in the SurveyMonkey interface
        for (const key in response) {
            const value = response[key as keyof SurveyMonkey];

            // Initialize the counts object for this key if it doesn't exist
            if (!counts[key]) {
                counts[key] = {};
            }

            // Increment the count for this value
            if (value) {
                counts[key][value] = (counts[key][value] || 0) + 1;
            }
        }
    }

    return counts;
};