import type { TransferRecord } from './types'

export const TRANSFER_HISTORY: TransferRecord[] = [
  {
    id: 'tf1',
    playerId: '3',
    playerName: 'Jensen',
    fromTeam: 'Team Liquid',
    toTeam: 'Cloud9',
    transferDate: '2024-01-15',
    transferType: 'return',
    gameTitle: 'LoL',
    reason: 'Roster rebuild and mid lane reinforcement',
    performance: {
      before: {
        winRate: 62,
        kda: 4.8,
        gamesPlayed: 72
      },
      after: {
        winRate: 65,
        kda: 5.3,
        gamesPlayed: 24
      }
    },
    notes: 'Jensen returns to Cloud9 after multiple seasons with Team Liquid. Expected to bring veteran leadership and championship experience.'
  },
  {
    id: 'tf2',
    playerId: '4',
    playerName: 'Berserker',
    fromTeam: 'T1 Challengers',
    toTeam: 'Cloud9',
    transferDate: '2022-11-20',
    transferType: 'external',
    gameTitle: 'LoL',
    reason: 'Strategic import from LCK academy system',
    performance: {
      before: {
        winRate: 68,
        kda: 5.2,
        gamesPlayed: 45
      },
      after: {
        winRate: 70,
        kda: 6.8,
        gamesPlayed: 76
      }
    },
    notes: 'High-profile signing from Korean academy. Immediate impact as franchise ADC.'
  },
  {
    id: 'tf3',
    playerId: '1',
    playerName: 'Fudge',
    fromTeam: 'Mammoth',
    toTeam: 'Cloud9 Academy',
    transferDate: '2020-11-15',
    transferType: 'promotion',
    gameTitle: 'LoL',
    reason: 'OCE import under residency program',
    performance: {
      before: {
        winRate: 64,
        kda: 3.5,
        gamesPlayed: 38
      }
    },
    notes: 'Joined Cloud9 Academy from OCE region before moving to main roster.'
  },
  {
    id: 'tf4',
    playerId: '1',
    playerName: 'Fudge',
    fromTeam: 'Cloud9 Academy',
    toTeam: 'Cloud9',
    transferDate: '2021-01-08',
    transferType: 'promotion',
    gameTitle: 'LoL',
    reason: 'Emergency promotion due to roster changes',
    performance: {
      before: {
        winRate: 67,
        kda: 3.7,
        gamesPlayed: 12
      },
      after: {
        winRate: 58,
        kda: 3.2,
        gamesPlayed: 24
      }
    },
    notes: 'Promoted to main roster replacing Licorice. Quick adaptation to LCS level.'
  },
  {
    id: 'tf5',
    playerId: '6',
    playerName: 'leaf',
    fromTeam: 'Chaos EC',
    toTeam: 'Cloud9',
    transferDate: '2023-06-12',
    transferType: 'external',
    gameTitle: 'Valorant',
    reason: 'Star duelist addition for aggressive playstyle',
    performance: {
      before: {
        winRate: 54,
        kda: 1.18,
        gamesPlayed: 88
      },
      after: {
        winRate: 61,
        kda: 1.32,
        gamesPlayed: 52
      }
    },
    notes: 'Key signing to bolster Valorant roster. Known for explosive aim and entry fragging.'
  },
  {
    id: 'tf6',
    playerId: '7',
    playerName: 'OXY',
    fromTeam: 'The Guard',
    toTeam: 'Cloud9',
    transferDate: '2024-02-28',
    transferType: 'external',
    gameTitle: 'Valorant',
    reason: 'Rising star acquisition',
    performance: {
      before: {
        winRate: 58,
        kda: 1.28,
        gamesPlayed: 64
      },
      after: {
        winRate: 64,
        kda: 1.35,
        gamesPlayed: 28
      }
    },
    notes: 'Young prodigy from Tier 2 scene. Regarded as one of the most mechanically gifted players in NA.'
  },
  {
    id: 'tf7',
    playerId: '8',
    playerName: 'vanity',
    fromTeam: 'Chaos EC',
    toTeam: 'Cloud9',
    transferDate: '2021-09-14',
    transferType: 'external',
    gameTitle: 'Valorant',
    reason: 'IGL and strategic caller',
    performance: {
      before: {
        winRate: 51,
        kda: 0.98,
        gamesPlayed: 72
      },
      after: {
        winRate: 59,
        kda: 1.08,
        gamesPlayed: 124
      }
    },
    notes: 'Veteran IGL signing. Brought tactical depth and championship mindset to roster.'
  },
  {
    id: 'tf8',
    playerId: '12',
    playerName: 'Xeppaa',
    fromTeam: 'Cloud9 White',
    toTeam: 'Cloud9',
    transferDate: '2023-01-20',
    transferType: 'promotion',
    gameTitle: 'Valorant',
    reason: 'Internal promotion from academy team',
    performance: {
      before: {
        winRate: 66,
        kda: 1.28,
        gamesPlayed: 34
      },
      after: {
        winRate: 60,
        kda: 1.15,
        gamesPlayed: 76
      }
    },
    notes: 'Academy graduate showing promise. Versatile player adapting to tier 1 competition.'
  },
  {
    id: 'tf9',
    playerId: '13',
    playerName: 'Automatic',
    fromTeam: 'Team Liquid',
    toTeam: 'Cloud9',
    transferDate: '2018-08-14',
    transferType: 'external',
    gameTitle: 'CS2',
    reason: 'Star rifler signing for major run',
    performance: {
      before: {
        winRate: 56,
        kda: 1.22,
        gamesPlayed: 156
      },
      after: {
        winRate: 59,
        kda: 1.18,
        gamesPlayed: 98
      }
    },
    notes: 'Former Team Liquid star. Joined for Boston Major push with proven championship pedigree.'
  },
  {
    id: 'tf10',
    playerId: '14',
    playerName: 'floppy',
    fromTeam: 'Cloud9 Academy',
    toTeam: 'Cloud9',
    transferDate: '2022-03-10',
    transferType: 'promotion',
    gameTitle: 'CS2',
    reason: 'Academy graduation and roster expansion',
    performance: {
      before: {
        winRate: 61,
        kda: 1.15,
        gamesPlayed: 42
      },
      after: {
        winRate: 58,
        kda: 1.12,
        gamesPlayed: 87
      }
    },
    notes: 'Academy system success story. Consistent performer earning main roster spot.'
  },
  {
    id: 'tf11',
    playerId: '15',
    playerName: 'JT',
    fromTeam: 'Complexity',
    toTeam: 'Cloud9',
    transferDate: '2023-05-22',
    transferType: 'external',
    gameTitle: 'CS2',
    reason: 'AWP specialist acquisition',
    performance: {
      before: {
        winRate: 52,
        kda: 1.08,
        gamesPlayed: 112
      },
      after: {
        winRate: 55,
        kda: 1.09,
        gamesPlayed: 68
      }
    },
    notes: 'Primary AWPer signing. Known for aggressive playstyle and clutch potential.'
  },
  {
    id: 'tf12',
    playerId: '2',
    playerName: 'Blaber',
    fromTeam: 'Cloud9 Academy',
    toTeam: 'Cloud9',
    transferDate: '2018-06-01',
    transferType: 'promotion',
    gameTitle: 'LoL',
    reason: 'Emergency sub turned permanent starter',
    performance: {
      before: {
        winRate: 72,
        kda: 4.5,
        gamesPlayed: 18
      },
      after: {
        winRate: 62,
        kda: 4.1,
        gamesPlayed: 186
      }
    },
    notes: 'Legendary academy promotion. Became three-time MVP and franchise cornerstone.'
  },
  {
    id: 'tf13',
    playerId: '16',
    playerName: 'Zven',
    fromTeam: 'Team SoloMid',
    toTeam: 'Cloud9',
    transferDate: '2019-11-18',
    transferType: 'external',
    gameTitle: 'LoL',
    reason: 'Veteran ADC signing',
    performance: {
      before: {
        winRate: 58,
        kda: 4.2,
        gamesPlayed: 78
      },
      after: {
        winRate: 64,
        kda: 5.1,
        gamesPlayed: 96
      }
    },
    notes: 'Former TSM and G2 star. Brought European experience and championship mentality.'
  },
  {
    id: 'tf14',
    playerId: '5',
    playerName: 'Vulcan',
    fromTeam: 'Clutch Gaming',
    toTeam: 'Cloud9',
    transferDate: '2019-11-20',
    transferType: 'external',
    gameTitle: 'LoL',
    reason: 'Support upgrade for championship push',
    performance: {
      before: {
        winRate: 52,
        kda: 3.8,
        gamesPlayed: 64
      },
      after: {
        winRate: 65,
        kda: 4.5,
        gamesPlayed: 24
      }
    },
    notes: 'Breakout support star. Formed dominant bot lane partnership.'
  },
  {
    id: 'tf15',
    playerId: '9',
    playerName: 'mitch',
    fromTeam: 'Cloud9 Challengers',
    toTeam: 'Cloud9',
    transferDate: '2023-11-05',
    transferType: 'promotion',
    gameTitle: 'Valorant',
    reason: 'Trial period for flexible roster',
    performance: {
      before: {
        winRate: 59,
        kda: 1.19,
        gamesPlayed: 28
      },
      after: {
        winRate: 57,
        kda: 1.11,
        gamesPlayed: 18
      }
    },
    notes: 'Challengers team promotion for main roster depth.'
  }
]

