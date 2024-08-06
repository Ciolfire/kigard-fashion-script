// ==UserScript==
// @name Kigard Fashion Script
// @author Ciol <ciolfire@gmail.com>
// @contributor Saneth
// @contributor Menolly
// @description Un script permettant la personnalisation des icones de personnage sur Kigard.fr.
// @version 28
// @grant GM_addStyle
// @match https://tournoi.kigard.fr/*
// @exclude https://tournoi.kigard.fr/index.php?p=vue*&d=t
// ==/UserScript==

// ============= Activer ou désactiver les pastilles ==================
// ==     Pour le désactiver, mettre à zero la ligne après ce bloc   ==
// == 1: afficher pour personnages sans icone 2: Affichage pour tous ==
// ====================================================================
var battleMode = 1;
// ============= Activer ou désactiver le mode nuit ===================
// ==     Pour le désactiver, mettre à zero la ligne après ce bloc   ==
// ==         Il existe plusieurs niveaux d'obscurité:               ==
// == 1: Nuit (100%) | 2: Crépuscule (50%) | 3: Soirée (25%)| 0: off ==
// ====================================================================
var nightMode = 2;

var clansBack = {
  "[SPA]": '#7dedffc7',
  "[SVG]": '#4D5A56C7',
  "[LDO]": '#a2a2a2c7',
  "[FDD]": 'rgba(255, 255, 255, 0.78)',
  "[VPN]": '#47b930cc',
  "[ASS]": '#4D5A56C7',
  "[LCC]": '#551112C7',
  "[ORI]": '#9E0E40C7',
  "[EOT]": '#4D5A56C7',
  "[LBD]": '#4D5A56C7',
  "[RAP]": 'rgba(79, 187, 39, 0.68)',
  "[LOL]": '#3134ffc7',
  "[LPO]": 'rgba(255, 109, 212, 0.67)',
  "[RFO]": '#ffb300c7',
  "[PDG]": 'rgba(255, 0, 167, 0.75)',
  "[SDA]": 'rgba(38, 110, 132, 0.78)',
  "[LSC]": '#ffb300c7',
  "[ADB]": '#a2a2a2c7',
  "[FEU]": '#ffb300c7',
  "[MCG]": '#a2a2a2c7',
  "[CCS]": 'rgba(0, 0, 0, 0.76)',
  "[LBK]": '#4D5A56C7',
  "[MAG]": '#ffb300c7',
  "[CSI]": 'rgba(128, 130, 62, 0.83)',
  "[NOX]": '#ffb300c7',
  "[CBD]": '#ffb300c7',
  "[CNC]": '#ffb300c7',
  "[TAR]": '#ffb300c7',
  "[DLR]": '#a2a2a2c7',
  "[SAI]": '#4D5A56C7',
  "[CDC]": '#ffb300c7',
  "[CER]": '#ffb300c7',
  "[BIB]": '#ffb300c7',
}

var clansColor = {
  "[SPA]": '#ef32db',
  "[SVG]": 'white',
  "[LDO]": 'rgb(28, 0, 162)',
  "[FDD]": 'rgb(30, 105, 128)',
  "[VPN]": 'white',
  "[ASS]": 'white',
  "[LCC]": 'white',
  "[ORI]": '#FFE436',
  "[EOT]": 'black',
  "[LBD]": '#f49773',
  "[RAP]": 'black',
  "[LOL]": '#ffef00',
  "[LPO]": 'black',
  "[RFO]": 'black',
  "[PDG]": 'black',
  "[SDA]": 'gold',
  "[LSC]": 'black',
  "[ADB]": 'rgba(137, 250, 255)',
  "[FEU]": 'black',
  "[MCG]": '#a20000',
  "[CCS]": 'rgb(255, 108, 0)',
  "[LBK]": '#ff6000',
  "[MAG]": 'black',
  "[CSI]": 'black',
  "[NOX]": 'black',
  "[CBD]": 'black',
  "[CNC]": 'black',
  "[TAR]": 'black',
  "[DLR]": '#d20000',
  "[SAI]": 'pink',
  "[CDC]": 'black',
  "[CER]": 'black',
  "[BIB]": 'black',
}


