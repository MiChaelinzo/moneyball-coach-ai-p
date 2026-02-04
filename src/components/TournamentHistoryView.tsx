import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trophy, MagnifyingGlass, CurrencyDollar, MapPin, CalendarBlank, Users, Medal, Crown, Star } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface TournamentResult {
  id: string
  name: string
  nameShortened: string
  year: number
  date: string
  gameTitle: 'LoL' | 'Valorant' | 'CS2' | 'DOTA 2'
  champion: {
    name: string
    logo?: string
    players?: string[]
  }
  runnerUp: {
    name: string
    logo?: string
  }
  semifinalists?: string[]
  prizePool?: string
  location?: string
  venue?: string
  totalTeams: number
  cloud9Placement?: {
    position: number
    team: string
    eliminated: string
  }
  format: string
  region: string
}

const TOURNAMENT_HISTORY: TournamentResult[] = [
  {
    id: 'lcs-2024-spring',
    name: 'LCS Spring 2024 Championship',
    nameShortened: 'LCS Spring 2024',
    year: 2024,
    date: 'April 2024',
    gameTitle: 'LoL',
    champion: {
      name: 'Cloud9',
      players: ['Thanatos', 'Blaber', 'Jojopyun', 'Berserker', 'Vulcan']
    },
    runnerUp: {
      name: 'Team Liquid'
    },
    semifinalists: ['100 Thieves', 'FlyQuest'],
    prizePool: '$250,000',
    location: 'Los Angeles',
    venue: 'LCS Arena',
    totalTeams: 8,
    format: 'Double Elimination',
    region: 'North America'
  },
  {
    id: 'vct-2023-americas',
    name: 'VCT Americas League 2023',
    nameShortened: 'VCT Americas 2023',
    year: 2023,
    date: 'August 2023',
    gameTitle: 'Valorant',
    champion: {
      name: 'LOUD',
      players: ['aspas', 'Less', 'Cauanzin', 'tuyz', 'Saadhak']
    },
    runnerUp: {
      name: 'NRG Esports'
    },
    semifinalists: ['Cloud9', 'FURIA'],
    prizePool: '$500,000',
    location: 'São Paulo',
    venue: 'Riot Games Arena',
    totalTeams: 10,
    cloud9Placement: {
      position: 3,
      team: 'Cloud9',
      eliminated: 'Semifinals'
    },
    format: 'Round Robin + Playoffs',
    region: 'Americas'
  },
  {
    id: 'lcs-2023-summer',
    name: 'LCS Summer 2023 Championship',
    nameShortened: 'LCS Summer 2023',
    year: 2023,
    date: 'September 2023',
    gameTitle: 'LoL',
    champion: {
      name: 'Team Liquid',
      players: ['Impact', 'Pyosik', 'APA', 'Yeon', 'CoreJJ']
    },
    runnerUp: {
      name: 'Cloud9'
    },
    semifinalists: ['100 Thieves', 'FlyQuest'],
    prizePool: '$300,000',
    location: 'Newark',
    venue: 'Prudential Center',
    totalTeams: 8,
    cloud9Placement: {
      position: 2,
      team: 'Cloud9',
      eliminated: 'Finals'
    },
    format: 'Double Elimination',
    region: 'North America'
  },
  {
    id: 'iem-katowice-2023',
    name: 'IEM Katowice 2023',
    nameShortened: 'IEM Katowice 2023',
    year: 2023,
    date: 'February 2023',
    gameTitle: 'CS2',
    champion: {
      name: 'FaZe Clan',
      players: ['karrigan', 'rain', 'ropz', 'Twistzz', 'broky']
    },
    runnerUp: {
      name: 'G2 Esports'
    },
    semifinalists: ['NAVI', 'Heroic'],
    prizePool: '$1,000,000',
    location: 'Katowice',
    venue: 'Spodek Arena',
    totalTeams: 24,
    format: 'Single Elimination',
    region: 'Global'
  },
  {
    id: 'worlds-2022',
    name: 'League of Legends World Championship 2022',
    nameShortened: 'Worlds 2022',
    year: 2022,
    date: 'November 2022',
    gameTitle: 'LoL',
    champion: {
      name: 'DRX',
      players: ['Kingen', 'Pyosik', 'Zeka', 'Deft', 'BeryL']
    },
    runnerUp: {
      name: 'T1'
    },
    semifinalists: ['Gen.G', 'JD Gaming'],
    prizePool: '$2,225,000',
    location: 'San Francisco',
    venue: 'Chase Center',
    totalTeams: 24,
    cloud9Placement: {
      position: 8,
      team: 'Cloud9',
      eliminated: 'Quarterfinals'
    },
    format: 'Group Stage + Knockout',
    region: 'Global'
  },
  {
    id: 'lcs-2022-spring',
    name: 'LCS Spring 2022 Championship',
    nameShortened: 'LCS Spring 2022',
    year: 2022,
    date: 'April 2022',
    gameTitle: 'LoL',
    champion: {
      name: 'Cloud9',
      players: ['Summit', 'Blaber', 'Fudge', 'Berserker', 'Zven']
    },
    runnerUp: {
      name: 'Team Liquid'
    },
    semifinalists: ['100 Thieves', 'Evil Geniuses'],
    prizePool: '$200,000',
    location: 'Houston',
    venue: 'NRG Stadium',
    totalTeams: 8,
    format: 'Double Elimination',
    region: 'North America'
  },
  {
    id: 'vct-masters-berlin',
    name: 'VCT Masters Berlin 2021',
    nameShortened: 'VCT Masters Berlin',
    year: 2021,
    date: 'September 2021',
    gameTitle: 'Valorant',
    champion: {
      name: 'Gambit Esports',
      players: ['nAts', 'Chronicle', 'Sheydos', 'Redgar', 'd3ffo']
    },
    runnerUp: {
      name: 'Envy'
    },
    semifinalists: ['100 Thieves', 'Acend'],
    prizePool: '$600,000',
    location: 'Berlin',
    venue: 'Verti Music Hall',
    totalTeams: 16,
    format: 'Group Stage + Playoffs',
    region: 'Global'
  },
  {
    id: 'ti10-2021',
    name: 'The International 10',
    nameShortened: 'TI10',
    year: 2021,
    date: 'October 2021',
    gameTitle: 'DOTA 2',
    champion: {
      name: 'Team Spirit',
      players: ['TORONTOTOKYO', 'Collapse', 'Yatoro', 'Mira', 'Miposhka']
    },
    runnerUp: {
      name: 'PSG.LGD'
    },
    semifinalists: ['Team Secret', 'Invictus Gaming'],
    prizePool: '$40,018,195',
    location: 'Bucharest',
    venue: 'National Arena',
    totalTeams: 18,
    format: 'Group Stage + Double Elimination',
    region: 'Global'
  },
  {
    id: 'lcs-2021-summer',
    name: 'LCS Summer 2021 Championship',
    nameShortened: 'LCS Summer 2021',
    year: 2021,
    date: 'August 2021',
    gameTitle: 'LoL',
    champion: {
      name: '100 Thieves',
      players: ['Ssumday', 'Closer', 'Abbedagge', 'FBI', 'huhi']
    },
    runnerUp: {
      name: 'Team Liquid'
    },
    semifinalists: ['TSM', 'Cloud9'],
    prizePool: '$200,000',
    location: 'Chicago',
    venue: 'United Center',
    totalTeams: 8,
    cloud9Placement: {
      position: 4,
      team: 'Cloud9',
      eliminated: 'Semifinals'
    },
    format: 'Double Elimination',
    region: 'North America'
  },
  {
    id: 'lcs-2020-spring',
    name: 'LCS Spring 2020 Championship',
    nameShortened: 'LCS Spring 2020',
    year: 2020,
    date: 'April 2020',
    gameTitle: 'LoL',
    champion: {
      name: 'Cloud9',
      players: ['Licorice', 'Blaber', 'Nisqy', 'Zven', 'Vulcan']
    },
    runnerUp: {
      name: 'FlyQuest'
    },
    semifinalists: ['Evil Geniuses', 'TSM'],
    prizePool: '$200,000',
    location: 'Online',
    venue: 'Online Event',
    totalTeams: 10,
    format: 'Double Elimination',
    region: 'North America'
  },
  {
    id: 'iem-sydney-2019',
    name: 'IEM Sydney 2019',
    nameShortened: 'IEM Sydney 2019',
    year: 2019,
    date: 'May 2019',
    gameTitle: 'CS2',
    champion: {
      name: 'FaZe Clan',
      players: ['NEO', 'NiKo', 'GuardiaN', 'olofmeister', 'rain']
    },
    runnerUp: {
      name: 'Renegades'
    },
    semifinalists: ['Fnatic', 'ENCE'],
    prizePool: '$250,000',
    location: 'Sydney',
    venue: 'Qudos Bank Arena',
    totalTeams: 16,
    format: 'Group Stage + Playoffs',
    region: 'Global'
  },
  {
    id: 'lcs-2018-spring',
    name: 'LCS Spring 2018 Championship',
    nameShortened: 'LCS Spring 2018',
    year: 2018,
    date: 'April 2018',
    gameTitle: 'LoL',
    champion: {
      name: 'Team Liquid',
      players: ['Impact', 'Xmithie', 'Pobelter', 'Doublelift', 'Olleh']
    },
    runnerUp: {
      name: '100 Thieves'
    },
    semifinalists: ['Cloud9', 'Echo Fox'],
    prizePool: '$100,000',
    location: 'Oakland',
    venue: 'Oracle Arena',
    totalTeams: 10,
    cloud9Placement: {
      position: 3,
      team: 'Cloud9',
      eliminated: 'Semifinals'
    },
    format: 'Double Elimination',
    region: 'North America'
  }
]

