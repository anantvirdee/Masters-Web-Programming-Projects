google.maps.visualRefresh = true;
var map;
var geocoder;
var markers=[];

function initialize () 
{
	geocoder=new google.maps.Geocoder();
	var mapOptions = {
    zoom: 16,
    center: new google.maps.LatLng(32.75, -97.13)
	};
	map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
}

function sendRequest () {
   refresh();
   var xhr = new XMLHttpRequest();
   var query=document.getElementById("search").value;
   var txt="";
   var bound=map.getBounds();
   var NE = String(bound.getNorthEast());
   var SW = String(bound.getSouthWest());
   var northEast=NE.substring(1,NE.length-1);
   var southWest=SW.substring(1,SW.length-1);
   xhr.open("GET", "proxy.php?term="+query+"&bounds="+northEast+"|"+southWest+"&limit=10");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () 
   {
       if (this.readyState == 4) 
	   {
          var json = JSON.parse(this.responseText);
          var str = JSON.stringify(json,undefined,2);
		  for(i=0;i<json.businesses.length;i++)
			{
			var rowcontainer= document.createElement("tr");
			var node=document.createElement("a");
			var imagecontainer=document.createElement("td");
			var nodecontainer=document.createElement("td");
			var ratingcontainer=document.createElement("td");
			var image=document.createElement("img");
			var rating_img=document.createElement("img");
			var snippet=document.createElement("td");
			
			rowcontainer.appendChild(imagecontainer);
			rowcontainer.appendChild(nodecontainer);
			rowcontainer.appendChild(ratingcontainer);
			rowcontainer.appendChild(snippet);
			imagecontainer.appendChild(image);
			nodecontainer.appendChild(node);
			ratingcontainer.appendChild(rating_img);
			imagecontainer.setAttribute("class","col-md-2");
			nodecontainer.setAttribute("class","col-md-2");
			ratingcontainer.setAttribute("class","col-md-2");
			snippet.setAttribute("class","col-md-6");
			var address="";
			for(j=0;j<json.businesses[i].location.display_address.length;j++)
				{
				address=address+json.businesses[i].location.display_address[j];
				}
			
			marker(address,i);
			var num=i+1;
			document.getElementById("output").appendChild(rowcontainer);
			//document.getElementById("output").appendChild(snippet);
			node.setAttribute("id","Position"+i);
			node.innerHTML=num+'. '+json.businesses[i].name+"</br>" ;
			snippet.innerHTML=json.businesses[i].snippet_text;
			//image.innerHTML="</br>";
			image.src=json.businesses[i].image_url;
			rating_img.src=json.businesses[i].rating_img_url_large;			
			node.href=json.businesses[i].url; 
			//STYLE HTML
			
			
			
			}
       }
   };
   xhr.send(null);
}


function marker(address,i)
{
var num=i+1;
geocoder.geocode( { 'address': address}, function(results, status) {
	if (status == google.maps.GeocoderStatus.OK) 
		{
		var image="http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+num+"|FF0000|000000";
		map.setCenter(results[0].geometry.location);
		var marker = new google.maps.Marker({
			map: map,
			position: results[0].geometry.location,
			icon : image  
		});
		markers.push(marker);
		} 
	else 
		{
		alert("Geocode was not successful for the following reason: " + status);
		}
	});
	
}

function refresh()
{
document.getElementById("output").innerHTML="";
deleteMarkers();
}

function deleteMarkers()
{
clearMarkers();
  markers = [];
}

function clearMarkers() {
  setAllMap(null);
}

function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}