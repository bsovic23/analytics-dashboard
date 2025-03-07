import React, { useState } from 'react';

// Component Imports
import Page from '../components/Page';
import GeneralAnalysisTable from '../components/GeneralAnalysisTable';

// Function Imports
import { 
    wildApricotDupsFx,
    wildApricotMemberLapseFx,
    wildApricotFiscalYearAnalysis,
    calculateFiscalYearRetention,
    newFunctions,
    quarterAnalysis,

    wildApricotRetentionNew,

    // New Kevin/Jordan Functions
    activeFyFx,

    activeMemberByMonth,
    activeMemberByState,
    subscriptionSourceFx,

    ageAnalysisFx,
    activeMemberNewFx,

    addOnAnalysisFx,

    // Membership Sruvey Functions
    membershipSurveyFx,

} from '../functions/membershipFx';

// Data Imports
let wildApricotData;
let membershipSurveyData;

try {
    wildApricotData = require('../data/membership').wildApricotData;
    membershipSurveyData = require('../data/membership').membershipSurveyData;
} catch (error) {
    wildApricotData = 'No data found';
    membershipSurveyData = 'No data found';
};


export const Membership = () => {

    // Variables
    const [dups, setDups] = useState((wildApricotData !== 'No data found') ? (wildApricotDupsFx(wildApricotData)) : 'No Wild Apricot Data');
    const month = 2;
    const year = 2025;
    const fy = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25'];
    const [lapsedData, setLapsedData] = useState((wildApricotData !== 'No data found') ? wildApricotMemberLapseFx(wildApricotData, month, year) : 'No Wild Apricot Data');
    const [trends, setTrends] = useState((wildApricotData !== 'No data found') ? (activeFyFx(wildApricotData)) : 'No Wild Apricot Data');
    const [retention, setRetention] = useState((wildApricotData !== 'No data found') ? (calculateFiscalYearRetention(wildApricotData, fy)) : 'No Wild Apricot Data');

    const [quarter, setQuarterCount] = useState((wildApricotData !== 'No data found') ? (quarterAnalysis(wildApricotData)) : 'No Wild Apricot Data');

    const [newStuff, setNewStuff] = useState((wildApricotData !== 'No data found') ? (newFunctions(wildApricotData)) : 'No Wild Apricot Data');

    const [monthActive, setMonthActive] = useState((wildApricotData !== 'No data found') ? (activeMemberByMonth(wildApricotData)) : 'No Wild Apricot Data');
    const [states, setStates] = useState((wildApricotData !== 'No data found') ? (activeMemberByState(wildApricotData)) : 'No Wild Apricot Data');
    const [subscriptionSource, setSubscriptionSource] = useState((wildApricotData !== 'No data found') ? (subscriptionSourceFx(wildApricotData)) : 'No Wild Apricot Data');

    const [age, setAge] = useState((wildApricotData !== 'No data found') ? (ageAnalysisFx(wildApricotData)) : 'No Wild Apricot Data');
    const [countNew, setCountNew] = useState((wildApricotData !== 'No data found') ? (activeMemberNewFx(wildApricotData)) : 'No Wild Apricot Data');

    const [addOn, setAddOn] = useState((wildApricotData !== 'No data found') ? (addOnAnalysisFx(wildApricotData)) : 'No Wild Apricot Data');

    const [surveyData, setSurveyData] = useState((membershipSurveyData !== 'No data found') ? (membershipSurveyFx(membershipSurveyData)) : 'No Wild Apricot Data');

    //Page Variables
    const pageTitle = 'Membership Analysis';

    
    const analysisButtons = [
        {id: 1, "name": "Wild Apricot Dups", "data": dups},
        {id: 2, "name": "Wild Apricot Lapsed Members:" + month, "data": lapsedData},
        {id: 3, "name": "Wild Apricot Year Trends", "data": trends},
        {id: 4, "name": "Retention Analysis", "data": retention},
        {id: 6, "name": "extra stats", "data": newStuff},
        {id: 7, "name": "QoQ Analysis", "data": quarter},
        //
        {id: 8, "name": "Member Active By Month", "data": monthActive},
        {id: 9, "name": "States data", "data": states},
        {id: 10, "name": "Subscription Source", "data": subscriptionSource},

        {id: 11, "name": "Age stats", "data": age},
        {id: 12, "name": "Active mmeber count", "data": countNew},
        {id: 13, "name": "Add On Count", "data": addOn},

        {id: 14, "name": "memberhsip survey counts", "data": surveyData},
    ];
    
    return(
        <section className='page' id='membership'>
            <Page pageTitle={pageTitle} buttons={analysisButtons} />
            <GeneralAnalysisTable data={lapsedData} />
        </section>
    )
};

export default Membership;