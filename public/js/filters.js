var FilterArray = [];

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}


// table selected, time to show columns.. See what kind of Visualization was chosen first
$("#TableList").change(function(){
	var visualSelected =  $("#VisualList option:selected").val();
	switch(visualSelected){
		case 'bar':
      var tableSelected = $("#TableList option:selected").val();
      var getColumnTypeQuery = "SELECT column_name ,data_type FROM information_schema.columns where table_name = '";
      getColumnTypeQuery = getColumnTypeQuery.concat(tableSelected + "'");

      $("#columnSelection.off-canvas-submenu").html("");
      $.getJSON('/retrieveData', { myQuery : getColumnTypeQuery }, function(data){
        // create a dropdown list
        // default at "Choose Column" to make sure user actually chooses a column
        var htmlStr = "<option value='' selected='selected' disabled='disabled'> Choose Column </option>";
        var htmlStrForY = "<option value='' selected='selected' disabled='disabled'> Choose Column </option>";
        // populate dropdown list with columnNames and Values
        for (var i = 0; i < data.length; i++){
          htmlStr = htmlStr.concat('<option value="' + data[i].data_type + '">' + data[i].column_name + '</option>');

          // for Y Column since Y should not contain any text
          if (data[i].data_type != 'text'){
            htmlStrForY = htmlStrForY.concat('<option value="' + data[i].data_type + '">' + data[i].column_name + '</option>');
          }
        }

        htmlStr = htmlStr.concat('</select></li>');
        $("#columnSelection.off-canvas-submenu").append('<li><p>X</p> <select id="xColumn">' + htmlStr);
        $("#columnSelection.off-canvas-submenu").append('<li><p>Y</p> <select id="yColumn">' + htmlStrForY);
        $("#columnSelection.off-canvas-submenu").append('<li><p>Z</p> <select id="zColumn">' + htmlStr);

        //generateBarFilters();

      });
      break;
		case 'scatter':
			var tableSelected = $("#TableList option:selected").val();
			var getColumnTypeQuery = "SELECT column_name ,data_type FROM information_schema.columns where table_name = '";
			getColumnTypeQuery = getColumnTypeQuery.concat(tableSelected + "'");
      getColumnTypeQuery = getColumnTypeQuery.concat(" and data_type = 'double precision'");

			$("#columnSelection.off-canvas-submenu").html("");
			$.getJSON('/retrieveData', { myQuery : getColumnTypeQuery }, function(data){
				// create a dropdown list
				// default at "Choose Column" to make sure user actually chooses a column
				var htmlStr = "<option value='' selected='selected' disabled='disabled'> Choose Column </option>";

				// populate dropdown list with columnNames and Values
				for (var i = 0; i < data.length; i++){
					htmlStr = htmlStr.concat('<option value="' + data[i].data_type + '">' + data[i].column_name + '</option>');
				}

				htmlStr = htmlStr.concat('</select></li>');
				$("#columnSelection.off-canvas-submenu").append('<li><p>X</p> <select id="xColumn">' + htmlStr);
				$("#columnSelection.off-canvas-submenu").append('<li><p>Y</p> <select id="yColumn">' + htmlStr);
				$("#columnSelection.off-canvas-submenu").append('<li><p>Z</p> <select id="zColumn">' + htmlStr);

				//generateBarFilters();

			});
			break;
		default:
			alert("Please choose a Visualization");
			$("#TableList").val('');	// set it back to default
			break;
	}
});

// Changes for Dynamic Column
// each column will generate its own desired filters
$(document).on('change', '#xColumn', function(){
  switch (this.value){
    case 'double precision':
      generateNumericColumnFilter('#xColumn');
      break;
    case 'text':
      generateTextColumnFilter('#xColumn');
      break;
    default:
      break;
  }


});

$(document).on('change', '#yColumn', function(){
  switch (this.value){
    case 'double precision':
      generateNumericColumnFilter('#yColumn');
      break;
    case 'text':
      generateTextColumnFilter('#yColumn');
      break;
    default:
      break;
  }


});
$(document).on('change', '#zColumn', function(){
  switch (this.value){
    case 'double precision':
      generateNumericColumnFilter('#zColumn');
      break;
    case 'text':
      generateTextColumnFilter('#zColumn');
      break;
    default:
      break;
  }


});

