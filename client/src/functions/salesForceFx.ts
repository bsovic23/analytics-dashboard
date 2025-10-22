// SalesForce Cleanup Functions

import { SalesForceMembership } from '../typeScript/salesForce';

// ===========================================================
// Duplicate Identification
// ===========================================================

// ---------------------------------
// All Time Memberships
// ---------------------------------

export const sfDups = (data: SalesForceMembership[]) => {

    let identifierMap: { [key: string]: SalesForceMembership[]} = {};

    for (const obj of data) {
        const { 
            'Contact ID': id,
            'First Name': firstName,
            'Last Name': lastName,
            'Email': email,
        } = obj;

        const identifier = `${firstName}-${lastName}-${email}`;

        if (!identifierMap[identifier]) {
            identifierMap[identifier] = [];
        }

        identifierMap[identifier].push(obj);
    }

    // Return only the duplicates


}
