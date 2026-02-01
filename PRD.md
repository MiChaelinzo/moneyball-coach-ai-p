# Assistant Coach - Esports Analytics Platform

A data-driven coaching assistant that transforms raw esports match data into actionable insights, connecting individual player performance patterns to team-level strategic outcomes in near-real-time.

**Experience Qualities**:
1. **Authoritative** - The platform should feel like a trusted strategic advisor, presenting complex analytics with confidence and clarity
2. **Surgical** - Every insight should be precise and actionable, cutting through noise to reveal meaningful patterns that drive decision-making
3. **Dynamic** - The interface should feel alive with data, using motion and visual hierarchy to guide attention to the most critical insights

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a sophisticated analytics platform that requires multiple interconnected views (player analysis, match review, strategic insights), advanced data processing, AI-powered pattern recognition, and rich data visualizations. It goes beyond simple CRUD operations to deliver intelligent coaching recommendations based on multi-dimensional data analysis.

## Essential Features

### GRID API Integration
- **Functionality**: Direct integration with GRID's esports data API to fetch real Cloud9 match data, player statistics, and live game information. The application comes pre-configured with a valid GRID API key for immediate access. Now includes GRID Statistics Feed API for detailed player and team statistics.
- **Purpose**: Replace mock data with authentic esports analytics from official tournament and team data, and provide granular statistics for performance analysis
- **Trigger**: Application auto-initializes GRID API on load with the pre-configured key
- **Progression**: Auto-initialize API → Connect to GRID endpoint → Fetch Cloud9 roster → Retrieve recent matches → Cache data locally → Auto-refresh on demand → Display connection status → Fetch detailed statistics from Statistics Feed API
- **Success criteria**: Automatic authentication on load, data retrieval within 3 seconds, graceful fallback to cached/mock data on failure, clear error messaging, successful statistics queries with proper data aggregation

### Detailed Statistics View (NEW)
- **Functionality**: Comprehensive player and team statistics dashboard powered by GRID's Statistics Feed API. Displays granular metrics including kills/deaths per game, win rates, win/loss streaks, series performance, and segment-level statistics. Features series filtering to analyze all-time stats or specific match ranges (e.g., last 3 matches). **Now includes advanced game title filtering (League of Legends, Valorant, CS2)** to view title-specific statistics and compare performance across different esports titles. Supports both player-level and team-level statistics with detailed breakdowns.
- **Purpose**: Provide coaches with deep statistical insights into individual player performance and team dynamics across multiple esports titles, enabling data-driven coaching decisions and performance tracking over time with title-specific context
- **Trigger**: User selects "Stats" tab from main navigation and chooses a player or team to analyze
- **Progression**: Access Statistics tab → Select game title filter (All/LoL/Valorant/CS2) → View filtered player and team counts → Choose player or team view → Select player/team from filtered dropdown → Choose series filter (all matches or last 3) → Click "Fetch Stats" → System queries GRID Statistics Feed API → Display comprehensive stats dashboard with title badge → View games played, win rate percentage, average kills/deaths → Analyze kill/death min/max/avg statistics → Review win/loss streaks (current, best, worst) → Examine segment-level performance metrics → Switch between player and team views → Apply different series filters for time-based analysis → Change title filter to compare across games → Stats automatically reset when filter changes
- **Success criteria**: Successfully fetches statistics from GRID Statistics Feed API within 2 seconds, displays accurate metrics with proper aggregation, handles empty/zero data gracefully, presents win rate percentages correctly, shows streak data with current and historical records, supports series ID filtering for focused analysis, provides clear visual hierarchy for different stat categories, accurately filters players and teams by game title, displays title badges in stat panels, resets stats when filter changes, and shows appropriate messaging when no data exists for selected title

