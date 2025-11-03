// =================== Duckling Sprite ===================
import { Sprite, distributeSpritesInCircle } from './manager.js';
import { randi, randf } from '../categorias/utils.js';

/**
 * Classe Duckling - implementa um sprite de pintinho fofo
 * Herda da classe base Sprite todas as funcionalidades básicas
 */
export class Duckling extends Sprite {
  constructor(options = {}) {
    super({
      ...options,
      type: 'duckling'
    });
    
    // Propriedades específicas do pintinho
    this.featherColors = this.generateFeatherColors();
    this.beakGlow = 0; // Brilho do bico (0-1)
    this.sparkles = []; // Partículas fofas
    this.wingFlap = 0; // Animação das asas
    this.lastSparkle = 0;
    this.chirpPulse = Math.random() * Math.PI * 2; // Fase da pulsação do piu-piu
    
    // Personalidade única para cada pintinho
    this.personality = {
      sparkleFrequency: randf(0.02, 0.08), // Frequência de criação de partículas fofas
      cuteness: randf(0.3, 1.0), // Nível de fofura
      wingSpeed: randf(0.05, 0.15), // Velocidade do bater de asas
      shyness: randf(0, 0.3) // Timidez (afeta reação ao drag)
    };
  }

  /**
   * Gera cores aleatórias para as penas do pintinho (tons alaranjados mais escuros)
   */
  generateFeatherColors() {
    const colorPalettes = [
      ['#e6940a', '#d4720a', '#cc5500', '#e6c200'], // Laranja clássico mais escuro
      ['#e59900', '#e5851a', '#e5471a', '#cc3300'], // Laranja quente mais escuro
      ['#b8860b', '#996633', '#b8722e', '#b85c14'], // Dourado/Bronze mais escuro
      ['#d2691e', '#cd853f', '#9a7363', '#daa520'], // Tons terrosos mais escuros
      ['#e5b366', '#e59933', '#e5751a', '#cc5500'], // Laranja pastel mais escuro
      ['#e5662e', '#e5851a', '#e59966', '#e5a366']  // Salmão/Pêssego mais escuro
    ];
    
    return colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  }

  /**
   * Atualiza as partículas fofas (sparkles)
   */
  updateSparkles(dt) {
    // Remove sparkles antigos
    this.sparkles = this.sparkles.filter(sparkle => {
      sparkle.life -= dt;
      sparkle.x += sparkle.vx * dt;
      sparkle.y += sparkle.vy * dt;
      sparkle.opacity = Math.max(0, sparkle.life / sparkle.maxLife);
      return sparkle.life > 0;
    });

    // Cria novos sparkles baseado na personalidade e humor
    if (Math.random() < this.personality.sparkleFrequency) {
      const intensity = this.mood === 'happy' ? 2 : (this.mood === 'sad' ? 0.3 : 1);
      
      if (Math.random() < intensity * this.personality.cuteness) {
        this.createSparkle();
      }
    }

    // Sparkles especiais quando arrastando
    if (this.isDragging && Math.random() < 0.3) {
      this.createSparkle(true);
    }
  }

  /**
   * Cria uma nova partícula fofa
   */
  createSparkle(intense = false) {
    const angle = Math.random() * Math.PI * 2;
    const distance = this.baseRadius * (0.5 + Math.random() * 1.5);
    
    this.sparkles.push({
      x: this.x + Math.cos(angle) * distance,
      y: this.y + Math.sin(angle) * distance,
      vx: (Math.random() - 0.5) * (intense ? 200 : 100),
      vy: (Math.random() - 0.5) * (intense ? 200 : 100),
      life: intense ? 2.0 : 1.0,
      maxLife: intense ? 2.0 : 1.0,
      opacity: 1,
      color: this.featherColors[Math.floor(Math.random() * this.featherColors.length)],
      size: randf(2, intense ? 8 : 4)
    });
  }

