import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { aircraftTypes, type AircraftType } from "@shared/schema";
import { 
  Scale, 
  Users, 
  Fuel, 
  Package,
  AlertTriangle,
  CheckCircle2,
  Calculator
} from "lucide-react";

interface WeightBalanceData {
  aircraftType: AircraftType;
  maxTakeoffWeight: number;
  maxLandingWeight: number;
  emptyWeight: number;
  maxFuelCapacity: number;
  maxPassengers: number;
  avgPassengerWeight: number;
  cargoBayCapacity: number;
}

interface FlightData {
  passengers: number;
  fuel: number;
  cargo: number;
  passengerWeight: number;
}

const aircraftSpecs: Record<string, WeightBalanceData> = {
  "Airbus A320": {
    aircraftType: "Airbus A320",
    maxTakeoffWeight: 78000,
    maxLandingWeight: 67400,
    emptyWeight: 42600,
    maxFuelCapacity: 6400,
    maxPassengers: 180,
    avgPassengerWeight: 84,
    cargoBayCapacity: 4440
  },
  "Airbus A330": {
    aircraftType: "Airbus A330",
    maxTakeoffWeight: 242000,
    maxLandingWeight: 187000,
    emptyWeight: 124500,
    maxFuelCapacity: 36740,
    maxPassengers: 440,
    avgPassengerWeight: 84,
    cargoBayCapacity: 8500
  },
  "Airbus A340": {
    aircraftType: "Airbus A340",
    maxTakeoffWeight: 380000,
    maxLandingWeight: 265000,
    emptyWeight: 178000,
    maxFuelCapacity: 53040,
    maxPassengers: 440,
    avgPassengerWeight: 84,
    cargoBayCapacity: 9200
  },
  "Airbus A350": {
    aircraftType: "Airbus A350",
    maxTakeoffWeight: 316000,
    maxLandingWeight: 233000,
    emptyWeight: 142400,
    maxFuelCapacity: 42400,
    maxPassengers: 440,
    avgPassengerWeight: 84,
    cargoBayCapacity: 9800
  },
  "Airbus A380": {
    aircraftType: "Airbus A380",
    maxTakeoffWeight: 575000,
    maxLandingWeight: 391000,
    emptyWeight: 277000,
    maxFuelCapacity: 84535,
    maxPassengers: 853,
    avgPassengerWeight: 84,
    cargoBayCapacity: 16450
  },
  "Boeing 737": {
    aircraftType: "Boeing 737",
    maxTakeoffWeight: 79000,
    maxLandingWeight: 66000,
    emptyWeight: 41500,
    maxFuelCapacity: 6875,
    maxPassengers: 189,
    avgPassengerWeight: 84,
    cargoBayCapacity: 4440
  },
  "Boeing 737 MAX": {
    aircraftType: "Boeing 737 MAX",
    maxTakeoffWeight: 82200,
    maxLandingWeight: 67100,
    emptyWeight: 45200,
    maxFuelCapacity: 7500,
    maxPassengers: 230,
    avgPassengerWeight: 84,
    cargoBayCapacity: 4500
  },
  "Boeing 747": {
    aircraftType: "Boeing 747",
    maxTakeoffWeight: 412780,
    maxLandingWeight: 295740,
    emptyWeight: 183500,
    maxFuelCapacity: 57285,
    maxPassengers: 660,
    avgPassengerWeight: 84,
    cargoBayCapacity: 12600
  },
  "Boeing 757": {
    aircraftType: "Boeing 757",
    maxTakeoffWeight: 115660,
    maxLandingWeight: 99790,
    emptyWeight: 58390,
    maxFuelCapacity: 11490,
    maxPassengers: 280,
    avgPassengerWeight: 84,
    cargoBayCapacity: 5800
  },
  "Boeing 767": {
    aircraftType: "Boeing 767",
    maxTakeoffWeight: 186880,
    maxLandingWeight: 142880,
    emptyWeight: 86070,
    maxFuelCapacity: 24140,
    maxPassengers: 350,
    avgPassengerWeight: 84,
    cargoBayCapacity: 7200
  },
  "Boeing 777": {
    aircraftType: "Boeing 777",
    maxTakeoffWeight: 347800,
    maxLandingWeight: 267600,
    emptyWeight: 166900,
    maxFuelCapacity: 47890,
    maxPassengers: 396,
    avgPassengerWeight: 84,
    cargoBayCapacity: 11260
  },
  "Boeing 777X": {
    aircraftType: "Boeing 777X",
    maxTakeoffWeight: 351500,
    maxLandingWeight: 253000,
    emptyWeight: 161000,
    maxFuelCapacity: 52300,
    maxPassengers: 426,
    avgPassengerWeight: 84,
    cargoBayCapacity: 12800
  },
  "Boeing 787": {
    aircraftType: "Boeing 787",
    maxTakeoffWeight: 254000,
    maxLandingWeight: 181000,
    emptyWeight: 120000,
    maxFuelCapacity: 33340,
    maxPassengers: 330,
    avgPassengerWeight: 84,
    cargoBayCapacity: 8200
  },
  "ATR-72": {
    aircraftType: "ATR-72",
    maxTakeoffWeight: 23000,
    maxLandingWeight: 22500,
    emptyWeight: 13500,
    maxFuelCapacity: 2040,
    maxPassengers: 78,
    avgPassengerWeight: 84,
    cargoBayCapacity: 800
  },
  "Cessna 172": {
    aircraftType: "Cessna 172",
    maxTakeoffWeight: 1157,
    maxLandingWeight: 1157,
    emptyWeight: 767,
    maxFuelCapacity: 212,
    maxPassengers: 4,
    avgPassengerWeight: 77,
    cargoBayCapacity: 54
  },
  "Cessna 182": {
    aircraftType: "Cessna 182",
    maxTakeoffWeight: 1406,
    maxLandingWeight: 1406,
    emptyWeight: 895,
    maxFuelCapacity: 315,
    maxPassengers: 4,
    avgPassengerWeight: 77,
    cargoBayCapacity: 120
  },
  "Cessna Citation": {
    aircraftType: "Cessna Citation",
    maxTakeoffWeight: 7700,
    maxLandingWeight: 6800,
    emptyWeight: 4400,
    maxFuelCapacity: 1560,
    maxPassengers: 10,
    avgPassengerWeight: 77,
    cargoBayCapacity: 350
  },
  "Piper Cherokee": {
    aircraftType: "Piper Cherokee",
    maxTakeoffWeight: 1225,
    maxLandingWeight: 1225,
    emptyWeight: 680,
    maxFuelCapacity: 227,
    maxPassengers: 4,
    avgPassengerWeight: 77,
    cargoBayCapacity: 90
  },
  "Bombardier CRJ": {
    aircraftType: "Bombardier CRJ",
    maxTakeoffWeight: 21520,
    maxLandingWeight: 19050,
    emptyWeight: 12020,
    maxFuelCapacity: 2200,
    maxPassengers: 100,
    avgPassengerWeight: 84,
    cargoBayCapacity: 1200
  },
  "Embraer E-Jet": {
    aircraftType: "Embraer E-Jet",
    maxTakeoffWeight: 37200,
    maxLandingWeight: 33100,
    emptyWeight: 21200,
    maxFuelCapacity: 3830,
    maxPassengers: 124,
    avgPassengerWeight: 84,
    cargoBayCapacity: 1800
  },
  "Concorde": {
    aircraftType: "Concorde",
    maxTakeoffWeight: 185070,
    maxLandingWeight: 111130,
    emptyWeight: 78700,
    maxFuelCapacity: 26400,
    maxPassengers: 128,
    avgPassengerWeight: 84,
    cargoBayCapacity: 1200
  }
};

