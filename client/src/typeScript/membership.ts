// -------------------------------------------
// Wild Apricot Data Imports
// -------------------------------------------

// Wild Apricot Data

export interface WildApricotData {
    'User ID': number,
    'First name': string,
    'Last name': string,
    'Email': string,
    'Phone': string,
    'State/Province': string,
    'Country': string,
    'Date of Birth': string,
    'How did you learn about NKF Professional Membership?': string,
    "Add-On E-Subscription to NKF Journals": number,
    "Add-On E-Subscription to NKF Journals 2 Year": number,
    "Add-On Print Subscription to Advances in Kidney Disease and Health (AKDH) - RN/PHYS": number,
    "Add-On Print Subscription to Advances in Kidney Disease and Health (AKDH) - RN/PHYS 2 Year": number,
    "Add-On Print Subscription to Advances in Kidney Disease and Health (AKDH)": number,
    "Add-On Print Subscription to Advances in Kidney Disease and Health (AKDH) 2 Year": number,
    "Add-On Print Subscription to American Journal of Kidney Diseases (AJKD)": number,
    "Add-On Print Subscription to American Journal of Kidney Diseases (AJKD) 2 Year": number,
    "Add-On Print Subscription to Journal of Renal Nutrition": number,
    "Add-On Print Subscription to Journal of Renal Nutrition 2 Year": number,
    "Add-On International Society of Nutrition and Metabolism (ISRNM) Membership - Physician": number,
    "Add-On International Society of Nutrition and Metabolism (ISRNM) Membership - Physician 2 Year": number,
    "Add-On International Society of Nutrition and Metabolism (ISRNM) Membership - Dietitian": number,
    "Add-On International Society of Nutrition and Metabolism (ISRNM) Membership - Dietitian 2 Year": number,
    'Last login': string,
    'Membership enabled': string,
    'Membership level': string,
    'Membership status': string,
    'Member since': string,
    'Renewal due': string,
    'Renewal date since last changed': string,
    'Level last changed': string,  
}

export interface SurveyData {
    "firstName": string,
    "lastName": string,
    'email': string,
    'membershipType': string,
    'membershipLength': string,
    'recommend': number,
    'learnAbout': string,
    'loginAmount': string,
    'features': string,
    'benefits': string,
    'educationFormat': string,
    'events': string,
    'socialMedia': string,
    'newsletter': string,
    'communications': number,
    'notCovered': string,
    'satisfiedService': string,
    'patientsSee': string,
    'patientResources': string,
    'memberAssociations': string,
}

export interface WildApricotPrevContacts {
    id: string;
}

// -------------------------------------------
// Wild Apricot Function Outputs
// -------------------------------------------

// Wild Apricot Duplicates Output

export interface WildApricotDups {
    [uniqueId: string]: {
        dupCount: number,
        ids: number[],
    }
}

// Wild Apricot 30 day Membership Lapse Output

export interface WildApricotMembershipLapsed {
    userId: number,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    membershipEnabled: string,
    membershipLevel: string,
    membershipStatus: string,
    memberSince: string,
    renewalDue: string,
    renewalDateLastChange: string,
}



