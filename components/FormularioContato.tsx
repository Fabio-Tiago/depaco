'use client';

import { useState } from 'react';

/**
 * Formulário de contato do DEPACO.
 * Envia para /api/contato (proxy no servidor) — NUNCA fala direto com o n8n.
 * Inclui honeypot anti-bot (campo "website" invisível).
 */
export function FormularioContato() {
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'ok' | 'erro'>('idle');
  const [erroMsg, setErroMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado('enviando');
    setErroMsg('');

    const form = e.currentTarget;
    const dados = {
      nome: (form.elements.namedItem('nome') as HTMLInputElement)?.value,
      email: (form.elements.namedItem('email') as HTMLInputElement)?.value,
      mensagem: (form.elements.namedItem('mensagem') as HTMLTextAreaElement)?.value,
      // honeypot: deve ficar vazio
      website: (form.elements.namedItem('website') as HTMLInputElement)?.value,
    };

    try {
      const resp = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      const json = await resp.json();

      if (resp.ok && json.ok) {
        setEstado('ok');
        form.reset();
      } else {
        setEstado('erro');
        setErroMsg(json.erro || 'Algo deu errado. Tente novamente.');
      }
    } catch {
      setEstado('erro');
      setErroMsg('Sem conexão. Verifique sua internet e tente novamente.');
    }
  }

  if (estado === 'ok') {
    return (
      <div className="bg-white border-2 border-ink rounded-3xl shadow-chunky p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-500 border-2 border-ink rounded-full">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-8 h-8 text-ink" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-bold text-ink mb-2">Mensagem enviada! 🎉</h3>
        <p className="text-ink/70">Recebemos seu recado e vamos responder em breve no seu e-mail.</p>
        <button
          onClick={() => setEstado('idle')}
          className="mt-6 px-6 py-3 bg-mustard text-ink font-display font-bold border-2 border-ink rounded-xl shadow-chunky-sm hover:-translate-y-0.5 transition-all"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-2 border-ink rounded-3xl shadow-chunky p-6 md:p-8 space-y-5"
    >
      {/* HONEYPOT — invisível para humanos, bots tendem a preencher */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Não preencha este campo</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="nome" className="block font-display font-bold text-ink mb-1.5">
          Seu nome <span className="text-coral">*</span>
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          required
          minLength={2}
          maxLength={80}
          placeholder="Como podemos te chamar?"
          className="w-full px-4 py-3 bg-cream border-2 border-ink rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-coral transition-all"
        />
      </div>

      <div>
        <label htmlFor="email" className="block font-display font-bold text-ink mb-1.5">
          Seu e-mail <span className="text-coral">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          maxLength={120}
          placeholder="seu@email.com"
          className="w-full px-4 py-3 bg-cream border-2 border-ink rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-coral transition-all"
        />
      </div>

      <div>
        <label htmlFor="mensagem" className="block font-display font-bold text-ink mb-1.5">
          Sua mensagem <span className="text-coral">*</span>
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          required
          minLength={5}
          maxLength={2000}
          rows={5}
          placeholder="Escreva aqui sua dúvida, sugestão ou pedido..."
          className="w-full px-4 py-3 bg-cream border-2 border-ink rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-coral transition-all resize-y"
        />
      </div>

      {estado === 'erro' && (
        <p className="text-terracotta font-bold text-sm bg-terracotta/10 border-2 border-terracotta/30 rounded-xl px-4 py-3">
          {erroMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-coral text-white font-display text-lg font-bold border-2 border-ink rounded-2xl shadow-chunky hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {estado === 'enviando' ? 'Enviando...' : 'Enviar mensagem'}
      </button>

      <p className="text-xs text-ink/50 text-center">
        Seus dados são usados apenas para responder seu contato.
      </p>
    </form>
  );
}