export default function EnhancedWeightBalanceTab() {
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftType>("Airbus A320");
  const [flightData, setFlightData] = useState<FlightData>({
    passengers: 150,
    fuel: 5000,
    cargo: 2000,
    passengerWeight: 84
  });

  const specs = aircraftSpecs[selectedAircraft] || aircraftSpecs["Airbus A320"];
  
  const calculateWeights = () => {
    const totalPassengerWeight = flightData.passengers * flightData.passengerWeight;
    const totalWeight = specs.emptyWeight + totalPassengerWeight + flightData.fuel + flightData.cargo;
    const remainingCapacity = specs.maxTakeoffWeight - totalWeight;
    const utilizationPercent = (totalWeight / specs.maxTakeoffWeight) * 100;
    
    return {
      totalWeight,
      totalPassengerWeight,
      remainingCapacity,
      utilizationPercent,
      isOverweight: totalWeight > specs.maxTakeoffWeight,
      isOverMaxLanding: totalWeight > specs.maxLandingWeight
    };
  };

  const weights = calculateWeights();

  const handleInputChange = (field: keyof FlightData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFlightData(prev => ({ ...prev, [field]: numValue }));
  };

  const getStatusColor = () => {
    if (weights.isOverweight) return "text-red-500";
    if (weights.utilizationPercent > 90) return "text-warning-orange";
    if (weights.utilizationPercent > 75) return "text-caution-yellow";
    return "text-nav-green";
  };

  const getStatusIcon = () => {
    if (weights.isOverweight) return <AlertTriangle className="text-red-500" size={20} />;
    return <CheckCircle2 className="text-nav-green" size={20} />;
  };

  const formatWeight = (weight: number) => {
    return weight.toLocaleString() + " kg";
  };

  const formatWeightLbs = (weight: number) => {
    return (weight * 2.20462).toLocaleString(undefined, { maximumFractionDigits: 0 }) + " lbs";
  };

  return (
    <div className="h-full flex flex-col bg-cockpit-dark">
      {/* Header */}
      <div className="p-6 border-b border-panel-gray bg-gradient-to-r from-panel-bg to-panel-gray/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-text-secondary/20">
            <Scale className="text-text-secondary" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">
              Weight & Balance Calculator
            </h2>
            <p className="text-text-muted">
              Professional weight and balance calculations for commercial aircraft
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Label htmlFor="aircraft-select" className="text-text-primary">Aircraft Type:</Label>
          <Select value={selectedAircraft} onValueChange={(value: AircraftType) => setSelectedAircraft(value)}>
            <SelectTrigger className="w-64 bg-panel-bg border-panel-gray">
              <SelectValue placeholder="Select Aircraft" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(aircraftSpecs).map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Aircraft Specifications */}
            <Card className="bg-panel-bg border-panel-gray">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-text-primary">
                  <Calculator size={20} />
                  Aircraft Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-text-muted">Empty Weight</Label>
                    <div className="text-lg font-mono text-text-primary">
                      {formatWeight(specs.emptyWeight)}
                    </div>
                    <div className="text-sm text-text-muted">
                      {formatWeightLbs(specs.emptyWeight)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-text-muted">Max Takeoff Weight</Label>
                    <div className="text-lg font-mono text-text-primary">
                      {formatWeight(specs.maxTakeoffWeight)}
                    </div>
                    <div className="text-sm text-text-muted">
                      {formatWeightLbs(specs.maxTakeoffWeight)}
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-text-muted">Max Fuel Capacity</Label>
                    <div className="text-lg font-mono text-text-primary">
                      {formatWeight(specs.maxFuelCapacity)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-text-muted">Max Passengers</Label>
                    <div className="text-lg font-mono text-text-primary">
                      {specs.maxPassengers}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flight Configuration */}
            <Card className="bg-panel-bg border-panel-gray">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-text-primary">
                  <Users size={20} />
                  Flight Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="passengers" className="text-text-muted">Passengers</Label>
                    <Input
                      id="passengers"
                      type="number"
                      value={flightData.passengers}
                      onChange={(e) => handleInputChange('passengers', e.target.value)}
                      max={specs.maxPassengers}
                      className="bg-panel-bg border-panel-gray"
                    />
                  </div>
                  <div>
                    <Label htmlFor="passengerWeight" className="text-text-muted">Avg Weight (kg)</Label>
                    <Input
                      id="passengerWeight"
                      type="number"
                      value={flightData.passengerWeight}
                      onChange={(e) => handleInputChange('passengerWeight', e.target.value)}
                      className="bg-panel-bg border-panel-gray"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fuel" className="text-text-muted flex items-center gap-2">
                      <Fuel size={16} />
                      Fuel (kg)
                    </Label>
                    <Input
                      id="fuel"
                      type="number"
                      value={flightData.fuel}
                      onChange={(e) => handleInputChange('fuel', e.target.value)}
                      max={specs.maxFuelCapacity}
                      className="bg-panel-bg border-panel-gray"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cargo" className="text-text-muted flex items-center gap-2">
                      <Package size={16} />
                      Cargo (kg)
                    </Label>
                    <Input
                      id="cargo"
                      type="number"
                      value={flightData.cargo}
                      onChange={(e) => handleInputChange('cargo', e.target.value)}
                      max={specs.cargoBayCapacity}
                      className="bg-panel-bg border-panel-gray"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Weight Summary */}
            <Card className="bg-panel-bg border-panel-gray">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-text-primary">
                  {getStatusIcon()}
                  Weight Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Empty Weight:</span>
                    <span className="font-mono text-text-primary">{formatWeight(specs.emptyWeight)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Passenger Load:</span>
                    <span className="font-mono text-text-primary">{formatWeight(weights.totalPassengerWeight)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Fuel:</span>
                    <span className="font-mono text-text-primary">{formatWeight(flightData.fuel)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Cargo:</span>
                    <span className="font-mono text-text-primary">{formatWeight(flightData.cargo)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="text-text-primary">Total Weight:</span>
                    <span className={`font-mono ${getStatusColor()}`}>
                      {formatWeight(weights.totalWeight)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Remaining Capacity:</span>
                    <span className={`font-mono ${weights.remainingCapacity < 0 ? 'text-red-500' : 'text-nav-green'}`}>
                      {formatWeight(weights.remainingCapacity)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Weight Utilization:</span>
                    <span className={`font-mono ${getStatusColor()}`}>
                      {weights.utilizationPercent.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(weights.utilizationPercent, 100)} 
                    className="h-3"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status & Warnings */}
            <Card className="bg-panel-bg border-panel-gray">
              <CardHeader>
                <CardTitle className="text-text-primary">Flight Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {weights.isOverweight ? (
                  <Badge variant="destructive" className="w-full justify-center py-2">
                    <AlertTriangle size={16} className="mr-2" />
                    OVERWEIGHT - CANNOT DEPART
                  </Badge>
                ) : weights.isOverMaxLanding ? (
                  <Badge variant="outline" className="w-full justify-center py-2 text-warning-orange border-warning-orange/30">
                    <AlertTriangle size={16} className="mr-2" />
                    OVER MAX LANDING WEIGHT
                  </Badge>
                ) : (
                  <Badge variant="outline" className="w-full justify-center py-2 text-nav-green border-nav-green/30">
                    <CheckCircle2 size={16} className="mr-2" />
                    WEIGHT WITHIN LIMITS
                  </Badge>
                )}

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Passengers:</span>
                    <span className={flightData.passengers > specs.maxPassengers ? 'text-red-500' : 'text-text-primary'}>
                      {flightData.passengers}/{specs.maxPassengers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Fuel:</span>
                    <span className={flightData.fuel > specs.maxFuelCapacity ? 'text-red-500' : 'text-text-primary'}>
                      {((flightData.fuel / specs.maxFuelCapacity) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}