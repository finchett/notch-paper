self.onmessage = async function (e) {
  const {
    imageSrc,
    width,
    height,
    barHeight,
    barColor,
    bgMode,
    cornerRadius,
    squircle,
    centerCornerRadius,
    shadowBlur,
    shadowColor,
    shadowOpacity,
    centerScale,
    centerBgColor,
  } = e.data;

  try {
    // Fetch the image data
    const response = await fetch(imageSrc);
    const blob = await response.blob();

    // Create ImageBitmap asynchronously
    const bitmap = await createImageBitmap(blob);

    // Create or reuse offscreen canvas
    if (
      !self.canvas ||
      self.canvas.width !== width ||
      self.canvas.height !== height
    ) {
      self.canvas = new OffscreenCanvas(width, height);
    }
    const canvas = self.canvas;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);

    if (bgMode === "Stretch") {
      // Stretch the bitmap to fill the canvas
      ctx.drawImage(bitmap, 0, 0, width, height);
    } else if (bgMode === "Center") {
      // Fill canvas with color and center the bitmap with scaling
      ctx.fillStyle = centerBgColor;
      ctx.fillRect(0, 0, width, height);
      const scaledWidth = bitmap.width * centerScale;
      const scaledHeight = bitmap.height * centerScale;
      const x = (width - scaledWidth) / 2;
      const y = (height - scaledHeight) / 2;
      if (shadowOpacity > 0) {
        // Add shadow behind the image
        const r = parseInt(shadowColor.slice(1, 3), 16);
        const g = parseInt(shadowColor.slice(3, 5), 16);
        const b = parseInt(shadowColor.slice(5, 7), 16);
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${shadowOpacity})`;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }
      if (centerCornerRadius > 0) {
        function roundRect(ctx, x, y, w, h, rad) {
          ctx.beginPath();
          ctx.moveTo(x + rad, y);
          ctx.lineTo(x + w - rad, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
          ctx.lineTo(x + w, y + h - rad);
          ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
          ctx.lineTo(x + rad, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
          ctx.lineTo(x, y + rad);
          ctx.quadraticCurveTo(x, y, x + rad, y);
          ctx.closePath();
        }
        if (shadowOpacity > 0) {
          // Draw shadow by filling roundRect with background color
          ctx.fillStyle = centerBgColor;
          roundRect(ctx, x, y, scaledWidth, scaledHeight, centerCornerRadius);
          ctx.fill();
          // Reset shadow before clipping
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }
        // Now clip and draw image
        ctx.save();
        roundRect(ctx, x, y, scaledWidth, scaledHeight, centerCornerRadius);
        ctx.clip();
        ctx.drawImage(bitmap, x, y, scaledWidth, scaledHeight);
        ctx.restore();
      } else {
        ctx.drawImage(bitmap, x, y, scaledWidth, scaledHeight);
      }
      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Add bar at the top
    ctx.fillStyle = barColor;
    ctx.fillRect(0, 0, width, barHeight);

    // Draw corners with bar color
    ctx.fillStyle = barColor;
    const r = cornerRadius;
    const k = 0.45; // squircle tension (lower = squarer)
    if (squircle) {
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(width, height);
      ctx.lineTo(width, height - r);
      ctx.bezierCurveTo(
        width,
        height - r * (1 - k),
        width - r * (1 - k),
        height,
        width - r,
        height,
      );
      ctx.closePath();
      ctx.fill();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height - r);
      ctx.bezierCurveTo(
        0,
        height - r * (1 - k),
        r * (1 - k),
        height,
        r,
        height,
      );
      ctx.closePath();
      ctx.fill();

      // Top-left
      ctx.beginPath();
      ctx.moveTo(0, barHeight);
      ctx.lineTo(0, barHeight + r);
      ctx.bezierCurveTo(
        0,
        barHeight + r * (1 - k),
        r * (1 - k),
        barHeight,
        r,
        barHeight,
      );
      ctx.closePath();
      ctx.fill();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(width, barHeight);
      ctx.lineTo(width, barHeight + r);
      ctx.bezierCurveTo(
        width,
        barHeight + r * (1 - k),
        width - r * (1 - k),
        barHeight,
        width - r,
        barHeight,
      );
      ctx.closePath();
      ctx.fill();
    } else {
      // Top-left
      ctx.beginPath();
      ctx.moveTo(0, barHeight);
      ctx.lineTo(r, barHeight);
      ctx.arc(r, barHeight + r, r, -Math.PI / 2, Math.PI, true);
      ctx.lineTo(0, barHeight + r);
      ctx.closePath();
      ctx.fill();
      // Top-right
      ctx.beginPath();
      ctx.moveTo(width, barHeight);
      ctx.lineTo(width - r, barHeight);
      ctx.arc(width - r, barHeight + r, r, -Math.PI / 2, 0, false);
      ctx.lineTo(width, barHeight + r);
      ctx.closePath();
      ctx.fill();
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(width, height - r);
      ctx.lineTo(width, height);
      ctx.lineTo(width - r, height);
      ctx.arcTo(width, height, width, height - r, r);
      ctx.closePath();
      ctx.fill();
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(0, height - r);
      ctx.lineTo(0, height);
      ctx.lineTo(r, height);
      ctx.arc(r, height - r, r, Math.PI / 2, Math.PI, false);
      ctx.closePath();
      ctx.fill();
    }

    // Convert to blob and send directly
    const resultBlob = await canvas.convertToBlob();
    self.postMessage(resultBlob);
  } catch {
    self.postMessage("error");
  }
};
