let currentChampion = null;
let currentSkinIndex = 0;
let latestVersion = '';

async function fetchChampion() {
  const nameInput = document.getElementById('championName').value.trim().toLowerCase();
  if (!nameInput) return alert("Enter a champion name!");

  try {
    const versions = await (await fetch("https://ddragon.leagueoflegends.com/api/versions.json")).json();
    latestVersion = versions[0];

    const allChampsData = await (await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`)).json();
    const allChamps = allChampsData.data;

    const champId = Object.keys(allChamps).find(id => id.toLowerCase() === nameInput);
    if (!champId) throw new Error("Champion not found");

    const champData = await (await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion/${champId}.json`)).json();
    currentChampion = champData.data[champId];
    currentSkinIndex = 0;

    document.getElementById('champName').textContent = currentChampion.name;
    document.getElementById('champBlurb').textContent = currentChampion.blurb;
    document.getElementById('champBlurb').style.display = 'block';

    document.getElementById('champImg').style.display = 'block';
    document.getElementById('prevSkin').style.display = 'block';
    document.getElementById('nextSkin').style.display = 'block';
    document.getElementById('prevBtn').style.display = 'block';
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('skinTitle').style.display = 'block';
    document.getElementById('abilities').style.display = 'flex';

    showSkin();
    showAbilities();

  } catch (err) {
    alert(err.message);
  }
}

function showSkin() {
  if (!currentChampion) return;

  const skin = currentChampion.skins[currentSkinIndex];
  const champImg = document.getElementById('champImg');
  champImg.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChampion.id}_${skin.num}.jpg`;

  document.getElementById('skinTitle').innerHTML = `<strong>${skin.num === 0 ? currentChampion.title : skin.name}</strong>`;

  const prevIndex = (currentSkinIndex - 1 + currentChampion.skins.length) % currentChampion.skins.length;
  const nextIndex = (currentSkinIndex + 1) % currentChampion.skins.length;

  document.getElementById('prevSkin').src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChampion.id}_${currentChampion.skins[prevIndex].num}.jpg`;
  document.getElementById('nextSkin').src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChampion.id}_${currentChampion.skins[nextIndex].num}.jpg`;

  const carousel = document.getElementById('carousel');
  carousel.style.transform = 'translateX(0)';
  setTimeout(() => { carousel.style.transform = 'translateX(0)'; }, 50); // reset animation
}

function prevSkin() {
  currentSkinIndex = (currentSkinIndex - 1 + currentChampion.skins.length) % currentChampion.skins.length;
  showSkin();
}

function nextSkin() {
  currentSkinIndex = (currentSkinIndex + 1) % currentChampion.skins.length;
  showSkin();
}

function showAbilities() {
  const container = document.getElementById('abilities');
  container.innerHTML = '';

  const passive = currentChampion.passive;
  const passiveDiv = document.createElement('div');
  passiveDiv.classList.add('ability');

  const passiveImg = document.createElement('img');
  passiveImg.src = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/passive/${passive.image.full}`;
  passiveImg.alt = passive.name;

  const passiveTooltip = document.createElement('div');
  passiveTooltip.classList.add('tooltip');
  passiveTooltip.innerHTML = `<strong>${passive.name}</strong><br>${passive.description}`;

  passiveDiv.appendChild(passiveImg);
  passiveDiv.appendChild(passiveTooltip);
  container.appendChild(passiveDiv);

  passiveDiv.addEventListener('mouseenter', () => passiveTooltip.style.display = 'block');
  passiveDiv.addEventListener('mouseleave', () => passiveTooltip.style.display = 'none');
  passiveDiv.addEventListener('click', () => {
    passiveTooltip.style.display = passiveTooltip.style.display === 'block' ? 'none' : 'block';
  });

  currentChampion.spells.forEach(spell => {
    const div = document.createElement('div');
    div.classList.add('ability');

    const img = document.createElement('img');
    img.src = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${spell.image.full}`;
    img.alt = spell.name;

    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.innerHTML = `<strong>${spell.name}</strong><br>${spell.description}`;

    div.appendChild(img);
    div.appendChild(tooltip);
    container.appendChild(div);

    div.addEventListener('mouseenter', () => tooltip.style.display = 'block');
    div.addEventListener('mouseleave', () => tooltip.style.display = 'none');
    div.addEventListener('click', () => {
      tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
    });
  });
}

