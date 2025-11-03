// =================== Bunny Sprite ===================
import { Sprite, distributeSpritesInCircle } from './manager.js';
import { randi, randf } from '../categorias/utils.js';

/**
 * Classe Bunny - implementa um sprite de coelhinho fofo
 * Herda da classe base Sprite todas as funcionalidades básicas
 */
export class Bunny extends Sprite {
  constructor(options = {}) {
    super({
      ...options,
      type: 'bunny'
    });

    // Propriedades específicas do coelhinho
    this.furColors = this.generateFurColors();
    this.earWiggle = 0; // Animação das orelhas
    this.tailBounce = 0; // Animação da cauda
    this.sparkles = []; // Partículas fofas
    this.lastSparkle = 0;
    this.noseTwitch = Math.random() * Math.PI * 2; // Fase da contração do nariz

    // Personalidade única para cada coelhinho
    this.personality = {
      sparkleFrequency: randf(0.02, 0.08), // Frequência de criação de partículas fofas
      cuteness: randf(0.3, 1.0), // Nível de fofura
      earSpeed: randf(0.05, 0.15), // Velocidade do balanço das orelhas
      shyness: randf(0, 0.3) // Timidez (afeta reação ao drag)
    };
  }

  /**
   * Gera cores aleatórias para a pelagem do coelhinho
   */
  generateFurColors() {
    const colorPalettes = [
      ['#FFFFFF', '#F5F5F5', '#E8E8E8', '#D3D3D3'], // Branco puro
      ['#C0C0C0', '#A9A9A9', '#808080', '#696969'], // Cinza elegante
      ['#DEB887', '#D2B48C', '#BCB88A', '#F4A460'], // Marrom claro
      ['#8B4513', '#A0522D', '#CD853F', '#D2691E'], // Marrom escuro
      ['#FFE4B5', '#FFDAB9', '#FFEFD5', '#FFF8DC'], // Creme
      ['#F0E68C', '#EEE8AA', '#F5DEB3', '#FFE4B5']  // Bege
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
      color: this.furColors[Math.floor(Math.random() * this.furColors.length)],
      size: randf(2, intense ? 8 : 4)
    });
  }

  /**
   * Atualiza a animação específica do coelhinho
   */
  updateAnimation(dt) {
    // Atualiza contração do nariz
    this.noseTwitch += dt * 4;

    // Atualiza balanço das orelhas
    this.earWiggle += dt * this.personality.earSpeed * 2 * Math.PI;

    // Atualiza quique da cauda
    this.tailBounce += dt * 6;

    // Atualiza partículas fofas
    this.updateSparkles(dt);
  }

  /**
   * Reação específica ao ser arrastado - coelhinhos são mais fofos
   */
  onDragStart() {
    super.onDragStart();

    // Cria explosão de sparkles quando começam a ser arrastados
    for (let i = 0; i < 8; i++) {
      this.createSparkle(true);
    }
  }

  /**
   * Desenha o coelhinho no canvas
   */
  draw(ctx, globalScale = 1) {
    const r = this.getEffectiveRadius(globalScale);

    ctx.save();
    ctx.translate(this.x, this.y);

    // Desenha sparkles primeiro (atrás do coelhinho)
    this.drawSparkles(ctx);

    // Corpo principal (oval alongado)
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, r * 0.2, r * 0.8, r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cauda fofa
    this.drawTail(ctx, r);

    // Patas traseiras
    this.drawHindLegs(ctx, r);

    // Patas dianteiras
    this.drawFrontLegs(ctx, r);

    // Cabeça
    this.drawHead(ctx, r);

    // Orelhas
    this.drawEars(ctx, r);

    // Olhos
    this.drawEyes(ctx, r);

    // Nariz
    this.drawNose(ctx, r);

    // Bigodes
    this.drawWhiskers(ctx, r);

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
   * Desenha a cauda fofa
   */
  drawTail(ctx, r) {
    const bounce = Math.sin(this.tailBounce) * 0.1;
    const tailX = r * 0.7;
    const tailY = r * 0.4 + bounce * r * 0.1;

    // Cauda redonda e fofa
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = this.furColors[0];
    ctx.lineWidth = Math.max(1, r * 0.03);

    ctx.beginPath();
    ctx.arc(tailX, tailY, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Sombras na cauda para dar volume
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.arc(tailX + r * 0.05, tailY + r * 0.05, r * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Desenha as patas traseiras
   */
  drawHindLegs(ctx, r) {
    ctx.fillStyle = this.furColors[0];
    ctx.strokeStyle = this.furColors[1];
    ctx.lineWidth = Math.max(1, r * 0.03);

    // Patas traseiras
    const legPositions = [
      { x: -r * 0.4, y: r * 0.6 },
      { x: r * 0.4, y: r * 0.6 }
    ];

    legPositions.forEach(pos => {
      // Pata oval
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y, r * 0.12, r * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pequena pata
      ctx.fillStyle = '#FFB6C1'; // Rosa claro para as almofadinhas
      ctx.beginPath();
      ctx.arc(pos.x, pos.y + r * 0.2, r * 0.06, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /**
   * Desenha as patas dianteiras
   */
  drawFrontLegs(ctx, r) {
    ctx.fillStyle = this.furColors[0];
    ctx.strokeStyle = this.furColors[1];
    ctx.lineWidth = Math.max(1, r * 0.03);

    // Patas dianteiras
    const legPositions = [
      { x: -r * 0.5, y: r * 0.1 },
      { x: r * 0.5, y: r * 0.1 }
    ];

    legPositions.forEach(pos => {
      // Pata oval menor
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y, r * 0.1, r * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pequena pata
      ctx.fillStyle = '#FFB6C1';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y + r * 0.15, r * 0.05, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /**
   * Desenha a cabeça do coelhinho
   */
  drawHead(ctx, r) {
    // Cabeça redonda
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, -r * 0.6, r * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Bochechas fofas
    ctx.fillStyle = 'rgba(255,182,193,0.3)'; // Rosa claro translúcido
    ctx.beginPath();
    ctx.arc(-r * 0.3, -r * 0.5, r * 0.2, 0, Math.PI * 2);
    ctx.arc(r * 0.3, -r * 0.5, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Desenha as orelhas compridas e fofas
   */
  drawEars(ctx, r) {
    const wiggle = Math.sin(this.earWiggle) * 0.1;

    // Orelha esquerda
    ctx.save();
    ctx.translate(-r * 0.25, -r * 1.1);
    ctx.rotate(-0.2 + wiggle);

    // Parte externa da orelha
    ctx.fillStyle = this.furColors[0];
    ctx.strokeStyle = this.furColors[1];
    ctx.lineWidth = Math.max(1, r * 0.03);

    ctx.beginPath();
    ctx.ellipse(0, -r * 0.3, r * 0.15, r * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Parte interna rosa
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.3, r * 0.1, r * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Orelha direita
    ctx.save();
    ctx.translate(r * 0.25, -r * 1.1);
    ctx.rotate(0.2 - wiggle);

    ctx.fillStyle = this.furColors[0];
    ctx.strokeStyle = this.furColors[1];

    ctx.beginPath();
    ctx.ellipse(0, -r * 0.3, r * 0.15, r * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Parte interna rosa
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.3, r * 0.1, r * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Desenha os olhos grandes e expressivos
   */
  drawEyes(ctx, r) {
    const eyeY = -r * 0.7;

    // Olhos principais
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-r * 0.15, eyeY, r * 0.12, 0, Math.PI * 2);
    ctx.arc(r * 0.15, eyeY, r * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Pupilas
    ctx.fillStyle = '#000000';
    let pupilOffsetX = 0;
    let pupilOffsetY = 0;

    if (this.isDragging) {
      // Olhos arregalados quando sendo arrastado
      pupilOffsetY = -r * 0.03;
    } else if (this.mood === 'happy') {
      // Olhos brilhantes quando feliz
      ctx.fillStyle = '#228B22'; // Verde feliz
    } else if (this.mood === 'sad') {
      pupilOffsetY = r * 0.03;
    }

    ctx.beginPath();
    ctx.arc(-r * 0.15 + pupilOffsetX, eyeY + pupilOffsetY, r * 0.06, 0, Math.PI * 2);
    ctx.arc(r * 0.15 + pupilOffsetX, eyeY + pupilOffsetY, r * 0.06, 0, Math.PI * 2);
    ctx.fill();

    // Brilho nos olhos
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-r * 0.12, eyeY - r * 0.02, r * 0.025, 0, Math.PI * 2);
    ctx.arc(r * 0.18, eyeY - r * 0.02, r * 0.025, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Desenha o narizinho rosa
   */
  drawNose(ctx, r) {
    const twitch = Math.sin(this.noseTwitch) * 0.05;

    // Nariz triangular
    ctx.fillStyle = '#FFB6C1';
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = Math.max(1, r * 0.02);

    ctx.beginPath();
    ctx.moveTo(-r * 0.05, -r * 0.45 + twitch);
    ctx.lineTo(r * 0.05, -r * 0.45 + twitch);
    ctx.lineTo(0, -r * 0.4 + twitch);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Narinas
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-r * 0.02, -r * 0.47 + twitch, r * 0.015, 0, Math.PI * 2);
    ctx.arc(r * 0.02, -r * 0.47 + twitch, r * 0.015, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Desenha os bigodes
   */
  drawWhiskers(ctx, r) {
    ctx.strokeStyle = '#D3D3D3';
    ctx.lineWidth = Math.max(1, r * 0.02);
    ctx.lineCap = 'round';

    // Bigodes do lado esquerdo
    ctx.beginPath();
    ctx.moveTo(-r * 0.35, -r * 0.5);
    ctx.lineTo(-r * 0.55, -r * 0.55);
    ctx.moveTo(-r * 0.35, -r * 0.45);
    ctx.lineTo(-r * 0.55, -r * 0.45);
    ctx.moveTo(-r * 0.35, -r * 0.4);
    ctx.lineTo(-r * 0.55, -r * 0.35);
    ctx.stroke();

    // Bigodes do lado direito
    ctx.beginPath();
    ctx.moveTo(r * 0.35, -r * 0.5);
    ctx.lineTo(r * 0.55, -r * 0.55);
    ctx.moveTo(r * 0.35, -r * 0.45);
    ctx.lineTo(r * 0.55, -r * 0.45);
    ctx.moveTo(r * 0.35, -r * 0.4);
    ctx.lineTo(r * 0.55, -r * 0.35);
    ctx.stroke();
  }

  /**
   * Método específico para tocar som quando o coelhinho bate na parede
   */
  playBounceSound() {
    if (window.gameAudio && window.gameAudio.beep) {
      window.gameAudio.beep();
    }
  }

  /**
   * Atualiza o sprite (override do método pai para incluir animações específicas)
   */
  update(dt, bounds) {
    // Chama a atualização base (movimento, colisões, etc.)
    super.update(dt, bounds);

    // Atualiza animações específicas do coelhinho
    this.updateAnimation(dt);
  }
}

// Função de conveniência para criar coelhinhos com cores aleatórias apropriadas
export function createRandomBunny(x, y, bounds) {
  const bunnyColors = [
    '#FFFFFF', // Branco
    '#F5F5F5', // Branco neve
    '#C0C0C0', // Cinza
    '#DEB887', // Marrom claro
    '#8B4513', // Marrom escuro
    '#FFE4B5', // Creme
    '#F0E68C'  // Bege
  ];

  const color = bunnyColors[Math.floor(Math.random() * bunnyColors.length)];
  const vx = randf(60, 100) * (Math.random() < 0.5 ? -1 : 1);
  const vy = randf(50, 90) * (Math.random() < 0.5 ? -1 : 1);
  const baseRadius = randi(24, 40); // Coelhinhos um pouco maiores

  return new Bunny({
    x: x,
    y: y,
    vx: vx,
    vy: vy,
    baseRadius: baseRadius,
    color: color
  });
}

// Função para criar múltiplos coelhinhos
export function createBunnies(spriteManager, count, bounds) {
  const bunnies = [];

  for (let i = 0; i < count; i++) {
    const bunny = createRandomBunny(0, 0, bounds);
    bunnies.push(bunny);
    spriteManager.addSprite(bunny);
  }

  // Distribui os coelhinhos em círculo
  distributeSpritesInCircle(bunnies, bounds);

  return bunnies;
}