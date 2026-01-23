// Game 2 input and simple loop
document.addEventListener('DOMContentLoaded', () => {
  // Use the main game canvas
  const canvas = document.getElementById('canvas');
  if (!canvas) {
    console.error('canvas not found');
    return;
  }
  const ctx = canvas.getContext('2d');

  // Player state
  const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 18,
    speed: 220 // pixels per second
  };

  // Input state: keys currently held down
  const keys = {};

  // Map common keys to directions
  function keyName(e) {
    if (!e) return '';
    // prefer .key when available
    return e.key ? e.key.toLowerCase() : '';
  }

  document.addEventListener('keydown', (e) => {
    const k = keyName(e);
    // ignore repeated keydown events from key held (we still want it true)
    keys[k] = true;
    // prevent arrow keys from scrolling the page
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k) || ['w','a','s','d'].includes(k)) {
      e.preventDefault();
    }
  });

  document.addEventListener('keyup', (e) => {
    const k = keyName(e);
    keys[k] = false;
  });

  // If the window loses focus, clear input so movement stops immediately
  window.addEventListener('blur', () => {
    for (const k in keys) keys[k] = false;
  });

  // Game loop: move player depending on keys pressed. Uses delta time for smooth movement.
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); // clamp dt to avoid big jumps
    last = now;

    // Determine movement vector
    let dx = 0, dy = 0;
    if (keys['w'] || keys['arrowup']) dy -= 1;
    if (keys['s'] || keys['arrowdown']) dy += 1;
    if (keys['a'] || keys['arrowleft']) dx -= 1;
    if (keys['d'] || keys['arrowright']) dx += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const inv = 1 / Math.sqrt(2);
      dx *= inv; dy *= inv;
    }

    // Apply movement
    player.x += dx * player.speed * dt;
    player.y += dy * player.speed * dt;

    // Keep inside canvas
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // simple player circle
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#00ccff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#003f4d';
    ctx.stroke();

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
