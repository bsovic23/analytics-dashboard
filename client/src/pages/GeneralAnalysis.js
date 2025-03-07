import React, { useState } from 'react';

// Component Imports
import Page from '../components/Page';
import GenerateExcelFileGeneral from '../components/GenerateExcelFileGeneral';

// Function Imports
import { dialysisFx } from '../functions/generalAnalysisFx';

let allDataDialysis;

try {
    allDataDialysis = require('../data/generalAnalysis').allDataDialysis;
} catch (error) {
    allDataDialysis = 'No data found';
};

export const GeneralAnalysis = () => {
    
    const [var4, setVar4] = useState((allDataDialysis !== 'No data found') ? dialysisFx(allDataDialysis) : 'No Medication Data found');

    //Page Variables
    const pageTitle = 'General Analysis Analytics';

    const analysisButtons = [
        {id: 9, "name": "counts", "data": var4},
    ];

    return(
        <section className='page' id='general-analysis'>
            <GenerateExcelFileGeneral data={var4} />
            <Page pageTitle={pageTitle} buttons={analysisButtons} />
        </section>
    )
};

export default GeneralAnalysis;