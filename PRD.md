# Assistant Coach - Esports Analytics Platform

A data-driven coaching assistant that transforms raw esports match data into actionable insights, connecting individual player performance patterns to team-level strategic outcomes in near-real-time.

**Experience Qualities**:
1. **Authoritative** - The platform should feel like a trusted strategic advisor, presenting complex analytics with confidence and clarity
2. **Surgical** - Every insight should be precise and actionable, cutting through noise to reveal meaningful patterns that drive decision-making
3. **Dynamic** - The interface should feel alive with data, using motion and visual hierarchy to guide attention to the most critical insights

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a sophisticated analytics platform that requires multiple interconnected views (player analysis, match review, strategic insights), advanced data processing, AI-powered pattern recognition, and rich data visualizations. It goes beyond simple CRUD operations to deliver intelligent coaching recommendations based on multi-dimensional data analysis.

## Essential Features

### Multi-Entity Data Import System (NEW)
- **Functionality**: Comprehensive data import system supporting CSV and JSON file uploads through the AI Chat interface. Features **multi-entity JSON imports** that allow uploading players, teams, matches, and tournaments in a single file. Supports three import modes: (1) CSV format for quick player roster updates with auto-type conversion, (2) JSON single-entity arrays for structured player data with nested biographies and career histories, and (3) **JSON multi-entity objects** containing all data types at once with maintained relationships between entities. System includes intelligent parsing, validation, auto-ID generation, detailed import summaries, and persistent storage via KV. Includes downloadable sample files and comprehensive Data Import Guide.
- **Purpose**: Enable coaches to quickly populate the platform with comprehensive team data from external sources, migrate historical data, or update rosters mid-season. Multi-entity import eliminates the need for multiple file uploads by allowing all related data (roster, team info, match history, tournament schedule) to be imported together while maintaining referential integrity.
- **Trigger**: User opens AI Chat Support, clicks file upload button (📄 icon), and selects a CSV or JSON file, or downloads sample files from Data Import Guide card
- **Progression**: Open AI Chat → Click upload button → Select file (CSV/JSON) → System detects format → Parse and validate data → Auto-detect entity types (players/teams/matches/tournaments) → Convert numeric fields and generate missing IDs → Import and merge with existing data → Display detailed summary showing counts per entity type → Persist to KV storage → Data immediately available in respective dashboard tabs → AI assistant provides confirmation with breakdown
- **Success criteria**: Successfully parses CSV with proper comma/quote handling, validates JSON syntax, supports files up to 10MB, auto-converts numeric strings to numbers, generates unique IDs when missing, correctly identifies all four entity types in multi-entity JSON, merges new data without duplicates, persists imported data across sessions, provides clear error messages for malformed files, displays granular import summary (e.g., "5 players, 3 teams, 12 matches, 2 tournaments"), maintains biography and career history nested objects, includes 3 downloadable sample files (multi-entity, players+teams, players CSV)

