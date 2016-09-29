var model= {	
	filter_list: ko.observableArray([{filter:'restaurant'},{filter:'hospital'},{filter:'atm'},{filter:'cafe'}]),
	fav_list: ko.observableArray([{fav:'Pizzahut'},{fav:'Dominos'},{fav:'Barista'}]),
	 distance: ko.observableArray([{value: 500},{value: 1000},{value: 5000},{value: 10000}]),
	 check: ko.observable(1000)
	
};


//theres a problem with custom distance continue after solution us available


var myViewModel =function (){
	
	
	
	show_filter= ko.observable(false);
	show_fav= ko.observable(false);
	place= ko.observable("");

	
	/* function that makes the list of  favourites when the favourite button is clicked*/
	fav_toggle= function() {
		if( show_fav() )
		{
			show_fav(false);
		}
		else 
		{
			show_filter(false);
			show_fav(true);
		}
	}
	
	/* function that makes the list of  filters when the favourit filter is clicked*/
	filter_toggle= function() {
		if( show_filter() )
		{
			show_filter(false);
		}
		else 
		{
			show_filter(true);
			show_fav(false);
		}
	}
	
	

	
	//function to load map
	var map;
	var genericSet=0; // a flag to check if the generic location has been specified
 initMap=function(){
			
		// create a new map object
		map= new google.maps.Map(document.getElementById('map'),{
			center:{lat: 12.2958,lng: 76.6394},
			zoom:8
		});
		
			// set boundaries
	var bounds= new google.maps.LatLngBounds();
		
		var markers=[];
		var infoWindows=[];
	
	//creating a request to the Google places to set markers based on selected filters		
		var show_markers=function(value){
		
			if(genericSet)
			{
			var request = {
			location: map.center,
			radius: '1000',
			types: [value] // returned when filter is selected
		  };
		  
		  

		  //create a new Place service object
		  service = new google.maps.places.PlacesService(map);
		  service.nearbySearch(request, callback);

		  
		  function callback(results, status) {
		  if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
  
			  createMarker(results[i],value);
		
			}
		  }
		}

}
	else 
	{
		window.alert("Select the Place To Move first");
	}

	
}



var show_favs=function(value) {
		if(genericSet)
			{
		  
		  
		  var typeRequest = {
			location: map.center,
			radius: '500',
			query: value
		  };

		  //create a new Place service object
		  service = new google.maps.places.PlacesService(map);
		  service.textSearch(typeRequest, callback);

		  
		  function callback(results, status) {
		  if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
			   var place = results[i].geometry.location;
			   if (results[i].opening_hours)
			   {
			   var name= results[i].name;
			   }
			   else{
				  var name=  typeRequest.query;
			   }
			   
			   console.log(results[i]);
			   if (results[i].opening_hours)
			   {
			   var open_now= results[i].opening_hours.open_now;
			   }
			   else 
			   {
				    var open_now="no Information";
			   }
			   
			   if (results[i].opening_hours)
			   {
			   var rating= results[i].rating;
			   }
			   else{
				    var rating="no Information";
			   }
			 distance_time(place,name,open_now,rating);
			  // console.log(done_ok,place);
			  // if(done_ok){
			  // createMarker_fav(results[i]);
			  // }
			}
		  }
		}

}
	else 
	{
		window.alert("Select the Place To Move first");
	}
}
	

	
	
	
//double click to zoom if zoomed out or zoom out if zoomed in
// testing use if necessary
var zoom_lock=1;
$('#map').dblclick(function() {
	if(zoom_lock)
	{
		map.setZoom(15);
		zoom_lock=0;
	}
	else{
		map.setZoom(12);
		zoom_lock=1;
	}
});

	
	
	
	// listener that to retrieve selected filter
$("#filter-list").on('click','li', function() {
console.log($(this).text());
var value=$(this).text();
var setter= set(value);
console.log(value);
if(setter)
{
hide_Allmarkers(); //hide previous markers
show_markers(value);// show the current markers
}
});

// listener that to retrieve selected favourite
$("#fav-list").on('click','li', function() {
var value=$(this).text();
var setter= set(value);
if(setter);
{
hide_Allmarkers(); //hide previous markers
show_favs(value);// show the current markers
}
});

//function to create marker
function createMarker(place,value) {
	var icon="images/"+value+".png";//set icon based on the filter
        var placeLoc = place.geometry.location;
       var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
		  icon : icon
        });
		markers.push(marker);
}
	
	
	
//create markers for favs