### Live Match Tracking with Real-Time KDA Updates
- **Functionality**: Real-time monitoring of ongoing Cloud9 matches with automatic game detection, live updates to player KDA (Kills/Deaths/Assists), CS (Creep Score), gold, and objective control. Features automatic polling of GRID API for live game data with seamless fallback to simulation mode.
- **Purpose**: Enable coaches to track performance as it happens and identify in-game patterns for immediate strategic adjustments
- **Trigger**: Auto-detection when live Cloud9 matches begin (when enabled), or manual game selection from available matches
- **Progression**: Enable auto-detect → System checks for live Cloud9 games every 30 seconds → When match detected, automatically connect → Poll GRID API every 5 seconds for stats → Display real-time updates with smooth animations → KDA changes highlight with color → Track objectives and gold differentials → Coach can pause/resume/reset tracking → Switch between GRID data and simulation modes
- **Success criteria**: Automatic match detection within 30 seconds of game start, smooth stat updates with <5s latency, visual feedback clearly highlights stat changes, graceful fallback to simulation when GRID data unavailable, clear indicators showing data source (GRID API vs Simulation)

### AI-Powered Match Analysis
- **Functionality**: Analyzes historical match data to identify recurring patterns in player mistakes and their strategic impact. Now includes multi-match trend analysis to identify long-term patterns across multiple games.
- **Purpose**: Transforms raw match data into coaching insights that connect micro-level errors to macro-level outcomes
- **Trigger**: User uploads match data or selects from historical matches, or accesses the Trends tab for comprehensive multi-match analysis
- **Progression**: Select match(es) → AI processes data → System identifies patterns → Display categorized insights with impact metrics → Generate recommendations → Track trends over time
- **Success criteria**: AI successfully identifies at least 3-5 meaningful patterns per match with clear impact correlations, and reveals long-term trends across multiple matches

### Individual Player Performance Tracking
- **Functionality**: Deep-dive analytics on specific players showing recurring mistake patterns, improvement trends, and comparative metrics
- **Purpose**: Enable targeted coaching by revealing individual performance patterns over time
- **Trigger**: Coach selects a player from roster or search
- **Progression**: Select player → Load historical performance data → Display mistake frequency heatmap → Show trend analysis → Highlight improvement areas with priority ranking
- **Success criteria**: Clear visualization of player-specific patterns with actionable coaching recommendations

### Strategic Impact Dashboard
- **Functionality**: High-level view connecting individual mistakes to team strategic outcomes (lost objectives, game state changes, win probability shifts)
- **Purpose**: Help coaches understand how micro-level execution affects macro-level strategy
- **Trigger**: Coach accesses main dashboard or completes match analysis
- **Progression**: Load dashboard → Display key metrics (win rate correlation, objective control impact) → Show mistake-to-outcome pathways → Highlight critical failure points → Generate strategic adjustments
- **Success criteria**: Dashboard presents clear causal relationships between player actions and strategic outcomes

### Pattern Recognition & Recommendations
- **Functionality**: AI identifies recurring patterns across multiple matches and generates prioritized coaching recommendations. Includes correlation detection between different mistake categories and game outcomes.
- **Purpose**: Move beyond reactive analysis to proactive strategic planning with data-driven insights
- **Trigger**: System continuously analyzes accumulated match data in background, or user accesses the Trends tab
- **Progression**: System detects pattern → Calculates frequency and impact → Generates recommendation → Prioritizes by impact potential → Presents to coach with supporting data → Shows historical trend visualization
- **Success criteria**: Recommendations are specific, actionable, and backed by quantitative evidence with clear correlation metrics

### Comparative Analytics
- **Functionality**: Compare player/team performance against league averages, historical benchmarks, or specific opponents. Includes long-term trend tracking showing improvement or decline over time.
- **Purpose**: Contextualize performance and identify competitive advantages or vulnerabilities
- **Trigger**: Coach selects comparison mode and defines parameters, or views the Trends tab for automatic multi-match analysis
- **Progression**: Select comparison type → Choose baseline (league avg, opponent, historical) → System calculates differentials → Display comparative visualizations → Highlight significant deviations → Show trend direction (improving/declining/stable)
- **Success criteria**: Clear visualization of performance gaps with statistical significance indicators and actionable trend insights

