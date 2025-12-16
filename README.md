# 🚄 SpeedLine Train Traffic Management System

**Next-Generation Railway Operations Platform with Real-Time AI Optimization**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://speedline-frontend.onrender.com)
[![Backend API](https://img.shields.io/badge/API-Live-blue)](https://speedline-backend-vmtj.onrender.com)

A production-ready full-stack railway traffic management dashboard featuring live train tracking with geographic visualization, AI-powered route optimization, real-time conflict detection, and interactive what-if scenario simulations.

---

## 🌟 Core Features

### 📍 Interactive Geographic Map
- **Real-time train positioning** on interactive SVG-based map with dynamic coordinate interpolation
- **Pan & Zoom controls** with smooth mouse-based navigation (zoom 10-200%)
- **Live route visualization** showing station connections with single/double/triple track indicators
- **Train selection & hover states** with detailed tooltip overlays showing speed, status, destination
- **Section-based positioning** calculated from network topology and train progress
- **6 geographic stations** (STN_A through STN_F) with realistic lat/lng coordinates
- **Color-coded train markers** reflecting real-time status (On Time, Delayed, Waiting, Arrived)

### 🎯 Live Train Dashboard
- **Horizontal timeline visualization** with proportional section lengths
- **Color-matched tooltips** that dynamically reflect train status (green=On Time, red=Delayed, orange=Waiting, blue=Arrived, gray=Cancelled)
- **1-second polling** for continuous updates without manual refresh
- **Timestamp-based re-rendering** ensuring UI updates on every backend snapshot change
- **Train detail overlays** showing journey count, priority, speed, direction, exact position in meters
- **Section occupancy indicators** with capacity utilization percentages
- **Multi-train section visualization** displaying concurrent trains on shared tracks

### 🧠 AI Optimization Engine
- **Real-time conflict detection** identifying overcapacity, headway violations, and route conflicts
- **Automated decision making** with priority-based scoring (proceed/hold/reroute recommendations)
- **Live polling system** (20-second intervals) with start/stop controls
- **Optimization schedule generation** projecting train movements with timestamp precision
- **Conflict severity classification** (low/medium/high) with visual indicators
- **Action history tracking** showing all AI recommendations with reasoning
- **Integration with OR-Tools** for complex route optimization algorithms
- **Background optimization** runs independently of frontend polling

### ⚠️ Disruption Management
- **Real-time disruption monitoring** with automatic alert system
- **Severity-based categorization** (low/medium/high/critical) with color-coded badges
- **Impact analysis** showing affected trains and sections
- **Recovery timeline tracking** with estimated resolution times
- **Disruption injection** for testing emergency scenarios
- **Filtered disruption views** (active/resolved/all)
- **Section-level disruption flags** propagating to train status updates

### 🎮 What-If Simulation Engine
- **Predefined scenario library** (delays, disruptions, maintenance, weather events)
- **Custom scenario builder** with train/section selection and severity adjustment
- **Real-time impact projection** calculating affected trains, delays, passenger impact, revenue loss
- **Alternative route suggestions** for affected trains
- **System state snapshots** capturing before/after simulation states
- **Multi-metric analysis** (capacity utilization, total delay minutes, passengers affected)
- **Interactive simulation controls** with live progress indicators
- **Reset functionality** to restore baseline operational state

### 📊 Performance Analytics Dashboard
- **Real-time KPI tracking** with live updates every second
- **Interactive Recharts visualizations**:
  - Line charts for on-time performance trends
  - Bar charts for delay distribution
  - Area charts for speed analysis
  - Pie charts for status breakdowns
- **System health monitoring** with uptime and availability metrics
- **Train performance history** (30-second rolling updates)
- **Network-wide statistics** (total trains, average speed, delay averages)
- **Trend indicators** with percentage change calculations

### 🎨 Modern UI/UX with Smooth Animations
- **Framer Motion animations** throughout:
  - Fade-in/fade-out transitions for tooltips and modals
  - Slide-in animations for sidebars and drawers
  - Spring physics for interactive elements
  - Staggered list animations for train cards
- **Responsive design** optimized for desktop, tablet, and mobile:
  - Mobile hamburger menu with slide-out navigation
  - Adaptive chatbot widget (90vw/70vh on mobile, standard on desktop)
  - Touch-friendly controls and increased tap targets
  - Breakpoint-based layout adjustments
- **ShadCN UI component library** providing:
  - Consistent design language across all pages
  - Accessible buttons, cards, dialogs, tooltips
  - Dark/light theme support (theme toggle in settings)
- **Tailwind CSS utilities** for rapid styling
- **Lucide React icons** for crisp, scalable iconography
- **Live status indicators** with pulse animations
- **Smooth hover states** and transition effects

### 💬 AI Chatbot Assistant
- **Floating widget** with expandable/collapsible interface
- **Responsive positioning** adapting to screen size
- **Typing indicators** with animated dots during AI response
- **Message history** with sender/receiver differentiation
- **Quick action buttons** for common queries
- **Window resize listener** for dynamic adjustment
- **Framer Motion animations** for smooth open/close

### 🔔 Real-Time Notification System
- **Bell icon badge** showing unread count
- **Notification drawer** with severity-based sorting
- **Auto-refresh** synced with disruption polling
- **Timestamp tracking** for read/unread state
- **Dismissible alerts** with smooth animations
- **Color-coded severity** (info/warning/error)

---

## 🛠️ Technology Stack

### Frontend Architecture
| Layer | Technologies |
|-------|-------------|
| **Framework** | Next.js 14 (App Router), React 18 with TypeScript 5 |
| **Styling** | Tailwind CSS 3.3 + ShadCN UI + Tailwind Animate |
| **Animations** | Framer Motion 12.23 (spring physics, gestures, variants) |
| **Data Fetching** | SWR 2.2 with 1-second polling + Axios 1.12 |
| **Charts** | Recharts 2.15 (Line, Bar, Area, Pie charts) |
| **Icons** | Lucide React 0.290 + Heroicons 2.2 |
| **State Management** | React hooks (useState, useEffect, useMemo, useCallback) + SWR cache |
| **UI Components** | Radix UI primitives (Dialog, Dropdown, Switch, Tabs, Tooltip) |
| **Utilities** | clsx, tailwind-merge, class-variance-authority |

### Backend Architecture
| Component | Technology |
|-----------|-----------|
| **API Framework** | FastAPI (Python 3.8+) with Pydantic 2.11 validation |
| **ASGI Server** | Uvicorn 0.36 with WebSocket support |
| **Simulation Engine** | Python threading (daemon background thread, 1s tick rate) |
| **Optimization** | OR-Tools 9.14 for constraint-based route optimization |
| **Data Models** | Pydantic schemas (TrainBundle, Section, Signal, Event) |
| **Lifecycle Management** | Modern `@asynccontextmanager` lifespan pattern |
| **Configuration** | JSON-based network topology (network_config.json) |

### Deployment & DevOps
| Service | Platform & Details |
|---------|-------------------|
| **Frontend Hosting** | Render (Node.js environment, auto-deploy on Git push) |
| **Backend Hosting** | Render (Python environment, automatic restarts) |
| **Build System** | Next.js compiler, Python pip |
| **CORS Configuration** | FastAPI middleware for cross-origin requests |
| **Environment Variables** | `.env.local` for local dev, Render dashboard for production |
| **Version Control** | Git with GitHub integration |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js 16+** and npm (or yarn/pnpm)
- **Python 3.8+** with pip (for local backend development)
- **Git** for version control

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/newSpeedLine.git
cd newSpeedLine/frontend/train-dashboard

# Install dependencies
npm install

# Create environment configuration
echo "NEXT_PUBLIC_API_BASE_URL=https://speedline-backend-vmtj.onrender.com" > .env.local

# Start development server
npm run dev
```

**Frontend runs at**: http://localhost:3000

### Backend Setup (Optional - for local development)

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements-3.txt

# Start FastAPI server
python3 data_1.py
```

**Backend runs at**: http://localhost:8000  
**API Documentation**: http://localhost:8000/docs (auto-generated Swagger UI)

---

## 📁 Project Structure

```
newSpeedLine/
├── frontend/
│   └── train-dashboard/
│       ├── app/                          # Next.js App Router
│       │   ├── page.tsx                  # Landing page
│       │   ├── layout.tsx                # Root layout with metadata
│       │   ├── globals.css               # Global styles + Tailwind directives
│       │   ├── dashboard/
│       │   │   └── page.tsx              # Main dashboard with live train positions
│       │   ├── disruptions/
│       │   │   └── page.tsx              # Disruption management interface
│       │   ├── optimization/
│       │   │   └── page.tsx              # Geographic map with live routes
│       │   ├── optimization-engine/
│       │   │   └── page.tsx              # AI optimization engine dashboard
│       │   ├── simulation/
│       │   │   └── page.tsx              # What-if scenario testing
│       │   └── health/
│       │       └── page.tsx              # System health monitoring
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/                   # ShadCN UI primitives
│       │   │   │   ├── button.tsx
│       │   │   │   ├── card.tsx
│       │   │   │   └── ... (other Radix UI wrappers)
│       │   │   ├── ChatbotWidget.tsx     # AI assistant with responsive sizing
│       │   │   ├── ControlPanel.tsx      # Simulation controls
│       │   │   ├── GeographicMap.tsx     # Interactive SVG map (621 lines)
│       │   │   ├── Legend.tsx            # Visual guide for symbols
│       │   │   ├── Navbar.tsx            # Navigation with mobile menu
│       │   │   ├── NotificationBell.tsx  # Alert badge with drawer
│       │   │   ├── Notifications.tsx     # Notification list
│       │   │   ├── RealTimeOptimization.tsx  # Live AI recommendations
│       │   │   ├── SettingsDrawer.tsx    # User preferences
│       │   │   ├── SimpleChart.tsx       # Lightweight chart wrapper
│       │   │   ├── StatsCard.tsx         # KPI display cards
│       │   │   └── TrainVisualization.tsx # Horizontal timeline (538 lines)
│       │   ├── hooks/
│       │   │   ├── useTrainData.ts       # SWR hook (1s polling)
│       │   │   ├── useHealthData.ts      # System health fetching
│       │   │   ├── useDisruptions.ts     # Disruption data
│       │   │   ├── useOptimization.ts    # AI recommendations
│       │   │   ├── useOptimizationEngine.ts  # Engine control (766 lines)
│       │   │   └── useNetworkConfig.ts   # Network topology
│       │   ├── lib/
│       │   │   ├── api.ts                # Axios instance with baseURL
│       │   │   ├── utils.ts              # Helper functions (cn, formatters)
│       │   │   └── mockData.ts           # Fallback data
│       │   └── types/
│       │       ├── index.ts              # Core TypeScript interfaces
│       │       └── train-snapshot.ts     # Snapshot type with timestamp
│       ├── package.json                  # Dependencies and scripts
│       ├── tailwind.config.js            # Tailwind configuration
│       ├── tsconfig.json                 # TypeScript compiler options
│       ├── next.config.js                # Next.js configuration
│       ├── postcss.config.js             # PostCSS plugins
│       └── .env.local                    # Environment variables (gitignored)
├── backend/
│   ├── data_1.py                         # FastAPI server (900+ lines)
│   ├── network_config.json               # Railway network topology
│   └── requirements-3.txt                # Python dependencies
├── .gitignore
└── README.md                             # This file
```

---

## 🔌 API Reference

### Core Endpoints

| Endpoint | Method | Description | Polling | Response Time |
|----------|--------|-------------|---------|---------------|
| `/api/train-data` | GET | Live train snapshots with timestamp | ✅ 1s | ~50ms |
| `/health` | GET | System health metrics | ✅ 20s | ~20ms |
| `/trains` | GET | All train states summary | ✅ 15s | ~30ms |
| `/api/train-data/summary` | GET | Aggregated statistics | ✅ 15s | ~25ms |
| `/api/disruptions` | GET | Active disruptions list | ✅ 15s | ~40ms |
| `/api/optimization/results` | GET | AI recommendations | Backend auto-updates (20s) | ~100ms |
| `/network-config` | GET | Railway network topology | Once on load | ~15ms |
| `/reset` | POST | Reset simulation state | Manual | ~200ms |

### Simulation Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/scenarios` | GET | List predefined scenarios |
| `/scenarios/{id}` | POST | Create custom scenario |
| `/scenarios/{id}/simulate` | POST | Run scenario simulation |
| `/scenarios/{id}/state` | GET | Get simulation results |

### Example: Train Data Response

```typescript
// GET /api/train-data
{
  "timestamp": "2025-12-16T15:42:13.456Z",
  "payload": [
    {
      "train": {
        "train_id": "TR001",
        "type": "Express",
        "priority": 8,
        "max_speed_kmh": 120,
        "length_m": 200,
        "direction": "forward",
        "destination_station": "STN_D",
        "current_location": {
          "section_id": "Section_B_C",
          "position_m": 8457.32
        },
        "status": "On time",
        "actual_departure": "2025-12-16T15:30:00Z",
        "actual_arrival": null,
        "journey_count": 2,
        "restricted_speed": false,
        "breakdown_until": null
      },
      "section": {
        "section_id": "Section_B_C",
        "start_station": "STN_B",
        "end_station": "STN_C",
        "length_km": 15.0,
        "capacity": 3,
        "max_speed_kmh": 120,
        "track_type": "double",
        "is_disrupted": false,
        "occupancy_count": 2
      },
      "signal": {
        "block_id": "Block_B_C_1",
        "section_id": "Section_B_C",
        "occupancy_status": "occupied",
        "occupying_trains": 2,
        "signal_type": "automatic",
        "headway_time_s": 300,
        "priority_override": false
      },
      "event": {
        "event_type": "moving",
        "train_id": "TR001",
        "section_id": "Section_B_C",
        "timestamp": "2025-12-16T15:42:13Z",
        "disruption_details": null,
        "delay_duration_min": 0
      }
    }
  ]
}
```

---

## 📊 Data Models

### Core TypeScript Interfaces

```typescript
// Train snapshot with timestamp for UI re-renders
interface TrainSnapshot {
  timestamp: string;           // ISO 8601 timestamp
  payload: TrainBundle[];       // Array of train data bundles
}

// Complete train data bundle
interface TrainBundle {
  train: {
    train_id: string;
    type: "Express" | "Freight" | "Local" | "High-Speed";
    priority: number;            // 1-10 scale
    max_speed_kmh: number;
    length_m: number;
    direction: "forward" | "backward";
    destination_station: string;
    current_location: {
      section_id: string;
      position_m: number;        // Meters from section start
    };
    status: "On time" | "Delayed" | "Waiting" | "Arrived" | "Cancelled";
    actual_departure: string;
    actual_arrival: string | null;
    journey_count: number;
    restricted_speed?: boolean;
    breakdown_until?: string | null;
  };
  section: {
    section_id: string;
    start_station: string;
    end_station: string;
    length_km: number;
    capacity: number;            // Max concurrent trains
    max_speed_kmh: number;
    track_type: "single" | "double";
    is_disrupted: boolean;
    occupancy_count: number;
  };
  signal: {
    block_id: string;
    section_id: string;
    occupancy_status: "occupied" | "free";
    occupying_trains: number;
    signal_type: "automatic" | "manual";
    headway_time_s: number;      // Minimum separation
    priority_override: boolean;
  };
  event: {
    event_type: string;
    train_id: string;
    section_id: string;
    timestamp: string | null;
    disruption_details: object | null;
    delay_duration_min: number;
  };
}

// Disruption tracking
interface Disruption {
  section_id: string;
  type: "maintenance" | "signal_failure" | "track_work" | "emergency";
  severity: "low" | "medium" | "high" | "critical";
  start_time: string;
  estimated_end_time: string;
  description: string;
  affected_trains: string[];
}

// AI optimization result
interface OptimizationResult {
  train_id: string;
  action: "proceed" | "hold_until_TIMESTAMP" | "reroute";
  timestamp?: string;
  new_route?: string[];
  reason: string;
  priority_score: number;      // 0-100 scale
}

// System health metrics
interface HealthResponse {
  status: "healthy" | "degraded" | "critical";
  timestamp: string;
  total_trains: number;
  active_trains: number;
  active_disruptions: number;
  disrupted_sections: string[];
  uptime_percent: number;
}
```

---

## 🎯 Key Implementation Details

### 1. Real-Time Polling Strategy
- **SWR configuration**: `refreshInterval: 1000`, `revalidateOnFocus: false`, `refreshWhenHidden: true`
- **Timestamp-based updates**: Pass `snapshotTs` prop to force React re-renders on new backend data
- **Automatic retry**: Exponential backoff on failed requests
- **Cache invalidation**: Manual mutate functions for instant UI updates

### 2. Geographic Map Implementation
- **SVG-based rendering**: 800x600px viewport with dynamic coordinate transformation
- **Lat/Lng to SVG conversion**: Bounds (28.54-28.66 lat, 77.20-77.33 lng) mapped to SVG space
- **Position interpolation**: Linear interpolation between station coordinates based on `position_m / (length_km * 1000)`
- **Pan/Zoom controls**: CSS transform with `translate()` and `scale()` for smooth interactions
- **Mouse event handling**: `onMouseDown/Move/Up` for drag panning

### 3. Animation Performance
- **Framer Motion optimizations**:
  - `layout` animations for automatic positioning
  - `AnimatePresence` for enter/exit transitions
  - Spring physics with `type: "spring"` for natural motion
  - GPU-accelerated transforms (translate, scale, opacity)
- **CSS animations** for simple states (pulse, bounce)
- **RequestAnimationFrame** for smooth train movement updates

### 4. Mobile Responsiveness
- **Hamburger menu**: Toggle state with slide-in animation
- **Breakpoint system**: `sm:`, `md:`, `lg:`, `xl:` Tailwind utilities
- **Touch targets**: Minimum 44x44px for interactive elements
- **Viewport units**: `vw`, `vh` for adaptive sizing
- **Window resize listeners**: Dynamic chatbot and map adjustments

### 5. Error Handling & Resilience
- **Axios interceptors**: Global error handling and request/response logging
- **SWR fallback data**: Mock data injection when backend unreachable
- **Type guards**: Runtime validation of API responses
- **Error boundaries**: React error boundaries for component crash isolation
- **Graceful degradation**: Partial UI rendering when some data unavailable

---

## 📦 Deployment Guide

### Development Environment

```bash
# Frontend (Next.js)
cd frontend/train-dashboard
npm run dev                    # http://localhost:3000

# Backend (FastAPI)
cd backend
python3 data_1.py             # http://localhost:8000
```

### Production Deployment on Render

#### Frontend Configuration
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_BASE_URL` = `https://speedline-backend-vmtj.onrender.com`
- **Note**: Environment variables are baked in at **build time**, not runtime. Rebuild after changes.

#### Backend Configuration
- **Build Command**: `pip install -r requirements-3.txt`
- **Start Command**: `python3 data_1.py`
- **Port**: Auto-detected by Render (defaults to 8000)
- **Health Check Endpoint**: `/health`
- **Environment Variables**: None required (optional: `NETWORK_CONFIG_PATH`)

### Environment Variables Reference

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=https://speedline-backend-vmtj.onrender.com
```

#### Backend (optional)
```env
NETWORK_CONFIG_PATH=./network_config.json
PORT=8000
```

---

## 🎓 Skills & Concepts Demonstrated

### Advanced Frontend Engineering
- ✅ **Next.js 14 App Router** with server-side rendering and metadata API
- ✅ **TypeScript mastery** with 100% type coverage and custom interfaces
- ✅ **Real-time data synchronization** using SWR with 1-second polling
- ✅ **Complex state management** with React hooks and SWR cache
- ✅ **Performance optimization** (useMemo, useCallback, code splitting)
- ✅ **Responsive design** with mobile-first approach
- ✅ **Animation choreography** using Framer Motion spring physics
- ✅ **SVG graphics programming** for custom visualizations

### Backend & Systems Design
- ✅ **FastAPI expertise** with modern lifespan patterns
- ✅ **Concurrent programming** using Python threading for background simulation
- ✅ **Algorithm design** with OR-Tools constraint optimization
- ✅ **RESTful API design** with clear endpoint structure and documentation
- ✅ **Pydantic validation** for type-safe data models
- ✅ **CORS handling** for secure cross-origin requests

### DevOps & Deployment
- ✅ **Cloud deployment** on Render platform (frontend + backend)
- ✅ **Environment configuration** with dynamic API URL resolution
- ✅ **CI/CD pipeline** with Git-based auto-deployment
- ✅ **Production monitoring** with health check endpoints
- ✅ **Error tracking** and graceful degradation strategies

### UI/UX Design
- ✅ **Component-driven architecture** with ShadCN UI
- ✅ **Accessibility** (ARIA labels, keyboard navigation, screen reader support)
- ✅ **Visual hierarchy** and information architecture
- ✅ **Interaction design** with micro-animations and feedback
- ✅ **Data visualization** using Recharts library

---

## 🔮 Future Roadmap

### Short-term Enhancements
- [ ] **WebSocket integration** for true real-time push updates (replace polling)
- [ ] **Historical data analytics** with time-series database (InfluxDB/TimescaleDB)
- [ ] **User authentication** with role-based access control (RBAC)
- [ ] **Customizable dashboards** with drag-and-drop widget layouts
- [ ] **Export functionality** (PDF reports, CSV data export, Excel integration)

### Long-term Vision
- [ ] **Machine learning models** for delay prediction and anomaly detection
- [ ] **3D route visualization** using Three.js or Babylon.js
- [ ] **Mobile native apps** (React Native for iOS/Android)
- [ ] **Multi-tenancy support** for different railway operators
- [ ] **Voice control** for hands-free operation in control rooms
- [ ] **AR/VR integration** for immersive train operation monitoring
- [ ] **Blockchain integration** for transparent delay compensation

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started
1. **Fork the repository** on GitHub
2. **Clone your fork**: `git clone https://github.com/yourusername/newSpeedLine.git`
3. **Create a feature branch**: `git checkout -b feature/amazing-feature`
4. **Make your changes** with clear, descriptive commits
5. **Push to your fork**: `git push origin feature/amazing-feature`
6. **Open a Pull Request** with detailed description

### Code Style
- **Frontend**: Follow ESLint rules (`npm run lint`)
- **Backend**: Follow PEP 8 Python style guide
- **TypeScript**: Use strict mode, avoid `any` types
- **Imports**: Use relative paths (avoid `@/` aliases for deployment compatibility)
- **Comments**: JSDoc for functions, inline for complex logic
- **Commit messages**: Use conventional commits format

### Testing Guidelines
- Write unit tests for new utility functions
- Test responsive design on mobile/tablet/desktop
- Verify API integration with backend
- Check accessibility with screen readers

---

## 📄 License

This project was created for SIH 2025 – Smart India Hackathon by Team Swift_Rail.

---