### GRID API Integration with Batch Biography Enrichment
- **Functionality**: Direct integration with GRID's esports data API to fetch real Cloud9 match data, player statistics, and live game information. The application comes pre-configured with a valid GRID API key for immediate access. Now includes GRID Statistics Feed API for detailed player and team statistics. **NEW: Batch AI-powered biography enrichment** that automatically generates comprehensive player biographies for all players at once with real-time progress tracking, including career histories, playstyle descriptions, and signature moves using OpenAI's GPT models combined with GRID player data (nationality, career start date, statistics).
- **Purpose**: Replace mock data with authentic esports analytics from official tournament and team data, provide granular statistics for performance analysis, and enrich player profiles with contextual biographical information that helps coaches understand each player's journey, strengths, and competitive identity. Batch processing allows coaches to enrich entire rosters in one operation with visual feedback.
- **Trigger**: Application auto-initializes GRID API on load with the pre-configured key. Batch biography enrichment is triggered manually via "Enrich All" button in the Batch Biography Enrichment panel on Dashboard or Players tab
- **Progression**: Auto-initialize API → Connect to GRID endpoint → Fetch Cloud9 roster with basic info (nickname, nationality, career start) → Retrieve recent matches → Cache data locally → Auto-refresh on demand → Display connection status → Fetch detailed statistics from Statistics Feed API → (Optional) User views Batch Biography Enricher panel showing N players without biographies → User clicks "Enrich All" → System displays progress bar (0-100%) → For each player: Show "processing" status with animated icon → AI generates personalized biography (2-3 sentences) based on stats and career → AI creates playstyle description (10-15 words) → AI generates signature move/characteristic (5-8 words) → AI generates 3-5 career milestones with realistic progression → Update progress indicator → Show "completed" status with checkmark → Move to next player → Display final results summary (X succeeded, Y failed) → Save all enriched data to persistent KV storage → Display enriched biographies in Player Biography view with nationality, career start, playstyle, signature, timeline → User can "Clear All" to reset biographies
- **Success criteria**: Automatic authentication on load, data retrieval within 3 seconds, graceful fallback to cached/mock data on failure, clear error messaging, successful statistics queries with proper data aggregation, batch biography enrichment completes within 5-8 seconds per player with natural-sounding AI-generated content showing real-time progress (percentage and individual player status), career milestones are chronologically ordered and realistic, enriched data persists across sessions in KV storage, clear visual feedback for each player's enrichment status (pending/processing/completed/error), ability to clear all biographies and re-enrich

### Detailed Statistics View (NEW)
- **Functionality**: Comprehensive player and team statistics dashboard powered by GRID's Statistics Feed API. Displays granular metrics including kills/deaths per game, win rates, win/loss streaks, series performance, and segment-level statistics. Features series filtering to analyze all-time stats or specific match ranges (e.g., last 3 matches). **Now includes advanced game title filtering (League of Legends, Valorant, CS2)** to view title-specific statistics and compare performance across different esports titles. Supports both player-level and team-level statistics with detailed breakdowns.
- **Purpose**: Provide coaches with deep statistical insights into individual player performance and team dynamics across multiple esports titles, enabling data-driven coaching decisions and performance tracking over time with title-specific context
- **Trigger**: User selects "Stats" tab from main navigation and chooses a player or team to analyze
- **Progression**: Access Statistics tab → Select game title filter (All/LoL/Valorant/CS2) → View filtered player and team counts → Choose player or team view → Select player/team from filtered dropdown → Choose series filter (all matches or last 3) → Click "Fetch Stats" → System queries GRID Statistics Feed API → Display comprehensive stats dashboard with title badge → View games played, win rate percentage, average kills/deaths → Analyze kill/death min/max/avg statistics → Review win/loss streaks (current, best, worst) → Examine segment-level performance metrics → Switch between player and team views → Apply different series filters for time-based analysis → Change title filter to compare across games → Stats automatically reset when filter changes
- **Success criteria**: Successfully fetches statistics from GRID Statistics Feed API within 2 seconds, displays accurate metrics with proper aggregation, handles empty/zero data gracefully, presents win rate percentages correctly, shows streak data with current and historical records, supports series ID filtering for focused analysis, provides clear visual hierarchy for different stat categories, accurately filters players and teams by game title, displays title badges in stat panels, resets stats when filter changes, and shows appropriate messaging when no data exists for selected title

### Live Match Tracking with Real-Time KDA Updates
- **Functionality**: Real-time monitoring of ongoing Cloud9 matches with automatic game detection, live updates to player KDA (Kills/Deaths/Assists), CS (Creep Score), gold, and objective control. Features automatic polling of GRID API for live game data with seamless fallback to simulation mode. **Match results now correctly reflect professional esports formats**: all matches end in either Win or Loss (no draws), as esports formats (Best-of-1, Best-of-3, Best-of-5) always produce a winner. Match data includes realistic scores (e.g., "2-1", "13-7", "16-12") and proper tournament/format metadata for League of Legends, Valorant, and CS2 competitions.
- **Purpose**: Enable coaches to track performance as it happens and identify in-game patterns for immediate strategic adjustments. Match history accurately reflects the competitive nature of professional esports where draws are virtually non-existent.
- **Trigger**: Auto-detection when live Cloud9 matches begin (when enabled), or manual game selection from available matches
- **Progression**: Enable auto-detect → System checks for live Cloud9 games every 30 seconds → When match detected, automatically connect → Poll GRID API every 5 seconds for stats → Display real-time updates with smooth animations → KDA changes highlight with color → Track objectives and gold differentials → Coach can pause/resume/reset tracking → Switch between GRID data and simulation modes → View match results with correct Win/Loss outcomes and series scores
- **Success criteria**: Automatic match detection within 30 seconds of game start, smooth stat updates with <5s latency, visual feedback clearly highlights stat changes, graceful fallback to simulation when GRID data unavailable, clear indicators showing data source (GRID API vs Simulation), all match results correctly show Win or Loss (never Draw), match scores accurately reflect game format (Bo1/Bo3/Bo5 for LoL, round scores for Valorant/CS2)

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

