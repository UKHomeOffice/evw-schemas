'use strict';

const samplePassportData = {
  'nationality': 'KWT',
  'passport-number': '852400508',
  'passport-issue-date': '1993-04-19',
  'passport-issue-date-day': '19',
  'passport-issue-date-month': '4',
  'passport-issue-date-year': '1993',
  'passport-expiry-date': '1998-05-27',
  'passport-expiry-date-day': '27',
  'passport-expiry-date-month': '5',
  'passport-expiry-date-year': '1998',
  'passport-issue-place': 'Dubai',
  'country-of-birth': 'UAE',
  'passport-issue-date-formatted': '19/04/1993',
  'passport-expiry-date-formatted': '27/05/1998',
  'check-passport-image': 'Yes',
  'check-name': 'Katelyn Walter',
  'gender': 'male',
  'date-of-birth': '1992-04-21',
  'date-of-birth-day': '21',
  'date-of-birth-month': '4',
  'date-of-birth-year': '1992',
  'place-of-birth': 'Abu Dhabi',
  'other-names': 'No',
  'date-of-birth-formatted': '21/04/1992',
  'have-other-nationalities': 'No',
  'had-previous-nationalities': 'No'
};

const samplePassportImageData = {
  'imageUploadFilename': '6ee9b309-ec69-4734-909c-71e8a5b82a65',
  'imageUploadObjectId': '58230ae3bc57424d6264fa88',
  'passport-image': ''
};

const sampleContactDetailsData = {
  'email': 'gepuq@gmail.com',
  'confirm-email': 'gepuq@gmail.com',
  'other-email': 'refupegeq@gmail.com',
  'confirm-other-email': 'refupegeq@gmail.com',
  'home-address-1': 'Home Office',
  'home-address-2': '2 Marsham Street',
  'home-address-3': 'Westminster',
  'home-address-4': 'London',
  'home-postcode': 'SW1P 4DF',
  'home-country': 'UK',
  'home-phone': '+217-84-6087337',
  'mobile': '+344-59-7767795',
  'country-applied-from': 'OMN_Oman',
  'employed': 'Yes',
  'employer-company': 'Sonia Trujillo',
  'job-title': 'Manager'
};

const sampleVisitInformationData = {
  'reason-for-visit': 'Other',
  'other-reason-for-visit': 'Not sure',
  'travelling-with-others': 'Yes',
  'other-travellers': 'jon bon jovi',
  'uk-duration': '',
  'uk-address-1': 'Home Office',
  'uk-address-2': '2 Marsham Street',
  'uk-address-3': 'Westminster',
  'uk-address-4': 'London',
  'uk-postcode': 'SW1P 4DF',
  'uk-phone': '+4420 7123 4567',
  'uk-visit-more-than-once': 'Yes',
  'know-departure-details': 'Yes',
  'uk-date-of-departure': '2017-06-16',
  'uk-port-of-departure': 'LGW_London - Gatwick',
  'uk-departure-travel-number': 'BA001'
};

const sampleAgentData = {
  'applying-for-other': 'Yes',
  'applying-for-minor': 'No',
  'applicant-email-address': 'xewuka@gmail.com',
  'applicant-contact-details': '+217-84-6087337'
};

const samplePaymentData = {
  orderCode: 'EVW-a4084857-1f42-4214-a364-3d6951cf1f2b',
  fee: '1500',
  paymentDate: new Date('2016-02-15 12:30:00'),
  paid: true
};

const sampleReferenceData = {
  objectId: '123abc',
  applicationReference: 'ABC123001'
};

const samplePlaneJourneyData = Object.assign(
  {
    'mode-of-transport': 'Plane',
    'plane-flight-number': 'EK009',
    'plane-date-of-departure': '2014-06-26',
    'plane-date-of-departure-day': '26',
    'plane-date-of-departure-month': '6',
    'plane-date-of-departure-year': '2014',
    'plane-date-of-departure-formatted': '26/06/2014',
    'is-this-your-flight': 'Yes',
    'flightDetails': {
      'flightNumber': 'EK009',
      'departureDate': '26/06/2014',
      'departureDatePlaneDay': '26',
      'departureDatePlaneMonth': '06',
      'departureDatePlaneYear': '2014',
      'departureDateRaw': '2014-06-26',
      'departureTime': '14:35',
      'departureTimePlaneHour': '14',
      'departureTimePlaneMinutes': '35',
      'departureTimezone': 'Asia/Dubai',
      'arrivalAirport': 'London - Gatwick',
      'portOfArrivalPlaneCode': 'LGW',
      'arrivalDate': '26/06/2014',
      'arrivalDateRaw': '2014-06-26',
      'arrivalTimezone': 'Europe/London',
      'arrivalDatePlaneDay': '26',
      'arrivalDatePlaneMonth': '06',
      'arrivalDatePlaneYear': '2014',
      'arrivalTime': '19:45',
      'arrivalTimePlaneHour': '19',
      'arrivalTimePlaneMinutes': '45',
      'inwardDepartureCountryPlane': 'United Arab Emirates',
      'inwardDepartureCountryPlaneCode': 'ARE',
      'departureAirport': 'Dubai',
      'inwardDeparturePortPlaneCode': 'DXB'
    }
  },
  sampleVisitInformationData
);

