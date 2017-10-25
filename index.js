'use strict';

var evw = {
  mainForm: {
    schema: require('./schema/evw-schema'),
    testData: require('./data/primary-path-data.json'),
    mainFormPostData: require('./lib/form-transformations.js')
  },
  hof: {
    transform: require('./lib/hof/transform'),
    sampleApplicationData: require('./data/hof/sample-application-data')
  },
  updateJourney: {
    schema: require('./schema/evw-flight-journey-update-schema.json')
  }
};

module.exports = {
  evw: evw
};
