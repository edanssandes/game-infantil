// =================== Robot Sprite ===================
import { Sprite, distributeSpritesInCircle } from './manager.js';
import { randi, randf } from '../categorias/utils.js';

// ====== Classe específica: Robot ======
export class Robot extends Sprite {
  constructor(options = {}) {
    super({
      ...options,
      type: 'robot'
    });
  }

  // Desenha o robô com todos os detalhes
  draw(ctx, globalScale = 1) {
    const r = this.getEffectiveRadius(globalScale);
    
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Corpo principal
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    
    // Rodas
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(-r * 0.5, r * 0.9, r * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * 0.5, r * 0.9, r * 0.18, 0, Math.PI * 2);
    ctx.fill();
    
    // Olhos
    ctx.fillStyle = '#0f172a';
    const eyeY = -r * 0.15;
    ctx.beginPath();
    ctx.arc(-r * 0.35, eyeY, r * 0.10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * 0.35, eyeY, r * 0.10, 0, Math.PI * 2);
    ctx.fill();
    
    // Boca/Expressão
    this.drawMouth(ctx, r, globalScale);
    
    // Antena
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = Math.max(2, r * 0.08);
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(0, -r * 1.4);
    ctx.stroke();
    
    // Luz da antena
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(0, -r * 1.55, r * 0.12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  // Desenha a boca baseada no humor
  drawMouth(ctx, r, globalScale) {
    const smileIntensity = this.getSmileIntensity(globalScale);
    
    if (this.isDragging) {
      // Boca circular para surpresa quando arrastando
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, r * 0.28, r * 0.15, 0, Math.PI * 2);
      ctx.fill();
    } else {
      let offset = 0;
      let color = '#0f172a';
      
      if (this.mood === 'happy') {
        offset = r * 0.30 * smileIntensity;
        color = '#16a34a';
      } else if (this.mood === 'sad') {
        offset = -r * 0.22;
        color = '#dc2626';
      }
      
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(2, r * 0.08);
      ctx.beginPath();
      ctx.moveTo(-r * 0.48, r * 0.28);
      ctx.quadraticCurveTo(0, r * 0.28 + offset, r * 0.48, r * 0.28);
      ctx.stroke();
    }
  }

  // Calcula a intensidade do sorriso baseada no streak global
  getSmileIntensity(globalScale) {
    // Usa o scale global como proxy para o streak
    const clampedScale = Math.max(0, Math.min(20, (globalScale - 1) / 0.14));
    return 0.5 + 0.5 * (clampedScale / 20);
  }

  // Som de bounce específico do robô
  onBounce() {
    this.playBeep();
  }

  // Toca som se passou tempo suficiente
  playBeep(minMs = 120) {
    const now = performance.now();
    if (now - this.lastBeepTs >= minMs) {
      this.lastBeepTs = now;
      this.makeBeep();
    }
  }

  // Gera o som (pode ser sobrescrito ou injetado)
  makeBeep() {
    // Será conectado ao sistema de áudio global
    if (window.gameAudio && window.gameAudio.beep) {
      window.gameAudio.beep();
    }
  }
}

// ====== Função para criar robôs ======
export function createRobots(spriteManager, count, bounds) {
  const colors = ['#93c5fd', '#c4b5fd', '#86efac', '#fbbf24', '#f87171'];
  const robots = [];
  
  for (let i = 0; i < count; i++) {
    const robot = new Robot({
      x: 0, // Será posicionado pela função distributeSpritesInCircle
      y: 0,
      vx: randf(70, 120) * (Math.random() < 0.5 ? -1 : 1),
      vy: randf(60, 110) * (Math.random() < 0.5 ? -1 : 1),
      baseRadius: randi(16, 32),
      color: colors[i % colors.length]
    });
    
    robots.push(robot);
    spriteManager.addSprite(robot);
  }
  
  // Distribui os robôs em círculo
  distributeSpritesInCircle(robots, bounds);
  
  return robots;
}


