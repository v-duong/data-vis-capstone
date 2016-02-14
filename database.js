//var app = require('../../index.js');

var exports = module.exports = {};

var pg = require('pg');
var moment = require('moment');

//connect to local postgres database

// var connectionString = 'postgres://localhost:5432/capstone_data';

// var connectionString = 'postgres://localhost:5432/mydb';


// connect to heroku's database
var connectionString = "postgres://uiruphueqmgtzy:MeDPu8elxoLOYZFhSP6JstEQGU@ec2-54-225-195-249.compute-1.amazonaws.com:5432/d4bm6q4qc2ha09?ssl=true";


var client = new pg.Client(connectionString);
client.connect(function(err) {
  if (err)
    console.log("DB ERROR");
});

exports.queryDB = function(queryStr, callback) {
  client.query(queryStr, function(err, rows) {
    if (err) {
      console.log("DB FAILED");
      //return null;
      callback(null);
      return;
    } else {
      if ((rows.rows).length <= 0){
        callback([0]);
        return;
      }
      //console.log("fuck you bitch bitch" + rows.rows);
      callback(rows.rows);
      return;

    }
  });

}

exports.deleteTable = function(tableName, schemaName, callback) {
  //drop table firsttest

  var dropQuery = "drop table ".concat(schemaName + '.' + tableName);
  client.query(dropQuery, function(err, rows) {
    if (err) {
      console.log("Could not drop table");
      callback(false);
      return;
    } else {
      callback(true);
      return;
    }
  });

}



function isADate(dateStr){

	var formats = ["MM/DD/YY H:mm", "YYYY-MM-DD", "MM/DD/YY HH:mm", "M/DD/YY H:mm", "M/D/YY H:mm", "MM/D/YY H:mm"];
	if (moment(dateStr, formats, true).isValid()){
		return true;
	}
	return false;


}

// returns 0 for text, 2 for float(double precision), 3 for date
function findType(dataSet, colNum){

	var retVal = 0; // default for int
	var curRow;
	for (var i = 1; i < dataSet.length; i++){
		curRow = dataSet[i];
		// ignore NULL or empty
		if ((curRow[colNum]) == "" || (curRow[colNum] == "NULL")){
			continue;
		}

		// if a date is found, and its the first .. assume column will contain date
		// Must do this orelse too slow
		if (retVal == 0){
			if (isADate(curRow[colNum])){
				return 3;
			}

		}

		if (isNaN(curRow[colNum]) && (curRow[colNum] !== undefined))  // found a non numerical number. Column will be text
		{

      return 0;
    }
		retVal = 2;
	}


	return retVal;
}

function CSVToArray( strData, strDelimiter ){
    strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );
    var arrData = [[]];
    var arrMatches = null;
    while (arrMatches = objPattern.exec( strData )){
        var strMatchedDelimiter = arrMatches[ 1 ];
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){
            arrData.push( [] );
        }

        var strMatchedValue;
        if (arrMatches[ 2 ]){
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );
        }
        else {
            strMatchedValue = arrMatches[ 3 ];
        }
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    return( arrData );
}

exports.insertTable = function(tableName, schemaName, dataSet, callback){


//exports.insertTable = function(fileName, filePath, callback){
	// make sure dataSet is not empty
	if (dataSet.length == 0){
		callback(false);
		return;
	}


	tableName = tableName.substr(0, tableName.length-4);
	tableName = tableName.replace(/ /g, "_");  // table name can't have spaces
  dataSet = CSVToArray( dataSet, "," );
	var columnNames = dataSet[0];
	var colTypes = [];
	//CREATE table firsttest (x TEXT, y TEXT, z TEXT);
	var createTableQuery = "CREATE TABLE ";
	createTableQuery = createTableQuery.concat(schemaName+'.'+tableName + " (");

	//insert into firsttest (x,y,z) values (1,3,4);
	var insertBaseQuery = "INSERT INTO ";

	insertBaseQuery = insertBaseQuery.concat(schemaName+'.'+tableName + " (");

	for (i = 0; i < columnNames.length - 1; i++){
		colTypes.push(findType(dataSet, i));
		switch(colTypes[i]){
			case 0:
				createTableQuery = createTableQuery.concat(columnNames[i] + " TEXT,");
				break;
			case 2:
				createTableQuery = createTableQuery.concat(columnNames[i] + " double precision,");
				break;
			case 3:
				createTableQuery = createTableQuery.concat(columnNames[i] + " timestamp,");
				break;
			default:
				break;
		}

		insertBaseQuery = insertBaseQuery.concat(columnNames[i] + ",");

	}

	// adding last column name
	colTypes.push(findType(dataSet, i));
	switch(colTypes[i]) {
		case 0:
			createTableQuery = createTableQuery.concat(columnNames[i] + " TEXT)");
			break;
		case 2:
			createTableQuery = createTableQuery.concat(columnNames[i] + " double precision)");
			break;
		case 3:
			createTableQuery = createTableQuery.concat(columnNames[i] + " timestamp)");
			break;
		default:
			break;
	}

	insertBaseQuery = insertBaseQuery.concat(columnNames[i] + ") values ");



	client.query(createTableQuery, function(err, rows){
		if (err){
			console.log("Could not CREATE table");
			callback(false);
			return;
		}

		else {
			// should have "insert into firsttest (x,y,z) values " already done in insertTableQuery
			var insertQuery = insertBaseQuery;
			for (i = 1; i < dataSet.length; i++){
        insertQuery = insertQuery.concat('(');
				var tempRow = dataSet[i];
        var endLineSymbol = ",";

				for (j = 0; j < columnNames.length-1; j++){

					if ((j >= tempRow.length) || (tempRow[j] == "NULL") || (tempRow[j] == "")){
						insertQuery = insertQuery.concat('null,');
					}
					else{
            tempRow[j] = cleanUpText(tempRow[j]);
						switch (colTypes[j]){
							case 0:
								insertQuery = insertQuery.concat("'" + tempRow[j] + "'" + ',');
								break;
							case 2:
								insertQuery = insertQuery.concat(tempRow[j] + ',');
								break;
							case 3:
								insertQuery = insertQuery.concat("timestamp '" + tempRow[j] + "'," );
								break;
							default:
								break;
						}

					}


				}

        if (i == dataSet.length -1)
          endLineSymbol = "";

				if ((j >= tempRow.length) || (tempRow[j] == "NULL") || (tempRow[j] == ""))
					insertQuery = insertQuery.concat('null)' + endLineSymbol + ' ');

				else{
					switch (colTypes[j]){
							case 0:
								insertQuery = insertQuery.concat("'" + tempRow[j] + "'" + ')' + endLineSymbol + ' ');
								break;
							case 2:
								insertQuery = insertQuery.concat(tempRow[j] + ')' + endLineSymbol + ' ');
								break;
								case 3:
								insertQuery = insertQuery.concat("timestamp '" + tempRow[j] + "')' + endLineSymbol + ' " );
								break;
							default:
								break;
						}
				}
			}

      client.query(insertQuery, function(err, rows){
        if (err){
          console.log("Count not insert query");
        }
        else {
          console.log("insert Complete!");
        }
      });

			callback(true);
			return;
		}


	});




}

function cleanUpText(str){
  return str.replace("'", "''");
}

exports.addition = function(num1, num2){
	return num1 * num2;
}
