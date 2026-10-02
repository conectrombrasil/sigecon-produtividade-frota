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

### 1. Banco de dados
Os blocos de SQL foram passados separados, na ordem de execução, no Supabase (**SQL Editor → New query → colar → Run**).

### 2. Gestão de frota
Substitua o `frota-gestao.html` do sistema pela versão nova. Em **Produtividade → Cadastros → Operadores** o pessoal da obra:
- cadastra o operador de máquina (nome, e-mail, matrícula e senha inicial);
- vincula o operador às máquinas dele;
- desativa quem saiu (ele deixa de conseguir entrar no app).

O histórico de produtividade deixou de carregar as imagens das assinaturas, para continuar leve.

### 3. Quem entra no app
- **Operador de máquina:** só quem foi cadastrado na aba Operadores. Ele **não** é usuário do SIGECON: não aparece na lista de usuários do sistema e o login do SIGECON não o deixa entrar.
- **Apontador:** administrador do SIGECON, ou quem tem o módulo gestão de frota com perfil gestor ou operador (perfis do SIGECON). Visualizador não entra.

### 3.1 Recuperação de senha
O app tem "Esqueci minha senha". Para o link do e-mail abrir o app (e não o SIGECON), adicione o endereço do app no Supabase uma vez: **Authentication → URL Configuration → Redirect URLs** → `https://SEU-USUARIO.github.io/sigecon-produtividade-frota/`.

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

Ao alterar `index.html` ou os ícones, aumente a `VERSAO` em `sw.js` (ex: `fc-v3.7.0` → `fc-v3.1.1`). Os celulares mostram o aviso **Nova versão do app**.

## Outros apps no mesmo GitHub

Este app usa no celular o banco local `frota_campo`, as chaves `fc_pref` e `fc_tema` e a sessão `sb-frota-campo-auth`. Um app novo na mesma conta deve usar nomes próprios.
