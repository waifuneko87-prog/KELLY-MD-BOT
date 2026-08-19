/**
 * .character0 <name>
 * Free Fire character database — fully local, no API keys.
 * Example: .character0 kelly
 */

const CHARACTERS = {
  kelly: {
    name: 'Kelly',
    realName: 'Shimada Kiriko',
    gender: 'Female',
    age: 17,
    birthday: 'April 1',
    occupation: 'High-school track sprinter / Student',
    role: 'Rusher / Mobility',
    abilityType: 'Passive',
    abilityName: 'Dash (Deadly Velocity)',
    ability: 'Permanently increases sprint speed. Always active while sprinting — no button, no cooldown.',
    maxEffect: 'Sprint speed +6% at max level.',
    awaken: 'After sprinting continuously for 4 seconds, the first shot on a target deals up to 106% damage (lasts 5s).',
    levels: [
      'Lv1: +1% sprint',
      'Lv2: +2% sprint',
      'Lv3: +3% sprint',
      'Lv4: +4% sprint',
      'Lv5: +5% sprint',
      'Lv6: +6% sprint (max)'
    ],
    lore: 'A school track star. Childhood was happy with adopted-mom Rena and step-dad Andrew. After their divorce she stayed close to Andrew. Track coach discovered her talent and she became the school star. On the island she must keep running no matter the obstacle. Motto: Keep Running! KIRIKO!',
    tips: 'Best for aggressive flanks, early looting, and escaping zone. Pair with SMG/Shotgun. Awakened form rewards long sprints before engaging.',
    price: 'Often free at account level 15 / ~200–499 Diamonds or gold when on sale'
  },

  alok: {
    name: 'Alok (DJ Alok)',
    realName: 'Alok',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: 'World-famous DJ',
    role: 'Support / Team utility',
    abilityType: 'Active',
    abilityName: 'Drop the Beat',
    ability: 'Creates a ~5m aura that heals allies and boosts movement speed. Effects do not stack.',
    maxEffect: 'Heal ~5 HP/s + movement speed boost for up to ~10s. Cooldown around 45s (varies with Skill Boost).',
    awaken: 'Skill Boost options (Heal Remix / Drop Zone) further improve heal or speed in ranked.',
    levels: ['Scales heal duration and speed bonus with level / Skill Boost'],
    lore: 'Brazilian DJ who uses the power of music. Left Brazil and traveled the world. Name means light.',
    tips: 'Core squad pick. Pop during pushes, rotations, and revives. Best in full squads.',
    price: '~599 Diamonds'
  },

  chrono: {
    name: 'Chrono',
    realName: 'Chrono',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: 'Bounty hunter (other universe lore)',
    role: 'Tank / Defense',
    abilityType: 'Active',
    abilityName: 'Time Turner',
    ability: 'Creates a force field that blocks a large amount of incoming damage. Movement speed increases while inside.',
    maxEffect: 'Blocks high damage (historically 600–1000 depending on patch). Duration and CD change with balance updates.',
    awaken: 'Skill Boost (Time Veil / Time Drift) available in current meta.',
    levels: ['Duration, damage blocked, and ally speed scale with level / patches'],
    lore: 'Bounty hunter from another universe.',
    tips: 'Pop to tank damage while reviving or holding angle. Strong in final circles and Clash Squad.',
    price: '~500 Diamonds'
  },

  hayato: {
    name: 'Hayato',
    realName: 'Hayato Yagami',
    gender: 'Male',
    age: 'Young adult',
    birthday: '—',
    occupation: 'Samurai lineage',
    role: 'Assault / Clutch',
    abilityType: 'Passive',
    abilityName: 'Bushido',
    ability: 'Armor penetration increases as your HP decreases. The lower your health, the more armor you shred.',
    maxEffect: 'Significant armor pen at low HP (scales per 10% HP lost).',
    awaken: 'Awakened form strengthens the pen scaling and fight potential at critical HP.',
    levels: ['Armor pen scales with missing HP'],
    lore: 'Only son of a legendary samurai family. Must carry tradition and its curse.',
    tips: 'Aggressive fighter. Combine with heals so you can stay effective at mid-low HP.',
    price: 'Store / events'
  },

  dimitri: {
    name: 'Dimitri',
    realName: 'Dimitri',
    gender: 'Male',
    age: 26,
    birthday: 'May 26',
    occupation: 'Sound technology engineer',
    role: 'Support / Healer',
    abilityType: 'Active',
    abilityName: 'Healing Heartbeat',
    ability: 'Creates a healing zone. User and allies recover HP over time. Downed players in zone can self-recover.',
    maxEffect: 'Strong AoE heal; self-revive potential for downed allies. CD historically high (~85s).',
    awaken: '—',
    levels: ['Heal rate and zone utility scale with level'],
    lore: 'World-renowned sound tech engineer. Elder brother of Thiva. Hobby: action movies.',
    tips: 'Best pure healer for squads. Place zone on downed teammates to clutch revives.',
    price: '~599 Diamonds'
  },

  wukong: {
    name: 'Wukong',
    realName: 'Wukong',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: 'Trickster / fighter',
    role: 'Stealth / Ambush',
    abilityType: 'Active',
    abilityName: 'Camouflage',
    ability: 'Transforms into a bush. Hard to spot. Transformation ends when you attack. CD resets on takedown (rules vary by patch).',
    maxEffect: 'Bush form for several seconds; CD reduced after kills in many patches.',
    awaken: 'Skill Boost available in some seasons.',
    levels: ['Duration and CD change with balance patches'],
    lore: 'Inspired by the Monkey King — disguise and surprise.',
    tips: 'Ambush tool. Sit near loot paths or doors. Attack only when ready to commit.',
    price: '~249 Diamonds'
  },

  k: {
    name: 'K (Captain / Kamir)',
    realName: 'K',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: 'Tactician',
    role: 'Support / Hybrid',
    abilityType: 'Active (toggle modes)',
    abilityName: 'Master of All / Psych Professor',
    ability: 'Two modes: one boosts EP conversion/regen for allies, the other focuses self HP recovery from EP.',
    maxEffect: 'Strong EP↔HP economy for late game sustain.',
    awaken: '—',
    levels: ['Mode effectiveness scales'],
    lore: 'All-rounder professor-type fighter.',
    tips: 'Flexible support. Switch modes based on fight phase.',
    price: 'Store / events'
  },

  kassie: {
    name: 'Kassie',
    realName: 'Kassie',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Support / Single-target heal',
    abilityType: 'Active',
    abilityName: 'Electro Therapy',
    ability: 'Creates a healing link with a nearby teammate. Can also deliver a burst heal.',
    maxEffect: 'Steady heal link + instant ally heal option.',
    awaken: 'Skill Boost available.',
    levels: ['Heal values scale'],
    lore: 'Support-focused character for duo/squad clutch heals.',
    tips: 'Link your entry fragger. Save burst heal for critical moments.',
    price: 'Store / events'
  },

  antonio: {
    name: 'Antonio',
    realName: 'Antonio',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: 'Gangster archetype',
    role: 'Tank / Frontline',
    abilityType: 'Passive',
    abilityName: "Gangster's Spirit",
    ability: 'Starts the match with extra HP.',
    maxEffect: 'Flat bonus max HP at round start (value scales with level historically).',
    awaken: '—',
    levels: ['Extra starting HP increases with level'],
    lore: 'Tough street fighter with gangster spirit.',
    tips: 'Simple tank entry. Good for beginners who want more HP pool.',
    price: '~499 Diamonds / gold'
  },

  caroline: {
    name: 'Caroline',
    realName: 'Caroline',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Close-range rusher',
    abilityType: 'Passive',
    abilityName: 'Agility',
    ability: 'Increased movement speed while holding a shotgun.',
    maxEffect: 'Noticeable speed when shotgun is equipped.',
    awaken: '—',
    levels: ['Speed bonus scales'],
    lore: 'Shotgun specialist mobility character.',
    tips: 'Pair with M1887 / SPAS. Rush buildings and close space fast.',
    price: 'Store / gold'
  },

  clu: {
    name: 'Clu',
    realName: 'Clu',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: 'Tracker',
    role: 'Recon / Intel',
    abilityType: 'Active',
    abilityName: 'Tracing Steps',
    ability: 'Reveals positions of enemies who are not prone/crouching in a radius.',
    maxEffect: 'Intel pulse — strong for pre-aim and rotations.',
    awaken: '—',
    levels: ['Radius / duration scale'],
    lore: 'Information specialist.',
    tips: 'Use before pushing compounds. Information wins fights.',
    price: '~249 Diamonds'
  },

  dasha: {
    name: 'Dasha',
    realName: 'Dasha',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: 'Party / athlete vibe',
    role: 'Mobile gunner',
    abilityType: 'Passive',
    abilityName: 'Partying On',
    ability: 'Reduces recoil and fall damage; faster recovery from falls.',
    maxEffect: 'Stable spray + safer high-ground plays.',
    awaken: '—',
    levels: ['Recoil and fall mitigation scale'],
    lore: 'High-energy fighter who never stops the party.',
    tips: 'Great for aggressive AR/SMG spray and roof fights.',
    price: 'Store / events'
  },

  jota: {
    name: 'Jota',
    realName: 'Jota',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: 'Parkour / stuntman',
    role: 'Rusher',
    abilityType: 'Passive',
    abilityName: 'Sustained Raids',
    ability: 'Restores HP when hitting/knocking enemies with SMG or Shotgun.',
    maxEffect: 'Sustain in close-range chains (historically ~25 HP on kill with CD).',
    awaken: '—',
    levels: ['Heal amount / conditions scale'],
    lore: 'Parkour expert and stuntman.',
    tips: 'SMG/Shotgun only playstyle. Keep fighting to stay topped up.',
    price: 'Store'
  },

  jai: {
    name: 'Jai',
    realName: 'Jai',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Mid-range fighter',
    abilityType: 'Passive',
    abilityName: 'Raging Reload',
    ability: 'Automatically reloads a portion of the magazine after knocking an opponent (limited weapon types).',
    maxEffect: 'Keeps pressure after every knockdown without manual reload.',
    awaken: '—',
    levels: ['Reload % scales'],
    lore: 'Aggressive reloader who never stops shooting.',
    tips: 'Chain fights. AR/SMG/Shotgun/Pistol focus.',
    price: 'Store / events'
  },

  moco: {
    name: 'Moco',
    realName: 'Moco',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: 'Hacker',
    role: 'Recon / Tracker',
    abilityType: 'Passive / mark',
    abilityName: "Hacker's Eye",
    ability: 'Marks enemies you hit so you (and often teammates) can track them briefly.',
    maxEffect: 'Wall-hack style mark after dealing damage.',
    awaken: '—',
    levels: ['Mark duration scales'],
    lore: 'Hacker who sees through the chaos.',
    tips: 'Tag enemies then pre-aim. Excellent in squads.',
    price: 'Store'
  },

  skyler: {
    name: 'Skyler',
    realName: 'Skyler',
    gender: '—',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Anti-gloo / Assault',
    abilityType: 'Active',
    abilityName: 'Riptide Rhythm (sonic / gloo break)',
    ability: 'Sends a wave that damages multiple Gloo Walls at range and can heal based on walls destroyed (details vary by patch).',
    maxEffect: 'Strong answer to heavy gloo defense.',
    awaken: 'Skill Boost available.',
    levels: ['Range and wall damage scale'],
    lore: 'Rhythm-based breaker of defenses.',
    tips: 'Counter gloo-stacked teams. Clear path before push.',
    price: 'Store / events'
  },

  oscar: {
    name: 'Oscar',
    realName: 'Oscar',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: 'Tactical hero',
    role: 'Entry / Gloo break',
    abilityType: 'Active',
    abilityName: 'Valiant Dash',
    ability: 'Dash forward, breaking up to several Gloo Walls and dealing damage to enemies hit.',
    maxEffect: 'Path clear + chip damage on entry.',
    awaken: 'Skill Boost available.',
    levels: ['Dash strength / walls broken scale'],
    lore: 'Tactical dasher built for breaking holds.',
    tips: 'Entry tool. Dash through gloo lines into the fight.',
    price: 'Store / events'
  },

  rin: {
    name: 'Rin (Rin Yagami)',
    realName: 'Rin Yagami',
    gender: 'Female',
    age: 'Teen',
    birthday: '—',
    occupation: 'Clan warrior',
    role: 'Assault / Anti-gloo',
    abilityType: 'Passive',
    abilityName: 'Gale of Kunai / Kunai Surge',
    ability: 'While aiming at enemies or Gloo Walls, kunai automatically form and launch, dealing damage and helping destroy walls.',
    maxEffect: 'Auto-kunai pressure vs players and gloo.',
    awaken: '—',
    levels: ['Kunai count / damage scale'],
    lore: 'Heir of the Yagami clan. Aggressive blade and kunai style — contrast to Hayato’s defensive tradition.',
    tips: 'Mid-range pressure and wall break without spending gloo of your own.',
    price: 'Recent character / events'
  },

  andrew: {
    name: 'Andrew',
    realName: 'Andrew',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: 'Ex-police officer',
    role: 'Tank / Defense',
    abilityType: 'Passive',
    abilityName: 'Armor Specialist',
    ability: 'Reduces vest durability loss when taking damage.',
    maxEffect: 'Armor lasts longer in fights.',
    awaken: '—',
    levels: ['Durability reduction scales'],
    lore: 'Former police officer. Step-dad figure connected to Kelly’s story.',
    tips: 'Simple defensive passive. Good for players who stay in long fights.',
    price: 'Often free / low cost'
  },

  notora: {
    name: 'Notora',
    realName: 'Notora',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: 'Biker',
    role: 'Vehicle support',
    abilityType: 'Passive',
    abilityName: "Racer's Blessing",
    ability: 'While in a vehicle, recovers HP over time (and can extend to passengers).',
    maxEffect: 'Sustain during vehicle rotations.',
    awaken: '—',
    levels: ['Heal rate / duration scale'],
    lore: 'Passionate biker — first vehicle-focused character theme.',
    tips: 'Rotation and escape specialist. Keep the team mobile.',
    price: 'Store / events'
  },

  luqueta: {
    name: 'Luqueta',
    realName: 'Luqueta',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Aggressive survivor',
    abilityType: 'Passive',
    abilityName: 'Lionheart / Hat Trick style',
    ability: 'Gains max HP (or restores HP) for each enemy knocked / eliminated, up to a cap.',
    maxEffect: 'Snowball HP advantage in multi-kill fights.',
    awaken: '—',
    levels: ['HP per kill / cap scale'],
    lore: 'Fighter who grows stronger with every takedown.',
    tips: 'Commit to fights you can chain. Early kills pay off hard.',
    price: 'Store'
  },

  steffie: {
    name: 'Steffie',
    realName: 'Steffie',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: 'Graffiti artist',
    role: 'Support / Zone',
    abilityType: 'Active',
    abilityName: "Graffiti's Blessing / Painted Refuge",
    ability: 'Places graffiti that reduces incoming bullet and explosive damage for a short time.',
    maxEffect: 'Temporary damage reduction zone for team.',
    awaken: '—',
    levels: ['DR % and duration scale'],
    lore: 'Pro graffiti artist who paints safety into the battlefield.',
    tips: 'Drop before holding a building or during a revive.',
    price: '~249–499 Diamonds'
  },

  kapella: {
    name: 'Kapella',
    realName: 'Kapella',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: 'Pop singer',
    role: 'Support',
    abilityType: 'Passive',
    abilityName: 'Healing Song / Remedy Rounds',
    ability: 'Increases effect of healing items and healing skills; reduces ally HP loss when downed.',
    maxEffect: 'Better meds + slower bleed on downed allies.',
    awaken: '—',
    levels: ['Heal amp scales'],
    lore: 'Popular singer whose voice supports the squad.',
    tips: 'Passive support — always useful in long matches.',
    price: '~499 Diamonds'
  },

  xayne: {
    name: 'Xayne',
    realName: 'Xayne',
    gender: 'Female',
    age: 23,
    birthday: 'April 21',
    occupation: 'Extreme athlete',
    role: 'Rusher / Shield',
    abilityType: 'Active',
    abilityName: 'Xtreme Encounter',
    ability: 'Gains temporary shield points and increased damage vs gloo/shields for a duration. Knockdowns can refresh the state.',
    maxEffect: 'Burst of temporary shield + wall pressure.',
    awaken: '—',
    levels: ['Shield points / duration scale with patches'],
    lore: 'Extreme athlete who thrives on high-risk plays.',
    tips: 'Entry rusher. Pop before committing through walls.',
    price: '~499 Diamonds'
  },

  ford: {
    name: 'Ford',
    realName: 'Ford',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Zone survival',
    abilityType: 'Passive',
    abilityName: 'Iron Will',
    ability: 'Reduces damage taken outside the safe zone (blue zone).',
    maxEffect: 'Safer late rotations through zone.',
    awaken: '—',
    levels: ['Zone damage reduction scales'],
    lore: 'Tough survivor built for the edge of the map.',
    tips: 'Useful in aggressive zone plays and edge looting.',
    price: 'Low cost / sale'
  },

  a124: {
    name: 'A124',
    realName: 'A124',
    gender: 'Female (robot)',
    age: '—',
    birthday: '—',
    occupation: 'Advanced robot',
    role: 'Sustain',
    abilityType: 'Active / convert',
    abilityName: 'Thrill of Battle',
    ability: 'Instantly converts EP into HP.',
    maxEffect: 'Emergency HP from EP pool.',
    awaken: '—',
    levels: ['Conversion efficiency scales'],
    lore: 'Robot built with state-of-the-art technology.',
    tips: 'Clutch button when meds are dry but EP is full.',
    price: '~249 Diamonds on sale'
  },

  maxim: {
    name: 'Maxim',
    realName: 'Maxim',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Support / consume',
    abilityType: 'Passive',
    abilityName: 'Gluttony',
    ability: 'Faster healing item / mushroom usage.',
    maxEffect: 'Quicker med animations and efficiency.',
    awaken: '—',
    levels: ['Consume speed scales'],
    lore: 'Never wastes a medkit.',
    tips: 'Passive QoL for any loadout that spams heals.',
    price: 'Store / gold'
  },

  miguel: {
    name: 'Miguel',
    realName: 'Miguel',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Aggressive EP',
    abilityType: 'Passive',
    abilityName: 'Crazy Slayer',
    ability: 'Gains EP on kills / eliminations.',
    maxEffect: 'EP snowball for ability users who need energy.',
    awaken: '—',
    levels: ['EP per kill scales'],
    lore: 'Fights to feed his energy.',
    tips: 'Pair with EP-hungry active skills.',
    price: 'Store'
  },

  paloma: {
    name: 'Paloma',
    realName: 'Paloma',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'AR ammo utility',
    abilityType: 'Passive',
    abilityName: 'AR ammo pack',
    ability: 'Extra AR ammo that does not occupy backpack space (amount scales).',
    maxEffect: 'More AR bullets without inventory tax.',
    awaken: '—',
    levels: ['Ammo amount scales'],
    lore: 'Always ready for long AR fights.',
    tips: 'AR main players — never run dry mid-spray.',
    price: 'Often free at low account levels'
  },

  wolfrahh: {
    name: 'Wolfrahh',
    realName: 'Wolfrahh',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: 'Streamer / esports',
    role: 'Hybrid passive',
    abilityType: 'Passive',
    abilityName: 'Limelight',
    ability: 'With more observers or kills: reduced headshot damage taken, increased limb damage dealt (stacks up to caps).',
    maxEffect: 'Stronger under spectate pressure and multi-kill streaks.',
    awaken: '—',
    levels: ['Stack values scale'],
    lore: 'Game streamer and esports player who thrives in the spotlight.',
    tips: 'Ranked / streamed matches — the passive rewards attention.',
    price: 'Events / Luck Royale historically'
  },

  joseph: {
    name: 'Joseph',
    realName: 'Joseph',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Evasive',
    abilityType: 'Passive',
    abilityName: 'Nutty Movement',
    ability: 'Movement / sprint speed increases briefly after taking damage.',
    maxEffect: 'Escape window after getting tagged.',
    awaken: '—',
    levels: ['Speed and duration scale'],
    lore: 'Hard to pin down once you hit him.',
    tips: 'Hit-and-run. Take a shot then reposition with the speed proc.',
    price: 'Store'
  },

  alvaro: {
    name: 'Alvaro',
    realName: 'Alvaro',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: 'Military explosives',
    role: 'Demolition',
    abilityType: 'Passive',
    abilityName: 'Art of Demolition',
    ability: 'Increases explosive weapon damage and range.',
    maxEffect: 'Stronger grenades / launchers.',
    awaken: '—',
    levels: ['Explosive damage / range scale'],
    lore: 'Recruited young for his love of explosives.',
    tips: 'Grenade and launcher focused play.',
    price: 'Store'
  },

  nikita: {
    name: 'Nikita',
    realName: 'Nikita',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'SMG specialist',
    abilityType: 'Passive',
    abilityName: 'Firearms Expert',
    ability: 'Faster SMG reload.',
    maxEffect: 'Shorter SMG downtime.',
    awaken: '—',
    levels: ['Reload speed scales'],
    lore: 'SMG specialist.',
    tips: 'Pure SMG rush loadouts.',
    price: 'Store'
  },

  olivia: {
    name: 'Olivia',
    realName: 'Olivia',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: 'Medic',
    role: 'Support / revive',
    abilityType: 'Passive',
    abilityName: 'Healing Touch',
    ability: 'Revives give extra HP (or improved revive outcomes).',
    maxEffect: 'Stronger post-revive state for teammates.',
    awaken: '—',
    levels: ['Bonus HP on revive scales'],
    lore: 'Medic who brings people back stronger.',
    tips: 'Squad revive specialist.',
    price: 'Store'
  },

  shani: {
    name: 'Shani',
    realName: 'Shani',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Support / recycle',
    abilityType: 'Passive',
    abilityName: 'Gear Recycle',
    ability: 'Improves resource / gear efficiency (recycle-themed passive).',
    maxEffect: 'Better sustain from looted gear.',
    awaken: '—',
    levels: ['Efficiency scales'],
    lore: 'Never wastes a resource.',
    tips: 'Utility support for long matches.',
    price: 'Store'
  },

  thiva: {
    name: 'Thiva',
    realName: 'Thiva',
    gender: 'Male',
    age: 25,
    birthday: 'December 2',
    occupation: '—',
    role: 'Support',
    abilityType: 'Passive',
    abilityName: 'Vital Vibes',
    ability: 'Support-oriented passive linked to squad sustain (brother of Dimitri).',
    maxEffect: 'Team sustain utility.',
    awaken: '—',
    levels: ['Effect scales'],
    lore: 'Younger brother of Dimitri.',
    tips: 'Pair with Dimitri lore-wise; use for squad heals synergy.',
    price: 'Store'
  },

  kla: {
    name: 'Kla',
    realName: 'Kla',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: 'Muay Thai fighter',
    role: 'Melee',
    abilityType: 'Passive',
    abilityName: 'Muay Thai',
    ability: 'Greatly increases fist / melee damage.',
    maxEffect: 'Dangerous bare-hand finishes.',
    awaken: '—',
    levels: ['Melee damage scales'],
    lore: 'Muay Thai specialist.',
    tips: 'Fun / niche — finish low HP enemies without wasting ammo.',
    price: '~499 Diamonds / gold'
  },

  laura: {
    name: 'Laura',
    realName: 'Laura',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: 'Sharpshooter',
    role: 'Sniper',
    abilityType: 'Passive',
    abilityName: 'Sharpshooter',
    ability: 'Improved accuracy / handling while scoped.',
    maxEffect: 'Cleaner long-range shots.',
    awaken: '—',
    levels: ['Scope accuracy scales'],
    lore: 'Precision shooter.',
    tips: 'DMR / SR loadouts.',
    price: 'Store'
  },

  santino: {
    name: 'Santino',
    realName: 'Santino',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Trick / reposition',
    abilityType: 'Active',
    abilityName: 'Shape Splitter',
    ability: 'Creates a moving mannequin and can teleport to its position.',
    maxEffect: 'Fake presence + instant reposition.',
    awaken: '—',
    levels: ['Duration / utility scale'],
    lore: 'Master of misdirection.',
    tips: 'Dodge utility and surprise angles.',
    price: '~200 Diamonds / gold'
  },

  nero: {
    name: 'Nero',
    realName: 'Nero',
    gender: '—',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Control / anti-gloo',
    abilityType: 'Active',
    abilityName: 'Cryo Mind',
    ability: 'Creates a frozen zone that damages enemies and blocks Gloo Wall use.',
    maxEffect: 'Area denial + gloo lockout.',
    awaken: '—',
    levels: ['Zone strength scales'],
    lore: 'Cold control specialist.',
    tips: 'Lock a room or staircase before push.',
    price: 'Store / events'
  },

  ignis: {
    name: 'Ignis',
    realName: 'Ignis',
    gender: '—',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Area damage',
    abilityType: 'Active',
    abilityName: 'Flame Zone / Flame Mirage',
    ability: 'Creates a wall/zone of fire that burns enemies and Gloo Walls over time.',
    maxEffect: 'DoT + wall pressure.',
    awaken: '—',
    levels: ['Burn damage scales'],
    lore: 'Fire controller.',
    tips: 'Block rotates and punish holds behind gloo.',
    price: 'Store / events'
  },

  morse: {
    name: 'Morse',
    realName: 'Morse',
    gender: '—',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Stealth',
    abilityType: 'Active',
    abilityName: 'Stealth Bytes',
    ability: 'Nearly invisible for a short time — escape or surprise.',
    maxEffect: 'Short stealth window.',
    awaken: '—',
    levels: ['Duration scales'],
    lore: 'Digital ghost.',
    tips: 'Escape tool or silent approach.',
    price: 'Store / events'
  },

  tatsuya: {
    name: 'Tatsuya',
    realName: 'Tatsuya',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Rusher / mobility',
    abilityType: 'Active',
    abilityName: 'Rebel Rush',
    ability: 'Dash / multi-dash mobility for aggressive entry.',
    maxEffect: 'Best-in-class gap closer in many metas.',
    awaken: '—',
    levels: ['Dash charges / distance scale'],
    lore: 'Rebel who rushes the line.',
    tips: 'Entry fragger. Dash in, shotgun out.',
    price: 'Store / events'
  },

  dbee: {
    name: 'D-Bee',
    realName: 'D-Bee',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Mobile gunner',
    abilityType: 'Passive',
    abilityName: 'Bullet Beats',
    ability: 'Move and fire faster while holding a weapon.',
    maxEffect: 'Strafe-shoot advantage.',
    awaken: '—',
    levels: ['Move/fire speed scale'],
    lore: 'Rhythm gunner.',
    tips: 'Keep moving while spraying.',
    price: 'Store'
  },

  kenta: {
    name: 'Kenta',
    realName: 'Kenta',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: 'Swordsman',
    role: 'Tank / frontal',
    abilityType: 'Active',
    abilityName: "Swordsman's Wrath",
    ability: 'Frontal damage shield / sword-themed defense.',
    maxEffect: 'Front-facing mitigation while pushing.',
    awaken: '—',
    levels: ['Shield strength scales'],
    lore: 'Blade guardian.',
    tips: 'Push doorways and narrow angles.',
    price: 'Store'
  },

  leon: {
    name: 'Leon',
    realName: 'Leon',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Close combat',
    abilityType: 'Passive',
    abilityName: 'Buzzer Beater',
    ability: 'Restores HP after combat / close engagements.',
    maxEffect: 'Post-fight sustain.',
    awaken: '—',
    levels: ['Heal amount scales'],
    lore: 'Clutch closer.',
    tips: 'Win the fight, then top up without meds.',
    price: 'Store'
  },

  nairi: {
    name: 'Nairi',
    realName: 'Nairi',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Defense / gloo',
    abilityType: 'Passive',
    abilityName: 'Ice Iron',
    ability: 'Gloo Walls regenerate durability over time when damaged.',
    maxEffect: 'Longer-lasting gloo holds.',
    awaken: '—',
    levels: ['Regen rate scales'],
    lore: 'Ice-reinforced defender.',
    tips: 'Hold buildings longer against spray.',
    price: 'Store'
  },

  otho: {
    name: 'Otho',
    realName: 'Otho',
    gender: '—',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Recon after kill',
    abilityType: 'Active / trigger',
    abilityName: 'Memory Mist',
    ability: 'After a kill, reveals nearby enemy locations.',
    maxEffect: 'Post-kill intel sweep.',
    awaken: '—',
    levels: ['Reveal range scales'],
    lore: 'Remembers every threat.',
    tips: 'Chain info after each elimination.',
    price: 'Store'
  },

  suzy: {
    name: 'Suzy',
    realName: 'Suzy',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Economy',
    abilityType: 'Passive',
    abilityName: 'Money Mark',
    ability: 'Extra FF Coins when marked enemies are eliminated by you or your team.',
    maxEffect: 'Better mid-match economy.',
    awaken: '—',
    levels: ['Coin bonus scales'],
    lore: 'Marks value on the battlefield.',
    tips: 'Help the squad afford better loadouts faster.',
    price: 'Store'
  },

  luna: {
    name: 'Luna',
    realName: 'Luna',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Gunplay passive',
    abilityType: 'Passive',
    abilityName: 'Fight-or-Flight',
    ability: 'Permanent fire-rate boost; landing hits can convert some fire rate into movement speed.',
    maxEffect: 'Faster TTK + mobility while shooting accurately.',
    awaken: '—',
    levels: ['Fire rate / conversion scale'],
    lore: 'Fights on instinct.',
    tips: 'Keep landing shots to stay mobile mid-spray.',
    price: 'Store / events'
  },

  kairos: {
    name: 'Kairos',
    realName: 'Kairos',
    gender: '—',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Armor break',
    abilityType: 'Active / mode',
    abilityName: 'Defense Breaker',
    ability: 'Regenerates EP, then spends EP to deal extra damage to enemy armor / shields.',
    maxEffect: 'Armor shred mode when EP is full.',
    awaken: '—',
    levels: ['EP regen and armor damage scale'],
    lore: 'Breaks defenses systematically.',
    tips: 'Build EP, then focus armored targets.',
    price: 'Store / events'
  },

  iris: {
    name: 'Iris',
    realName: 'Iris',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Anti-gloo mark',
    abilityType: 'Active / mark',
    abilityName: 'Wall Brawl',
    ability: 'Marks and damages enemies behind Gloo Walls.',
    maxEffect: 'Punish players hiding behind gloo.',
    awaken: '—',
    levels: ['Mark / damage scale'],
    lore: 'Sees through the walls.',
    tips: 'Counter turtle teams.',
    price: 'Events'
  },

  shirou: {
    name: 'Shirou',
    realName: 'Shirou',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Counter-damage',
    abilityType: 'Passive',
    abilityName: 'Damage Delivered',
    ability: 'Marks enemies who damage him; first return shot gains extra armor penetration.',
    maxEffect: 'Punish whoever tags you first.',
    awaken: '—',
    levels: ['Pen bonus scales'],
    lore: 'Returns damage with interest.',
    tips: 'Trade efficiently after getting hit.',
    price: 'Store'
  },

  homer: {
    name: 'Homer',
    realName: 'Homer',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Recon / mobility',
    abilityType: 'Active',
    abilityName: 'Drone Pursuit / Senses Shockwave',
    ability: 'Deploys drone or shockwave-style recon / disruption (patch-dependent naming).',
    maxEffect: 'Intel and disruption tool.',
    awaken: 'Skill Boost available.',
    levels: ['Range / effect scale'],
    lore: 'Eyes in the sky.',
    tips: 'Scout before push; Skill Boost raises ceiling.',
    price: 'Store / events'
  },

  misha: {
    name: 'Misha',
    realName: 'Misha',
    gender: '—',
    age: '—',
    birthday: '—',
    occupation: 'Driver',
    role: 'Vehicle',
    abilityType: 'Passive',
    abilityName: 'Afterburner',
    ability: 'Faster and safer driving.',
    maxEffect: 'Better vehicle control and survivability on the road.',
    awaken: '—',
    levels: ['Driving bonuses scale'],
    lore: 'Born for the wheel.',
    tips: 'Rotation and vehicle fights.',
    price: 'Store'
  },

  jbiebs: {
    name: 'J.Biebs',
    realName: 'J.Biebs',
    gender: 'Male',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Support passive',
    abilityType: 'Passive',
    abilityName: 'Silent Sentinel',
    ability: 'Team-oriented passive support effect.',
    maxEffect: 'Subtle squad utility.',
    awaken: '—',
    levels: ['Effect scales'],
    lore: 'Quiet guardian of the squad.',
    tips: 'Fill support slot when you want passive value.',
    price: 'Store'
  },

  a_patroa: {
    name: 'A-Patroa',
    realName: 'A-Patroa',
    gender: 'Female',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Support',
    abilityType: 'Passive',
    abilityName: "Groovin' Waves",
    ability: 'Support-oriented passive waves / utility.',
    maxEffect: 'Team utility passive.',
    awaken: '—',
    levels: ['Effect scales'],
    lore: 'Groove supports the fight.',
    tips: 'Passive support pick.',
    price: 'Store'
  },

  ryden: {
    name: 'Ryden',
    realName: 'Ryden',
    gender: '—',
    age: '—',
    birthday: '—',
    occupation: '—',
    role: 'Trap / control',
    abilityType: 'Active',
    abilityName: 'Spider Trap',
    ability: 'Deploys trap-style control on the battlefield.',
    maxEffect: 'Area control / slow or lock.',
    awaken: '—',
    levels: ['Trap strength scales'],
    lore: 'Webs the battlefield.',
    tips: 'Defend chokepoints and doors.',
    price: 'Store / events'
  }
};

