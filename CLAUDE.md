# dataehora-site

Site estático (**dataehora.com.br**) com relógio de horário oficial de Brasília, feriados
brasileiros, calculadoras de datas/prazos, contagem regressiva, fusos horários, previsão do
tempo e conteúdo educativo sobre tempo e clima. Conteúdo em **pt-BR**.

## Stack

- **HTML + CSS + JavaScript puro (vanilla).** Sem framework, sem bundler, sem etapa de build.
- **Não há `package.json`** nem dependências de Node. Nada para instalar.
- Hospedagem: **GitHub Pages** (branch `main`), domínio custom via `CNAME` + `.nojekyll`.
- Apache `.htaccess` na raiz define gzip/cache/headers — **inerte no GitHub Pages**, mantido
  para portabilidade / hospedagem alternativa. Não é usado no deploy atual.

### Estrutura

- Cada ferramenta é uma pasta com `index.html` próprio (ex.: `feriados/`, `calculadora/idade/`,
  `copa-2026/`, `sobre-tempo-e-clima/<tópico>/`). ~46 páginas HTML no total.
- Assets compartilhados, referenciados por **caminho absoluto** a partir da raiz:
  - `css/styles.css` — folha de estilo única (temas via CSS custom properties).
  - `js/theme.js` — sistema de tema (também **inline no `<head>`** de cada página para evitar
    FOUC). Preferência em `localStorage['theme-pref']`: `light` | `dark` | `auto` (por hora) |
    `default` (segue o SO). Aplica `data-theme` no `<html>`.
  - `js/scripts.js` — relógio da home + sincronização com a hora oficial.
  - `js/holidays.js` — cálculo de feriados móveis (algoritmo de Computus para a Páscoa).
  - `js/cookie-consent.js` — banner de consentimento (LGPD), escolha salva em `localStorage`.
  - `js/estados-brasil.js` — lista de UFs.
- `assets/` — favicons, bandeiras, SVGs.

### APIs externas (client-side, sem backend)

- `worldtimeapi.org` — hora oficial (America/Sao_Paulo).
- `brasilapi.com.br` — feriados nacionais e municípios do IBGE.
- `api.openweathermap.org` — previsão do tempo (`appid` embutido no HTML de `previsao-do-tempo/`).
- Google Analytics 4 (`G-4Y5H59FEQE`), carregado via gtag.js em todas as páginas. **Não há
  Google AdSense nem Google Ads** — foram removidos (junto com `ads.txt`) em setembro/2026.

## Rodar localmente

Sirva a raiz do repositório com qualquer servidor estático (os assets usam caminhos absolutos
`/css/…`, `/js/…`, então abrir o arquivo direto no navegador quebra os links):

```bash
python3 -m http.server 8000
```

Depois abra <http://localhost:8000>. Alternativas: `npx serve`, `php -S localhost:8000`.

## Deploy

**`git push` para `main`** publica no GitHub Pages automaticamente (não há workflow de build).
A branch `main` **não** tem proteção; o Pages serve de `main` / raiz.

### Fluxo automático (padrão desta sessão)

Ao concluir **qualquer tarefa que tenha alterado arquivos**, o Claude executa
`scripts/auto-deploy.sh` **sem pedir confirmação**. O script faz, de ponta a ponta:

```
branch  ->  commit  ->  push  ->  gh pr create  ->  gh pr merge --squash --admin  ->  checkout main  ->  git pull
```

- É idempotente: com a working tree limpa, não faz nada.
- Passe a mensagem de commit/PR como argumento: `scripts/auto-deploy.sh "Corrige X"`.
- Rodar só ao **terminar** a tarefa (não a cada arquivo), para não publicar trabalho parcial.

### Notas

- As branches `copilot/*` são do GitHub Copilot; veja definições em `.github/agents/`.
- Após merge em `main`, se `css/styles.css`, `js/holidays.js` ou `js/scripts.js` mudaram, o
  workflow `.github/workflows/cache-bust.yml` roda, atualiza os parâmetros `?v=<hash md5>` de
  cache-busting em **todos** os `.html` e faz um commit `chore: update cache-busting hashes
  [skip ci]` de volta em `main`. Dê `git pull` depois.
- Ao adicionar uma página nova, inclua os `?v=…` nas tags de `styles.css`/`scripts.js`/
  `holidays.js` (qualquer valor; o workflow corrige) e adicione a URL em `sitemap.xml`.
