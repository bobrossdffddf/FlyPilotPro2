export interface AirlineVoiceConfig {
  code: string;
  name: string;
  country: string;
  primaryLanguage: string;
  secondaryLanguage?: string;
  voiceStyle: string;
  accent: string;
  callsignPrefix: string[];
}

export const airlineConfigs: AirlineVoiceConfig[] = [
  {
    code: "DLH",
    name: "Lufthansa",
    country: "Germany",
    primaryLanguage: "English",
    secondaryLanguage: "German",
    voiceStyle: "professional-male",
    accent: "German",
    callsignPrefix: ["DLH", "LH"]
  },
  {
    code: "AFR", 
    name: "Air France",
    country: "France",
    primaryLanguage: "English",
    secondaryLanguage: "French", 
    voiceStyle: "professional-female",
    accent: "French",
    callsignPrefix: ["AFR", "AF"]
  },
  {
    code: "BAW",
    name: "British Airways", 
    country: "United Kingdom",
    primaryLanguage: "English",
    voiceStyle: "professional-female",
    accent: "British",
    callsignPrefix: ["BAW", "BA", "SHT"]
  },
  {
    code: "AAL",
    name: "American Airlines",
    country: "United States", 
    primaryLanguage: "English",
    voiceStyle: "professional-male",
    accent: "American",
    callsignPrefix: ["AAL", "AA"]
  },
  {
    code: "UAL",
    name: "United Airlines",
    country: "United States",
    primaryLanguage: "English", 
    voiceStyle: "professional-female",
    accent: "American",
    callsignPrefix: ["UAL", "UA"]
  },
  {
    code: "DAL",
    name: "Delta Air Lines",
    country: "United States",
    primaryLanguage: "English",
    voiceStyle: "professional-male", 
    accent: "American",
    callsignPrefix: ["DAL", "DL"]
  },
  {
    code: "KLM",
    name: "KLM Royal Dutch Airlines",
    country: "Netherlands",
    primaryLanguage: "English",
    secondaryLanguage: "Dutch",
    voiceStyle: "professional-male",
    accent: "Dutch", 
    callsignPrefix: ["KLM", "KL"]
  },
  {
    code: "SAS",
    name: "Scandinavian Airlines",
    country: "Sweden/Denmark/Norway",
    primaryLanguage: "English",
    secondaryLanguage: "Swedish",
    voiceStyle: "professional-female",
    accent: "Scandinavian",
    callsignPrefix: ["SAS", "SK"]
  },
  {
    code: "ITA",
    name: "ITA Airways",
    country: "Italy", 
    primaryLanguage: "English",
    secondaryLanguage: "Italian",
    voiceStyle: "professional-male",
    accent: "Italian",
    callsignPrefix: ["ITA", "AZ"]
  },
  {
    code: "IBE",
    name: "Iberia",
    country: "Spain",
    primaryLanguage: "English",
    secondaryLanguage: "Spanish",
    voiceStyle: "professional-female",
    accent: "Spanish",
    callsignPrefix: ["IBE", "IB"]
  },
  {
    code: "JAL",
    name: "Japan Airlines",
    country: "Japan",
    primaryLanguage: "English", 
    secondaryLanguage: "Japanese",
    voiceStyle: "professional-female",
    accent: "Japanese",
    callsignPrefix: ["JAL", "JL"]
  },
  {
    code: "ANA",
    name: "All Nippon Airways",
    country: "Japan",
    primaryLanguage: "English",
    secondaryLanguage: "Japanese", 
    voiceStyle: "professional-male",
    accent: "Japanese",
    callsignPrefix: ["ANA", "NH"]
  },
  {
    code: "QFA",
    name: "Qantas",
    country: "Australia",
    primaryLanguage: "English",
    voiceStyle: "professional-male",
    accent: "Australian", 
    callsignPrefix: ["QFA", "QF"]
  },
  {
    code: "EZY",
    name: "easyJet",
    country: "United Kingdom",
    primaryLanguage: "English",
    voiceStyle: "casual-female",
    accent: "British",
    callsignPrefix: ["EZY", "U2"]
  },
  {
    code: "RYR", 
    name: "Ryanair",
    country: "Ireland",
    primaryLanguage: "English",
    voiceStyle: "casual-male",
    accent: "Irish",
    callsignPrefix: ["RYR", "FR"]
  }
];

export function detectAirlineFromCallsign(callsign: string): AirlineVoiceConfig | null {
  const prefix = callsign.substring(0, 3);
  
  for (const airline of airlineConfigs) {
    if (airline.callsignPrefix.some(p => callsign.startsWith(p))) {
      return airline;
    }
  }
  
  return null;
}