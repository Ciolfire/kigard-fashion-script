// ==UserScript==
// @name Kigard Fashion Script
// @author Ciol <ciolfire@gmail.com>
// @contributor Saneth
// @contributor Menolly
// @description Un script permettant la personnalisation des icones de personnage sur Kigard.fr.
// @version 9
// @icon icon.png
// @grant none
// @include https://www.kigard.fr/*
// @exclude https://www.kigard.fr/index.php?p=vue*&d=t
// ==/UserScript==

var req = new XMLHttpRequest();
var customList = [];
var date = new Date();
var hour = date.getHours();

req.open("GET", "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/list.json");
req.overrideMimeType("text/plain");
req.addEventListener("load", function() {
  customList = JSON.parse(req.responseText);
  console.log("created");
  if (document.getElementsByTagName("h3")[0].innerHTML.includes("Membres de votre clan")) {
    fashionOwnClan();
  } else if (document.getElementById('page_profil_public') != null) {
    if (document.getElementsByTagName("h3")[1].innerHTML.includes("Membres")) {
      console.log("test");
      fashionClan();
    } else {
      fashionList();
    }
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
            console.log(hour);
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
      let customImg = null;
      if (hour >= 7 && hour <= 18) {
        customImg = encodeURI( "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/day/" + PJ + ".gif") ;
      } else {
        customImg = encodeURI( "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/night/" + PJ + ".gif") ;
      }
      let img = document.evaluate('.//img', line , null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ;
      img.src= customImg;
    }
  }
  /* -- END   : Applique les skins sur la liste des personnages -----*/
}

function fashionClan() {
  /* -- BEGIN : Applique les skins sur la liste des personnages -----*/
  //Récupère la liste des PJ
  let xpath = '//*[@id="page_profil_public"]/table/tbody/tr[*]/td[1]';
  let lines = document.evaluate(xpath, document.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  for (var i=0;i < lines.snapshotLength;i++) {
    let line = lines.snapshotItem(i);
    let PJ = line.textContent.trim();
    if (customList.includes(PJ)) {
      let customImg = null;
      if (hour >= 7 && hour <= 18) {
        customImg = encodeURI( "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/day/" + PJ + ".gif") ;
      } else {
        customImg = encodeURI( "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/night/" + PJ + ".gif") ;
      }
      let img = document.evaluate('.//img', line , null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ;
      img.src= customImg;
    }
  }
  /* -- END   : Applique les skins sur la liste des personnages -----*/
}

function fashionOwnClan() {
  /* -- BEGIN : Applique les skins sur la liste du clan -----*/
  //Récupère la liste des PJ
  var lines = document.getElementsByTagName("td");

  for (let line of lines) {
    if (line.getAttribute("data-title") == "Nom") {
      let name = line.children[1].innerHTML;
      let img = line.children[0];
      // ... if it has a custom icon then...
      if (customList.includes(name)) {
            console.log(hour);
        let customImg = name + ".gif";
        //... if he is mounted we add the horse path
        if (img.src.includes("cheval")) {
          customImg = "horse/" + customImg;
        }
        if (hour >= 7 && hour <= 18) {
          // day icon
          customImg = "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/day/" + customImg;
        } else {
          // night icon
          customImg = "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/night/" + customImg;
        }
        img.setAttribute("dataImage", img.src);
        img.src = customImg;
      }
    }
  }
  /* -- END   : Applique les skins sur la liste du clan -----*/
}

const targetNode = document.getElementsByTagName('body')[0];
const config = { attributes: true, childList: false, subtree: false };

var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    //console.log(mutations, observer);
    fashionList();
    fashionClan();
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(targetNode, config);