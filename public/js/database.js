//var app = require('../../index.js');

var exports = module.exports = {};

var pg = require('pg');
var moment = require('moment');

//connect to local postgres database

// var connectionString = 'postgres://localhost:5432/capstone_data';

// var connectionString = 'postgres://localhost:5432/mydb';


// connect to heroku's database
var connectionString = "postgres://aaojwaabmvczuq:aHR5JA0-K0wmk6Q6k6VXXfhChO@ec2-54-197-241-239.compute-1.amazonaws.com:5432/d3so15mog50g7o?ssl=true";


var client = new pg.Client(connectionString);
client.connect(function(err) {
  if (err)
    console.log("DB ERROR");
  //console.log("Set dbClient to NULL")
});

exports.queryDB = function(queryStr, callback) {
  client.query(queryStr, function(err, rows) {
    if (err) {
      console.log("DB FAILED");
      //return null;
      callback(null);
      return;
    } else {
      callback(rows.rows);
      return;

    }
  });

}

exports.deleteTable = function(tableName, callback) {
  //drop table firsttest
  console.log("trying to drop");
  var dropQuery = "drop table ".concat(tableName);
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
		curRow = dataSet[i].split(",");
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

		if (isNaN(curRow[colNum]))  // found a non numerical number. Column will be text
			return 0;

		retVal = 2;
	}


	return retVal;
}

exports.insertTable = function(tableName, dataSet, callback){

//exports.insertTable = function(fileName, filePath, callback){
	// make sure dataSet is not empty
	if (dataSet.length == 0){
		callback(false);
		return;
	}

	tableName = tableName.substr(0, tableName.length-4);
	tableName = tableName.replace(/ /g, "_");  // table name can't have spaces

	dataSet = dataSet.split("\r");
	//console.log(dataSet[0]);
	var columnNames = dataSet[0].split(",");
	var colTypes = [];
	//CREATE table firsttest (x TEXT, y TEXT, z TEXT);
	var createTableQuery = "CREATE TABLE ";
	createTableQuery = createTableQuery.concat(tableName + " (");

	//insert into firsttest (x,y,z) values (1,3,4);
	var insertBaseQuery = "INSERT INTO ";

	insertBaseQuery = insertBaseQuery.concat(tableName + " (");

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
				var tempRow = dataSet[i].split(",");
        var endLineSymbol = ",";

				for (j = 0; j < columnNames.length-1; j++){

					if ((j >= tempRow.length) || (tempRow[j] == "NULL") || (tempRow[j] == "")){
						insertQuery = insertQuery.concat('null,');
					}
					else{
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

      console.log(insertQuery);
      client.query(insertQuery, function(err, rows){
        if (err){
          console.log("Could not insert data", insertQuery);
        }
      });

			callback(true);
			return;
		}


	});




}

exports.addition = function(num1, num2){
	return num1 * num2;
}
