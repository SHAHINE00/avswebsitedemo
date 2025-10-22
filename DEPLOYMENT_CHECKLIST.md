# Chatbot Deployment Checklist

## Pre-Deployment Verification

### 1. Database Setup
- [x] `chatbot_conversations` table exists
- [x] `chatbot_messages` table exists  
- [x] `chatbot_analytics` table exists
- [x] RLS policies are configured
- [x] All policies tested and working

### 2. Edge Functions
- [x] `ollama-chat` function exists
- [x] Function configured in `supabase/config.toml`
- [x] `verify_jwt = false` (public access)
- [x] CORS headers configured
- [x] Rate limiting implemented
- [x] Error handling for 429/402/500

### 3. Frontend Integration
- [x] AIChatbot component integrated
- [x] Full project URL used (not env variables)
- [x] Connected to `ollama-chat` endpoint
- [x] File upload functionality working
- [x] Feedback buttons integrated
- [x] "Nous sommes en ligne !" display fixed
- [x] Multi-language support (FR/AR/EN)
- [x] Mobile responsive design

### 4. External Dependencies
- [x] Ollama backend running at https://ai.avs.ma
- [x] Mistral model available
- [x] API endpoint accessible from edge function
- [x] Knowledge base table exists (if needed)

## Testing Checklist

### Basic Functionality (Critical)
- [ ] Open chatbot button visible
- [ ] Click button opens chat window
- [ ] "Nous sommes en ligne !" displays with pulsing green dot
- [ ] Send test message → AI responds
- [ ] Response appears in chat
- [ ] Conversation persists after page refresh

### File Upload (High Priority)
- [ ] Upload JPG image (< 5MB) → Success
- [ ] AI acknowledges image upload
- [ ] Upload PDF (< 5MB) → Success
- [ ] AI acknowledges PDF upload
- [ ] Upload file > 5MB → Error message
- [ ] Upload unsupported file → Error message

### Feedback System (High Priority)
- [ ] Send message from AI
- [ ] Click "Utile" (thumbs up) → Toast appears
- [ ] Click "Pas utile" (thumbs down) → Toast appears
- [ ] Check database for feedback events
- [ ] Feedback buttons disabled after submission

### Multi-Language (Medium Priority)
- [ ] Switch to Arabic → Interface updates
- [ ] Send message in Arabic → Response in Arabic
- [ ] Switch to English → Interface updates
- [ ] Send message in English → Response in English
- [ ] Switch back to French → Works

### History & Persistence (Medium Priority)
- [ ] Open history view
- [ ] See list of past conversations
- [ ] Click conversation → Loads messages
- [ ] New conversation button works
- [ ] Delete conversation works (if implemented)

### Error Handling (Medium Priority)
- [ ] Send 11 messages rapidly → Rate limit warning
- [ ] Network offline → Error message
- [ ] Invalid AI response → Graceful error
- [ ] Database error → User-friendly message

### Mobile & Accessibility (Low Priority)
- [ ] Test on mobile device
- [ ] Chatbot button visible and clickable
- [ ] Chat window properly sized
- [ ] Messages readable
- [ ] Input field works
- [ ] File upload works on mobile
- [ ] Keyboard shortcuts work (Ctrl+K, Escape)

### Admin Dashboard (Low Priority)
- [ ] Navigate to `/admin/chatbot`
- [ ] Analytics display correctly
- [ ] Export conversations works
- [ ] Statistics match database
- [ ] Recent conversations visible

## Performance Checks

### Speed
- [ ] Page load < 3 seconds
- [ ] Chatbot opens < 1 second
- [ ] AI response < 5 seconds
- [ ] File upload < 2 seconds
- [ ] History loads < 2 seconds

### Database
- [ ] Query for messages < 500ms
- [ ] Query for conversations < 500ms
- [ ] Insert message < 200ms
- [ ] Insert analytics < 200ms

