function front(templateString, sourceData, targetNode) {
    
  var dataArray = Array.isArray(sourceData) ? sourceData : [sourceData];  
  var htmlString = "";

  var retrieveSource = function(sourceObject, dataPath) {
      console.log(sourceObject);
      console.log(dataPath);
      console.log("***********************");
    var keys = dataPath.split('.');
    var source = sourceObject;
    var key;
    while(keys.length) {
      key = keys.shift();
      //console.log(key);
      if(typeof source === 'object' && key in source) {
        source = source[key];
      } else {
        return false;
      }
    }
    //console.log(source);
    return source;
  };
  
  //console.log(dataArray);
  dataArray.forEach(function(data) {
      //console.log(data);
      var template = templateString.replace(/@if\{\{([\w\s-_\.]+)\}\}([\s\S]+?)(@else([\s\S]+?))?@endif/g, function($, $1, $2, $3, $4) {
          //console.log($);
          //console.log($1);
          //console.log($2);
          //console.log($3);
          //console.log($4);
          //console.log("***********************");
        return retrieveSource(data, $1) ? $2 : ($3 ? $4 : "");
      });
    //console.log(template);
    htmlString += template.replace(/\{\{([\w\s-_\.]+)\}\}/g, function($, $1) {
       //console.log($1);
      return retrieveSource(data, $1) || $;
    });
  });

  if(targetNode) {
    targetNode.innerHTML = htmlString;
  } else {
    return htmlString;
  }

}
