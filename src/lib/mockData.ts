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
  
  { id: '22', name: 'Bwipo', role: 'Top', kda: 3.8, winRate: 62, gamesPlayed: 26, title: 'LoL', titleId: '3' },
  { id: '23', name: 'Jojopyun', role: 'Mid', kda: 4.9, winRate: 63, gamesPlayed: 24, title: 'LoL', titleId: '3' },
  { id: '24', name: 'wiz', role: 'Duelist', kda: 1.38, winRate: 56, gamesPlayed: 30, title: 'Valorant', titleId: '6' },
  { id: '25', name: 'runi', role: 'IGL/Sentinel', kda: 1.21, winRate: 55, gamesPlayed: 34, title: 'Valorant', titleId: '6' },
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
  }
]

export const STRATEGIC_IMPACTS: StrategicImpact[] = [
  {
    mistakeCategory: 'positioning',
    occurrences: 12,
    avgTimeToObjectiveLoss: 240,
    winRateImpact: -12,
    objectivesLost: 8
  },
  {
    mistakeCategory: 'decision-making',
    occurrences: 7,
    avgTimeToObjectiveLoss: 180,
    winRateImpact: -10,
    objectivesLost: 5
  },
  {
    mistakeCategory: 'communication',
    occurrences: 8,
    avgTimeToObjectiveLoss: 120,
    winRateImpact: -19,
    objectivesLost: 7
  },
  {
    mistakeCategory: 'macro',
    occurrences: 3,
    avgTimeToObjectiveLoss: 300,
    winRateImpact: -12,
    objectivesLost: 3
  },
  {
    mistakeCategory: 'mechanics',
    occurrences: 5,
    avgTimeToObjectiveLoss: 420,
    winRateImpact: -7,
    objectivesLost: 2
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
