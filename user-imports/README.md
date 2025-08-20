# User Imports Folder

This folder is designated for your custom files and assets that you want to integrate into the Navigation Display system.

## Supported Map Formats

- **PNG, JPG, JPEG** - Standard image formats for terrain maps
- **SVG** - Vector graphics for navigation charts
- **GeoTIFF** - Georeferenced terrain data (requires additional processing)

## Usage Examples

### Terrain Maps
Place your terrain/topographical maps here and reference them in the ND system:

```javascript
// Example: Import a terrain map
import terrainMap from "@assets/user-imports/my-terrain-map.png";
```

### Navigation Charts
Store approach plates, sectional charts, and other navigation documents:

```javascript
// Example: Load approach plates
import approachPlate from "@assets/user-imports/KJFK-ILS-04L.png";
```

### Real-Time Integration
The Navigation Display system will automatically scale and position your maps based on:
- Aircraft position from ATC 24 data
- Range settings (10-320 nautical miles)
- Display mode (NAV, ARC, ILS, VOR)

## Coordinate System Notes

ATC 24 uses a coordinate system where:
- **-y is North** (negative Y values go north)
- **-x is West** (negative X values go west)  
- **3307.14286 studs = 1 nautical mile**
- Position origin is at the game's coordinate (0,0)

## Best Practices

1. **High Resolution**: Use high-resolution images for better detail when zoomed in
2. **Proper Scaling**: Aviation sectional charts work best as they match real-world scales
3. **File Naming**: Use descriptive names like `terrain-florida.png` or `approach-KJFK-04L.png`
4. **Format Choice**: PNG for terrain with transparency, JPG for satellite imagery

## File Structure Example

```
user-imports/
├── terrain/
│   ├── florida-sectional.png
│   ├── northeast-terrain.jpg
│   └── caribbean-bathymetry.png
├── approaches/
│   ├── KJFK-ILS-04L.png
│   ├── KLAX-ILS-24R.png
│   └── KORD-ILS-10L.png
└── charts/
    ├── new-york-terminal.png
    └── los-angeles-class-b.png
```

The Navigation Display system provides a professional A320-style interface with real-time aircraft positioning, wind data, and terrain integration capabilities.