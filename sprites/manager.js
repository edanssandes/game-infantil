// =================== Sprite System Manager ===================
// Sistema central para gerenciar sprites - classes base, manager e utilitários

import { randi, randf } from '../categorias/utils.js';

// ====== Classe Base: Sprite ======
export class Sprite {
  constructor(options = {}) {
    // Propriedades básicas de posição e física
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    
    // Propriedades visuais
    this.baseRadius = options.baseRadius || 20;
    this.color = options.color || '#93c5fd';
    this.scale = options.scale || 1;
    
    // Estados de humor e comportamento
    this.mood = 'neutral';
    this.moodUntil = 0;
    
    // Fase de movimento (para variações de velocidade)
    this.phase = randi(0, 7);
    this.phaseTimer = 0;
    
    // Sistema de arrastar
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    
    // Audio e efeitos
    this.lastBeepTs = 0;
    
    // Limites de velocidade
    this.maxVelocity = options.maxVelocity || 140;
    this.jitterChance = options.jitterChance || 0.01;
    this.jitterStrength = options.jitterStrength || 40;
    
    // Tipo do sprite (para identificação)
    this.type = options.type || 'base';
  }

  // Calcula o raio efetivo considerando escala e streak
  getEffectiveRadius(globalScale = 1) {
    return this.baseRadius * this.scale * globalScale;
  }

  // Atualiza posição e física
  update(deltaTime, bounds, globalScale = 1) {
    if (this.isDragging) return;

    // Atualiza fase de movimento
    this.phaseTimer += deltaTime;
    if (this.phaseTimer > 0.7) {
      this.phaseTimer = 0;
      this.phase = (this.phase + 1) % 8;
    }

    // Aplica boost de velocidade baseado na fase
    const speedBoost = this.getSpeedBoost();
    const effectiveRadius = this.getEffectiveRadius(globalScale);

    // Move o sprite
    this.x += this.vx * deltaTime * speedBoost;
    this.y += this.vy * deltaTime * speedBoost;

    // Verifica colisões com bordas
    let bounced = false;
    if (this.x < effectiveRadius) {
      this.x = effectiveRadius;
      this.vx *= -1;
      bounced = true;
    }
    if (this.x > bounds.width - effectiveRadius) {
      this.x = bounds.width - effectiveRadius;
      this.vx *= -1;
      bounced = true;
    }
    if (this.y < effectiveRadius) {
      this.y = effectiveRadius;
      this.vy *= -1;
      bounced = true;
    }
    if (this.y > bounds.height - effectiveRadius) {
      this.y = bounds.height - effectiveRadius;
      this.vy *= -1;
      bounced = true;
    }

    // Som de bounce (se implementado)
    if (bounced) {
      this.onBounce();
    }

    // Adiciona jitter aleatório
    if (Math.random() < this.jitterChance) {
      this.vx += (Math.random() - 0.5) * this.jitterStrength;
      this.vy += (Math.random() - 0.5) * this.jitterStrength;
    }

    // Limita velocidade
    this.vx = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.vx));
    this.vy = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.vy));

    // Expira humor
    if (this.mood !== 'neutral' && performance.now() > this.moodUntil) {
      this.mood = 'neutral';
    }
  }

  // Métodos de boost de velocidade (cíclico)
  getSpeedBoost() {
    const SPEED_CYCLE = [30, 20, 10, 8, 5, 45, 3, 2];
    return 1 + 0.04 * SPEED_CYCLE[this.phase % SPEED_CYCLE.length];
  }

  // Define humor com duração
  setMood(mood, durationMs) {
    this.mood = mood;
    this.moodUntil = performance.now() + durationMs;
  }

  // Verifica se um ponto está dentro do sprite
  containsPoint(x, y, globalScale = 1) {
    const effectiveRadius = this.getEffectiveRadius(globalScale);
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy) <= effectiveRadius;
  }

  // Inicia arrastar
  startDrag(mouseX, mouseY) {
    this.isDragging = true;
    this.dragOffsetX = mouseX - this.x;
    this.dragOffsetY = mouseY - this.y;
    this.onDragStart();
  }

  // Para arrastar
  stopDrag() {
    this.isDragging = false;
    this.onDragEnd();
  }

  // Atualiza posição durante arrastar
  updateDrag(mouseX, mouseY, bounds, globalScale = 1) {
    if (!this.isDragging) return;

    const effectiveRadius = this.getEffectiveRadius(globalScale);
    this.x = Math.max(effectiveRadius, 
              Math.min(bounds.width - effectiveRadius, 
                      mouseX - this.dragOffsetX));
    this.y = Math.max(effectiveRadius, 
              Math.min(bounds.height - effectiveRadius, 
                      mouseY - this.dragOffsetY));
  }

  // Métodos virtuais para serem sobrescritos pelas subclasses
  draw(ctx, globalScale = 1) {
    // Implementação base - círculo simples
    const effectiveRadius = this.getEffectiveRadius(globalScale);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, effectiveRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Evento chamado quando o sprite bate na parede
  onBounce() {
    // Cooldown para evitar muitos sons
    const now = performance.now();
    if (now - this.lastBeepTs >= 120) {
      this.lastBeepTs = now;
      this.playBounceSound();
    }
  }

  // Eventos de drag (podem ser sobrescritos)
  onDragStart() {
    // Para ser implementado pelas subclasses
  }

  onDragEnd() {
    // Para ser implementado pelas subclasses
  }

  // Som de bounce (pode ser sobrescrito)
  playBounceSound() {
    if (window.gameAudio && window.gameAudio.beep) {
      window.gameAudio.beep();
    }
  }
}