### AI-Powered Title Recommendations (NEW)
- **Functionality**: Intelligent recommendation system that analyzes player playstyles using six core metrics (aggression, precision, teamwork, strategy, mechanics, adaptability) and suggests which esports title best matches their strengths. Uses AI to generate detailed playstyle profiles, calculates compatibility scores for League of Legends, Valorant, and CS2, and provides role recommendations within each title. Features include comprehensive reasoning for each recommendation, identification of player strengths and growth areas, and real-time AI insights powered by the Spark LLM API.
- **Purpose**: Help organizations make data-driven decisions about player recruitment, roster construction, and individual player development by matching playstyles to game requirements
- **Trigger**: User selects "Recommend" tab from main navigation and chooses a player to analyze
- **Progression**: Access recommendations tab → Select player from roster → Click "Analyze Playstyle" → AI generates playstyle metrics → System calculates title compatibility scores → Display rankings for all three titles → Show detailed breakdowns with strengths, growth areas, and role recommendations → Generate AI expert analysis explaining top match → Review reasoning and metrics for each title option
- **Success criteria**: Successfully analyzes player attributes within 2 seconds, generates accurate playstyle metrics, provides compatibility scores with clear reasoning, highlights top title match prominently, delivers actionable role recommendations, integrates AI insights that explain the analysis in natural language, and presents results in an easily digestible visual format

