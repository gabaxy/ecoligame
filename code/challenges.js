// challenges.js

import { ChallengeEffects } from './parameters.js';

export const challenges = [
  {
    id: 1,
    title: 'TEMPERATŪROS KRITIMAS!',
    message: 'ĮSPĖJIMAS! Sugedo inkubatorius ir petri lėkštutė dabar yra kambario temperatūroje (20°C)! Ką daryti?',
    choices: [
      'Palikti lėkštutę 20°C temperatūroje', 
      'Įjungti atsarginį šildytuvą, kad pakiltų temperatūra bent iki 37°C'
    ],
    correctChoiceIndex: 1,
    correctMessage: 'Teisingas atsakymas! Kologija augs toliau.',
    incorrectMessage: 'Neteisingas atsakymas. Kolonijos augimas sulėtės dvigubai.'
  },
  {
    id: 2,
    title: 'PH DISBALANSAS!',
    message: 'ĮSPĖJIMAS! Pastebėta, jog terpės pH yra 3. Ką daryti?',
    choices: [
      'Įpilti truputį rūgštinio tirpalo',
      'Įpilti truputį šarminio tirpalo'
    ],
    correctChoiceIndex: 1,
    correctMessage: 'Teisingas atsakymas! Kologija augs toliau.',
    incorrectMessage: 'Neteisingas atsakymas. Kolonijos augimas sulėtės dvigubai.'
  },
  {
    id: 3,
    title: 'PH DISBALANSAS!',
    message: 'ĮSPĖJIMAS! Pastebėta, jog terpės pH yra 10. Ką daryti?',
    choices: [
      'Įpilti truputį rūgštinio tirpalo',
      'Įpilti truputį šarminio tirpalo'
    ],
    correctChoiceIndex: 0,
    correctMessage: 'Teisingas atsakymas! Kologija augs toliau.',
    incorrectMessage: 'Neteisingas atsakymas. Kolonijos augimas sulėtės dvigubai.'
  },
  {
    id: 4,
    title: 'TRŪKSTA MAISTO!',
    message: 'ĮSPĖJIMAS! Maistinių medžiagų lygis pasiekė apatinę ribą. Ką pasirinkti?',
    choices: [
      'Papildyti maisto',
      'Nieko nedaryti'
    ],
    correctChoiceIndex: 0,
    correctMessage: 'Teisingas atsakymas! Kologija augs toliau.',
    incorrectMessage: 'Neteisingas atsakymas. Baigėsi maistas...'
  },
  {
    id: 5,
    title: 'TOKSINŲ SUSIDARYMAS!',
    message: 'ĮSPĖJIMAS! Terpėje susidarė šalutinių medžiagų, kurios kenkia bakterijoms. Ką pasirinkti?',
    choices: [
      'Pakeisti maitinamąją terpę',
      'Naudoti chelatorius sunkiųjų metalų šalinimui'
    ],
    correctChoiceIndex: 0,
    correctMessage: 'Teisingas atsakymas! Kologija augs toliau.',
    incorrectMessage: 'Neteisingas atsakymas. Kolonija užkrėsta...'
  },
  {
    id: 6,
    title: 'PLAZMIDĖS ĮTERPIMAS!',
    message: 'ĮSPĖJIMAS! E. coli populiacijai bandoma įterpti atsparumo antibiotikui plazmidę. Kaip elgtis?',
    choices: [
      'Pridėti antibiotiko nedelsiant (patikrinsime atsparumą)',
      'Pirmiausia leisti bakterijoms adaptuotis (inkubuoti be antibiotiko) ir tik vėliau dozuoti antibiotiką'
    ],
    correctChoiceIndex: 1,
    correctMessage: 'Teisingas atsakymas! Kologija augs toliau.',
    incorrectMessage: 'Neteisingas atsakymas. Kolonija dar neatspari atibiotikui...'
  }
];

export function displayChallenge(challenge, onComplete) {
  const modal = document.createElement("div");
  modal.id = "challenge-modal";
  
  const modalContent = document.createElement("div");
  modalContent.classList.add("challenge-modal-content");
  
  const titleElem = document.createElement("h2");
  titleElem.textContent = challenge.title;
  modalContent.appendChild(titleElem);
  
  const messageElem = document.createElement("p");
  messageElem.textContent = challenge.message;
  modalContent.appendChild(messageElem);
  
  const choicesContainer = document.createElement("div");
  choicesContainer.classList.add("challenge-choices");
  
  challenge.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.classList.add("challenge-button");
    btn.addEventListener("click", () => {
      const effect = ChallengeEffects[challenge.id];
      
      if (challenge.id === 1) {
        if (idx !== challenge.correctChoiceIndex) {
          window.thermometer.updateTemperature(20);
          window.temperature = 20;
        } else {
          window.thermometer.updateTemperature(37);
          window.temperature = 37;
        }
      }
      
      choicesContainer.remove();
      
      const resultElem = document.createElement("h3");
      if (idx !== challenge.correctChoiceIndex) {
        resultElem.textContent = challenge.incorrectMessage;
        if (effect.gameOver) {
          window.growthMultiplier = 0;
        } else {
          window.growthMultiplier *= effect.incorrectMultiplier;
          window.hiddenPoints -= effect.points;
        }
      } else {
        resultElem.textContent = challenge.correctMessage;
        window.growthMultiplier *= effect.correctMultiplier;
        window.hiddenPoints += effect.points;
      }
      modalContent.appendChild(resultElem);
      
      const continueBtn = document.createElement("button");
      continueBtn.textContent = "Tęsti";
      continueBtn.classList.add("challenge-button");
      continueBtn.addEventListener("click", () => {
        document.getElementById("game-container").removeChild(modal);
        onComplete();
      });
      modalContent.appendChild(continueBtn);
    });
    choicesContainer.appendChild(btn);
  });
  
  modalContent.appendChild(choicesContainer);
  modal.appendChild(modalContent);
  document.getElementById("game-container").appendChild(modal);
}

export function triggerScheduledChallenges(challengeArray, onComplete) {
  if (challengeArray.length > 0) {
    displayChallenge(challengeArray[0].challenge, () => {
      triggerScheduledChallenges(challengeArray.slice(1), onComplete);
    });
  } else {
    onComplete();
  }
}
