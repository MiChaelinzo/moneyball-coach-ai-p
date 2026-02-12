# Data Import Format Guide

This guide explains the format for importing player, team, tournament, and match data through the AI Chat Assistant.



2. Click the "Upload Fil
4. The system will aut

### Single Entity Arra

  {
    "name": "Berserker",
    "title": "LoL",
    "winRate": 65,

      "nationality": "S

  },

    "ro
 
   
]


{
    {
      "name": "Bla
      "title": "LoL",
      "winRate": 6
    }
  "teams": [
      "id": "team-1",
      "title": "LoL",
     
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
| kd
| gamesPlaye
| car
### Player Biography 
```json
  "realName": "John S
  "birthDate": "2001-05-10",
  "bio": "Aggressive player known
  "si
}


|-------|------|------
| date | string | Yes | Mat
| result | string | Yes | Match 
| score | string | No 


|-------|------|--------
| nam
| co
| logoUrl | string
### T
| Field | Type | Required |
| id | string | Yes | Unique tou
| nameShortened | string | No | Shor
| endDate | string | No | End da


- T
-
###

### Data Persistence





2. **Validate JSON**: Use a JSON vali
4. **Date Format**: Use ISO 8601 format (YYY
6. **Numbers**: Don't include units 
## 

| "Failed to 

## Exa
### Importing a Full Roster

Import a CSV of past match results to enable tre
### Custom Tournament Data


## Need Help?

- "What file form
















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
