import React, { useState, useEffect } from 'react';

// Imports - Components/Pages

import Page from '../components/Page';
import GenerateExcelFileGeneral from '../components/GenerateExcelFileGeneral';
import GeneralTable from '../components/GeneralTable';

// Function Imports

import { 
    
    // Clean Up Surveys Pre Combo
    registrationFxUpdate,
    informedConsentFxUpdate,
    coreSurveyFxUpdate,
    eq5d5lSurveyFxUpdate,
    kdqolSurveyFxUpdate,

    // Combine Cleaned Up Surveys
    patientPortalComboNew,

    // bots
    removeBotsFx,
} from '../functions/patientPortalFx';

// Data Imports

let registrationData;
let informedConsentData;
let coreSurveyData;
let eq5d5lData;
let kdqolData;
let botReviewData;

try {
    registrationData = require('../data/patientPortal/registration').registrationData;
    informedConsentData = require('../data/patientPortal/informedConsent').informedConsentData;
    coreSurveyData = require('../data/patientPortal/coreSurvey').coreSurveyData;
    eq5d5lData = require('../data/patientPortal/eq5d5l').eq5d5lData;
    kdqolData = require('../data/patientPortal/kdqol').kdqolData;
    botReviewData = require('../data/patientPortal/botReview').botReviewData;
} catch (error) {
    registrationData = 'No data found';
    informedConsentData = 'No data found';
    coreSurveyData = 'No data found';
    eq5d5lData = 'No data found';
    kdqolData = 'No data found';
    botReviewData = 'No data found';
}

const PatientPortal = () => {

    // ----- Page Variables
    
    const title = 'KIDNEYcare: Patient Portal';

    // Update Surveys

    const [registrationUpdate, setRegistrationUpdate] = useState((registrationData !== 'No data found') ? (registrationFxUpdate(registrationData)) : 'No registration data found');
    const [informedConsentUpdate, setInformedConsentUpdate] = useState((informedConsentData !== 'No data found') ? (informedConsentFxUpdate(informedConsentData)) : 'No icf data found');
    const [coreSurveyUpdate, setCoreSurveyUpdate] = useState((coreSurveyData !== 'No data found') ? (coreSurveyFxUpdate(coreSurveyData)) : 'No core survey data found');
    const [eq5d5lUpdate, setEq5d5lUpdate] = useState((eq5d5lData !== 'No data found') ? (eq5d5lSurveyFxUpdate(eq5d5lData)) : 'No eq5d5l data found');
    const [kdqolUpdate, setKdqollUpdate] = useState((kdqolData !== 'No data found') ? (kdqolSurveyFxUpdate(kdqolData)) : 'No eq5d5l data found');

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

    const [botsGone, setRemoveBots] = useState(removeBotsFx(comboData, botReviewData));

    // Analysis Buttons
    
    const analysisButtons = [
        { id: 1, "name": "Cleaned Data Combo", "data": comboData },
        { id: 2, "name": "Bots gone", "data": botsGone },
    ];   

    return(
        <section class='page' id='patientPortal'>
            <Page pageTitle={title} buttons={analysisButtons} />
            <GenerateExcelFileGeneral generalData={botsGone} />
        </section>
    )
};

export default PatientPortal;