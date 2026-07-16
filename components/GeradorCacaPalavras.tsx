'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * GeradorCacaPalavras — DEPACO
 *
 * Caça-palavras JOGÁVEL online (clica e arrasta para marcar) e
 * IMPRIMÍVEL (botão gera versão para papel, dispara o popup da oferta).
 *
 * Serve a dois objetivos:
 *   - Retenção/SEO: a pessoa joga, fica na página, engaja.
 *   - Venda: ao imprimir, aparece a oferta do mega pack.
 *
 * Este componente é o MOLDE dos próximos geradores (labirinto,
 * complete o versículo, etc). A lógica do algoritmo foi portada
 * do motor Python (caça-palavras 8 direções).
 */

// ---- Cores DEPACO ----
const C = {
  mostarda: '#F4B936',
  coral: '#F87956',
  terracota: '#E04E32',
  ink: '#1F1F1F',
  cream: '#FDFBF7',
  sky: '#7AC4D6',
};

// ---- Temas (amostra; no site viriam do Algolia/config) ----
const TEMAS: Record<string, string[]> = {
  'Animais da Fazenda': ['VACA', 'PORCO', 'GALINHA', 'CAVALO', 'PATO', 'OVELHA', 'CABRA'],
  'Frutas': ['BANANA', 'MACA', 'UVA', 'MORANGO', 'LARANJA', 'ABACAXI', 'PERA'],
  'Bichos de Estimação': ['GATO', 'CACHORRO', 'PEIXE', 'HAMSTER', 'COELHO', 'PASSARO'],
  'Animais da Selva': ['LEAO', 'TIGRE', 'GIRAFA', 'ELEFANTE', 'MACACO', 'ZEBRA', 'ONCA'],
  'Material Escolar': ['LAPIS', 'CADERNO', 'BORRACHA', 'MOCHILA', 'LIVRO', 'REGUA'],
  'Corpo Humano': ['CABECA', 'BRACO', 'PERNA', 'MAO', 'OLHO', 'BOCA', 'NARIZ'],
  'Animais do Mar': ['PEIXE', 'BALEIA', 'GOLFINHO', 'TARTARUGA', 'POLVO', 'TUBARAO'],
  'Insetos': ['ABELHA', 'BORBOLETA', 'FORMIGA', 'JOANINHA', 'GRILO'],
  'Dinossauros': ['TREX', 'RAPTOR', 'TRICERATOPS', 'ESTEGOSSAURO'],
  'Meios de Transporte': ['CARRO', 'AVIAO', 'BARCO', 'TREM', 'MOTO', 'ONIBUS'],
};

// ---- Direções (mesmas do motor Python) ----
const DIRECOES: [number, number][] = [
  [0, 1], [1, 0], [1, 1], [-1, 1],
  [0, -1], [-1, 0], [1, -1], [-1, -1],
];

type Pos = { l: number; c: number };

// PRNG determinístico (para o mesmo jogo poder ser recriado)
function criarRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function gerarGrade(
  palavras: string[],
  tamanho: number,
  dificuldade: 'facil' | 'medio' | 'dificil',
  seed: number
) {
  const rnd = criarRandom(seed);
  const escolha = <T,>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];

  let dirs = DIRECOES.slice(0, 2);
  if (dificuldade === 'medio') dirs = DIRECOES.slice(0, 4);
  if (dificuldade === 'dificil') dirs = DIRECOES;

  const limpas = palavras
    .map((p) => p.replace(/\s/g, '').toUpperCase())
    .filter((p) => p.length > 2 && p.length <= tamanho)
    .sort((a, b) => b.length - a.length);

  const grade: string[][] = Array.from({ length: tamanho }, () =>
    Array.from({ length: tamanho }, () => '')
  );
  const posicoes: Record<string, Pos[]> = {};
  const colocadas: string[] = [];

  const cabe = (p: string, l: number, c: number, dl: number, dc: number) => {
    for (let i = 0; i < p.length; i++) {
      const ll = l + dl * i;
      const cc = c + dc * i;
      if (ll < 0 || ll >= tamanho || cc < 0 || cc >= tamanho) return false;
      if (grade[ll][cc] !== '' && grade[ll][cc] !== p[i]) return false;
    }
    return true;
  };

  for (const p of limpas) {
    let t = 0;
    while (t < 300) {
      const [dl, dc] = escolha(dirs);
      const l = Math.floor(rnd() * tamanho);
      const c = Math.floor(rnd() * tamanho);
      if (cabe(p, l, c, dl, dc)) {
        const pos: Pos[] = [];
        for (let i = 0; i < p.length; i++) {
          const ll = l + dl * i;
          const cc = c + dc * i;
          grade[ll][cc] = p[i];
          pos.push({ l: ll, c: cc });
        }
        posicoes[p] = pos;
        colocadas.push(p);
        break;
      }
      t++;
    }
  }

  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let l = 0; l < tamanho; l++) {
    for (let c = 0; c < tamanho; c++) {
      if (grade[l][c] === '') grade[l][c] = escolha(letras.split(''));
    }
  }

  return { grade, colocadas, posicoes };
}