export function getPlayerTransferHistory(playerId: string): TransferRecord[] {
  return TRANSFER_HISTORY.filter(transfer => transfer.playerId === playerId)
    .sort((a, b) => new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime())
}

export function getTeamTransfers(teamName: string): TransferRecord[] {
  return TRANSFER_HISTORY.filter(
    transfer => transfer.toTeam === teamName || transfer.fromTeam === teamName
  ).sort((a, b) => new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime())
}

export function getTransfersByTitle(title: string): TransferRecord[] {
  return TRANSFER_HISTORY.filter(transfer => transfer.gameTitle === title)
    .sort((a, b) => new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime())
}

export function getRecentTransfers(limit: number = 10): TransferRecord[] {
  return [...TRANSFER_HISTORY]
    .sort((a, b) => new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime())
    .slice(0, limit)
}

export function getTransferStats() {
  const totalTransfers = TRANSFER_HISTORY.length
  const byType = TRANSFER_HISTORY.reduce((acc, transfer) => {
    acc[transfer.transferType] = (acc[transfer.transferType] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const byTitle = TRANSFER_HISTORY.reduce((acc, transfer) => {
    acc[transfer.gameTitle] = (acc[transfer.gameTitle] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const successfulTransfers = TRANSFER_HISTORY.filter(
    transfer => 
      transfer.performance?.after && 
      transfer.performance.after.winRate > transfer.performance.before.winRate
  ).length
  
  return {
    totalTransfers,
    byType,
    byTitle,
    successRate: totalTransfers > 0 ? (successfulTransfers / totalTransfers) * 100 : 0
  }
}
