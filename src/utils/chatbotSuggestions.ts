/**
 * Generate smart suggestions based on conversation context
 */

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Analyze last assistant message to generate relevant follow-up suggestions
 */
export const generateFollowUpSuggestions = (
  lastMessage: string,
  userRole: string = 'visitor'
): string[] => {
  const content = lastMessage.toLowerCase();
  const suggestions: string[] = [];

  // Detect topics and suggest related questions
  if (content.includes('formation') || content.includes('cours')) {
    suggestions.push('Quels sont les prérequis ?');
    suggestions.push('Quelle est la durée ?');
    suggestions.push('Y a-t-il un certificat ?');
  }

  if (content.includes('inscr') || content.includes('admission')) {
    suggestions.push('Documents nécessaires ?');
    suggestions.push('Dates d\'inscription');
    suggestions.push('Frais de scolarité');
  }

  if (content.includes('certif')) {
    suggestions.push('Comment l\'obtenir ?');
    suggestions.push('Est-il reconnu ?');
    suggestions.push('Validité du certificat ?');
  }

  if (content.includes('prix') || content.includes('frais') || content.includes('coût')) {
    suggestions.push('Moyens de paiement');
    suggestions.push('Réductions disponibles ?');
    suggestions.push('Paiement en plusieurs fois ?');
  }

  if (content.includes('contact') || content.includes('téléphone') || content.includes('email')) {
    suggestions.push('Prendre rendez-vous');
    suggestions.push('Horaires d\'ouverture');
    suggestions.push('Localisation');
  }

  // Role-specific suggestions
  if (userRole === 'student') {
    if (content.includes('note') || content.includes('résultat')) {
      suggestions.push('Comment améliorer ?');
      suggestions.push('Contester une note');
    }
    if (content.includes('absence')) {
      suggestions.push('Justifier une absence');
      suggestions.push('Règlement des absences');
    }
  }

  // Generic helpful suggestions if nothing specific
  if (suggestions.length === 0) {
    suggestions.push('En savoir plus');
    suggestions.push('Voir les formations');
    suggestions.push('Contacter un conseiller');
  }

  // Limit to 3 suggestions
  return suggestions.slice(0, 3);
};

/**
 * Get context-aware suggestions based on entire conversation
 */
export const getContextualSuggestions = (
  messages: Message[],
  userRole: string = 'visitor'
): string[] => {
  if (messages.length === 0) {
    return getInitialSuggestions(userRole);
  }

  const lastAssistantMessage = messages
    .filter(m => m.role === 'assistant')
    .pop();

  if (lastAssistantMessage) {
    return generateFollowUpSuggestions(lastAssistantMessage.content, userRole);
  }

  return getInitialSuggestions(userRole);
};

/**
 * Get initial suggestions when starting a conversation
 */
export const getInitialSuggestions = (userRole: string = 'visitor'): string[] => {
  const suggestions: Record<string, string[]> = {
    visitor: [
      'Quelles formations proposez-vous ?',
      'Comment puis-je m\'inscrire ?',
      'Voir le catalogue des cours'
    ],
    student: [
      'Voir mes cours',
      'Comment m\'inscrire à un cours ?',
      'Suivre ma progression'
    ],
    professor: [
      'Voir mes cours',
      'Comment créer un cours ?',
      'Où gérer les notes ?'
    ],
    admin: [
      'Comment accéder au CRM Étudiants ?',
      'Envoyer un email aux étudiants',
      'Créer un nouveau professeur'
    ]
  };

  return suggestions[userRole] || suggestions.visitor;
};

/**
 * Detect if user message indicates dissatisfaction
 */
export const detectDissatisfaction = (message: string): boolean => {
  const dissatisfactionKeywords = [
    'pas bien',
    'mauvais',
    'nul',
    'incompréhensible',
    'pas aidé',
    'pas utile',
    'insatisfait',
    'déçu',
    'problème'
  ];

  const lowerMessage = message.toLowerCase();
  return dissatisfactionKeywords.some(keyword => lowerMessage.includes(keyword));
};

/**
 * Get escalation suggestions when user is dissatisfied
 */
export const getEscalationSuggestions = (): string[] => {
  return [
    '👤 Parler à un agent humain',
    '📞 Être rappelé',
    '📧 Envoyer un email détaillé'
  ];
};