// aliases so users can type common shortcuts
const ALIASES = {
  kiriko: 'kelly',
  'shimada kiriko': 'kelly',
  dj: 'alok',
  'dj alok': 'alok',
  cr7: 'chrono',
  ronaldo: 'chrono',
  'd-bee': 'dbee',
  dbee: 'dbee',
  'j.biebs': 'jbiebs',
  jbiebs: 'jbiebs',
  'a-patroa': 'a_patroa',
  apatroa: 'a_patroa',
  'rin yagami': 'rin',
  yagami: 'hayato'
};

function formatCharacter(c) {
  let t = `🎮 *${c.name}*\n`;
  if (c.realName && c.realName !== c.name) t += `Real name: *${c.realName}*\n`;
  t += `Gender: ${c.gender} | Age: ${c.age}\n`;
  t += `Birthday: ${c.birthday}\n`;
  t += `Occupation: ${c.occupation}\n`;
  t += `Role: *${c.role}*\n\n`;
  t += `⚡ *Ability* (${c.abilityType})\n`;
  t += `Name: *${c.abilityName}*\n`;
  t += `${c.ability}\n`;
  t += `Max effect: ${c.maxEffect}\n`;
  if (c.awaken && c.awaken !== '—') t += `Awaken / Boost: ${c.awaken}\n`;
  if (c.levels && c.levels.length) {
    t += `\n📈 Levels:\n`;
    for (const lv of c.levels) t += `• ${lv}\n`;
  }
  t += `\n📖 Lore\n${c.lore}\n`;
  t += `\n💡 Tips\n${c.tips}\n`;
  t += `\n💰 Price note: ${c.price}`;
  return t.trim();
}

