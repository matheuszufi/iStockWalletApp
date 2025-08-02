# Configuração do Firebase para Portfolio

## Passos para configurar o Firebase Firestore:

### 1. Acesse o Firebase Console
- Vá para https://console.firebase.google.com/
- Selecione seu projeto `istockwalletapp-fd2ac`

### 2. Configure o Firestore Database
- No menu lateral, clique em "Firestore Database"
- Se ainda não foi criado, clique em "Criar banco de dados"
- Escolha "Iniciar no modo de teste" para desenvolvimento
- Selecione a localização (recomendado: `southamerica-east1` para Brasil)

### 3. Configure as Regras de Segurança
- Na aba "Regras" do Firestore, cole o seguinte código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para a coleção de portfolios
    match /portfolios/{portfolioId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Regras para dados de usuários
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Ativar Authentication
- No menu lateral, clique em "Authentication"
- Na aba "Sign-in method", ative:
  - Email/Password
  - Google (opcional)

### 5. Configurar API Externa (BRAPI)
- Para obter cotações em tempo real, você pode:
  - Usar a API gratuita (com limitações): https://brapi.dev
  - Ou registrar-se para obter uma chave de API
  - Atualizar o arquivo `src/utils/portfolioUtils.js` linha 7 com sua chave

### 6. Estrutura das Coleções no Firestore

#### Coleção: `portfolios`
Cada documento representa um ativo na carteira de um usuário:
```javascript
{
  userId: "string",           // ID do usuário
  symbol: "string",           // Símbolo do ativo (PETR4, VALE3, etc)
  name: "string",             // Nome do ativo
  quantity: number,           // Quantidade de cotas/ações
  purchasePrice: number,      // Preço médio de compra
  totalValue: number,         // Valor total investido
  type: "string",             // Tipo: stock, fii, crypto, currency
  date: "string",             // Data de adição
  createdAt: timestamp        // Timestamp do Firebase
}
```

## Testando o Sistema

1. **Executar o projeto:**
   ```bash
   npm start
   ```

2. **Acessar as páginas:**
   - Home: http://localhost:3000/
   - Login: http://localhost:3000/sign-in
   - Dashboard: http://localhost:3000/dashboard (após login)
   - Carteira: http://localhost:3000/wallet (após login)

3. **Funcionalidades disponíveis:**
   - ✅ Registro e login de usuários
   - ✅ Adicionar ativos à carteira
   - ✅ Visualizar portfolio com preços atualizados
   - ✅ Calcular ganhos/perdas em tempo real
   - ✅ Remover ativos da carteira
   - ✅ Dashboard com resumo dos investimentos

## Próximos Passos

1. **Melhorias sugeridas:**
   - Edição de ativos existentes
   - Gráficos de performance
   - Histórico de transações
   - Alertas de preço
   - Exportação de dados

2. **Otimizações:**
   - Cache de preços para reduzir chamadas de API
   - Atualização automática a cada X minutos
   - Notificações push

## Problemas Comuns

1. **Erro de autenticação:** Verifique se o Authentication está ativado
2. **Dados não salvam:** Verifique as regras do Firestore
3. **Preços não atualizam:** Verifique a conexão com a API BRAPI
4. **Página branca:** Verifique o console para erros de JavaScript

## Suporte

Para dúvidas ou problemas, verifique:
- Console do navegador (F12) para erros
- Console do Firebase para logs
- Documentação do Firebase: https://firebase.google.com/docs
