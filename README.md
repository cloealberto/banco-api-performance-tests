# Testes de performance da API bancária

## Introdução

Este repositório reúne cenários automatizados para validar operações da API bancária e observar seu comportamento durante as requisições. Os testes são escritos em JavaScript e executados pelo [k6](https://k6.io/), que fornece as funcionalidades de geração de carga, verificações de resposta, métricas e relatório.

O projeto cobre o login e a criação de transferências. A URL da API é configurada pela variável de ambiente `BASE_URL`; se ela não for definida, o projeto usa o endereço configurado em `config/config.local.json`.

Repositório: [cloealberto/banco-api-performance-tests](https://github.com/cloealberto/banco-api-performance-tests)

## Tecnologias usadas

- **JavaScript**: linguagem dos cenários, helpers e utilitários.
- **k6**: runtime que executa os scripts JavaScript, envia as requisições HTTP, aplica verificações e coleta métricas.
- **JSON**: formato usado para os dados de configuração e para o payload de login.

Os arquivos JavaScript deste repositório usam módulos e APIs do k6. Portanto, os testes não são executados com Node.js nem com `npm`; é necessário instalar o executável do k6.

## Estrutura do repositório

```text
.
├── config/
│   └── config.local.json
├── fixtures/
│   └── postLogin.json
├── helpers/
│   └── autenticacao.js
├── tests/
│   ├── login.test.js
│   └── transferencias.test.js
├── utils/
│   └── variaveis.js
├── .gitignore
├── html-report.html
└── README.md
```

### Objetivo dos grupos de arquivos

- **`config/`**: configurações locais do projeto. `config.local.json` define `baseUrl` como endereço padrão quando `BASE_URL` não é informada.
- **`fixtures/`**: dados de entrada reutilizáveis nos testes. `postLogin.json` contém o payload enviado ao endpoint de login.
- **`helpers/`**: operações auxiliares compartilhadas entre cenários. `autenticacao.js` realiza o login e obtém o token usado no fluxo de transferência.
- **`tests/`**: cenários executáveis pelo k6.
  - `login.test.js` envia uma requisição `POST` para `/login` e verifica o status, a presença do token e seu tipo.
  - `transferencias.test.js` obtém um token e envia uma requisição `POST` para `/transferencias`, verificando o status da resposta.
- **`utils/`**: utilitários de configuração. `variaveis.js` centraliza a leitura de `BASE_URL` e o fallback para `config.local.json`.
- **`html-report.html`**: relatório HTML já presente no repositório. Novas exportações podem sobrescrevê-lo se o mesmo caminho for usado.

## Instalação

1. Clone o repositório:

   ```powershell
   git clone https://github.com/cloealberto/banco-api-performance-tests.git
   cd banco-api-performance-tests
   ```

2. Instale o k6 seguindo as instruções oficiais para seu sistema operacional: [Instalação do k6](https://grafana.com/docs/k6/latest/set-up/install-k6/).

3. Confirme a instalação:

   ```powershell
   k6 version
   ```

Não há dependências de Node.js para instalar. Antes de executar os testes, deixe a API bancária em execução e acessível pela máquina que executará o k6.

## Execução dos testes

Informe a URL base da API com `-e BASE_URL=...`. O valor deve conter o protocolo e o endereço do servidor, sem precisar incluir `/login` ou `/transferencias`, pois os próprios cenários acrescentam esses caminhos.

No PowerShell, execute um cenário por vez:

```powershell
k6 run -e BASE_URL=http://localhost:3000 tests\login.test.js
k6 run -e BASE_URL=http://localhost:3000 tests\transferencias.test.js
```

Se `BASE_URL` não for passada, o utilitário usa `http://localhost:3000`, conforme `config/config.local.json`.

O teste de login está configurado para uma iteração e define os seguintes limites: percentil 90 de duração abaixo de 3 segundos, duração máxima abaixo de 5 segundos e taxa de requisições com falha abaixo de 1%. O teste de transferência também está configurado para uma iteração. Esses valores representam a configuração atual dos scripts; ajuste-os conforme a carga e os critérios esperados para o ambiente.

## Acompanhamento em tempo real e exportação do relatório do k6

O dashboard web do k6 permite acompanhar as métricas durante a execução. Para habilitá-lo e exportar o relatório HTML, configure as variáveis próprias do k6 antes de iniciar o teste. No PowerShell:

```powershell
$env:K6_WEB_DASHBOARD = "true"
$env:K6_WEB_DASHBOARD_EXPORT = "html-report.html"

k6 run -e BASE_URL=http://localhost:3000 tests\login.test.js
```

Durante a execução, acesse o endereço do dashboard informado pelo k6 no terminal (por padrão, `http://localhost:5665`). Ao final do teste, o k6 grava o relatório HTML no caminho definido por `K6_WEB_DASHBOARD_EXPORT`. Para testar transferências, troque o caminho do script:

```powershell
k6 run -e BASE_URL=http://localhost:3000 tests\transferencias.test.js
```

As variáveis do dashboard continuam definidas na sessão atual do PowerShell. Para exportar um relatório com outro nome, altere `K6_WEB_DASHBOARD_EXPORT`, por exemplo:

```powershell
$env:K6_WEB_DASHBOARD_EXPORT = "relatorio-login.html"
```

No Bash (Linux/macOS), o mesmo exemplo pode ser executado em uma única linha:

```bash
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html k6 run -e BASE_URL=http://localhost:3000 tests/login.test.js
```