function listNames() {
  const names = Object.values(CHARACTERS).map(c => c.name).sort((a, b) => a.localeCompare(b));
  const lines = names.map(n => `• ${n}`);
  return `📋 *Free Fire Characters* (${names.length})\n\n${lines.join('\n')}\n\nUsage: *.character0 <name>*\nExample: .character0 kelly`;
}

async function character0Command(sock, chatId, message, argsText) {
  try {
    const raw = (argsText || '').trim().toLowerCase();
    if (!raw || raw === 'list' || raw === 'all' || raw === 'help') {
      return sock.sendMessage(chatId, { text: listNames() }, { quoted: message });
    }

    const key = ALIASES[raw] || raw.replace(/\s+/g, ' ');
    // try direct key, then search by name
    let data = CHARACTERS[key];
    if (!data) {
      const found = Object.entries(CHARACTERS).find(([k, v]) =>
        k === key ||
        v.name.toLowerCase() === key ||
        v.name.toLowerCase().includes(key) ||
        (v.realName && v.realName.toLowerCase().includes(key))
      );
      if (found) data = found[1];
    }

    if (!data) {
      return sock.sendMessage(chatId, {
        text: `❌ Character not found: *${raw}*\n\nTry *.character0 list* for all names.\nExample: .character0 kelly`
      }, { quoted: message });
    }

    await sock.sendMessage(chatId, { text: formatCharacter(data) }, { quoted: message });
  } catch (err) {
    console.error('character0 error:', err);
    await sock.sendMessage(chatId, { text: '❌ Failed to load character info.' }, { quoted: message });
  }
}

module.exports = character0Command;
