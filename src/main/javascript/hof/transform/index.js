'use strict';

const utils = require('./utils');

/* eslint-disable max-len, no-warning-comments */

function transformPassportData(initialData) {
  return {
    passport: utils.withoutEmpty({
      name: initialData['check-name'],
      checkName: initialData['check-name'],
      surname: initialData['check-surname'],
      familyName: initialData['check-family-name'],
      givenNames: initialData['check-given-names'],
      checkSurname: initialData['check-surname'],
      checkFamilyName: initialData['check-family-name'],
      checkGivenNames: initialData['check-given-names'],
      passportNumber: initialData['passport-number'],
      expiryDate: initialData['passport-expiry-date'],
      issueDate: initialData['passport-issue-date'],
      placeOfIssue: initialData['passport-issue-place'],
      gender: utils.getGender(initialData.gender),
      dateOfBirth: initialData['date-of-birth'],
      placeOfBirth: initialData['place-of-birth'],
      anyOtherNames: utils.existsIfEqual(initialData['other-names'], 'Yes', initialData['enter-other-names']),
      nationality: initialData.nationality,
      countryOfBirth: utils.getOptionCode(initialData['country-of-birth']),
      holdOtherNationalities: initialData['have-other-nationalities'],
      otherNationalities: utils.existsIfEqual(initialData['have-other-nationalities'], 'Yes', initialData['other-nationalities']),
      heldPreviousNationalities: initialData['had-previous-nationalities'],
      previousNationalities: utils.existsIfEqual(initialData['had-previous-nationalities'], 'Yes', initialData['previous-nationalities'])
    })
  };
}

function transformContactDetailsData(initialData) {
  return {
    contactDetails: utils.withoutEmpty({
      emailAddress: initialData.email,
      secondEmail: initialData['other-email'],
      homeAddress: [
        initialData['home-address-1'] || '',
        initialData['home-address-2'] || '',
        initialData['home-address-3'] || '',
        initialData['home-address-4'] || '',
        initialData['home-country'] || '',
        initialData['home-postcode'] || ''
      ],
      mobilePhoneNumber: initialData.mobile,
      phoneNumber: initialData['home-phone'],
      countryAppliedFrom: utils.getOptionValue(initialData['country-applied-from']),
      countryAppliedFromCode: utils.getOptionCode(initialData['country-applied-from']),
      areYouEmployed: initialData.employed,
      companyName: initialData['employer-company'],
      occupation: initialData['job-title']
    })
  };
}

function getManualEntryPlaneJourneyDetails(initialData) {
  return {
    arrivalTravel: initialData['plane-flight-number'],
    arrivalDate: initialData['plane-date-of-arrival'],
    arrivalTime: initialData['plane-time-of-arrival'],
    departureForUKDate: utils.getUtcDate(initialData['plane-date-of-departure'] + ' ' + initialData['plane-time-of-departure']),
    portOfArrival: utils.getOptionValue(initialData['plane-port-of-arrival']),
    portOfArrivalCode: utils.getOptionCode(initialData['plane-port-of-arrival']),
    inwardDepartureCountry: utils.getOptionCode(initialData['plane-country-of-departure']),
    inwardDeparturePort: utils.getOptionValue(initialData['plane-port-of-departure']),
    inwardDeparturePortCode: utils.getOptionCode(initialData['plane-port-of-departure']),
    flightDetailsCheck: initialData['is-this-your-flight']
  };
}

function getPlaneJourneyDetails(initialData) {
  if (initialData['is-this-your-flight'] === 'Yes') {
    return {
      arrivalTravel: initialData['plane-flight-number'],
      arrivalDate: initialData.flightDetails && initialData.flightDetails.arrivalDateRaw,
      arrivalTime: initialData.flightDetails && initialData.flightDetails.arrivalTime,
      departureForUKDate: utils.getUtcDate(initialData.flightDetails.departureDateRaw + ' ' + initialData.flightDetails.departureTime),
      portOfArrival: initialData.flightDetails && initialData.flightDetails.arrivalAirport,
      portOfArrivalCode: initialData.flightDetails && initialData.flightDetails.portOfArrivalPlaneCode,
      inwardDepartureCountry: initialData.flightDetails && initialData.flightDetails.inwardDepartureCountryPlaneCode,
      inwardDeparturePort: initialData.flightDetails && initialData.flightDetails.departureAirport,
      inwardDeparturePortCode: initialData.flightDetails && initialData.flightDetails.inwardDeparturePortPlaneCode,
      flightDetailsCheck: initialData['is-this-your-flight']
    };
  }
  return getManualEntryPlaneJourneyDetails(initialData);
}

function getTrainJourneyDetails(initialData) {
  return {
    arrivalTravel: initialData['train-number'],
    arrivalDate: initialData['train-arrival-date'],
    arrivalTime: initialData['train-arrival-time'],
    departureForUKDate: utils.getUtcDate(initialData['train-departure-date'] + ' ' + initialData['train-departure-time']),
    portOfArrival: utils.getOptionValue(initialData['train-arrival-station']),
    portOfArrivalCode:  utils.getOptionCode(initialData['train-arrival-station']),
    inwardDepartureCountry:  utils.getOptionCode(initialData['train-departure-country']),
    inwardDeparturePort: utils.getOptionValue(initialData['train-departure-station']),
    inwardDeparturePortCode: utils.getOptionCode(initialData['train-departure-station'])
  };
}

