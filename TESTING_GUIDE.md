# Lovable Education Platform - Test Guide

## Complete Testing Workflow

### Prerequisites
1. Ensure you have an admin account created
2. Access the admin panel at `/admin`

### Phase 1: Admin Setup (Admin Dashboard)

#### 1.1 Create Professors
1. Go to `/admin` → "Gestion des Professeurs"
2. Click "Nouveau professeur"
3. Create test professors:
   - **Dr. Sarah Martin** - sarah.martin@academy.test
     - Spécialisation: Intelligence Artificielle
     - Téléphone: +212 6XX XXX XXX
   - **Prof. Ahmed Bennani** - ahmed.bennani@academy.test
     - Spécialisation: Cybersécurité
   - **Dr. Karim El Fassi** - karim.elfassi@academy.test
     - Spécialisation: Développement Web

#### 1.2 Assign Professors to Courses
1. For each professor, click the "Assigner des cours" button
2. Assignments:
   - Dr. Sarah Martin → Intelligence Artificielle Avancée
   - Prof. Ahmed Bennani → Cybersécurité Professionnelle
   - Dr. Karim El Fassi → Développement Full Stack

#### 1.3 Create Student Accounts
1. Go to `/admin` → "Utilisateurs"
2. Create test students or approve pending registrations:
   - student1@test.com
   - student2@test.com
   - student3@test.com

### Phase 2: Professor Workflows

#### 2.1 Login as Professor
1. Logout from admin
2. Login with one of the professor credentials (check invitation email)
3. Access professor dashboard at `/professor`

#### 2.2 Course Management
1. Click "Gérer le cours" on an assigned course
2. Test each tab:

**Students Tab:**
- View enrolled students
- Add students to course
- Remove students

**Attendance Tab:**
- Mark attendance for today
- Filter by date
- Edit past attendance records

**Grades Tab:**
- Create grade entries (Devoir 1, Examen Final, etc.)
- Assign grades to students
- View grade statistics
- Export gradebook

**Announcements Tab:**
- Create urgent announcement
- Pin important announcements
- Delete old announcements
- **Check**: Students should receive notifications

**Materials Tab:**
- Upload PDF documents
- Upload presentations
- Upload code files
- Download materials

**Analytics Tab (NEW):**
- View grade distribution pie chart
- See average grades by assignment
- Monitor student performance trends
- Check attendance patterns

### Phase 3: Student Workflows

#### 3.1 Login as Student
1. Logout and login as student1@test.com
2. Access student dashboard at `/student`

#### 3.2 Course Enrollment
1. Go to "Catalogue" tab
2. Browse available courses
3. Click "S'inscrire" on 2-3 courses
4. **Check**: Enrollment should succeed

#### 3.3 My Courses
1. Go to "Mes cours" tab
2. View enrolled courses
3. Check progress percentage
4. Click "Continuer le cours"

#### 3.4 Notifications
1. Go to "Notifications" tab
2. **Check**: Should see notification for professor announcement
3. Mark notifications as read
4. Click notification to navigate to course

### Phase 4: Real-time Features

#### 4.1 Test Realtime Notifications
1. Open two browser windows:
   - Window 1: Professor logged in
   - Window 2: Student logged in
2. In Window 1 (Professor):
   - Create a new announcement
3. In Window 2 (Student):
   - Go to Notifications tab
   - **Check**: New notification appears automatically (realtime!)

#### 4.2 Test Email Notifications
1. Professor creates urgent announcement
2. **Check**: Edge function `send-announcement-email` is triggered
3. **Check**: Notifications created in database for all enrolled students

### Phase 5: Analytics & Reporting

#### 5.1 Grade Analytics
1. Login as professor
2. Go to course → Analytics tab
3. **Check**: 
   - Pie chart shows grade distribution
   - Bar chart shows grades by assignment
   - Summary cards display correct statistics

#### 5.2 Student Progress
1. Login as student
2. Go to "Mes cours"
3. **Check**: Progress bars update correctly
4. Complete some lessons
5. **Check**: Progress percentage increases

### Phase 6: Security Testing

#### 6.1 Test RLS Policies
1. Logout completely
2. Try accessing `/professor` → Should redirect to /auth
3. Try accessing `/student` → Should redirect to /auth
4. Login as student
5. Try accessing `/professor` → Should show "Access Denied"
6. Try accessing `/admin` → Should show "Access Denied"

#### 6.2 Test Data Access
1. Login as Professor 1
2. Try to access another professor's course
3. **Check**: Should only see own assigned courses

### Phase 7: Edge Functions

#### 7.1 Test Announcement Emails
1. Monitor edge function logs in Supabase dashboard
2. Create announcement as professor
3. **Check**: Function executes successfully
4. **Check**: Notifications created for all students

### Expected Results Summary

✅ **Admins can:**
- Create and manage professors
- Assign professors to courses
- Manage all users

✅ **Professors can:**
- View only assigned courses
- Manage students in their courses
- Mark attendance
- Enter grades
- Create announcements (auto-sends notifications)
- Upload materials
- View analytics

✅ **Students can:**
- Browse course catalog
- Enroll in courses
- View enrolled courses
- Receive realtime notifications
- View course materials
- Track progress

✅ **System features:**
- Realtime notifications
- Email notifications for announcements
- Interactive analytics charts
- Secure RLS policies
- Role-based access control

## Troubleshooting

### Issue: Notifications not appearing
- Check browser console for errors
- Verify realtime subscription is active
- Check RLS policies on notifications table

### Issue: Analytics not loading
- Check that grades exist in database
- Verify RPC function `get_grade_statistics` exists
- Check professor has access to course

### Issue: Email function not triggered
- Check edge function deployment
- Verify SUPABASE_SERVICE_ROLE_KEY is set
- Check function logs in Supabase dashboard

## Performance Checklist

- [ ] All images lazy load
- [ ] Analytics charts render smoothly
- [ ] Realtime updates don't cause lag
- [ ] File uploads handle large files
- [ ] Database queries are optimized
- [ ] No unnecessary re-renders

## Security Checklist

- [ ] All tables have RLS enabled
- [ ] Anonymous users blocked from sensitive data
- [ ] Professors can't access other professors' data
- [ ] Students can't access admin/professor routes
- [ ] File uploads validate file types
- [ ] SQL injection prevented