const sampleManualEntryPlaneJourneyData = Object.assign(
  {
    'mode-of-transport': 'Plane',
    'is-this-your-flight': 'No',
    'plane-flight-number': 'DT1001',
    'plane-date-of-arrival': '2017-01-12',
    'plane-date-of-arrival-day': '12',
    'plane-date-of-arrival-month': '01',
    'plane-date-of-arrival-year': '2017',
    'plane-date-of-arrival-formatted': '12/01/2017',
    'plane-time-of-arrival': '16:30',
    'plane-time-of-arrival-hour': '16',
    'plane-time-of-arrival-minute': '10',
    'plane-date-of-departure': '2017-01-12',
    'plane-date-of-departure-day': '12',
    'plane-date-of-departure-month': '01',
    'plane-date-of-departure-year': '2017',
    'plane-date-of-departure-formatted': '12/01/2017',
    'plane-time-of-departure': '09:45',
    'plane-time-of-departure-hour': '09',
    'plane-time-of-departure-minute': '45',
    'plane-port-of-arrival': 'BHX_Birmingham',
    'plane-country-of-departure': 'FRA_France',
    'plane-port-of-departure': 'CDG_Paris - Charles de Gaulle',
  },
  sampleVisitInformationData
);

const samplePrivatePlaneJourneyData = Object.assign(
  {
    'mode-of-transport': 'Private Plane',
    'plane-date-of-departure-formatted': '12/01/2017',
    'plane-date-of-arrival-formatted': '12/01/2017',
    'plane-flight-number': 'DT1001',
    'plane-date-of-departure': '2017-01-12',
    'plane-date-of-departure-day': '12',
    'plane-date-of-departure-month': '01',
    'plane-date-of-departure-year': '2017',
    'plane-time-of-departure': '09:45',
    'plane-time-of-departure-hour': '09',
    'plane-time-of-departure-minute': '45',
    'plane-country-of-departure': 'ARE_United Arab Emirates',
    'plane-port-of-departure': 'DXB_Dubai',
    'plane-port-of-arrival': 'LGW_London - Gatwick',
    'plane-date-of-arrival': '2017-01-12',
    'plane-date-of-arrival-day': '12',
    'plane-date-of-arrival-month': '01',
    'plane-date-of-arrival-year': '2017',
    'plane-time-of-arrival': '16:10',
    'plane-time-of-arrival-hour': '16',
    'plane-time-of-arrival-minute': '10'
  },
  sampleVisitInformationData
);

const sampleTrainJourneyData = Object.assign(
  {
    'mode-of-transport': 'Train',
    'train-number': 'Eurostar 9140',
    'train-departure-date': '2016-12-21',
    'train-departure-date-day': '21',
    'train-departure-date-month': '12',
    'train-departure-date-year': '2016',
    'train-departure-time': '12:00',
    'train-departure-time-hour': '12',
    'train-departure-time-minute': '00',
    'train-departure-country': 'FRA_France',
    'train-departure-station': 'JBT_Boulogne',
    'train-arrival-station': 'AFK_Ashford Intl',
    'train-arrival-date': '2016-12-21',
    'train-arrival-date-day': '21',
    'train-arrival-date-month': '12',
    'train-arrival-date-year': '2016',
    'train-arrival-time': '14:15',
    'train-arrival-time-hour': '14',
    'train-arrival-time-minute': '15',
    'train-departure-date-formatted': '21/12/2016',
    'train-arrival-date-formatted': '21/12/2016'
  },
  sampleVisitInformationData
);