function createMarker_fav(place,name,open_now,rating,distance) {
		//bounds.extend(marker.position);
		// var name=response.name;
		// var opening_hours= response.opening_hours.open_now;
		// var rating=response.rating;
		console.log(name,open_now,rating);
		
		var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="bodyContent">'+
            '<p><b>'+name+'</b><br>'+
			'<b>Open Now: </b>'+open_now+'<br>' +
			'<b>Rating: </b>'+rating+'<br>'+
			'<b>Distance:</b>'+distance+'meters</p>'+
            '</div>'+
            '</div>';

			closeInfoWindows = function() {
				for(var i=0; i< infoWindows.length ; i++)
				{
					infoWindows[i].close();
				}
			}
			
 var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
		
			 var marker = new google.maps.Marker({
          map: map,
          position: place
        });
			bounds.extend(marker.position);
			markers.push(marker);
			map.fitBounds(bounds);
			infoWindows.push(infowindow);
			// map zooms out suddenly some times this avoids it
		zoomChangeBoundsListener = 	google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) { 
        if (this.getZoom()< 10){
            this.setZoom(12);
		
        }
});

setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);  // remove the listener after 2 seconds
			
			marker.addListener('click', function() {
			closeInfoWindows(); //close all other info windows
			infowindow.open(map, marker);
			marker.setAnimation(google.maps.Animation.BOUNCE)
			setTimeout(function(){marker.setAnimation(null)} , 2000); // bounce for 2 seconds
        });
}

	
//function to hide all the markers
function hide_Allmarkers() {
	
	for(var i=0;i< markers.length;i++)
	{
		markers[i].setMap(null);
	}
}
	
	

	 //marker icons
	 var generic_icon= "images/generic-marker.png";
	 var store_icon="images/shops-icon1.png";
	 
	 //create a general marker for the zoomed view
	  marker = new google.maps.Marker({
		  icon: generic_icon,
		  animation: google.maps.Animation.DROP
	  });
	  
	//autocomplete feature
	var input=document.getElementById('find');
	var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);
		
		
	// geo coder to convert names of the places to latLng positions
	 var geocoder = new google.maps.Geocoder();
	
	 document.getElementById('zoom-btn').addEventListener('click', function() {
          geocodeAddress(geocoder, map);
	 });
	
var position;

	 function geocodeAddress(geocoder, resultsMap) {
        var address = document.getElementById('find').value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
			resultsMap.setZoom(15);
			
			//place the marker on the entered location
			position= results[0].geometry.location;
			console.log(position);
			hide_Allmarkers();
			updateMarker(position,resultsMap);
			genericSet=1;
          } 
		  else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
		
		//clear the input box when button is clicked
		place("");
      }
	  
		//function to update the position of generic marker
	updateMarker= function(position,map)
	{
           marker.setPosition(position),
			marker.setMap(map) 
			bounds.extend(marker.position)
	}
	
	
	
	//adding distance matrix
	// distance_time= function(marker_position,marker){
	 // var service = new google.maps.DistanceMatrixService;
        // service.getDistanceMatrix({
          // origins: [position],
          // //destinations: [destinationA, destinationB],
		  // destinations:[marker_position],
          // travelMode: 'DRIVING',
          // unitSystem: google.maps.UnitSystem.METRIC,
          // avoidHighways: false,
          // avoidTolls: false
        // }, function(response, status) {
          // if (status !== 'OK') {
            // alert('Error was: ' + status);
          // } else {
            // var originList = response.originAddresses;
            // var destinationList = response.destinationAddresses;
            // // var outputDiv = document.getElementById('output');
            // // outputDiv.innerHTML = '';
			// distance= response.rows[0].elements[0].distance.value; //distance from the origin
			// if(distance < 1000)
			// {
			 // marker.setPosition(marker_position);
			// bounds.extend(marker);
			// }
			
		  // }
		// });
	// }

	distance_time= function(marker_position,name,open_now,rating){
	 var service = new google.maps.DistanceMatrixService;
	 var done= true;
	 
	  service.getDistanceMatrix({
          origins: [position],
		  destinations:[marker_position],
		  travelMode: 'DRIVING',
		  unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
	  },function(response, status) {
          if (status !== 'OK') {
            alert('Error was: ' + status);
          } else {
			  
			  if(response.rows[0].elements[0].status=="OK") //cross check so that there are no zero_results 
			  {
			var distance= response.rows[0].elements[0].distance.value; //distance from the origin
			// var timeToDrive=response.rows[0].elements[0].distance.value
			(distance < 5000)? done= true : done=false;
			if(done)
			{
				createMarker_fav(marker_position,name,open_now,rating,distance);
			}
		console.log(done,distance,status);
		  }
		  }
		});
	}
	 
	
	
	 // google.maps.event.addDomListener(window, 'load', initialize);
 }
	

	
//function to allow a selection (filter or favourite) only once.	
var prev="";
set= function(value)
{
	var set=(prev!=value)?true:false;
	prev= value;
	return set;
}
	
	
};


 ko.applyBindings(new myViewModel());


	