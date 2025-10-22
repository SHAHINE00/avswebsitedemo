# 🔌 Guide d'Intégration du Chatbot AVS

## Intégration Rapide (5 minutes)

Le chatbot est **déjà intégré** dans votre application ! Il apparaît automatiquement sur toutes les pages.

### Vérification

```tsx
// Le chatbot est déjà ajouté dans src/App.tsx
import AIChatbot from "@/components/chatbot/AIChatbot";

// Dans le render:
<AIChatbot />
```

---

## Personnalisation

### 1. Modifier les Réponses Rapides

**Fichier**: `src/components/chatbot/AIChatbot.tsx`

```tsx
const getQuickReplies = () => {
  const role = getDisplayRole();
  const quickReplies = {
    visitor: [
      "📚 Vos formations",        // Personnalisez ici
      "💰 Tarifs",
      "📝 S'inscrire",
      // Ajoutez vos propres quick replies
    ],
    // ... autres rôles
  };
  return quickReplies[role] || quickReplies.visitor;
};
```

---

### 2. Personnaliser l'Apparence

**Couleurs** (`src/index.css`):
```css
:root {
  --chatbot-primary: hsl(217, 91%, 60%);
  --chatbot-secondary: hsl(263, 70%, 50%);
  /* Modifiez selon votre charte graphique */
}
```

**Taille et Position**:
```tsx
// Dans AIChatbot.tsx, modifier les classes:
<div className="fixed bottom-24 right-4 w-[450px] h-[650px]">
  {/* Ajustez w- et h- selon vos besoins */}
</div>
```

---

### 3. Modifier le Prompt Système

**Fichier**: `supabase/functions/chat/index.ts`

```typescript
function getSystemPrompt(language: string): string {
  const prompts = {
    fr: `Tu es un assistant virtuel pour [VOTRE ENTREPRISE].
    Tu réponds en français de manière [VOTRE TON: professionnelle/décontractée].
    
    INFORMATIONS DE CONTACT:
    - Téléphone: [VOTRE NUMÉRO]
    - Email: [VOTRE EMAIL]
    - Adresse: [VOTRE ADRESSE]
    
    Tu peux aider avec:
    - [VOS SERVICES]
    - [VOS PRODUITS]
    - [VOS OFFRES]`,
    // ... autres langues
  };
  return prompts[language] || prompts.fr;
}
```

**Déploiement**: Le code sera automatiquement déployé.

---

### 4. Ajouter des Langues Supplémentaires

**Fichier**: `src/hooks/useChatbotLanguage.ts`

```typescript
const translations: Record<SupportedLanguage, LanguageStrings> = {
  fr: { /* ... */ },
  ar: { /* ... */ },
  en: { /* ... */ },
  es: {  // Ajoutez votre langue
    welcome: "¡Hola! ¿Cómo puedo ayudarte?",
    placeholder: "Escribe tu pregunta...",
    // ... autres traductions
  }
};
```

**Edge Function**: Ajoutez le prompt système dans `chat/index.ts`:
```typescript
const prompts = {
  // ... langues existantes
  es: `Eres un asistente virtual...`
};
```

---

## Intégration avec d'Autres Systèmes

### 1. Intégration CRM

**Enregistrer les conversations dans votre CRM**:

```typescript
// Dans useChatbotPersistence.ts
const saveMessage = async (conversationId: string, message: Message) => {
  // Sauvegarde Supabase (existant)
  await supabase.from('chatbot_messages').insert({...});
  
  // Envoi vers votre CRM
  await fetch('https://votre-crm.com/api/conversations', {
    method: 'POST',
    body: JSON.stringify({
      conversation_id: conversationId,
      message: message.content,
      timestamp: message.timestamp
    })
  });
};
```

---

### 2. Intégration Email

**Envoyer transcriptions par email**:

```typescript
// Créer un endpoint pour envoyer email
const sendConversationByEmail = async (conversationId: string, email: string) => {
  const messages = await loadMessages(conversationId);
  
  await supabase.functions.invoke('send-email', {
    body: {
      to: email,
      subject: 'Transcription de votre conversation',
      html: formatConversationHTML(messages)
    }
  });
};
```

---

### 3. Intégration Analytics

**Google Analytics personnalisé**:

```typescript
// Dans useChatbotAnalytics.ts
const trackChatbotEvent = async (data: ChatbotAnalyticsData) => {
  // Tracking existant
  trackEvent({...});
  
  // Votre analytics custom
  if (window.yourAnalytics) {
    window.yourAnalytics.track(data.event_type, data.event_data);
  }
};
```

---

### 4. Intégration Webhooks

**Notifier un système externe**:

```typescript
// Créer edge function: supabase/functions/chatbot-webhook
export const notifyExternalSystem = async (conversationId: string, event: string) => {
  await fetch(Deno.env.get('WEBHOOK_URL'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversation_id: conversationId,
      event,
      timestamp: new Date().toISOString()
    })
  });
};
```

---

## Configuration Avancée

### 1. Limiter l'Accès

**Par rôle**:
```tsx
// Dans AIChatbot.tsx
const AIChatbot = () => {
  const { isAdmin, isProfessor } = useAuth();
  
  // N'afficher que pour certains rôles
  if (!isAdmin && !isProfessor) {
    return null;
  }
  
  // ... reste du composant
};
```

**Par page**:
```tsx
// Dans App.tsx
<Routes>
  <Route path="/support" element={
    <>
      <SupportPage />
      <AIChatbot />  {/* Uniquement sur /support */}
    </>
  } />
</Routes>
```