  /**
   * Atualiza a animação específica do pintinho
   */
  updateAnimation(dt) {
    // Atualiza pulsação do piu-piu
    this.chirpPulse += dt * 3;
    
    // Atualiza brilho do bico baseado no humor
    let targetGlow = 0.3;
    if (this.mood === 'happy') targetGlow = 0.8;
    else if (this.mood === 'sad') targetGlow = 0.1;
    else if (this.isDragging) targetGlow = 1.0;
    
    this.beakGlow += (targetGlow - this.beakGlow) * dt * 5;

    // Atualiza batida das asas
    this.wingFlap += dt * this.personality.wingSpeed * 2 * Math.PI;

    // Atualiza partículas fofas
    this.updateSparkles(dt);
  }

  /**
   * Reação específica ao ser arrastado - pintinhos são mais fofos
   */
  onDragStart() {
    super.onDragStart();
    
    // Cria explosão de sparkles quando começam a ser arrastados
    for (let i = 0; i < 8; i++) {
      this.createSparkle(true);
    }
    
    // Pintinhos tímidos ficam com bico mais brilhante quando tocados
    if (this.personality.shyness > 0.2) {
      this.beakGlow = 1.0;
    }
  }

  /**
   * Desenha o pintinho no canvas
   */
  draw(ctx, globalScale = 1) {
    const r = this.getEffectiveRadius(globalScale);
    
    ctx.save();
    ctx.translate(this.x, this.y);

    // Desenha sparkles primeiro (atrás do pintinho)
    this.drawSparkles(ctx);

    // Corpo principal (redondinho como um pintinho)
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Asas pequenas (se estiver feliz ou sendo arrastado)
    if (this.mood === 'happy' || this.isDragging) {
      this.drawWings(ctx, r);
    }

    // Patinhas (2 patinhas como um pintinho)
    this.drawFeet(ctx, r);

    // Cabeça
    this.drawHead(ctx, r);

    // Bico
    this.drawBeak(ctx, r);

    // Plumas alaranjadas
    this.drawFeathers(ctx, r);

    // Olhos
    this.drawEyes(ctx, r);

    // Cauda fofa
    this.drawTail(ctx, r);

    ctx.restore();
  }