### AI Chat Support Assistant with Data Import (NEW)
- **Functionality**: Interactive AI-powered chat interface accessible via floating action button in the bottom-right corner. Features include: intelligent Q&A about platform features and analytics interpretation, suggested prompt recommendations for common questions (displayed in a scrollable area), image and video upload with AI-powered visual recognition and analysis, voice chat capability with real-time transcription, persistent chat history during session, and contextual responses about Cloud9 esports analytics. **Enhanced scrolling features** include: custom-styled scrollbars matching the app theme, smooth auto-scroll to bottom on new messages, intelligent scroll position detection, floating scroll-to-top and scroll-to-bottom buttons that appear when scrolled away from edges, and sticky scroll behavior that maintains user position when reviewing history. The chat interface includes media preview, recording indicators, smooth animations, and scrollable suggested prompts area. **NEW: Data File Import with Robust Validation** - Users can now upload JSON and CSV files containing player, team, tournament, or match data directly through the chat interface. The system features: **Advanced CSV parser** supporting quoted fields, comma-separated values, automatic type detection (numbers vs strings), and proper handling of complex data structures; **Enhanced error handling** with file size validation (10MB limit), empty file detection, JSON syntax validation, CSV format checking, and descriptive error messages; **Intelligent data detection** that identifies whether uploaded data is players, teams, matches, or tournaments; **Comprehensive feedback** showing import statistics, entity counts, and success/failure details in natural language. Supports both single-entity files (e.g., array of players) and multi-entity files (e.g., object with players, teams, matches properties).
- **Purpose**: Provide instant, contextual help and guidance to coaches and analysts using the platform, reducing learning curve and enabling self-service problem-solving. Supports multimodal interaction (text, voice, images, video, data files) to accommodate different user preferences and use cases. Enhanced scrolling ensures users can easily navigate long conversation histories while maintaining context. Data import capability enables teams to bring their own data into the system with confidence, supplementing GRID API data with custom player rosters, historical match records, or organizational information. Robust validation prevents bad data from corrupting the system while providing clear guidance when issues occur.
- **Trigger**: User clicks the pulsing chat icon button in the bottom-right corner of the screen
- **Progression**: Click chat FAB → Chat window slides up with welcome message → View scrollable suggested prompts (all 10 questions including data import help) → Click suggestion to auto-fill or type custom question → (Optional) Upload image/video by clicking media buttons → Preview uploaded media with remove option → **NEW: (Optional) Upload data file (JSON/CSV) by clicking file upload button** → **System validates file size (max 10MB)** → **System checks file is not empty** → **For JSON: Validate syntax and structure** → **For CSV: Parse with quote handling and type detection** → **Extract players, teams, matches, tournaments from file structure** → **If valid data found: Import records into database** → **Display detailed import confirmation with entity breakdown** → **Show file name badge in chat with appropriate icon (JSON/CSV)** → **AI acknowledges import with statistics and guidance** → **If errors found: Show descriptive error message with format guidance** → **Suggest corrections and provide sample format examples** → (Optional) Start voice recording by clicking microphone → Record voice message → Stop recording to auto-transcribe → Type or record message → Press send or Enter → AI processes request with loading indicator → Chat auto-scrolls to new message if at bottom → Receive contextual response about platform features or data import → Scroll up to review previous messages → Floating scroll buttons appear (scroll-to-top always, scroll-to-bottom when not at bottom) → Click scroll buttons for instant navigation → Continue conversation with follow-up questions → View message history with timestamps in scrollable area → Custom scrollbar provides visual feedback → Close chat by clicking X or FAB again
- **Success criteria**: Chat opens/closes with smooth animation (<300ms), AI responses arrive within 2-3 seconds, auto-scroll activates only when user is at bottom of chat, floating scroll buttons appear/disappear based on scroll position with smooth fade animations, custom scrollbar styling matches app theme (cyan accent color), scroll-to-bottom button only shows when scrolled up >50px from bottom, scroll-to-top button shows when scrolled >100px from top, suggested prompts area scrolls independently with visible scrollbar, voice recording starts without permission errors, uploaded images/videos preview correctly, suggested prompts cover 80% of common questions, AI provides accurate platform-specific guidance, message history persists during session, chat interface is mobile-responsive, voice transcription placeholder appears after recording stops, floating button has visual indicator (pulsing dot) when closed, scroll position detection responds within 100ms, **data file uploads parse within 1 second, JSON and CSV formats both supported with proper quote handling, files larger than 10MB are rejected with clear message, empty files are detected before parsing, JSON syntax errors show helpful messages, CSV files auto-detect number vs string types, imported data appears immediately in relevant views (Players, Teams, etc.), detailed import summary shows entity counts, file upload errors provide format guidance with examples, imported records persist across sessions via KV storage, file name displays with appropriate icon (JSON/CSV), AI explains import results in natural language with statistics, and input is reset after upload to allow multiple files**

