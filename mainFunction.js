// ===== Botões genéricos: ligam/desligam a classe "ativo" no alvo =====
document.querySelectorAll('[data-toggle]').forEach((botao) => {
    botao.textContent = botao.dataset.on;
    botao.addEventListener('click', () => {
        const alvo = document.querySelector(botao.dataset.toggle);
        const ligado = alvo.classList.toggle(botao.dataset.classe || 'ativo');
        botao.textContent = ligado ? botao.dataset.off : botao.dataset.on;
    });
});

// ===== :root: troca o valor da variável --cor-principal =====
const cores = ['teal', 'tomato', 'purple'];
let atual = 0;
document.getElementById('trocar').addEventListener('click', () => {
    atual = (atual + 1) % cores.length;
    document.documentElement.style.setProperty('--cor-principal', cores[atual]);
});

// ===== Especificidade: cada botão adiciona uma regra de verdade =====
const regras = {
    id:       { sel: '#alvo',      cor: 'red',    peso: '0-1-0-0', nivel: 3 },
    classe:   { sel: '.destaque',  cor: 'orange', peso: '0-0-1-0', nivel: 2 },
    elemento: { sel: 'blockquote', cor: 'blue',   peso: '0-0-0-1', nivel: 1 },
    inline:   { sel: null,         cor: 'green',  peso: '1-0-0-0', nivel: 4 }
};
let ativas = [];
const alvo = document.getElementById('alvo');

function atualizar() {
    const linha = (k) => regras[k].sel
        ? `${regras[k].sel} { color: ${regras[k].cor}; }  /* ${regras[k].peso} */`
        : `style="color: ${regras[k].cor}"  /* ${regras[k].peso} */`;

    // escreve as regras reais no <style id="regras">
    document.getElementById('regras').textContent = ativas
        .filter((k) => regras[k].sel)
        .map((k) => `${regras[k].sel} { color: ${regras[k].cor}; }`)
        .join('\n');

    // a regra inline é aplicada direto no elemento
    alvo.style.color = ativas.includes('inline') ? regras.inline.cor : '';

    document.getElementById('codigo').textContent = ativas.length
        ? ativas.map(linha).join('\n')
        : 'Nenhuma regra ativa.';

    // vence a regra de maior nível
    const vencedora = ativas.reduce((a, k) => (!a || regras[k].nivel > regras[a].nivel ? k : a), null);
    document.getElementById('vencedora').textContent = vencedora
        ? `Vence: ${regras[vencedora].sel || 'style inline'} (peso ${regras[vencedora].peso})`
        : 'Cor padrão do navegador.';
}

document.querySelectorAll('[data-regra]').forEach((botao) => {
    botao.addEventListener('click', () => {
        if (!ativas.includes(botao.dataset.regra)) ativas.push(botao.dataset.regra);
        atualizar();
    });
});
document.getElementById('limpar').addEventListener('click', () => {
    ativas = [];
    atualizar();
});
