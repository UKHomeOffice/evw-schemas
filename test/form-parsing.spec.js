'use strict';

require('chai').should();
const parsing = require('../lib/form-parsing');

let fixture = {
  foo: false,
  bar: true,
  baz: '',
  lol: 'lo',
  nah: null
};

describe('withoutEmpty', function () {

  it('should remove falsey and empty values', function () {
    parsing.withoutEmpty(fixture).should.deep.equal({
      'bar': true,
      lol: 'lo'
    });
  });
});

describe('emptyKeepFalsey', function () {
  it('preserves falsey, removes empty/null values', function () {
    parsing.emptyKeepFalsey(fixture).should.deep.equal({
      foo: false,
      bar: true,
      lol: 'lo'
    });
  });
});

describe('emptyWithFalse', function () {
  let payment = {
    foo: 'bar',
    bar: null,
    baz: undefined,
    empty: '',
    payment: {
      foo: '',
      paid: false,
      pending: true
    }
  };

  it('recursively preserves falsey, removes empty/null values', function () {
    parsing.emptyWithFalse(payment).should.deep.equal({
      foo: 'bar',
      payment: {
        paid: false,
        pending: true
      }
    });
  });
});
