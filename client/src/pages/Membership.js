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

    retentionFx,

    // FISCAL JORDAN SLIDES
    jordan_memberMonth,
    jordan_stateMonth,
    jordan_professionMonth,
    jordan_organizationCount,
    jordan_memberOrigin,
    jordan_lapsedOrigin,

} from '../functions/membershipFx';

// Data Imports
let wildApricotData;
let wildApricotFinanceData;

try {
    wildApricotData = require('../data/membership/wa_generalData').wildApricotData;
    wildApricotFinanceData = require('../data/membership/wa_financeData').wildApricotFinanceData;
} catch (error) {
    wildApricotData = 'No data found';
    wildApricotFinanceData = 'No data found';
};


export const Membership = () => {

    // Variables
    const [dups, setDups] = useState((wildApricotData !== 'No data found') ? (wildApricotDupsFx(wildApricotData)) : 'No Wild Apricot Data');
    const month = 10;
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

    // Fiscal jordan variables
    const [monthCount, setMonthCount] = useState((wildApricotData !== 'No data found') ? (jordan_memberMonth(wildApricotData)) : 'No Wild Apricot Data');
    const [stateCount, setStateCount] = useState((wildApricotData !== 'No data found') ? (jordan_stateMonth(wildApricotData)) : 'No Wild Apricot Data');
    const [professionCount, setProfessionCount] = useState((wildApricotData !== 'No data found') ? (jordan_professionMonth(wildApricotData)) : 'No Wild Apricot Data');
    const [organizationCount, setOrganizationCount] = useState((wildApricotFinanceData !== 'No data found') ? (jordan_organizationCount(wildApricotFinanceData)) : 'No Wild Apricot Data');
    const [originCount, setOriginCount] = useState((wildApricotFinanceData !== 'No data found') ? (jordan_memberOrigin(wildApricotFinanceData)) : 'No Wild Apricot Data');
    const [lapsedCount, setLapsedCount] = useState((wildApricotFinanceData !== 'No data found') ? (jordan_lapsedOrigin(wildApricotFinanceData)) : 'No Wild Apricot Data');

    //Page Variables
    const pageTitle = 'Membership Analysis';

    
    const analysisButtons = [
        // Monthly Check of Data Report Buttons

        {id: 1, "name": "Wild Apricot Monthly Report - Duplicate Member", "data": dups},
        {id: 2, "name": "Wild Apricot Monthly Report - Lapsed Members: Month " + month, "data": lapsedData},

        // Fiscal Year Analysis Reporting Buttons

        {id: 3, "name": "FY Analysis (Tab 1)- Year Trends", "data": trends},
        {id: 12, "name": "FY Analysis (Tab 2) - Active mmeber count", "data": countNew},
        {id: 6, "name": "FY Analysis (Tab 4) - Extra Stats", "data": newStuff},
        {id: 7, "name": "FY Analysis (Tab 4) - Extra Stats (QoQ Analysis)", "data": quarter},
        {id: 11, "name": "FY Analysis (Tab 4) - Extra Stats (Age)", "data": age},
        {id: 9, "name": "FY Analysis (Tab 4) - Extra Stats (States)", "data": states},

        // Need to double check what used for

        {id: 4, "name": "Retention Analysis", "data": retention},
        {id: 8, "name": "Member Active By Month", "data": monthActive},
        {id: 10, "name": "Subscription Source", "data": subscriptionSource},
        
        {id: 13, "name": "Add On Count", "data": addOn},

        // NEW FISCAL JORDAN STATS

        {id: 20, "name": "Jordan Fiscal - Month Member Count", "data": monthCount}, // What month did person become member
        {id: 21, "name": "Jordan Fiscal - Top 3 states new memeber", "data": stateCount}, // What month did person become member
        {id: 22, "name": "Jordan Fiscal - Top 3 professions new memeber", "data": professionCount}, // What month did person become member
        {id: 23, "name": "Jordan Fiscal - Organization", "data": organizationCount}, // What month did person become member
        {id: 24, "name": "Jordan Fiscal - Origin", "data": originCount}, // What month did person become member
         {id: 25, "name": "Jordan Fiscal - Origin renewal if renewal during lapsed", "data": lapsedCount}, // What month did person become member
    ];
    
    return(
        <section className='page' id='membership'>
            { /*         */ }
            <GeneralAnalysisTable data={lapsedData} />
            <Page pageTitle={pageTitle} buttons={analysisButtons} />
        </section>
    )
};

export default Membership;