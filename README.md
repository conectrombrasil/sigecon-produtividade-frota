# Produtividade da Frota (sigecon-produtividade-frota)

App de celular para lançar a produtividade diária das máquinas no lugar do RDO de papel. Usa o mesmo Supabase do SIGECON: mesmos usuários, obras, máquinas e listas. O lançamento só entra na `frota_rdo` (e na medição) depois de assinado.

## Dois perfis

**Operador.** Entra com o login dele, vê só as máquinas vinculadas a ele, preenche o dia e assina. O lançamento vai para o apontador validar.

**Apontador.** Vê as máquinas da obra e a lista "Para validar". Pode:
- validar o que o operador mandou, conferindo e coassinando, ou devolver com o motivo;
- lançar por conta própria e mandar para o operador confirmar no app dele;
- lançar sem a assinatura do operador, com justificativa (ex: operador do fornecedor sem o app).

Cada um assina só o próprio campo. Quando as assinaturas estão completas, o app do apontador grava na `frota_rdo`.

O operador pode **contestar** um lançamento feito pelo apontador. O apontador corrige e manda de novo. Corrigir anula as assinaturas, que ficam guardadas no histórico.

Qualquer lançamento enviado pode ser impresso ou salvo em PDF (menu ⋯ ou botão 🖨️) no modelo do RDO do gestão de frota, já preenchido e assinado.

## Passo a passo para colocar no ar

### 1. Banco de dados (uma vez)
Rode `supabase-produtividade-frota.sql` no Supabase (**SQL Editor → New query → colar → Run**). Ele cria:
- a coluna `assinaturas` na `frota_rdo`;
- a tabela `frota_operador_equipamentos` (quem opera cada máquina);
- a tabela `frota_rdo_campo` (lançamentos circulando entre operador e apontador);
- as regras de acesso dessas tabelas.

Nada do que já existe é alterado ou apagado.

### 2. Gestão de frota
Substitua o `frota-gestao.html` do sistema pela versão nova. Muda duas coisas:
- **Produtividade → Cadastros** ganhou a aba **Operadores**, onde o escritório vincula operador e máquina;
- o histórico de produtividade deixou de carregar as imagens das assinaturas, para continuar leve.

### 3. Acessos
- **Apontador:** quem já tem acesso ao módulo gestão de frota entra como apontador.
- **Operador:** precisa do módulo `produtividade_campo` com perfil `operador` na `usuario_modulos`. Se o cadastro de usuários do sistema ainda não oferece esse módulo, o final do arquivo SQL mostra como liberar.

Depois, vincule cada operador às máquinas dele na aba **Operadores**.

### 4. GitHub Pages
Envie para a raiz da branch `main` do repositório `sigecon-produtividade-frota`:

```
index.html
supabase.js
sw.js
manifest.json
icone.svg
icone-180.png
icone-192.png
icone-512.png
icone-maskable-512.png
README.md   (opcional)
```

**Settings → Pages**: *Deploy from a branch*, `main`, `/ (root)`.

### 5. Instalar no celular
Abra `https://SEU-USUARIO.github.io/sigecon-produtividade-frota/`.
- **Android (Chrome):** toque em **Instalar** no aviso dentro do app.
- **iPhone (Safari):** **Compartilhar** → **Adicionar à Tela de Início**.

O primeiro acesso precisa de internet. Depois o app abre sem sinal.

## Sem internet

Dá para lançar e assinar sem sinal. Tudo fica no celular e sobe sozinho quando a internet volta. A validação pelo apontador precisa de internet, porque o app confere no sistema se o lançamento não mudou.

## Publicar uma nova versão

Ao alterar `index.html` ou os ícones, aumente a `VERSAO` em `sw.js` (ex: `fc-v3.0.0` → `fc-v3.0.1`). Os celulares mostram o aviso **Nova versão do app**.

## Outros apps no mesmo GitHub

Este app usa no celular o banco local `frota_campo`, as chaves `fc_pref` e `fc_tema` e a sessão `sb-frota-campo-auth`. Um app novo na mesma conta deve usar nomes próprios.
