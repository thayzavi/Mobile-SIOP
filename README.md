# 📱 SIOP
Aplicativo mobile desenvolvido com React Native para auxiliar peritos odontolegistas no gerenciamento de casos periciais odontológicos. O sistema permite registrar, visualizar e editar informações relacionadas a vítimas, evidências, e laudos periciais, otimizando o fluxo de trabalho em contextos forenses.
🔗 Repositório: [github.com/thayzavi/Mobile-SIOP](https://github.com/thayzavi/Mobile-SIOP)
---
## 📋 Funcionalidades
### 👮 Perito
* Visualizar e registrar **novos casos** e **evidências**
* Adicionar **vítimas**
* Gerar **laudos**
* Acessar o **banco de dados** de casos
* Editar informações de casos, vítimas e evidências
* Navegação por **abas**: Casos, Banco e Configurações
### 🛠️ Administrador
* Todas as funções do perito
* Gerenciar usuários (criar, visualizar e editar)
* Acesso ao **painel de controle** (Dashboard)
* Aba exclusiva de **Administração**
---
## 🧭 Estrutura de Navegação
* **Stack Navigators**:
 * `CasosStack`: gerenciamento completo de casos e evidências
 * `AdminStack`: funcionalidades administrativas
* **Bottom Tab Navigators**:
 * `PeritoTabs`: abas para peritos
 * `AdminTabs`: abas com funcionalidades adicionais para admins
* **Tela de Login** como entrada principal da aplicação

## 🚀 Tecnologias Utilizadas
* **React Native**
* **React Navigation** (`@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`)
* **React Native Paper** (UI components)
* **React Native Vector Icons** (ícones)
---
## ▶️ Como Executar
1. Clone o repositório:
  ```bash
  git clone https://github.com/thayzavi/Mobile-SIOP
  cd Mobile-SIOP
  ```
2. Instale as dependências:
  ```bash
  npm install
  ```
3. Rode o projeto:
  ```bash
  npx expo start
  ```
