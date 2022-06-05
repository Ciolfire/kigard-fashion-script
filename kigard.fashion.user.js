// ==UserScript==
// @name Kigard Fashion Script
// @author Ciol <ciolfire@gmail.com>
// @contributor Saneth
// @contributor Menolly
// @description Un script permettant la personnalisation des icones de personnage sur Kigard.fr.
// @version 22
// @icon icon.png
// @grant none
// @match https://tournoi.kigard.fr/*
// @exclude https://tournoi.kigard.fr/index.php?p=vue*&d=t
// ==/UserScript==


var nightMode = true;

//nightMode = false;
// ============= Activer ou désactiver le mode nuit ===================
// == Pour le désactiver, retirer les // en début de ligne au dessus ==
// == L'inverse pour le réactiver, exemple:                          ==
// == "//nightMode = false;" devient  "nightMode = false;"           ==
// ====================================================================


var charReq = new XMLHttpRequest();
var horseReq = new XMLHttpRequest();
var customList = [];
var horseList = [];
var date = new Date();
var hour = date.getHours();
var period = "day";
if (isNight()) {
  period = "night";
}

horseReq.open("GET", "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/list.horse.json");
horseReq.overrideMimeType("text/plain");
horseReq.onload = function() {
  horseList = JSON.parse(horseReq.responseText);
}

horseReq.send();

charReq.open("GET", "https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/list.json");
charReq.overrideMimeType("text/plain");
charReq.onload = function() {
  customList = JSON.parse(charReq.responseText);
  // console.log(customList);
  // console.log(horseList);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const page = urlParams.get('p')
  if (document.getElementsByTagName("h3")[0].innerHTML.includes("Liste des personnages")) {
    //console.log("list");
    fashionList();
  } else if (page == "clan" && urlParams.get('g') == "membres") {
    //console.log("propre clan");
    fashionOwnClan();
  } else if ((document.getElementsByTagName("h3")[1]) && document.getElementsByTagName("h3")[1].innerHTML.includes("Membres")) {
    //console.log("clan");
    fashionClan();
  } else if (document.getElementById("page_profil_public")) {
    //console.log("profile");
    fashionLinks();
  } else {
    //console.log("default");
    applyFashion();
  }
};

charReq.send();

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
      let customImg = `${name}.gif`;
      //... if he is mounted we add the horse path
      if (link.src.includes("cheval")) {
        customImg = `horse/${customImg}`;
      }
      customImg = `https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/${period}/${customImg}`;
      link.src = customImg;
    }
  }
}

function applyFashion() {
  var vue = document.getElementsByTagName("tbody")[0];
  if (vue === undefined) {
    return;
  }
  var view = vue.children;

  for (let row of view) {
    for (let cell of row.children) {
      let cellStack = cell.children[0];
      if (cellStack && nightMode && isNight()) {
        console.log(cellStack.children[0]);
        let cellType = cellStack.children[0];
        cellStack.children[1].style.backgroundColor = "#122f4091";
        if (!cellType.classList.contains("brouillard")) {
          cellStack.children[0].style.backgroundColor = "#122f4091";
          cellType.onmouseout = function() {this.style.background="";this.style.backgroundColor = "#122f4091";}
        }
      }
      // We only check the cell we can see, it's useless to check anything else
      if (!cell.style.backgroundImage.includes("brouillard") && !cell.className.includes("coord")) {
        // We get what is inside the cell
        let cellContent = cell.children[0];
        // If it's a character...
        if (cellContent.innerHTML.includes("images/vue/pj/")) {
          fashionCharacter(cellContent);
        } else if (cellContent.innerHTML.includes("images/vue/monstre/17.gif")) {
          fashionHorse(cellContent);
        }
      }
    }
  }
}

function fashionCharacter(cell) {
  // we get its name and...
  let name = cell.querySelector(".titre").innerText.trim();
  // ... if it has a custom icon then...
  if (customList.includes(name)) {
    let customImg = `${name}.gif`;
    //... if he is mounted we add the horse path
    if (cell.innerHTML.includes("cheval")) {
      customImg = `horse/${customImg}`;
    }
    customImg = `https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/${period}/${customImg}`;
    let img = cell.firstElementChild;
    img.setAttribute("dataImage", img.src);
    img.src = customImg;
    img.onerror = (e) => {
      if (img.getAttribute("dataImage") != null) {
        img.src = img.getAttribute("dataImage");
        img.setAttribute("dataImage", null);
      }
    }
  }
}

function fashionHorse(cell) {
  let owner = cell.lastElementChild.getElementsByTagName("small");
  // We check if the horse has an owner
  if (owner.length) {
    // if so, we get the name and check if he has a custom horse
    let name = owner[0].innerText;
    name = name.slice(1, name.length-1);
    if (horseList.includes(name)) {
      let img = cell.firstElementChild;
      img.setAttribute("dataImage", img.src);
      img.src = `https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/horse/${name}.gif`;
      img.onerror = (e) => {
        if (img.getAttribute("dataImage") != null) {
          img.src = img.getAttribute("dataImage");
          img.setAttribute("dataImage", null);
        }
      }
    } else {
      //console.log(owner + " not in the list.");
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
      let customImg = encodeURI(`https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/${period}/${PJ}.gif`);
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
      let img = document.evaluate('.//img', line , null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ;
      if (img.src.includes("cheval")) {
        horse = "horse/";
      }
      img.src= encodeURI(`https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/${period}/${horse}${PJ}.gif`);
    }
  }
  /* -- END   : Applique les skins sur la liste des personnages -----*/
}

function fashionOwnClan() {
  /* -- BEGIN : Applique les skins sur la liste du clan -----*/
  //Récupère la liste des PJ
  let lines = document.getElementsByTagName("td");
  for (let line of lines) {
    let name = "";
    let img = "";
    if (line.getAttribute("data-title") == "Nom" || line.getAttribute("colspan") == 3) {
      if (line.getAttribute("colspan") == 3) {
        name = line.children[1].innerText;
        img = line.children[0];
      } else {
        name = line.children[0].children[1].innerText;
        img = line.children[0].children[0].children[0];
      }
      // ... if it has a custom icon then...
      if (customList.includes(name)) {
        let customImg = name + ".gif";
        //... if he is mounted we add the horse path
        if (img.src.includes("cheval")) {
          customImg = "horse/" + customImg;
        }
        customImg = `https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/${period}/${customImg}`;
        img.setAttribute("dataImage", img.src);
        img.src = customImg;
      }
    } else if (line.getAttribute("data-title") == "Empathie") {
      let empathies = line.children[0].children;
      for (let empathie of empathies) {
        if (empathie.title != "" && empathie.href.includes("pj")) {
          let name = empathie.title;
          let img = empathie.children[0];

          if (customList.includes(name)) {
            let customImg = `${name}.gif`;
            //... if he is mounted we add the horse path
            if (img.src.includes("cheval")) {
              customImg = `horse/${customImg}`;
            }
            customImg = `https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/${period}/${customImg}`;
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