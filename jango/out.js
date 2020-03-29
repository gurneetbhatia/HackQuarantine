var myArr;
var preferedTime;
var radius;

function runit(){

//radius = document.getElementById("radius").value;
preferedTime = document.getElementById("timeInput").value;

var xmlhttp = new XMLHttpRequest();

var url = "output.json";


xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
         myArr = JSON.parse(this.responseText);
        myFunction(myArr);
        DisplayBestTime();
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();


}
  
  function DisplayBestTime(){
    
    document.getElementById("bestTime").innerHTML = "<br>Preferred time: " + preferedTime;

    var bestShop;
    var min = 100;
    var minName = "";
    var posInArray;
    var d = new Date();
    var todayDay = d.getDay()-1;
    //console.log(todayDay);
    var bestShop = document.getElementById("bestTimeOut");


    for( i = 0; i< myArr.length; i++ ){
      
      //console.log( myArr[i].populartimes[0].data[18]);
      if(myArr[i].populartimes!= null){
        
        //console.log(myArr[3].populartimes[todayDay].data[preferedTime]);  
        
        if (myArr[i].populartimes[todayDay].data[preferedTime]<min && myArr[i].populartimes[todayDay].data[preferedTime]!= 0){
          min = myArr[i].populartimes[todayDay].data[preferedTime];
          minName = myArr[i].name;
          posInArray = i;
          
       }  
      }

    }
    
    if(min == 100){
      if(preferedTime<=15 || preferedTime>=18)bestShop.innerHTML = "<div style='color:red'><b>No shop open at your times and radius</b></div>";
      else if(preferedTime>15 && preferedTime <18) bestShop.innerHTML = "<div style='color:red'><b>Don' t go during these times, it is too busy, please select another time</b></div>";
      document.getElementById("myDiv").style.display= "none";
      document.getElementById("day").style.display= "none";
    }else{
    
    bestShop.innerHTML = "<br><div id='bestShop'>Go at " + preferedTime +" to: " + "<b>" + minName +"<b></div>";
    showGraph(posInArray,myArr, todayDay);
    }
  }


function myFunction(array) {
    var out = "";
    var i;
    for(i = 0; i < 6; i++) {
        out += '<div id="superMarket' + i + '"><li>' +
        array[i].name + '</li></div><br>';
        
    }
  }
    /* document.getElementById("output").innerHTML = out ; //replace with out
    
  

   
document.getElementById("superMarket0").addEventListener("click", function(){
  showGraph(0,array);
  
});

document.getElementById("superMarket1").addEventListener("click", function(){
  showGraph(1,array);
  
});
document.getElementById("superMarket2").addEventListener("click", function(){
  showGraph(2,array);
  
});

document.getElementById("superMarket3").addEventListener("click", function(){
  showGraph(3,array);
  
});
document.getElementById("superMarket4").addEventListener("click", function(){
  showGraph(4,array);
  
});

document.getElementById("superMarket5").addEventListener("click", function(){
  showGraph(5,array);
  
});
}
*/
function showGraph(i,array, todayDay){
  var colors = [];   //var whichDay = 0; //0 = Monday, 1= tuesday, etc...
  for(var k =  0; k< 25; k++){
    colors.push('rgba(45, 46, 89, 1)');
  }
colors[preferedTime] = 'rgba(84, 175, 255,1)';

  //console.log(colors[preferedTime]);
  var data = [
    {
      x: ['0','1', '2','3','4','5','6','7', '8','9','10','11','12','13', '14','15','16','17','18','19', '20', '21', '22', '23', '24'],
      y: [array[i].populartimes[todayDay].data[0],
      array[i].populartimes[todayDay].data[1],
      array[i].populartimes[todayDay].data[2],
      array[i].populartimes[todayDay].data[3],
      array[i].populartimes[todayDay].data[4],
      array[i].populartimes[todayDay].data[5],
      array[i].populartimes[todayDay].data[6],
      array[i].populartimes[todayDay].data[7],
      array[i].populartimes[todayDay].data[8],
      array[i].populartimes[todayDay].data[9],
      array[i].populartimes[todayDay].data[10],
      array[i].populartimes[todayDay].data[11],
      array[i].populartimes[todayDay].data[12],
      array[i].populartimes[todayDay].data[13],
      array[i].populartimes[todayDay].data[14],
      array[i].populartimes[todayDay].data[15],
      array[i].populartimes[todayDay].data[16],
      array[i].populartimes[todayDay].data[17],
      array[i].populartimes[todayDay].data[18],
      array[i].populartimes[todayDay].data[19],
      array[i].populartimes[todayDay].data[20],
      array[i].populartimes[todayDay].data[21],
      array[i].populartimes[todayDay].data[22],
      array[i].populartimes[todayDay].data[23],
      array[i].populartimes[todayDay].data[24]],
      marker: {color: colors},
      type: 'bar'
    }
  ];
  
  Plotly.newPlot('myDiv', data);


  /* let out= "<b>" + array[i].name + "</b>" + "<br><br>";
  for (j = 0; j< 7; j++){
  out +=    "<div class='day'><b>" + array[i].populartimes[j].name + ":</b></div><br>"+
   array[i].populartimes[j].data + "<br><br>"
   ;
  document.getElementById("data").innerHTML = out ;
  } */
  
  document.getElementById("day").style.display= "block";
  document.getElementById("myDiv").style.display= "block";
    
  document.getElementById("day").innerHTML = "Click <b>here</b> for next day, current day: " + array[0].populartimes[todayDay].name ;

  document.getElementById("day").addEventListener("click", function(){
    if(todayDay != 6)document.getElementById("day").innerHTML = "Click <b>here</b> for next day, current day: " + array[0].populartimes[todayDay+1].name ;
    else document.getElementById("day").innerHTML = "Click <b>here</b> for next day, current day: " + array[0].populartimes[0].name;
    if(todayDay > 5)todayDay=0;
    else{
      todayDay ++;
    }
  var data = [
    {
      x: ['0','1', '2','3','4','5','6','7', '8','9','10','11','12','13', '14','15','16','17','18','19', '20', '21', '22', '23', '24'],
      y: [array[i].populartimes[todayDay].data[0],
      array[i].populartimes[todayDay].data[1],
      array[i].populartimes[todayDay].data[2],
      array[i].populartimes[todayDay].data[3],
      array[i].populartimes[todayDay].data[4],
      array[i].populartimes[todayDay].data[5],
      array[i].populartimes[todayDay].data[6],
      array[i].populartimes[todayDay].data[7],
      array[i].populartimes[todayDay].data[8],
      array[i].populartimes[todayDay].data[9],
      array[i].populartimes[todayDay].data[10],
      array[i].populartimes[todayDay].data[11],
      array[i].populartimes[todayDay].data[12],
      array[i].populartimes[todayDay].data[13],
      array[i].populartimes[todayDay].data[14],
      array[i].populartimes[todayDay].data[15],
      array[i].populartimes[todayDay].data[16],
      array[i].populartimes[todayDay].data[17],
      array[i].populartimes[todayDay].data[18],
      array[i].populartimes[todayDay].data[19],
      array[i].populartimes[todayDay].data[20],
      array[i].populartimes[todayDay].data[21],
      array[i].populartimes[todayDay].data[22],
      array[i].populartimes[todayDay].data[23],
      array[i].populartimes[todayDay].data[24]],
      marker: {color: colors[0]},
      type: 'bar'
    }
  ];
  
  Plotly.newPlot('myDiv', data);
});
 

}