if (typeof GM_addStyle == 'undefined') {
  this.GM_addStyle = (aCss) => {
    'use strict';
    let head = document.getElementsByTagName('head')[0];
    if (head) {
      let style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = aCss;
      head.appendChild(style);
      return style;
    }
    return null;
  };
}

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
    console.log("list");
    fashionList();
  } else if (page == "clan" && urlParams.get('g') == "membres") {
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
    if (link.nextElementsSibling) {
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
}

function applyFashion() {
  var vue = document.getElementsByTagName("tbody")[0];
  let description = document.getElementsByClassName('description')[0].children[1];
  //let currentLabel = description.getElementsByClassName('profil_popin')[0].innerText;
  //let currentImg = description.getElementsByClassName('vue')[0];

  if (description.getElementsByClassName('profil_popin').length > 0) {
      fashionCharacter(description.getElementsByClassName('profil_popin')[0].innerText, description.getElementsByClassName('vue')[0]);
  }
  if (vue === undefined) {
    return;
  }
  var view = vue.children;

  for (let row of view) {
    for (let cell of row.children) {
      let cellStack = cell.children[0];
      if (cellStack && nightMode > 0 && isNight()) {
        let nightColor= "#122f4070";
        switch (nightMode) {
          case 2:
            nightColor = "#122f4050";
            break;
          case 3:
            nightColor = "#122f4030";
            break;
        }
        let cellType = cellStack.children[0];
        cellStack.children[1].style.backgroundColor = nightColor;
        if (!cellType.classList.contains("brouillard")) {
          cellStack.children[0].style.backgroundColor = nightColor;
          cellType.onmouseout = function() {
            this.style.background="";
            this.style.backgroundColor = nightColor;
          }
        }
      }
      // We only check the cell we can see, it's useless to check anything else
      if (!cell.style.backgroundImage.includes("brouillard") && !cell.className.includes("coord")) {
        // We get what is inside the cell
        let cellContent = cell.children[0];
        // If it's a character...
        if (cellContent.innerHTML.includes("images/vue/pj/")) {
          fashionCell(cellContent);
        } else if (cellContent.innerHTML.includes("images/vue/monstre/17.gif")) {
          fashionHorse(cellContent);
        }
      }
    }
  }
}

function fashionCharacter(name, img) {
  //console.log("fashion character");
  // ... if it has a custom icon then...
  if (customList.includes(name)) {
    let customImg = `${name}.gif`;
    //... if he is mounted we add the horse path
    if (img.src.includes("cheval")) {
      customImg = `horse/${customImg}`;
    }
    customImg = `https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/${period}/${customImg}`;
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

function fashionCell(cell) {
  // we get its name and...
  let name = cell.querySelector(".titre").innerText.trim();
  let img = cell.firstElementChild;
  // ... if it has a custom icon then...
  fashionCharacter(name, img);
  if (battleMode == 2 || !customList.includes(name) && battleMode == 1) {
    let identifier = document.createElement('div');

    identifier.innerHTML = name.charAt(0) + `<span style="font-size:0.25rem;">` + name.charAt(1) + `</span>`;
    identifier.style.zIndex = 2;
    identifier.style.width = '8px';
    identifier.style.height = '8px';
    identifier.style.textAlign = 'center';
    identifier.style.position = 'absolute';
    identifier.style.fontSize = '0.5rem';
    identifier.style.background = getClanBack(cell.getElementsByTagName('small')[0].innerText);
    identifier.style.color = getClanColor(cell.getElementsByTagName('small')[0].innerText);
    identifier.style.borderRadius = '0.25em';
    identifier.style.bottom = '-18px';
    identifier.style.pointerEvents = 'none';
    identifier.style.border = '0.1em solid black';
    identifier.style.fontFamily = 'monospace';
    cell.appendChild(identifier);
  }
}

function getClanColor(clan) {
  if (clansColor[clan]) {
    return clansColor[clan];
  } else {
    return 'black';
  }
}

function getClanBack(clan) {
  if (clansBack[clan]) {
    return clansBack[clan];
  } else {
    return '#ffffffa1';
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
      let empathies = line.children;
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