console.log("Start of Index.js");

var tempdata = ["some random text", "do these things", "database wanted"];

for(var x=0; x < tempdata.length; x++)
{
   generateTaskCards(tempdata[x]);
}

function generateTaskCards(data) {
   var text = document.createTextNode(data);

   var p = document.createElement("p");
   p.setAttribute("class","container");
   p.appendChild(text);
   
   var div = document.createElement("div");
   div.setAttribute("class", "card");
   div.appendChild(p);

   var temp = document.getElementsByClassName("content")[0].appendChild(div);
   console.log(temp)
}

function addTask() {
   var input = document.getElementById("taskInput");
   var task = input.value;
   input.value = "";

   console.log(task);

   if(task != "") {
      tempdata.push(task);
      generateTaskCards(task)
   } else {
      // todo: handle error
   }
}
