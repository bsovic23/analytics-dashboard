import React, { useState } from 'react';

// Imports - Components/Pages
import Page from '../components/Page';

// Function Imports
import { moPilotDataCleanUp, finalDataAnalysisFx, surveyCounts, missingFollowUp, moSiteDemographicsFx, moSiteLabs, uniqueIndividualSiteCountFx, uniqueIndividualSiteCount2Fx } from '../functions/moPilot';

// Data Imports
let initialData;
let followUpData;

try {
    
    initialData = require('../data/moPilot').initialData;
    followUpData = require('../data/moPilot').followUpData;
} catch (error) {
    initialData = 'No data found';
    followUpData = 'No data found';
}

const MoPilot = () => {

    // ----- Page Variables
    
    const title = 'MO Pilot Project';

    // Healthcare Professional
    
    const [data, setData] = useState((initialData !== 'No data found' && followUpData !== 'No data found') ? (moPilotDataCleanUp(initialData, followUpData)) : 'No Initial or Follow up data found');
    const [data2, setData2] = useState((data !== 'No Initial or Follow up data found') ? (finalDataAnalysisFx(data)) : 'No Initial or Follow up data found');
    const [data3, setData3] = useState((initialData !== 'No data found' && followUpData !== 'No data found') ? (surveyCounts(initialData, followUpData)) : 'No Initial or Follow up data found');
    const [data4, setData4] = useState((initialData !== 'No data found' && followUpData !== 'No data found') ? (missingFollowUp(initialData, followUpData)) : 'No Initial or Follow up data found');
    const [data5, setData5] = useState((initialData !== 'No data found') ? (moSiteDemographicsFx(initialData)) : 'No Initial or Follow up data found');
    const [data6, setData6] = useState((followUpData !== 'No data found') ? (moSiteLabs(followUpData)) : 'No Follow up data found');
    const [data7, setData7] = useState((followUpData !== 'No data found') ? (uniqueIndividualSiteCountFx(initialData)) : 'No Follow up data found');
    const [data8, setData8] = useState((followUpData !== 'No data found') ? (uniqueIndividualSiteCount2Fx(initialData)) : 'No Follow up data found');

    const analysisButtons = [
        { id: 1, "name": "Output", "data": data },
        { id: 2, "name": "Totals", "data": data2 },
        { id: 3, "name": "Site complete", "data": data3 },
        { id: 4, "name": "Missing Follow Up", "data": data4 },
        { id: 5, "name": "Demographics by site", "data": data5 },
        { id: 6, "name": "Labs by site", "data": data6 },
        { id: 7, "name": "Individual bique site counts", "data": data7 },
        { id: 7, "name": "Individual bique individual site counts", "data": data8 },
    ];

    return(
        <section class='page' id='registry'>
            <Page pageTitle={title} buttons={analysisButtons} />
        </section>
    )
};

export default MoPilot;