import React, { useState } from 'react';

// Imports - Components/Pages
import Page from '../components/Page';
import GeneralAnalysisTable from '../components/GeneralAnalysisTable';

// ==================================================================================
// Affinia Analysis
// ==================================================================================

// Function Imports

import { 
    // Pre Clean
    formatPreInterventionData,

    // Functions
    functionOne, // Outcomes Measures
    functionOneFollowUp, // Follow Up Analysis
    functionTwoPre, // Secondary Outcomes Pre
    functionTwoPost, // Secondary Outcomes Post
    functionThree, // Demographics Outcomes
    medicationCountAnalysis, // Medication Analysis Count
    countSurveyResponses, // Survey Monkey Counts

    medicationCountAnalysisFxNew, // Medication Analysis New - Normal vs Abnormal
    functionBpA1cFx, // Normal vs Abnormal BP, A1C

    // V8.0 Additions
    functionOneFollowUpOnly, // Follow Up Counts 
    katelynTable, // a1-3 confirm tests

    // V9.0 Additions
    zipInsuranceAll, // top 5 zips, insurance counts for kitReturned and kit not returned
    ethnicityFxCount, // ethnicity complete vs not complete test
    tableV9, // table but only those with follow up completed

    // V10.0
    zipDistanceFx,

    // V11.0
    v11Table,
    v11TableFollowUp,
    v11FollowUpCountsNew,
    v11TableMegan,

    // Additional Asks
    
} from '../functions/affiniaFx';

// Data Imports

let allMrn;
let allMedicationData;
let allZipInsurance;
let preInterventionData;
let postInterventionData;
let postFollowUpInterventionData;
let surveyMonkeyData;

try {
    allMrn = require('../data/affinia').allMrn;
    allMedicationData = require('../data/affinia').allMedicationData;
    allZipInsurance = require('../data/affinia').allZipInsurance;
    preInterventionData = require('../data/affinia').preInterventionData;
    postInterventionData = require('../data/affinia').postInterventionData;
    postFollowUpInterventionData = require('../data/affinia').postFollowUpInterventionData;
    surveyMonkeyData = require('../data/affinia').surveyMonkeyData;
} catch (error) {
    allMrn = 'No data found';
    allMedicationData = 'No data found';
    allZipInsurance = 'No data found';
    preInterventionData = 'No data found';
    postInterventionData = 'No data found';
    postFollowUpInterventionData = 'No data found';
    surveyMonkeyData = 'No data found';
}

