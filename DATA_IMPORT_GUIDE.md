# Multi-Entity Data Import Guide

This guide explains how to import comprehensive esports data into the Assistant Coach analytics platform using CSV and JSON files.

## 🚀 Quick Start

1. Open the **AI Chat Support** (blue chat button in bottom-right corner)
2. Click the **file upload button** (📄 icon)
3. Select your CSV or JSON file
4. Data is automatically imported and available in the dashboard

## 📁 File Formats

### CSV Format (Single Entity)

CSV files are best for importing a single data type (typically players).

**Example: `sample-players.csv`**
```csv
id,name,role,title,kda,winRate,gamesPlayed
player-1,Berserker,ADC,LoL,5.1,65,102
player-2,Vulcan,Support,LoL,3.8,64,102
player-3,xeta,IGL,Valorant,1.28,56,88
```

**Required Fields:**
- `id` - Unique identifier
- `name` - Player name/gamertag

**Optional Fields:**
- `role` - Player position (e.g., "Mid Laner", "Duelist", "AWPer")
- `title` - Game title ("LoL", "Valorant", or "CS2")
- `kda` - Kill/Death/Assist ratio
- `winRate` - Win percentage (0-100)
- `gamesPlayed` - Total games played

### JSON Format (Single or Multi-Entity)

JSON files support both single-entity arrays and multi-entity objects.

#### Single Entity (Player Array)

```json
[
  {
    "id": "player-1",
    "name": "Faker",
    "role": "Mid Laner",
    "title": "LoL",
    "kda": 5.2,
    "winRate": 68,
    "gamesPlayed": 150
  }
]
```

#### Multi-Entity (Complete Dataset)

This is the **recommended format** for comprehensive imports:

```json
{
  "players": [
    {
      "id": "player-1",
      "name": "Faker",
      "role": "Mid Laner",
      "title": "LoL",
      "kda": 5.2,
      "winRate": 68,
      "gamesPlayed": 150,
      "biography": {
        "realName": "Lee Sang-hyeok",
        "nationality": "South Korea",
        "birthDate": "1996-05-07",
        "bio": "Greatest LoL player of all time...",
        "playstyle": "Aggressive, calculated risk-taker"
      },
      "careerHistory": [
        {
          "year": 2013,
          "event": "Worlds Championship",
          "achievement": "World Champion",
          "team": "SK Telecom T1"
        }
      ]
    }
  ],
  "teams": [
    {
      "id": "team-1",
      "name": "T1",
      "colorPrimary": "#E4002B",
      "colorSecondary": "#000000",
      "title": "LoL"
    }
  ],
  "matches": [
    {
      "id": "match-1",
      "date": "2024-01-15",
      "opponent": "Gen.G",
      "result": "win",
      "duration": 32,
      "score": "2-1",
      "gameTitle": "LoL",
      "objectives": {
        "dragons": 3,
        "barons": 2,
        "towers": 9
      },
      "tournament": {
        "id": "lck-spring-2024",
        "name": "LCK Spring 2024",
        "nameShortened": "LCK Spring"
      }
    }
  ],
  "tournaments": [
    {
      "id": "lck-spring-2024",
      "name": "LCK Spring 2024",
      "nameShortened": "LCK Spring",
      "seriesCount": 45,
      "startDate": "2024-01-10",
      "endDate": "2024-04-15",
      "teams": ["T1", "Gen.G", "DRX"]
    }
  ]
}
```

## 🎯 Multi-Entity Benefits

### Why Use Multi-Entity Format?

1. **Complete Dataset in One File** - Import players, teams, matches, and tournaments together
2. **Maintain Relationships** - Keep connections between entities (player → team → matches)
3. **Rich Metadata** - Include biographies, career histories, and detailed stats
4. **Flexible** - Include only the entities you need (e.g., just players + teams)

### When to Use Each Format

| Format | Best For | Use Case |
|--------|----------|----------|
| **CSV** | Quick player roster updates | Adding new players to existing data |
| **JSON Single** | Simple imports | Testing or small datasets |
| **JSON Multi** | Complete data migration | Initial setup, comprehensive imports |

## 📊 Entity Schemas

### Player Schema