// ====== Gerenciador de Sprites ======
export class SpriteManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sprites = [];
    this.activeCount = 1;
    this.globalScale = 1;
    
    // Sistema de drag and drop
    this.draggedSprite = null;
    this.isDragging = false;
    
    // Timestamps para animação
    this.lastUpdateTime = 0;
    
    // Configuração da animação
    this.setupEventListeners();
  }

  // Configura event listeners para interação
  setupEventListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.canvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));

    // Touch events para mobile
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = { clientX: touch.clientX, clientY: touch.clientY };
      this.handleMouseDown(mouseEvent);
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = { clientX: touch.clientX, clientY: touch.clientY };
      this.handleMouseMove(mouseEvent);
    });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.handleMouseUp(e);
    });
  }

  // Obtém posição do mouse relativa ao canvas
  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return {
      x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
    };
  }

  // Encontra sprite na posição do mouse
  getSpriteAtPosition(mouseX, mouseY) {
    // Verifica apenas sprites ativos (em ordem reversa para priorizar os da frente)
    for (let i = Math.min(this.activeCount, this.sprites.length) - 1; i >= 0; i--) {
      const sprite = this.sprites[i];
      if (sprite.containsPoint(mouseX, mouseY, this.globalScale)) {
        return sprite;
      }
    }
    return null;
  }

  // Event handlers
  handleMouseDown(e) {
    const mousePos = this.getMousePos(e);
    this.draggedSprite = this.getSpriteAtPosition(mousePos.x, mousePos.y);

    if (this.draggedSprite) {
      this.isDragging = true;
      this.draggedSprite.startDrag(mousePos.x, mousePos.y);
      e.preventDefault();
    }
  }

  handleMouseMove(e) {
    if (this.isDragging && this.draggedSprite) {
      const mousePos = this.getMousePos(e);
      const bounds = this.getBounds();
      this.draggedSprite.updateDrag(mousePos.x, mousePos.y, bounds, this.globalScale);
      e.preventDefault();
    }
  }

  handleMouseUp(e) {
    if (this.isDragging && this.draggedSprite) {
      this.draggedSprite.stopDrag();
      this.draggedSprite = null;
      this.isDragging = false;
    }
  }

  // Obtém dimensões do canvas
  getBounds() {
    return {
      width: this.canvas.clientWidth || this.canvas.width,
      height: this.canvas.clientHeight || this.canvas.height
    };
  }

  // Gerenciamento de sprites
  addSprite(sprite) {
    this.sprites.push(sprite);
    return sprite;
  }

  removeSprite(sprite) {
    const index = this.sprites.indexOf(sprite);
    if (index !== -1) {
      this.sprites.splice(index, 1);
    }
  }

  clearSprites() {
    this.sprites = [];
    this.draggedSprite = null;
    this.isDragging = false;
  }

  // Configurações globais
  setActiveCount(count) {
    this.activeCount = Math.max(1, Math.min(count, this.sprites.length));
  }

  setGlobalScale(scale) {
    this.globalScale = Math.max(0.1, scale);
  }

  // Define humor para todos os sprites ativos
  setMoodAll(mood, durationMs) {
    for (let i = 0; i < Math.min(this.activeCount, this.sprites.length); i++) {
      this.sprites[i].setMood(mood, durationMs);
    }
  }

  // Atualização do sistema
  update(timestamp) {
    if (!this.lastUpdateTime) {
      this.lastUpdateTime = timestamp;
      return;
    }

    const deltaTime = Math.min(0.05, (timestamp - this.lastUpdateTime) / 1000);
    this.lastUpdateTime = timestamp;

    const bounds = this.getBounds();

    // Atualiza apenas sprites ativos
    for (let i = 0; i < Math.min(this.activeCount, this.sprites.length); i++) {
      this.sprites[i].update(deltaTime, bounds, this.globalScale);
    }
  }

  // Renderização
  draw() {
    const bounds = this.getBounds();
    
    // Limpa o canvas
    this.ctx.clearRect(0, 0, bounds.width, bounds.height);

    // Desenha apenas sprites ativos
    for (let i = 0; i < Math.min(this.activeCount, this.sprites.length); i++) {
      this.sprites[i].draw(this.ctx, this.globalScale);
    }
  }

  // Redimensiona o canvas mantendo sprites dentro dos limites
  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    
    this.canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Garante que todos os sprites fiquem dentro dos novos limites
    const bounds = this.getBounds();
    this.sprites.forEach(sprite => {
      const effectiveRadius = sprite.getEffectiveRadius(this.globalScale);
      sprite.x = Math.min(Math.max(effectiveRadius, sprite.x), bounds.width - effectiveRadius);
      sprite.y = Math.min(Math.max(effectiveRadius, sprite.y), bounds.height - effectiveRadius);
    });
  }
}

// ====== Utilitários para criação de sprites ======

/**
 * Cria um sprite básico com propriedades aleatórias
 */
export function createBasicSprite(x, y, bounds, options = {}) {
  return new Sprite({
    x: x,
    y: y,
    vx: randf(70, 120) * (Math.random() < 0.5 ? -1 : 1),
    vy: randf(60, 110) * (Math.random() < 0.5 ? -1 : 1),
    baseRadius: randi(16, 32),
    color: options.color || '#93c5fd',
    ...options
  });
}

/**
 * Posiciona sprites em círculo para evitar sobreposição
 */
export function distributeSpritesInCircle(sprites, bounds) {
  const centerX = bounds.width * 0.5;
  const centerY = bounds.height * 0.5;
  const radius = Math.min(bounds.width, bounds.height) * 0.25;

  sprites.forEach((sprite, i) => {
    const angle = (i / sprites.length) * Math.PI * 2;
    sprite.x = centerX + Math.cos(angle) * radius + randf(-30, 30);
    sprite.y = centerY + Math.sin(angle) * radius + randf(-20, 20);
  });
}
