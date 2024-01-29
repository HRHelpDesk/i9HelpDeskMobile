export function formatDate(inputDate) {
    var date = new Date(inputDate);
    if (!isNaN(date.getTime())) {
        // Months use 0 index.
        return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
    }
}

export function formatSSN(ssn) {
    // Remove any non-numeric characters from the input
    const numericSSN = ssn.replace(/\D/g, '');
  
    // Check if the numericSSN has a valid length
    if (numericSSN.length !== 9) {
      // Handle invalid SSN length
      console.error('Invalid SSN length');
      return numericSSN;
    }
  
    // Format the SSN with dashes
    const formattedSSN = `${numericSSN.substr(0, 3)}-${numericSSN.substr(3, 2)}-${numericSSN.substr(5)}`;
  
    return formattedSSN;
  }

export const statesArray =  [' ', 'AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY', 'CAN', 'MEX']


export const listADocuments =
 [
  {
    documentName:'---',
    sectionTwoName:'',
    code:''
  },
  {
   documentName: 'U.S. Passport or U.S. Passport Card',
   sectionTwoName:'U.S. Passport or U.S. Passport Card',
   code:'US_PASSPORT',
  },
  {
    documentName:'Permanent Resident Card or Alien Registration Receipt Card (Form I-551)',
    sectionTwoName:'Form I-551',
    code:'FORM_I551',
  },
  {
    documentName:'Foreign passport that contains a temporary I-551 stamp or temporary I-551 printed notation on a machine-readable immigrant visa',
    sectionTwoName:'Foreign passport that contains a temporary I-551 stamp or temporary I-551 printed notation',
    code:'FOREIGN_PASSPORT_WITH_I551_STAMP',
  },
  {
    documentName:'Employment Authorization Document that contains a photograph (Form I-766)',
    sectionTwoName:'Form I-766',
    code:'FORM_I766',
  },
  {
    documentName:'Foreign passport; and Form I-94',
    sectionTwoName:'Foreign passport; and Form I-94',
    code:'FOREIGN_PASSPORT_WITH_FORM_I94',
  },
  {
    documentName:'Passport from the Federated States of Micronesia (FSM) or the Republic of the Marshall Islands (RMI) with Form I-94 or Form I-94A',
    sectionTwoName:'Form I-94 or Form I-94A',
    code:'FORM_I94',
  },
  {
    documentName:'Form I-94 Reciept',
    sectionTwoName:'Form I-94 Reciept',
    code:'FORM_I94_RECEIPT',
  }
]

export const listBDocuments = 
[
  {
    documentName:'---',
    sectionTwoName:'',
    code:''
  },
  {
    documentName:"Driver's License",
    sectionTwoName:"Driver's License",
    code:'DRIVERS_LICENSE',
  },
  {
    documentName:'ID card issued by a State or outlying possession of the United States',
    sectionTwoName:'State Id Card',
    code:'STATE_ID_CARD',
  },
  {
    documentName:'ID card issued by federal, state or local government agencies or entities',
    sectionTwoName:'Government ID Card',
    code:'GOVERNMENT_ID_CARD',
  },
  {
    documentName:'School ID card with a photograph',
    sectionTwoName:'School ID Card',
    code:'SCHOOL_ID_CARD',
  },
  {
    documentName:"Voter's Registration Card",
    sectionTwoName:"Voter's Registration Card",
    code:'VOTER_REGISTRATION_CARD',
  },
  {
    documentName:'U.S. Military card or Draft Record',
    sectionTwoName:'U.S. Military card or Draft Record',
    code:'US_MILITARY_CARD',
  },
  {
    documentName:"Military dependent's ID card",
    sectionTwoName:"Military dependent's ID card",
    code:'MILITARY_DEPENDENT_ID_CARD',
  },
  {
    documentName:'U.S. Coast Guard Merchant Mariner Card',
    sectionTwoName:'U.S. Coast Guard Merchant Mariner Card',
    code:'US_COAST_GUARD_CARD',
  },
  {
    documentName:'Native American Tribal Document',
    sectionTwoName:'Native American Tribal Document',
    code:'NATIVE_AMERICAN_TRIBAL_DOCUMENT',
  },
  {
    documentName:"Driver's license issued by a Canadian government authority",
    sectionTwoName:'Canadian Drivers License',
    code:'CANADIAN_DRIVERS_LICENSE',
  },
  {
    documentName:'School record or report card (Under 18)',
    sectionTwoName:'School Record',
    code:'SCHOOL_RECORD',
  },
  {
    documentName:'Clinic, doctor, or hospital record (Under 18)',
    sectionTwoName:'Hospital Record',
    code:'HOSPITAL_RECORD',
  },
  {
    documentName:'Day-care or nursery school record',
    sectionTwoName:'Day Care Record',
    code:'DAY_CARE_RECORD',
  }
]

export const listCDocuments = 
[
  {
    documentName:'---',
    sectionTwoName:'',
    code:''
  },
  {
    documentName:'A Social Security Account Number card (Read List C Instructions)',
    sectionTwoName:'Social Security Card',
    code:'SOCIAL_SECURITY_CARD',
  },
  {
    documentName:'Form DS-1350',
    sectionTwoName:'Form DS-1350',
    code:'DS_1350',
  },
  {
    documentName:'Form FS-545',
    sectionTwoName:'Form FS-545',
    code:'FS_545',
  },
  {
    documentName:'Form 240',
    sectionTwoName:'Form 240',
    code:'FS_240',
  },
  {
    documentName:'Original or certified copy of birth certificate issued by a State, county, municipal authority, or territory of the United States bearing an official seal',
    sectionTwoName:'US Birth Certificate',
    code:'US_BIRTH_CERTIFICATE',
  },
  {
    documentName:'Native American tribal document',
    sectionTwoName:'Native American Tribal Document',
    code:'NATIVE_AMERICAN_TRIBAL_DOCUMENT',
  },
  {
    documentName:'U.S. Citizen ID Card (Form I-197)',
    sectionTwoName:'U.S. Citizen ID Card (Form I-197)',
    code:'FORM_I197',
  },
  {
    documentName:'Identification Card for Use of Resident Citizen in the United States (Form I-179)',
    sectionTwoName:'Form I-179',
    code:'FORM_I179',
  },
  {
    documentName:'Employment authorization document issued by the Department of Homeland Security (Read List C Instructions)',
    sectionTwoName:'Employment Authorization Document',
    code:'EMPLOYMENT_AUTHORIZATION_DOCUMENT,',
  },
  {
    documentName:'U.S. Citizen ID Card (Form I-197)',
    sectionTwoName:'U.S. Citizen ID Card (Form I-197)',
    code:'FORM_I197',
  }
]