function getBoatJourneyDetails(initialData) {
  return {
    arrivalTravel: initialData['boat-name'],
    arrivalDate: initialData['boat-date-of-arrival'],
    arrivalTime: initialData['boat-time-of-arrival'],
    departureForUKDate: utils.getUtcDate(initialData['boat-date-of-departure'] + ' ' + initialData['boat-time-of-departure']),
    portOfArrival: utils.getOptionValue(initialData['boat-port-of-arrival']),
    portOfArrivalCode: utils.getOptionCode(initialData['boat-port-of-arrival']),
    inwardDepartureCountry: utils.getOptionCode(initialData['boat-country-of-departure']),
    inwardDeparturePort: utils.getOptionValue(initialData['boat-port-of-departure']),
    inwardDeparturePortCode: utils.getOptionCode(initialData['boat-port-of-departure'])
  };
}

function getLandJourneyDetails(initialData) {
  return {
    arrivalDate: initialData['land-date-of-arrival'],
    arrivalTime: initialData['land-time-of-arrival'],
    portOfArrival: initialData['land-port-of-arrival'],
    travelMethodLand: initialData['land-method-of-travel']
  };
}

/* eslint-disable complexity */
function transformJourneyData(initialData) {
  return {
    journey: utils.withoutEmpty(Object.assign(
      {
        travelBy: initialData['mode-of-transport'],
        ukDuration: utils.existsIfEqual(initialData['know-departure-details'], 'No', initialData['uk-duration']),
        ukAddress: [
          initialData['uk-address-1'] || '',
          initialData['uk-address-2'] || '',
          initialData['uk-address-3'] || '',
          initialData['uk-address-4'] || '',
          initialData['uk-postcode'] || ''
        ],
        ukVisitPhoneNumber: initialData['uk-phone'],
        visitMoreThanOnce: initialData['uk-visit-more-than-once'],
        knowDepartureDetails: initialData['know-departure-details'],
        departureDate: initialData['uk-date-of-departure'],
        portOfDeparture: utils.existsIfEqual(initialData['know-departure-details'], 'Yes', utils.getOptionValue(initialData['uk-port-of-departure'])),
        portOfDepartureCode: utils.existsIfEqual(initialData['know-departure-details'], 'Yes', utils.getOptionCode(initialData['uk-port-of-departure'])),
        departureTravel: utils.existsIfEqual(initialData['know-departure-details'], 'Yes', initialData['uk-departure-travel-number']),
        reasonForTravel: initialData['reason-for-visit'] === 'Other' ? initialData['other-reason-for-visit'] : initialData['reason-for-visit'],
        travelWithOthers: initialData['travelling-with-others'],
        otherTravellers: utils.existsIfEqual(initialData['travelling-with-others'], 'Yes', initialData['other-travellers']),
        travelMethodLand: initialData['land-method-of-travel'] === 'Other' ? initialData['land-other-method-of-travel'] : initialData['land-method-of-travel']
      },
      initialData['mode-of-transport'] === 'Plane' ? getPlaneJourneyDetails(initialData) : {},
      initialData['mode-of-transport'] === 'Train' ? getTrainJourneyDetails(initialData) : {},
      initialData['mode-of-transport'] === 'Boat' ? getBoatJourneyDetails(initialData) : {},
      initialData['mode-of-transport'] === 'Land' ? getLandJourneyDetails(initialData) : {},
      initialData['mode-of-transport'] === 'Private Plane' ? getManualEntryPlaneJourneyDetails(initialData) : {}
    ))
  };
}
/* eslint-enable complexity */

function transformPassportImageData(initialData) {
  return {
    passportFileId: initialData.imageUploadObjectId
  };
}

function transformPaymentData(initialData) {
  return {
    payment: {
      orderCode: initialData.orderCode,
      feeInPence: parseInt(initialData.fee, 10),
      paymentDate: utils.formatDate(initialData.paymentDate),
      paid: initialData.paid
    }
  };
}

function transformAgentData(initialData) {
  return {
    miscellaneous: utils.withoutEmpty({
      onBehalfOfMinor: initialData['applying-for-other'] === 'No' ? 'No' : initialData['applying-for-minor'],
      asAnAgent: initialData['applying-for-other'],
      completersContactDetails: initialData['applicant-contact-details'],
      completersEmailAddress: initialData['applicant-email-address']
    })
  };
}

function transformReferenceData(initialData) {
  return utils.withoutEmpty({
    objectId: initialData.objectId,
    applicationReference: initialData.applicationReference
  });
}

function transformDataSync(initialData) {
  return Object.assign(
    this.transformPassportData(initialData),
    this.transformPassportImageData(initialData),
    this.transformContactDetailsData(initialData),
    this.transformJourneyData(initialData),
    this.transformReferenceData(initialData),
    this.transformAgentData(initialData),
    this.transformPaymentData(initialData)
  );
}

function transformData(initialData) {
  return Promise.resolve(Object.assign(
    this.transformPassportData(initialData),
    this.transformPassportImageData(initialData),
    this.transformContactDetailsData(initialData),
    this.transformJourneyData(initialData),
    this.transformReferenceData(initialData),
    this.transformAgentData(initialData),
    this.transformPaymentData(initialData)
  ));
}

module.exports = {
  transformData: transformData,
  transformDataSync: transformDataSync,
  transformPassportData: transformPassportData,
  transformPassportImageData: transformPassportImageData,
  transformJourneyData: transformJourneyData,
  transformAgentData: transformAgentData,
  transformPaymentData: transformPaymentData,
  transformReferenceData: transformReferenceData,
  transformContactDetailsData: transformContactDetailsData
};