export function TournamentHistoryView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedGame, setSelectedGame] = useState<string>('all')

  const years = Array.from(new Set(TOURNAMENT_HISTORY.map(t => t.year))).sort((a, b) => b - a)
  const gameTitles = Array.from(new Set(TOURNAMENT_HISTORY.map(t => t.gameTitle)))

  const filteredTournaments = TOURNAMENT_HISTORY.filter((tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.nameShortened.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.champion.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesYear = selectedYear === 'all' || tournament.year.toString() === selectedYear
    const matchesGame = selectedGame === 'all' || tournament.gameTitle === selectedGame

    return matchesSearch && matchesYear && matchesGame
  })

  const getPositionColor = (position?: number) => {
    if (!position) return ''
    if (position === 1) return 'text-[oklch(0.85_0.18_55)]'
    if (position === 2) return 'text-muted-foreground'
    if (position === 3) return 'text-[oklch(0.65_0.15_35)]'
    return 'text-muted-foreground'
  }

  const getPositionIcon = (position?: number) => {
    if (!position) return <Trophy size={20} weight="duotone" />
    if (position === 1) return <Crown size={20} weight="duotone" />
    if (position === 2) return <Medal size={20} weight="duotone" />
    if (position === 3) return <Star size={20} weight="duotone" />
    return <Trophy size={20} weight="duotone" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Tournament History & Champions</h2>
          <p className="text-sm text-muted-foreground">
            Historical tournament results and championship winners across all titles
          </p>
        </div>
        <Badge variant="outline" className="gap-2 px-4 py-2">
          <Trophy size={18} weight="duotone" />
          {filteredTournaments.length} Tournaments
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="relative md:col-span-1">
          <MagnifyingGlass
            size={20}
            weight="duotone"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="text"
            placeholder="Search tournaments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger>
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedGame} onValueChange={setSelectedGame}>
          <SelectTrigger>
            <SelectValue placeholder="All Games" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Games</SelectItem>
            {gameTitles.map(game => (
              <SelectItem key={game} value={game}>{game}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredTournaments.length === 0 ? (
        <Card className="glow-border">
          <CardContent className="py-12 text-center">
            <Trophy size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No tournaments found matching your filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className={`glow-border hover:bg-card/80 transition-colors group ${
                tournament.champion.name === 'Cloud9' ? 'glow-border-success' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg transition-colors ${
                        tournament.champion.name === 'Cloud9' 
                          ? 'bg-success/20 group-hover:bg-success/30' 
                          : 'bg-primary/20 group-hover:bg-primary/30'
                      }`}>
                        {tournament.champion.name === 'Cloud9' ? (
                          <Crown size={24} weight="duotone" className="text-success" />
                        ) : (
                          <Trophy size={24} weight="duotone" className="text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base leading-tight mb-1">
                          {tournament.nameShortened}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {tournament.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="text-xs font-mono">
                        {tournament.gameTitle}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{tournament.year}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarBlank size={14} weight="duotone" />
                    <span>{tournament.date}</span>
                    {tournament.location && (
                      <>
                        <span>•</span>
                        <MapPin size={14} weight="duotone" />
                        <span>{tournament.location}</span>
                      </>
                    )}
                  </div>

                  <div className="space-y-3 pt-2 border-t border-border/50">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Crown size={18} weight="duotone" className="text-[oklch(0.85_0.18_55)]" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Champion
                        </span>
                      </div>
                      <div className="pl-6">
                        <div className={`font-semibold ${
                          tournament.champion.name === 'Cloud9' ? 'text-success' : 'text-foreground'
                        }`}>
                          {tournament.champion.name}
                          {tournament.champion.name === 'Cloud9' && (
                            <Badge variant="outline" className="ml-2 text-xs border-success text-success">
                              C9 Victory
                            </Badge>
                          )}
                        </div>
                        {tournament.champion.players && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {tournament.champion.players.join(' • ')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Medal size={18} weight="duotone" className="text-muted-foreground" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Runner-up
                        </span>
                      </div>
                      <div className="pl-6">
                        <div className={`text-sm ${
                          tournament.runnerUp.name === 'Cloud9' ? 'text-success font-semibold' : 'text-foreground'
                        }`}>
                          {tournament.runnerUp.name}
                          {tournament.runnerUp.name === 'Cloud9' && (
                            <Badge variant="outline" className="ml-2 text-xs border-success text-success">
                              C9 2nd Place
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {tournament.cloud9Placement && tournament.champion.name !== 'Cloud9' && tournament.runnerUp.name !== 'Cloud9' && (
                      <div className="space-y-2 pt-2 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          {getPositionIcon(tournament.cloud9Placement.position)}
                          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Cloud9 Placement
                          </span>
                        </div>
                        <div className="pl-6">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${getPositionColor(tournament.cloud9Placement.position)}`}>
                              {tournament.cloud9Placement.position}
                              {tournament.cloud9Placement.position === 1 ? 'st' : 
                               tournament.cloud9Placement.position === 2 ? 'nd' : 
                               tournament.cloud9Placement.position === 3 ? 'rd' : 'th'} Place
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {tournament.cloud9Placement.eliminated}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/50 grid grid-cols-2 gap-3">
                    {tournament.prizePool && (
                      <div className="flex items-start gap-2">
                        <div className="p-1 rounded bg-primary/10 mt-0.5">
                          <CurrencyDollar size={14} weight="duotone" className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-muted-foreground">Prize Pool</div>
                          <div className="text-xs font-semibold text-foreground truncate">{tournament.prizePool}</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-2">
                      <div className="p-1 rounded bg-accent/10 mt-0.5">
                        <Users size={14} weight="duotone" className="text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground">Teams</div>
                        <div className="text-xs font-semibold text-foreground">{tournament.totalTeams}</div>
                      </div>
                    </div>

                    {tournament.venue && (
                      <div className="flex items-start gap-2 col-span-2">
                        <div className="p-1 rounded bg-success/10 mt-0.5">
                          <MapPin size={14} weight="duotone" className="text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-muted-foreground">Venue</div>
                          <div className="text-xs font-semibold text-foreground truncate">{tournament.venue}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
