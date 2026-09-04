/**
 * VISUAL.JS - Renderizado Gráfico de la Arena de Panem y Los Juegos del Hambre
 * p5.js: Reloj de 12 horas, Sinsajo animado en llamas, ondas acústicas y osciloscopio en vivo.
 */

class SonicRipple {
  constructor(x, y, maxRadius, color = [245, 158, 11], speed = 4) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.maxRadius = maxRadius;
    this.color = color;
    this.speed = speed;
    this.alpha = 255;
  }

  update() {
    this.radius += this.speed;
    this.alpha = (1.0 - (this.radius / this.maxRadius)) * 255;
    return this.radius < this.maxRadius;
  }

  draw(p) {
    p.push();
    p.noFill();
    p.stroke(this.color[0], this.color[1], this.color[2], this.alpha);
    p.strokeWeight((this.alpha / 255.0) * 2.5);
    p.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    p.pop();
  }
}

class FireParticle {
  constructor(p, x, y, isExplosion = false) {
    this.p = p;
    this.x = x + p.random(-6, 6);
    this.y = y + p.random(-6, 6);
    let speed = isExplosion ? p.random(2, 7) : p.random(0.5, 2.2);
    let angle = isExplosion ? p.random(p.TWO_PI) : p.random(-p.PI * 0.8, -p.PI * 0.2);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 255;
    this.decay = p.random(3, 7);
    this.size = p.random(2.5, 6.0);
    this.color = p.random() > 0.4 ? [245, 158, 11] : [239, 68, 68];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy -= 0.04;
    this.life -= this.decay;
    this.size *= 0.97;
    return this.life > 0;
  }

  draw() {
    this.p.noStroke();
    this.p.fill(this.color[0], this.color[1], this.color[2], this.life);
    this.p.ellipse(this.x, this.y, this.size, this.size);
  }
}

const VisualRenderer = {
  drawClockArenaGround(p, cx, cy, outerRadius) {
    p.push();
    p.translate(cx, cy);

    p.noFill();
    p.stroke(245, 158, 11, 25);
    p.strokeWeight(1);
    p.ellipse(0, 0, outerRadius * 2, outerRadius * 2);
    p.ellipse(0, 0, outerRadius * 1.5, outerRadius * 1.5);
    p.ellipse(0, 0, outerRadius * 0.9, outerRadius * 0.9);

    for (let i = 0; i < 12; i++) {
      let angle = i * (p.TWO_PI / 12) - p.HALF_PI;
      p.stroke(245, 158, 11, 35);
      p.line(Math.cos(angle) * 60, Math.sin(angle) * 60, Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);

      let tx = Math.cos(angle) * (outerRadius + 18);
      let ty = Math.sin(angle) * (outerRadius + 18);
      p.fill(245, 158, 11, 60);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(9);
      p.text(`${i + 1}h`, tx, ty);
    }
    p.pop();
  },

  drawMockingjayCenter(p, cx, cy, R, audioEnergy = 0) {
    p.push();
    p.translate(cx, cy);

    let isRebelState = (R < 0.45);
    let fireScale = 1.0 + audioEnergy * 0.35 + (isRebelState ? 0.15 : 0.0);
    p.scale(fireScale);

    p.drawingContext.shadowBlur = isRebelState ? 35 : (20 + R * 25);
    p.drawingContext.shadowColor = isRebelState ? 'rgba(239, 68, 68, 0.9)' : 'rgba(245, 158, 11, 0.85)';

    p.noFill();
    p.stroke(isRebelState ? '#ef4444' : '#f59e0b');
    p.strokeWeight(2.5);
    p.ellipse(0, 0, 86, 86);

    p.stroke(isRebelState ? 'rgba(239, 68, 68, 0.6)' : 'rgba(245, 158, 11, 0.6)');
    p.strokeWeight(1.2);
    p.ellipse(0, 0, 74, 74);

    p.fill(isRebelState ? '#ef4444' : '#f59e0b');
    p.stroke(255, 255, 255, 220);
    p.strokeWeight(1.2);

    // Alas
    p.beginShape();
    p.vertex(0, 6);
    p.bezierVertex(-18, -4, -36, -18, -44, -10);
    p.bezierVertex(-38, 2, -22, 12, 0, 10);
    p.endShape(p.CLOSE);

    p.beginShape();
    p.vertex(0, 6);
    p.bezierVertex(18, -4, 36, -18, 44, -10);
    p.bezierVertex(38, 2, 22, 12, 0, 10);
    p.endShape(p.CLOSE);

    // Cuerpo
    p.beginShape();
    p.vertex(0, -18);
    p.bezierVertex(7, -8, 7, 8, 4, 24);
    p.vertex(0, 32);
    p.vertex(-4, 24);
    p.bezierVertex(-7, 8, -7, -8, 0, -18);
    p.endShape(p.CLOSE);

    // Flecha
    p.strokeWeight(2);
    p.stroke(255);
    p.line(-26, -24, 26, 26);
    p.line(26, 26, 20, 26);
    p.line(26, 26, 26, 20);

    p.drawingContext.shadowBlur = 0;
    p.pop();
  },

  drawArenaOscilloscope(p, cx, cy, baseRadius, waveData) {
    if (!waveData) return;
    p.push();
    p.translate(cx, cy);
    p.noFill();
    p.stroke(245, 158, 11, 140);
    p.strokeWeight(1.5);

    p.beginShape();
    let total = waveData.length;
    for (let i = 0; i < total; i++) {
      let angle = (i / total) * p.TWO_PI;
      let v = (waveData[i] - 128) / 128.0;
      let r = baseRadius + v * 32;
      p.vertex(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    p.endShape(p.CLOSE);
    p.pop();
  }
};