/**
 * Created by robin on 06/08/15.
 */

var schemas = require('../../main/javascript/index');
var expect = require('chai').expect;

describe('evw schemas', function () {

    Object.keys(schemas).forEach(function (module) {
        if (schemas.hasOwnProperty(module)) {

            describe('checking schemas for '+module+' module', function () {

                var _module = schemas[module];
                Object.keys(_module).forEach(function (schema) {
                    if (_module.hasOwnProperty(schema)) {
                        var _schema = _module[schema];

                        it(schema+' should have a valid schema', function () {
                            expect(_schema).to.be.an('object');
                            expect(_schema).to.have.property('schema');
                            expect(_schema.schema).to.be.an('object');
                            expect(_schema.schema).to.have.property('$schema');
                        });

                        it(schema+' should have a valid test object', function () {
                            expect(_schema).to.be.an('object');
                            expect(_schema).to.have.property('schema');
                            expect(_schema.testData).to.be.an('object');
                            expect(_schema.testData).not.to.be.empty;
                        });

                    }
                });

            });

        }
    });

});
