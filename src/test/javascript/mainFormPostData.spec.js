
var assert = require('chai').assert;
var expectedData = require('../../main/javascript/index').evw.mainForm.testData;
var mainFormPostData = require('../../main/javascript/index').evw.mainForm.mainFormPostData;
var moment = require('moment');


function getYear(dateString) {
    return dateString.substr(0, 4);
}

function getMonth(dateString) {
    return dateString.substr(5, 2);
}

function getDay(dateString) {
    return dateString.substr(8, 2);
}

function getHour(dateString) {
    return moment(dateString).get('hour');
}

function getMinutes(dateString) {
    return moment(dateString).get('minute');
}

describe('mainFormPostData', function () {
    describe('#transformData', function () {

        var record = {
            objectId: expectedData.objectId,
            orderCode: expectedData.payment.orderCode,
            fee: expectedData.payment.feeInPence,
            paid: expectedData.payment.paid,
            paymentDate: new Date(expectedData.payment.paymentDate),
            applicationReference: expectedData.applicationReference,
            nationality: expectedData.passport.nationality,
            countryOfBirthCode: expectedData.passport.countryOfBirth,
            passportNumber: expectedData.passport.passportNumber,
            doiDay: getDay(expectedData.passport.issueDate),
            doiMonth: getMonth(expectedData.passport.issueDate),
            doiYear: getYear(expectedData.passport.issueDate),
            doeDay: getDay(expectedData.passport.expiryDate),
            doeMonth: getMonth(expectedData.passport.expiryDate),
            doeYear: getYear(expectedData.passport.expiryDate),
            placeOfIssue: expectedData.passport.placeOfIssue,
            name: expectedData.passport.name,
            checkName: expectedData.passport.checkName,
            gender: expectedData.passport.gender,
            dobDay: getDay(expectedData.passport.dateOfBirth),
            dobMonth: getMonth(expectedData.passport.dateOfBirth),
            dobYear: getYear(expectedData.passport.dateOfBirth),
            placeOfBirth: expectedData.passport.placeOfBirth,
            anyOtherNames: expectedData.passport.anyOtherNames,
            agreed: expectedData.agreed,
            dateOfBirth: Date(expectedData.passport.dateOfBirth),
            passportFileId: expectedData.passportFileId,
            holdOtherNationalities: expectedData.passport.holdOtherNationalities,
            otherNationalities: expectedData.passport.otherNationalities,
            heldPreviousNationalities: expectedData.passport.heldPreviousNationalities,
            previousNationalities: expectedData.passport.previousNationalities,
            homeAddress1: expectedData.contactDetails.homeAddress[0],
            homeAddress2: expectedData.contactDetails.homeAddress[1],
            homeAddress3: expectedData.contactDetails.homeAddress[2],
            homeAddress4: expectedData.contactDetails.homeAddress[3],
            homeAddressCountryCode: expectedData.contactDetails.homeAddress[4],
            homeAddressPostCode: expectedData.contactDetails.homeAddress[5],
            areYouEmployed: expectedData.contactDetails.areYouEmployed,
            companyName: expectedData.contactDetails.companyName,
            emailAddress: expectedData.contactDetails.emailAddress,
            occupation: expectedData.contactDetails.occupation,
            phoneNumber: expectedData.contactDetails.phoneNumber,
            mobilePhoneNumber: expectedData.contactDetails.mobilePhoneNumber,
            secondEmail: expectedData.contactDetails.secondEmail,
            ukVisitPhoneNumber: expectedData.journey.ukVisitPhoneNumber,
            departureMode: expectedData.journey.travelBy,
            flightNumber: expectedData.journey.arrivalTravel,
            ukAddress1: expectedData.journey.ukAddress[0],
            ukAddress2: expectedData.journey.ukAddress[1],
            ukAddress3: expectedData.journey.ukAddress[2],
            ukAddress4: expectedData.journey.ukAddress[3],
            ukAddressPostCode: expectedData.journey.ukAddress[4],
            knowDepartureDetails: expectedData.journey.knowDepartureDetails,
            departureDateDay: getDay(expectedData.journey.departureDate),
            departureDateMonth: getMonth(expectedData.journey.departureDate),
            departureDateYear: getYear(expectedData.journey.departureDate),
            visitMoreThanOnce: expectedData.journey.visitMoreThanOnce,
            inwardDepartureCountryPlaneCode: expectedData.journey.inwardDepartureCountry,
            inwardDeparturePortPlane: expectedData.journey.inwardDeparturePort,
            inwardDeparturePortPlaneCode: expectedData.journey.inwardDeparturePortCode,
            ukDuration: expectedData.journey.ukDuration,
            travelWithOthers: expectedData.journey.travelWithOthers,
            otherTravellers: expectedData.journey.otherTravellers,
            departureFlightNumber: expectedData.journey.departureTravel,
            portOfDeparture: expectedData.journey.portOfDeparture,
            portOfDepartureCode: expectedData.journey.portOfDepartureCode,
            reasonForVisit: 'Other',
            portOfArrival: expectedData.journey.portOfArrival,
            departureForUKDatePlaneDay: getDay(expectedData.journey.departureForUKDate),
            departureForUKDatePlaneMonth: getMonth(expectedData.journey.departureForUKDate),
            departureForUKDatePlaneYear: getYear(expectedData.journey.departureForUKDate),
            departureForUKTimePlaneHour: getHour(expectedData.journey.departureForUKDate),
            departureForUKTimePlaneMinutes: getMinutes(expectedData.journey.departureForUKDate),
            otherReasonForVisit: expectedData.journey.reasonForTravel,
            arrivalDatePlaneDay: getDay(expectedData.journey.arrivalDate),
            arrivalDatePlaneMonth: getMonth(expectedData.journey.arrivalDate),
            arrivalDatePlaneYear: getYear(expectedData.journey.arrivalDate),
            arrivalTimePlaneHour: expectedData.journey.arrivalTime.split(':')[0],
            arrivalTimePlaneMinutes: expectedData.journey.arrivalTime.split(':')[1],
            portOfArrivalPlane: expectedData.journey.portOfArrival,
            portOfArrivalPlaneCode: expectedData.journey.portOfArrivalCode,
            countryAppliedFrom: expectedData.contactDetails.countryAppliedFrom,
            countryAppliedFromCode: expectedData.contactDetails.countryAppliedFromCode,
            onBehalfOfMinor: expectedData.miscellaneous.onBehalfOfMinor,
            asAnAgent: expectedData.miscellaneous.asAnAgent,
            completersContactDetails: expectedData.miscellaneous.completersContactDetails,
            completersEmailAddress: expectedData.miscellaneous.completersEmailAddress,
            invitation: expectedData.miscellaneous.invitationCode
        };

        var actualData = mainFormPostData.transformData(record);
        assert.deepEqual(actualData, expectedData);
    });

    describe('payment object', function () {
        var fix = require('../fixtures/pending-post');
        it('should include falsey values', function () {
            mainFormPostData.transformData(fix).payment
            .should.contain.any.keys({'paid':false});
        });
    });

    it('should not return the key if the values are null', function () {

        var record = {
            gender: 'M',
            travelWithOthers: 'No'
        };

        var actualData = mainFormPostData.transformData(record);
        //console.dir(actualData);
        assert.notProperty(actualData.journey, 'otherTravellers');
        assert.notProperty(actualData.journey, 'arrivalDate');
    });

    it('should not return a departureForUKDate if one of the values are null', function () {

        var record = {
            gender: 'M',
            departureForUKDateDay: getDay(expectedData.journey.departureForUKDate),
            departureForUKDateMonth: getMonth(expectedData.journey.departureForUKDate),
            departureForUKDateYear: getYear(expectedData.journey.departureForUKDate),
            departureForUKDateHour: getHour(expectedData.journey.departureForUKDate),
            departureForUKDateMinutes: null
        };
        var actualData = mainFormPostData.transformData(record);
        assert.notProperty(actualData.journey, 'departureForUKDate');
    });
});

