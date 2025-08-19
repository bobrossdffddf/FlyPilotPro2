export const FLIGHT_PHASES = [
  {
    id: "boarding",
    label: "Boarding",
    icon: "fas fa-door-open",
  },
  {
    id: "taxi",
    label: "Taxi", 
    icon: "fas fa-taxi",
  },
  {
    id: "takeoff",
    label: "Takeoff",
    icon: "fas fa-plane-departure",
  },
  {
    id: "cruise",
    label: "Cruise",
    icon: "fas fa-cloud",
  },
  {
    id: "descent",
    label: "Descent",
    icon: "fas fa-angle-down",
  },
  {
    id: "landing",
    label: "Landing",
    icon: "fas fa-plane-arrival",
  },
];

export const CHECKLIST_PHASES = [
  "preflight",
  "takeoff", 
  "cruise",
  "descent",
  "landing",
  "emergency",
];