---

### 2. Mode Offline

**Ajouter support offline**:

```typescript
// Dans useChatbotPersistence.ts
const saveMessageLocally = (message: Message) => {
  const stored = localStorage.getItem('offline_messages') || '[]';
  const messages = JSON.parse(stored);
  messages.push(message);
  localStorage.setItem('offline_messages', JSON.stringify(messages));
};

// Synchroniser quand online
window.addEventListener('online', async () => {
  const offlineMessages = JSON.parse(
    localStorage.getItem('offline_messages') || '[]'
  );
  
  for (const msg of offlineMessages) {
    await saveMessage(msg.conversation_id, msg);
  }
  
  localStorage.removeItem('offline_messages');
});
```

---

### 3. Multi-tenant

**Support de plusieurs organisations**:

```typescript
// Ajouter organization_id dans les tables
ALTER TABLE chatbot_conversations 
ADD COLUMN organization_id UUID REFERENCES organizations(id);

// Filtrer par organisation
const loadConversations = async (orgId: string) => {
  const { data } = await supabase
    .from('chatbot_conversations')
    .select('*')
    .eq('organization_id', orgId);
  return data;
};
```

---

### 4. Personnalisation par Utilisateur

**Paramètres utilisateur**:

```typescript
// Créer table user_chatbot_settings
interface ChatbotSettings {
  user_id: string;
  language: string;
  sound_enabled: boolean;
  font_size: number;
  theme: 'light' | 'dark';
}

// Charger et appliquer
const loadUserSettings = async () => {
  const { data } = await supabase
    .from('user_chatbot_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
  if (data) {
    changeLanguage(data.language);
    setSoundEnabled(data.sound_enabled);
    // ... autres paramètres
  }
};
```

---

## API pour Développeurs

### Endpoints Disponibles

**1. Envoyer un message**:
```typescript
POST /functions/v1/chat
Body: {
  messages: [
    { role: 'user', content: 'Hello' }
  ],
  language: 'fr',
  conversationId: 'uuid'
}
```

**2. Récupérer conversations**:
```typescript
const { data } = await supabase
  .from('chatbot_conversations')
  .select('*')
  .eq('user_id', userId);
```

**3. Récupérer messages**:
```typescript
const { data } = await supabase
  .from('chatbot_messages')
  .select('*')
  .eq('conversation_id', conversationId)
  .order('created_at');
```

**4. Analytics**:
```typescript
const { data } = await supabase
  .from('chatbot_analytics')
  .select('*')
  .eq('event_type', 'message_sent')
  .gte('created_at', '2025-01-01');
```

---

## Intégration Externe

### Widget Embeddable

**Créer un widget pour sites externes**:

```html
<!-- Sur votre site externe -->
<script src="https://votre-site.com/chatbot-widget.js"></script>
<script>
  AVSChatbot.init({
    apiKey: 'YOUR_API_KEY',
    language: 'fr',
    position: 'bottom-right',
    theme: 'light'
  });
</script>
```

**Fichier `chatbot-widget.js`**:
```javascript
(function() {
  window.AVSChatbot = {
    init: function(config) {
      // Créer iframe avec votre chatbot
      const iframe = document.createElement('iframe');
      iframe.src = `https://avs.ma/chatbot-widget?lang=${config.language}`;
      iframe.style.cssText = 'position:fixed;bottom:20px;right:20px;...';
      document.body.appendChild(iframe);
    }
  };
})();
```

---

## Exemples d'Utilisation

### 1. Chatbot E-commerce

```typescript
// Ajouter informations produit au contexte
const enrichMessage = (message: string, productContext: any) => {
  return `${message}\n\nContext produit: ${JSON.stringify(productContext)}`;
};

// Intégrer panier
const addToCartFromChat = async (productId: string) => {
  await addToCart(productId);
  return "✅ Produit ajouté au panier !";
};
```

---

### 2. Chatbot Support Technique

```typescript
// Créer ticket automatiquement
const createSupportTicket = async (conversation: any) => {
  const { data } = await supabase
    .from('support_tickets')
    .insert({
      conversation_id: conversation.id,
      priority: 'high',
      status: 'open',
      messages: conversation.messages
    });
  return data;
};
```

---

### 3. Chatbot Réservation

```typescript
// Intégration calendrier
const checkAvailability = async (date: string, time: string) => {
  const available = await supabase
    .from('appointments')
    .select('*')
    .eq('date', date)
    .eq('time', time)
    .is('booked', false);
    
  return available.length > 0;
};
```

---

## Troubleshooting

### Problème: Chatbot ne s'affiche pas

**Solutions**:
1. Vérifier que `<AIChatbot />` est bien dans App.tsx
2. Vérifier z-index CSS
3. Vérifier console pour erreurs

---

### Problème: Messages ne se sauvegardent pas

**Solutions**:
1. Vérifier RLS policies
2. Vérifier auth user
3. Vérifier connexion Supabase
4. Checker logs: `supabase functions logs chat`

---

### Problème: AI ne répond pas

**Solutions**:
1. Vérifier LOVABLE_API_KEY configurée
2. Vérifier crédits disponibles
3. Checker logs edge function
4. Tester endpoint directement

---

## Support

- 📧 Email: dev@avs.ma
- 💬 Discord: [Lien vers Discord]
- 📚 Documentation: https://docs.avs.ma/chatbot
- 🐛 Issues: https://github.com/avs/chatbot/issues

---

**Dernière mise à jour**: 2025
**Version**: 2.0.0
