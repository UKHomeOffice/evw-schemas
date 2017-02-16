'use strict';

const sinon = require('sinon');
const transform = require('../../../../../src/main/javascript/hof/transform');
const sampleApplicationData = require('../../../../main/resources/data/hof/sample-application-data');
const sampleAppWithExtraProperties = {
  invalidProperty1: 'value1',
  'invalid-property2': 'value2'
};

describe('apps/common/models/transform', function() {

  describe('#transformPassportData', function() {
    it('ignores properties it does not know about', function() {
      sampleAppWithExtraProperties.nationality = 'KWT';
      transform.transformPassportData(sampleAppWithExtraProperties).should.deep.equal({
        passport: {
          nationality: 'KWT'
        }
      });
    });

    it('transforms passport data correctly', function() {
      transform.transformPassportData(sampleApplicationData.samplePassportData).should.deep.equal({
        passport: {
          checkName: 'Katelyn Walter',
          name: 'Katelyn Walter',
          countryOfBirth: 'UAE',
          dateOfBirth: '1992-04-21',
          expiryDate: '1998-05-27',
          gender: 'M',
          heldPreviousNationalities: 'No',
          holdOtherNationalities: 'No',
          issueDate: '1993-04-19',
          nationality: 'KWT',
          passportNumber: '852400508',
          placeOfBirth: 'Abu Dhabi',
          placeOfIssue: 'Dubai'
        }
      });
    });

    it('transforms any optional answers set to Yes correctly', function() {
      const data = Object.assign({}, sampleApplicationData.samplePassportData);
      data['other-names'] = 'Yes';
      data['enter-other-names'] = 'Fred Bloggs';
      data['have-other-nationalities'] = 'Yes';
      data['other-nationalities'] = 'French';
      data['had-previous-nationalities'] = 'Yes';
      data['previous-nationalities'] = 'German';

      transform.transformPassportData(data).should.deep.equal({
        passport: {
          checkName: 'Katelyn Walter',
          name: 'Katelyn Walter',
          countryOfBirth: 'UAE',
          dateOfBirth: '1992-04-21',
          expiryDate: '1998-05-27',
          gender: 'M',
          heldPreviousNationalities: 'Yes',
          holdOtherNationalities: 'Yes',
          issueDate: '1993-04-19',
          nationality: 'KWT',
          otherNationalities: 'French',
          passportNumber: '852400508',
          placeOfBirth: 'Abu Dhabi',
          placeOfIssue: 'Dubai',
          previousNationalities: 'German',
          anyOtherNames: 'Fred Bloggs'
        }
      });
    });
  });

  describe('#transformPassportImageData', function() {
    it('ignores properties it does not know about', function() {
      sampleAppWithExtraProperties.imageUploadObjectId = '12345-abcde';
      transform.transformPassportImageData(sampleAppWithExtraProperties).should.deep.equal({
        passportFileId: '12345-abcde'
      });
    });

    it('transforms passport image data correctly', function() {
      transform.transformPassportImageData(sampleApplicationData.samplePassportImageData).should.deep.equal({
        passportFileId: '58230ae3bc57424d6264fa88'
      });
    });
  });

  describe('#transformContactDetailsData', function() {
    it('ignores properties it does not know about', function() {
      sampleAppWithExtraProperties.employed = 'Yes';
      transform.transformContactDetailsData(sampleAppWithExtraProperties).should.deep.equal({
        contactDetails: {
          'areYouEmployed': 'Yes',
          'homeAddress': ['', '', '', '', '', '']
        }
      });
    });

    it('transforms contact details data correctly', function() {
      transform.transformContactDetailsData(sampleApplicationData.sampleContactDetailsData).should.deep.equal({
        contactDetails: {
          'areYouEmployed': 'Yes',
          'companyName': 'Sonia Trujillo',
          'countryAppliedFrom': 'Oman',
          'countryAppliedFromCode': 'OMN',
          'emailAddress': 'gepuq@gmail.com',
          'homeAddress': [
            'Home Office',
            '2 Marsham Street',
            'Westminster',
            'London',
            'UK',
            'SW1P 4DF'
          ],
          'mobilePhoneNumber': '+344-59-7767795',
          'occupation': 'Manager',
          'phoneNumber': '+217-84-6087337',
          'secondEmail': 'refupegeq@gmail.com'
        }
      });
    });
  });

  describe('#transformJourneyData', function() {
    it('ignores properties it does not know about', function() {
      sampleAppWithExtraProperties['mode-of-transport'] = 'Plane';
      transform.transformJourneyData(sampleAppWithExtraProperties).should.deep.equal({
        journey: {
          'travelBy': 'Plane',
          'ukAddress': ['', '', '', '', '']
        }
      });
    });

    it('transforms plane journey details data correctly', function() {
      transform.transformJourneyData(sampleApplicationData.samplePlaneJourneyData).should.deep.equal({
        journey: {
          'arrivalDate': '2014-06-26',
          'arrivalTime': '19:45',
          'arrivalTravel': 'EK009',
          'departureDate': '2017-06-16',
          'departureForUKDate': '2014-06-26 14:35:00',
          'departureTravel': 'BA001',
          'flightDetailsCheck': 'Yes',
          'inwardDeparturePortCode': 'DXB',
          'inwardDepartureCountry': 'ARE',
          'inwardDeparturePort': 'Dubai',
          'knowDepartureDetails': 'Yes',
          'otherTravellers': 'jon bon jovi',
          'portOfArrival': 'London - Gatwick',
          'portOfArrivalCode': 'LGW',
          'portOfDeparture': 'London - Gatwick',
          "portOfDepartureCode": "LGW",
          'reasonForTravel': 'Not sure',
          'travelBy': 'Plane',
          'travelWithOthers': 'Yes',
          'ukVisitPhoneNumber': '+4420 7123 4567',
          'visitMoreThanOnce': 'Yes',
          'ukAddress': [
            'Home Office',
            '2 Marsham Street',
            'Westminster',
            'London',
            'SW1P 4DF'
          ]
        }
      });
    });

    it('correctly sets the flightDetailsCheck flag if is-this-your-flight is not present', function() {
      const data = Object.assign({}, sampleApplicationData.samplePlaneJourneyData);
      delete data['is-this-your-flight'];
      transform.transformJourneyData(data).journey.should.not.have.property('flightDetailsCheck');
    });

    it('correctly sets the flightDetailsCheck flag if the flight service was not used', function() {
      const data = Object.assign({}, sampleApplicationData.samplePlaneJourneyData);
      data['is-this-your-flight'] = 'No';
      transform.transformJourneyData(data).journey.should.have.property('flightDetailsCheck', 'No');
    });

    it('transforms manual entry plane journey details data correctly', function() {
      transform.transformJourneyData(sampleApplicationData.sampleManualEntryPlaneJourneyData).should.deep.equal({
        journey: {
          'arrivalDate': '2017-01-12',
          'arrivalTime': '16:30',
          'arrivalTravel': 'DT1001',
          'departureDate': '2017-06-16',
          'departureForUKDate': '2017-01-12 09:45:00',
          'departureTravel': 'BA001',
          'flightDetailsCheck': 'No',
          'inwardDepartureCountry': 'FRA',
          'inwardDeparturePortCode': 'CDG',
          'inwardDeparturePort': 'Paris - Charles de Gaulle',
          'knowDepartureDetails': 'Yes',
          'otherTravellers': 'jon bon jovi',
          'portOfArrival': 'Birmingham',
          'portOfArrivalCode': 'BHX',
          'portOfDeparture': 'London - Gatwick',
          "portOfDepartureCode": "LGW",
          'reasonForTravel': 'Not sure',
          'travelBy': 'Plane',
          'travelWithOthers': 'Yes',
          'ukVisitPhoneNumber': '+4420 7123 4567',
          'visitMoreThanOnce': 'Yes',
          'ukAddress': [
            'Home Office',
            '2 Marsham Street',
            'Westminster',
            'London',
            'SW1P 4DF'
          ]
        }
      });
    });

    it('transforms train journey details data correctly', function() {
      transform.transformJourneyData(sampleApplicationData.sampleTrainJourneyData).should.deep.equal({
        journey: {
          'arrivalDate': '2016-12-21',
          'arrivalTime': '14:15',
          'arrivalTravel': 'Eurostar 9140',
          'departureDate': '2017-06-16',
          'departureForUKDate': '2016-12-21 12:00:00',
          'departureTravel': 'BA001',
          'inwardDepartureCountry': 'FRA',
          'inwardDeparturePort': 'Boulogne',
          'inwardDeparturePortCode': 'JBT',
          'knowDepartureDetails': 'Yes',
          'otherTravellers': 'jon bon jovi',
          'portOfArrival': 'Ashford Intl',
          'portOfArrivalCode': 'AFK',
          'portOfDeparture': 'London - Gatwick',
          "portOfDepartureCode": "LGW",
          'reasonForTravel': 'Not sure',
          'travelBy': 'Train',
          'travelWithOthers': 'Yes',
          'ukVisitPhoneNumber': '+4420 7123 4567',
          'visitMoreThanOnce': 'Yes',
          'ukAddress': [
            'Home Office',
            '2 Marsham Street',
            'Westminster',
            'London',
            'SW1P 4DF'
          ]
        }
      });
    });

    it('transforms train departure station not found in station typeahead', function() {
      const data = Object.assign({}, sampleApplicationData.sampleTrainJourneyData);
      data['train-departure-station'] = 'My own station';

      const result = transform.transformJourneyData(data);

      result.journey.should.have.property('inwardDeparturePort', 'My own station');
      result.journey.should.not.have.property('inwardDeparturePortCode');
    });

    it('transforms boat journey details data correctly', function() {
      transform.transformJourneyData(sampleApplicationData.sampleBoatJourneyData).should.deep.equal({
        journey: {
          'arrivalDate': '2017-01-22',
          'arrivalTime': '16:00',
          'arrivalTravel': 'Boaty McBoatFace',
          'departureDate': '2017-06-16',
          'departureForUKDate': '2017-01-22 12:00:00',
          'departureTravel': 'BA001',
          'inwardDepartureCountry': 'FRA',
          'inwardDeparturePort': 'Dunkerque',
          'inwardDeparturePortCode': 'JDU',
          'knowDepartureDetails': 'Yes',
          'otherTravellers': 'jon bon jovi',
          'portOfArrival': 'FOLKESTONE',
          'portOfArrivalCode': 'FOL',
          'portOfDeparture': 'London - Gatwick',
          "portOfDepartureCode": "LGW",
          'reasonForTravel': 'Not sure',
          'travelBy': 'Boat',
          'travelWithOthers': 'Yes',
          'ukVisitPhoneNumber': '+4420 7123 4567',
          'visitMoreThanOnce': 'Yes',
          'ukAddress': [
            'Home Office',
            '2 Marsham Street',
            'Westminster',
            'London',
            'SW1P 4DF'
          ]
        }
      });
    });

    it('transforms boat departure port and arrival port not found in station typeahead', function() {
      const data = Object.assign({}, sampleApplicationData.sampleBoatJourneyData);
      data['boat-port-of-departure'] = 'My departure port';
      data['boat-port-of-arrival'] = 'My arrival port';

      const result = transform.transformJourneyData(data);

      result.journey.should.have.property('inwardDeparturePort', 'My departure port');
      result.journey.should.not.have.property('inwardDeparturePortCode');
      result.journey.should.have.property('portOfArrival', 'My arrival port');
      result.journey.should.not.have.property('portOfArrivalCode');
    });

    it('transforms land journey details data correctly', function() {
      transform.transformJourneyData(sampleApplicationData.sampleLandJourneyData).should.deep.equal({
        journey: {
          'arrivalDate': '2017-01-25',
          'arrivalTime': '12:30',
          'departureDate': '2017-06-16',
          'departureTravel': 'BA001',
          'knowDepartureDetails': 'Yes',
          'otherTravellers': 'jon bon jovi',
          'portOfArrival': 'Belfast',
          'portOfDeparture': 'London - Gatwick',
          "portOfDepartureCode": "LGW",
          'reasonForTravel': 'Not sure',
          'travelBy': 'Land',
          'travelMethodLand': 'Other',
          'travelWithOthers': 'Yes',
          'ukVisitPhoneNumber': '+4420 7123 4567',
          'visitMoreThanOnce': 'Yes',
          'ukAddress': [
            'Home Office',
            '2 Marsham Street',
            'Westminster',
            'London',
            'SW1P 4DF'
          ]
        }
      });
    });

    it('transforms private plane journey details data correctly', function() {
      transform.transformJourneyData(sampleApplicationData.samplePrivatePlaneJourneyData).should.deep.equal({
        journey: {
          'arrivalDate': '2017-01-12',
          'arrivalTime': '16:10',
          'arrivalTravel': 'DT1001',
          'departureDate': '2017-06-16',
          'departureTravel': 'BA001',
          'departureForUKDate': '2017-01-12 09:45:00',
          'inwardDeparturePortCode': 'DXB',
          'inwardDepartureCountry': 'ARE',
          'inwardDeparturePort': 'Dubai',
          'knowDepartureDetails': 'Yes',
          'otherTravellers': 'jon bon jovi',
          'portOfArrival': 'London - Gatwick',
          'portOfArrivalCode': 'LGW',
          'portOfDeparture': 'London - Gatwick',
          "portOfDepartureCode": "LGW",
          'reasonForTravel': 'Not sure',
          'travelBy': 'Private Plane',
          'travelWithOthers': 'Yes',
          'ukVisitPhoneNumber': '+4420 7123 4567',
          'visitMoreThanOnce': 'Yes',
          'ukAddress': [
            'Home Office',
            '2 Marsham Street',
            'Westminster',
            'London',
            'SW1P 4DF'
          ]
        }
      });
    });
  });

  describe('#transformAgentData', function() {
    it('ignores properties it does not know about', function() {
      sampleAppWithExtraProperties['applying-for-other'] = 'Yes';
      transform.transformAgentData(sampleAppWithExtraProperties).should.deep.equal({
        miscellaneous: {
          'asAnAgent': 'Yes'
        }
      });
    });

    it('transforms agent data correctly when applying for minor is No', function() {
      transform.transformAgentData(sampleApplicationData.sampleAgentData).should.deep.equal({
        'miscellaneous': {
          'asAnAgent': 'Yes',
          'completersContactDetails': '+217-84-6087337',
          'completersEmailAddress': 'xewuka@gmail.com',
          'onBehalfOfMinor': 'No'
        }
      });
    });

    it('transforms agent data correctly', function() {
      const data = Object.assign({}, sampleApplicationData.sampleAgentData);
      data['applying-for-minor'] = 'Yes';

      transform.transformAgentData(data).should.deep.equal({
        'miscellaneous': {
          'asAnAgent': 'Yes',
          'completersContactDetails': '+217-84-6087337',
          'completersEmailAddress': 'xewuka@gmail.com',
          'onBehalfOfMinor': 'Yes'
        }
      });
    });

    it('ignore completersContactDetails and completersEmailAddress when asAnAgent is set to No', function() {
      const agentData = {
        'applying-for-other': 'No'
      };

      transform.transformAgentData(agentData).should.deep.equal({
        'miscellaneous': {
          'asAnAgent': 'No',
          'onBehalfOfMinor': 'No'
        }
      });
    });
  });

  describe('#transformPaymentData', function() {
    it('ignores properties it does not know about', function() {
      sampleAppWithExtraProperties.orderCode = 'EVW-a4084857-1f42-4214-a364-3d6951cf1f2b';
      transform.transformPaymentData(sampleAppWithExtraProperties).should.deep.equal({
        payment: {
          'feeInPence': NaN,
          'orderCode': 'EVW-a4084857-1f42-4214-a364-3d6951cf1f2b',
          'paid': undefined,
          'paymentDate': ''
        }
      });
    });

    it('transforms payment data correctly', function() {
      transform.transformPaymentData(sampleApplicationData.samplePaymentData).should.deep.equal({
        'payment': {
          'feeInPence': 1500,
          'orderCode': 'EVW-a4084857-1f42-4214-a364-3d6951cf1f2b',
          'paid': true,
          'paymentDate': '2016-02-15 12:30:00'
        }
      });
    });
  });

  describe('#transformReferenceData', function() {
    it('ignores properties it does not know about', function() {
      sampleAppWithExtraProperties.objectId = '123abc';
      transform.transformReferenceData(sampleAppWithExtraProperties).should.deep.equal({
        objectId: '123abc'
      });
    });

    it('transforms reference data correctly', function() {
      transform.transformReferenceData(sampleApplicationData.sampleReferenceData).should.deep.equal({
        objectId: '123abc',
        applicationReference: 'ABC123001'
      });
    });

    it('handles there being no data to transform', function() {
      transform.transformReferenceData({}).should.deep.equal({});
    });
  });

  describe('#transformData', function() {
    let spies;

    before(function() {
      spies = [];
      spies.push(sinon.spy(transform, 'transformPassportData'));
      spies.push(sinon.spy(transform, 'transformPassportImageData'));
      spies.push(sinon.spy(transform, 'transformContactDetailsData'));
      spies.push(sinon.spy(transform, 'transformJourneyData'));
      spies.push(sinon.spy(transform, 'transformReferenceData'));
      spies.push(sinon.spy(transform, 'transformAgentData'));
      spies.push(sinon.spy(transform, 'transformPaymentData'));
    });

    afterEach(function() {
      spies.forEach(spy => spy.reset());
    });

    it('returns a promise', function() {
      transform.transformData(sampleApplicationData.sampleCompletePlaneApplication).should.be.a.promise;
    });

    it('always resolves', function() {
      return transform.transformData(sampleApplicationData.sampleCompletePlaneApplication).should.be.fulfilled;
    });

    ['Plane', 'Train', 'Boat', 'Land', 'Private Plane', 'Manual Entry Plane'].forEach(function(travelMethod) {
      it(`transforms a complete ${travelMethod} application`, function() {
        return transform.transformData(sampleApplicationData[`sampleComplete${travelMethod.replace(/\s/g, '')}Application`]).then(result => {
          transform.transformPassportData.should.have.been.calledOnce;
          transform.transformPassportImageData.should.have.been.calledOnce;
          transform.transformContactDetailsData.should.have.been.calledOnce;
          transform.transformJourneyData.should.have.been.calledOnce;
          transform.transformReferenceData.should.have.been.calledOnce;
          transform.transformAgentData.should.have.been.calledOnce;
          transform.transformPaymentData.should.have.been.calledOnce;
          result.should.have.property('passport');
          result.should.have.property('passportFileId');
          result.should.have.property('contactDetails');
          result.should.have.property('journey');
          result.should.have.property('miscellaneous');
          result.should.have.property('payment');
          result.should.have.property('objectId');
          result.should.have.property('applicationReference');
          result.journey.should.have.property('travelBy', travelMethod === 'Manual Entry Plane' ? 'Plane': travelMethod);
        });
      });
    });
  });

  describe('#transformDataSync', function() {
    it('should transform in same way as #transformData', function() {
      const transformSync = transform.transformDataSync(sampleApplicationData.sampleCompletePlaneApplication);
      return transform.transformData(sampleApplicationData.sampleCompletePlaneApplication).then(result => {
        transformSync.should.deep.equal(result);
      });
    });
  });

});
