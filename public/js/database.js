//var app = require('../../index.js');

var exports = module.exports = {};

var pg = require('pg');

//connect to local postgres database

//var connectionString = 'postgres://localhost:5432/capstone_data';

// var connectionString = 'postgres://localhost:5432/mydb';


// connect to heroku's database
var connectionString = "postgres://aaojwaabmvczuq:aHR5JA0-K0wmk6Q6k6VXXfhChO@ec2-54-197-241-239.compute-1.amazonaws.com:5432/d3so15mog50g7o?ssl=true";


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
        return;
      }
      else{
      	callback(rows.rows);
      	return;

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
			return;
		}
		else{
			callback(true);
			return;
		}
	});

}

// returns 0 for text, 1 for int, 2 for float(real)
function findType(dataSet, colNum){

	var retVal = 1; // default for int
	var curRow;
	for (var i = 1; i < dataSet.length; i++){
		curRow = dataSet[i].split(",");
		if (isNaN(curRow[colNum]))  // found a non numerical number. Column will be text
			return 0;
		if (curRow[colNum] != Math.floor(curRow[colNum]))  //Col will be float, unless text is found. 
			retVal = 2;
	}
	return retVal;
}

exports.insertTable = function(tableName, dataSet, callback){
	// make sure dataSet is not empty



	if (dataSet.length == 0){
		callback(false);
		return;
	}

	tableName = tableName.substr(0, tableName.length-4);
	tableName = tableName.replace(/ /g, "_");  // table name can't have spaces
	dataSet = dataSet.split("\r");
	console.log("\n\n\nHERE!!!");
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
			case 1: 
				createTableQuery = createTableQuery.concat(columnNames[i] + " INTEGER,");
				break;
			case 2:
				createTableQuery = createTableQuery.concat(columnNames[i] + " REAL,");
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
			case 1: 
				createTableQuery = createTableQuery.concat(columnNames[i] + " INTEGER)");
				break;
			case 2:
				createTableQuery = createTableQuery.concat(columnNames[i] + " REAL)");
				break;
			default:
				break;
	}
	
	insertBaseQuery = insertBaseQuery.concat(columnNames[i] + ") values (");

	//console.log(createTableQuery);

	client.query(createTableQuery, function(err, rows){
		if (err){
			console.log("Could not CREATE table");
			callback(false);
			return;
		}

		else {
			// should have "insert into firsttest (x,y,z) values (" already done in insertTableQuery
			var insertQuery;
			for (i = 1; i < dataSet.length; i++){
				insertQuery = "";
				var tempRow = dataSet[i].split(",");
				insertQuery = insertQuery.concat(insertBaseQuery);
				for (j = 0; j < columnNames.length-1; j++){
					
					if (j >= tempRow.length){
						insertQuery = insertQuery.concat('null,');
					}
					else{
						switch (colTypes[j]){
							case 0:
								insertQuery = insertQuery.concat("'" + tempRow[j] + "'" + ',');
								break;
							case 1:
							case 2:
								insertQuery = insertQuery.concat(tempRow[j] + ',');
								break;
							default:
								break;
						}
						
					}
					

				}

				if (j >= tempRow.length)
					insertQuery = insertQuery.concat('null)');
				else{
					switch (colTypes[j]){
							case 0:
								insertQuery = insertQuery.concat("'" + tempRow[j] + "'" + ')');
								break;
							case 1:
							case 2:
								insertQuery = insertQuery.concat(tempRow[j] + ')');
								break;
							default:
								break;
						}
				}

				//console.log(insertQuery);
				client.query(insertQuery, function(err, rows){

					if (err){
						console.log("Could not insert data");
					}

				});
			}




			callback(true);
			return;
		}

	});




}

exports.addition = function(num1, num2){
	return num1 * num2;
}