const sampleBoatJourneyData = Object.assign(
  {
    'mode-of-transport': 'Boat',
    'boat-name': 'Boaty McBoatFace',
    'boat-date-of-departure': '2017-01-22',
    'boat-date-of-departure-day': '22',
    'boat-date-of-departure-month': '01',
    'boat-date-of-departure-year': '2017',
    'boat-time-of-departure': '12:00',
    'boat-time-of-departure-hour': '12',
    'boat-time-of-departure-minute': '00',
    'boat-date-of-arrival': '2017-01-22',
    'boat-date-of-arrival-day': '22',
    'boat-date-of-arrival-month': '01',
    'boat-date-of-arrival-year': '2017',
    'boat-time-of-arrival': '16:00',
    'boat-time-of-arrival-hour': '16',
    'boat-time-of-arrival-minute': '00',
    'boat-port-of-arrival': 'FOL_FOLKESTONE',
    'boat-country-of-departure': 'FRA_France',
    'boat-port-of-departure': 'JDU_Dunkerque',
    'boat-date-of-departure-formatted': '22/01/2017',
    'boat-date-of-arrival-formatted': '22/01/2017'
  },
  sampleVisitInformationData
);

const sampleLandJourneyData = Object.assign(
  {
    'mode-of-transport': 'Land',
    'land-date-of-arrival': '2017-01-25',
    'land-date-of-arrival-day': '25',
    'land-date-of-arrival-month': '01',
    'land-date-of-arrival-year': '2017',
    'land-time-of-arrival': '12:30',
    'land-time-of-arrival-hour': '12',
    'land-time-of-arrival-minute': '30',
    'land-method-of-travel': 'Other',
    'land-other-method-of-travel': 'Example transport',
    'land-port-of-arrival': 'Belfast',
    'land-date-of-arrival-formatted': '25/01/2017'
  },
  sampleVisitInformationData
);

const sampleCompletePlaneApplication = Object.assign(
  {},
  samplePassportData,
  samplePassportImageData,
  sampleContactDetailsData,
  sampleAgentData,
  samplePaymentData,
  sampleReferenceData,
  samplePlaneJourneyData
);

const sampleCompleteManualEntryPlaneApplication = Object.assign(
  {},
  samplePassportData,
  samplePassportImageData,
  sampleContactDetailsData,
  sampleAgentData,
  samplePaymentData,
  sampleReferenceData,
  sampleManualEntryPlaneJourneyData
);

const sampleCompletePrivatePlaneApplication = Object.assign(
  {},
  samplePassportData,
  samplePassportImageData,
  sampleContactDetailsData,
  sampleAgentData,
  samplePaymentData,
  sampleReferenceData,
  samplePrivatePlaneJourneyData
);

const sampleCompleteTrainApplication = Object.assign(
  {},
  samplePassportData,
  samplePassportImageData,
  sampleContactDetailsData,
  sampleAgentData,
  samplePaymentData,
  sampleReferenceData,
  sampleTrainJourneyData
);

const sampleCompleteBoatApplication = Object.assign(
  {},
  samplePassportData,
  samplePassportImageData,
  sampleContactDetailsData,
  sampleAgentData,
  samplePaymentData,
  sampleReferenceData,
  sampleBoatJourneyData
);

const sampleCompleteLandApplication = Object.assign(
  {},
  samplePassportData,
  samplePassportImageData,
  sampleContactDetailsData,
  sampleAgentData,
  samplePaymentData,
  sampleReferenceData,
  sampleLandJourneyData
);

module.exports = {
  samplePassportData: samplePassportData,
  samplePassportImageData: samplePassportImageData,
  sampleContactDetailsData: sampleContactDetailsData,
  sampleVisitInformationData: sampleVisitInformationData,
  sampleAgentData: sampleAgentData,
  samplePaymentData: samplePaymentData,
  sampleReferenceData: sampleReferenceData,
  samplePlaneJourneyData: samplePlaneJourneyData,
  sampleManualEntryPlaneJourneyData: sampleManualEntryPlaneJourneyData,
  samplePrivatePlaneJourneyData: samplePrivatePlaneJourneyData,
  sampleTrainJourneyData: sampleTrainJourneyData,
  sampleBoatJourneyData: sampleBoatJourneyData,
  sampleLandJourneyData: sampleLandJourneyData,
  sampleCompletePlaneApplication: sampleCompletePlaneApplication,
  sampleCompleteManualEntryPlaneApplication: sampleCompleteManualEntryPlaneApplication,
  sampleCompletePrivatePlaneApplication: sampleCompletePrivatePlaneApplication,
  sampleCompleteTrainApplication: sampleCompleteTrainApplication,
  sampleCompleteBoatApplication: sampleCompleteBoatApplication,
  sampleCompleteLandApplication: sampleCompleteLandApplication
};
