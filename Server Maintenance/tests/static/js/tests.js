test( "hello test", function() {
  ok( 1 == "1", "Passed!" );
});

test( "set times test, day rollover", function() {

	var current_date = new Date();
	// set expiration an hour from now

	/**
	* test code, simulate hour 23, make sure day rolls over after this function runs
	*/

	current_date.setHours(23);
	current_date.setMinutes(30);

	/**
	* 'current_date' is now 23:30;
	*/

	var default_date = new Date(current_date.setHours(current_date.getHours() + 1));

    //default date values (usually 'today')
    var day = ("0" + default_date.getDate()).slice(-2);
    var month = ("0" + (default_date.getMonth() + 1)).slice(-2);

    var today = default_date.getFullYear()+"-"+(month)+"-"+(day) ;
    //$('#theDate').val(today);


	// current time values
	var hours = default_date.getHours();
	var minutes = default_date.getMinutes();
    
    var future_time = hours + ":" + minutes;

    //set default to 1 hour from current_date
    //$('#time').val(future_time);

    //did everything work?
    equal( day, 17, "We expect the day to rollover to tomorrow");
    equal( hours, 0, "We expect the hour to roll over to tomorrow");
});

test("link time input to minutes slider. This should fail.", function(){

	equal( time_input, current_time + slider.val(), "These times should be equal");
});