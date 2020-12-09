// ==UserScript==
// @name     Kigard Fashion Script
// @author   Ciol
// @version  1.0.0
// @grant    none
// @include  https://www.kigard.fr/index.php?p=vue*
// @exclude  https://www.kigard.fr/index.php?p=vue*&d=t
// ==/UserScript==

var req = new XMLHttpRequest();
var created = [];
req.open("GET", "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/list.json");
req.overrideMimeType("text/plain");
req.addEventListener("load", function() {
// Do something with req.responseText
  created = JSON.parse(req.responseText);
  console.log(created);
  applyFashion();
}, false);
req.addEventListener("error", function() {
// Handle error
}, false);
req.send();


function applyFashion() {
  var vue = document.getElementsByTagName("tbody")[0];
  var table = vue.children;
  
  for (let row of table) {
		for (let cell of row.children) {
			if (!cell.style.backgroundImage.includes("brouillard") && !cell.className.includes("coord")) {
					cellContent = cell.children[0];
					if(cellContent.innerHTML.includes("images/vue/pj/") && !cellContent.innerHTML.includes("cheval" )) {
						name = cellContent.children[1].getElementsByClassName("titre")[0].innerText;
						imgSrc = cellContent.children[0].src;
						console.log(name);
						if (created.includes(name)) {
							customImg =  "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/char/"+name+".gif";
							cellContent.children[0].src = customImg;
						}
					}
			}
		}	
	}
}
