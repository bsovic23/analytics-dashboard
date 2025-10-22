import React, { useState } from 'react';
import * as XLSX from 'xlsx';

// Function Imports
import { 
    fySurveyCountsFx, 
    demographicsFx,
    pamScoringFx, 
    activationLevelCountFx,
    activationLevelFyFx, 
    increasedScoreAllFx,

    // new
    intialConnectionFx,
    surveyMinimumFilledOut,
    individualSurveyCountFx,
} from '../functions/standardAnalysisFx/pamAnalysis';

import { totalModuleCountFx } from '../functions/standardAnalysisFx/percAnalysis';

import { goalsCountFx, goalCombinationCountFx } from '../functions/standardAnalysisFx/generalAnalysisFx';

import { enrollmentCountFx, completeDemographicsFx } from '../functions/standardAnalysisFx/echoAnalysisFx';

// Component Imports
import GenerateExcelFileGeneral from '../components/GenerateExcelFileGeneral';

export const StandardAnalysis = () => {
    const [importData, setImportData] = useState([]);
    const [fileName, setFileName] = useState('');
    const [result, setResult] = useState(null);
    const [activeGroup, setActiveGroup] = useState('');

    // Group analysis functions by section
    const groupedAnalysisFunctions = {
        GeneralFunctions: {
            GoalsCount: goalsCountFx,
            GoalsComboCount: goalCombinationCountFx,
        },
        PAM: {
            FySurveyCounts: fySurveyCountsFx,
            DemographicsCounts: demographicsFx,
            PamScores: pamScoringFx,
            ActivationLevelsFyTotals: (data) => {
                const pamScored = pamScoringFx(data); 
                return activationLevelFyFx(pamScored);
            },
            ActivationLevelsTotals: (data) => {
                const pamScored = pamScoringFx(data); 
                return activationLevelCountFx(pamScored);
            },
            IncreasedScoreCount: increasedScoreAllFx,
            InititialConnection: intialConnectionFx,
            MinimumSurveyCount: surveyMinimumFilledOut,
            TotalSurveyCount: individualSurveyCountFx,
        },
        PERC: {
            TotalModuleCounts: totalModuleCountFx,
        },
        ECHO: {
            ModuleCounts: enrollmentCountFx,
            DemographicsCounts: completeDemographicsFx,
        }
        // Add more groups here as needed
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setActiveGroup('');
        setResult(null);

        const reader = new FileReader();

        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
            setImportData(jsonData);
        };

        reader.readAsArrayBuffer(file);
    };

    const handleAnalyze = (fn) => {
        if (typeof fn === 'function') {
            const output = fn(importData);
            setResult(output);
        }
    };

    return (
        <div>
            <p>Import an Excel/CSV File</p>

            <input
                type='file'
                accept='.xlsx, .xls, .csv'
                onChange={handleFileUpload}
                className='mb-4'
            />

            {fileName && <p>Uploaded: {fileName}</p>}

            {/* Step 1: Show categories if there's data */}
            {importData.length > 0 && !activeGroup && (
                <div className='space-x-2 mb-4'>
                    {Object.keys(groupedAnalysisFunctions).map((group) => (
                        <button
                            key={group}
                            onClick={() => setActiveGroup(group)}
                            className='bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700'
                        >
                            {group} Analysis
                        </button>
                    ))}
                </div>
            )}

            {/* Step 2: Show functions once a group is selected */}
            {importData.length > 0 && activeGroup && (
                <div className='space-y-4'>
                    <div className='space-x-2 mb-4'>
                        {Object.entries(groupedAnalysisFunctions[activeGroup]).map(([label, fn]) => (
                            <button
                                key={label}
                                onClick={() => handleAnalyze(fn)}
                                className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
                            >
                                {label}
                            </button>
                        ))}
                        <button
                            onClick={() => setActiveGroup('')}
                            className='bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500'
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}

            {/* Output section */}
            {result && (
                <div className='mt-4 bg-gray-100 p-4 rounded'>
                  <h2 className='font-semibold mb-2'>Analysis Result</h2>
                  <pre>{JSON.stringify(result, null, 2)}</pre>
              
                  {Array.isArray(result) && result.length > 0 && (
                    <button
                      onClick={() => GenerateExcelFileGeneral({ generalData: result })}
                      className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Generate Excel File
                    </button>
                  )}
                </div>
              )}
        </div>
    );
};

export default StandardAnalysis;
