'use strict';

// Helper functions for handling form data objects

var _ = require('lodash');

/**
 * Remove items from an object if their
 * value is falsey or not a number
 * @param  Object object
 * @return Object
 */
var _empty = function without (object) {
    return _.pick(object, function (value) {
        return _.identity(value) || _.isNumber(value);
    });
};

// Recursively remove items with no value from an object
// Ignores arrays.
var withoutEmpty = function withoutEmpty (object) {
    _.keys(object).map(function (key) {
        if(!_.isArray(object[key]) && _.isObject(object[key])) {
            object[key] = withoutEmpty(object[key]);
        }
    });

    return _empty(object);
};


module.exports = {
    withoutEmpty: withoutEmpty,
};