### Multi-Match Trend Analysis
- **Functionality**: Comprehensive analysis across multiple matches identifying long-term patterns, player improvement trajectories, category trends, and pattern correlations
- **Purpose**: Reveal strategic insights that only emerge over time, helping coaches make data-driven long-term decisions
- **Trigger**: User accesses dedicated Trends tab in the main navigation
- **Progression**: Load matches → Analyze across timeframe → Generate overall team trends → Calculate per-player improvement rates → Identify category trends (increasing/decreasing/stable) → Detect correlations between mistake types and outcomes → Generate AI summary → Display interactive visualizations with historical data
- **Success criteria**: System successfully analyzes 5+ matches, identifies at least 2-3 major trends, shows clear trend direction for each player, and generates actionable long-term recommendations

### Match History Replay System (NEW)
- **Functionality**: Comprehensive replay system for reviewing past matches with timeline scrubbing, event markers, synchronized game state visualization, and **AI-powered voice-over narration**. Users can play, pause, skip, and scrub through match timelines while viewing player stats, objectives, and critical events in real-time synchronization. The voice narrator automatically describes key moments including objectives secured, critical mistakes, gold swings, and periodic game state updates.
- **Purpose**: Enable coaches to review games at their own pace, identify exact moments when key events occurred, and analyze the cascading effects of individual plays on overall game state. Voice narration enhances the review experience by providing automatic commentary without requiring coaches to read event descriptions.
- **Trigger**: User selects "Replay" tab and chooses a match from the history list
- **Progression**: Browse match history → Filter by result (all/wins/losses) → Select match → View match summary with stats → Click "Watch Replay" → Replay loads with full timeline → Enable voice narration (optional) → Adjust narration volume → Use playback controls (play/pause/skip/speed) → Scrub timeline to specific moments → Voice narrator describes key events automatically → Jump to key moments via markers → Review player stats at any timestamp → Analyze events and mistakes in context → Return to match list or select another match
- **Success criteria**: Smooth timeline scrubbing with <100ms response, synchronized updates across all stats displays, clear visual markers for key moments (objectives, mistakes, kills), playback speed controls (0.5x - 4x), ability to jump to any point in the timeline instantly, event details displayed contextually with game state, and natural-sounding voice narration that describes key moments with appropriate timing and context

### Mistake Heatmap Visualization (NEW)
- **Functionality**: Interactive spatial heatmap showing where mistakes occur on the map at different game times. Features time-range filtering, category/impact filters, intensity-based visualization with radial gradient overlays, and zone-based statistics. Displays mistake clustering with hover tooltips showing detailed information for each incident.
- **Purpose**: Enable coaches to identify geographical patterns in team mistakes, discover high-risk zones, and understand how positioning errors correlate with game phase and map objectives
- **Trigger**: User selects "Heatmap" tab from main navigation
- **Progression**: Load heatmap view → Display all mistakes as spatial overlay on map grid → Use time slider to filter by game phase (early/mid/late) → Apply category filters (positioning, mechanics, etc.) → Apply impact filters (critical/high/medium/low) → Hover over heat zones to see mistake details → View zone statistics showing hotspots → Identify patterns in Baron/Dragon pit areas → Generate insights about territorial risk zones
- **Success criteria**: Clear visualization of mistake density with color-coded intensity, smooth filtering with <200ms response, accurate spatial positioning on map grid, hover tooltips display within 100ms, and zone statistics accurately aggregate mistakes by map region

### Live Series State Tracking (NEW)
- **Functionality**: Real-time tracking of DOTA 2 series state via GRID's Live Data Feed API. Monitors active games within a series, displaying live player stats including kills, deaths, net worth, money, and real-time position coordinates on the map. Features automatic polling every 3 seconds, series finder for upcoming matches, and comprehensive game state visualization.
- **Purpose**: Provide coaches with granular, real-time insight into ongoing DOTA 2 matches, enabling immediate tactical analysis and strategic decision-making during live games
- **Trigger**: User selects "Series" tab and either manually enters a series ID or selects from upcoming matches in the series finder
- **Progression**: Access Series tab → Browse upcoming DOTA 2 series (optional) → Select or enter series ID → Click "Start Tracking" → System polls GRID Series State API every 3 seconds → Display series overview (format, team scores, status) → Show active games with player details → View live KDA stats, net worth, gold, and map positions → Monitor team scores and game progress → Receive warnings for permission errors or invalid series → Stop tracking or reset to select new series
- **Success criteria**: Successfully connects to GRID Series State API, polls data every 3 seconds without overwhelming the API, displays real-time player stats with <3s latency, handles permission errors gracefully with clear messaging, presents upcoming series from Central Data API for easy selection, and visualizes player positions and economic stats with smooth updates