function generateTextColumnFilter(colID){
  var tableSelected = $("#TableList option:selected").val();
  var ColName = $(colID.concat(" option:selected")).text();
  //var getMinMaxQuery = 'select max(' + ColName + '), min(' + ColName + ') FROM ' + tableSelected;
  var getSelectionQuery = 'select distinct '+ColName+' from '+tableSelected+' where '+ColName+' is not null order by '+ColName;

  var filterID;
  var formID;
  var amountName;

  switch (colID){
    case '#xColumn':
      formID = "X";
      filterID = "#filters1";
      break;
    case '#yColumn':
      formID = "Y";
      filterID = "#filters2";
      break;
    case '#zColumn':
      formID = "Z";
      filterID = "#filters3";
      break;
  }

  // retrieve all items in column that's alphabeticalized. Then generate Check boxes.
  $.getJSON('/retrieveData', { myQuery : getSelectionQuery }, function(data){
    $(filterID).html("");
    //$(filterID).append('<input id=' + amountName.substring(1) + ' type=text onkeypress=”return isNumber(event);” ></input>' + '<div id=' + slideName.substring(1) + '></div>');
    var randomStr = formID + ':<form class="filterselect" id='+ formID + '><div class="fbox">'
    //$(filterID).append('<form id='+ formID +'>');

    for (var i = 0; i < data.length; i++){

      randomStr = randomStr.concat('\
        <input type="checkbox" value="'+data[i][ColName]+'" id="'+data[i][ColName]+'">\
        <label class="flabel" for="'+data[i][ColName]+'">'+data[i][ColName]+'</label>\
        <br>\
        ');


    }
    randomStr = randomStr.concat('</div></form>');

    //$(filterID).append('<div id="log"></div></form>');

    $(filterID).append(randomStr);

  });

}




// create a filter for
function generateNumericColumnFilter(colID){
	var tableSelected = $("#TableList option:selected").val();
  var ColName = $(colID.concat(" option:selected")).text();
  var getMinMaxQuery = 'select max(' + ColName + '), min(' + ColName + ') FROM ' + tableSelected;



  var filterID;
  var slideName;
  var amountName;
  var filterLabel;
  switch (colID){
    case '#xColumn':
      slideName = "#sliderX";
      amountName = "#amountX";
      filterID = "#filters1";
      filterLabel = "X";
      break;
    case '#yColumn':
      slideName = "#sliderY";
      amountName = "#amountY";
      filterID = "#filters2";
      filterLabel = "Y";
      break;
    case '#zColumn':
      slideName = "#sliderZ";
      amountName = "#amountZ";
      filterID = "#filters3";
      filterLabel = "Z";
      break;
  }

  $.getJSON('/retrieveData', { myQuery : getMinMaxQuery }, function(data){
    $(filterID).html("");
    $(filterID).append(filterLabel + ':<input id=' + amountName.substring(1) + ' type=text onkeypress=”return isNumber(event);” readonly></input>' + '<div id=' + slideName.substring(1) + '></div>');
    var stepValue = 1;
    var dataDiff = data[0].max - data[0].min;

    if (dataDiff < 100){
        while(dataDiff  < 100 ){
          dataDiff = dataDiff * 10;
          stepValue = stepValue/10;
        }
    }


    $( slideName ).slider({
    	range: true,
    	min: Math.floor(parseFloat(data[0].min)),
    	max: Math.ceil(parseFloat(data[0].max)),
    	values: [ Math.floor(parseFloat(data[0].min)), Math.ceil(parseFloat(data[0].max)) ],
      step: stepValue,
    	slide: function( event, ui ) {
    		$( amountName ).val(  ui.values[ 0 ] + " - " + ui.values[ 1 ] );
    	}

    	});
    	$( amountName ).val(  $( slideName ).slider( "values", 0 ) + " - " + $( slideName ).slider( "values", 1 ) );

  });
};

