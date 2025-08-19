import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  Volume2, 
  Map, 
  Route, 
  FileText, 
  CheckSquare, 
  Scale,
  Gauge,
  ExternalLink,
  Info,
  Keyboard,
  Zap
} from "lucide-react";

const helpSections = [
  {
    id: "pa-system",
    title: "PA System",
    icon: Volume2,
    color: "text-aviation-blue",
    description: "Professional airline announcements with text-to-speech",
    features: [
      "Pre-recorded airline announcements",
      "Custom text-to-speech with professional voices",
      "Flight phase specific announcements",
      "Virtual microphone setup for simulators"
    ]
  },
  {
    id: "charts",
    title: "Aviation Charts",
    icon: Map,
    color: "text-nav-green",
    description: "Interactive aviation charts library with popout capabilities",
    features: [
      "Upload and view aviation charts (SVG, PNG, PDF)",
      "Popout charts in separate windows",
      "Search and filter by airport/type",
      "Support for approach, SID, STAR, and airport diagrams"
    ]
  },
  {
    id: "sids-stars",
    title: "SIDs/STARs",
    icon: Route,
    color: "text-caution-yellow",
    description: "Coming Soon - Under Development",
    features: [
      "Feature under development",
      "Will include comprehensive procedures",
      "Airport-specific routing",
      "Interactive displays planned"
    ]
  },
  {
    id: "flight-log",
    title: "Flight Log",
    icon: FileText,
    color: "text-text-primary",
    description: "Digital notepad for flight planning and notes",
    features: [
      "Rich text editing",
      "Flight plan notes",
      "Weather briefing storage",
      "Export and print capabilities"
    ]
  },
  {
    id: "checklists",
    title: "Aircraft Checklists",
    icon: CheckSquare,
    color: "text-warning-orange",
    description: "Interactive aircraft checklists for 20+ aircraft types",
    features: [
      "Airbus A320, A320, A330, A340, A350, A380",
      "Boeing 737, 747, 757, 767, 777, 787",
      "ATR-72, Concorde, Cessna variants",
      "Phase-based organization with progress tracking"
    ]
  },
  {
    id: "weight-balance",
    title: "Weight & Balance",
    icon: Scale,
    color: "text-text-secondary",
    description: "Professional weight and balance calculations",
    features: [
      "Real aircraft specifications",
      "Dynamic weight calculations",
      "Visual limit warnings",
      "Dual unit support (kg/lbs)"
    ]
  },
  {
    id: "instruments",
    title: "Flight Instruments",
    icon: Gauge,
    color: "text-nav-green",
    description: "Coming Soon - Under Development",
    features: [
      "Feature under development",
      "Will include primary flight displays",
      "Navigation displays planned",
      "Engine monitoring coming"
    ]
  }
];

const quickTips = [
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts",
    tips: [
      "Use tab navigation between sections",
      "Spacebar to play/pause announcements",
      "Escape to close popout windows"
    ]
  },
  {
    icon: Zap,
    title: "Pro Tips",
    tips: [
      "Use virtual microphone for simulator integration",
      "Popout charts for multi-monitor setups",
      "Save frequently used announcements as favorites"
    ]
  }
];

export default function HelpTab() {
  return (
    <div className="h-full flex flex-col bg-cockpit-dark">
      {/* Header */}
      <div className="p-6 border-b border-panel-gray bg-gradient-to-r from-panel-bg to-panel-gray/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-aviation-blue/20">
            <HelpCircle className="text-aviation-blue" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">
              24FLY Help & Documentation
            </h2>
            <p className="text-text-muted">
              Professional aviation flight management system
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-aviation-blue/10 border-aviation-blue/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="text-aviation-blue" size={20} />
                <CardTitle className="text-aviation-blue">Welcome to 24FLY</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                24FLY is a professional aviation flight management system designed for pilots, 
                flight instructors, and aviation enthusiasts. Navigate using the tabs below to 
                access different modules and features.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Sections */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Features & Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helpSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-panel-bg border-panel-gray hover:border-aviation-blue/40 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <section.icon className={section.color} size={20} />
                      <div>
                        <CardTitle className="text-lg text-text-primary">
                          {section.title}
                        </CardTitle>
                        <CardDescription className="text-text-muted">
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {section.features.map((feature, i) => (
                        <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                          <span className="text-nav-green mt-1">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Quick Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickTips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="bg-panel-bg border-panel-gray">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <tip.icon className="text-caution-yellow" size={20} />
                      <CardTitle className="text-lg text-text-primary">
                        {tip.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {tip.tips.map((tipText, i) => (
                        <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                          <span className="text-aviation-blue mt-1">→</span>
                          {tipText}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-panel-bg border-panel-gray">
            <CardHeader>
              <CardTitle className="text-text-primary">System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">Version</Badge>
                  <p className="text-sm text-text-secondary">v2.1.0</p>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">Status</Badge>
                  <p className="text-sm text-nav-green">Online</p>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">Demo</Badge>
                  <p className="text-sm text-text-secondary">Live Demo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-text-muted">
            24FLY - Professional Aviation Flight Management System
          </p>
          <p className="text-xs text-text-muted mt-1">
            For educational and simulation use only. Not certified for actual flight operations.
          </p>
        </motion.div>
      </div>
    </div>
  );
}