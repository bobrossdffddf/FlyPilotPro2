import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface WeightData {
  passengers: number;
  cargo: number;
  fuel: number;
  baggage: number;
}

interface AircraftSpecs {
  emptyWeight: number;
  maxTakeoffWeight: number;
  maxFuelCapacity: number;
  maxPassengers: number;
  avgPassengerWeight: number;
  avgBaggagePerPax: number;
}

const aircraftDatabase: Record<string, AircraftSpecs> = {
  "Boeing 737-800": {
    emptyWeight: 90710,
    maxTakeoffWeight: 174200,
    maxFuelCapacity: 26020,
    maxPassengers: 189,
    avgPassengerWeight: 84,
    avgBaggagePerPax: 23
  },
  "Airbus A320": {
    emptyWeight: 93300,
    maxTakeoffWeight: 175000,
    maxFuelCapacity: 24210,
    maxPassengers: 180,
    avgPassengerWeight: 84,
    avgBaggagePerPax: 23
  },
  "Boeing 777-300ER": {
    emptyWeight: 370000,
    maxTakeoffWeight: 775000,
    maxFuelCapacity: 320000,
    maxPassengers: 396,
    avgPassengerWeight: 84,
    avgBaggagePerPax: 23
  },
  "Cessna 172": {
    emptyWeight: 1691,
    maxTakeoffWeight: 2550,
    maxFuelCapacity: 212,
    maxPassengers: 4,
    avgPassengerWeight: 77,
    avgBaggagePerPax: 15
  }
};