### Edge Function
- [ ] Cold start < 2 seconds
- [ ] Warm request < 1 second
- [ ] Ollama response < 5 seconds
- [ ] Streaming works (if implemented)

## Security Verification

### Authentication
- [ ] Anonymous users can use chatbot
- [ ] Logged-in users see personalized responses
- [ ] Admin users have full access
- [ ] Users can only see their own data

### Input Validation
- [ ] XSS protection working
- [ ] SQL injection prevented
- [ ] File size limits enforced
- [ ] File type validation working
- [ ] Message length limits enforced

### Rate Limiting
- [ ] 10 requests/minute limit enforced
- [ ] Rate limit indicator shows
- [ ] Error message appropriate
- [ ] Rate limit resets after 1 minute

## Production Settings

### Environment Variables
- [ ] `VITE_SUPABASE_URL` set correctly
- [ ] `VITE_SUPABASE_ANON_KEY` set correctly
- [ ] Ollama endpoint accessible

### Edge Function Config
```toml
[functions.ollama-chat]
verify_jwt = false
```

### Database Indexes
- [ ] `chatbot_messages.conversation_id` indexed
- [ ] `chatbot_conversations.user_id` indexed
- [ ] `chatbot_analytics.conversation_id` indexed
- [ ] `chatbot_messages.created_at` indexed

## Monitoring Setup

### Logs to Monitor
1. **Edge Function Logs**
   - Location: https://supabase.com/dashboard/project/nkkalmyhxtuisjdjmdew/functions/ollama-chat/logs
   - Watch for: 429 errors, 500 errors, slow responses

2. **Database Queries**
   - Location: Supabase Dashboard → Database → Logs
   - Watch for: Slow queries, failed inserts, RLS violations

3. **Analytics Events**
   ```sql
   SELECT event_type, COUNT(*) as count 
   FROM chatbot_analytics 
   WHERE created_at > NOW() - INTERVAL '24 hours'
   GROUP BY event_type;
   ```

### Alerts to Set Up
- [ ] 429 rate limit errors > 10/hour
- [ ] 500 server errors > 5/hour
- [ ] Average response time > 10 seconds
- [ ] Database connection failures
- [ ] Ollama backend unavailable

## Post-Deployment

### Immediate (First 24 Hours)
- [ ] Monitor edge function logs
- [ ] Check for user-reported issues
- [ ] Verify analytics are tracking
- [ ] Test with real users
- [ ] Document any bugs found

### First Week
- [ ] Analyze usage patterns
- [ ] Review most common queries
- [ ] Check conversation completion rate
- [ ] Measure response accuracy
- [ ] Gather user feedback

### Ongoing
- [ ] Weekly analytics review
- [ ] Monthly performance optimization
- [ ] Quarterly feature updates
- [ ] Regular security audits

## Rollback Plan

If critical issues occur:

1. **Disable Chatbot** (Emergency)
   ```typescript
   // In AIChatbot.tsx, return null at top
   if (true) return null;
   ```

2. **Switch to Simple Chat** (Fallback)
   - Update endpoint to use `/chat` instead of `/ollama-chat`
   - Deploy Lovable AI version
   - Add LOVABLE_API_KEY secret

3. **Full Rollback** (Last Resort)
   - Revert to previous Git commit
   - Restore database backup if needed
   - Notify users of maintenance

## Success Criteria

✅ **Minimum Viable Product**
- Chatbot visible and accessible
- Basic conversation works
- Messages persist
- No critical errors

✅ **Production Ready**
- All high-priority tests pass
- Performance meets targets
- Security verified
- Monitoring in place

✅ **User Ready**
- Documentation complete
- User guide available
- Support process defined
- Feedback mechanism working

## Sign-Off

- [ ] Developer tested all functionality
- [ ] QA verified critical paths
- [ ] Product owner approved
- [ ] Security review completed
- [ ] Monitoring configured
- [ ] Documentation updated
- [ ] Stakeholders notified

**Deployment Date**: _________________
**Deployed By**: _________________
**Approved By**: _________________
