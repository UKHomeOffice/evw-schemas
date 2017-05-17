'use strict';
var moment = require('moment');
var parsing = require('./form-parsing');

function transformData(result) {
    function arrivalTravel(result) {
        if (result.departureMode && result.departureMode.indexOf('Plane') > -1) {
            return result.flightNumber;
        } else if (result.departureMode === 'Train') {
            return result.trainNumber;
        } else if (result.departureMode === 'Boat') {
            return result.boatName;
        } else {
            return '';
        }
    }

    return {
        objectId: result.objectId,
        passport: parsing.withoutEmpty({
            name: result.checkName,
            checkName: result.checkName,
            surname: result.checkSurname,
            familyName: result.checkFamilyName,
            givenNames: result.checkGivenNames,
            checkSurname: result.checkSurname,
            checkFamilyName: result.checkFamilyName,
            checkGivenNames: result.checkGivenNames,
            passportNumber: result.passportNumber,
            expiryDate: getDate(result, 'doe'),
            issueDate: getDate(result, 'doi'),
            placeOfIssue: result.placeOfIssue,
            gender: getGender(result.gender),
            dateOfBirth: getDate(result, 'dob'),
            placeOfBirth: result.placeOfBirth,
            anyOtherNames: result.anyOtherNames,
            nationality: result.nationality,
            countryOfBirth: result.countryOfBirthCode,
            holdOtherNationalities: result.holdOtherNationalities,
            otherNationalities: existsIfEqual(result.holdOtherNationalities, 'Yes', result.otherNationalities),
            heldPreviousNationalities: result.heldPreviousNationalities,
            previousNationalities: existsIfEqual(result.heldPreviousNationalities, 'Yes', result.previousNationalities)
        }),
        payment: parsing.emptyWithFalse({
            orderCode: result.orderCode,
            feeInPence: parseInt(result.fee, 10),
            paymentDate: moment(result.paymentDate).format('YYYY-MM-DD HH:mm:ss'),
            paid: result.paid
        }),
        contactDetails: parsing.withoutEmpty({
            emailAddress: result.emailAddress,
            secondEmail: result.secondEmail,
            homeAddress: [
                result.homeAddress1 || '',
                result.homeAddress2 || '',
                result.homeAddress3 || '',
                result.homeAddress4 || '',
                result.homeAddressCountryCode || '',
                result.homeAddressPostCode || ''
            ],
            mobilePhoneNumber: result.mobilePhoneNumber,
            phoneNumber: result.phoneNumber,
            countryAppliedFrom: result.countryAppliedFrom,
            countryAppliedFromCode: result.countryAppliedFromCode,
            areYouEmployed: result.areYouEmployed,
            companyName: result.companyName,
            occupation: result.occupation
        }),
        journey: parsing.withoutEmpty({
            travelBy: result.departureMode,
            arrivalTravel: arrivalTravel(result),
            arrivalDate: getDate(result, 'arrivalDate' + getFieldDepartureMode(result)),
            arrivalTime: formatTime(result['arrivalTime' + getFieldDepartureMode(result) + 'Hour'], result['arrivalTime' + getFieldDepartureMode(result) + 'Minutes']),
            departureForUKDate: getDepartureForUKDate(result),
            portOfArrival: result.departureMode === 'Land' ? result.arrivalPointLand : result['portOfArrival' + getFieldDepartureMode(result)],
            portOfArrivalCode: result['portOfArrival' + getFieldDepartureMode(result) + 'Code'],
            ukDuration: existsIfEqual(result.knowDepartureDetails, 'No', result.ukDuration),
            ukAddress: [result.ukAddress1 || '',
                result.ukAddress2 || '',
                result.ukAddress3 || '',
                result.ukAddress4 || '',
                result.ukAddressPostCode || ''],
            ukVisitPhoneNumber: result.ukVisitPhoneNumber,
            visitMoreThanOnce: result.visitMoreThanOnce,
            knowDepartureDetails: result.knowDepartureDetails,
            inwardDepartureCountry: result['inwardDepartureCountry' + getFieldDepartureMode(result) + 'Code'],
            inwardDeparturePort: result['inwardDeparturePort' + getFieldDepartureMode(result)],
            inwardDeparturePortCode: result['inwardDeparturePort' + getFieldDepartureMode(result) + 'Code'],
            departureDate: existsIfEqual(result.knowDepartureDetails, 'Yes', getDate(result, 'departureDate')),
            portOfDeparture: existsIfEqual(result.knowDepartureDetails, 'Yes', result.portOfDeparture),
            portOfDepartureCode: existsIfEqual(result.knowDepartureDetails, 'Yes', result.portOfDepartureCode),
            departureTravel: existsIfEqual(result.knowDepartureDetails, 'Yes', result.departureFlightNumber),
            reasonForTravel: result.reasonForVisit === 'Other' ? result.otherReasonForVisit : result.reasonForVisit,
            travelWithOthers: result.travelWithOthers,
            otherTravellers: existsIfEqual(result.travelWithOthers, 'Yes', result.otherTravellers),
            travelMethodLand: result.travelMethodLand === 'Other' ? result.travelMethodOtherLand : result.travelMethodLand,
            flightDetailsCheck: isFlightDetailsCheckValid(result, result.flightDetailsCheck)
        }),
        miscellaneous: parsing.withoutEmpty({
            onBehalfOfMinor: result.onBehalfOfMinor,
            asAnAgent: result.asAnAgent,
            completersContactDetails: result.completersContactDetails,
            completersEmailAddress: result.completersEmailAddress
        }),
        passportFileId: result.passportFileId,
        applicationReference: result.applicationReference
    };
}

