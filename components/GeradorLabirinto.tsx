'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';

/**
 * GeradorLabirinto — DEPACO
 *
 * Labirinto JOGÁVEL (traça o caminho com dedo/mouse da entrada à saída)
 * e BAIXÁVEL (gera imagem e baixa — a pessoa imprime depois).
 *
 * Algoritmo portado do motor Python (backtracking recursivo,
 * labirinto perfeito: sempre tem solução única).
 */

const C = {
  mostarda: '#F4B936', coral: '#F87956', terracota: '#E04E32',
  ink: '#1F1F1F', cream: '#FDFBF7', sky: '#7AC4D6',
};

const TEMAS = ['Animais', 'Natureza', 'Escola', 'Fazenda', 'Espaço', 'Oceano'];

function criarRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

type Paredes = { N: boolean; S: boolean; L: boolean; O: boolean };

function gerarLabirinto(largura: number, altura: number, seed: number) {
  const rnd = criarRandom(seed);
  const celulas: Paredes[][] = Array.from({ length: altura }, () =>
    Array.from({ length: largura }, () => ({ N: true, S: true, L: true, O: true }))
  );
  const visitadas = Array.from({ length: altura }, () => Array(largura).fill(false));

  const OPOSTO: Record<string, keyof Paredes> = { N: 'S', S: 'N', L: 'O', O: 'L' };
  const MOVE: Record<string, [number, number]> = { N: [-1, 0], S: [1, 0], L: [0, 1], O: [0, -1] };

  // pilha explícita (evita estouro de recursão em telas grandes)
  const pilha: [number, number][] = [[0, 0]];
  visitadas[0][0] = true;
  while (pilha.length) {
    const [l, c] = pilha[pilha.length - 1];
    const dirs = ['N', 'S', 'L', 'O'].sort(() => rnd() - 0.5);
    let avancou = false;
    for (const d of dirs) {
      const [dl, dc] = MOVE[d];
      const nl = l + dl, nc = c + dc;
      if (nl >= 0 && nl < altura && nc >= 0 && nc < largura && !visitadas[nl][nc]) {
        celulas[l][c][d as keyof Paredes] = false;
        celulas[nl][nc][OPOSTO[d]] = false;
        visitadas[nl][nc] = true;
        pilha.push([nl, nc]);
        avancou = true;
        break;
      }
    }
    if (!avancou) pilha.pop();
  }

  return celulas;
}

