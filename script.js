/*
  Ben der Wichtel Wichtel
  by Ortwin Roth
*/

// -- Selectors ----------------------------------------------------------------

const wichtelAddButton = document.querySelector(".wichtel-add .add");
const newWichtel = document.querySelector(".wichtel-add .newWichtel");

const wichtelButton = document.querySelector("button.submit");
const wichtelBlock = document.querySelector(".wichtel-form");
const wichtelBlockList = document.querySelector(".wichtel-form .wichtel-list");

const wichtelPartnerBlock = document.querySelector(".wichtel-partner");
const wichtelPartnerList = document.querySelector(".wichtel-partner .wichtel-list");
const returnButton = document.querySelector("button.return");

// -- Event Listeners ----------------------------------------------------------
wichtelAddButton.addEventListener("click", addWichtel);
newWichtel.addEventListener("keypress", addWichtel);

wichtelBlockList.addEventListener("click", removeWichtel);
wichtelButton.addEventListener("click", drawPairs);

returnButton.addEventListener("click", returnToList);

// -- Logik --------------------------------------------------------------------

function addWichtel(e) {
  if (e instanceof MouseEvent || e.key === 'Enter') {
    // Stope das neu laden der Seite
    event.preventDefault();
    wichtelBlockList.innerHTML += getWichtelLine(newWichtel.value);
    newWichtel.value = "";
  }
}

function removeWichtel(e) {
  let element = e.target;
  if(element.classList[0] === "remove") {
    element.parentElement.remove();
  }
}

function returnToList() {
  wichtelBlock.style.display = "block";  
  wichtelPartnerBlock.style.display = "none";
}

/*
  Lost die Wichtel-Partner aus.
*/
function drawPairs(event) {
  // Stope das neu laden der Seite
  event.preventDefault();
  console.log("Lets wichtel !");

  try {
    let wichtelList = getWichtel();
    let wichtelAssignments = null;
    do {
      try {
        wichtelAssignments = mapWichtel(wichtelList);
      } catch (error) {
        if(error instanceof LastOneLeftExeption){
          wichtelAssignments = false;
          console.log(" Last one left - nochmal ")
        } else {
          throw error;
        }
      }
    } while(wichtelAssignments == false);
    console.log(wichtelAssignments);

    showResults(wichtelAssignments)

    console.log("Frohes schenken")
  } catch (e) {
    console.log(e.message);
  }
}

/*
  List die Wichtel-Teilnehmer aus den Input-Feldern.
*/
function getWichtel() {
  let wichtelList = [];
  let wichtelInput = document.querySelectorAll(".wichtel-form .wichtel");
  for (const input of wichtelInput) {
    wichtelList.push(input.textContent);
  }
  return wichtelList;
}

/*
  Ordnet jedem telnehmer einen partner zu.
*/
function mapWichtel(wichtelList){
  let wichtelAssignments = new Map();
  let partnerList = Array.from(wichtelList)
  for (const wichtel of wichtelList){
    let partner = findWichtelPartner(wichtel, partnerList);
    wichtelAssignments.set(wichtel, partner);
  }
  return wichtelAssignments;
}

/* 
  Findet einen Wichtel-Partner der den Anforderungen entspricht
  - Partner muss anders heißen als empfänger wichtel.
  - Partner darf noch keinen anderen beschenken

  Um nicht unendlich zu suchen ist die Anzahl der Versuche 
  einen Partner zu finden auf 100 beschränkt. 
*/
function findWichtelPartner(wichtel, wichtelList) {
  console.log(wichtelList)

  let index = 0;
  let match = "";
  let tries = 0;

  do {
    index = Math.floor(Math.random() * wichtelList.length);
    match = wichtelList[index];
    tries++;    
    console.log(`Wichtel : ${wichtel} | Partner : ${match}`);
  } while(match == wichtel && tries < 100);

  if(match == ""){
    throw new CantPairExeption(wichtel);
  }

  if(match == wichtel){
    throw new LastOneLeftExeption();
  }

  wichtelList.splice(index, 1)
  return match;
}

// -- Display ------------------------------------------------------------------

function showResults(wichtelAssignments) {
  wichtelPartnerList.innerHTML = "";
  for (const pair of wichtelAssignments) {
    wichtelPartnerList.innerHTML += getAssignmentLine(pair[0],pair[1]);
    wichtelPartnerList.innerHTML += "\n"
  }
  wichtelBlock.style.display = "none";  
  wichtelPartnerBlock.style.display = "block";
}

// -- Templates ----------------------------------------------------------------

function getAssignmentLine(wichtel, partner) {
  let template = [
    `<li>`,
      `<span class="person material-icons">person</span>`,
      `<span class="wichtel">${wichtel}</span>`,
      `<span class="material-icons">card_giftcard</span>`,
      `<span class="material-icons">arrow_right</span>`,
      `<span class="partner">${partner}</span>`,
    `</li>`
  ]
  return template.join("\n");
}

function getWichtelLine(wichtel){  
  let template = [
    `<li>`,
      `<span class="person material-icons">person</span>`,
      `<span class="wichtel">${wichtel}</span>`,
      `<span class="remove material-icons">remove_circle_outline</span>`,
    `</li>`
  ]
  return template.join("\n");
}

// -- Exceptions ---------------------------------------------------------------

function CantPairExeption(name) {
  this.message = "Can't find match for " + name;
  this.name = "Can't pair exeption"
}

function LastOneLeftExeption() {
  this.message = "Only one person left to match";
  this.name = "Last one left exception"
}