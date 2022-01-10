This script generates the GeoJSON files for the Sea Level Rise – Coastal Inundation Scenarios tool's data coverage map.

Run it from the root of this repository:

```bash
npm run slr-cis-data
```

GeoJSON files (one for each data source, plus one for calflod3d-tfs 5m centroids) will be output in `/static/data/`.

**NOTE**: It's recommended to run this script on a device that uses an Linux or Linux like OS. We found that Windows OS may have problems using npm workspaces.