export default function WeightBalanceTab() {
  const [selectedAircraft, setSelectedAircraft] = useState<string>("Boeing 737-800");
  const [weightData, setWeightData] = useState<WeightData>({
    passengers: 0,
    cargo: 0,
    fuel: 0,
    baggage: 0
  });
  
  const { toast } = useToast();
  
  const specs = aircraftDatabase[selectedAircraft];
  
  const calculateWeights = () => {
    const passengerWeight = weightData.passengers * specs.avgPassengerWeight;
    const baggageWeight = weightData.baggage || (weightData.passengers * specs.avgBaggagePerPax);
    const totalWeight = specs.emptyWeight + passengerWeight + weightData.cargo + weightData.fuel + baggageWeight;
    
    return {
      passengerWeight,
      baggageWeight,
      totalWeight,
      weightRemaining: specs.maxTakeoffWeight - totalWeight,
      fuelRemaining: specs.maxFuelCapacity - weightData.fuel,
      isOverweight: totalWeight > specs.maxTakeoffWeight,
      weightPercentage: (totalWeight / specs.maxTakeoffWeight) * 100
    };
  };
  
  const results = calculateWeights();
  
  const handleQuickFill = (loadFactor: number) => {
    const passengers = Math.floor(specs.maxPassengers * loadFactor);
    const fuel = Math.floor(specs.maxFuelCapacity * 0.8); // 80% fuel for typical flight
    
    setWeightData({
      passengers,
      cargo: Math.floor(passengers * 15), // Avg cargo per passenger
      fuel,
      baggage: passengers * specs.avgBaggagePerPax
    });
    
    toast({
      title: "Load Configuration Applied",
      description: `${Math.floor(loadFactor * 100)}% load factor with ${passengers} passengers`
    });
  };
  
  const generateLoadsheet = () => {
    const loadsheet = `
WEIGHT & BALANCE CALCULATION
Aircraft: ${selectedAircraft}
Date: ${new Date().toLocaleDateString()}

WEIGHTS (lbs):
Empty Weight: ${specs.emptyWeight.toLocaleString()}
Passengers (${weightData.passengers}): ${results.passengerWeight.toLocaleString()}
Baggage: ${results.baggageWeight.toLocaleString()}
Cargo: ${weightData.cargo.toLocaleString()}
Fuel: ${weightData.fuel.toLocaleString()}

TOTAL WEIGHT: ${results.totalWeight.toLocaleString()} lbs
MAX TAKEOFF: ${specs.maxTakeoffWeight.toLocaleString()} lbs
REMAINING: ${results.weightRemaining.toLocaleString()} lbs

STATUS: ${results.isOverweight ? 'OVERWEIGHT - REDUCE LOAD' : 'WITHIN LIMITS'}
    `;
    
    navigator.clipboard.writeText(loadsheet);
    toast({
      title: "Loadsheet Generated",
      description: "Weight & balance calculation copied to clipboard"
    });
  };

  return (
    <div className="h-full flex flex-col bg-panel-bg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Weight & Balance Calculator</h2>
          <p className="text-text-secondary mt-1">Calculate aircraft weight and balance for PTFS operations</p>
        </div>
        
        <Button onClick={generateLoadsheet} className="bg-aviation-blue hover:bg-aviation-blue/80">
          <i className="fas fa-file-export mr-2"></i>
          Generate Loadsheet
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Aircraft Selection */}
          <Card className="border-panel-gray">
            <CardHeader>
              <CardTitle className="text-text-primary">Aircraft Selection</CardTitle>
              <CardDescription>Choose your PTFS aircraft type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(aircraftDatabase).map(aircraft => (
                  <Button
                    key={aircraft}
                    onClick={() => setSelectedAircraft(aircraft)}
                    variant={selectedAircraft === aircraft ? "default" : "outline"}
                    className="h-auto p-4 text-left"
                  >
                    <div>
                      <div className="font-semibold">{aircraft}</div>
                      <div className="text-sm text-text-muted">
                        Max: {aircraftDatabase[aircraft].maxPassengers} pax
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weight Inputs */}
          <Card className="border-panel-gray">
            <CardHeader>
              <CardTitle className="text-text-primary">Load Configuration</CardTitle>
              <CardDescription>Enter passenger, cargo, and fuel loads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="passengers" className="text-text-muted">Passengers</Label>
                  <Input
                    id="passengers"
                    type="number"
                    min="0"
                    max={specs.maxPassengers}
                    value={weightData.passengers}
                    onChange={(e) => setWeightData(prev => ({ ...prev, passengers: parseInt(e.target.value) || 0 }))}
                    className="mt-1"
                  />
                  <div className="text-xs text-text-muted mt-1">Max: {specs.maxPassengers}</div>
                </div>
                
                <div>
                  <Label htmlFor="cargo" className="text-text-muted">Cargo (lbs)</Label>
                  <Input
                    id="cargo"
                    type="number"
                    min="0"
                    value={weightData.cargo}
                    onChange={(e) => setWeightData(prev => ({ ...prev, cargo: parseInt(e.target.value) || 0 }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fuel" className="text-text-muted">Fuel (lbs)</Label>
                  <Input
                    id="fuel"
                    type="number"
                    min="0"
                    max={specs.maxFuelCapacity}
                    value={weightData.fuel}
                    onChange={(e) => setWeightData(prev => ({ ...prev, fuel: parseInt(e.target.value) || 0 }))}
                    className="mt-1"
                  />
                  <div className="text-xs text-text-muted mt-1">Max: {specs.maxFuelCapacity.toLocaleString()}</div>
                </div>
                
                <div>
                  <Label htmlFor="baggage" className="text-text-muted">Baggage (lbs)</Label>
                  <Input
                    id="baggage"
                    type="number"
                    min="0"
                    value={weightData.baggage}
                    onChange={(e) => setWeightData(prev => ({ ...prev, baggage: parseInt(e.target.value) || 0 }))}
                    className="mt-1"
                    placeholder={`Auto: ${weightData.passengers * specs.avgBaggagePerPax}`}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-text-muted mb-3 block">Quick Load Configurations</Label>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleQuickFill(0.3)}>
                    Light (30%)
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleQuickFill(0.6)}>
                    Medium (60%)
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleQuickFill(0.85)}>
                    Heavy (85%)
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleQuickFill(1.0)}>
                    Full (100%)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Weight Summary */}
          <Card className={`border-2 ${results.isOverweight ? 'border-warning-orange' : 'border-nav-green'}`}>
            <CardHeader>
              <CardTitle className={results.isOverweight ? 'text-warning-orange' : 'text-nav-green'}>
                Weight Summary
              </CardTitle>
              <CardDescription>
                {results.isOverweight ? 'Aircraft is overweight!' : 'Within weight limits'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Empty Weight:</span>
                  <span className="font-mono">{specs.emptyWeight.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Passengers:</span>
                  <span className="font-mono">{results.passengerWeight.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Baggage:</span>
                  <span className="font-mono">{results.baggageWeight.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Cargo:</span>
                  <span className="font-mono">{weightData.cargo.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Fuel:</span>
                  <span className="font-mono">{weightData.fuel.toLocaleString()}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold">
                  <span>Total Weight:</span>
                  <span className={`font-mono ${results.isOverweight ? 'text-warning-orange' : 'text-nav-green'}`}>
                    {results.totalWeight.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Max Takeoff:</span>
                  <span className="font-mono">{specs.maxTakeoffWeight.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Remaining:</span>
                  <span className={`font-mono ${results.weightRemaining < 0 ? 'text-warning-orange' : 'text-nav-green'}`}>
                    {results.weightRemaining.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Weight Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Weight Usage</span>
                  <span>{results.weightPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-panel-gray rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(results.weightPercentage, 100)}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-3 ${
                      results.weightPercentage > 100 
                        ? 'bg-warning-orange' 
                        : results.weightPercentage > 90 
                        ? 'bg-caution-yellow' 
                        : 'bg-nav-green'
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aircraft Specs */}
          <Card className="border-panel-gray">
            <CardHeader>
              <CardTitle className="text-text-primary">Aircraft Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Empty Weight:</span>
                <span className="font-mono">{specs.emptyWeight.toLocaleString()} lbs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Max Passengers:</span>
                <span className="font-mono">{specs.maxPassengers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Max Fuel:</span>
                <span className="font-mono">{specs.maxFuelCapacity.toLocaleString()} lbs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Avg Pax Weight:</span>
                <span className="font-mono">{specs.avgPassengerWeight} lbs</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}