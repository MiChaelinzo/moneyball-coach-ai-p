import type { Player, Mistake, Match, Insight, StrategicImpact, PlayerAnalytics, LiveMatch, LiveMatchPlayer } from './types'

export const PLAYERS: Player[] = [
  { 
    id: '1', 
    name: 'Fudge', 
    role: 'Top', 
    kda: 3.2, 
    winRate: 58, 
    gamesPlayed: 24, 
    title: 'LoL', 
    titleId: '3',
    biography: {
      realName: 'Ibrahim Allami',
      nationality: 'Australian',
      birthDate: '2002-01-20',
      hometown: 'Sydney, Australia',
      bio: 'Fudge rose through the Oceanic scene before making waves in the LCS. Known for his aggressive laning phase and impressive champion pool, he has become a cornerstone of Cloud9\'s top lane dominance.',
      playstyle: 'Aggressive lane bully with strong team fighting',
      signature: 'Jayce, Gnar, Renekton',
      careerStart: 2019
    },
    careerHistory: [
      { year: 2024, event: 'LCS Spring Split', achievement: 'Playoffs Semifinalist', team: 'Cloud9', title: 'LoL' },
      { year: 2023, event: 'Worlds Championship', achievement: 'Quarterfinals', team: 'Cloud9', title: 'LoL' },
      { year: 2022, event: 'LCS Summer', achievement: 'First Team All-Pro', team: 'Cloud9', title: 'LoL' },
      { year: 2021, event: 'LCS Spring', achievement: 'Championship Winner', team: 'Cloud9', title: 'LoL' },
      { year: 2020, event: 'OPL Split', achievement: 'MVP Runner-up', team: 'Mammoth', title: 'LoL' }
    ]
  },
  { 
    id: '2', 
    name: 'Blaber', 
    role: 'Jungle', 
    kda: 4.1, 
    winRate: 62, 
    gamesPlayed: 24, 
    title: 'LoL', 
    titleId: '3',
    biography: {
      realName: 'Robert Huang',
      nationality: 'American',
      birthDate: '2000-02-16',
      hometown: 'Arcadia, California',
      bio: 'Blaber is a three-time LCS MVP known for his hyper-aggressive jungle style and lightning-fast decision making. His fearless invades and objective control have defined Cloud9\'s proactive playstyle.',
      playstyle: 'Ultra-aggressive early game with high-tempo jungling',
      signature: 'Lee Sin, Olaf, Hecarim',
      careerStart: 2017
    },
    careerHistory: [
      { year: 2024, event: 'LCS Spring', achievement: 'All-Star Selection', team: 'Cloud9', title: 'LoL' },
      { year: 2023, event: 'LCS Summer', achievement: 'Third Team All-Pro', team: 'Cloud9', title: 'LoL' },
      { year: 2022, event: 'LCS Spring', achievement: 'MVP Award', team: 'Cloud9', title: 'LoL' },
      { year: 2021, event: 'LCS Summer', achievement: 'MVP Award', team: 'Cloud9', title: 'LoL' },
      { year: 2020, event: 'LCS Spring', achievement: 'MVP Award & Championship', team: 'Cloud9', title: 'LoL' },
      { year: 2018, event: 'Worlds Championship', achievement: 'Semifinals Debut', team: 'Cloud9', title: 'LoL' }
    ]
  },
  { 
    id: '3', 
    name: 'Jensen', 
    role: 'Mid', 
    kda: 5.3, 
    winRate: 65, 
    gamesPlayed: 24, 
    title: 'LoL', 
    titleId: '3',
    biography: {
      realName: 'Nicolaj Jensen',
      nationality: 'Danish',
      birthDate: '1995-04-25',
      hometown: 'Copenhagen, Denmark',
      bio: 'Jensen is one of the most decorated North American mid laners with multiple LCS championships. His mechanical prowess and clutch performances in high-pressure situations make him a franchise player.',
      playstyle: 'Control mage specialist with exceptional positioning',
      signature: 'Orianna, Azir, Syndra',
      careerStart: 2015
    },
    careerHistory: [
      { year: 2024, event: 'Return to Cloud9', achievement: 'Roster Addition', team: 'Cloud9', title: 'LoL' },
      { year: 2023, event: 'LCS', achievement: 'Multiple Pentakills', team: 'Team Liquid', title: 'LoL' },
      { year: 2019, event: 'Worlds', achievement: 'Finals Appearance', team: 'Team Liquid', title: 'LoL' },
      { year: 2018, event: 'LCS Summer', achievement: 'Championship & MVP', team: 'Team Liquid', title: 'LoL' },
      { year: 2017, event: 'Worlds', achievement: 'Quarterfinals', team: 'Cloud9', title: 'LoL' },
      { year: 2016, event: 'LCS Summer', achievement: 'Second Team All-Pro', team: 'Cloud9', title: 'LoL' }
    ]
  },
  { 
    id: '4', 
    name: 'Berserker', 
    role: 'ADC', 
    kda: 6.8, 
    winRate: 70, 
    gamesPlayed: 24, 
    title: 'LoL', 
    titleId: '3',
    biography: {
      realName: 'Kim Min-cheol',
      nationality: 'South Korean',
      birthDate: '2002-08-17',
      hometown: 'Seoul, South Korea',
      bio: 'Berserker exploded onto the LCS scene with his aggressive laning and exceptional teamfight positioning. His Korean soloqueue dominance translated perfectly to the professional stage.',
      playstyle: 'High-damage carry with fearless positioning',
      signature: 'Zeri, Jinx, Aphelios',
      careerStart: 2020
    },
    careerHistory: [
      { year: 2024, event: 'LCS Spring', achievement: 'Leading KDA in Role', team: 'Cloud9', title: 'LoL' },
      { year: 2023, event: 'LCS Summer', achievement: 'First Team All-Pro', team: 'Cloud9', title: 'LoL' },
      { year: 2022, event: 'LCS Summer', achievement: 'Rookie of the Split', team: 'Cloud9', title: 'LoL' },
      { year: 2022, event: 'LCS Spring', achievement: 'Championship Winner', team: 'Cloud9', title: 'LoL' },
      { year: 2021, event: 'LCK Challengers', achievement: 'Promotion Tournament', team: 'T1', title: 'LoL' }
    ]
  },
  { 
    id: '5', 
    name: 'Zven', 
    role: 'Support', 
    kda: 3.9, 
    winRate: 61, 
    gamesPlayed: 24, 
    title: 'LoL', 
    titleId: '3',
    biography: {
      realName: 'Jesper Svenningsen',
      nationality: 'Danish',
      birthDate: '1997-06-11',
      hometown: 'Copenhagen, Denmark',
      bio: 'Former ADC legend Zven made the unprecedented role swap to support, bringing veteran shotcalling and deep game knowledge. His European pedigree and multiple championship runs make him an invaluable leader.',
      playstyle: 'Tactical support with exceptional vision control',
      signature: 'Thresh, Alistar, Nautilus',
      careerStart: 2014
    },
    careerHistory: [
      { year: 2024, event: 'Role Swap', achievement: 'Successfully transitioned to Support', team: 'Cloud9', title: 'LoL' },
      { year: 2022, event: 'LCS Spring', achievement: 'Championship as ADC', team: 'Cloud9', title: 'LoL' },
      { year: 2018, event: 'Worlds', achievement: 'Quarterfinals', team: 'TSM', title: 'LoL' },
      { year: 2017, event: 'EU LCS Summer', achievement: 'Championship', team: 'G2 Esports', title: 'LoL' },
      { year: 2016, event: 'Worlds', achievement: 'Semifinals', team: 'G2 Esports', title: 'LoL' },
      { year: 2015, event: 'EU LCS', achievement: 'Rookie of the Split', team: 'Origen', title: 'LoL' }
    ]
  },
  
  { id: '6', name: 'Vulcan', role: 'Support', kda: 4.5, winRate: 64, gamesPlayed: 22, title: 'LoL', titleId: '3' },
  { id: '7', name: 'Emenes', role: 'Mid', kda: 4.8, winRate: 59, gamesPlayed: 20, title: 'LoL', titleId: '3' },
  { id: '8', name: 'Thanatos', role: 'Top', kda: 3.6, winRate: 56, gamesPlayed: 18, title: 'LoL', titleId: '3' },
  
  { 
    id: '9', 
    name: 'Xeta', 
    role: 'Controller', 
    kda: 1.24, 
    winRate: 55, 
    gamesPlayed: 32, 
    title: 'Valorant', 
    titleId: '6',
    biography: {
      realName: 'Son Seon-ho',
      nationality: 'South Korean',
      birthDate: '1995-07-03',
      hometown: 'Seoul, South Korea',
      bio: 'Former CS:GO pro Xeta brings tactical depth and clutch ability to Cloud9\'s Valorant roster. His experience in tier-1 Counter-Strike translates to elite game sense and mid-round calling.',
      playstyle: 'Tactical controller with clutch gene',
      signature: 'Omen, Viper, Brimstone',
      careerStart: 2016
    },
    careerHistory: [
      { year: 2024, event: 'VCT Americas', achievement: 'Kickoff Participant', team: 'Cloud9', title: 'Valorant' },
      { year: 2023, event: 'VCT Masters', achievement: 'Top 8 Finish', team: 'DRX', title: 'Valorant' },
      { year: 2022, event: 'Champions', achievement: 'Semifinals', team: 'DRX', title: 'Valorant' },
      { year: 2021, event: 'VCT Stage 3', achievement: 'Masters Berlin Qualified', team: 'Cloud9 Blue', title: 'Valorant' },
      { year: 2019, event: 'CS:GO Major', achievement: 'Legends Stage', team: 'MVP PK' }
    ]
  },
  { 
    id: '10', 
    name: 'vanity', 
    role: 'IGL/Controller', 
    kda: 1.18, 
    winRate: 52, 
    gamesPlayed: 32, 
    title: 'Valorant', 
    titleId: '6',
    biography: {
      realName: 'Anthony Malaspina',
      nationality: 'American',
      birthDate: '1999-03-15',
      hometown: 'New York, USA',
      bio: 'Vanity is known as one of NA Valorant\'s premier IGLs with a cerebral approach to the game. His strategic innovations and mid-round adaptations have made Cloud9 a tactical powerhouse.',
      playstyle: 'Big-brain IGL with tactical setups',
      signature: 'Omen, Astra, Harbor',
      careerStart: 2020
    },
    careerHistory: [
      { year: 2024, event: 'VCT Americas Kickoff', achievement: 'Group Stage', team: 'Cloud9', title: 'Valorant' },
      { year: 2023, event: 'VCT Lock//In', achievement: 'Playoff Round', team: 'Cloud9', title: 'Valorant' },
      { year: 2022, event: 'LCQ', achievement: 'Championship Winner', team: 'Cloud9', title: 'Valorant' },
      { year: 2021, event: 'NA VCT Stage 3', achievement: 'Challengers Finals Winner', team: 'Version1', title: 'Valorant' }
    ]
  },
  { 
    id: '11', 
    name: 'leaf', 
    role: 'Duelist', 
    kda: 1.42, 
    winRate: 58, 
    gamesPlayed: 32, 
    title: 'Valorant', 
    titleId: '6',
    biography: {
      realName: 'Nathan Orf',
      nationality: 'American',
      birthDate: '2001-11-24',
      hometown: 'Seattle, Washington',
      bio: 'Leaf emerged as one of NA\'s most consistent duelists with his calm demeanor and exceptional aim. His clutch performances and multi-frag rounds have become a Cloud9 staple.',
      playstyle: 'Aggressive entry with consistent fragging',
      signature: 'Jett, Raze, Neon',
      careerStart: 2020
    },
    careerHistory: [
      { year: 2024, event: 'VCT Americas', achievement: 'Top Fragger Multiple Matches', team: 'Cloud9', title: 'Valorant' },
      { year: 2023, event: 'VCT Americas League', achievement: 'All-Star Selection', team: 'Cloud9', title: 'Valorant' },
      { year: 2022, event: 'Champions', achievement: 'Group Stage MVP Performance', team: 'Cloud9', title: 'Valorant' },
      { year: 2021, event: 'Challengers', achievement: 'Multiple Ace Rounds', team: 'Chaos EC', title: 'Valorant' }
    ]
  },
  { 
    id: '12', 
    name: 'Xeppaa', 
    role: 'Initiator', 
    kda: 1.31, 
    winRate: 54, 
    gamesPlayed: 32, 
    title: 'Valorant', 
    titleId: '6',
    biography: {
      realName: 'Erick Bach',
      nationality: 'American',
      birthDate: '2001-04-07',
      hometown: 'Virginia, USA',
      bio: 'Xeppaa\'s versatility across initiator agents makes him one of Cloud9\'s most valuable players. His ability to create space for teammates and gather crucial information is elite.',
      playstyle: 'Versatile initiator with smart utility usage',
      signature: 'Fade, Sova, Skye',
      careerStart: 2020
    },
    careerHistory: [
      { year: 2024, event: 'VCT Americas', achievement: 'Kickoff Tournament', team: 'Cloud9', title: 'Valorant' },
      { year: 2023, event: 'Americas League', achievement: 'Playoffs Qualified', team: 'Cloud9', title: 'Valorant' },
      { year: 2022, event: 'LCQ', achievement: 'Champions Qualification', team: 'Cloud9', title: 'Valorant' },
      { year: 2021, event: 'Challengers Playoffs', achievement: 'Top 4 Finish', team: 'Cloud9 Blue', title: 'Valorant' }
    ]
  },
  { id: '13', name: 'mitch', role: 'Sentinel', kda: 1.15, winRate: 53, gamesPlayed: 32, title: 'Valorant', titleId: '6' },
  
  { 
    id: '14', 
    name: 'oxy', 
    role: 'Duelist', 
    kda: 1.56, 
    winRate: 61, 
    gamesPlayed: 28, 
    title: 'Valorant', 
    titleId: '6',
    biography: {
      realName: 'Francis Hoang',
      nationality: 'American/Vietnamese',
      birthDate: '2004-09-12',
      hometown: 'California, USA',
      bio: 'Young prodigy oxy has taken VCT Americas by storm with his aggressive duelist play. Despite his age, his mechanics and game sense rival the best in the world.',
      playstyle: 'Hyper-aggressive with insane mechanics',
      signature: 'Jett, Reyna, Chamber',
      careerStart: 2022
    },
    careerHistory: [
      { year: 2024, event: 'VCT Americas', achievement: 'Rising Star Award Nomination', team: 'Cloud9', title: 'Valorant' },
      { year: 2023, event: 'Ascension Tournament', achievement: 'MVP Performance', team: 'The Guard', title: 'Valorant' },
      { year: 2023, event: 'VCT Challengers', achievement: 'Highest ACS in League', team: 'The Guard', title: 'Valorant' }
    ]
  },
  { id: '15', name: 'moose', role: 'Controller', kda: 1.28, winRate: 57, gamesPlayed: 26, title: 'Valorant', titleId: '6' },
  { id: '16', name: 'v1c', role: 'Initiator', kda: 1.35, winRate: 59, gamesPlayed: 28, title: 'Valorant', titleId: '6' },
  
  { 
    id: '17', 
    name: 'JT', 
    role: 'IGL', 
    kda: 1.08, 
    winRate: 48, 
    gamesPlayed: 45, 
    title: 'CS2', 
    titleId: '2',
    biography: {
      realName: 'Justinas Lekavicius',
      nationality: 'Lithuanian',
      birthDate: '2000-05-20',
      hometown: 'Vilnius, Lithuania',
      bio: 'JT brings European tactical sophistication to Cloud9\'s CS2 roster. His leadership and strategic calling have revitalized the team\'s competitive approach.',
      playstyle: 'Tactical IGL with solid fundamentals',
      signature: 'Anchor CT positions, Strategic calling',
      careerStart: 2018
    },
    careerHistory: [
      { year: 2024, event: 'ESL Pro League', achievement: 'Playoff Qualification', team: 'Cloud9', title: 'CS2' },
      { year: 2023, event: 'IEM', achievement: 'Group Stage', team: 'ENCE', title: 'CS2' },
      { year: 2022, event: 'Major', achievement: 'Legends Stage', team: 'ENCE', title: 'CS2' }
    ]
  },
  { 
    id: '18', 
    name: 'Ax1Le', 
    role: 'Rifler', 
    kda: 1.22, 
    winRate: 52, 
    gamesPlayed: 45, 
    title: 'CS2', 
    titleId: '2',
    biography: {
      realName: 'Sergey Rykhtorov',
      nationality: 'Russian',
      birthDate: '2002-11-03',
      hometown: 'Moscow, Russia',
      bio: 'Ax1Le is a young rifler with explosive potential. His aggressive T-side entries and solid CT holds make him a dual threat.',
      playstyle: 'Aggressive rifler with high fragging potential',
      signature: 'AK-47 spray control, Entry fragging',
      careerStart: 2020
    },
    careerHistory: [
      { year: 2024, event: 'CS2 Launch', achievement: 'Adapted to new meta', team: 'Cloud9', title: 'CS2' },
      { year: 2022, event: 'PGL Major', achievement: 'Champions Winner', team: 'Gambit', title: 'CS2' },
      { year: 2021, event: 'IEM Katowice', achievement: 'Grand Finals', team: 'Gambit', title: 'CS2' }
    ]
  },
  { id: '19', name: 'Hobbit', role: 'Support', kda: 1.15, winRate: 50, gamesPlayed: 45, title: 'CS2', titleId: '2' },
  { id: '20', name: 'nafany', role: 'AWPer', kda: 1.31, winRate: 54, gamesPlayed: 45, title: 'CS2', titleId: '2' },
  { id: '21', name: 'sh1ro', role: 'Rifler', kda: 1.28, winRate: 53, gamesPlayed: 45, title: 'CS2', titleId: '2' },
  
  { 
    id: '22', 
    name: 'Bwipo', 
    role: 'Top', 
    kda: 3.8, 
    winRate: 62, 
    gamesPlayed: 26, 
    title: 'LoL', 
    titleId: '3',
    biography: {
      realName: 'Gabriël Rau',
      nationality: 'Belgian',
      birthDate: '1998-12-08',
      hometown: 'Ghent, Belgium',
      bio: 'Bwipo is a versatile top laner who can also jungle at a world-class level. His innovative champion picks and aggressive playstyle make him unpredictable and dangerous.',
      playstyle: 'Versatile aggressor with deep champion pool',
      signature: 'Gragas, Aatrox, Ornn',
      careerStart: 2016
    },
    careerHistory: [
      { year: 2024, event: 'LCS Spring', achievement: 'Cloud9 Debut', team: 'Cloud9', title: 'LoL' },
      { year: 2023, event: 'LEC Summer', achievement: 'Playoff Finalist', team: 'Team Vitality', title: 'LoL' },
      { year: 2021, event: 'Worlds', achievement: 'Finalist', team: 'FlyQuest', title: 'LoL' },
      { year: 2019, event: 'MSI', achievement: 'Semifinals', team: 'Fnatic', title: 'LoL' },
      { year: 2018, event: 'Worlds', achievement: 'Finals Runner-up', team: 'Fnatic', title: 'LoL' }
    ]
  },
  { 
    id: '23', 
    name: 'Jojopyun', 
    role: 'Mid', 
    kda: 4.9, 
    winRate: 63, 
    gamesPlayed: 24, 
    title: 'LoL', 
    titleId: '3',
    biography: {
      realName: 'Joseph Pyun',
      nationality: 'Canadian',
      birthDate: '2003-08-09',
      hometown: 'Toronto, Canada',
      bio: 'North American native talent Jojopyun burst onto the scene as a teenage prodigy. His aggressive laning and roaming pressure have made him one of LCS\'s most exciting mid laners.',
      playstyle: 'Roaming assassin with high mechanical skill',
      signature: 'Sylas, LeBlanc, Akali',
      careerStart: 2021
    },
    careerHistory: [
      { year: 2024, event: 'LCS Spring', achievement: 'All-Pro Third Team', team: 'Cloud9', title: 'LoL' },
      { year: 2023, event: 'LCS Summer', achievement: 'Breakout Player Nominee', team: 'Evil Geniuses', title: 'LoL' },
      { year: 2022, event: 'LCS Lock-In', achievement: 'Championship Winner', team: 'Evil Geniuses', title: 'LoL' },
      { year: 2021, event: 'LCS Academy', achievement: 'Rookie of the Year', team: 'Evil Geniuses Academy', title: 'LoL' }
    ]
  },
  
  { 
    id: '24', 
    name: 'wiz', 
    role: 'Duelist', 
    kda: 1.38, 
    winRate: 56, 
    gamesPlayed: 30, 
    title: 'Valorant', 
    titleId: '6',
    biography: {
      realName: 'Wiz Gaming',
      nationality: 'American',
      birthDate: '2002-03-14',
      hometown: 'Los Angeles, California',
      bio: 'Wiz is a confident duelist who thrives under pressure. His flashy plays and clutch abilities make him a fan favorite.',
      playstyle: 'Flashy duelist with clutch potential',
      signature: 'Jett, Yoru, Phoenix',
      careerStart: 2021
    },
    careerHistory: [
      { year: 2024, event: 'VCT Challengers', achievement: 'Top 4 Finish', team: 'Cloud9 White', title: 'Valorant' },
      { year: 2023, event: 'Challengers League', achievement: 'Ascension Qualified', team: 'Cloud9 White', title: 'Valorant' }
    ]
  },
  { 
    id: '25', 
    name: 'runi', 
    role: 'IGL/Sentinel', 
    kda: 1.21, 
    winRate: 55, 
    gamesPlayed: 34, 
    title: 'Valorant', 
    titleId: '6',
    biography: {
      realName: 'Runi Lee',
      nationality: 'American',
      birthDate: '2000-08-22',
      hometown: 'San Francisco, California',
      bio: 'Runi emerged from tier 2 to become a respected IGL. His calm demeanor and strategic approach complement his solid fragging ability.',
      playstyle: 'Calculated IGL with consistent performance',
      signature: 'Killjoy, Cypher, Viper',
      careerStart: 2021
    },
    careerHistory: [
      { year: 2024, event: 'VCT Americas', achievement: 'Main Roster Promotion', team: 'Cloud9', title: 'Valorant' },
      { year: 2023, event: 'VCT Challengers', achievement: 'IGL of the Season', team: 'The Guard', title: 'Valorant' }
    ]
  },
  
  {
    id: '26',
    name: 'Perkz',
    role: 'Mid/ADC',
    kda: 5.1,
    winRate: 68,
    gamesPlayed: 28,
    title: 'LoL',
    titleId: '3',
    biography: {
      realName: 'Luka Perković',
      nationality: 'Croatian',
      birthDate: '1998-09-30',
      hometown: 'Zagreb, Croatia',
      bio: 'One of the most decorated Western players in League history, Perkz has won multiple EU LCS championships and reached Worlds finals. His legendary flexibility between mid and ADC roles makes him invaluable.',
      playstyle: 'Clutch performer with championship mentality',
      signature: 'Yasuo, Kai\'Sa, Xayah',
      careerStart: 2015
    },
    careerHistory: [
      { year: 2024, event: 'LCS', achievement: 'Return to Cloud9', team: 'Cloud9', title: 'LoL' },
      { year: 2021, event: 'LCS Spring', achievement: 'Championship Winner', team: 'Cloud9', title: 'LoL' },
      { year: 2019, event: 'Worlds', achievement: 'Finalist', team: 'G2 Esports', title: 'LoL' },
      { year: 2019, event: 'MSI', achievement: 'Championship Winner', team: 'G2 Esports', title: 'LoL' },
      { year: 2018, event: 'Worlds', achievement: 'Semifinals', team: 'G2 Esports', title: 'LoL' },
      { year: 2017, event: 'MSI', achievement: 'Finalist', team: 'G2 Esports', title: 'LoL' }
    ]
  },
  {
    id: '27',
    name: 'Licorice',
    role: 'Top',
    kda: 3.4,
    winRate: 57,
    gamesPlayed: 22,
    title: 'LoL',
    titleId: '3',
    biography: {
      realName: 'Eric Ritchie',
      nationality: 'American',
      birthDate: '1998-07-18',
      hometown: 'North Carolina, USA',
      bio: 'Licorice made his name as a consistent, reliable top laner who rarely loses lane. His teamfighting and teleport plays helped Cloud9 reach multiple LCS finals.',
      playstyle: 'Consistent laner with strong teamfight presence',
      signature: 'Aatrox, Gangplank, Shen',
      careerStart: 2017
    },
    careerHistory: [
      { year: 2024, event: 'Academy Roster', achievement: 'Mentorship Role', team: 'Cloud9 Academy', title: 'LoL' },
      { year: 2020, event: 'LCS Summer', achievement: 'First Team All-Pro', team: 'Cloud9', title: 'LoL' },
      { year: 2018, event: 'Worlds', achievement: 'Semifinals', team: 'Cloud9', title: 'LoL' },
      { year: 2018, event: 'LCS Summer', achievement: 'Second Team All-Pro', team: 'Cloud9', title: 'LoL' }
    ]
  },
  {
    id: '28',
    name: 'Nisqy',
    role: 'Mid',
    kda: 4.6,
    winRate: 60,
    gamesPlayed: 25,
    title: 'LoL',
    titleId: '3',
    biography: {
      realName: 'Yasin Dinçer',
      nationality: 'Belgian/Turkish',
      birthDate: '1999-07-29',
      hometown: 'Brussels, Belgium',
      bio: 'Nisqy is known for his selfless roaming style that enables his teammates to carry. His support-mid approach revolutionized how teams use the mid lane.',
      playstyle: 'Roaming enabler with supportive playstyle',
      signature: 'Twisted Fate, Galio, Taliyah',
      careerStart: 2016
    },
    careerHistory: [
      { year: 2024, event: 'LCS Academy', achievement: 'Development Coach Transition', team: 'Cloud9 Academy', title: 'LoL' },
      { year: 2020, event: 'LCS Spring', achievement: 'Championship Winner', team: 'Cloud9', title: 'LoL' },
      { year: 2019, event: 'LCS Summer', achievement: 'Second Team All-Pro', team: 'Cloud9', title: 'LoL' }
    ]
  },
  {
    id: '29',
    name: 'Sneaky',
    role: 'ADC',
    kda: 5.2,
    winRate: 64,
    gamesPlayed: 20,
    title: 'LoL',
    titleId: '3',
    biography: {
      realName: 'Zachary Scuderi',
      nationality: 'American',
      birthDate: '1994-03-04',
      hometown: 'Florida, USA',
      bio: 'Cloud9 legend Sneaky is one of the most beloved players in NA history. His consistent performance over 7+ years and multiple Worlds appearances cemented his legacy.',
      playstyle: 'Consistent positioning with exceptional teamfighting',
      signature: 'Caitlyn, Lucian, Sivir',
      careerStart: 2012
    },
    careerHistory: [
      { year: 2024, event: 'Special Consultant', achievement: 'Advisory Role', team: 'Cloud9', title: 'LoL' },
      { year: 2019, event: 'Worlds', achievement: 'Quarterfinals Appearance', team: 'Cloud9', title: 'LoL' },
      { year: 2018, event: 'Worlds', achievement: 'Semifinals', team: 'Cloud9', title: 'LoL' },
      { year: 2017, event: 'LCS Finals', achievement: 'Runner-up', team: 'Cloud9', title: 'LoL' },
      { year: 2016, event: 'Worlds', achievement: 'Quarterfinals', team: 'Cloud9', title: 'LoL' },
      { year: 2014, event: 'LCS Spring', achievement: 'Championship Winner', team: 'Cloud9', title: 'LoL' }
    ]
  },
  {
    id: '30',
    name: 'Zeyzal',
    role: 'Support',
    kda: 3.7,
    winRate: 58,
    gamesPlayed: 21,
    title: 'LoL',
    titleId: '3',
    biography: {
      realName: 'Tristan Stidam',
      nationality: 'American',
      birthDate: '1997-05-12',
      hometown: 'California, USA',
      bio: 'Zeyzal emerged as a strong shotcalling support who helped Cloud9 reach Worlds semifinals in his rookie year. His champion ocean and strategic mind are top-tier.',
      playstyle: 'Aggressive engage support with strong vision',
      signature: 'Rakan, Thresh, Leona',
      careerStart: 2018
    },
    careerHistory: [
      { year: 2024, event: 'Coaching Staff', achievement: 'Assistant Coach', team: 'Cloud9 Academy', title: 'LoL' },
      { year: 2019, event: 'LCS Spring', achievement: 'Championship Winner', team: 'Cloud9', title: 'LoL' },
      { year: 2018, event: 'Worlds', achievement: 'Semifinals', team: 'Cloud9', title: 'LoL' }
    ]
  },
  
  {
    id: '31',
    name: 'jakee',
    role: 'Duelist',
    kda: 1.45,
    winRate: 59,
    gamesPlayed: 31,
    title: 'Valorant',
    titleId: '6',
    biography: {
      realName: 'Jake Edwards',
      nationality: 'American',
      birthDate: '2003-02-17',
      hometown: 'Texas, USA',
      bio: 'Young star jakee brings high-octane aggression and fearless entry fragging. His aim is considered among the best in NA Valorant.',
      playstyle: 'Explosive entry with exceptional aim',
      signature: 'Jett, Raze, Reyna',
      careerStart: 2021
    },
    careerHistory: [
      { year: 2024, event: 'VCT Americas', achievement: 'Highest FK/FD ratio', team: 'Cloud9', title: 'Valorant' },
      { year: 2023, event: 'Challengers Ascension', achievement: 'MVP Runner-up', team: 'M80', title: 'Valorant' }
    ]
  },
  {
    id: '32',
    name: 'zander',
    role: 'Controller/IGL',
    kda: 1.26,
    winRate: 57,
    gamesPlayed: 33,
    title: 'Valorant',
    titleId: '6',
    biography: {
      realName: 'Alexander Dituri',
      nationality: 'American',
      birthDate: '2001-06-08',
      hometown: 'Pennsylvania, USA',
      bio: 'Zander combines strategic depth with solid fragging as both a controller and IGL. His flexibility makes him invaluable in Cloud9\'s system.',
      playstyle: 'Smart controller with IGL responsibilities',
      signature: 'Omen, Astra, Viper',
      careerStart: 2020
    },
    careerHistory: [
      { year: 2024, event: 'VCT Challengers', achievement: 'Ascension Qualified', team: 'Cloud9 White', title: 'Valorant' },
      { year: 2023, event: 'VCT Challengers Finals', achievement: 'Top 3 Finish', team: 'M80', title: 'Valorant' },
      { year: 2022, event: 'VCT NA Stage 2', achievement: 'Challengers Winner', team: 'Version1', title: 'Valorant' }
    ]
  },
  {
    id: '33',
    name: 'curry',
    role: 'Sentinel',
    kda: 1.19,
    winRate: 54,
    gamesPlayed: 29,
    title: 'Valorant',
    titleId: '6',
    biography: {
      realName: 'Austin Cyr',
      nationality: 'American',
      birthDate: '2000-11-03',
      hometown: 'New York, USA',
      bio: 'Curry is a veteran sentinel player known for his clutch gene and intelligent site holds. His consistent performances anchor Cloud9\'s defense.',
      playstyle: 'Clutch sentinel with defensive mastery',
      signature: 'Chamber, Killjoy, Sage',
      careerStart: 2020
    },
    careerHistory: [
      { year: 2024, event: 'VCT Americas', achievement: 'Multiple 1vX Clutches', team: 'Cloud9', title: 'Valorant' },
      { year: 2023, event: 'VCT Lock//In', achievement: 'Playoff Performance', team: 'Cloud9', title: 'Valorant' }
    ]
  },
  {
    id: '34',
    name: 'apoth',
    role: 'Initiator',
    kda: 1.33,
    winRate: 58,
    gamesPlayed: 27,
    title: 'Valorant',
    titleId: '6',
    biography: {
      realName: 'Rahul Sood',
      nationality: 'American',
      birthDate: '2002-01-29',
      hometown: 'California, USA',
      bio: 'Apoth\'s intelligent utility usage and information gathering make him a high-value initiator. His coordination with duelists creates perfect entry timings.',
      playstyle: 'Information-focused with perfect util timing',
      signature: 'Sova, Fade, Breach',
      careerStart: 2021
    },
    careerHistory: [
      { year: 2024, event: 'VCT Challengers', achievement: 'Promoted to Main Roster', team: 'Cloud9', title: 'Valorant' },
      { year: 2023, event: 'Challengers League', achievement: 'All-Star Selection', team: 'Cloud9 White', title: 'Valorant' }
    ]
  },
  
  {
    id: '35',
    name: 'electroNic',
    role: 'Rifler',
    kda: 1.29,
    winRate: 55,
    gamesPlayed: 42,
    title: 'CS2',
    titleId: '2',
    biography: {
      realName: 'Denis Sharipov',
      nationality: 'Russian',
      birthDate: '1997-09-07',
      hometown: 'Moscow, Russia',
      bio: 'Electronic is a world-class rifler known for his consistency and clutch performances. Former Na\'Vi star brings championship experience to Cloud9.',
      playstyle: 'Consistent rifler with clutch ability',
      signature: 'Rifle precision, Multi-frags',
      careerStart: 2015
    },
    careerHistory: [
      { year: 2024, event: 'ESL Pro League', achievement: 'Cloud9 Signing', team: 'Cloud9', title: 'CS2' },
      { year: 2021, event: 'PGL Major Stockholm', achievement: 'Champion', team: 'Natus Vincere', title: 'CS2' },
      { year: 2020, event: 'IEM Katowice', achievement: 'Winner', team: 'Natus Vincere', title: 'CS2' },
      { year: 2018, event: 'ESL One Cologne', achievement: 'Champion', team: 'Natus Vincere', title: 'CS2' }
    ]
  },
  {
    id: '36',
    name: 'buster',
    role: 'Support',
    kda: 1.18,
    winRate: 51,
    gamesPlayed: 44,
    title: 'CS2',
    titleId: '2',
    biography: {
      realName: 'Timur Tulepov',
      nationality: 'Kazakhstani',
      birthDate: '1999-03-11',
      hometown: 'Almaty, Kazakhstan',
      bio: 'Buster is a selfless support player who excels at setting up teammates. His utility usage and trades are fundamental to Cloud9\'s structure.',
      playstyle: 'Selfless support with excellent utility',
      signature: 'Flash assists, Trading kills',
      careerStart: 2017
    },
    careerHistory: [
      { year: 2024, event: 'CS2 Season', achievement: 'Consistent Performance', team: 'Cloud9', title: 'CS2' },
      { year: 2022, event: 'Major', achievement: 'Legends Stage', team: 'Gambit', title: 'CS2' },
      { year: 2021, event: 'IEM Winter', achievement: 'Playoff Finish', team: 'Gambit', title: 'CS2' }
    ]
  },
  {
    id: '37',
    name: 'Perfecto',
    role: 'Support',
    kda: 1.14,
    winRate: 53,
    gamesPlayed: 43,
    title: 'CS2',
    titleId: '2',
    biography: {
      realName: 'Ilya Zalutskiy',
      nationality: 'Russian',
      birthDate: '1999-12-24',
      hometown: 'Volgograd, Russia',
      bio: 'Perfecto lives up to his name with near-perfect positioning and decision-making. His low-death playstyle maximizes value in every round.',
      playstyle: 'Perfect positioning with minimal deaths',
      signature: 'Anchor play, Site holds',
      careerStart: 2018
    },
    careerHistory: [
      { year: 2024, event: 'Cloud9 Acquisition', achievement: 'Major Roster Addition', team: 'Cloud9', title: 'CS2' },
      { year: 2021, event: 'PGL Major', achievement: 'Championship Winner', team: 'Natus Vincere', title: 'CS2' },
      { year: 2020, event: 'ESL Pro League', achievement: 'Season Winner', team: 'Natus Vincere', title: 'CS2' }
    ]
  },
  {
    id: '38',
    name: 'Grim',
    role: 'AWPer',
    kda: 1.26,
    winRate: 52,
    gamesPlayed: 40,
    title: 'CS2',
    titleId: '2',
    biography: {
      realName: 'Michael Wince',
      nationality: 'American',
      birthDate: '2000-05-15',
      hometown: 'Ohio, USA',
      bio: 'North American AWPer Grim brings aggressive sniping to Cloud9. His opening picks and aggressive peeks create space for the team.',
      playstyle: 'Aggressive AWPer with high impact',
      signature: 'AWP opening picks, Aggressive angles',
      careerStart: 2019
    },
    careerHistory: [
      { year: 2024, event: 'ESL Challenger', achievement: 'Top AWPer Stats', team: 'Cloud9', title: 'CS2' },
      { year: 2023, event: 'IEM Dallas', achievement: 'Playoff Qualifier', team: 'Complexity', title: 'CS2' },
      { year: 2022, event: 'ESL Pro League', achievement: 'Top 8 Finish', team: 'Complexity', title: 'CS2' }
    ]
  },
  {
    id: '39',
    name: 'HexT',
    role: 'Entry Fragger',
    kda: 1.21,
    winRate: 54,
    gamesPlayed: 38,
    title: 'CS2',
    titleId: '2',
    biography: {
      realName: 'Josh Hext',
      nationality: 'American',
      birthDate: '2001-08-07',
      hometown: 'Texas, USA',
      bio: 'HexT is a young NA talent with explosive entry fragging ability. His fearless T-side aggression opens up sites for Cloud9.',
      playstyle: 'Fearless entry with explosive potential',
      signature: 'First bloods, Site executes',
      careerStart: 2020
    },
    careerHistory: [
      { year: 2024, event: 'Cloud9 Academy Promotion', achievement: 'Main Roster Call-up', team: 'Cloud9', title: 'CS2' },
      { year: 2023, event: 'ESEA Advanced', achievement: 'Division Winner', team: 'Strife', title: 'CS2' }
    ]
  },
  {
    id: '40',
    name: 'automatic',
    role: 'Rifler/IGL',
    kda: 1.19,
    winRate: 50,
    gamesPlayed: 36,
    title: 'CS2',
    titleId: '2',
    biography: {
      realName: 'Timothy Ta',
      nationality: 'American',
      birthDate: '1995-11-07',
      hometown: 'California, USA',
      bio: 'Cloud9 Major champion automatic returns as a veteran leader. His championship experience and smart rifling provide stability.',
      playstyle: 'Intelligent rifler with championship pedigree',
      signature: 'Clutch situations, Smart positioning',
      careerStart: 2014
    },
    careerHistory: [
      { year: 2024, event: 'Cloud9 Return', achievement: 'Veteran Leadership Role', team: 'Cloud9', title: 'CS2' },
      { year: 2018, event: 'ELEAGUE Boston Major', achievement: 'Championship Winner', team: 'Cloud9', title: 'CS2' },
      { year: 2017, event: 'ESL Pro League', achievement: 'Finals Appearance', team: 'Cloud9', title: 'CS2' }
    ]
  },
]

