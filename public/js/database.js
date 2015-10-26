//var app = require('../../index.js');

var exports = module.exports = {};

var pg = require('pg');

//connect to local postgres database

var connectionString = 'postgres://localhost:5432/capstone_data';

// var connectionString = 'postgres://localhost:5432/mydb';


// connect to heroku's database
//var connectionString = "postgres://aaojwaabmvczuq:aHR5JA0-K0wmk6Q6k6VXXfhChO@ec2-54-197-241-239.compute-1.amazonaws.com:5432/d3so15mog50g7o";


var client = new pg.Client(connectionString);
client.connect(function(err){
  if (err)
    console.log("DB ERROR");
    //console.log("Set dbClient to NULL")
});

exports.queryDB = function(queryStr, callback){
	client.query(queryStr , function(err, rows){
      if (err){
        console.log("DB FAILED");
        //return null;
        callback(null);
      }
      else{
      	callback(rows.rows);

      }
    });

}

exports.deleteTable = function(tableName, callback){
	//drop table firsttest
	var dropQuery = "drop table ".concat(tableName);
	client.query(dropQuery, function(err, rows){
		if (err){
			console.log("Could not drop table");
			callback(false);
		}
		else{
			callback(true);
		}
	});

}



exports.insertTable = function(tableName, dataSet, callback){
	// make sure dataSet is not empty
	if (dataSet.length == 0)
		callback(false);

	tableName = tableName.substr(0, tableName.length-4);
	tableName = tableName.replace(/ /g, "_");  // table name can't have spaces
	dataSet = dataSet.split("\r");
	var columnNames = dataSet[0].split(",");


	//CREATE table firsttest (x TEXT, y TEXT, z TEXT);
	var createTableQuery = "CREATE TABLE ";
	createTableQuery = createTableQuery.concat(tableName + " (");

	//insert into firsttest (x,y,z) values (1,3,4);
	var insertBaseQuery = "INSERT INTO ";

	insertBaseQuery = insertBaseQuery.concat(tableName + " (");

	for (i = 0; i < columnNames.length; i++){
		if (i == (columnNames.length - 1)){
			createTableQuery = createTableQuery.concat(columnNames[i] + " TEXT)");
			insertBaseQuery = insertBaseQuery.concat(columnNames[i] + ") values (");
		}
		else {
			createTableQuery = createTableQuery.concat(columnNames[i] + " TEXT,");
			insertBaseQuery = insertBaseQuery.concat(columnNames[i] + ",");
		}
	}
	// console.log(createTableQuery);
	client.query(createTableQuery, function(err, rows){
		if (err){
			console.log("Could not CREATE table");
			callback(false);
		}

	});

	// should have "insert into firsttest (x,y,z) values (" already done in insertTableQuery
	var insertQuery;
	for (i = 1; i < dataSet.length; i++){
		insertQuery = "";
		var tempRow = dataSet[i].split(",");
		insertQuery = insertQuery.concat(insertBaseQuery);
		for (j = 0; j < columnNames.length; j++){
			if (j == (columnNames.length-1)){
				if (j >= tempRow.length)
					insertQuery = insertQuery.concat('null)');
				else
					insertQuery = insertQuery.concat(tempRow[j] + ')');
			}
			else {
				if (j >= tempRow.length){
					insertQuery = insertQuery.concat('null,');
				}
				else{
					insertQuery = insertQuery.concat(tempRow[j] + ',');
				}
			}

		}

		client.query(insertQuery, function(err, rows){
			if (err){
				console.log("Could not insert data");
			}

		});
	}



	//client.query("")
	callback(true);

}

exports.addition = function(num1, num2){
	return num1 * num2;
}