export default function GeradorCacaPalavras() {
  const [tema, setTema] = useState<string>('Animais da Fazenda');
  const [dificuldade, setDificuldade] = useState<'facil' | 'medio' | 'dificil'>('facil');
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 100000));

  const tamanho = dificuldade === 'facil' ? 10 : dificuldade === 'medio' ? 12 : 14;

  const { grade, colocadas, posicoes } = useMemo(
    () => gerarGrade(TEMAS[tema], tamanho, dificuldade, seed),
    [tema, tamanho, dificuldade, seed]
  );

  // ---- Estado do jogo ----
  const [selecao, setSelecao] = useState<Pos[]>([]);
  const [achadas, setAchadas] = useState<Set<string>>(new Set());
  const [arrastando, setArrastando] = useState(false);

  // reseta ao trocar de jogo
  useEffect(() => {
    setSelecao([]);
    setAchadas(new Set());
  }, [tema, dificuldade, seed]);

  const celulasAchadas = useMemo(() => {
    const s = new Set<string>();
    achadas.forEach((palavra) => {
      posicoes[palavra]?.forEach((p) => s.add(`${p.l}-${p.c}`));
    });
    return s;
  }, [achadas, posicoes]);

  // ---- Verifica se a seleção forma uma palavra ----
  const verificarSelecao = useCallback((sel: Pos[]) => {
    if (sel.length < 3) return;
    const texto = sel.map((p) => grade[p.l][p.c]).join('');
    const inverso = texto.split('').reverse().join('');

    for (const palavra of colocadas) {
      if ((texto === palavra || inverso === palavra) && !achadas.has(palavra)) {
        // confere se as posições batem com a palavra
        const posP = posicoes[palavra];
        const mesmasCelulas =
          sel.length === posP.length &&
          sel.every((s) => posP.some((p) => p.l === s.l && p.c === s.c));
        if (mesmasCelulas) {
          setAchadas((prev) => new Set(prev).add(palavra));
          return;
        }
      }
    }
  }, [grade, colocadas, posicoes, achadas]);

  // ---- Interação (clique e arraste) ----
  const iniciar = (l: number, c: number) => {
    setArrastando(true);
    setSelecao([{ l, c }]);
  };
  const mover = (l: number, c: number) => {
    if (!arrastando) return;
    setSelecao((prev) => {
      const inicio = prev[0];
      if (!inicio) return [{ l, c }];
      // só permite linha reta (h, v, diagonal)
      const dl = l - inicio.l;
      const dc = c - inicio.c;
      const passos = Math.max(Math.abs(dl), Math.abs(dc));
      if (passos === 0) return [inicio];
      const stepL = dl === 0 ? 0 : dl / Math.abs(dl);
      const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
      // valida linha reta
      if (!(dl === 0 || dc === 0 || Math.abs(dl) === Math.abs(dc))) return prev;
      const nova: Pos[] = [];
      for (let i = 0; i <= passos; i++) {
        nova.push({ l: inicio.l + stepL * i, c: inicio.c + stepC * i });
      }
      return nova;
    });
  };
  const soltar = () => {
    setArrastando(false);
    verificarSelecao(selecao);
    setSelecao([]);
  };

  const selecionadas = useMemo(() => {
    const s = new Set<string>();
    selecao.forEach((p) => s.add(`${p.l}-${p.c}`));
    return s;
  }, [selecao]);

  const completou = achadas.size === colocadas.length && colocadas.length > 0;

  // ---- Imprimir: dispara o popup da oferta ----
  const aoImprimir = () => {
    // evento para o site abrir o PopupOfertaDownload
    if (typeof window !== 'undefined') {
      const w = window as unknown as {
        abrirOfertaPack?: () => void;
        gtag?: (...a: unknown[]) => void;
      };
      w.gtag?.('event', 'imprimir_atividade', { tipo: 'caca-palavras', tema });
      if (w.abrirOfertaPack) {
        w.abrirOfertaPack();     // o site decide mostrar a oferta
      } else {
        window.print();          // fallback: imprime direto
      }
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: C.ink }}>
      {/* ---- Controles ---- */}
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end',
          padding: '16px', background: C.cream, border: `3px solid ${C.ink}`,
          borderRadius: '20px', marginBottom: '20px',
        }}
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontWeight: 700, fontSize: '13px' }}>
          Tema
          <select
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            style={{
              padding: '10px 14px', borderRadius: '12px', border: `2px solid ${C.ink}`,
              fontSize: '15px', fontWeight: 600, background: '#fff', cursor: 'pointer',
            }}
          >
            {Object.keys(TEMAS).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontWeight: 700, fontSize: '13px' }}>
          Dificuldade
          <select
            value={dificuldade}
            onChange={(e) => setDificuldade(e.target.value as typeof dificuldade)}
            style={{
              padding: '10px 14px', borderRadius: '12px', border: `2px solid ${C.ink}`,
              fontSize: '15px', fontWeight: 600, background: '#fff', cursor: 'pointer',
            }}
          >
            <option value="facil">Fácil (só reto)</option>
            <option value="medio">Médio (diagonais)</option>
            <option value="dificil">Difícil (invertidas)</option>
          </select>
        </label>

        <button
          onClick={() => setSeed(Math.floor(Math.random() * 100000))}
          style={{
            padding: '11px 18px', borderRadius: '12px', border: `2px solid ${C.ink}`,
            background: C.mostarda, color: C.ink, fontWeight: 700, fontSize: '15px',
            cursor: 'pointer',
          }}
        >
          🎲 Novo jogo
        </button>

        <button
          onClick={aoImprimir}
          style={{
            padding: '11px 18px', borderRadius: '12px', border: `2px solid ${C.ink}`,
            background: C.coral, color: C.cream, fontWeight: 700, fontSize: '15px',
            cursor: 'pointer', marginLeft: 'auto',
          }}
        >
          🖨️ Imprimir
        </button>
      </div>

      {/* ---- Área do jogo ---- */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
        {/* Grade */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${tamanho}, 1fr)`,
            gap: '2px', background: C.ink, border: `3px solid ${C.ink}`,
            borderRadius: '12px', padding: '3px', touchAction: 'none',
            userSelect: 'none', flexShrink: 0,
          }}
          onMouseLeave={() => arrastando && soltar()}
        >
          {grade.map((linha, l) =>
            linha.map((letra, c) => {
              const chave = `${l}-${c}`;
              const achada = celulasAchadas.has(chave);
              const sel = selecionadas.has(chave);
              return (
                <div
                  key={chave}
                  onMouseDown={() => iniciar(l, c)}
                  onMouseEnter={() => mover(l, c)}
                  onMouseUp={soltar}
                  onTouchStart={() => iniciar(l, c)}
                  onTouchMove={(e) => {
                    const t = e.touches[0];
                    const el = document.elementFromPoint(t.clientX, t.clientY);
                    const pos = el?.getAttribute('data-pos');
                    if (pos) {
                      const [ll, cc] = pos.split('-').map(Number);
                      mover(ll, cc);
                    }
                  }}
                  onTouchEnd={soltar}
                  data-pos={chave}
                  style={{
                    width: tamanho > 12 ? '26px' : '32px',
                    height: tamanho > 12 ? '26px' : '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: achada ? C.sky : sel ? C.mostarda : C.cream,
                    color: C.ink, fontWeight: 700,
                    fontSize: tamanho > 12 ? '13px' : '16px',
                    borderRadius: '5px', cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                >
                  {letra}
                </div>
              );
            })
          )}
        </div>

        {/* Lista de palavras */}
        <div style={{ flex: 1, minWidth: '180px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 800 }}>
            Encontre {colocadas.length} palavras
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {colocadas.map((p) => (
              <li
                key={p}
                style={{
                  padding: '6px 12px', borderRadius: '10px',
                  border: `2px solid ${C.ink}`, fontWeight: 700, fontSize: '14px',
                  background: achadas.has(p) ? C.sky : '#fff',
                  textDecoration: achadas.has(p) ? 'line-through' : 'none',
                  opacity: achadas.has(p) ? 0.7 : 1,
                }}
              >
                {p}
              </li>
            ))}
          </ul>

          {completou && (
            <div
              style={{
                marginTop: '20px', padding: '16px', borderRadius: '16px',
                background: C.mostarda, border: `3px solid ${C.ink}`, textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '22px', fontWeight: 800 }}>🎉 Parabéns!</div>
              <div style={{ marginTop: '4px', fontWeight: 600 }}>
                Você achou todas as palavras!
              </div>
              <button
                onClick={aoImprimir}
                style={{
                  marginTop: '12px', padding: '10px 20px', borderRadius: '12px',
                  border: `2px solid ${C.ink}`, background: C.coral, color: C.cream,
                  fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                }}
              >
                Quero mais atividades assim →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