const Affinia = () => {

    // ----- Page Variables
    
    const title = 'Affinia Analysis';

    // PRE INTERVENTION CLEANED DATA SET

    const [data1, setData1] = useState(
        (preInterventionData !== 'No data found') ? 
        (formatPreInterventionData(
            preInterventionData, // All Cohort Participant data
        )) : 'No Affinia Pre Intervention Data Found'
    );
    
    // ----- Analysis Numbers

    const [outcomeMeasures, setOutcomeMeasures] = useState((postInterventionData !== 'No Affinia Data Found') ? functionOne(postInterventionData) : 'No Outcomes Data Found');
    const [secondaryOutcomesPre, setSecondaryOutcomesPre] = useState((data1 !== 'No Affinia Data Found') ? (functionTwoPre(data1)) : 'No Affinia Data Found');
    const [secondaryOutcomesPost, setSecondaryOutcomesPost] = useState((postInterventionData !== 'No Affinia Data Found') ? (functionTwoPost(postInterventionData)) : 'No Affinia Data Found');
    const [demographicsPre, setDemographicsPre] = useState((data1 !== 'No Affinia Data Found') ? (functionThree(data1, 'all')) : 'No Affinia Data Found');
    const [demographicsKitTrue, setDemographicsKitTrue] = useState((data1 !== 'No Affinia Data Found') ? (functionThree(data1, 'yes')) : 'No Affinia Data Found');
    const [demographicsKitFalse, setDemographicsKitFalse] = useState((data1 !== 'No Affinia Data Found') ? (functionThree(data1, 'no')) : 'No Affinia Data Found');
    const [medicationCount, setMedicationCount] = useState((allMedicationData !== 'No Affinia Data Found') ? (medicationCountAnalysis(allMedicationData)) : 'No Affinia Data Found');
    const [followUpCounts, setFollowUpCounts] = useState((postFollowUpInterventionData !== 'No Affinia Data Found') ? (functionOneFollowUp(postFollowUpInterventionData)) : 'No Affinia Data Found');
    const [surveyMonkeyCount, setSurveyMonkeyCount] = useState((surveyMonkeyData !== 'No Affinia Data Found') ? (countSurveyResponses(surveyMonkeyData)) : 'No Survey Monkey Data Found');

    const [medicationTest, setMedicationTest] = useState((allMedicationData !== 'No Affinia Data Found') ? (medicationCountAnalysisFxNew(allMedicationData, postInterventionData)) : 'No Survey Monkey Data Found');
    const [labsNew, setLabsNew] = useState((allMedicationData !== 'No Affinia Data Found') ? (functionBpA1cFx(preInterventionData, postInterventionData)) : 'No Survey Monkey Data Found');

    // V8.0
    const [followUpV8, setFollowUpOnlyCounts] = useState((postFollowUpInterventionData !== 'No Affinia Data Found') ? (functionOneFollowUpOnly(postFollowUpInterventionData)) : 'No Affinia Data Found');
    const [followUpV8table, setFollowUpOnlyCountsTable] = useState((postInterventionData !== 'No Affinia Data Found') ? (katelynTable(postInterventionData)) : 'No Affinia Data Found');
    
    // V9.0
    const [followUpV9, setZipV9] = useState((allZipInsurance !== 'No Affinia Data Found') ? (zipInsuranceAll(allZipInsurance, preInterventionData)) : 'No Affinia Data Found');
    const [followUpV9eth, setV9eth] = useState((preInterventionData !== 'No Affinia Data Found') ? (ethnicityFxCount(preInterventionData)) : 'No Affinia Data Found');
    const [followUpV9table, setV9table] = useState((postInterventionData !== 'No Affinia Data Found') ? (tableV9(postInterventionData, postFollowUpInterventionData)) : 'No Affinia Data Found');

    // V10.0
    const [zipDistance, setZipDistance] = useState((allMedicationData !== 'No Affinia Data Found') ? (zipDistanceFx(allZipInsurance, postInterventionData)) : 'No Survey Monkey Data Found');

    // V11.0
    const [followUpV11table, setV11table] = useState((postInterventionData !== 'No Affinia Data Found') ? (v11Table(postInterventionData)) : 'No Affinia Data Found');
    const [followUpV11tableFollowUp, setV11tableFollowUp] = useState((postFollowUpInterventionData !== 'No Affinia Data Found') ? (v11TableFollowUp(postFollowUpInterventionData)) : 'No Affinia Data Found');
    const [followUpCountsNewFollowUp, setFollowUpCountsNewFollowUp] = useState((postFollowUpInterventionData !== 'No Affinia Data Found') ? (v11FollowUpCountsNew(postFollowUpInterventionData)) : 'No Affinia Data Found');
    const [v11TableMeganResult, setV11tableMegan] = useState((postInterventionData !== 'No Affinia Data Found') ? (v11TableMegan(postInterventionData, postFollowUpInterventionData)) : 'No Affinia Data Found');

    // -----------------
    // ANALYSIS BUTTONS
    // -----------------  

    const analysisButtons = [
        { id: 2, "name": "Section 1: Outcome Measures Post", "data": outcomeMeasures },
        { id: 3, "name": "Section 2: Secondary Outcomes Pre", "data": secondaryOutcomesPre },
        { id: 4, "name": "Section 2: Secondary Outcomes Post", "data": secondaryOutcomesPost },
        { id: 5, "name": "Section 3: Demographic Data Points Pre", "data": demographicsPre },
        { id: 6, "name": "Section 3: Demographic Data Points Kit Returned True", "data": demographicsKitTrue },
        { id: 7, "name": "Section 3: Demographic Data Points Kit Returned False", "data": demographicsKitFalse },
        { id: 8, "name": "Section 3: Follow Up Analsysi Count", "data": followUpCounts },
        { id: 9, "name": "Section 3: Medication Count", "data": medicationCount },
        { id: 10, "name": "Section 4: Survey Monkey Count", "data": surveyMonkeyCount },
        { id: 11, "name": "Medication Analysis by test result", "data": medicationTest },
        { id: 12, "name": "BP A1C by normal abrnoma", "data": labsNew },
        // V8 new buttons
        { id: 13, "name": "Follow Up Only labs cateogries", "data": followUpV8 },
        { id: 14, "name": "Katelyn Table", "data": followUpV8table },
        // V9.0
        { id: 15, "name": "ZIP and Insurance Class counts for test returned", "data": followUpV9 },
        { id: 16, "name": "Ethnicity count comp vs non comp", "data": followUpV9eth },
        { id: 17, "name": "Follow Up Table follow up completed only", "data": followUpV9table },
        // V10.0
        { id: 18, "name": "Zip Dsitance", "data": zipDistance },
        // V11.0
        { id: 20, "name": "FINAL V11.0: All 1425 who returned test", "data": followUpV11table },
        { id: 21, "name": "FINAL V11.0: All with Follow Up Data", "data": followUpV11tableFollowUp },
        { id: 22, "name": "FINAL V11.0: New Follow Up Counts", "data": followUpCountsNewFollowUp },
        { id: 23, "name": "FINAL V11.0: Megan Table", "data": v11TableMeganResult },
    ];


    return(
        <section class='page' id='registry'>
            <Page pageTitle={title} buttons={analysisButtons} />
        </section>
    )
};

export default Affinia;