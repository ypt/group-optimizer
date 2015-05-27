module.exports = {
  getMemberData : function(memberId){
    return this.getUserData().dataSet[memberId];
  },
  getUserData : function(){
    return  {
      totalGroups: 3,
      // TODO: CSV input or some other way to input real data
      dataSet: [
        //name, day pref 1, day pref 2, location pref
        ['bob', 2, 3, 1],
        ['fred', 2, 3, 1],
        ['2', 2, 3, 2],
        ['3', 2, 4, 2],
        ['4', 4, 3, 1],
        ['5', 3, 4, 2],
        ['6', 3, 4, 1],
        ['7', 4, 3, 2],
        ['8', 3, 2, 2],
        ['9', 2, 3, 1],
        ['10', 3, 2, 2],
        ['11', 4, 3, 2],
        ['12', 4, 3, 1],
        ['13', 3, 2, 2],
        ['14', 3, 3, 2],
        ['15', 4, 4, 2],
        ['16', 3, 3, 1]
      ]
    };
  }
}
