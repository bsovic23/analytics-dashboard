import React, { useState } from 'react';

// Imports - Components/Pages
import Page from '../components/Page';

// Function Imports
// import { dupsFunction } from '../functions/salesForceFx';

// Data Imports
let wildApricot;
let salesForce;

try {
    wildApricot.require('../data/membership').wildApricotData;
    salesForce.require('../data/salesforce').salesForce;
} catch (error) {
    wildApricot = 'No data found';
    salesForce = 'No data found';
};

const Salesforce = () => {

    // ----- Page Variables
    const pageTitle = 'Salesforce Cleanup';

    /*
        fx1: actual duplicates (dup emails)
        fx2: duplicates need to be merged (same FN-LN-STATE but multiple records in All Time Memberships)
    */

    // const [test1, setTest1] = useState((wildApricot !== 'No data found' && salesForce !== 'No data found') ? dupsFunction(wildApricot, salesForce) : 'No data');

    const analysisButtons = [
        // { id: 1, "name": "Wild Apricot + Salesforce Analysis", "data": test1 }
    ];

    return(
        <section class='page' id='salesforce'>
            <Page pageTitle={pageTitle} buttons={analysisButtons} />
        </section>
    )
};

export default Salesforce;