export default function GeradorLabirinto() {
  const [tema, setTema] = useState('Animais');
  const [dificuldade, setDificuldade] = useState<'facil' | 'medio' | 'dificil'>('facil');
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000));

  const tam = dificuldade === 'facil' ? 8 : dificuldade === 'medio' ? 12 : 16;
  const celulas = useMemo(() => gerarLabirinto(tam, tam, seed), [tam, seed]);

  // caminho que a criança traçou
  const [caminho, setCaminho] = useState<[number, number][]>([]);
  const [arrastando, setArrastando] = useState(false);

  useEffect(() => { setCaminho([]); }, [tam, seed]);

  const chegou = caminho.some(([l, c]) => l === tam - 1 && c === tam - 1);

  // pode mover entre duas células se não há parede entre elas
  const podeMover = useCallback((de: [number, number], para: [number, number]) => {
    const [l, c] = de; const [nl, nc] = para;
    if (nl === l - 1 && nc === c) return !celulas[l][c].N;
    if (nl === l + 1 && nc === c) return !celulas[l][c].S;
    if (nl === l && nc === c + 1) return !celulas[l][c].L;
    if (nl === l && nc === c - 1) return !celulas[l][c].O;
    return false;
  }, [celulas]);

  const entrar = (l: number, c: number) => {
    if (l === 0 && c === 0) { setArrastando(true); setCaminho([[0, 0]]); }
  };
  const mover = (l: number, c: number) => {
    if (!arrastando) return;
    setCaminho((prev) => {
      if (!prev.length) return prev;
      const ultimo = prev[prev.length - 1];
      // volta atrás
      if (prev.length > 1 && prev[prev.length - 2][0] === l && prev[prev.length - 2][1] === c) {
        return prev.slice(0, -1);
      }
      if (podeMover(ultimo, [l, c]) && !prev.some(([pl, pc]) => pl === l && pc === c)) {
        return [...prev, [l, c]];
      }
      return prev;
    });
  };
  const soltar = () => setArrastando(false);

  const noCaminho = useMemo(() => {
    const s = new Set<string>();
    caminho.forEach(([l, c]) => s.add(`${l}-${c}`));
    return s;
  }, [caminho]);

  const cell = 34;

  const aoBaixar = () => {
    if (typeof window === 'undefined') return;
    const w = window as unknown as { abrirOfertaPack?: () => void; gtag?: (...a: unknown[]) => void };
    w.gtag?.('event', 'baixar_atividade', { tipo: 'labirinto', tema });

    // desenha o labirinto num canvas e baixa
    const canvas = document.createElement('canvas');
    const m = 30;
    canvas.width = tam * cell + m * 2;
    canvas.height = tam * cell + m * 2 + 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1F1F1F'; ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`Labirinto: ${tema}`, m, 32);
    ctx.strokeStyle = '#1F1F1F'; ctx.lineWidth = 2;
    for (let l = 0; l < tam; l++) {
      for (let c = 0; c < tam; c++) {
        const x = m + c * cell; const y = 50 + m + l * cell;
        const p = celulas[l][c];
        ctx.beginPath();
        if (p.N) { ctx.moveTo(x, y); ctx.lineTo(x + cell, y); }
        if (p.S) { ctx.moveTo(x, y + cell); ctx.lineTo(x + cell, y + cell); }
        if (p.L) { ctx.moveTo(x + cell, y); ctx.lineTo(x + cell, y + cell); }
        if (p.O) { ctx.moveTo(x, y); ctx.lineTo(x, y + cell); }
        ctx.stroke();
      }
    }
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `labirinto-${tema.toLowerCase()}.png`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);

    if (w.abrirOfertaPack) w.abrirOfertaPack();
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: C.ink }}>
      {/* Controles */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end', padding: '16px', background: C.cream, border: `3px solid ${C.ink}`, borderRadius: '20px', marginBottom: '20px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontWeight: 700, fontSize: '13px' }}>
          Tema
          <select value={tema} onChange={(e) => setTema(e.target.value)} style={{ padding: '10px 14px', borderRadius: '12px', border: `2px solid ${C.ink}`, fontSize: '15px', fontWeight: 600, background: '#fff', cursor: 'pointer' }}>
            {TEMAS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontWeight: 700, fontSize: '13px' }}>
          Dificuldade
          <select value={dificuldade} onChange={(e) => setDificuldade(e.target.value as typeof dificuldade)} style={{ padding: '10px 14px', borderRadius: '12px', border: `2px solid ${C.ink}`, fontSize: '15px', fontWeight: 600, background: '#fff', cursor: 'pointer' }}>
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
          </select>
        </label>
        <button onClick={() => setSeed(Math.floor(Math.random() * 100000))} style={{ padding: '11px 18px', borderRadius: '12px', border: `2px solid ${C.ink}`, background: C.mostarda, color: C.ink, fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
          🎲 Novo
        </button>
        <button onClick={aoBaixar} style={{ padding: '11px 18px', borderRadius: '12px', border: `2px solid ${C.ink}`, background: C.coral, color: C.cream, fontWeight: 700, fontSize: '15px', cursor: 'pointer', marginLeft: 'auto' }}>
          ⬇️ Baixar
        </button>
      </div>

      {/* Labirinto */}
      <div style={{ overflowX: 'auto' }}>
        <svg
          width={tam * cell + 20} height={tam * cell + 20}
          style={{ touchAction: 'none', userSelect: 'none', maxWidth: '100%' }}
          onMouseUp={soltar} onMouseLeave={soltar}
        >
          {/* entrada e saída */}
          <rect x={10} y={10} width={cell} height={cell} fill={C.sky} opacity={0.4} />
          <rect x={10 + (tam - 1) * cell} y={10 + (tam - 1) * cell} width={cell} height={cell} fill={C.mostarda} opacity={0.5} />

          {/* caminho traçado */}
          {caminho.map(([l, c], i) => (
            <rect key={i} x={10 + c * cell + 4} y={10 + l * cell + 4} width={cell - 8} height={cell - 8} fill={C.coral} opacity={0.5} rx={4} />
          ))}

          {/* células invisíveis para captar toque */}
          {celulas.map((linha, l) => linha.map((_, c) => (
            <rect
              key={`h-${l}-${c}`} x={10 + c * cell} y={10 + l * cell}
              width={cell} height={cell} fill="transparent"
              data-pos={`${l}-${c}`}
              onMouseDown={() => entrar(l, c)}
              onMouseEnter={() => mover(l, c)}
              onTouchStart={() => entrar(l, c)}
              onTouchMove={(e) => {
                const t = e.touches[0];
                const el = document.elementFromPoint(t.clientX, t.clientY);
                const pos = el?.getAttribute('data-pos');
                if (pos) { const [ll, cc] = pos.split('-').map(Number); mover(ll, cc); }
              }}
              onTouchEnd={soltar}
            />
          )))}

          {/* paredes */}
          {celulas.map((linha, l) => linha.map((p, c) => {
            const x = 10 + c * cell; const y = 10 + l * cell;
            return (
              <g key={`w-${l}-${c}`} stroke={C.ink} strokeWidth={2} strokeLinecap="round">
                {p.N && <line x1={x} y1={y} x2={x + cell} y2={y} />}
                {p.S && <line x1={x} y1={y + cell} x2={x + cell} y2={y + cell} />}
                {p.L && <line x1={x + cell} y1={y} x2={x + cell} y2={y + cell} />}
                {p.O && <line x1={x} y1={y} x2={x} y2={y + cell} />}
              </g>
            );
          }))}
        </svg>
      </div>

      <p style={{ marginTop: '12px', color: C.ink, fontWeight: 600 }}>
        {chegou ? '🎉 Chegou ao fim! Muito bem!' : 'Arraste da entrada (azul) até a saída (amarela).'}
      </p>

      {chegou && (
        <div style={{ marginTop: '16px', padding: '16px', borderRadius: '16px', background: C.mostarda, border: `3px solid ${C.ink}`, textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 800 }}>Parabéns! 🎉</div>
          <button onClick={aoBaixar} style={{ marginTop: '12px', padding: '10px 20px', borderRadius: '12px', border: `2px solid ${C.ink}`, background: C.coral, color: C.cream, fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
            Quero mais labirintos →
          </button>
        </div>
      )}
    </div>
  );
}
