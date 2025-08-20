import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, FileImage } from "lucide-react";

interface NDControlsProps {
  range: number;
  mode: "NAV" | "ILS" | "VOR" | "ARC";
  showWeather: boolean;
  showTerrain: boolean;
  mapOverlay?: string;
  onRangeChange: (range: number) => void;
  onModeChange: (mode: "NAV" | "ILS" | "VOR" | "ARC") => void;
  onWeatherToggle: (show: boolean) => void;
  onTerrainToggle: (show: boolean) => void;
  onMapOverlayChange: (overlay?: string) => void;
}

export default function NDControls({
  range,
  mode,
  showWeather,
  showTerrain,
  mapOverlay,
  onRangeChange,
  onModeChange,
  onWeatherToggle,
  onTerrainToggle,
  onMapOverlayChange
}: NDControlsProps) {
  const [uploadedMap, setUploadedMap] = useState<string | null>(null);

  const ranges = [10, 20, 40, 80, 160, 320];

  const handleMapUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedMap(result);
        onMapOverlayChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearMap = () => {
    setUploadedMap(null);
    onMapOverlayChange(undefined);
  };

  return (
    <div className="bg-panel-bg border border-panel-gray rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-panel-gray pb-4">
        <div className="w-8 h-8 bg-aviation-blue rounded-lg flex items-center justify-center">
          <i className="fas fa-radar text-white text-sm" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Navigation Display Controls</h3>
          <p className="text-text-muted text-sm">Configure ND display settings and map overlays</p>
        </div>
      </div>

      {/* Display Mode */}
      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Display Mode</Label>
        <Select value={mode} onValueChange={onModeChange}>
          <SelectTrigger data-testid="select-nd-mode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NAV">NAV - Navigation Mode</SelectItem>
            <SelectItem value="ARC">ARC - Arc Mode</SelectItem>
            <SelectItem value="ILS">ILS - Instrument Landing</SelectItem>
            <SelectItem value="VOR">VOR - VOR Navigation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Range Selection */}
      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Display Range</Label>
        <div className="grid grid-cols-3 gap-2">
          {ranges.map(r => (
            <Button
              key={r}
              variant={range === r ? "default" : "outline"}
              size="sm"
              onClick={() => onRangeChange(r)}
              className={`font-mono text-xs ${range === r ? 'bg-aviation-blue text-white' : 'text-text-primary'}`}
              data-testid={`button-range-${r}`}
            >
              {r} NM
            </Button>
          ))}
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-4">
        <Label className="text-text-primary font-medium">Display Options</Label>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-text-secondary text-sm">Weather Radar</Label>
            <p className="text-text-muted text-xs">Show weather patterns and precipitation</p>
          </div>
          <Switch 
            checked={showWeather} 
            onCheckedChange={onWeatherToggle}
            data-testid="switch-weather"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-text-secondary text-sm">Terrain Display</Label>
            <p className="text-text-muted text-xs">Show terrain and topographical features</p>
          </div>
          <Switch 
            checked={showTerrain} 
            onCheckedChange={onTerrainToggle}
            data-testid="switch-terrain"
          />
        </div>
      </div>

      {/* Map Overlay Section */}
      <div className="space-y-4 border-t border-panel-gray pt-4">
        <div className="flex items-center gap-2">
          <FileImage className="text-aviation-blue" size={20} />
          <Label className="text-text-primary font-medium">Map Overlay</Label>
        </div>
        
        <div className="space-y-3">
          <p className="text-text-muted text-sm">
            Upload your own terrain maps, navigation charts, or approach plates to overlay on the ND display.
          </p>
          
          {/* Upload Button */}
          <div className="flex items-center gap-3">
            <Label htmlFor="map-upload" className="cursor-pointer">
              <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                <span>
                  <Upload size={16} />
                  Upload Map
                </span>
              </Button>
            </Label>
            <input
              id="map-upload"
              type="file"
              accept="image/*"
              onChange={handleMapUpload}
              className="hidden"
              data-testid="input-map-upload"
            />
            
            {uploadedMap && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearMap}
                className="text-warning-orange hover:text-warning-orange"
                data-testid="button-clear-map"
              >
                Clear Map
              </Button>
            )}
          </div>

          {/* Map Preview */}
          {uploadedMap && (
            <div className="space-y-2">
              <Label className="text-text-secondary text-sm">Current Map Overlay</Label>
              <div className="relative w-32 h-32 border border-panel-gray rounded-lg overflow-hidden">
                <img 
                  src={uploadedMap} 
                  alt="Map overlay preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-aviation-blue/20 flex items-center justify-center">
                  <span className="text-white text-xs font-mono">LOADED</span>
                </div>
              </div>
            </div>
          )}

          {/* Map Instructions */}
          <div className="bg-panel-gray/30 rounded-lg p-3">
            <h4 className="text-text-primary text-sm font-medium mb-2">Map Integration Guide</h4>
            <ul className="text-text-muted text-xs space-y-1">
              <li>• Upload PNG, JPG, or other image formats</li>
              <li>• Maps will be scaled and centered automatically</li>
              <li>• Higher resolution images provide better detail</li>
              <li>• Use charts that match your operating area</li>
              <li>• Aviation sectional charts work best</li>
            </ul>
          </div>

          {/* User Import Folder Notice */}
          <div className="bg-aviation-blue/10 border border-aviation-blue/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <i className="fas fa-info-circle text-aviation-blue text-sm mt-0.5" />
              <div>
                <h4 className="text-aviation-blue text-sm font-medium">Custom Files</h4>
                <p className="text-text-secondary text-xs mt-1">
                  You can also place map files in the <code className="bg-panel-gray px-1 rounded">user-imports/</code> folder 
                  and reference them directly in your code for permanent integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}