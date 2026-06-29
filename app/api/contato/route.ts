import { NextResponse } from 'next/server';

/**
 * PROXY SEGURO entre o formulário do site e o webhook do n8n.
 *
 * O navegador NUNCA vê a URL do webhook do n8n — ela fica só aqui,
 * no servidor, lida de variável de ambiente. Camadas de proteção:
 *   1. Webhook em env var (N8N_CONTATO_WEBHOOK_URL) — fora do código público
 *   2. Honeypot (campo "website") — bots preenchem, humanos não
 *   3. Rate limit por IP em memória — trava flood de envios
 *   4. Secret header — o n8n só aceita requisições com este token
 *   5. Validação de campos antes de chamar o n8n
 */

// Rate limit simples em memória (por instância serverless).
// Para algo mais robusto, trocar por Upstash/Redis no futuro.
const tentativasPorIp = new Map<string, { count: number; reset: number }>();
const JANELA_MS = 60_000; // 1 minuto
const MAX_POR_JANELA = 3; // máx 3 envios por minuto por IP

function checarRateLimit(ip: string): boolean {
  const agora = Date.now();
  const registro = tentativasPorIp.get(ip);

  if (!registro || agora > registro.reset) {
    tentativasPorIp.set(ip, { count: 1, reset: agora + JANELA_MS });
    return true;
  }
  if (registro.count >= MAX_POR_JANELA) {
    return false;
  }
  registro.count += 1;
  return true;
}

function valido(valor: unknown, min: number, max: number): valor is string {
  return typeof valor === 'string' && valor.trim().length >= min && valor.trim().length <= max;
}

export async function POST(request: Request) {
  try {
    // IP do visitante (Vercel passa em x-forwarded-for)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'desconhecido';

    if (!checarRateLimit(ip)) {
      return NextResponse.json(
        { ok: false, erro: 'Muitas tentativas. Aguarde um minuto e tente novamente.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, erro: 'Requisição inválida.' }, { status: 400 });
    }

    const { nome, email, mensagem, website } = body;

    // HONEYPOT: campo invisível "website". Se veio preenchido, é bot.
    // Respondemos 200 (fingimos sucesso) pra não dar pista ao bot.
    if (website && String(website).trim() !== '') {
      return NextResponse.json({ ok: true });
    }

    // Validação
    if (!valido(nome, 2, 80)) {
      return NextResponse.json({ ok: false, erro: 'Informe um nome válido.' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!valido(email, 5, 120) || !emailRegex.test(email.trim())) {
      return NextResponse.json({ ok: false, erro: 'Informe um e-mail válido.' }, { status: 400 });
    }
    if (!valido(mensagem, 5, 2000)) {
      return NextResponse.json({ ok: false, erro: 'Escreva uma mensagem (mínimo 5 caracteres).' }, { status: 400 });
    }

    const webhookUrl = process.env.N8N_CONTATO_WEBHOOK_URL;
    const secret = process.env.N8N_CONTATO_SECRET;

    if (!webhookUrl) {
      console.error('N8N_CONTATO_WEBHOOK_URL não configurada');
      return NextResponse.json(
        { ok: false, erro: 'Serviço temporariamente indisponível.' },
        { status: 503 }
      );
    }

    // Chama o n8n DO SERVIDOR. A URL nunca chega ao navegador.
    const resp = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Secret que o n8n vai conferir — só o servidor conhece
        ...(secret ? { 'x-depaco-secret': secret } : {}),
      },
      body: JSON.stringify({
        nome: nome.trim(),
        email: email.trim(),
        mensagem: mensagem.trim(),
        origem: 'depaco.com.br/contato',
        recebido_em: new Date().toISOString(),
        ip,
      }),
    });

    if (!resp.ok) {
      console.error('n8n respondeu erro:', resp.status);
      return NextResponse.json(
        { ok: false, erro: 'Não conseguimos enviar agora. Tente novamente em instantes.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Erro na rota de contato:', err);
    return NextResponse.json(
      { ok: false, erro: 'Erro inesperado. Tente novamente.' },
      { status: 500 }
    );
  }
}

// Bloqueia outros métodos
export async function GET() {
  return NextResponse.json({ ok: false, erro: 'Método não permitido.' }, { status: 405 });
}
