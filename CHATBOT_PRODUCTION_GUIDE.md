# 🤖 AI Chatbot Production Deployment Guide

## ✅ Production Status: READY FOR DEPLOYMENT

Your AI chatbot is production-ready with comprehensive monitoring and error handling.

---

## 🏗️ Architecture Overview

### Backend: Ollama Edge Function
- **Endpoint**: `supabase/functions/ollama-chat/index.ts`
- **AI Gateway**: https://ai.avs.ma/api/chat
- **Model**: Mistral (via self-hosted Ollama)
- **Deployment**: Auto-deployed with Supabase Edge Functions

### Frontend: React Component
- **Component**: `src/components/chatbot/AIChatbot.tsx`
- **Features**: Multi-language, role-based, file upload, persistence

### Database Tables
- `chatbot_conversations` - Conversation sessions
- `chatbot_messages` - Message history
- `chatbot_analytics` - Events and performance metrics
- `knowledge_base` - Context for AI responses

---

## 🚀 Pre-Deployment Checklist

### 1. Environment Configuration
- [x] Supabase URL configured
- [x] Supabase Anon Key configured
- [x] Ollama gateway accessible at https://ai.avs.ma/api/chat
- [x] Edge function `ollama-chat` deployed

### 2. Database Setup
- [x] All tables created with proper schema
- [x] RLS policies enabled and tested
- [x] Knowledge base populated
- [x] Analytics table ready

### 3. Production Features
- [x] Error monitoring with request IDs
- [x] Performance tracking (response times)
- [x] Rate limiting (10 req/min per user)
- [x] Off-topic query filtering
- [x] Role-based access control
- [x] XSS protection (input sanitization)
- [x] CORS headers configured

### 4. Monitoring & Logging
- [x] Comprehensive logging in edge function
- [x] Error tracking in `chatbot_analytics`
- [x] Performance metrics logged
- [x] Request ID tracking for debugging

---

## 📊 Production Monitoring

### Edge Function Logs
View real-time logs in Supabase Dashboard:
```
https://supabase.com/dashboard/project/nkkalmyhxtuisjdjmdew/functions/ollama-chat/logs
```

### Analytics Queries

**Total Conversations**:
```sql
SELECT COUNT(*) FROM chatbot_conversations;
```

**Messages Per Day**:
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as message_count
FROM chatbot_messages
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

**Error Rate**:
```sql
SELECT 
  event_type,
  COUNT(*) as count
FROM chatbot_analytics
WHERE event_type IN ('error', 'connection_error', 'critical_error')
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY event_type;
```

**Average Response Time**:
```sql
SELECT 
  AVG((event_data->>'response_time_ms')::int) as avg_response_ms
FROM chatbot_analytics
WHERE event_type = 'response_completed'
  AND created_at > NOW() - INTERVAL '24 hours';
```

**Popular Topics** (from knowledge base hits):
```sql
SELECT 
  title,
  COUNT(*) as hits
FROM knowledge_base
WHERE last_accessed > NOW() - INTERVAL '7 days'
GROUP BY title
ORDER BY hits DESC
LIMIT 10;
```

---

## 🎯 Performance Benchmarks

### Target Metrics
- **Response Time**: < 3 seconds (Ollama inference)
- **Uptime**: 99.5%+
- **Error Rate**: < 2%
- **Rate Limit Hit Rate**: < 5% of requests

### Current Performance Indicators
All logs include timing metrics:
- `[requestId] 🚀 Chat request started`
- `[requestId] ✅ Ollama responded in XXXms`
- `[requestId] ✅ Complete response in XXXms`

---

## 🔐 Security Features

### Input Validation
- HTML tag stripping
- 1000 character limit per message
- XSS protection via sanitization

### Rate Limiting
- 10 requests per minute per user
- Tracked by user ID or IP address
- Returns 429 status when exceeded

### Access Control
- RLS policies on all tables
- Anonymous users can use chatbot
- Authenticated users get personalized responses
- Role-based system prompts

### Off-Topic Filtering
Pre-filters queries about:
- Travel, hotels, restaurants
- Weather, news, sports
- Health, cooking, entertainment
- Shopping, general services

Returns polite redirect to AVS.ma educational topics.

---

## 🐛 Troubleshooting

### Issue: Chatbot not responding
**Check**:
1. Edge function logs for errors
2. Ollama gateway status: `curl https://ai.avs.ma/api/chat`
3. Network request in browser DevTools

**Common causes**:
- Ollama gateway offline
- Rate limit exceeded
- Invalid conversation ID

### Issue: Slow responses
**Check**:
1. Edge function logs for timing metrics
2. Ollama model performance
3. Knowledge base query performance

**Solutions**:
- Reduce knowledge base results limit
- Optimize system prompt length
- Check Ollama server resources

### Issue: Messages not saving
**Check**:
1. Browser console for errors
2. RLS policies in Supabase
3. `chatbot_messages` table permissions

**Solutions**:
- Verify conversation ID is valid
- Check RLS SELECT/INSERT policies
- Ensure user is authenticated if required

---

## 📈 Admin Dashboard

Access chatbot analytics at:
```
/admin/chatbot
```

**Features**:
- Real-time conversation monitoring
- User feedback analysis
- Performance metrics
- Error logs
- Popular queries

---

## 🔄 Deployment Process

### Automatic Deployment
Edge functions are auto-deployed when you push changes. No manual deployment needed.

### Manual Verification
After deployment, test:
1. Open chatbot on website
2. Send test message
3. Check response appears
4. Verify message saved in database
5. Check edge function logs

### Rollback Plan
If issues occur:
1. Check edge function logs for errors
2. Revert edge function code via Supabase dashboard
3. Redeploy previous working version

---

## 🎯 Success Metrics

### Week 1 Targets
- [ ] 50+ conversations created
- [ ] < 5% error rate
- [ ] < 3s average response time
- [ ] > 80% positive feedback rate

### Month 1 Targets
- [ ] 500+ conversations
- [ ] < 2% error rate
- [ ] > 90% user satisfaction
- [ ] Knowledge base expanded with real queries

---

## 📞 Support

### Monitoring
- **Edge Function Logs**: Supabase Dashboard
- **Analytics**: `/admin/chatbot` dashboard
- **Database**: Direct Supabase queries

### Emergency Contacts
If critical issues arise:
1. Check logs immediately
2. Review `chatbot_analytics` for patterns
3. Verify Ollama gateway health
4. Contact DevOps for infrastructure issues

---

## ✨ Production Ready Confirmation

✅ **Backend**: Ollama edge function with monitoring  
✅ **Frontend**: React chatbot with error handling  
✅ **Database**: RLS policies and analytics  
✅ **Monitoring**: Comprehensive logging and metrics  
✅ **Security**: Rate limiting, input validation, access control  
✅ **Performance**: Optimized queries and caching  

**Status**: 🟢 **READY FOR PRODUCTION DEPLOYMENT**

Deploy with confidence! 🚀
