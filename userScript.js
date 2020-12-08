// ==UserScript==
// @name     Kigard Fashion Script
// @author   Ciol
// @version  1.0.0
// @grant    none
// @include  https://www.kigard.fr/index.php?p=vue*
// @exclude  https://www.kigard.fr/index.php?p=vue*&d=t
// ==/UserScript==

var created = [
	"Ciol",
	"Krong",
  "Iracema"
];
var vue = document.getElementsByTagName("tbody")[0];
var table = vue.children;

for (let row of table) {
	for (let cell of row.children) {
		if (!cell.style.backgroundImage.includes("brouillard") && !cell.className.includes("coord")) {
				cellContent = cell.children[0];
				if(cellContent.innerHTML.includes("images/vue/pj/")) {
					name = cellContent.children[1].getElementsByClassName("titre")[0].innerText;
					imgSrc = cellContent.children[0].src;
					console.log(name);
					if (created.includes(name)) {
						customImg =  "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/"+name+".gif";
						cellContent.children[0].src = customImg;
					}
				}
		}
	}	
}
