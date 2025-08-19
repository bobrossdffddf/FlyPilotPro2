# 24FLY Aviation Tablet Interface

A professional aviation flight management application designed to replicate the look and functionality of modern A320-style Electronic Flight Bag (EFB) tablets used in commercial cockpits.

## Features

### 🎙️ Professional PA System
- **ElevenLabs Voice Synthesis**: Realistic text-to-speech for all announcements
- **Airline-Specific Voices**: Auto-detection of airline from callsign with appropriate accent/language
- **Dual Language Support**: Announcements in both English and airline's native language
- **Virtual Microphone Integration**: Setup guide for use with flight simulators
- **Professional Announcements**: Pre-written scripts for all flight phases

### 📊 Air Traffic Control Radar
- **Real-time Aircraft Tracking**: Live ATC24 data integration
- **Popout Capability**: Drag radar display to separate window
- **Range Selection**: 25, 50, 100, 200 nautical mile ranges
- **Flight Data Tags**: Callsign, altitude (flight level), ground speed
- **Professional Radar Scope**: Green phosphor display with compass roses

### 🗺️ Aviation Charts Library
- **Chart Types Supported**:
  - Approach Charts (ILS, VOR, NDB, Visual)
  - SID Charts (Standard Instrument Departures)
  - STAR Charts (Standard Terminal Arrival Routes)  
  - Airport Diagrams
  - Taxi Charts
  - Area Charts
  - Terminal Charts
  - Enroute Charts
  - Noise Abatement Charts
  - Ground Movement Charts
  - Parking Charts
  - Hot Spots Charts
  - Emergency Charts
- **Popout Functionality**: View charts in separate resizable windows
- **Search & Filter**: Find charts by airport code, type, or title
- **Upload Support**: Add custom chart images with metadata

### ✅ Aircraft Checklists
- **Multi-Aircraft Support**: Checklists for 20+ aircraft types including:
  - Airbus A320, A330, A340, A350, A380
  - Boeing 737, 747, 757, 767, 777, 787
  - ATR-72, Concorde, Cessna variants
- **Flight Phase Organization**: Pre-flight, startup, taxi, takeoff, climb, cruise, descent, approach, landing, shutdown, emergency
- **Progress Tracking**: Visual completion indicators and critical item warnings
- **Interactive Items**: Click to complete with mandatory item highlighting

### ⚖️ Weight & Balance Calculator
- **Professional Calculations**: Real aircraft specifications and limitations
- **Aircraft Database**: Accurate empty weights, fuel capacity, passenger limits
- **Real-time Updates**: Dynamic weight calculations with limit warnings
- **Visual Indicators**: Progress bars and status warnings for weight limits
- **Dual Units**: Metric (kg) and Imperial (lbs) display

### 📝 Flight Log & Notes
- **Flight-Specific Notes**: Associate notes with flight numbers
- **Persistent Storage**: All notes saved across sessions
- **Search Functionality**: Quick note retrieval
- **Professional Format**: Clean, organized note display

### 🛫 SIDs & STARs Database
- **Searchable Database**: Standard Instrument Departures and Arrivals
- **Airport Filtering**: Find procedures by airport code
- **Runway Association**: Procedures organized by runway
- **Detailed Information**: Complete procedure descriptions

## Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TanStack Query** for server state management
- **Framer Motion** for smooth animations
- **shadcn/ui** component library
- **Tailwind CSS** with aviation-themed colors

### Backend  
- **Express.js** with TypeScript
- **WebSocket** for real-time updates
- **Drizzle ORM** for database operations
- **PostgreSQL** for data persistence
- **ElevenLabs API** for voice synthesis

### External Integrations
- **ATC24 Real-time Data**: Live aircraft tracking
- **ElevenLabs TTS**: Professional voice synthesis
- **WebSocket Streaming**: Real-time aircraft updates

## Color Scheme (A320 Cockpit Inspired)

```css
--cockpit-dark: hsl(220, 15%, 8%)      /* Deep cockpit black */
--panel-bg: hsl(220, 12%, 12%)         /* Panel backgrounds */
--panel-gray: hsl(220, 8%, 18%)        /* Panel borders */
--aviation-blue: hsl(210, 100%, 65%)   /* Primary blue */
--nav-green: hsl(140, 100%, 50%)       /* Navigation green */
--caution-yellow: hsl(50, 100%, 60%)   /* Caution yellow */
--warning-orange: hsl(25, 100%, 55%)   /* Warning orange */
--text-primary: hsl(0, 0%, 95%)        /* Primary text */
--text-secondary: hsl(0, 0%, 80%)      /* Secondary text */
--text-muted: hsl(0, 0%, 60%)          /* Muted text */
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database
- ElevenLabs API key (for voice synthesis)

### Environment Variables
```bash
ELEVENLABS_API_KEY=your_api_key_here
DATABASE_URL=your_postgres_connection_string
```

### Installation
```bash
npm install
npm run dev
```

### Virtual Microphone Setup
For use with flight simulators:
1. Install VoiceMeeter Banana (free)
2. Set VoiceMeeter Input as default microphone
3. Route browser audio through VoiceMeeter
4. Use PA System for live announcements

## Deployment for Raspberry Pi Zero 2

### Optimizations for ARM/Limited Resources
- Pre-built static assets
- Minimal runtime dependencies
- Optimized bundle sizes
- Efficient database queries
- Reduced animation complexity on mobile

### Build Commands
```bash
npm run build
npm run build:pi  # Special Pi-optimized build
```

## Development Guidelines

### Code Structure
- `client/src/components/tabs/` - Main tab components
- `client/src/components/ui/` - Reusable UI components  
- `client/src/data/` - Static data and configurations
- `server/` - Backend API and services
- `shared/` - Shared types and schemas

### Adding New Aircraft Types
1. Update `shared/schema.ts` aircraft types
2. Add specifications to weight & balance calculator
3. Create aircraft-specific checklists
4. Update airline configurations if needed

### Adding New Chart Types
1. Add to `chartTypes` array in charts component
2. Update chart upload form validation
3. Consider specialized display requirements

## License

Professional aviation software for educational and simulation use. Not certified for actual flight operations.

## Contributing

Please follow the established code patterns and maintain the professional aviation theme throughout all components.