```typescript
{
  id: string                    // Required: Unique identifier
  name: string                  // Required: Player name/gamertag
  role: string                  // Player position
  title: "LoL" | "Valorant" | "CS2"
  kda: number                   // Kill/Death/Assist ratio
  winRate: number               // Win percentage (0-100)
  gamesPlayed: number
  biography?: {                 // Optional detailed bio
    realName?: string
    nationality?: string
    birthDate?: string           // Format: "YYYY-MM-DD"
    hometown?: string
    bio: string
    playstyle?: string
    signature?: string           // Signature champions/agents
    careerStart?: number         // Year
  }
  careerHistory?: Array<{      // Optional career milestones
    year: number
    event: string
    achievement: string
    team?: string
    title?: string
  }>
}
```

### Team Schema

```typescript
{
  id: string                    // Required
  name: string                  // Required: Team name
  colorPrimary: string          // Hex color code
  colorSecondary: string        // Hex color code
  title?: "LoL" | "Valorant" | "CS2"
  logoUrl?: string
}
```

### Match Schema

```typescript
{
  id: string                    // Required
  date: string                  // Format: "YYYY-MM-DD"
  opponent: string              // Opponent team name
  result: "win" | "loss"
  duration: number              // Match duration in minutes
  score?: string                // e.g., "2-1" or "13-10"
  gameTitle?: "LoL" | "Valorant" | "CS2"
  objectives: {
    dragons: number
    barons: number
    towers: number
  }
  tournament?: {
    id: string
    name: string
    nameShortened: string
  }
}
```

### Tournament Schema

```typescript
{
  id: string                    // Required
  name: string                  // Required: Full tournament name
  nameShortened: string         // Abbreviated name
  seriesCount?: number
  startDate?: string            // Format: "YYYY-MM-DD"
  endDate?: string
  teams?: string[]              // Array of team names
}
```

## 📦 Sample Files

Three sample files are included in the repository:

1. **`sample-multi-entity.json`** - Complete dataset with 5 players, 5 teams, 6 matches, and 4 tournaments
2. **`sample-players-teams.json`** - Simpler example with just players and teams
3. **`sample-players.csv`** - CSV format with 6 players

### Downloading Samples

You can download sample files from the **Data Import Guide** card on the dashboard, or access them directly from the repository root.

## 🛠️ How It Works

1. **File Upload** - Drop your file in the AI Chat interface
2. **Auto-Detection** - System detects file format (CSV/JSON)
3. **Parsing** - Data is validated and parsed
4. **Entity Recognition** - Detects which entities are present (players, teams, etc.)
5. **Import** - Data is merged with existing data
6. **Confirmation** - Import summary is displayed with counts per entity

## ✅ Validation

The import system automatically:
- ✓ Validates JSON syntax
- ✓ Converts CSV to structured data
- ✓ Auto-converts numeric fields
- ✓ Generates IDs if missing
- ✓ Provides default values for optional fields
- ✓ Shows detailed error messages for issues

## 🎨 Import Tips

### Best Practices

1. **Use Multi-Entity JSON** for comprehensive imports
2. **Include IDs** - Always provide unique IDs for entities
3. **Consistent Titles** - Use exact values: "LoL", "Valorant", or "CS2"
4. **Enrich Data** - Add biographies and career histories for better insights
5. **Test Small** - Test with a few records before bulk import

### Common Issues

**Issue:** No data imported
- **Solution:** Check file format matches examples above

**Issue:** CSV parsing errors
- **Solution:** Ensure commas are properly escaped and quoted

**Issue:** Missing players after import
- **Solution:** Verify required fields (id, name) are present

**Issue:** Numbers treated as text
- **Solution:** Remove quotes from numeric values in CSV

## 🔄 Data Persistence

Imported data is stored using the Spark KV store and persists between sessions. To view imported data:

1. **Players Tab** - See all imported players
2. **Teams Tab** - View imported teams (from Grid API or file)
3. **Statistics Tab** - Analyze imported match data
4. **Tournaments Tab** - Browse tournament information

## 🤝 Support

If you need help with imports:
1. Check the **Data Import Guide** card on the dashboard
2. Ask the **AI Chat Support** for guidance
3. Download and examine sample files for correct formatting

## 📝 Example Workflows

### Scenario 1: New Team Roster
Upload a CSV with player names, roles, and basic stats to quickly populate your roster.

### Scenario 2: Complete Season Data
Use multi-entity JSON to import players with biographies, all team matchups, tournament schedule, and historical results in one file.

### Scenario 3: Mid-Season Update
Upload just new players or matches - the system merges with existing data.

---

**Need more help?** Open the AI Chat and ask "How do I import multi-entity data?"