### Analytics Export & Reporting (NEW)
- **Functionality**: Comprehensive export system allowing coaches to save analytics reports in multiple formats (PDF and CSV). Supports team-wide analytics exports, individual player reports, strategic impact analyses, multi-match trend reports, and mistake heatmap data. PDF exports include professional formatting with charts, tables, and visual branding. CSV exports provide raw data for further analysis in external tools like Excel.
- **Purpose**: Enable coaches to share insights with team management, create coaching materials, archive historical analyses, and integrate data with external analytics tools
- **Trigger**: User clicks "Export" button available in header and throughout key analytics views (Dashboard, Players, Insights, Strategic Impact, Trends, Heatmap)
- **Progression**: Navigate to desired view → Configure filters/selections → Click Export button → Choose format (PDF or CSV) → System generates report with current data → PDF opens in new window ready to print → CSV downloads automatically → Toast notification confirms success → Reports include timestamp and comprehensive data
- **Success criteria**: Export generation completes within 2 seconds, PDF reports are print-ready with professional formatting, CSV files are Excel-compatible with proper escaping, all current filters and selections are preserved in export, reports include generation timestamp and metadata, file naming follows consistent pattern (e.g., team-analytics-2024-01-15.csv)

## Edge Case Handling
- **Incomplete match data**: Display partial analysis with confidence indicators for each insight based on data completeness
- **First-time player analysis**: Show limited historical context but focus on single-match deep dive with provisional insights
- **No significant patterns detected**: Present baseline performance metrics and suggest areas for focused data collection
- **AI processing delays**: Show loading state with progress indicators and allow partial results streaming
- **Contradictory data points**: Flag conflicting insights and present multiple interpretations with confidence scores
- **Voice narration unavailable**: Gracefully detect when browser doesn't support Web Speech API and disable voice controls with informative message
- **Narration queue overflow**: Intelligently prioritize high-impact events over routine updates when multiple events occur simultaneously

## Design Direction
The design should evoke the feeling of a cutting-edge command center—intelligent, precise, and performance-oriented. Think "Moneyball meets esports war room": data-rich but not overwhelming, with a focus on clarity and actionable intelligence. The aesthetic should feel modern and technical, with a slight edge that resonates with competitive gaming culture while maintaining professional coaching credibility.

## Color Selection
A dark, high-contrast scheme with electric accents that emphasizes data clarity and creates focus.

- **Primary Color**: Deep space blue `oklch(0.18 0.04 240)` - Conveys intelligence, depth, and strategic thinking; provides excellent backdrop for data visualization
- **Secondary Colors**: 
  - Slate gray `oklch(0.28 0.015 240)` for cards and elevated surfaces
  - Charcoal `oklch(0.15 0.01 240)` for subtle differentiation
- **Accent Color**: Electric cyan `oklch(0.72 0.16 195)` - High-tech, attention-grabbing for key insights and CTAs; represents data-driven precision
- **Supporting Colors**:
  - Success green `oklch(0.68 0.18 145)` for positive trends and improvements
  - Warning amber `oklch(0.75 0.15 65)` for attention areas
  - Critical red `oklch(0.60 0.22 25)` for high-impact mistakes
- **Foreground/Background Pairings**: 
  - Primary background (Deep space blue `oklch(0.18 0.04 240)`): White text `oklch(0.98 0 0)` - Ratio 9.2:1 ✓
  - Card background (Slate gray `oklch(0.28 0.015 240)`): White text `oklch(0.98 0 0)` - Ratio 11.8:1 ✓
  - Accent (Electric cyan `oklch(0.72 0.16 195)`): Deep blue text `oklch(0.18 0.04 240)` - Ratio 7.1:1 ✓
  - Critical red (Alert `oklch(0.60 0.22 25)`): White text `oklch(0.98 0 0)` - Ratio 4.8:1 ✓