function existsIfEqual(value1, value2, fieldValue) {
    return (value1 === value2) ? fieldValue : null;
}

function getDate(result, field) {
    var date = moment(result[field + 'Year'] + '-' + result[field + 'Month'] + '-' + result[field + 'Day'], 'YYYY-MM-DD').format('YYYY-MM-DD');
    return (date === 'Invalid date') ? null : date; }

function formatTime(hour, minute) {
    return ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2);
}

function getDepartureForUKDate(result) {
    var departureForUKDate = 'departureForUKDate' + getFieldDepartureMode(result);
    var departureForUKTime = 'departureForUKTime' + getFieldDepartureMode(result);

    if (result[departureForUKDate + 'Year'] && result[departureForUKDate + 'Month'] && result[departureForUKDate + 'Day'] && result[departureForUKTime + 'Hour'] && result[departureForUKTime + 'Minutes']) {
        var date = moment.utc(result[departureForUKDate + 'Year'] + '-' + result[departureForUKDate + 'Month'] + '-' + result[departureForUKDate + 'Day'] + ' ' + formatTime(result[departureForUKTime + 'Hour'], result[departureForUKTime + 'Minutes']) + ':00', 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        return (date === 'Invalid date') ? null : date;
    }
    return null;
}

function getGender(gender) {
    if (gender.toUpperCase() === 'FEMALE' || gender.toUpperCase() === 'F') {
        return 'F';
    } else if (gender.toUpperCase() === 'MALE' || gender.toUpperCase() === 'M') {
        return 'M';
    }
    throw 'The gender is invalid. What is "' + gender + '" ?';
}

// Get the departure mode value used by field names, so 'Private Plane' needs to change to 'Plane'
function getFieldDepartureMode(result) {
    if (result.departureMode) {
        return result.departureMode.replace('Private ', '');
    }
}

function isFlightDetailsCheckValid(result, field) {
    if (field === 'Yes') {
        var inwardDepartureCountry = result['inwardDepartureCountry' + getFieldDepartureMode(result) + 'Code'];
        var inwardDeparturePort = result['inwardDeparturePort' + getFieldDepartureMode(result)];
        var portOfArrival = result['portOfArrival' + getFieldDepartureMode(result)];

        if (inwardDepartureCountry === 'false' || inwardDeparturePort === 'false' || portOfArrival === 'false') {
            return 'No';
        }
    }
    return field;
}

module.exports = {
    transformData: transformData,
    formatTime: formatTime,
    getFieldDepartureMode: getFieldDepartureMode,
    isFlightDetailsCheckValid: isFlightDetailsCheckValid
};
