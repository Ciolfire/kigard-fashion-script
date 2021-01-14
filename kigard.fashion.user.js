// ==UserScript==
// @name Kigard Fashion Script
// @author Ciol <ciolfire@gmail.com>
// @contributor Saneth
// @contributor Menolly
// @description Un script permettant la personnalisation des icones de personnage sur Kigard.fr.
// @version 5
// @icon icon.png
// @grant none
// @include https://www.kigard.fr/*
// @exclude https://www.kigard.fr/index.php?p=vue*&d=t
// ==/UserScript==

var req = new XMLHttpRequest();
var customList = [];
req.open("GET", "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/list.json");
req.overrideMimeType("text/plain");
req.addEventListener("load", function() {
  customList = JSON.parse(req.responseText);
  // console.log(created);
  if (document.getElementById('page_profil_public') != null) {
    fashionList();
  } else {
    applyFashion();
  }
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
            cellContent.children[0].setAttribute("dataImage", cellContent.children[0].src);
            cellContent.children[0].src = customImg;
          }
        }
      }
    }
  }
}

function fashionList() {
  /* -- BEGIN : Applique les skins sur la liste des personnages -----*/
  //Récupère la liste des PJ
  let xpath = '//*[@id="historique"]/tbody/tr[*]/td[1]';
  let lines = document.evaluate(xpath, document.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  for (var i=0;i < lines.snapshotLength;i++) {
    let line = lines.snapshotItem(i);
    let PJ = line.textContent.trim();
    if (customList.includes(PJ)) {
      let customImg = encodeURI( "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/day/" + PJ + ".gif") ;
      let img = document.evaluate('.//img', line , null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ;
      img.src= customImg;
    }
  }
  /* -- END   : Applique les skins sur la liste des personnages -----*/
}


//window.addEventListener("click", applyFash);
const targetNode = document.getElementsByTagName('body')[0];
const config = { attributes: true, childList: false, subtree: false };

var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    //console.log(mutations, observer);
    fashionList();
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(targetNode, config);