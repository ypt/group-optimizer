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
      totalGroups: 7, // TODO: move this config to somewhere else?
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
    var parser = parse();

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

    item.fullName = row[0];
    item.gender = parseInt(row[1], 10);

    item.dayPreferences = [];
    if (row[2] !== ''){
      item.dayPreferences.push(parseInt(row[2], 10));
    }
    if (row[3] !== '' && row[3] != row[2]){
      item.dayPreferences.push(parseInt(row[3], 10));
    }

    item.locationPreferences = [];
    if (row[4] !== ''){
      item.locationPreferences.push(parseInt(row[4], 10));
    }

    result.push(item);
  });

  return result;
}