// Creates a query based on Table, Columns, and Filters for Bar and Scatter
function BarScatterFilterQuery(){
  var tableSelected = $("#TableList option:selected").val();
  var x = $("#xColumn option:selected").text();
  var y = $("#yColumn option:selected").text();
  var z = $("#zColumn option:selected").text();

  var xType = $("#xColumn option:selected").val();
  var yType = $("#yColumn option:selected").val();
  var zType = $("#zColumn option:selected").val();

  var tempFrom;
  var tempTo;

  // start of query
  var getColumnTypeQuery = "SELECT " + x + ", " + y + ", " + z + " from " + tableSelected;

  var startWord = " where";

  /*
  select manufacturer_pregen, model, cpu_speed, _price from tryagainsmartphone where _price >= 200 and _price <= 400 and (manufacturer_pregen = 'Samsung'or manufacturer_pregen = 'HTC');
  $('form#X input:checked')[0]
  */

  switch(xType){
    case 'double precision':
      tempFrom = $( "#sliderX" ).slider( "values", 0 );
    	tempTo = $( "#sliderX" ).slider( "values", 1 );
    	if(tempFrom!=""){
    	 	getColumnTypeQuery = getColumnTypeQuery.concat(" where "+x+" >= " + tempFrom);
        startWord = " and";
      }
      if(tempTo!=""){
    		getColumnTypeQuery = getColumnTypeQuery.concat(startWord + " "+x+" <= " + tempTo);
        startWord = " and";
      }
      break;
    case 'text':
      // checkboxes are selected
      if ($('form#X input:checked').length != 0) {
        //and (manufacturer_pregen = 'Samsung'or manufacturer_pregen = 'HTC');
        getColumnTypeQuery = getColumnTypeQuery.concat(startWord + " (" + x + " = '" + $('form#X input:checked')[0].value + "'");
        for (var i = 1; i < $('form#X input:checked').length; i++){
          getColumnTypeQuery = getColumnTypeQuery.concat(" or " + x + " = '" + $('form#X input:checked')[i].value + "'");
        }
        getColumnTypeQuery = getColumnTypeQuery.concat(")");
        startWord = " and";
      }
      break;
    default:
      break;


  }


  switch(yType){
    case 'double precision':
      tempFrom = $( "#sliderY" ).slider( "values", 0 );
      tempTo = $( "#sliderY" ).slider( "values", 1 );
      if(tempFrom!=""){
        getColumnTypeQuery = getColumnTypeQuery.concat(startWord +" "+y+" >= " + tempFrom);
        startWord = " and";
      }
      if(tempTo!=""){
        getColumnTypeQuery = getColumnTypeQuery.concat(startWord +" "+y+" <= " + tempTo);
        startWord = " and";
      }
      break;
    case 'text':
      // checkboxes are selected
      if ($('form#Y input:checked').length != 0) {
        //and (manufacturer_pregen = 'Samsung'or manufacturer_pregen = 'HTC');
        getColumnTypeQuery = getColumnTypeQuery.concat(startWord + " (" + y + " = '" + $('form#Y input:checked')[0].value + "'");
        for (var i = 1; i < $('form#Y input:checked').length; i++){
          getColumnTypeQuery = getColumnTypeQuery.concat(" or " + y + " = '" + $('form#Y input:checked')[i].value + "'");
        }
        getColumnTypeQuery = getColumnTypeQuery.concat(")");
        startWord = " and";
      }
      break;
    default:
      break;
  }

  switch(zType){
    case 'double precision':
      tempFrom = $( "#sliderZ" ).slider( "values", 0 );
      tempTo = $( "#sliderZ" ).slider( "values", 1 );
      if(tempFrom!=""){
        getColumnTypeQuery = getColumnTypeQuery.concat(startWord +" "+z+" >= " + tempFrom);
        startWord = " and";
      }
      if(tempTo!=""){
        getColumnTypeQuery = getColumnTypeQuery.concat(startWord +" "+z+" <= " + tempTo);
        startWord = " and";
      }
      break;
    case 'text':
      // checkboxes are selected
      if ($('form#Z input:checked').length != 0) {
        //and (manufacturer_pregen = 'Samsung'or manufacturer_pregen = 'HTC');
        getColumnTypeQuery = getColumnTypeQuery.concat(startWord + " (" + z + " = '" + $('form#Z input:checked')[0].value + "'");
        for (var i = 1; i < $('form#Z input:checked').length; i++){
          getColumnTypeQuery = getColumnTypeQuery.concat(" or " + z + " = '" + $('form#Z input:checked')[i].value + "'");
        }
        getColumnTypeQuery = getColumnTypeQuery.concat(")");
        startWord = " and";
      }
      break;
    default:
      break;
  }

  return getColumnTypeQuery;

}
