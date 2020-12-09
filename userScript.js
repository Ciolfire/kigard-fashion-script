// ==UserScript==
// @name     Kigard Fashion Script
// @author   Ciol
// @version  1.0.0
// @grant    none
// @include  https://www.kigard.fr/index.php?p=vue*
// @exclude  https://www.kigard.fr/index.php?p=vue*&d=t
// ==/UserScript==

var created = [
  "Abeline", "Acirion", "Agaz", "Ahnubis", "Akfar", "Akhille", "Akurion", "Alari", "Alhena", "Althea", "Alyan", "Amfortas", "Anskygard", "Archibald", "Arkann", "Artellia", "Arthas", "Asha", "Asumbrax", "Aurea", "Azel Cagus", "Azerwhite", "Azharh", "Azuka", 
  "Bayork", "Ber83", "Bermazh", "Berthus", "Berurier", "Bignedulf", "Bobernocle", "Bolofort Poignefer", "Boubasilou", "Brechnar", "Bryn", 
  "Calamondin", "Calavera", "Calyso", "Chimay", "Chouwy", "Chut", "Cigue", "Ciol", "Coccolitho", "Cornelir", "Couic", "Crapuscule", "Cri Rauque", "Crorbak", "Cryo", "Crystalis Telmor", "Cys", 
  "Daktirak", "Dana", "Darktoto", "Darktotor51", "Deario", "Delfy", "Delphine Talaron", "Diemar", "Divodurum", "Djack", "Dragnarr", "Drakan", "Dromokar", "Du Serpentaire", "Duagloth", 
  "El Noreu", "Elebana", "Elhokar", "Elween", "Elwyn", "Emmy", "Ender", "Entysp", "Ermengarde", "Eryk", "Esraia", "Euline", "Eurynome", "Exterminateur", 
  "Fata", "Feliann", "Felsen", "Feltin", "Fergal", "Frappadielle", "Frelwann", "Fumble", 
  "Garlik", "Gautier", "Genkialpha", "Giligili", "Gnonpom", "Grincheux", "Grismouss", "Grok", "Grokh", "Grombaril", "Grondella", "Grumpoch", "Guryknahag", 
  "Harper", "Hedlam", "Hoplite", "Huguard Laveugle", 
  "Iarnvidia", "Iorimir Staern", "Iracema", "Iris", "Isil", 
  "Jack", "Jaram E Fabk", "Jeanine", "Jerome", 
  "Kailoms", "Kaoss", "Kara Whooshstaff", "Kharna", "Khrao", "King", "Knauxe Renardefer", "Kolloceus", "Kraan", "Krong", "Kurtil", 
  "La Peste", "Laclemanus", "Lacoolo", "Lagavulin", "Lainy", "Lajs", "Lalwende", "Laweln", "Lecahtzart", "Lettiv", "Lhyra", "Linayla", "Linfus Le Terrible", "Lokk", "Louis", "Loulou44", "Lucrecia", 
  "Maclou", "Magnus", "Mar1", "Marcos", "Margaery", "Marisol", "Meeren", "Melmoth", "Menolly", "Mes Bottes", "Michelle", "Mihnea", "Milsabor", "Mini Fantome", "Mirliton", "Mmcmerlin", "Montenai", "Moonaker", "Mordric", "Mordurech", "Mox Onos", "Mugen", "Mulot1980", "Myrina", "Mystopath", 
  "Naivive", "Nandil", "Nashiita", "Neijh", "Nerf", "Nobinoub", "Noknok", "Nostelouga", "Nugrak", "Nuts", 
  "Octo", "Ohcoatl", "Olikea", "Olympe Des Bouges", "Oncle Fur", "Ora", "Orphee", "Otanbarg", "Ozz", 
  "Pandora", "Pella Tart", "Penhad", "Perecheper", "Perval", "Pirom", "Pookikrott", "Pouf", "Psyk Edelik", "Pumakh", 
  "Rage", "Ragna", "Raoul", "Razorbak", "Rohen", 
  "Safel", "Saneth", "Sayrann", "Selttiks", "Shakgut Nazshak", "Shamanork", "Sidherol", "Silcem", "Skarlan", "Skeudic", "Sneni", "Sokek", "Soras", "Starckdarkmoon", "Swifty", 
  "Talacht", "Tallandar", "Talona", "Tegnus", "Tetedepioche", "Tguillaume", "Thay", "Thylen", "Tictac", "Tikk", "Timor", "Tinka", "Titcry", "Tkeeper", "Toniglandil", "Torgnuf", "Totovk", "Trohk", "Tutur05", 
  "Uen Yoron", "Ulmo", "Untypcool", "Urkuk", 
  "Von Falken", 
  "Whitedwarf", "Wismer", "Wurmmf", "Wushhhhhhh", 
  "Xam", "Xarcan", 
  "Yasuro", "Yehon", "Ylahad", "Ysalia", "Ysdilia", 
  "Zetincelle", "Ziegfreud", "Zora"
];

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

applyFashion();
