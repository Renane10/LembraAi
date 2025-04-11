# 📲 LembraAi

App de tarefas feito com Expo + React Native. Suporte a tarefas únicas e recorrentes, com notificações locais mesmo com o app fechado.

---

## 🛠️ Stack
- Expo
- React Native
- AsyncStorage / SQLite
- React Navigation
- Expo Notifications

---

## 📅 Funcionalidades Planejadas

- [x] Criar tarefas com título, data e hora
- [ ] Notificações locais
- [ ] Recorrência: diária, semanal, mensal, anual
- [ ] Marcar tarefas como concluídas
- [ ] Configurações de notificação e tema
- [ ] Armazenamento local persistente
- [ ] Agenda com calendário (futuramente)

---

## ✅ Roadmap Técnico

### 1. Setup Inicial
- [x] `npx create-expo-app lembraai`
- [x] Instalar dependências principais
- [x] Estrutura de pastas

### 2. Navegação
- [x] React Navigation com Tabs:
  - Home (tarefas do dia)
  - Agenda
  - Criar tarefa
  - Configurações

### 3. Tarefas
- [x] Formulário de criação
- [x] Listagem de tarefas
- [x] Marcar como concluída

### 4. Recorrência
- [x] Implementar lógica de repetição:
  - diária
  - semanal (dias da semana)
  - mensal
  - anual

### 5. Notificações
- [x] Permissões
- [x] Agendamento com `expo-notifications`
- [ ] Cancelar notificação ao excluir tarefa

### 6. Configurações
- [x] Tema claro/escuro
- [ ] Toggle de notificações
---

## 🚀 Como rodar

```bash
git clone https://github.com/seu-usuario/lembrAai.git
cd lembraai
npm install
npx expo start
