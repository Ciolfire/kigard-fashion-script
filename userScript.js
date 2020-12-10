// ==UserScript==
// @name     Kigard Fashion Script
// @author   Ciol
// @version  1.0.2
// @grant    none
// @include  https://www.kigard.fr/index.php?p=vue*
// @exclude  https://www.kigard.fr/index.php?p=vue*&d=t
// ==/UserScript==

var req = new XMLHttpRequest();
var customList = [];
req.open("GET", "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/list.json");
req.overrideMimeType("text/plain");
req.addEventListener("load", function() {
  customList = JSON.parse(req.responseText);
  // console.log(created);
  applyFashion();
}, false);
req.addEventListener("error", function() {
// Handle error
  // console.log("Error while loading char list");
}, false);

req.send();


function applyFashion() {
  var vue = document.getElementsByTagName("tbody")[0];
  var view = vue.children;

  for (let row of view) {
		for (let cell of row.children) {
      // We only check the cell we can see, it's useless to check anything else
			if (!cell.style.backgroundImage.includes("brouillard") && !cell.className.includes("coord")) {
				// We get what is inside the cell
        let cellContent = cell.children[0];
        // If it's a character...
				if (cellContent.innerHTML.includes("images/vue/pj/")) {
          // we get its name and...
          let name = cellContent.children[1].getElementsByClassName("titre")[0].innerText;
          // ... if it has a custom icon then...
          if (customList.includes(name)) {
            //... if he is mounted we show the horse riding icon
            if (cellContent.innerHTML.includes("cheval" )) {
              // ... But not for now
              // customImg =  "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/horse/"+name+".gif";
              // cellContent.children[0].src = customImg;
            } else {
              // we show the custom icon
              let customImg = "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/char/"+name+".gif";
							cellContent.children[0].src = customImg;
            }
          }
        }
      }
    }
  }
}
