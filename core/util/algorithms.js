exports.approximateBinarySearch = function(find, array, compareToFind) {
  var low = 0;
  var high = array.length - 1;
  
  var i;
  var currentCompare;

  while (low <= high) {
    i = Math.floor((low + high) / 2);

    currentCompare = compareToFind(array[i]);

    //  Find is smaller than current item
    if (currentCompare < 0) {
      high = i - 1;
      continue;
    }
    
    //  Find is bigger than current item
    if (currentCompare > 0) {
      low = i + 1;
      continue;
    }

    //  Find is current item
    return i;
  }

  //  Finds minimal distance to find
  if(currentCompare < 0) {
    //  Check if closest find is array start
    if(i === 0)
      return 0;

    var lowDistance = Math.abs(compareToFind(array[i - 1]));

    return lowDistance < Math.abs(currentCompare) ? i - 1 : i;
  }
  else {
    //  Check if closest find is array end
    if(i === array.length - 1)
      return array.length - 1;

    var highDistance = Math.abs(compareToFind(array[i + 1]));

    return highDistance < Math.abs(currentCompare) ? i + 1 : i;
  }
};