function sendRequest()
{
//document.getElementById("output").innerHTML="";
document.getElementById("poster").src="";
document.getElementById("genre").innerHTML="";
document.getElementById("summary").innerHTML="";
document.getElementById("display").innerHTML="";
document.getElementsByTagName("td").innerHTML="";
startGame();
}
function showTable()
{
		document.getElementById('tablehead').style.visibility="visible";
		
}
function startGame () 
{ 
   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById("form-input").value);
   var txt="";
   var ID=0;
   var json={};
   //document.getElementById("resulttable").innerHTML="";
                 
   xhr.open("GET", "proxy.php?method=/3/search/movie&query=" + query);
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) 
	   {
          json = JSON.parse(this.responseText);
		  console.log(json);
		  
          var str = JSON.stringify(json,undefined,2);
		  for(i=0;i<json.results.length;i++)
		  {
		  var node=document.createElement("tr");
		  var sNo =document.createElement("td");
		  var movieName=document.createElement("td");
		  var releaseDate=document.createElement("td");
		 
          node.setAttribute("id","Position"+i);
		 
		  //document.getElementById("Position"+i).innerHTML="";
		  //node.setAttribute("class","row");
		  //document.getElementById("Position"+i).appendChild(sNo);
		  //document.getElementById("Position"+i).appendChild(movieName);		  
		  //document.getElementById("Position"+i).appendChild(releaseDate);
		  //sNo.setAttribute("class","col-md-4");
		  //movieName.setAttribute("class","col-md-4");
		  //releaseDate.setAttribute("class","col-md-4");
		  sNo.innerHTML=(i+1);
		  movieName.innerHTML=json.results[i].title;
		  releaseDate.innerHTML=json.results[i].release_date;
		  //node.innerHTML=json.results[i].title +"\t\t"+ json.results[i].release_date;
          var out= document.getElementById("output");
		 // if(out!=null){
		//	out.appendChild(node);  
		 // }
		 
		  ID=(json.results[i].id);
		  //var k = document.getElementById("Position"+i);
		  //if(k!=null){
			  node.removeAttribute("onclick");
			  node.innerHTML="";
			  node.appendChild(sNo);
			  node.appendChild(movieName);
			  node.appendChild(releaseDate);
			  node.setAttribute("onclick","getMovieInfo("+ID+")");
		  //}
		  console.log(out);
		  out.appendChild(node);
		  console.log(ID);		  
		  //document.getElementById("Position"+i).setAttribute("onclick","getMovieInfo("+ID+")"); 
		  console.log(node);
		  }
			   
	   }
   };
   xhr.send(null);
}
 

function getMovieInfo(num)
{
   console.log(num);
   var xhr = new XMLHttpRequest();
   var txt="";
   xhr.open("GET", "proxy.php?method=/3/movie/" + num);
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) 
	   {
          var json = JSON.parse(this.responseText);
          var str = JSON.stringify(json,undefined,2); 
		  document.getElementById("poster").src = "http://image.tmdb.org/t/p/w185"+json.poster_path ;
		  document.getElementById("summary").innerHTML="OVERVIEW:"+"</br></br>"+json.overview;
		  for(i=0;i<json.genres.length;i++)
		  {
		    txt=txt+json.genres[i].name+"</br>";
		  }
		  document.getElementById("genre").innerHTML="GENRE:"+"</br></br>"+txt;
		  getCredits(num);
	   }
   };
   xhr.send(null);
}

function getCredits(str)
{

   var xhr = new XMLHttpRequest();
   var txt="";
   xhr.open("GET", "proxy.php?method=/3/movie/"+str+"/credits");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) 
	    {
		  var json = JSON.parse(this.responseText);
          var str = JSON.stringify(json,undefined,2);
		  var count=5;
		  if(json.cast.length<5)
		  {
			count=json.cast.length;
		  }
		  for(i=0;i<count;i++)
		  {
		  txt=txt+json.cast[i].name +"</br>";
		  }
		  document.getElementById("display").innerHTML="CAST:"+"</br></br>"+txt;
		 
	    }
	};
	xhr.send(null);
}