## Font Selection
Typography should balance technical precision with competitive energy, using distinct typefaces that communicate both data credibility and esports culture.

- **Primary Font**: "Space Grotesk" - A geometric sans-serif with technical character that feels modern and performance-oriented without being overly futuristic
- **Monospace Font**: "JetBrains Mono" - For data displays, metrics, and technical information; reinforces precision

- **Typographic Hierarchy**:
  - H1 (Page Title/Section Headers): Space Grotesk Bold / 32px / -0.02em letter spacing / line-height 1.2
  - H2 (Subsection Headers): Space Grotesk Semibold / 24px / -0.01em letter spacing / line-height 1.3
  - H3 (Card Headers/Categories): Space Grotesk Medium / 18px / normal letter spacing / line-height 1.4
  - Body (Descriptions/Insights): Space Grotesk Regular / 15px / normal letter spacing / line-height 1.6
  - Data/Metrics: JetBrains Mono Medium / 14px / 0.01em letter spacing / line-height 1.5
  - Labels/Tags: Space Grotesk Medium / 13px / 0.02em letter spacing / uppercase / line-height 1.4

## Animations
Animations should feel purposeful and performance-oriented, with snappy timing that reinforces the platform's analytical precision. Use motion to guide attention to new insights and emphasize data relationships. Key animation moments: (1) Smooth transitions when switching between views to maintain spatial context, (2) Staggered reveal of insight cards to create rhythm and digestibility, (3) Pulsing glow on critical insights to draw immediate attention, (4) Number counter animations when metrics update to emphasize changes, (5) Subtle hover states with scale and glow on interactive elements to reinforce interactivity.

## Component Selection
- **Components**: 
  - Cards (heavily customized with gradient borders and glow effects for insight categories)
  - Tabs for switching between player/team/match views
  - Badge components for tagging mistake categories, severity levels, and impact ratings
  - Progress bars showing improvement trends and comparative metrics
  - Dropdown menus (Select) for player/match selection with search
  - Dialog for detailed insight deep-dives
  - Tooltips for metric explanations and contextual help
  - Accordion for collapsible insight sections
  - Separator for visual organization
  - Button (primary actions in accent cyan, secondary in slate)

- **Customizations**: 
  - Custom insight card component with category-based border colors and subtle glow effects
  - Metric display component using JetBrains Mono with animated number changes
  - Pattern visualization component showing frequency over time
  - Impact correlation component visualizing mistake-to-outcome chains
  - AI recommendation component with confidence indicators

- **States**: 
  - Buttons: Default (solid accent/slate), Hover (scale 1.02 with enhanced glow), Active (scale 0.98), Disabled (50% opacity)
  - Cards: Default (subtle border), Hover (elevated with stronger border glow), Selected (persistent glow with accent border)
  - Inputs/Selects: Default (border), Focus (accent border with glow), Filled (subtle background change), Error (red border)

- **Icon Selection**: 
  - ChartBar, TrendUp, TrendDown for performance metrics
  - Target, Crosshair for accuracy/precision indicators  
  - Lightning for high-impact insights
  - User, Users for player/team views
  - Brain, Cpu for AI-powered analysis
  - Warning, WarningCircle for critical mistakes
  - CheckCircle, XCircle for outcome indicators
  - MagnifyingGlass for search/analysis
  - List, Grid for view toggles

- **Spacing**: 
  - Card padding: `p-6` (24px)
  - Section gaps: `gap-8` (32px) for major sections, `gap-4` (16px) for related content
  - Grid layouts: `gap-6` (24px) between cards
  - Inline elements: `gap-2` (8px) for badges/tags, `gap-3` (12px) for button groups

- **Mobile**: 
  - Single column layout for dashboard cards
  - Bottom sheet drawer for player/match selection instead of sidebar
  - Tabbed navigation at top for major sections (Dashboard/Players/Matches)
  - Sticky header with condensed metrics
  - Collapsible insight cards (accordion style) to manage vertical space
  - Touch-optimized buttons (min 44px hit area)
  - Horizontal scroll for comparative charts
  - Simplified visualizations focusing on key metrics only
