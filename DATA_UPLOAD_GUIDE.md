# CSV/JSON Data Upload Feature

## Overview
The Assistant Coach platform now supports uploading player roster data via CSV or JSON files through the AI Chat interface. This feature allows teams to import custom data into the analytics system.

## How to Upload Data

1. **Open AI Chat**: Click the pulsing chat icon in the bottom-right corner
2. **Click Upload Button**: Select the file upload icon (📁) from the toolbar
3. **Select Your File**: Choose a CSV or JSON file (max 10MB)
4. **Automatic Import**: The system will parse and import your data
5. **View Results**: Imported data appears immediately in the dashboard

## File Format Requirements

### CSV Format

#### Single Entity (Players)
```csv
id,name,role,title,kda,winRate,gamesPlayed
player-1,CoreJJ,Support,LoL,5.2,67,82
player-2,leaf,Duelist,Valorant,1.48,59,94
player-3,HObbit,Support,CS2,1.15,52,118
```

**Required Fields:**
- `id` - Unique identifier
- `name` - Player name/nickname

**Optional Fields:**
- `role` - Player position/role
- `title` - Game title (LoL, Valorant, CS2)
- `kda` - Kill/Death/Assist ratio (numeric)
- `winRate` - Win percentage (numeric)
- `gamesPlayed` - Total games (numeric)

**CSV Features:**
- Quoted fields with commas: `"Smith, John"` are handled correctly
- Automatic type detection: Numbers are converted automatically
- Empty values: Handled gracefully, use empty string or omit
- Case-insensitive headers

### JSON Format

#### Single Entity (Player Array)
```json
[
  {
    "id": "player-1",
    "name": "Fudge",
    "role": "Top Lane",
    "title": "LoL",
    "kda": 3.2,
    "winRate": 58,
    "gamesPlayed": 45,
    "biography": {
      "realName": "Ibrahim Allami",
      "nationality": "Australia",
      "bio": "Versatile top laner known for champion pool depth",
      "playstyle": "Flexible and team-oriented",
      "signature": "Tank initiations and split-push pressure"
    }
  }
]
```

#### Multi-Entity (Mixed Data)
```json
{
  "players": [
    {
      "id": "player-1",
      "name": "Jojo",
      "role": "Mid Lane",
      "title": "LoL",
      "kda": 4.3,
      "winRate": 66,
      "gamesPlayed": 54
    }
  ],
  "teams": [
    {
      "id": "team-1",
      "name": "Cloud9 White",
      "title": "Valorant",
      "colorPrimary": "#72CFED",
      "colorSecondary": "#FFFFFF"
    }
  ],
  "matches": [
    {
      "id": "match-1",
      "date": "2024-01-25",
      "opponent": "FlyQuest",
      "result": "win",
      "duration": 1923,
      "score": "2-0",
      "gameTitle": "LoL"
    }
  ],
  "tournaments": [
    {
      "id": "tournament-1",
      "name": "LCS Spring 2024",
      "startDate": "2024-01-15",
      "endDate": "2024-04-20",
      "seriesCount": 48
    }
  ]
}
```

**JSON Features:**
- Supports nested objects (biography, careerHistory)
- Multi-entity imports in one file
- Flexible schema - extra fields are preserved
- Proper type handling (numbers, strings, booleans)

## Sample Files

The repository includes example files you can reference:

- `sample-players.csv` - Simple CSV roster
- `sample-players.json` - JSON player array with biographies
- `sample-multi-entity.json` - Multi-entity data (players, teams, matches, tournaments)

## Validation & Error Handling

### File Size Validation
- **Max Size**: 10MB per file
- **Error Message**: Shows actual file size if too large

### Format Validation
- **Empty Files**: Detected before parsing
- **JSON Syntax**: Clear error messages for invalid JSON
- **CSV Structure**: Validates headers and row consistency

### Data Validation
- **Required Fields**: Warns if essential fields missing
- **Type Conversion**: Automatically converts numeric strings
- **Duplicate IDs**: Appends timestamp to prevent collisions

### User Feedback
- **Processing Toast**: Shows "Processing CSV/JSON file..."
- **Success Message**: Displays import statistics (e.g., "Imported 5 players, 2 teams")
- **Error Guidance**: Provides format examples when errors occur
- **Chat Confirmation**: AI acknowledges import with detailed summary

## Supported Data Types

### Players
- Player roster data with stats
- Biography information (optional)
- Career history/milestones (optional)

### Teams
- Team information
- Colors and branding
- Game title association

### Matches
- Match history records
- Results and scores
- Tournament association

### Tournaments
- Tournament/event data
- Date ranges
- Series counts

## Best Practices

1. **Use Sample Files**: Start with provided samples as templates
2. **Test with Small Files**: Validate format with 1-2 records first
3. **Include IDs**: Always provide unique IDs to avoid duplicates
4. **Numeric Data**: Use numbers without quotes for stats (kda, winRate, etc.)
5. **Date Format**: Use ISO format (YYYY-MM-DD) for dates
6. **Check Encoding**: Use UTF-8 encoding for CSV files

## Troubleshooting

### "No valid data found"
- Ensure CSV has headers in first row
- Check JSON is either array or object with entity keys
- Verify at least `id` and `name` fields present

### "Invalid JSON format"
- Validate JSON syntax with a JSON validator
- Check for missing commas, brackets, quotes
- Remove trailing commas (not valid in JSON)

### "File too large"
- Compress data by removing optional fields
- Split into multiple files
- Remove unnecessary whitespace

### Import Successful but Data Missing
- Check field names match expected format
- Verify data appears in correct tabs (Players, Teams, etc.)
- Ensure game title values are: "LoL", "Valorant", or "CS2"

## Technical Details

### CSV Parser
- Handles quoted fields with commas
- Automatic type detection (number vs string)
- Strips quotes from headers and values
- Preserves empty values

### JSON Parser
- Supports nested objects
- Flexible schema validation
- Multi-entity detection
- Preserves structure

### Data Storage
- Imported data persists across sessions (KV storage)
- Merges with existing data
- Timestamped to track imports
- Can be exported later

## API Integration

Imported data integrates seamlessly with:
- Player Analytics views
- Team Statistics
- Match History
- Tournament Tracking
- Export functionality

All imported records are treated identically to GRID API data, enabling full analytics capabilities.
