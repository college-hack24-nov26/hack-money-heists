"use strict";
/**
 * Statutory GSTIN (Goods and Services Tax Identification Number) Validation
 * Implements official Government of India Modulo 36 Checksum Algorithm
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateGstinChecksum = calculateGstinChecksum;
exports.validateGSTIN = validateGSTIN;
const STATE_CODES = {
    '01': 'Jammu & Kashmir',
    '02': 'Himachal Pradesh',
    '03': 'Punjab',
    '04': 'Chandigarh',
    '05': 'Uttarakhand',
    '06': 'Haryana',
    '07': 'Delhi',
    '08': 'Rajasthan',
    '09': 'Uttar Pradesh',
    '10': 'Bihar',
    '11': 'Sikkim',
    '12': 'Arunachal Pradesh',
    '13': 'Nagaland',
    '14': 'Manipur',
    '15': 'Mizoram',
    '16': 'Tripura',
    '17': 'Meghalaya',
    '18': 'Assam',
    '19': 'West Bengal',
    '20': 'Jharkhand',
    '21': 'Odisha',
    '22': 'Chhattisgarh',
    '23': 'Madhya Pradesh',
    '24': 'Gujarat',
    '26': 'Dadra & Nagar Haveli and Daman & Diu',
    '27': 'Maharashtra',
    '29': 'Karnataka',
    '30': 'Goa',
    '31': 'Lakshadweep',
    '32': 'Kerala',
    '33': 'Tamil Nadu',
    '34': 'Puducherry',
    '35': 'Andaman & Nicobar Islands',
    '36': 'Telangana',
    '37': 'Andhra Pradesh',
    '38': 'Ladakh',
    '97': 'Other Territory',
    '99': 'Centre Jurisdiction'
};
const CHAR_SET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
/**
 * Calculates the statutory Modulo 36 checksum digit for the first 14 characters of a GSTIN
 */
function calculateGstinChecksum(first14) {
    const chars = first14.toUpperCase();
    let factor = 1;
    let sum = 0;
    const n = 36;
    for (let i = 0; i < 14; i++) {
        const codePoint = CHAR_SET.indexOf(chars[i]);
        if (codePoint === -1)
            return '';
        let digit = codePoint * factor;
        factor = factor === 2 ? 1 : 2;
        digit = Math.floor(digit / n) + (digit % n);
        sum += digit;
    }
    const remainder = sum % n;
    let checkCode = (n - remainder) % n;
    return CHAR_SET[checkCode];
}
/**
 * Full statutory validation of an Indian GSTIN
 */
function validateGSTIN(rawGstin) {
    if (!rawGstin || typeof rawGstin !== 'string') {
        return {
            isValid: false,
            gstin: '',
            error: 'GSTIN must be a non-empty string.',
            isOfficialVerification: false
        };
    }
    const gstin = rawGstin.trim().toUpperCase();
    // 1. Length Check
    if (gstin.length !== 15) {
        return {
            isValid: false,
            gstin,
            error: `Invalid length (${gstin.length} chars). A statutory Indian GSTIN must be exactly 15 characters.`,
            isOfficialVerification: false
        };
    }
    // 2. Syntax Structure: 2 digits (state), 5 letters, 4 digits, 1 letter (PAN), 1 char (entity), 'Z', 1 check char
    const gstinRegex = /^([0-9]{2})([A-Z]{5}[0-9]{4}[A-Z])([1-9A-Z])(Z)([0-9A-Z])$/;
    const match = gstin.match(gstinRegex);
    if (!match) {
        return {
            isValid: false,
            gstin,
            error: 'GSTIN syntax structure failed. Pattern must match: [State 2D][PAN 10C][Entity 1C][Z][CheckDigit 1C].',
            isOfficialVerification: false
        };
    }
    const stateCode = match[1];
    const pan = match[2];
    const entityNumber = match[3];
    const actualCheckDigit = match[5];
    const stateName = STATE_CODES[stateCode];
    // 3. State Code Validity
    if (!stateName) {
        return {
            isValid: false,
            gstin,
            stateCode,
            pan,
            error: `Invalid State Code '${stateCode}'. Must match registered Indian GST state jurisdictions (01-38).`,
            isOfficialVerification: false
        };
    }
    // 4. Modulo 36 Checksum Verification
    const expectedCheckDigit = calculateGstinChecksum(gstin.slice(0, 14));
    const checksumMatched = (expectedCheckDigit === actualCheckDigit);
    if (!checksumMatched) {
        return {
            isValid: false,
            gstin,
            stateCode,
            stateName,
            pan,
            entityNumber,
            actualCheckDigit,
            expectedCheckDigit,
            checksumMatched: false,
            error: `Checksum mismatch on character 15. Expected '${expectedCheckDigit}', found '${actualCheckDigit}'. Possible data entry typo or invalid GSTIN.`,
            isOfficialVerification: false
        };
    }
    return {
        isValid: true,
        gstin,
        stateCode,
        stateName,
        pan,
        entityNumber,
        actualCheckDigit,
        expectedCheckDigit,
        checksumMatched: true,
        isOfficialVerification: false // Formal format & checksum verified; live GST portal sync requires API credentials
    };
}
