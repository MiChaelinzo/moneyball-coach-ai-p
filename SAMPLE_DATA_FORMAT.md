# Data Import Format Guide

This guide explains the format for importing player, team, tournament, and match data through the AI Chat Assistant.

## Supported File Formats

- **JSON** (.json files)
- **CSV** (.csv files)

## File Upload Methods

1. Click the AI Chat icon in the bottom-right corner
2. Click the "Upload File" button (document icon)
3. Select your JSON or CSV file
4. The system will automatically parse and import the data

## JSON Format Examples

### Single Entity Array (Players Only)

```json
[
  {
    "id": "player-1",
    "name": "Berserker",
    "role": "ADC",
    "title": "LoL",
    "kda": 4.5,
    "winRate": 65,
    "gamesPlayed": 120,
    "biography": {
      "realName": "Kim Min-cheol",
      "nationality": "South Korea",
      "birthDate": "2003-01-15",
      "bio": "Young mechanical prodigy known for aggressive laning"
    }
  },
  {
    "id": "player-2",
    "name": "Zellsis",
    "role": "Duelist",
    "title": "Valorant",
    "kda": 1.45,
    "winRate": 58,
    "gamesPlayed": 85
  }
]
```

### Multi-Entity Object (Players, Teams, Matches)

```json
{
  "players": [
    {
      "id": "player-3",
      "name": "Blaber",
      "role": "Jungle",
      "title": "LoL",
      "kda": 3.8,
      "winRate": 60,
      "gamesPlayed": 95
    }
  ],
  "teams": [
    {
      "id": "team-1",
      "name": "Cloud9 Academy",
      "title": "LoL",
      "colorPrimary": "#72CFED",
      "colorSecondary": "#FFFFFF"
    }
  ],
  "matches": [
    {
      "id": "match-1",
      "date": "2024-01-20",
      "opponent": "Team Liquid",
      "result": "win",
      "duration": 1845,
      "score": "2-1",
      "gameTitle": "LoL"
    }
  ],
  "tournaments": [
    {
      "id": "tournament-1",
      "name": "LCS Spring 2024",
      "nameShortened": "LCS Spring",
      "startDate": "2024-01-15",
      "endDate": "2024-04-20"
    }
  ]
}
```

## CSV Format Examples

### Player CSV

```csv
id,name,role,title,kda,winRate,gamesPlayed
player-1,Berserker,ADC,LoL,4.5,65,120
player-2,Zellsis,Duelist,Valorant,1.45,58,85
player-3,Blaber,Jungle,LoL,3.8,60,95
```

### Match CSV

```csv
id,date,opponent,result,duration,score,gameTitle
match-1,2024-01-20,Team Liquid,win,1845,2-1,LoL
match-2,2024-01-21,100 Thieves,loss,1920,1-2,LoL
match-3,2024-01-22,Sentinels,win,2100,2-0,Valorant
```

## Field Descriptions

### Player Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique player identifier |
| name | string | Yes | Player nickname/gamertag |
| role | string | Yes | Player position (ADC, Support, Jungle, etc.) |
| title | string | No | Game title (LoL, Valorant, CS2) - defaults to "LoL" |
| kda | number | No | Kill/Death/Assist ratio - defaults to 0 |
| winRate | number | No | Win percentage (0-100) - defaults to 0 |
| gamesPlayed | number | No | Total games played - defaults to 0 |
| biography | object | No | Detailed player biography (see below) |
| careerHistory | array | No | Career milestones array |

### Player Biography Object (Optional)

```json
{
  "realName": "John Smith",
  "nationality": "United States",
  "birthDate": "2001-05-10",
  "hometown": "Los Angeles, CA",
  "bio": "Aggressive player known for clutch plays",
  "playstyle": "High-tempo aggressive with strong macro",
  "signature": "Baron steals and team fight positioning",
  "careerStart": 2019
}
```

### Match Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique match identifier |
| date | string | Yes | Match date (YYYY-MM-DD format) |
| opponent | string | Yes | Opposing team name |
| result | string | Yes | Match outcome: "win" or "loss" |
| duration | number | No | Match duration in seconds |
| score | string | No | Match score (e.g., "2-1", "13-7") |
| gameTitle | string | No | Game title (LoL, Valorant, CS2) |

### Team Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique team identifier |
| name | string | Yes | Team name |
| title | string | No | Game title (LoL, Valorant, CS2) |
| colorPrimary | string | No | Primary team color (hex code) |
| colorSecondary | string | No | Secondary team color (hex code) |
| logoUrl | string | No | URL to team logo image |

### Tournament Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique tournament identifier |
| name | string | Yes | Full tournament name |
| nameShortened | string | No | Shortened tournament name |
| startDate | string | No | Start date (YYYY-MM-DD) |
| endDate | string | No | End date (YYYY-MM-DD) |
| seriesCount | number | No | Number of series in tournament |

## Import Behavior

### Auto-Detection
- The system automatically detects whether the file contains a single entity array or multiple entities
- If the root is an array with a `name` field in the first object, it's treated as a player array
- Otherwise, it looks for `players`, `teams`, `matches`, and `tournaments` properties

### ID Generation
- If no `id` field is provided, the system auto-generates unique IDs
- Format: `imported-{entity}-{timestamp}-{index}`

### Data Persistence
- All imported data is stored in the browser's persistent KV storage
- Imported data persists across browser sessions
- Imported players appear in the Players tab immediately

### Duplicate Handling
- Duplicate IDs are automatically renamed with timestamps to avoid conflicts
- The system shows a warning if duplicates are detected

## Tips for Best Results

1. **Use Consistent Field Names**: Match the field names shown in the examples above
2. **Validate JSON**: Use a JSON validator before uploading to catch syntax errors
3. **CSV Headers**: First row must contain column headers matching field names
4. **Date Format**: Use ISO 8601 format (YYYY-MM-DD) for dates
5. **Game Titles**: Use exact values: "LoL", "Valorant", or "CS2"
6. **Numbers**: Don't include units or symbols (e.g., "65" not "65%")

## Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Failed to parse data file" | JSON/CSV syntax error | Validate file syntax |
| "No valid data found in file" | Empty or incorrectly structured file | Check file structure matches examples |
| "Please upload an image, video, JSON, or CSV file" | Unsupported file type | Use .json or .csv extension |

## Example Use Cases

### Importing a Full Roster
Upload a JSON file with all your team's players to quickly populate the analytics dashboard.

### Adding Historical Matches
Import a CSV of past match results to enable trend analysis and historical comparisons.

### Custom Tournament Data
Add regional or amateur tournaments not tracked by GRID API.

### Backup and Restore
Export data from one instance and import into another for data portability.

## Need Help?

Ask the AI Chat Assistant:
- "How do I upload player data?"
- "What file formats are supported?"
- "Show me an example of player JSON"
- "How do I import match history?"
