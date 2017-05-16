'use strict';

const validate = require('jsonschema').validate;
const schema = require('../schema/evw-schema');
const data = require('../data/primary-path-data.json');

describe('validation', () => {
  describe('a valid application', () => {
    it('should return no errors', () => {
      validate(data, schema).errors.should.have.length(0);
    });
  });
  describe('no payment details', () => {
    it('should return errors', () => {
      let copy = Object.assign({}, data);
      delete copy.payment;
      validate(copy, schema).errors[0].message.should
        .equal('requires property "payment"');
    });
  });
  describe('validating against partial schema', function () {
    describe('remove payment property', function () {
      it('should pass without payment in data', function () {
        let dataCopy = Object.assign({}, data);
        let schemaCopy = Object.assign({}, schema);
        let requireds = schemaCopy.required;
        requireds.splice(requireds.indexOf('payment'), 1);

        let result = validate(dataCopy, schemaCopy);

        result.errors.should
          .have.length(0);
      });
    });
  });
});
