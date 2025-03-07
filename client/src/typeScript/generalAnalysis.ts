// =======================================================================
// General Analysis
// =======================================================================

// ------------------------
// Medication Cleanup
// ------------------------

// import
export interface Medications {
    med: string,
    mrn: number,
    startDate: string,
    stopDate: string
};

export interface MedicationsClean {
    [uniqueMrnMed: string]: {
        mrn: number,
        medType: string,
        medStartDate: string,
        medStopDate: string,
    }
};


export interface EgfrDups {
    mrn: number;
    post_egfrDate: string;
    post_egfrValue?: number;
  }

  export interface UacrDups {
    mrn: number;
    post_uacrDate: string;
    post_uacrValue?: number;
  }

  export interface EgfrFollowUpDups {
    mrn: number;
    followUpEGFRDate: string;
    followUpEGFRValue?: number;
  }

  export interface UacrFollowUpDups {
    mrn: number;
    followUpUACRDate: string;
    followUpUACRValue?: number;
  }



  export interface AllData {
    firstName: string,
    lastName: string,
    email: string,
  }

  export interface ModuleData {
    courseComplete: boolean,
    firstName: string,
    lastName: string,
    email: string,
  }



  export interface DialysisData {
    state: string,
    region: string,
    county: string,
    zip: number,
    pdUsePct: number,
    POPESTIMATE: number,
    POPEST_MALE: number,
    POPEST_FEM: number,
    MEDIAN_AGE_TOT: number,
    MEDIAN_AGE_MALE: number,
    MEDIAN_AGE_FEM: number,
    pdRanking: number,
    populationRanking: number,
    ageRanking: number,
  }