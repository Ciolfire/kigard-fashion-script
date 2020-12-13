// ==UserScript==
// @name     Kigard Fashion Script
// @author   Ciol
// @version  1.0.4
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
  let date = new Date();
  let hour = date.getHours();

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
              let customImg = name + ".gif";
            //... if he is mounted we add the horse path
            if (cellContent.innerHTML.includes("cheval")) {
              customImg = "horse/" + customImg;
            }
            if (hour >= 7 && hour <= 18) {
              // day icon
              customImg = "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/day/" + customImg;
            } else {
              // night icon
              customImg = "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/night/" + customImg;
            }
            cellContent.children[0].src = customImg;
          }
        }
      }
    }
  }
}