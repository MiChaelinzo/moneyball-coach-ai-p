# Assistant Coach - Esports Analytics Platform

A data-driven coaching assistant that transforms raw esports match data into actionable insights, connecting individual player performance patterns to team-level strategic outcomes in near-real-time.

**Experience Qualities**:
1. **Authoritative** - The platform should feel like a trusted strategic advisor, presenting complex analytics with confidence and clarity
2. **Surgical** - Every insight should be precise and actionable, cutting through noise to reveal meaningful patterns that drive decision-making
3. **Dynamic** - The interface should feel alive with data, using motion and visual hierarchy to guide attention to the most critical insights

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a sophisticated analytics platform that requires multiple interconnected views (player analysis, match review, strategic insights), advanced data processing, AI-powered pattern recognition, and rich data visualizations. It goes beyond simple CRUD operations to deliver intelligent coaching recommendations based on multi-dimensional data analysis.

## Essential Features

### AI-Powered Match Analysis
- **Functionality**: Analyzes historical match data to identify recurring patterns in player mistakes and their strategic impact
- **Purpose**: Transforms raw match data into coaching insights that connect micro-level errors to macro-level outcomes
- **Trigger**: User uploads match data or selects from historical matches
- **Progression**: Select match → AI processes data → System identifies patterns → Display categorized insights with impact metrics → Generate recommendations
- **Success criteria**: AI successfully identifies at least 3-5 meaningful patterns per match with clear impact correlations

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
- **Functionality**: AI identifies recurring patterns across multiple matches and generates prioritized coaching recommendations
- **Purpose**: Move beyond reactive analysis to proactive strategic planning
- **Trigger**: System continuously analyzes accumulated match data in background
- **Progression**: System detects pattern → Calculates frequency and impact → Generates recommendation → Prioritizes by impact potential → Presents to coach with supporting data
- **Success criteria**: Recommendations are specific, actionable, and backed by quantitative evidence

### Comparative Analytics
- **Functionality**: Compare player/team performance against league averages, historical benchmarks, or specific opponents
- **Purpose**: Contextualize performance and identify competitive advantages or vulnerabilities
- **Trigger**: Coach selects comparison mode and defines parameters
- **Progression**: Select comparison type → Choose baseline (league avg, opponent, historical) → System calculates differentials → Display comparative visualizations → Highlight significant deviations
- **Success criteria**: Clear visualization of performance gaps with statistical significance indicators

## Edge Case Handling
- **Incomplete match data**: Display partial analysis with confidence indicators for each insight based on data completeness
- **First-time player analysis**: Show limited historical context but focus on single-match deep dive with provisional insights
- **No significant patterns detected**: Present baseline performance metrics and suggest areas for focused data collection
- **AI processing delays**: Show loading state with progress indicators and allow partial results streaming
- **Contradictory data points**: Flag conflicting insights and present multiple interpretations with confidence scores

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
