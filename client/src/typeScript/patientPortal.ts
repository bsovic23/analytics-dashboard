// ==============================================================
// Patient Portal
// ==============================================================

// ---------------------------------------------------------------
// Data Imports
// ---------------------------------------------------------------

// Registration

export interface Registration {
    id: string,
    gender: string,
    dob: string,
    registrationDate: string,
    language: string,
    country: string,
    zipcode: string,
    batchLastRun: string,
    [key: string]: any,
}

// Informed Consent

export interface InformedConsent {
    id: string, 
    icf_dateSigned: string,
    icf_option1: string,
    icf_option2: string,
    icf_option3: string,
    icf_batchLastRun: string,
}

// Core Survey

export interface CoreSurvey {
    id: string;
    [key: string]: string | number | boolean | null;
}

// EQ5D5L

export interface EQ5D5L {
    id: string,
    eq_mobility: string,
    eq_selfCare: string,
    eq_activitiy: string,
    eq_pain: string,
    eq_anxiety: string,
    eq_healthLevel: string,
    eq_createdDate: string,
    eq_submittedDate: string,
    eq_template: string,
    eq_batchLastRun: string,
}

// KDQOL

export interface KDQOL {
    id: string,
    kdqol_health: string,
    kdqol_moderateActivities: string,
    kdqol_stairs: string,
    kdqol_less: string,
    kdqol_limited: string,
    kdqol_less_2: string,
    kdqol_work: string,
    kdqol_past4weeks: string,
    kdqol_calm: string,
    kdqol_energy: string,
    kdqol_blue: string,
    kdqol_relatives: string,
    kdqol_kidneyDiseaseInterfere: string,
    kdqol_kidneyDiseaseDealing: string,
    kdqol_frustrated: string,
    kdqol_burden: string,
    kdqol_soreness: string,
    kdqol_chest: string,
    kdqol_cramps: string,
    kdqol_skinItchy: string,
    kdqol_skinDry: string,
    kdqol_breath: string,
    kdqol_dizziness: string,
    kdqol_appetitie: string,
    kdqol_drained: string,
    kdqol_numbness: string,
    kdqol_nausea: string,
    kdqol_hemodialysis: string,
    kdqol_peritonealDisease: string,
    kdqol_fluid: string,
    kdqol_dietary: string,
    kdqol_houseWork: string,
    kdqol_travel: string,
    kdqol_doctors: string,
    kdqol_stress: string,
    kdqol_sexLife: string,
    kdqol_personalAppearance: string,
    kdqol_createdDate: string,
    kdqol_submittedDate: string,
    kdqol_batchLastRun: string,
}