export const MATCHES: Match[] = [
  {
    id: 'm1',
    date: '2024-01-15',
    opponent: 'Team Liquid',
    result: 'win',
    duration: 2145,
    objectives: { dragons: 3, barons: 1, towers: 9 }
  },
  {
    id: 'm2',
    date: '2024-01-14',
    opponent: 'FlyQuest',
    result: 'loss',
    duration: 2567,
    objectives: { dragons: 1, barons: 0, towers: 4 }
  },
  {
    id: 'm3',
    date: '2024-01-13',
    opponent: '100 Thieves',
    result: 'win',
    duration: 1987,
    objectives: { dragons: 4, barons: 2, towers: 11 }
  },
  {
    id: 'm4',
    date: '2024-01-12',
    opponent: 'TSM',
    result: 'win',
    duration: 2234,
    objectives: { dragons: 2, barons: 1, towers: 8 }
  },
  {
    id: 'm5',
    date: '2024-01-11',
    opponent: 'Evil Geniuses',
    result: 'loss',
    duration: 2789,
    objectives: { dragons: 2, barons: 0, towers: 5 }
  },
  {
    id: 'm6',
    date: '2024-01-10',
    opponent: 'Dignitas',
    result: 'win',
    duration: 2456,
    objectives: { dragons: 3, barons: 1, towers: 10 }
  },
  {
    id: 'm7',
    date: '2024-01-09',
    opponent: 'Golden Guardians',
    result: 'win',
    duration: 2098,
    objectives: { dragons: 4, barons: 1, towers: 9 }
  },
  {
    id: 'm8',
    date: '2024-01-08',
    opponent: 'Immortals',
    result: 'loss',
    duration: 2834,
    objectives: { dragons: 1, barons: 0, towers: 3 }
  },
  {
    id: 'm9',
    date: '2024-01-20',
    opponent: 'Sentinels',
    result: 'win',
    duration: 2340,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm10',
    date: '2024-01-19',
    opponent: 'NRG Esports',
    result: 'loss',
    duration: 2680,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm11',
    date: '2024-01-18',
    opponent: 'Evil Geniuses',
    result: 'win',
    duration: 2120,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm12',
    date: '2024-01-17',
    opponent: '100 Thieves',
    result: 'win',
    duration: 2450,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm13',
    date: '2024-01-22',
    opponent: 'FaZe Clan',
    result: 'loss',
    duration: 3120,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm14',
    date: '2024-01-21',
    opponent: 'NAVI',
    result: 'win',
    duration: 2890,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm15',
    date: '2024-01-20',
    opponent: 'Vitality',
    result: 'loss',
    duration: 3340,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm16',
    date: '2024-01-25',
    opponent: 'OpTic Gaming',
    result: 'win',
    duration: 2180,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm17',
    date: '2024-01-24',
    opponent: 'Leviatán',
    result: 'win',
    duration: 2560,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm18',
    date: '2024-01-23',
    opponent: 'LOUD',
    result: 'loss',
    duration: 2890,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm19',
    date: '2024-01-26',
    opponent: 'KRÜ Esports',
    result: 'win',
    duration: 2240,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm20',
    date: '2024-01-27',
    opponent: 'MIBR',
    result: 'win',
    duration: 2100,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm21',
    date: '2024-01-28',
    opponent: 'Astralis',
    result: 'loss',
    duration: 3520,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm22',
    date: '2024-01-27',
    opponent: 'G2 Esports',
    result: 'win',
    duration: 2980,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm23',
    date: '2024-01-26',
    opponent: 'ENCE',
    result: 'win',
    duration: 2750,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm24',
    date: '2024-01-25',
    opponent: 'Complexity',
    result: 'loss',
    duration: 3180,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm25',
    date: '2024-01-30',
    opponent: 'MAD Lions',
    result: 'win',
    duration: 2015,
    objectives: { dragons: 3, barons: 2, towers: 11 }
  },
  {
    id: 'm26',
    date: '2024-01-29',
    opponent: 'Rogue',
    result: 'win',
    duration: 2345,
    objectives: { dragons: 4, barons: 1, towers: 10 }
  },
  {
    id: 'm27',
    date: '2024-01-28',
    opponent: 'Fnatic',
    result: 'loss',
    duration: 2890,
    objectives: { dragons: 2, barons: 0, towers: 6 }
  },
  {
    id: 'm28',
    date: '2024-02-01',
    opponent: 'SK Gaming',
    result: 'win',
    duration: 2220,
    objectives: { dragons: 3, barons: 1, towers: 9 }
  },
  {
    id: 'm29',
    date: '2024-02-02',
    opponent: 'FURIA Esports',
    result: 'win',
    duration: 2450,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
  {
    id: 'm30',
    date: '2024-02-03',
    opponent: 'Paper Rex',
    result: 'loss',
    duration: 2760,
    objectives: { dragons: 0, barons: 0, towers: 0 }
  },
]

export const MISTAKES: Mistake[] = [
  {
    id: 'mk1',
    playerId: '2',
    playerName: 'Blaber',
    category: 'positioning',
    description: 'Over-aggressive invade without vision control leading to death',
    timestamp: '2024-01-14T15:30:00',
    impact: 'critical',
    matchId: 'm2',
    gameTime: 420,
    outcome: 'Lost baron control, enemy secured baron at 24:00',
    mapPosition: { x: 35, y: 25, zone: 'jungle-top' }
  },
  {
    id: 'mk2',
    playerId: '1',
    playerName: 'Fudge',
    category: 'decision-making',
    description: 'Teleport timing error - TPd to losing fight instead of split pushing',
    timestamp: '2024-01-14T15:45:00',
    impact: 'high',
    matchId: 'm2',
    gameTime: 1320,
    outcome: 'Team wiped, lost 3 towers',
    mapPosition: { x: 70, y: 75, zone: 'bot' }
  },
  {
    id: 'mk3',
    playerId: '2',
    playerName: 'Blaber',
    category: 'positioning',
    description: 'Face-checked brush in enemy jungle without team backup',
    timestamp: '2024-01-15T14:20:00',
    impact: 'medium',
    matchId: 'm1',
    gameTime: 680,
    outcome: 'Death but team secured dragon after enemy recall',
    mapPosition: { x: 65, y: 35, zone: 'jungle-top' }
  },
  {
    id: 'mk4',
    playerId: '4',
    playerName: 'Berserker',
    category: 'mechanics',
    description: 'Missed crucial skill shot in team fight, failed to secure kill',
    timestamp: '2024-01-13T16:10:00',
    impact: 'medium',
    matchId: 'm3',
    gameTime: 1560,
    outcome: 'Extended fight duration, support died',
    mapPosition: { x: 50, y: 50, zone: 'river' }
  },
  {
    id: 'mk5',
    playerId: '3',
    playerName: 'Jensen',
    category: 'communication',
    description: 'Called for baron but team wasn\'t in position',
    timestamp: '2024-01-11T17:30:00',
    impact: 'critical',
    matchId: 'm5',
    gameTime: 1880,
    outcome: 'Split team, 3 deaths, lost baron and elder dragon',
    mapPosition: { x: 30, y: 20, zone: 'baron' }
  },
  {
    id: 'mk6',
    playerId: '2',
    playerName: 'Blaber',
    category: 'macro',
    description: 'Prioritized farming over objective control during dragon spawn',
    timestamp: '2024-01-11T17:15:00',
    impact: 'high',
    matchId: 'm5',
    gameTime: 1680,
    outcome: 'Enemy secured soul dragon',
    mapPosition: { x: 70, y: 80, zone: 'dragon' }
  },
  {
    id: 'mk7',
    playerId: '5',
    playerName: 'Zven',
    category: 'positioning',
    description: 'Out of position during team rotation, caught and killed',
    timestamp: '2024-01-12T15:50:00',
    impact: 'medium',
    matchId: 'm4',
    gameTime: 890,
    outcome: '4v5 fight, lost but survived with inhibitor intact',
    mapPosition: { x: 45, y: 65, zone: 'river' }
  },
  {
    id: 'mk8',
    playerId: '1',
    playerName: 'Fudge',
    category: 'decision-making',
    description: 'Engaged without checking ultimate cooldowns',
    timestamp: '2024-01-15T14:35:00',
    impact: 'low',
    matchId: 'm1',
    gameTime: 1020,
    outcome: 'Team disengaged safely, no casualties',
    mapPosition: { x: 55, y: 40, zone: 'mid' }
  },
  {
    id: 'mk9',
    playerId: '2',
    playerName: 'Blaber',
    category: 'positioning',
    description: 'Invaded enemy jungle at level 2 without lane priority',
    timestamp: '2024-01-08T16:05:00',
    impact: 'critical',
    matchId: 'm8',
    gameTime: 180,
    outcome: 'First blood given, lost jungle camps, enemy jungler snowballed',
    mapPosition: { x: 60, y: 40, zone: 'jungle-top' }
  },
  {
    id: 'mk10',
    playerId: '3',
    playerName: 'Jensen',
    category: 'communication',
    description: 'Failed to call missing enemy mid laner during roam',
    timestamp: '2024-01-08T16:15:00',
    impact: 'high',
    matchId: 'm8',
    gameTime: 480,
    outcome: 'Bot lane ganked, ADC died, lost tower plates',
    mapPosition: { x: 50, y: 50, zone: 'mid' }
  },
  {
    id: 'mk11',
    playerId: '1',
    playerName: 'Fudge',
    category: 'mechanics',
    description: 'Missed flash timing in crucial team fight escape',
    timestamp: '2024-01-10T14:25:00',
    impact: 'medium',
    matchId: 'm6',
    gameTime: 1245,
    outcome: 'Died but team won 4v4 fight afterward',
    mapPosition: { x: 25, y: 30, zone: 'top' }
  },
  {
    id: 'mk12',
    playerId: '4',
    playerName: 'Berserker',
    category: 'positioning',
    description: 'Overextended in lane without ward coverage',
    timestamp: '2024-01-09T15:30:00',
    impact: 'low',
    matchId: 'm7',
    gameTime: 645,
    outcome: 'Used flash defensively, no death but pressure lost',
    mapPosition: { x: 75, y: 70, zone: 'bot' }
  },
  {
    id: 'mk13',
    playerId: '5',
    playerName: 'Zven',
    category: 'macro',
    description: 'Stayed in base too long after respawn, missed objective setup',
    timestamp: '2024-01-10T14:40:00',
    impact: 'medium',
    matchId: 'm6',
    gameTime: 1680,
    outcome: 'Team delayed dragon take, almost contested',
    mapPosition: { x: 15, y: 85, zone: 'base' }
  },
  {
    id: 'mk14',
    playerId: '2',
    playerName: 'Blaber',
    category: 'decision-making',
    description: 'Attempted solo baron when team was too far away',
    timestamp: '2024-01-08T16:45:00',
    impact: 'critical',
    matchId: 'm8',
    gameTime: 1920,
    outcome: 'Caught and killed, enemy team secured baron, lost game',
    mapPosition: { x: 28, y: 22, zone: 'baron' }
  },
  {
    id: 'mk15',
    playerId: '9',
    playerName: 'Xeta',
    category: 'positioning',
    description: 'Smoke placement blocked team\'s push line of sight',
    timestamp: '2024-01-20T14:15:00',
    impact: 'medium',
    matchId: 'm9',
    gameTime: 780,
    outcome: 'Lost site control, forced to rotate',
    mapPosition: { x: 45, y: 55, zone: 'mid' }
  },
  {
    id: 'mk16',
    playerId: '11',
    playerName: 'leaf',
    category: 'decision-making',
    description: 'Overpeeked after getting first kill, traded unnecessarily',
    timestamp: '2024-01-19T15:30:00',
    impact: 'high',
    matchId: 'm10',
    gameTime: 1240,
    outcome: '4v4 instead of 5v4 advantage, lost round',
    mapPosition: { x: 70, y: 30, zone: 'top' }
  },
  {
    id: 'mk17',
    playerId: '10',
    playerName: 'vanity',
    category: 'communication',
    description: 'Late rotation call led to split team positioning',
    timestamp: '2024-01-19T15:45:00',
    impact: 'critical',
    matchId: 'm10',
    gameTime: 1580,
    outcome: 'Team divided, lost 3 members, round loss',
    mapPosition: { x: 50, y: 50, zone: 'mid' }
  },
  {
    id: 'mk18',
    playerId: '14',
    playerName: 'oxy',
    category: 'mechanics',
    description: 'Whiffed crucial operator shot in clutch situation',
    timestamp: '2024-01-18T16:20:00',
    impact: 'critical',
    matchId: 'm11',
    gameTime: 1920,
    outcome: 'Lost 1v1, enemy planted bomb, lost round',
    mapPosition: { x: 35, y: 65, zone: 'bot' }
  },
  {
    id: 'mk19',
    playerId: '12',
    playerName: 'Xeppaa',
    category: 'positioning',
    description: 'Peeked too aggressively without util backup',
    timestamp: '2024-01-17T14:50:00',
    impact: 'medium',
    matchId: 'm12',
    gameTime: 890,
    outcome: 'Early death, 4v5 but team won round',
    mapPosition: { x: 60, y: 40, zone: 'jungle-top' }
  },
  {
    id: 'mk20',
    playerId: '17',
    playerName: 'JT',
    category: 'decision-making',
    description: 'Called risky force buy instead of saving for next round',
    timestamp: '2024-01-22T17:10:00',
    impact: 'high',
    matchId: 'm13',
    gameTime: 1120,
    outcome: 'Lost force buy and next two rounds due to economy',
    mapPosition: { x: 15, y: 85, zone: 'base' }
  },
  {
    id: 'mk21',
    playerId: '18',
    playerName: 'Ax1Le',
    category: 'mechanics',
    description: 'Missed spray control in close-range engagement',
    timestamp: '2024-01-21T16:35:00',
    impact: 'medium',
    matchId: 'm14',
    gameTime: 1450,
    outcome: 'Lost duel, but team traded and won round',
    mapPosition: { x: 55, y: 45, zone: 'mid' }
  },
  {
    id: 'mk22',
    playerId: '20',
    playerName: 'nafany',
    category: 'positioning',
    description: 'Poor AWP position exposed to multiple angles',
    timestamp: '2024-01-20T18:15:00',
    impact: 'critical',
    matchId: 'm15',
    gameTime: 2140,
    outcome: 'Lost AWP early, enemy economy boost, lost next 3 rounds',
    mapPosition: { x: 50, y: 50, zone: 'river' }
  },
  {
    id: 'mk23',
    playerId: '21',
    playerName: 'sh1ro',
    category: 'communication',
    description: 'Didn\'t call out low HP enemy position',
    timestamp: '2024-01-20T18:25:00',
    impact: 'high',
    matchId: 'm15',
    gameTime: 2380,
    outcome: 'Teammate peeked expecting fight, got surprised and died',
    mapPosition: { x: 65, y: 55, zone: 'top' }
  },
  {
    id: 'mk24',
    playerId: '13',
    playerName: 'mitch',
    category: 'macro',
    description: 'Played too passively on defensive setup, gave map control',
    timestamp: '2024-01-19T15:15:00',
    impact: 'medium',
    matchId: 'm10',
    gameTime: 980,
    outcome: 'Lost mid control, forced into retake situation',
    mapPosition: { x: 40, y: 50, zone: 'mid' }
  },
  {
    id: 'mk25',
    playerId: '6',
    playerName: 'Vulcan',
    category: 'positioning',
    description: 'Roamed too far from ADC during laning phase',
    timestamp: '2024-01-16T14:20:00',
    impact: 'medium',
    matchId: 'm3',
    gameTime: 720,
    outcome: 'ADC caught 1v2, died and lost lane pressure',
    mapPosition: { x: 70, y: 60, zone: 'bot' }
  },
  {
    id: 'mk26',
    playerId: '22',
    playerName: 'Bwipo',
    category: 'decision-making',
    description: 'Took unfavorable trade in top lane without jungle proximity',
    timestamp: '2024-01-15T14:55:00',
    impact: 'high',
    matchId: 'm1',
    gameTime: 1180,
    outcome: 'Died, lost wave and tower plates',
    mapPosition: { x: 25, y: 25, zone: 'top' }
  },
  {
    id: 'mk27',
    playerId: '23',
    playerName: 'Jojopyun',
    category: 'mechanics',
    description: 'Missed combo execution in crucial team fight',
    timestamp: '2024-01-14T15:55:00',
    impact: 'critical',
    matchId: 'm2',
    gameTime: 1680,
    outcome: 'Didn\'t burst carry, team lost fight and baron',
    mapPosition: { x: 50, y: 45, zone: 'mid' }
  },
  {
    id: 'mk28',
    playerId: '15',
    playerName: 'moose',
    category: 'communication',
    description: 'Failed to call out flanking enemy player',
    timestamp: '2024-01-18T16:40:00',
    impact: 'high',
    matchId: 'm11',
    gameTime: 1340,
    outcome: 'Team got sandwiched, lost 3 players',
    mapPosition: { x: 30, y: 70, zone: 'bot' }
  },
  {
    id: 'mk29',
    playerId: '16',
    playerName: 'v1c',
    category: 'positioning',
    description: 'Used recon ability from exposed position',
    timestamp: '2024-01-17T15:10:00',
    impact: 'medium',
    matchId: 'm12',
    gameTime: 1120,
    outcome: 'Got traded but info gained helped team win',
    mapPosition: { x: 55, y: 35, zone: 'jungle-top' }
  },
  {
    id: 'mk30',
    playerId: '19',
    playerName: 'Hobbit',
    category: 'macro',
    description: 'Played wrong side of map for next circle rotation',
    timestamp: '2024-01-22T17:35:00',
    impact: 'high',
    matchId: 'm13',
    gameTime: 2280,
    outcome: 'Team had to rotate late, lost better positioning',
    mapPosition: { x: 20, y: 80, zone: 'bot' }
  },
  {
    id: 'mk31',
    playerId: '24',
    playerName: 'wiz',
    category: 'decision-making',
    description: 'Pushed alone without team backup after round won',
    timestamp: '2024-01-20T14:35:00',
    impact: 'low',
    matchId: 'm9',
    gameTime: 980,
    outcome: 'Died but round already won, no economic impact',
    mapPosition: { x: 75, y: 70, zone: 'bot' }
  },
  {
    id: 'mk32',
    playerId: '25',
    playerName: 'runi',
    category: 'communication',
    description: 'Unclear mid-round call led to confused executions',
    timestamp: '2024-01-18T16:05:00',
    impact: 'critical',
    matchId: 'm11',
    gameTime: 1680,
    outcome: 'Team split between two strats, easy defend for enemy',
    mapPosition: { x: 50, y: 50, zone: 'mid' }
  },
  {
    id: 'mk33',
    playerId: '26',
    playerName: 'Perkz',
    category: 'positioning',
    description: 'Face-checked bush without support nearby in late game',
    timestamp: '2024-01-30T16:20:00',
    impact: 'critical',
    matchId: 'm25',
    gameTime: 2140,
    outcome: 'Caught and killed, lost game-winning teamfight',
    mapPosition: { x: 60, y: 35, zone: 'jungle-top' }
  },
  {
    id: 'mk34',
    playerId: '27',
    playerName: 'Licorice',
    category: 'decision-making',
    description: 'Stayed in lane for extra wave instead of TP to dragon fight',
    timestamp: '2024-01-29T15:45:00',
    impact: 'high',
    matchId: 'm26',
    gameTime: 1580,
    outcome: '4v5 at dragon, lost fight and soul dragon',
    mapPosition: { x: 20, y: 20, zone: 'top' }
  },
  {
    id: 'mk35',
    playerId: '28',
    playerName: 'Nisqy',
    category: 'mechanics',
    description: 'Missed crucial skill shot on priority target',
    timestamp: '2024-01-28T16:30:00',
    impact: 'high',
    matchId: 'm27',
    gameTime: 1920,
    outcome: 'Enemy carry survived and cleaned up teamfight',
    mapPosition: { x: 50, y: 50, zone: 'river' }
  },
  {
    id: 'mk36',
    playerId: '31',
    playerName: 'jakee',
    category: 'positioning',
    description: 'Dry peeked operator angle without utility clearing',
    timestamp: '2024-02-01T14:25:00',
    impact: 'high',
    matchId: 'm28',
    gameTime: 1240,
    outcome: 'Instant death, lost man advantage',
    mapPosition: { x: 55, y: 45, zone: 'mid' }
  },
  {
    id: 'mk37',
    playerId: '32',
    playerName: 'zander',
    category: 'communication',
    description: 'Called aggressive push but smoke was on cooldown',
    timestamp: '2024-02-02T15:10:00',
    impact: 'critical',
    matchId: 'm29',
    gameTime: 1680,
    outcome: 'Team pushed without smokes, got picked off easily',
    mapPosition: { x: 45, y: 55, zone: 'mid' }
  },
  {
    id: 'mk38',
    playerId: '33',
    playerName: 'curry',
    category: 'positioning',
    description: 'Chamber TP placed in predictable location',
    timestamp: '2024-02-02T15:30:00',
    impact: 'medium',
    matchId: 'm29',
    gameTime: 1980,
    outcome: 'TP location pre-aimed, died on teleport',
    mapPosition: { x: 70, y: 60, zone: 'bot' }
  },
  {
    id: 'mk39',
    playerId: '34',
    playerName: 'apoth',
    category: 'decision-making',
    description: 'Used recon dart too early, gave away team position',
    timestamp: '2024-02-03T14:50:00',
    impact: 'high',
    matchId: 'm30',
    gameTime: 1120,
    outcome: 'Enemy adjusted strategy, caught team off guard',
    mapPosition: { x: 40, y: 50, zone: 'mid' }
  },
  {
    id: 'mk40',
    playerId: '35',
    playerName: 'electroNic',
    category: 'mechanics',
    description: 'Overcommitted to spray through smoke without confirmation',
    timestamp: '2024-01-28T17:20:00',
    impact: 'medium',
    matchId: 'm21',
    gameTime: 1450,
    outcome: 'Wasted ammo, got caught reloading',
    mapPosition: { x: 50, y: 50, zone: 'mid' }
  },
  {
    id: 'mk41',
    playerId: '36',
    playerName: 'buster',
    category: 'communication',
    description: 'Threw flash without warning teammate in flashbang range',
    timestamp: '2024-01-27T16:40:00',
    impact: 'critical',
    matchId: 'm22',
    gameTime: 1780,
    outcome: 'Blinded teammate, both killed in critical round',
    mapPosition: { x: 65, y: 40, zone: 'jungle-top' }
  },
  {
    id: 'mk42',
    playerId: '37',
    playerName: 'Perfecto',
    category: 'positioning',
    description: 'Held angle too tight, got flanked from rotation',
    timestamp: '2024-01-26T18:05:00',
    impact: 'high',
    matchId: 'm23',
    gameTime: 2140,
    outcome: 'Lost site anchor, enemy took easy site control',
    mapPosition: { x: 75, y: 75, zone: 'bot' }
  },
  {
    id: 'mk43',
    playerId: '38',
    playerName: 'Grim',
    category: 'decision-making',
    description: 'Over-aggressive AWP peek cost weapon and round',
    timestamp: '2024-01-25T17:30:00',
    impact: 'critical',
    matchId: 'm24',
    gameTime: 1920,
    outcome: 'Lost AWP early, enemy economy advantage led to series loss',
    mapPosition: { x: 50, y: 45, zone: 'mid' }
  },
  {
    id: 'mk44',
    playerId: '39',
    playerName: 'HexT',
    category: 'mechanics',
    description: 'Rushed site entry without checking common angles',
    timestamp: '2024-01-25T17:50:00',
    impact: 'medium',
    matchId: 'm24',
    gameTime: 2280,
    outcome: 'First man down but team still won 4v5',
    mapPosition: { x: 70, y: 30, zone: 'top' }
  },
  {
    id: 'mk45',
    playerId: '40',
    playerName: 'automatic',
    category: 'macro',
    description: 'Saved weapon instead of committing to winnable retake',
    timestamp: '2024-01-27T16:55:00',
    impact: 'high',
    matchId: 'm22',
    gameTime: 2520,
    outcome: 'Lost round unnecessarily, saved gun but lost momentum',
    mapPosition: { x: 15, y: 85, zone: 'base' }
  },
]

export const INSIGHTS: Insight[] = [
  {
    id: 'in1',
    type: 'pattern',
    severity: 'critical',
    title: 'Recurring Jungle Over-Aggression Pattern',
    description: 'Blaber consistently invades enemy jungle without vision control or lane priority, resulting in deaths that directly cost objective control.',
    affectedPlayers: ['2'],
    frequency: 0.67,
    impactOnWinRate: -15,
    relatedMistakes: ['mk1', 'mk3', 'mk6'],
    recommendation: 'Implement pre-invade vision protocol: require 2+ enemy positions confirmed before deep invade. Practice risk assessment drills.',
    confidence: 0.89
  },
  {
    id: 'in2',
    type: 'correlation',
    severity: 'critical',
    title: 'Communication Breakdown → Objective Loss Chain',
    description: 'Misaligned objective calls correlate with 85% of baron/elder losses. Jensen and Blaber show pattern of initiating plays without confirming team readiness.',
    affectedPlayers: ['2', '3'],
    frequency: 0.45,
    impactOnWinRate: -22,
    relatedMistakes: ['mk5', 'mk6'],
    recommendation: 'Institute verbal confirmation protocol for high-stakes objective plays. Require all 5 players to confirm readiness before baron/elder attempts.',
    confidence: 0.92
  },
  {
    id: 'in3',
    type: 'trend',
    severity: 'high',
    title: 'Top Lane TP Usage Declining in Effectiveness',
    description: 'Fudge\'s teleport usage effectiveness has dropped 30% over last 8 games. Pattern shows reactive TP to losing fights rather than proactive map pressure.',
    affectedPlayers: ['1'],
    frequency: 0.56,
    impactOnWinRate: -8,
    relatedMistakes: ['mk2', 'mk8'],
    recommendation: 'Review split-push timing with Fudge. Establish clear decision tree: TP only if fight is even/winning OR to create cross-map pressure, never to lost causes.',
    confidence: 0.81
  },
  {
    id: 'in4',
    type: 'recommendation',
    severity: 'medium',
    title: 'Pre-Fight Coordination Opportunity',
    description: 'Team shows 40% higher win rate when ultimate cooldowns are verbally confirmed before engages. Currently only happening in 35% of teamfights.',
    affectedPlayers: ['1', '2', '3', '4', '5'],
    frequency: 0.35,
    impactOnWinRate: 12,
    relatedMistakes: ['mk8'],
    recommendation: 'Make ultimate cooldown callouts mandatory before any planned engage. Designate support (Zven) as cooldown coordinator.',
    confidence: 0.76
  },
  {
    id: 'in5',
    type: 'pattern',
    severity: 'medium',
    title: 'Mid-Game Positioning Lapses During Rotations',
    description: 'Support player consistently trails team during rotations, creating 4v5 vulnerabilities. Occurs primarily during 15-25 minute window.',
    affectedPlayers: ['5'],
    frequency: 0.42,
    impactOnWinRate: -6,
    relatedMistakes: ['mk7'],
    recommendation: 'Zven should prioritize movement speed items earlier. Practice rotation drills focusing on positioning within team formation.',
    confidence: 0.73
  },
  {
    id: 'in6',
    type: 'pattern',
    severity: 'high',
    title: 'Valorant IGL Communication Timing Issues',
    description: 'vanity and runi both show delayed rotation calls causing team splits. Pattern emerges in rounds 7-10 when economy is tight.',
    affectedPlayers: ['10', '25'],
    frequency: 0.58,
    impactOnWinRate: -14,
    relatedMistakes: ['mk17', 'mk32'],
    recommendation: 'Implement earlier mid-round call protocol. IGLs should call rotations 5 seconds earlier to account for team movement time.',
    confidence: 0.84
  },
  {
    id: 'in7',
    type: 'correlation',
    severity: 'critical',
    title: 'Post-First-Kill Aggression Pattern in Valorant',
    description: 'leaf and oxy show tendency to overpeek after securing first kill, resulting in unnecessary trades. 68% of these trades cost rounds.',
    affectedPlayers: ['11', '14'],
    frequency: 0.63,
    impactOnWinRate: -18,
    relatedMistakes: ['mk16', 'mk18'],
    recommendation: 'Institute "kill and fall back" discipline. After first pick, duelists must regroup with team unless IGL explicitly calls for push.',
    confidence: 0.91
  },
  {
    id: 'in8',
    type: 'trend',
    severity: 'high',
    title: 'CS2 Economic Decision-Making Decline',
    description: 'JT\'s force buy calls have 35% success rate, well below optimal. Pattern shows emotional buying after lost rounds rather than calculated economy management.',
    affectedPlayers: ['17'],
    frequency: 0.48,
    impactOnWinRate: -16,
    relatedMistakes: ['mk20'],
    recommendation: 'Implement strict economy flowchart. IGL should consult with nafany (AWPer) before any force buy decisions to ensure AWP economy.',
    confidence: 0.87
  },
  {
    id: 'in9',
    type: 'pattern',
    severity: 'critical',
    title: 'CS2 AWP Position Vulnerability Pattern',
    description: 'nafany consistently takes AWP positions with multiple exposed angles, leading to early AWP losses that devastate team economy.',
    affectedPlayers: ['20'],
    frequency: 0.71,
    impactOnWinRate: -24,
    relatedMistakes: ['mk22'],
    recommendation: 'Mandatory AWP position review with coach. nafany should only hold positions with 1-2 angles max and guaranteed escape route.',
    confidence: 0.94
  },
  {
    id: 'in10',
    type: 'recommendation',
    severity: 'medium',
    title: 'Cross-Team Communication Style Optimization',
    description: 'Analysis shows LoL team benefits from verbose comms while CS2 team performs better with minimal callouts. Valorant team falls in between.',
    affectedPlayers: ['1', '2', '3', '4', '5', '17', '18', '19', '20', '21'],
    frequency: 0.82,
    impactOnWinRate: 9,
    relatedMistakes: [],
    recommendation: 'Tailor communication training by title. LoL: maintain current style. CS2: reduce non-essential comms. Valorant: balance based on round phase.',
    confidence: 0.79
  },
  {
    id: 'in11',
    type: 'correlation',
    severity: 'high',
    title: 'Utility Usage Efficiency Gap in Valorant',
    description: 'Xeta and moose (Controllers) show 40% lower utility efficiency than opponents. Smokes often misplaced or poorly timed, costing map control.',
    affectedPlayers: ['9', '15'],
    frequency: 0.54,
    impactOnWinRate: -11,
    relatedMistakes: ['mk15', 'mk28'],
    recommendation: 'Implement utility-specific VOD review sessions. Controllers should study opponent smoke setups and practice standard lineups daily.',
    confidence: 0.83
  },
  {
    id: 'in12',
    type: 'trend',
    severity: 'medium',
    title: 'LoL Academy Roster Integration Success',
    description: 'Vulcan and Bwipo showing strong synergy metrics when playing together. Win rate jumps 12% compared to other roster configurations.',
    affectedPlayers: ['6', '22'],
    frequency: 0.89,
    impactOnWinRate: 12,
    relatedMistakes: [],
    recommendation: 'Consider Vulcan-Bwipo as core duo for critical matches. Both players show complementary aggressive playstyles that synergize well.',
    confidence: 0.77
  },
  {
    id: 'in13',
    type: 'pattern',
    severity: 'high',
    title: 'CS2 Team Flash Coordination Issues',
    description: 'buster and electroNic show poor flash coordination, with 42% of flashes negatively impacting teammates. This is above league average of 18%.',
    affectedPlayers: ['35', '36'],
    frequency: 0.62,
    impactOnWinRate: -13,
    relatedMistakes: ['mk40', 'mk41'],
    recommendation: 'Implement mandatory flash warnings protocol. Use specific callouts for pop-flash vs. standard flash. Practice coordinated utility in custom matches.',
    confidence: 0.86
  },
  {
    id: 'in14',
    type: 'correlation',
    severity: 'critical',
    title: 'Valorant Entry Fragger Overconfidence Pattern',
    description: 'jakee and wiz both display overaggression after winning duels, leading to unnecessary deaths. This pattern intensifies when team is ahead.',
    affectedPlayers: ['24', '31'],
    frequency: 0.69,
    impactOnWinRate: -17,
    relatedMistakes: ['mk31', 'mk36'],
    recommendation: 'Coach should emphasize discipline during team lead scenarios. Implement "bank the advantage" mentality - preserve numbers advantage over seeking additional frags.',
    confidence: 0.88
  },
  {
    id: 'in15',
    type: 'trend',
    severity: 'high',
    title: 'AWP Economy Impact Across CS2 Roster',
    description: 'Grim\'s aggressive AWP style results in 22% more AWP deaths than league average, creating recurring economy deficits that cost rounds.',
    affectedPlayers: ['38'],
    frequency: 0.71,
    impactOnWinRate: -19,
    relatedMistakes: ['mk43'],
    recommendation: 'Balance Grim\'s aggressive style with conservative rounds. On important economy rounds, limit AWP aggression to percentage-play positions only.',
    confidence: 0.92
  },
  {
    id: 'in16',
    type: 'pattern',
    severity: 'medium',
    title: 'Cross-Title Player Adaptation Success',
    description: 'Perkz and Nisqy (both flexible role players) show 15% faster adaptation to meta shifts compared to role-specialists, suggesting value in roster flexibility.',
    affectedPlayers: ['26', '28'],
    frequency: 0.78,
    impactOnWinRate: 8,
    relatedMistakes: [],
    recommendation: 'Prioritize versatile players in future roster decisions. Consider role-swap training for current specialists to increase strategic flexibility.',
    confidence: 0.74
  },
  {
    id: 'in17',
    type: 'recommendation',
    severity: 'medium',
    title: 'Sentinel Positioning Consistency in Valorant',
    description: 'curry shows exceptional consistency in defensive positioning with 89% site hold rate, significantly above team average of 67%.',
    affectedPlayers: ['33'],
    frequency: 0.89,
    impactOnWinRate: 14,
    relatedMistakes: [],
    recommendation: 'Have curry create defensive positioning guide for team. His site anchor principles should be standard practice for all players in sentinel roles.',
    confidence: 0.81
  },
  {
    id: 'in18',
    type: 'correlation',
    severity: 'high',
    title: 'CS2 Veteran Leadership Impact',
    description: 'automatic and Perfecto\'s presence correlates with 23% reduction in panic decisions during clutch scenarios. Their calm communication stabilizes team.',
    affectedPlayers: ['37', '40'],
    frequency: 0.84,
    impactOnWinRate: 16,
    relatedMistakes: [],
    recommendation: 'Maximize veteran presence in high-stakes matches. Consider having automatic or Perfecto handle mid-round adjustments during clutch situations.',
    confidence: 0.87
  }
]

export const STRATEGIC_IMPACTS: StrategicImpact[] = [
  {
    mistakeCategory: 'positioning',
    occurrences: 18,
    avgTimeToObjectiveLoss: 240,
    winRateImpact: -12,
    objectivesLost: 12
  },
  {
    mistakeCategory: 'decision-making',
    occurrences: 11,
    avgTimeToObjectiveLoss: 180,
    winRateImpact: -10,
    objectivesLost: 8
  },
  {
    mistakeCategory: 'communication',
    occurrences: 12,
    avgTimeToObjectiveLoss: 120,
    winRateImpact: -19,
    objectivesLost: 10
  },
  {
    mistakeCategory: 'macro',
    occurrences: 5,
    avgTimeToObjectiveLoss: 300,
    winRateImpact: -12,
    objectivesLost: 4
  },
  {
    mistakeCategory: 'mechanics',
    occurrences: 9,
    avgTimeToObjectiveLoss: 420,
    winRateImpact: -7,
    objectivesLost: 4
  }
]

export function getPlayerAnalytics(playerId: string): PlayerAnalytics {
  const player = PLAYERS.find(p => p.id === playerId)!
  const playerMistakes = MISTAKES.filter(m => m.playerId === playerId)
  
  const mistakesByCategory = playerMistakes.reduce((acc, mistake) => {
    acc[mistake.category] = (acc[mistake.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const getTrend = (count: number): 'improving' | 'stable' | 'declining' => {
    if (count > 2) return 'declining'
    if (count > 1) return 'stable'
    return 'improving'
  }
  
  return {
    playerId: player.id,
    playerName: player.name,
    topMistakes: Object.entries(mistakesByCategory)
      .map(([category, count]) => ({
        category,
        count,
        trend: getTrend(count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3),
    performanceTrend: [
      { date: '2024-01-11', kda: player.kda - 0.8, mistakes: 3 },
      { date: '2024-01-12', kda: player.kda - 0.4, mistakes: 1 },
      { date: '2024-01-13', kda: player.kda + 0.2, mistakes: 1 },
      { date: '2024-01-14', kda: player.kda - 0.6, mistakes: 2 },
      { date: '2024-01-15', kda: player.kda + 0.4, mistakes: 2 },
    ],
    comparedToAverage: {
      kda: player.kda - 4.2,
      mistakeFrequency: (playerMistakes.length / player.gamesPlayed) - 1.5,
      objectiveContribution: player.role === 'Jungle' ? 0.15 : player.role === 'Support' ? 0.08 : -0.05
    }
  }
}

export async function generateAIInsight(matchData: Match, mistakes: Mistake[]): Promise<string> {
  try {
    const mistakesList = mistakes.map(m => 
      `- ${m.playerName} (${m.category}): ${m.description} - Impact: ${m.impact}, Outcome: ${m.outcome}`
    ).join('\n')
    
    const matchResult = matchData.result
    const opponent = matchData.opponent
    const duration = Math.floor(matchData.duration / 60)
    const dragons = matchData.objectives.dragons
    const barons = matchData.objectives.barons
    const towers = matchData.objectives.towers
    
    const prompt = (window.spark.llmPrompt as any)`You are an esports analytics AI assistant analyzing League of Legends match data.

Match Result: ${matchResult}
Opponent: ${opponent}
Duration: ${duration} minutes
Objectives: ${dragons} dragons, ${barons} barons, ${towers} towers

Key Mistakes:
${mistakesList}

Provide a concise 2-3 sentence strategic insight connecting these individual mistakes to the match outcome and macro strategy. Focus on actionable coaching points.`

    const insight = await window.spark.llm(prompt, 'gpt-4o-mini')
    return insight
  } catch (error) {
    console.error('AI insight generation failed:', error)
    return 'Analysis in progress. Pattern recognition systems are processing match data to identify strategic correlations.'
  }
}

export function createInitialLiveMatch(): LiveMatch {
  const champions = ['Aatrox', 'Lee Sin', 'Orianna', 'Jinx', 'Thresh']
  
  return {
    id: 'live-1',
    isActive: false,
    opponent: 'Team Liquid',
    gameTime: 0,
    teamGold: 2500,
    enemyGold: 2500,
    objectives: {
      dragons: 0,
      barons: 0,
      towers: 0
    },
    enemyObjectives: {
      dragons: 0,
      barons: 0,
      towers: 0
    },
    players: PLAYERS.map((player, index) => ({
      id: player.id,
      name: player.name,
      role: player.role,
      kills: 0,
      deaths: 0,
      assists: 0,
      cs: 0,
      gold: 500,
      champion: champions[index]
    }))
  }
}

export function simulateLiveMatchUpdate(currentMatch: LiveMatch): LiveMatch {
  const updatedPlayers: LiveMatchPlayer[] = currentMatch.players.map(player => {
    const baseKills = player.kills
    const baseDeaths = player.deaths
    const baseAssists = player.assists
    
    const killChance = Math.random()
    const deathChance = Math.random()
    const assistChance = Math.random()
    
    let newKills = baseKills
    let newDeaths = baseDeaths
    let newAssists = baseAssists
    
    if (killChance > 0.92) {
      newKills += 1
      newAssists += Math.random() > 0.5 ? 1 : 0
    }
    
    if (deathChance > 0.94) {
      newDeaths += 1
    }
    
    if (assistChance > 0.85 && newKills === baseKills) {
      newAssists += 1
    }
    
    const csGain = Math.floor(Math.random() * 3) + 1
    const goldGain = csGain * 20 + (newKills > baseKills ? 300 : 0) + (newAssists > baseAssists ? 150 : 0)
    
    return {
      ...player,
      kills: newKills,
      deaths: newDeaths,
      assists: newAssists,
      cs: player.cs + csGain,
      gold: player.gold + goldGain
    }
  })
  
  const totalTeamGold = updatedPlayers.reduce((sum, p) => sum + p.gold, 0)
  const enemyGoldGain = Math.floor(Math.random() * 1000) + 500
  
  const objectives = { ...currentMatch.objectives }
  const enemyObjectives = { ...currentMatch.enemyObjectives }
  
  if (currentMatch.gameTime > 300 && currentMatch.gameTime % 120 === 0) {
    if (Math.random() > 0.5) {
      objectives.dragons += 1
    } else {
      enemyObjectives.dragons += 1
    }
  }
  
  if (currentMatch.gameTime > 1200 && Math.random() > 0.97) {
    if (Math.random() > 0.5) {
      objectives.barons += 1
    } else {
      enemyObjectives.barons += 1
    }
  }
  
  if (Math.random() > 0.95) {
    if (Math.random() > 0.5) {
      objectives.towers += 1
    } else {
      enemyObjectives.towers += 1
    }
  }
  
  return {
    ...currentMatch,
    gameTime: currentMatch.gameTime + 1,
    teamGold: totalTeamGold,
    enemyGold: currentMatch.enemyGold + enemyGoldGain,
    objectives,
    enemyObjectives,
    players: updatedPlayers
  }
}
