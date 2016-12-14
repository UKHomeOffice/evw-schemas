var evw = {
    mainForm: {
        schema: require('../resources/schema/evw-schema.json'),
        testData: require('../resources/data/primary-path-data.json'),
        mainFormPostData: require('../javascript/mainFormPostData.js')
    },
    hof: {
        transform: require('./hof/transform')
    }
};

module.exports = {
    evw: evw
};
