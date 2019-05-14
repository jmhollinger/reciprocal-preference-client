const state = $("#stateTemplate").html();
const stateTemplate = Handlebars.compile(state);

//Render Template onload from URL Param
$( document ).ready(function() {
const state = getUrlParameter('state')

 if (state) {
 $('#state-select').val(state)
 renderState(state);
}
else {
   $('#map').show()
}

})

//Change URL on Dropdown Select
$( "#state-select" ).change(function() {
  let stateChange = $(this).val();
  if(stateChange){
	let baseURL = window.location.href.split('?')[0]
	window.history.pushState(baseURL, '', baseURL + '?state=' + stateChange);
  $('#map').hide()
	renderState(stateChange)
}
})

//Change URL on Map Click
$( ".state" ).click(function(e) {
	let stateClick = e.target.attributes["data-state"].value
	$('#state-select').val(stateClick)
	let baseURL = window.location.href.split('?')[0]
	window.history.pushState(baseURL, '', baseURL + '?state=' + stateClick);
  $('#map').hide()
	renderState(stateClick)
})

//Toggle Map On/Off
$("#map-toggle").click(function() { 
    // assumes element with id='button'
    $("#map").toggle();
});

//Render State Template
function renderState(state){
$('#state-laws').html('<div class="center spinner"><i class="fas fa-circle-notch fa-spin"></i></div>') 
$.ajax( "https://reciprocal.naspovaluepoint.org/v1/laws?state=" + state )
  .done(function(data) {
    const info = data.records
    $('#state-laws').html(stateTemplate(info));
  })
  .fail(function() {
    $('#state-laws').html('<div class="center"><p>We can\'t seem to locate the state you are looking for. Please make sure you have provided a valid state abbreviation.</p></div>')
  })

}

//Helper to handle URLs
Handlebars.registerHelper('link', function(url) {
  var link = Handlebars.escapeExpression(url)

  if (url) {
  return new Handlebars.SafeString(
    '<h6 class="card-subtitle mb-2 text-muted"><span class="font-weight-bold">Statute : </span><a class="card-link" target="_blank"href="' + link + '">View Statute</a></h6>'
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

//Helper for icons
Handlebars.registerHelper('icon', function(boolean) {
  var input = Handlebars.escapeExpression(boolean)
  if (input === 'Yes') {return new Handlebars.SafeString('<i class="fas fa-check-circle text-success"></i>')}
  else if (input === 'No') {return new Handlebars.SafeString('<i class="fas fa-times-circle text-danger"></i>')}
  else {return null}
});

//Helper for boolean data
Handlebars.registerHelper('true_false', function(boolean) {
  var input = Handlebars.escapeExpression(boolean)
  if (input === 'true') {return new Handlebars.SafeString('Yes')}
  else if (input === 'false') {return new Handlebars.SafeString('No')}
  else {return null}
});

//Helper for contact data
Handlebars.registerHelper('contact', function(name, address, city, state, zip, email, phone) {
  var input_name = Handlebars.escapeExpression(name)
  var input_address = Handlebars.escapeExpression(address)
  var input_city = Handlebars.escapeExpression(city)
  var input_state = Handlebars.escapeExpression(state)
  var input_zip = Handlebars.escapeExpression(zip)
  var input_email = Handlebars.escapeExpression(email)
  var input_phone = Handlebars.escapeExpression(phone)

  let clean_name, clean_address, clean_email, clean_phone, clean_label

  if (input_name) {
    clean_name = '<p class="contact-info">' + input_name + '</p>'
  }
  else {
    clean_name = ''
  }

  if (input_address) {
    clean_address = '<p class="contact-info">' + input_address + '</p><p class="contact-info">' + input_city + ' ' + input_state + ' ' + input_zip + '</p>'
  }
  else {
    clean_address = ''
  }

  if (input_email) {
    clean_email = '<p class="contact-info"><a href="mailto:' + input_email + '">' + input_email + '</a></p>'
  }
  else {
    clean_email = ''
  }

  if (input_phone) {
    clean_phone = '<p class="contact-info"><a href="tel:' + input_phone + '">' + input_phone + '</a><p>' 
  }
  else {
    clean_phone = ''
  }

  if(clean_name + clean_address + clean_email + clean_phone){
    clean_label = '<h6 class="card-subtitle mb-2 text-muted"><span class="font-weight-bold">Contact : </span></h6>'
  } 
  else {
    clean_label = ''
  }

return new Handlebars.SafeString(clean_label + clean_name + clean_address + clean_email + clean_phone)

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