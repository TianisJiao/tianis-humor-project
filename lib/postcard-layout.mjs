export const POSTCARD_WIDTH = 1600;
export const POSTCARD_HEIGHT = 1100;

// Measure whole words, with a grapheme fallback for long tokens and CJK text.
export function wrapPostcardText(ctx, text, maxWidth) {
  const lines = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    const tokens = paragraph.match(/\S+\s*/gu) ?? [''];
    for (const token of tokens) {
      if (ctx.measureText(line + token.trimEnd()).width <= maxWidth) { line += token; continue; }
      if (line.trim()) { lines.push(line.trimEnd()); line = ''; }
      if (ctx.measureText(token.trimEnd()).width <= maxWidth) { line = token; continue; }
      const chars = typeof Intl.Segmenter === 'function' ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(token), value => value.segment) : Array.from(token);
      for (const char of chars) {
        if (line && ctx.measureText(line + char).width > maxWidth) { lines.push(line.trimEnd()); line = ''; }
        line += char;
      }
    }
    lines.push(line.trimEnd());
  }
  return lines;
}

export function fitPostcardPhoto(photoWidth, photoHeight) {
  if (photoWidth <= 0 || photoHeight <= 0) throw new Error('Invalid photo dimensions');
  const scale = Math.min(852 / photoWidth, 720 / photoHeight);
  const width = photoWidth * scale;
  const height = photoHeight * scale;
  return { x: 90 + (852 - width) / 2, y: 226 + (720 - height) / 2, width, height };
}

export function drawPostcard(ctx, photo, caption) {
  ctx.fillStyle = '#f6efdf'; ctx.fillRect(0, 0, POSTCARD_WIDTH, POSTCARD_HEIGHT);
  // An airmail-style border, followed by a clean paper inset.
  for (let x = 0; x < POSTCARD_WIDTH; x += 54) {
    ctx.fillStyle = x % 108 === 0 ? '#b37d69' : '#7f9a98';
    ctx.fillRect(x, 0, 29, 14); ctx.fillRect(x, POSTCARD_HEIGHT - 14, 29, 14);
  }
  for (let y = 0; y < POSTCARD_HEIGHT; y += 54) {
    ctx.fillStyle = y % 108 === 0 ? '#b37d69' : '#7f9a98';
    ctx.fillRect(0, y, 14, 29); ctx.fillRect(POSTCARD_WIDTH - 14, y, 14, 29);
  }
  ctx.strokeStyle = '#b4a27f'; ctx.lineWidth = 2; ctx.strokeRect(35, 35, 1530, 1030);
  ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillStyle = '#6a654a';
  ctx.font = 'italic 32px Georgia, serif'; ctx.fillText('Greetings from', 78, 67);
  ctx.font = 'bold 70px Georgia, serif'; ctx.fillStyle = '#465b50'; ctx.fillText('NEW YORK', 76, 103);
  ctx.font = '18px Arial, sans-serif'; ctx.fillStyle = '#8c7454'; ctx.fillText('FIVE BOROUGHS · A THOUSAND LITTLE STORIES', 514, 149);
  ctx.fillStyle = '#e9ddc5'; ctx.fillRect(70, 206, 892, 760);
  ctx.fillStyle = '#fff9ed'; ctx.fillRect(82, 218, 868, 736);
  const fitted = fitPostcardPhoto(photo.naturalWidth, photo.naturalHeight);
  // Preserve the entire photo, including portrait images; never crop the user's image.
  ctx.drawImage(photo, fitted.x, fitted.y, fitted.width, fitted.height);
  ctx.strokeStyle = '#b4a27f'; ctx.beginPath(); ctx.moveTo(1000, 214); ctx.lineTo(1000, 970); ctx.stroke();
  // Decorative stamp, clearly not real postage.
  ctx.fillStyle = '#e2b6a2'; ctx.fillRect(1420, 85, 100, 125);
  ctx.strokeStyle = '#fbf2df'; ctx.setLineDash([4, 5]); ctx.strokeRect(1428, 93, 84, 109); ctx.setLineDash([]);
  ctx.fillStyle = '#7c4e3b'; ctx.textAlign = 'center'; ctx.font = 'bold 25px Georgia, serif'; ctx.fillText('NYC', 1470, 114);
  ctx.font = '11px Arial, sans-serif'; ctx.fillText('SIDE QUESTS', 1470, 158); ctx.fillText('SOUVENIR', 1470, 180);
  ctx.strokeStyle = '#8c7c62'; ctx.beginPath(); ctx.arc(1349, 151, 58, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#8c7c62'; ctx.font = '12px Arial, sans-serif'; ctx.fillText('NEW YORK', 1349, 132); ctx.fillText('POSTCARD', 1349, 159);
  ctx.textAlign = 'left'; ctx.font = '17px Arial, sans-serif'; ctx.fillStyle = '#8b7353'; ctx.fillText('A NOTE FROM MY NYC SIDE QUEST', 1044, 253);
  let size = 38;
  ctx.font = `bold ${size}px Georgia, serif`;
  let lines = wrapPostcardText(ctx, caption, 472);
  while (lines.length * size * 1.35 > 574 && size > 22) {
    size -= 2; ctx.font = `bold ${size}px Georgia, serif`; lines = wrapPostcardText(ctx, caption, 472);
  }
  ctx.fillStyle = '#493e30';
  lines.forEach((line, index) => ctx.fillText(line, 1044, 304 + index * size * 1.35));
  ctx.strokeStyle = '#c0ae8c'; ctx.lineWidth = 1;
  [921, 953].forEach(y => { ctx.beginPath(); ctx.moveTo(1044,y); ctx.lineTo(1516,y); ctx.stroke(); });
  ctx.font = 'italic 23px Georgia, serif'; ctx.fillStyle = '#7b684b'; ctx.fillText('Wish you were here.', 1044, 984);
  ctx.font = '17px Arial, sans-serif'; ctx.fillText('NYC SIDE QUESTS · AI-GENERATED CAPTION', 78, 1002);
  return { lines, fontSize: size, photo: fitted };
}
