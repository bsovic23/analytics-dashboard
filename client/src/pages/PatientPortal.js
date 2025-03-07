import React, { useState, useEffect } from 'react';

// Imports - Components/Pages
import Page from '../components/Page';
import GenerateExcelFileGeneral from '../components/GenerateExcelFileGeneral';
import GeneralTable from '../components/GeneralTable';

// Function Imports
import { 
    // Duplicate Identification Fx
    dupsFx,

    // Clean Up Surveys Pre Combo
    registrationFxUpdate,
    informedConsentFxUpdate,
    coreSurveyFxUpdate,
    eq5d5lSurveyFxUpdate,
    kdqolSurveyFxUpdate,

    // Identify High Changing Core Survey Variables
    coreSurveyVariableCountFx,

    // Combine Cleaned Up Surveys
    patientPortalComboNew,

    // Stat Functions
    countByCategory,
    ageFx,
} from '../functions/patientPortalFx';

// Data Imports
let registrationData;
let informedConsentData;
let coreSurveyData;
let eq5d5lData;
let kdqolData;

try {
    registrationData = require('../data/patientPortal/registration').registrationData;
    informedConsentData = require('../data/patientPortal/informedConsent').informedConsentData;
    coreSurveyData = require('../data/patientPortal/coreSurvey').coreSurveyData;
    eq5d5lData = require('../data/patientPortal/eq5d5l').eq5d5lData;
    kdqolData = require('../data/patientPortal/kdqol').kdqolData;
} catch (error) {
    registrationData = 'No data found';
    informedConsentData = 'No data found';
    coreSurveyData = 'No data found';
    eq5d5lData = 'No data found';
    kdqolData = 'No data found';
}

const PatientPortal = () => {

    // ----- Page Variables
    
    const title = 'KIDNEYcare: Patient Portal';

    // Duplicate Cleaning
    const [data1, setData1] = useState((registrationData !== 'No data found') ? (dupsFx(registrationData)) : 'No registration data found');
    const [data2, setData2] = useState((informedConsentData !== 'No data found') ? (dupsFx(informedConsentData)) : 'No icf data found');
    const [data3, setData3] = useState((coreSurveyData !== 'No data found') ? (dupsFx(coreSurveyData)) : 'No core Survey data found');
    const [data4, setData4] = useState((eq5d5lData !== 'No data found') ? (dupsFx(eq5d5lData)) : 'No eq5d5l data found');

    // Update Surveys
    const [registrationUpdate, setRegistrationUpdate] = useState((registrationData !== 'No data found') ? (registrationFxUpdate(registrationData)) : 'No registration data found');
    const [informedConsentUpdate, setInformedConsentUpdate] = useState((informedConsentData !== 'No data found') ? (informedConsentFxUpdate(informedConsentData)) : 'No icf data found');
    const [coreSurveyUpdate, setCoreSurveyUpdate] = useState((coreSurveyData !== 'No data found') ? (coreSurveyFxUpdate(coreSurveyData)) : 'No core survey data found');
    const [eq5d5lUpdate, setEq5d5lUpdate] = useState((eq5d5lData !== 'No data found') ? (eq5d5lSurveyFxUpdate(eq5d5lData)) : 'No eq5d5l data found');
    const [kdqolUpdate, setKdqollUpdate] = useState((kdqolData !== 'No data found') ? (kdqolSurveyFxUpdate(kdqolData)) : 'No eq5d5l data found');

    // Rule figure out variable function
    const [variableRules, setVariableRules] = useState((coreSurveyData !== 'No data found') ? (coreSurveyVariableCountFx(coreSurveyData)) : 'No eq5d5l data found');

    // CombinationData
    
    const [comboData, setComboData] = useState(() => {
        if (
            registrationUpdate !== 'No data found' &&
            informedConsentUpdate !== 'No data found' &&
            coreSurveyUpdate !== 'No data found' &&
            eq5d5lUpdate !== 'No data found' &&
            kdqolUpdate !== 'No data found'
        ) {
            return patientPortalComboNew(
                registrationUpdate,
                informedConsentUpdate,
                coreSurveyUpdate,
                eq5d5lUpdate,
                kdqolUpdate,
            );
        } else {
            console.warn('A dataset is missing');
            return [];
        }
    });

    // Stat Functions
    
    const [raceData, setRaceData] = useState(countByCategory(comboData, 'c_race'));
    const [ethnicityData, setEthnicityData] = useState(countByCategory(comboData, 'c_ethnicity'));
    const [sexData, setSexData] = useState(countByCategory(comboData, 'reg_gender'));
    const [ageData, setAgeData] = useState(ageFx(comboData, 'reg_ageRegistration'));
    const [insuranceData, setInsuranceData] = useState(countByCategory(comboData, 'c_healthInsuranceType'));
    const [ckdStageData, setCkdStageData] = useState(countByCategory(comboData, 'c_ckdCurrentStage'));
    const [dialysisData, setDialysisData] = useState(countByCategory(comboData, 'c_dialysis'));
    const [ckdCauseData, setCkdCauseData] = useState(countByCategory(comboData, 'c_knowCauseSelect'));

    /*

    
    */

    // Analysis Buttons
    const analysisButtons = [
        { id: 1, "name": "Dups Data IDs - Registration", "data": data1 },
        { id: 2, "name": "Dups Data IDs - ICF", "data": data2 },
        { id: 3, "name": "Dups Data IDs - Core Survey", "data": data3 },
        { id: 4, "name": "Dups Data IDs - eq5d5l", "data": data4 },
        { id: 5, "name": "Core Survey Top variable differences", "data": variableRules },
        { id: 6, "name": "Cleaned Data Combo", "data": comboData },
        // Stat Functions
        { id: 7, "name": "Race Data", "data": raceData },
        { id: 8, "name": "Ethnicity Data", "data": ethnicityData },
        { id: 9, "name": "Sex Data", "data": sexData },
        { id: 10, "name": "Age Data", "data": ageData },
    ];   

    return(
        <section class='page' id='patientPortal'>
        <GeneralTable dataObjects={{
            "Race Data": raceData,
            "Ethnicity Data": ethnicityData,
            "Sex Data": sexData,
            "Age Data": ageData,
            "Insurance Data": insuranceData,
            "CKD Stage Data": ckdStageData,
            "Dialysis Data": dialysisData,
            "CKD Cause Data": ckdCauseData,
        }} />
        <Page pageTitle={title} buttons={analysisButtons} />
        <GenerateExcelFileGeneral generalData={comboData} />
    </section>
    )
};

export default PatientPortal;