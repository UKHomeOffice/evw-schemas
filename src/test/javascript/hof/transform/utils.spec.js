'use strict';

const chai = require('chai');
const expect = chai.expect;
const utils = require('../../../../../src/main/javascript/hof/transform/utils');

const data = {
  prop1: 'abc',
  prop2: 123,
  prop3: true,
  prop4: '',
  prop5: false,
  prop6: null,
  prop7: undefined,
  prop8: [],
  prop9: {},
  obj1: {
    field1: '',
    field2: 'xyz'
  }
};

describe('apps/common/models/transform/utils', function() {

  describe('#getGender', function() {
    it('handles not string parameters', function() {
      utils.getGender(123).should.equal('');
    });

    it('returns F when appropriate', function() {
      utils.getGender('F').should.equal('F');
      utils.getGender('female').should.equal('F');
      utils.getGender('Female').should.equal('F');
      utils.getGender('FEMALE').should.equal('F');
    });

    it('returns M when appropriate', function() {
      utils.getGender('M').should.equal('M');
      utils.getGender('male').should.equal('M');
      utils.getGender('Male').should.equal('M');
      utils.getGender('MALE').should.equal('M');
    });

    it('returns empty string if anything else', function() {
      utils.getGender('Unspecified').should.equal('');
    });
  });

  describe('#withoutEmpty', function() {
    it('recursively removes falsey and empty values', function() {
      utils.withoutEmpty(data).should.deep.equal({
        prop1: 'abc',
        prop2: 123,
        prop3: true,
        prop8: [],
        prop9: {},
        obj1: {
          "field2": "xyz"
        }
      });
    });
  });

  describe('#existsIfEqual', function() {
    it('returns value if items are equal', function() {
      utils.existsIfEqual('Yes', 'Yes', 'Value').should.equal('Value');
    });
    it('returns null if items are not equal', function() {
      expect(utils.existsIfEqual('Yes', 'No', 'Value')).to.be.null;
    });
  });

  describe('#getUtcDate', function() {
    it('returns the date in UTC time with seconds', function() {
      utils.getUtcDate('2016-12-21 10:00').should.equal('2016-12-21 10:00:00');
    });
  });

  describe('#formatDate', function() {
    it('returns empty string is date not supplied', function() {
      utils.formatDate().should.equal('');
      utils.formatDate(undefined).should.equal('');
      utils.formatDate(null).should.equal('');
      utils.formatDate('').should.equal('');
    });

    it('returns the formatted date with default format', function() {
      const date = new Date('2016-02-15 12:30:00');
      utils.formatDate(date).should.equal('2016-02-15 12:30:00');
    });

    it('returns the formatted date with supplied format', function() {
      const date = new Date('2016-02-15 12:30:00');
      utils.formatDate(date, 'DD/MM/YYYY').should.equal('15/02/2016');
    });
  });

  describe('#getOptionCode', function() {
    it('handles non-string values', function() {
      utils.getOptionCode({}).should.equal('');
      utils.getOptionCode(123).should.equal('');
    });

    it('returns the part up to the underscore', function() {
      utils.getOptionCode('GBR_Great Britain').should.equal('GBR');
    });

    it('returns empty string if no underscore is found', function() {
      utils.getOptionCode('Great Britain').should.equal('');
    });
  });
});
