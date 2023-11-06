const RADIANS = Math.PI / 180;
const WAGNER_6_P_LAT = Math.PI / Math.sqrt(3);
const WAGNER_6_U_LAT = 2 / Math.sqrt(3) - 0.1;

export const customProjection = {
  aspectRatio: 1.7,
  to(coordinates) {
    const x = coordinates[0] * RADIANS;
    const y = Math.min(
      Math.max(coordinates[1] * RADIANS, -WAGNER_6_P_LAT),
      +WAGNER_6_P_LAT
    );
    const t = y / Math.PI;
    return [(x / Math.PI) * Math.sqrt(1 - 3 * t * t), (y * 2) / Math.PI];
  },
  from(coordinates) {
    const x = coordinates[0];
    const y = Math.min(
      Math.max(coordinates[1], -WAGNER_6_U_LAT),
      +WAGNER_6_U_LAT
    );
    const t = y / 2;
    return [
      (x * Math.PI) / Math.sqrt(1 - 3 * t * t) / RADIANS,
      (y * Math.PI) / 2 / RADIANS
    ];
  }
};

export const coordLinesData = {
  type: "FeatureCollection",
  features: []
};

for (let longitude = -180; longitude <= 180; longitude += 30) {
  const lineCoords = [];
  for (let latitude = -90; latitude <= 90; latitude += 5) {
    lineCoords.push([longitude, latitude]);
  }

  coordLinesData.features.push({
    geometry: {
      type: "LineString",
      coordinates: lineCoords
    }
  });
}

// add parallels
for (let latitude = -90; latitude <= 90; latitude += 30) {
  coordLinesData.features.push({
    geometry: {
      type: "LineString",
      coordinates: [
        [-180, latitude],
        [180, latitude]
      ]
    }
  });
}