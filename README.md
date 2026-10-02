# Produtividade da Frota (sigecon-produtividade-frota)

App de celular para lançar a produtividade diária das máquinas, com assinatura do operador e do apontador. Usa o mesmo Supabase do SIGECON (gestão de frota): mesmos usuários, obras, máquinas e listas, e grava direto na `frota_rdo`. Funciona sem internet depois do primeiro acesso.

## Antes de publicar: uma alteração no banco

Rode `supabase-assinaturas.sql` uma vez no Supabase (**SQL Editor → New query → colar → Run**). Ele só adiciona a coluna `assinaturas` na `frota_rdo`. Nada do que já existe muda, e o módulo do escritório continua funcionando igual.

### Permissões

O app faz, com o usuário de quem está logado, as mesmas operações que o módulo de frota já faz:

| Tabela | O app faz |
|---|---|
| `obras`, `equipamentos`, `frota_tipos`, `fornecedores`, `contrato_ativos`, `contratos`, `frota_rdo_listas`, `usuarios` | lê |
| `frota_rdo` | lê, cria e altera (só dias ainda não medidos) |
| `frota_rdo_ajustes` | lê, cria e apaga |

Se o apontador já consegue lançar produtividade pelo sistema, o app vai funcionar com o mesmo login. Se der erro de permissão ao entrar ou ao enviar, revise as regras de acesso (RLS) dessas tabelas para o perfil do apontador.

## Publicar no GitHub Pages

1. Envie todos os arquivos desta pasta para a raiz do repositório `sigecon-produtividade-frota`.
2. **Settings → Pages**: *Deploy from a branch*, branch `main`, pasta `/ (root)`.
3. O app fica em `https://SEU-USUARIO.github.io/sigecon-produtividade-frota/`.

## Instalar no celular

**Android (Chrome):** abra o link e toque em **Instalar** no aviso dentro do app (ou menu ⋮ do Chrome → **Instalar app**).

**iPhone (Safari):** abra o link no Safari → **Compartilhar** → **Adicionar à Tela de Início**.

O primeiro acesso precisa de internet: o apontador entra com o e-mail e a senha do SIGECON, escolhe a obra e o app baixa as máquinas e listas. Depois disso abre direto, com ou sem sinal.

## Como os dados andam

**Do sistema para o celular**, sempre que o app abre com internet (ou pelo menu ⋯ → **Atualizar obras e máquinas**):

- obras com status `ativa`;
- máquinas ativas com contrato ativo, cada uma na obra do seu contrato (mesma regra do módulo de frota);
- eventos, atividades e locais da `frota_rdo_listas`;
- lançamentos dos últimos 45 dias da `frota_rdo`, para não deixar lançar a mesma máquina duas vezes no dia e para sugerir o horímetro inicial.

Cadastrou máquina, atividade ou local no sistema? Ela aparece no celular na próxima vez que o app abrir com internet.

**Do celular para o sistema:** quando o lançamento é assinado, ele vai para a `frota_rdo` (grade de horas, manutenções e abastecimentos no mesmo formato do sistema) e os acréscimos e descontos para a `frota_rdo_ajustes`. Sem sinal, fica numa fila no celular e sobe sozinho quando a internet voltar. O lançamento aparece no histórico, nos relatórios e nas medições do sistema como qualquer outro.

**Rascunhos não sobem.** Só lançamentos assinados vão para o sistema.

### Quando o envio é recusado

- **Já existe lançamento da máquina naquele dia no sistema** (feito pelo escritório ou por outro celular): o app não sobrescreve. O lançamento fica marcado em vermelho no celular, com o motivo.
- **O dia já entrou em medição:** o app não altera. Mesma marcação.

Em ambos os casos, o escritório decide o que fazer com o registro existente.

## Assinatura

O operador confere o resumo do dia e assina com o dedo; o apontador (usuário logado) assina em seguida. Vai junto para a coluna `assinaturas`:

- data, hora e fuso do celular;
- localização GPS, se o celular permitir;
- identificação do aparelho;
- código de conferência (SHA-256 do conteúdo assinado);
- histórico de assinaturas anuladas, se o lançamento foi corrigido.

Corrigir um lançamento assinado anula as assinaturas, que precisam ser colhidas de novo; a versão corrigida substitui a do sistema (se o dia ainda não foi medido). Se o operador se recusar a assinar, o apontador registra o motivo e assina sozinho.

Para a assinatura valer como prova perante o fornecedor, inclua no contrato de locação uma cláusula aceitando o registro eletrônico do app como comprovação das horas.

## Publicar uma nova versão do app

Sempre que alterar `index.html` ou os ícones, aumente a `VERSAO` em `sw.js` (ex: `fc-v2.0.0` → `fc-v2.0.1`). Sem isso, os celulares continuam com a versão antiga. Com isso, aparece no app o aviso **Nova versão do app** com o botão **Atualizar**.

## Outros apps no mesmo GitHub

Todos os apps da mesma conta ficam sob `SEU-USUARIO.github.io` e dividem o armazenamento do celular. Num app novo (ex: `sigecon-produtividade-operadores`), use nomes próprios. Este app usa o banco local `frota_campo`, as chaves `fc_pref` e `fc_tema` e a sessão `sb-frota-campo-auth`; o de vistorias usa `vistorias_campo_db` e `tema_app`.

## Arquivos

| Arquivo | Para quê |
|---|---|
| `index.html` | O app |
| `supabase.js` | Biblioteca do Supabase (2.117.2), guardada junto pra abrir sem internet |
| `sw.js` | Guarda o app no celular |
| `manifest.json` | Nome, cores e ícones para instalar |
| `icone*.png`, `icone.svg` | Ícones |
| `supabase-assinaturas.sql` | Alteração única no banco (coluna de assinaturas) |
