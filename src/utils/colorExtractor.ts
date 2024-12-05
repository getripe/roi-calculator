interface RGB {
  r: number;
  g: number;
  b: number;
}

const isGrayish = (r: number, g: number, b: number): boolean => {
  const maxDiff = Math.max(
    Math.abs(r - g),
    Math.abs(g - b),
    Math.abs(b - r)
  );
  return maxDiff < 30;
};

const isBlackOrWhite = (r: number, g: number, b: number): boolean => {
  const brightness = (r + g + b) / 3;
  return brightness > 240 || brightness < 20;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

export const extractDominantColor = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;
      if (!imageData) {
        resolve("#12ED8A");
        return;
      }

      const colorMap = new Map<string, number>();
      const colors: RGB[] = [];
      let totalR = 0, totalG = 0, totalB = 0;
      let totalPixels = 0;

      // First pass: collect all colors
      for (let i = 0; i < imageData.length; i += 4) {
        if (imageData[i + 3] < 128) continue; // Skip transparent pixels

        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];

        // Skip black and white pixels
        if (isBlackOrWhite(r, g, b)) continue;

        const key = `${r},${g},${b}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
        totalR += r;
        totalG += g;
        totalB += b;
        totalPixels++;

        if (!isGrayish(r, g, b)) {
          colors.push({ r, g, b });
        }
      }

      // If no valid pixels found, return default color
      if (totalPixels === 0) {
        resolve("#12ED8A");
        return;
      }

      // Case 1: Single-accent color logos
      if (colors.length > 0 && colors.length < totalPixels * 0.2) {
        const avgR = Math.round(colors.reduce((sum, c) => sum + c.r, 0) / colors.length);
        const avgG = Math.round(colors.reduce((sum, c) => sum + c.g, 0) / colors.length);
        const avgB = Math.round(colors.reduce((sum, c) => sum + c.b, 0) / colors.length);
        resolve(rgbToHex(avgR, avgG, avgB));
        return;
      }

      // Case 2: Multi-accent color pictures
      if (colors.length > 0) {
        // Find the most vibrant color
        let maxSaturation = 0;
        let mostVibrantColor = colors[0];

        for (const color of colors) {
          const max = Math.max(color.r, color.g, color.b);
          const min = Math.min(color.r, color.g, color.b);
          const saturation = max === 0 ? 0 : (max - min) / max;

          if (saturation > maxSaturation) {
            maxSaturation = saturation;
            mostVibrantColor = color;
          }
        }

        resolve(rgbToHex(mostVibrantColor.r, mostVibrantColor.g, mostVibrantColor.b));
        return;
      }

      // Case 3: Everyone else - average of all pixels
      const avgR = Math.round(totalR / totalPixels);
      const avgG = Math.round(totalG / totalPixels);
      const avgB = Math.round(totalB / totalPixels);
      resolve(rgbToHex(avgR, avgG, avgB));
    };

    img.onerror = () => {
      resolve("#12ED8A");
    };
  });
};