// ==UserScript==
// @name Kigard Fashion Script
// @author Ciol <ciolfire@gmail.com>
// @contributor Saneth
// @contributor Menolly
// @description Un script permettant la personnalisation des icones de personnage sur Kigard.fr.
// @version 12
// @icon icon.png
// @grant none
// @include https://www.kigard.fr/*
// @exclude https://www.kigard.fr/index.php?p=vue*&d=t
// ==/UserScript==


var nightMode = false;
//nightMode = true;
// ============= Activer ou désactiver le mode nuit ===============
// == Pour l'activer, retirer les // en début de ligne au dessus ==
// == L'inverse pour le désactiver, exemple:                     ==
// == "//nightMode = true;" devient  "nightMode = true;"         ==
// ================================================================


var req = new XMLHttpRequest();
var customList = [];
var date = new Date();
var hour = date.getHours();

req.open("GET", "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/list.json");
req.overrideMimeType("text/plain");
req.addEventListener("load", function() {
  customList = JSON.parse(req.responseText);
  //console.log("created");
  if (document.getElementsByTagName("h3")[0].innerHTML.includes("Liste des personnages")) {
    console.log("list");
    fashionList();
  } else if (document.getElementsByTagName("h3")[0].innerHTML.includes("Membres de votre clan")) {
    console.log("propre clan");
    fashionOwnClan();
  } else if ((document.getElementsByTagName("h3")[1]) && document.getElementsByTagName("h3")[1].innerHTML.includes("Membres")) {
    console.log("clan");
    fashionClan();
  } else if (document.getElementById("page_profil_public")) {
    console.log("profile");
    fashionLinks();
  } else {
    console.log("default");
    applyFashion();
  }
}, false);
req.addEventListener("error", function() {
// Handle error
  // console.log("Error while loading char list");
}, false);

req.send();

function isNight() {
  if (hour >= 7 && hour <= 18) {
    //console.log("day");
    return false;
  }
  //console.log("night");
  return true;
}

function fashionLinks() {
  let links = document.getElementsByClassName("pj_clan");
  for (let link of links) {
    var name = link.nextElementSibling.innerText.split("avec ")[1];
    if (customList.includes(name)) {
      let customImg = name + ".gif";
      //... if he is mounted we add the horse path
      if (link.src.includes("cheval")) {
        customImg = "horse/" + customImg;
      }
      if (isNight()) {
        // night icon
        customImg = "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/night/" + customImg;
      } else {
        // day icon
        customImg = "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/day/" + customImg;
      }
      link.src = customImg;
    }
  }
}

function applyFashion() {
  var vue = document.getElementsByTagName("tbody")[0];
  var view = vue.children;

  for (let row of view) {
    for (let cell of row.children) {
      if (cell.children[0] && nightMode && isNight()) {
        cell.children[0].children[0].style.backgroundColor = "#122f4091";
        cell.children[0].children[0].onmouseout = function() {this.style.background="";this.style.backgroundColor = "#122f4091";}
      }
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
            if (isNight()) {
              // night icon
              customImg = "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/night/" + customImg;
            } else {
              // day icon
              customImg = "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/day/" + customImg;
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
      if (isNight()) {
        customImg = encodeURI( "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/night/" + PJ + ".gif");
      } else {
        customImg = encodeURI( "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/day/" + PJ + ".gif");
      }
      let img = document.evaluate('.//img', line , null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      img.src= customImg;
    }
  }
  /* -- END   : Applique les skins sur la liste des personnages -----*/
}

function fashionClan() {
  /* -- BEGIN : Applique les skins sur la liste des personnages du clan -----*/
  //Récupère la liste des PJ
  let xpath = '//*[@id="page_profil_public"]/table/tbody/tr[*]/td[1]';
  let lines = document.evaluate(xpath, document.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  for (var i=0;i < lines.snapshotLength;i++) {
    let line = lines.snapshotItem(i);
    let PJ = line.textContent.trim();
    if (customList.includes(PJ)) {
      let customPath = null;
      let horse = "";
      if (isNight()) {
        customPath = "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/day/";
      } else {
        customPath = "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/night/";
      }
      let img = document.evaluate('.//img', line , null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ;
      if (img.src.includes("cheval")) {
        horse = "horse/";
      }
      img.src= encodeURI(customPath + horse + PJ + ".gif");
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
        let customImg = name + ".gif";
        //... if he is mounted we add the horse path
        if (img.src.includes("cheval")) {
          customImg = "horse/" + customImg;
        }
        if (isNight()) {
          // night icon
          customImg = "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/night/" + customImg;
        } else {
          // day icon
          customImg = "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/day/" + customImg;
        }
        img.setAttribute("dataImage", img.src);
        img.src = customImg;
      }
    } else if (line.getAttribute("data-title") == "Empathie") {
      let empathies = line.children[0].children;
      for (let empathie of empathies) {
        if (empathie.title != "" && empathie.href.includes("pj")) {
          let name = empathie.title;
          let img  = empathie.children[0];
          
          if (customList.includes(name)) {
            let customImg = name + ".gif";
            //... if he is mounted we add the horse path
            if (img.src.includes("cheval")) {
              customImg = "horse/" + customImg;
            }
            if (isNight()) {
              // night icon
              customImg = "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/night/" + customImg;
            } else {
              // day icon
              customImg = "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/day/" + customImg;
            }
            img.setAttribute("dataImage", img.src);
            img.src = customImg;
          }
        }
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
  fashionLinks();
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(targetNode, config);