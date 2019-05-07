const state = $("#stateTemplate").html();
const stateTemplate = Handlebars.compile(state);

//Render Tempalte onload from URL Param
$( document ).ready(function() {
 if (state) {
 const state = getUrlParameter('state')
 $('#state-select').val(state)
 renderState(state);
}
else {
	renderState(null)
}

})

//Change URL on Dropdown Select
$( "#state-select" ).change(function() {
	let stateChange = $(this).val();
	let baseURL = window.location.href.split('?')[0]
	window.history.pushState(baseURL, '', baseURL + '?state=' + stateChange);
	renderState(stateChange)
})

//Change URL on Map Click
$( ".state" ).click(function(e) {
	let stateClick = e.target.attributes["data-state"].value
	$('#state-select').val(stateClick)
	let baseURL = window.location.href.split('?')[0]
	window.history.pushState(baseURL, '', baseURL + '?state=' + stateClick);
	renderState(stateClick)
})

//Render State Template
function renderState(state){
if(state) {
$('#state-laws').html('<div class="center spinner"><i class="fas fa-circle-notch fa-spin"></i></div>')  
$.getJSON( "https://reciprocal.naspovaluepoint.org/laws?state=" + state, function( data ) {
  const info = data.records
	$('#state-laws').html(stateTemplate(info));
  });
}
else {
	$('#state-laws').html('<p class="mt-3"> Please select a state from the dropdown or map to view reciprocal preference laws anf regulations.</p>')  
}
}

//Helper to handle URLs
Handlebars.registerHelper('link', function(url) {
  var link = Handlebars.escapeExpression(url)

  if (url) {
  return new Handlebars.SafeString(
    '<a target="_blank"href="' + link + '">More Information</>'
  );
}
});

//Helper to format date
Handlebars.registerHelper('date', function(date) {
  var input = Handlebars.escapeExpression(date)
  return new Handlebars.SafeString(
    moment(input).format('MMMM D, YYYY')
  );
});

//Helper to calculate time since
Handlebars.registerHelper('time_since', function(date) {
  var input = Handlebars.escapeExpression(date)
  return new Handlebars.SafeString(
    moment(input).fromNow()
  );
});

//Helper for boolean data
Handlebars.registerHelper('true_false', function(boolean) {
  var input = Handlebars.escapeExpression(boolean)
  if (input === 'true') {return new Handlebars.SafeString('Yes')}
  else if (input === 'false') {return new Handlebars.SafeString('No')}
  else {return null}

});

//Get URL param by name
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};