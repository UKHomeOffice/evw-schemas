/**
 * Created by robin on 06/08/15.
 */

var schemas = require('../index');
var expect = require('chai').expect;

describe('evw schemas', function () {

    describe('checking schemas for mainForm module', function () {

        const module = schemas.evw.mainForm;

        it('mainForm should have a valid schema', function () {
            expect(module).to.be.an('object');
            expect(module).to.have.property('schema');
            expect(module.schema).to.be.an('object');
            expect(module.schema).to.have.property('$schema');
        });

        it('mainForm should have a valid test object', function () {
            expect(module).to.be.an('object');
            expect(module).to.have.property('schema');
            expect(module.testData).to.be.an('object');
            expect(module.testData).not.to.be.empty;
        });

    });

    describe('checking schemas for updateJourney module', function () {

        const module = schemas.evw.updateJourney;

        it('updateJourney should have a valid schema', function () {
            expect(module).to.be.an('object');
            expect(module).to.have.property('schema');
            expect(module.schema).to.be.an('object');
            expect(module.schema).to.have.property('$schema');
        });

    });

    describe('checking exports for hof module', function () {

        const module = schemas.evw.hof;

        it('hof should have a valid transform', function () {
            expect(module).to.be.an('object');
            expect(module).to.have.property('transform');
            expect(module.transform).to.be.an('object');
            expect(module.transform.transformData).to.be.a.function;
        });

        it('hof should have a some sample application data', function () {
            expect(module.sampleApplicationData).to.be.an('object');
            expect(module.sampleApplicationData.sampleCompletePlaneApplication).to.be.an.object;
            expect(module.sampleApplicationData.sampleCompleteManualEntryPlaneApplication).to.be.an.object;
            expect(module.sampleApplicationData.sampleCompletePrivatePlaneApplication).to.be.an.object;
            expect(module.sampleApplicationData.sampleCompleteTrainApplication).to.be.an.object;
            expect(module.sampleApplicationData.sampleCompleteBoatApplication).to.be.an.object;
            expect(module.sampleApplicationData.sampleCompleteLandApplication).to.be.an.object;
        });

    });

});
