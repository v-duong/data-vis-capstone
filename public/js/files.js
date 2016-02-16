window.onload = function(){
  $.get('/tables', function(data){
    var d = JSON.parse(data);
    for (i = 0; i < d.length; i++){
      //$('.filetable').append('<tr><td><select id='+ d[i].table_name + '_vis class="vislist"><option value="all">All</option><option value="barscatter">Bar/Scatter</option><option value="globe">Globe</option><option value="basketball">Basketball</option></select></td></tr>');

      $('.filetable').append('<tr><td>'+ d[i].tablename +'</td><td><select id='+  d[i].tablename + '_vis class="vislist"><option value="All">All</option><option value="barscatter">Bar/Scatter</option><option value="globe">Globe</option><option value="basketball">Basketball</option></select></td><td>\
      <input class="button" type="button" class="delbutton" id='+ d[i].tablename +' value="Delete" onclick="deleteFunc(this.id)"></td></tr>');

      // set the value for the dropdown within database -- to do later
      var dropDownID = "#" + d[i].tablename + "_vis";
      $(dropDownID).val(d[i].vistype);


    }
  });

  $( '.file-input' ).each( function(){
    var $input   = $( this ),
      $label   = $input.next( 'label' ),
      labelVal = $label.html();

    $input.on( 'change', function( e )
    {
      var fileName = '';

      if( this.files && this.files.length > 1 )
        fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
      else if( e.target.value )
        fileName = e.target.value.split( '\\' ).pop();

      if( fileName ){
        $label.find( 'span' ).html( fileName );
        $('#upload').removeAttr('disabled');
      }
      else {
        $label.html( labelVal );
        $('#upload').attr('disabled', 'disabled');
      }
    });

    // Firefox bug fix
    $input
    .on( 'focus', function(){ $input.addClass( 'has-focus' ); })
    .on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
  });
}

var CustDropzone = new Dropzone(document.body, { // Make the whole body a dropzone
  url: "/files", // Set the url
  paramName: "datafile", // The name that will be used to transfer the file
  maxFilesize: 2, // MB
  init: function () {
    // Set up any event handlers
    this.on('complete', function () {
        console.log("ON COMPLETE");
        window.location.replace('/files');
    });
  }
});

/*
$(document).on('change', '#vislist', function(){
  teamChange(this.value);
});*/

$(document).on('change','select',function(){
  //console.log(this.value);
  //var table_name = ((this.id).split("_"))[0];
  var table_name = (this.id).slice(0, -4);
  var visualtype = this.value;
  console.log(table_name);
  console.log(visualtype);

  // change database type
  $.post('/updateTableVisType', {
      vistype: visualtype,
      tableName: table_name
    }, function(data){
      console.log(data);
      if (data != true)
        console.log("It died");

    }, 'json');

});



function deleteFunc(btnID){
  var fileName = btnID;
  $.post('/delData', { tName: fileName }, function(data){
    console.log(data);
    if (data == true){
      location.reload();
    }
    else {
      console.log("It died");
    }
  }, 'json');
}
