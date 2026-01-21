# ✨ Assistant Coach - Cloud9 Esports Analytics Platform

A comprehensive AI-powered esports analytics platform that integrates with GRID API to deliver real-time Cloud9 team insights, player performance tracking, and strategic analysis.

## 🚀 Features

### GRID API Integration
- **Live Cloud9 Data**: Real player statistics, match history, and team performance
- **Automatic Caching**: Smart data caching for offline access and improved performance
- **Seamless Fallback**: Gracefully handles API unavailability with cached or demo data

### Core Analytics
- **Player Performance Tracking**: Individual KDA, win rates, and games played
- **Match History Analysis**: Recent Cloud9 matches with detailed statistics
- **AI-Powered Insights**: GPT-4 powered match analysis and strategic recommendations
- **Live Match Tracking**: Real-time KDA updates and objective monitoring
- **Strategic Impact Dashboard**: Connect individual mistakes to team outcomes

## 📖 Getting Started

### 1. Launch the Application
The app is pre-configured and ready to run in your Spark environment.

### 2. Configure GRID API (Optional but Recommended)

For real Cloud9 esports data:

1. **Get Your API Key**
   - Apply for GRID API access through the hackathon resources
   - Wait for approval and receive your API key

2. **Connect to GRID**
   - Open the application
   - Click "Configure API" on the GRID API Integration card
   - Enter your API key
   - Click "Connect"

3. **Start Analyzing**
   - The app will automatically fetch Cloud9 roster and match data
   - Data refreshes every 5 minutes
   - Use "Refresh Data" to manually update

### 3. Explore Features

**Dashboard Tab**
- View team overview statistics
- Generate AI insights for specific matches
- Browse player roster with real-time stats

**Live Tab**
- Track ongoing matches with real-time updates
- Monitor KDA changes as they happen
- View objective control and gold differential

**Insights Tab**
- Review AI-generated pattern analysis
- Identify recurring mistakes and their impact
- Get actionable coaching recommendations

**Players Tab**
- Deep-dive into individual player analytics
- Compare performance against team averages
- Track improvement trends over time

**Strategic Tab**
- Analyze mistake categories and their strategic impact
- Correlate micro-level errors with macro outcomes
- Understand objective loss patterns

## 🔧 Technical Details

### Technology Stack
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Data**: GRID API GraphQL + Spark KV Storage
- **AI**: GPT-4 via Spark LLM API
- **Animation**: Framer Motion
- **Icons**: Phosphor Icons

### Key Files
```
src/
├── lib/
│   ├── gridApi.ts          # GRID API client & queries
│   ├── types.ts            # TypeScript interfaces
│   └── mockData.ts         # Fallback demo data
├── hooks/
│   ├── use-grid-data.ts    # Data fetching & caching
│   └── use-live-match.ts   # Live match tracking
├── components/
│   ├── GridApiSetup.tsx    # API configuration UI
│   ├── DataSourceIndicator.tsx
│   ├── LiveMatchTracker.tsx
│   ├── PlayerCard.tsx
│   └── ...
└── App.tsx                 # Main application
```

## 📚 Documentation

- **[GRID Integration Guide](./GRID_INTEGRATION.md)**: Detailed API setup and usage
- **[PRD.md](./PRD.md)**: Product requirements and design decisions

## 🎮 Usage Without API Key

The application works fully without a GRID API key using demonstration data:
- Sample Cloud9 roster
- Mock match history
- Simulated live matches
- All UI features functional

This allows you to:
- Test all functionality
- Understand the interface
- Demonstrate features
- Develop without API access

## 🔒 Privacy & Security

- API keys stored locally in browser
- No third-party data transmission
- All API calls use HTTPS
- Disconnect anytime to clear credentials

## 🐛 Troubleshooting

**No data loading?**
- Check your internet connection
- Verify API key is correct
- Try manual "Refresh Data"
- Check browser console for errors

**Stale data?**
- Click "Refresh Data" button
- Clear cache and reconnect
- Check GRID API status

**API key not working?**
- Ensure key is valid and not expired
- Check for extra spaces when pasting
- Verify hackathon API access is approved

## 🏗️ Development

### Adding New Features
1. Define data types in `src/lib/types.ts`
2. Create GraphQL queries in `src/lib/gridApi.ts`
3. Build UI components in `src/components/`
4. Integrate with hooks for state management

### Testing
- Use mock data for development
- Test with and without API connection
- Verify graceful error handling
- Check responsive design on mobile

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 🏆 Sky's the Limit - Cloud9 x JetBrains Hackathon

Built for the Cloud9 x JetBrains Hackathon as a comprehensive Assistant Coach powered by Data Science and AI, inspired by Moneyball's analytical approach to competitive esports.
