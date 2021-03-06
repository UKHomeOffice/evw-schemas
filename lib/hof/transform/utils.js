'use strict';

const _ = require('lodash');
const moment = require('moment');
require('moment-timezone');

const without = object => _.pickBy(object, (value) => _.identity(value) || _.isNumber(value));

function withoutEmpty(object) {
  _.keys(object).map(key => {
    if (!_.isArray(object[key]) && _.isObject(object[key])) {
      object[key] = this.withoutEmpty(object[key]);
    }
  });
  return without(object);
}

const existsIfEqual = (value1, value2, fieldValue) => (value1 === value2) ? fieldValue : null;

function getGender(gender) {
  if (typeof gender !== 'string') {
    return '';
  }
  if (gender.toUpperCase() === 'FEMALE' || gender.toUpperCase() === 'F') {
    return 'F';
  } else if (gender.toUpperCase() === 'MALE' || gender.toUpperCase() === 'M') {
    return 'M';
  }
  return '';
}

function getUtcDate(date) {
  const utcDate = moment.utc(date, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
  return (utcDate === 'Invalid date') ? null : utcDate;
}

function formatDate(date, format) {
  return date ? moment(date).format(format || 'YYYY-MM-DD HH:mm:ss') : '';
}

function getOptionCode(value) {
  return typeof value === 'string' ? value.substr(0, value.indexOf('_')) : '';
}

function getOptionValue(value) {
  return typeof value === 'string' ? value.substr(value.indexOf('_') + 1) : '';
}

module.exports = {
  getGender: getGender,
  withoutEmpty: withoutEmpty,
  existsIfEqual: existsIfEqual,
  getUtcDate: getUtcDate,
  formatDate: formatDate,
  getOptionCode: getOptionCode,
  getOptionValue: getOptionValue
};
