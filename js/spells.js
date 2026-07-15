// Spell library — mirrors SpellLibrary.swift and SpellPlayer.swift from the iOS app.
// Filenames match exactly what is in the audio/ folder.

const SPELLS = [
  { id: 'abracadabra',  name: 'Abracadabra!',                          female: ['abracadabra-female.mp3'],                       male: ['abracadabra-male.mp3'],                                weight: 4 },
  { id: 'hocus-pocus',  name: 'Hocus Pocus!',                          female: ['hocus-female.mp3'],                             male: ['Hocus-male.mp3'],                                      weight: 4 },
  { id: 'expelliarmus', name: 'Expelliarmus!',                         female: ['expelliarmus-female.mp3'],                      male: ['expelliarmus.mp3'],                                    weight: 6 },
  { id: 'wingardium',   name: 'Wingardium Leviosa!',                   female: ['wingerdium-female.mp3'],                        male: ['wingardium-male.mp3'],                                 weight: 6 },
  { id: 'avada',        name: 'Avada Kedavra!',                        female: ['Avada-female.mp3'],                             male: ['avada-male.mp3'],                                      weight: 4 },
  { id: 'expecto',      name: 'Expecto Patronum!',                     female: ['expecto-female.mp3'],                           male: ['expecto-male.mp3'],                                    weight: 6 },
  { id: 'alohomora',    name: 'Alohomora!',                            female: ['alohomora-female.mp3'],                         male: ['alohomora-male.mp3'],                                  weight: 6 },
  { id: 'accio',        name: 'Accio!',                                female: ['accio-female.mp3'],                             male: ['accio-male.mp3'],                                      weight: 6 },
  { id: 'lumos',        name: 'Lumos!',                                female: ['lumos-female.mp3'],                             male: ['lumas-male.mp3'],                                      weight: 4 },
  { id: 'riddikulus',   name: 'Riddikulus!',                           female: ['ridikulus-female.mp3'],                         male: ['riddikulus-male.mp3'],                                 weight: 4 },
  { id: 'stupefy',      name: 'Stupefy!',                              female: ['stupefy-female.mp3'],                           male: ['stupefy-male.mp3'],                                    weight: 6 },
  { id: 'hex',          name: 'Hex! Hex!',                             female: ['hex-female.mp3'],                               male: ['hex-male.mp3'],                                        weight: 4 },
  { id: 'muggle',       name: 'Start believing, you Muggle.',          female: ['believe-female.mp3'],                           male: ['start-male.mp3'],                                      weight: 0 },
];

// Returns every unique audio filename across all spells, used for preloading.
function getAllAudioFilenames() {
  const all = [];
  SPELLS.forEach(s => all.push(...s.female, ...s.male));
  return [...new Set(all)];
}

// Selects the next spell and resolves which audio file to play.
// Mirrors selectSpell() + resolvedAudioFileName() from SpellPlayer.swift.
//
// lastId:              id of the last spell cast (to avoid repeating it)
// lastVoiceWasFemale:  whether the last mixed-mode cast used a female file
// voiceStyle:          'female' | 'male' | 'mixed'
// forcedId:            optional spell id that bypasses weighted selection
//
// Returns: { spell, filename, nextVoiceWasFemale }
function selectSpell(lastId, lastVoiceWasFemale, voiceStyle, forcedId = null) {
  const forcedSpell = forcedId ? SPELLS.find(s => s.id === forcedId) : null;
  let spell;

  if (forcedSpell) {
    spell = forcedSpell;
  } else {
    // 1. Exclude the last spell so the same one never plays twice in a row
    const eligible = SPELLS.filter(s => s.id !== lastId);
    const pool = eligible.length > 0 ? eligible : SPELLS;

    // 2. Build a weighted pool from spells that remain in random rotation
    const weighted = [];
    pool.forEach(s => {
      for (let i = 0; i < s.weight; i++) weighted.push(s);
    });

    // 3. Pick randomly
    spell = weighted[Math.floor(Math.random() * weighted.length)];
  }

  // 4. Resolve the audio filename based on voice style
  let filename;
  let nextVoiceWasFemale = lastVoiceWasFemale;

  if (voiceStyle === 'female') {
    filename = spell.female[0] ?? spell.male[0];
    nextVoiceWasFemale = true;
  } else if (voiceStyle === 'male') {
    filename = spell.male[0] ?? spell.female[0];
    nextVoiceWasFemale = false;
  } else {
    // mixed: alternate gender each cast, mirroring lastMixedVoiceWasFemale in SpellPlayer.swift
    const useFemale = !lastVoiceWasFemale;
    filename = useFemale
      ? (spell.female[0] ?? spell.male[0])
      : (spell.male[0] ?? spell.female[0]);
    nextVoiceWasFemale = useFemale;
  }

  return { spell, filename, nextVoiceWasFemale };
}