  /**
   * Desenha as partículas fofas
   */
  drawSparkles(ctx) {
    this.sparkles.forEach(sparkle => {
      ctx.save();
      ctx.globalAlpha = sparkle.opacity;
      ctx.fillStyle = sparkle.color;
      
      // Forma de coração para os sparkles fofos
      ctx.translate(sparkle.x - this.x, sparkle.y - this.y);
      ctx.rotate(performance.now() * 0.01);
      
      const size = sparkle.size;
      ctx.beginPath();
      // Desenha um coração fofo
      ctx.arc(-size * 0.3, -size * 0.2, size * 0.4, 0, Math.PI * 2);
      ctx.arc(size * 0.3, -size * 0.2, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(0, size * 0.3);
      ctx.lineTo(-size * 0.6, -size * 0.1);
      ctx.lineTo(size * 0.6, -size * 0.1);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    });
  }

  /**
   * Desenha as asinhas do pintinho
   */
  drawWings(ctx, r) {
    const wingOffset = Math.sin(this.wingFlap) * 0.15;
    
    // Asa esquerda (pequena)
    ctx.save();
    ctx.rotate(-0.2 + wingOffset);
    ctx.fillStyle = this.featherColors[0];
    ctx.beginPath();
    ctx.ellipse(-r * 0.6, 0, r * 0.3, r * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = this.featherColors[1];
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // Asa direita (pequena)
    ctx.save();
    ctx.rotate(0.2 - wingOffset);
    ctx.fillStyle = this.featherColors[0];
    ctx.beginPath();
    ctx.ellipse(r * 0.6, 0, r * 0.3, r * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = this.featherColors[1];
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Desenha as patinhas do pintinho
   */
  drawFeet(ctx, r) {
    ctx.fillStyle = '#E6940A'; // Laranja mais escuro para as patinhas
    ctx.strokeStyle = '#D4720A';
    ctx.lineWidth = Math.max(1, r * 0.05);

    // 2 patinhas
    const feetPositions = [
      { x: -r * 0.3, y: r * 0.8 },
      { x: r * 0.3, y: r * 0.8 }
    ];

    feetPositions.forEach(pos => {
      // Patinha (formato de estrela de 3 pontas)
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x - r * 0.1, pos.y + r * 0.15);
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x, pos.y + r * 0.15);
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x + r * 0.1, pos.y + r * 0.15);
      ctx.stroke();
      
      // Patinha redonda
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r * 0.05, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /**
   * Desenha a cabeça do pintinho
   */
  drawHead(ctx, r) {
    // Cabeça redondinha
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.7, r * 0.6, r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Desenha o bico fofo
   */
  drawBeak(ctx, r) {
    const glowIntensity = 0.3 + this.beakGlow * 0.7 + Math.sin(this.chirpPulse) * 0.2;
    
    // Brilho do bico quando feliz
    if (glowIntensity > 0.3) {
      ctx.save();
      ctx.shadowColor = '#E6940A';
      ctx.shadowBlur = 10 * glowIntensity;
      ctx.fillStyle = `rgba(230, 148, 10, ${glowIntensity * 0.3})`;
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.4, r * 0.2, r * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Bico principal
    ctx.fillStyle = '#E6940A'; // Laranja mais escuro
    ctx.beginPath();
    ctx.moveTo(-r * 0.1, -r * 0.45);
    ctx.lineTo(0, -r * 0.55);
    ctx.lineTo(r * 0.1, -r * 0.45);
    ctx.quadraticCurveTo(0, -r * 0.4, -r * 0.1, -r * 0.45);
    ctx.fill();

    // Pequena linha no bico
    ctx.strokeStyle = '#D4720A';
    ctx.lineWidth = Math.max(1, r * 0.02);
    ctx.beginPath();
    ctx.moveTo(-r * 0.05, -r * 0.48);
    ctx.lineTo(r * 0.05, -r * 0.48);
    ctx.stroke();
  }

  /**
   * Desenha as plumas alaranjadas
   */
  drawFeathers(ctx, r) {
    const numFeathers = 4;
    const time = performance.now() * 0.002;
    
    for (let i = 0; i < numFeathers; i++) {
      const angle = -Math.PI * 0.8 + (i / (numFeathers - 1)) * Math.PI * 0.6;
      const color = this.featherColors[i % this.featherColors.length];
      const wave = Math.sin(time + i * 0.8) * 0.05;
      
      ctx.fillStyle = color;
      
      // Pequenas plumas na cabeça
      ctx.beginPath();
      const featherX = Math.cos(angle) * r * 0.4;
      const featherY = Math.sin(angle) * r * 0.4 - r * 0.7;
      const featherSize = r * 0.15;
      
      // Pluma em formato de gota
      ctx.ellipse(featherX, featherY + wave * r * 0.1, featherSize * 0.6, featherSize, angle, 0, Math.PI * 2);
      ctx.fill();
      
      // Pequena linha no centro da pluma
      ctx.strokeStyle = this.featherColors[(i + 1) % this.featherColors.length];
      ctx.lineWidth = Math.max(1, r * 0.02);
      ctx.beginPath();
      ctx.moveTo(featherX, featherY - featherSize * 0.5);
      ctx.lineTo(featherX, featherY + featherSize * 0.5);
      ctx.stroke();
    }
  }

  /**
   * Desenha os olhos
   */
  drawEyes(ctx, r) {
    const eyeY = -r * 1.25;
    
    // Olhos principais
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-r * 0.15, eyeY, r * 0.08, 0, Math.PI * 2);
    ctx.arc(r * 0.15, eyeY, r * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Pupilas
    ctx.fillStyle = '#000000';
    let pupilOffsetX = 0;
    let pupilOffsetY = 0;
    
    if (this.isDragging) {
      // Olhos arregalados quando sendo arrastado
      ctx.fillStyle = '#4169E1'; // Azul mágico
      pupilOffsetY = -r * 0.02;
    } else if (this.mood === 'happy') {
      // Olhos brilhantes quando feliz
      ctx.fillStyle = '#228B22'; // Verde feliz
    } else if (this.mood === 'sad') {
      pupilOffsetY = r * 0.02;
    }

    ctx.beginPath();
    ctx.arc(-r * 0.15 + pupilOffsetX, eyeY + pupilOffsetY, r * 0.04, 0, Math.PI * 2);
    ctx.arc(r * 0.15 + pupilOffsetX, eyeY + pupilOffsetY, r * 0.04, 0, Math.PI * 2);
    ctx.fill();

    // Brilho nos olhos
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-r * 0.13, eyeY - r * 0.015, r * 0.015, 0, Math.PI * 2);
    ctx.arc(r * 0.17, eyeY - r * 0.015, r * 0.015, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Desenha a boca/focinho
   */
  drawMouth(ctx, r) {
    const mouthY = -r * 1.05;
    
    if (this.isDragging) {
      // Boca de surpresa quando arrastando
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, mouthY, r * 0.06, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Sorriso normal
      let offset = 0;
      let color = '#000000';
      
      if (this.mood === 'happy') {
        offset = r * 0.15;
        color = '#FF1493'; // Rosa feliz
      } else if (this.mood === 'sad') {
        offset = -r * 0.1;
        color = '#4169E1'; // Azul triste
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(2, r * 0.04);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-r * 0.2, mouthY);
      ctx.quadraticCurveTo(0, mouthY + offset, r * 0.2, mouthY);
      ctx.stroke();
    }

    // Narinas
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-r * 0.05, mouthY - r * 0.1, r * 0.015, 0, Math.PI * 2);
    ctx.arc(r * 0.05, mouthY - r * 0.1, r * 0.015, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Desenha a cauda
   */
  drawTail(ctx, r) {
    const time = performance.now() * 0.003;
    const tailWave = Math.sin(time) * 0.3;
    
    // Múltiplas penas da cauda em cores diferentes
    for (let i = 0; i < 3; i++) {
      const color = this.featherColors[i % this.featherColors.length];
      const offset = (i - 1) * r * 0.15;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(4, r * 0.08);
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(r * 0.8, offset);
      
      // Cauda curvada com movimento
      const cp1x = r * 1.2 + tailWave * r * 0.3;
      const cp1y = offset + r * 0.2;
      const cp2x = r * 1.0 + tailWave * r * 0.5;
      const cp2y = offset + r * 0.8;
      const endx = r * 1.3 + tailWave * r * 0.4;
      const endy = offset + r * 1.2;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endx, endy);
      ctx.stroke();
    }
  }

  /**
   * Método específico para tocar som quando o unicórnio bate na parede
   * Unicórnios fazem um som mais mágico
   */
  playBounceSound() {
    if (window.gameAudio && window.gameAudio.beep) {
      // Som mais agudo e mágico para unicórnios
      // Poderia ser expandido para um sistema de áudio mais sofisticado
      window.gameAudio.beep();
    }
  }

  /**
   * Atualiza o sprite (override do método pai para incluir animações específicas)
   */
  update(dt, bounds) {
    // Chama a atualização base (movimento, colisões, etc.)
    super.update(dt, bounds);
    
    // Atualiza animações específicas do unicórnio
    this.updateAnimation(dt);
  }
}

// Função de conveniência para criar pintinhos com cores aleatórias apropriadas
export function createRandomDuckling(x, y, bounds) {
  const ducklingColors = [
    '#E6940A', // Laranja mais escuro
    '#D4720A', // Laranja escuro
    '#E6C200', // Dourado mais escuro
    '#E6E619', // Amarelo mais escuro
    '#E6D8B8', // Cornsilk mais escuro
    '#E6D1A8', // Papaya whip mais escuro
    '#D4C266'  // Khaki mais escuro
  ];
  
  const color = ducklingColors[Math.floor(Math.random() * ducklingColors.length)];
  const vx = randf(60, 100) * (Math.random() < 0.5 ? -1 : 1);
  const vy = randf(50, 90) * (Math.random() < 0.5 ? -1 : 1);
  const baseRadius = randi(22, 38); // Pintinhos um pouco maiores para melhor visibilidade
  
  return new Duckling({
    x: x,
    y: y,
    vx: vx,
    vy: vy,
    baseRadius: baseRadius,
    color: color
  });
}

// Função para criar múltiplos pintinhos
export function createDucklings(spriteManager, count, bounds) {
  const ducklings = [];
  
  for (let i = 0; i < count; i++) {
    const duckling = createRandomDuckling(0, 0, bounds);
    ducklings.push(duckling);
    spriteManager.addSprite(duckling);
  }
  
  // Distribui os pintinhos em círculo
  distributeSpritesInCircle(ducklings, bounds);
  
  return ducklings;
}