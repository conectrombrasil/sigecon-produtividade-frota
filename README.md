# Produtividade em Campo

App de celular para lançar a produtividade diária das máquinas, com assinatura do operador e do apontador. Funciona sem internet depois de aberto uma vez.

## Publicar no GitHub Pages

1. Crie um repositório (ex: `produtividade-campo`) e envie todos os arquivos desta pasta para a raiz dele.
2. No repositório, vá em **Settings → Pages**. Em *Source* escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
3. Em 1 ou 2 minutos o app fica em `https://SEU-USUARIO.github.io/produtividade-campo/`. Esse é o link que vai para os operadores.

O app precisa ser aberto por `https`. O GitHub Pages já faz isso.

## Instalar no celular

**Android (Chrome):** abra o link. Aparece o aviso "Instale o app" na tela inicial do app; toque em **Instalar**. Se não aparecer, use o menu ⋮ do Chrome → **Instalar app** (ou "Adicionar à tela inicial").

**iPhone (Safari):** abra o link no Safari, toque em **Compartilhar** → **Adicionar à Tela de Início**. Tem que ser pelo Safari.

No primeiro acesso o app pede o nome do apontador e a obra. Depois disso abre direto, com ou sem sinal.

## Cadastrar obras e máquinas

Tudo fica em `catalogo.json`. Dá pra editar direto pelo site do GitHub (ícone de lápis no arquivo):

- `obras`: `id` e `nome`.
- `fornecedores`: `id` e `razao_social`.
- `equipamentos`: `id`, `obra_id`, `fornecedor_id`, `descricao`, `prefixo` ou `placa`, `icone` (emoji) e `tipo_franquia` (`"horas"` usa horímetro, `"km"` usa odômetro). Para tirar uma máquina da lista, coloque `"ativo": false`.
- `eventos`, `atividades` (por obra) e `locais` (por obra): mesmas listas do sistema.

Mude o campo `versao` a cada alteração. Os celulares baixam o catálogo novo sempre que abrem o app com internet, ou pelo menu ⋯ → **Atualizar lista de máquinas**.

**Não mude o `id` de algo que já foi usado em lançamentos.** Os lançamentos guardam o `id`.

## Publicar uma nova versão do app

Sempre que alterar `index.html` (ou ícones), abra `sw.js` e aumente a `VERSAO` (ex: `fc-v1.0.0` → `fc-v1.0.1`). Sem isso, os celulares continuam com a versão antiga guardada. Com isso, aparece no app o aviso "Nova versão do app" com o botão **Atualizar**.

Mudanças só no `catalogo.json` não precisam disso.

## Para onde vão os lançamentos

Enquanto não houver servidor, os lançamentos ficam **guardados no celular** e saem pelo botão **Exportar** (barra amarela no topo, ou menu ⋯). Ele gera um arquivo `.json` e abre o compartilhamento do celular: WhatsApp, e-mail, Drive. O arquivo tem tudo, inclusive as assinaturas e a trilha (data, hora, GPS, aparelho e código de conferência).

Oriente os apontadores a exportar no fim de cada dia. Se o celular for perdido, formatado ou o app for desinstalado antes de exportar, os lançamentos daquele aparelho se perdem.

Quando o backend existir, coloque a URL em `CONFIG.ENDPOINT` no `index.html`. O app passa a enviar sozinho cada lançamento assinado (POST com o JSON) assim que tiver sinal, e o botão Exportar some.

## Assinatura

O operador confere o resumo do dia e assina com o dedo; o apontador assina em seguida. O app registra junto:

- data e hora (do celular, com fuso);
- localização GPS, se o celular permitir;
- identificação do aparelho;
- um código de conferência (SHA-256 do conteúdo assinado).

Se o lançamento for corrigido depois, as assinaturas são anuladas, ficam guardadas no histórico do lançamento e precisam ser colhidas de novo. Ao abrir um lançamento assinado, o app confere se o conteúdo ainda bate com o código.

Se o operador se recusar a assinar, o apontador registra o motivo e assina sozinho. O lançamento fica marcado como "Operador não assinou".

Para a assinatura valer como prova perante o fornecedor, inclua no contrato de locação uma cláusula aceitando o registro eletrônico do app como comprovação das horas.

## Arquivos

| Arquivo | Para quê |
|---|---|
| `index.html` | O app inteiro |
| `catalogo.json` | Obras, máquinas, eventos, atividades e locais |
| `sw.js` | Guarda o app no celular para abrir sem internet |
| `manifest.json` | Nome, cores e ícones para instalar na tela inicial |
| `icone*.png`, `icone.svg` | Ícones |
