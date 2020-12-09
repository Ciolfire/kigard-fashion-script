// run this on https://www.kigard.fr/liste_pj.php

links = document.getElementsByClassName("profil_popin");
userList = "";
for (let user of links) {
//console.log(user);
	if (user.href.includes("pj")) {
			if (userList != "") {
			userList += ", ";
		}
		userList += user.innerHTML.replace(/[^a-zA-Z0-9]/g,'');
}

}
