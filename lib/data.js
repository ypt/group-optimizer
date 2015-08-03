var _ = require('lodash');
var fs = require('fs');
var parse = require('csv').parse;

module.exports = {
  getMemberData : function(memberId){
    return this.getUserData().dataSet[memberId];
  },
  getUserData : function(){
    var that = this;

    return  {
      totalGroups: 4, // TODO: move this config to somewhere else?
      // The data schema looks like this:
      // - name
      // - gender: 0 == Male, 1 == Female
      // - day preferences: An array of Integers representing each date selected
      // - location preferences: An array of Integers representing each location selected
      dataSet: that._dataSet
    };
  },
  readCSV: function(filePath, callback){
    var that = this;

    var input = fs.createReadStream(filePath);

    var output = [];

    // create parser
    var parser = parse({delimiter: '\t', columns: true});

    // Use the writable stream api
    parser.on('readable', function(){
      while((record = parser.read()) !== null){
        output.push(record);
      }
    });

    // Catch any error
    parser.on('error', function(err){
      console.log(err.message);
    });

    // When we are done, test that the parsed output matched what expected
    parser.on('finish', function(){

      // Close the readable stream
      parser.end();

      // format the data and save it
      that._dataSet = formatRawData(output);

      // execute callback when we're done reading the file
      callback();
    });

    // pipe readable stream from file to CSV parser
    input.pipe(parser);
  }
};

var _dataSet = null;

// format raw data into the schema used by the algorithm
function formatRawData(data){
  // NOTE: the raw data is in last year's format.
  // TODO: We will need to update this to process new raw data format at some point

  // unformatted data
  // - name
  // - gender: 0 == Male, 1 == Female
  // - date 1: 1 == Mon, 2 == Tues, etc.
  // - date 2: 1 == Mon, 2 == Tues, etc.
  // - location

  var result = [];

  _.each(data, function(row){
    var item = {};

    item.fullName = row['First Name'] + ' ' + row['Last Name'];

    item.gender = row.Gender == 'Male' ? 0 : 1;

    item.dayPreferences = [];
    var DAY_PREFERENCES_FIELD_LABEL = 'Which days of the week can you attend family group?';
    if (row[DAY_PREFERENCES_FIELD_LABEL].indexOf('Monday') > -1) {
      item.dayPreferences.push(1);
    }
    if (row[DAY_PREFERENCES_FIELD_LABEL].indexOf('Tuesday') > -1) {
      item.dayPreferences.push(2);
    }
    if (row[DAY_PREFERENCES_FIELD_LABEL].indexOf('Wednesday') > -1) {
      item.dayPreferences.push(3);
    }
    if (row[DAY_PREFERENCES_FIELD_LABEL].indexOf('Thursday') > -1) {
      item.dayPreferences.push(4);
    }
    if (row[DAY_PREFERENCES_FIELD_LABEL].indexOf('Friday') > -1) {
      item.dayPreferences.push(5);
    }

    // possible options: University City, Center City, Chinatown, Art Museum, Graduate Hospital
    item.locationPreferences = [];
    var LOCATION_PREFERENCES_FIELD_LABEL = 'Which locations would you prefer?';
    if (row[LOCATION_PREFERENCES_FIELD_LABEL].indexOf('University City') > -1) {
      item.locationPreferences.push(1);
    }
    if (row[LOCATION_PREFERENCES_FIELD_LABEL].indexOf('Center City') > -1) {
      item.locationPreferences.push(2);
    }
    if (row[LOCATION_PREFERENCES_FIELD_LABEL].indexOf('Chinatown') > -1) {
      item.locationPreferences.push(3);
    }
    if (row[LOCATION_PREFERENCES_FIELD_LABEL].indexOf('Art Museum') > -1) {
      item.locationPreferences.push(4);
    }
    if (row[LOCATION_PREFERENCES_FIELD_LABEL].indexOf('Graduate Hospital') > -1) {
      item.locationPreferences.push(5);
    }

    item.birthYear = parseInt(row['Year of birth'], 10);

    item.meta = row;

    result.push(item);
  });

  return result;
}
