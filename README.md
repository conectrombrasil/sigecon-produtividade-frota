# Vistoria de Equipamentos (sigecon-vistoria-equipamentos)

App de celular para a vistoria fotográfica de **mobilização** e **desmobilização** de máquinas, veículos e equipamentos. Usa o mesmo Supabase do SIGECON: mesmos usuários, obras, fornecedores e equipamentos. Funciona sem internet: a vistoria fica no celular e sobe quando o sinal voltar.

## Quem entra no app
Mesma regra do apontador no app Produtividade da Frota:
- administrador do SIGECON;
- quem tem o módulo gestão de frota com perfil **gestor** ou **operador**.

Operador de máquina (cadastrado na aba Operadores) e visualizador **não** entram.

## Passo a passo para colocar no ar

### 1. Banco de dados
Rodar no Supabase (**SQL Editor → New query → colar → Run**), nesta ordem:
1. SQL da tabela `frota_vistorias` e do espaço de fotos `frota-vistorias`;
2. SQL das três funções de acesso (`vist_pode_ver`, `vist_pode_vistoriar`, `vist_eh_gestor`).

### 2. Gestão de frota
Substituir o `frota-gestao.html` do sistema pela versão nova: a ficha do equipamento passa a mostrar as vistorias e o relatório.

### 3. Recuperação de senha
Adicionar o endereço do app uma vez no Supabase: **Authentication → URL Configuration → Redirect URLs** → `https://SEU-USUARIO.github.io/sigecon-vistoria-equipamentos/`.

### 4. GitHub Pages
Criar o repositório `sigecon-vistoria-equipamentos` e enviar para a raiz da branch `main`:

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
Abrir `https://SEU-USUARIO.github.io/sigecon-vistoria-equipamentos/` e tocar em **Instalar** no aviso do app (Android) ou **Compartilhar → Adicionar à Tela de Início** (iPhone).

### 6. Publicar uma versão nova
A cada atualização, mudar o número de `CACHE` no `sw.js` (ex.: `vistoria-equip-v2`), para os celulares perceberem a atualização.