## Edge Case Handling
- **Incomplete match data**: Display partial analysis with confidence indicators for each insight based on data completeness
- **First-time player analysis**: Show limited historical context but focus on single-match deep dive with provisional insights
- **No significant patterns detected**: Present baseline performance metrics and suggest areas for focused data collection
- **AI processing delays**: Show loading state with progress indicators and allow partial results streaming
- **Contradictory data points**: Flag conflicting insights and present multiple interpretations with confidence scores
- **Voice narration unavailable**: Gracefully detect when browser doesn't support Web Speech API and disable voice controls with informative message
- **Narration queue overflow**: Intelligently prioritize high-impact events over routine updates when multiple events occur simultaneously
- **AI recommendation API failure**: Display fallback recommendations based on statistical analysis when LLM is unavailable, with clear indication of reduced confidence
- **Player with no historical data**: Generate provisional recommendations based on role and basic stats, flagging results as preliminary
- **Chat microphone access denied**: Show clear error message explaining microphone permission is required for voice chat, with button to retry
- **Chat AI response failure**: Display friendly error message with retry option, maintain conversation history so user doesn't lose context
- **Large image/video upload**: Validate file size (recommend <10MB) and show warning/error if file is too large for processing
- **Chat session with no messages**: Display welcome message and suggested prompts to guide first interaction
- **Rapid-fire messages**: Queue messages and process sequentially to avoid overwhelming the AI API or creating out-of-order responses
- **Invalid data file format**: Detect malformed JSON/CSV and display helpful error message explaining expected format with examples and links to sample files
- **Data file with missing required fields**: Parse available fields and import partial data with field mapping, notify user which fields were missing or had invalid values
- **Duplicate player IDs in import**: Append timestamp to duplicate IDs to avoid collisions (e.g., player-1 becomes player-1-1640000000), show warning about duplicates found with count
- **Empty data file**: Validate file is not empty before processing, show error if file size is 0 bytes or contains only whitespace
- **Mixed data types in CSV**: Attempt intelligent type coercion (strings to numbers), skip invalid rows with warning showing line numbers that failed
- **Large data files (>10MB)**: Reject files exceeding size limit with clear message showing file size and maximum allowed size
- **CSV with quoted commas**: Handle quoted fields containing commas correctly (e.g., "Smith, John" should not split on the comma)
- **CSV with inconsistent columns**: Validate all rows have same number of columns, show warning if row column count doesn't match header
- **JSON with nested objects**: Flatten nested biography and careerHistory objects correctly into Player type structure
- **File upload during active chat**: Allow file uploads at any time, queue processing if AI is currently responding
- **Multiple rapid file uploads**: Prevent multiple simultaneous uploads, show message if user tries to upload before previous file completes

## Design Direction
The design should evoke the feeling of a cutting-edge command center—intelligent, precise, and performance-oriented. Think "Moneyball meets esports war room": data-rich but not overwhelming, with a focus on clarity and actionable intelligence. The aesthetic should feel modern and technical, with a slight edge that resonates with competitive gaming culture while maintaining professional coaching credibility.

**NEW: Dynamic Visual Effects** - The application features an immersive, animated background system inspired by Cloud9's esports brand identity and competitive gaming aesthetics. Includes:
- **Particle Network System**: Animated particle field with interconnected nodes that pulse and move across the screen, creating a sense of data flow and connectivity
- **Ambient Gradients**: Multiple animated radial gradients that shift and pulse to create atmospheric depth
- **Energy Beams**: Subtle horizontal and vertical light beams that traverse the screen, evoking the energy of competitive gaming
- **Mouse Trail Effect**: Interactive particle trail that follows cursor movement with fade and scale animations, enhancing user engagement
- **Floating Particles**: Rising particle elements that drift upward with natural physics, adding life to the interface
- **Animated Cloud9 Logo**: Subtle, pulsing C9 watermark with glow effects positioned in the corner as a branded element
- All effects use Cloud9's signature cyan color palette with transparency and blend modes to avoid overwhelming content

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

**NEW: Enhanced Background Animations** - The application features layered, performance-optimized animations that create an immersive esports environment:
- **Particle Network Animation**: Canvas-based particle system with physics-based movement and connection lines between nearby particles, creating organic data-flow visualization
- **Radial Gradient Pulses**: Multiple overlapping radial gradients that scale and fade in 8-15 second loops for ambient atmosphere
- **Energy Beam Sweeps**: Linear gradients moving across the screen horizontally and vertically at varying speeds (4-7 seconds) creating scanning/tracking effects
- **Mouse Trail Physics**: Real-time particle generation on cursor movement with smooth fade-out, scale animations (0.3s duration), and size progression
- **Floating Particle Rise**: 20 particles continuously rising from bottom to top with randomized horizontal drift and opacity transitions
- **Logo Pulse Animation**: Subtle rotation (-5° to 5°), scale (1.0 to 1.05), and glow intensity changes on C9 watermark (8s duration)
- All animations use `framer-motion` and native CSS for optimal performance, with careful layering via z-index and blend modes to ensure content readability

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
  - ChatCircleDots for AI chat support
  - Microphone, VideoCamera, Image for media inputs
  - PaperPlaneRight for message sending

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