describe('format time', function () {
    it('should append a zero to an hour with a single digit', function () {
        var formattedTime = mainFormPostData.formatTime('4', '50');
        assert.equal(formattedTime, '04:50');
    });

    it('should append a zero to a minute with a single digit', function () {
        var formattedTime = mainFormPostData.formatTime('15', '4');
        assert.equal(formattedTime, '15:04');
    });

    it('should append a zero to an hour and a minute with a single digit', function () {
        var formattedTime = mainFormPostData.formatTime('2', '9');
        assert.equal(formattedTime, '02:09');
    });
});

describe('#getFieldDepartureMode', function () {
    it("should change 'Private Plane' to 'Plane'", function () {
        var fieldDepartureMode = mainFormPostData.getFieldDepartureMode({
            departureMode: 'Private Plane'
        });
        assert.equal(fieldDepartureMode, 'Plane');
    });

    it("should not change 'Plane'", function () {
        var fieldDepartureMode = mainFormPostData.getFieldDepartureMode({
            departureMode: 'Plane'
        });
        assert.equal(fieldDepartureMode, 'Plane');
    });
});

describe ('isFlightDetailsCheckValid', function () {
    it ("should reset the flight details check flag if inwardDepartureCountry false", function() {
        var record = {
            departureMode: expectedData.journey.travelBy,
            inwardDepartureCountryPlaneCode: 'false',
            inwardDeparturePortPlane: 'Kuwait',
            portOfArrivalPlane: 'London Heathrow'
        };
        assert.equal(mainFormPostData.isFlightDetailsCheckValid(record, 'Yes'), 'No');
    });

    it ("should reset the flight details check flag if inwardDeparturePortPlane false", function() {
        var record = {
            departureMode: expectedData.journey.travelBy,
            inwardDepartureCountryPlaneCode: 'KWT',
            inwardDeparturePortPlane: 'false',
            portOfArrivalPlane: 'London Heathrow'
        };
        assert.equal(mainFormPostData.isFlightDetailsCheckValid(record, 'Yes'), 'No');
    });

    it ("should reset the flight details check flag if portOfArrivalPlane false", function() {
        var record = {
            departureMode: expectedData.journey.travelBy,
            inwardDepartureCountryPlaneCode: 'KWT',
            inwardDeparturePortPlane: 'Kuwait',
            portOfArrivalPlane: 'false'
        };
        assert.equal(mainFormPostData.isFlightDetailsCheckValid(record, 'Yes'), 'No');
    });

    it ("should return yes if flight details are present", function() {
        var record = {
            departureMode: expectedData.journey.travelBy,
            inwardDepartureCountryPlaneCode: 'KWT',
            inwardDeparturePortPlane: 'Kuwait',
            portOfArrivalPlane: 'London Heathrow'
        };
        assert.equal(mainFormPostData.isFlightDetailsCheckValid(record, 'Yes'), 'Yes');
    });

    it ("should return no if flight details check was originally set to no", function() {
        var record = {
            departureMode: expectedData.journey.travelBy,
            inwardDepartureCountryPlaneCode: 'KWT',
            inwardDeparturePortPlane: 'Kuwait',
            portOfArrivalPlane: 'London Heathrow'
        };
        assert.equal(mainFormPostData.isFlightDetailsCheckValid(record, 'No'), 'No');
    });
});

