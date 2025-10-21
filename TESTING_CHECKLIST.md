# Class Management Testing Checklist ✅

## Overview
This document provides a comprehensive checklist for testing all 4 implemented class management features.

---

## ✅ Prerequisites
- [x] Database populated with test data (sessions, schedules, attendance, grades)
- [ ] Logged in as admin user
- [ ] Navigate to `/admin` page
- [ ] At least one active class with enrolled students

---

## 🎯 Feature 1: Enhanced Table Columns

### Room Column
- [ ] **Column Header**: "Salle" appears in table header
- [ ] **Display Logic**:
  - [ ] Shows room location (e.g., "Salle A-101") when schedule exists
  - [ ] Shows "—" when no schedule/room assigned
  - [ ] Skeleton loader appears while fetching
- [ ] **Data Source**: Fetched from `class_schedules` table

### Sessions Column  
- [ ] **Column Header**: "Sessions" appears in table header
- [ ] **Display Format**: Shows "X/Y" badge (completed/total)
  - [ ] Example: "5/10" means 5 completed out of 10 total sessions
  - [ ] Badge has outline variant
- [ ] **Calculation**: Active sessions + upcoming sessions
- [ ] **Skeleton loader** appears while fetching

### Attendance Column
- [ ] **Column Header**: "Présence" appears in table header  
- [ ] **Color Coding**:
  - [ ] ✅ Green badge when attendance ≥ 85%
  - [ ] ⚠️ Yellow badge when attendance 70-84%
  - [ ] ❌ Red badge when attendance < 70%
- [ ] **Format**: Percentage with % symbol (e.g., "92%")
- [ ] **Calculation**: (present + late) / total attendance records
- [ ] **Skeleton loader** appears while fetching

### Visual Verification
- [ ] All columns align properly in header and body
- [ ] Text is readable in both light and dark mode
- [ ] Responsive design works on mobile (columns stack/scroll)

---

## 🎯 Feature 2: Quick View Panel

### Opening Panel
- [ ] Click **eye icon** (👁️) in actions column
- [ ] Panel **slides in from right** with smooth animation
- [ ] Panel **overlays** the page content
- [ ] **Close button (X)** appears in top-right corner
- [ ] **Backdrop** click closes the panel
- [ ] **ESC key** closes the panel (optional)

### Header Section
- [ ] **Class Name**: Displayed prominently (e.g., "Intelligence Artificielle - Groupe A")
- [ ] **Course Name**: Displayed below class name in muted text
- [ ] **Class Code**: Displayed as badge (e.g., "IA-2025-A")
- [ ] **Close Button**: X icon in top-right, clickable

### Stats Grid (4 Cards)
- [ ] **Card 1 - Total Students**:
  - [ ] Icon: Users icon
  - [ ] Number: Shows total enrolled students
  - [ ] Format: Large number with small label
- [ ] **Card 2 - Attendance Rate**:
  - [ ] Icon: CheckCircle2 icon
  - [ ] Percentage: Average attendance rate
  - [ ] Color matches table badge color
- [ ] **Card 3 - Average Grade**:
  - [ ] Icon: TrendingUp icon
  - [ ] Percentage: Average grade across all students
  - [ ] Shows "—" if no grades yet
- [ ] **Card 4 - Active Sessions**:
  - [ ] Icon: Calendar icon
  - [ ] Number: Count of completed + scheduled sessions
  - [ ] Format: "X sessions"

### Top Students Section
- [ ] **Section Title**: "Meilleurs Étudiants" with Users icon
- [ ] **Display Rules**:
  - [ ] Shows top 5 students ranked by attendance rate
  - [ ] If < 5 students, shows all available
  - [ ] If no students: "Aucun étudiant inscrit"
- [ ] **Student Card** (for each student):
  - [ ] Numbered badge (1-5) on left
  - [ ] Avatar with first letter of name
  - [ ] Student name (or email if no name)
  - [ ] Attendance percentage below name
  - [ ] Average grade on right (if grades exist)
  - [ ] Hover effect (background changes)

### Upcoming Sessions Section
- [ ] **Section Title**: "Prochaines Sessions" with Calendar icon
- [ ] **Display Rules**:
  - [ ] Shows next 3 upcoming sessions
  - [ ] Sorted by date (earliest first)
  - [ ] If no upcoming sessions: "Aucune session à venir"
- [ ] **Session Card** (for each session):
  - [ ] **Date**: French format (e.g., "lundi 23 octobre 2025")
  - [ ] **Time Range**: "HH:MM - HH:MM" format
  - [ ] **Room**: With 📍 emoji + room name
  - [ ] **Status Badge**: Color-coded by status
  - [ ] Border and card background styling

### Quick Actions
- [ ] **Edit Button**:
  - [ ] Icon: Edit (✏️)
  - [ ] Label: "Modifier la classe"
  - [ ] Click opens edit dialog
  - [ ] Full width with left-aligned content
- [ ] **Assign Students Button**:
  - [ ] Icon: UserPlus (👥+)
  - [ ] Label: "Assigner des étudiants"
  - [ ] Click opens assign students dialog
  - [ ] Outline variant
- [ ] **View Details Button**:
  - [ ] Icon: ExternalLink (↗️)
  - [ ] Label: "Voir tous les détails"
  - [ ] Click navigates to `/admin/classes/:classId`
  - [ ] Default (primary) variant
  - [ ] Panel closes after navigation

### Responsive Behavior
- [ ] **Desktop** (>768px): Panel is ~500px wide, slides from right
- [ ] **Mobile** (<768px): Panel is full screen width
- [ ] **Loading States**: Skeleton loaders for stats, students, sessions
- [ ] **Z-Index**: Panel appears above all other content

---

## 🎯 Feature 3: Expandable Table Rows

### Expansion Toggle
- [ ] **Chevron Button** appears in row
  - [ ] Points **down** (⬇️) when collapsed
  - [ ] Points **up** (⬆️) when expanded
- [ ] **Click Behavior**:
  - [ ] First click: Expands row
  - [ ] Second click: Collapses row
  - [ ] Clicking different row: Collapses previous, expands new one
  - [ ] **Only one row expanded at a time**

### Expanded Row Content

#### Layout
- [ ] **Full-width cell** spanning all columns
- [ ] **Background color**: Muted/subtle (distinct from table rows)
- [ ] **Padding**: Consistent spacing inside
- [ ] **Smooth animation**: Slides down/up on toggle
- [ ] **Grid Layout**: 3 columns on desktop, 1 on mobile

#### Students Preview Section
- [ ] **Section Title**: "Étudiants" with Users icon
- [ ] **Display Rules**:
  - [ ] Shows first 10 enrolled students
  - [ ] If > 10 students: Shows "+ X autres étudiants" message
  - [ ] If no students: "Aucun étudiant inscrit"
- [ ] **Student Item** (for each):
  - [ ] Avatar with first letter
  - [ ] Student name (or email)
  - [ ] Attendance percentage with color badge
  - [ ] Items in flex wrap layout

#### Schedule Preview Section
- [ ] **Section Title**: "Emploi du temps" with Calendar icon
- [ ] **Display Rules**:
  - [ ] Shows next 5 upcoming sessions
  - [ ] If > 5 sessions: Shows "+ X autres sessions" message
  - [ ] If no sessions: "Aucune session planifiée"
- [ ] **Session Item** (for each):
  - [ ] Date in French format
  - [ ] Time range
  - [ ] Text size: small
  - [ ] List format with spacing

#### Quick Stats Section
- [ ] **Section Title**: "Statistiques" with BarChart3 icon
- [ ] **Stat Items** (4 stats):
  - [ ] Label on left (muted text)
  - [ ] Value on right (bold)
  - [ ] Format examples:
    - [ ] Taux de présence: "92%"
    - [ ] Moyenne générale: "85%"
    - [ ] Sessions actives: "8"
    - [ ] Salle: "Salle A-101" or "—"

#### View Details Button
- [ ] **Button Position**: Bottom of expanded content
- [ ] **Icon**: BarChart3 (📊)
- [ ] **Label**: "Voir tous les détails"
- [ ] **Behavior**: Navigates to `/admin/classes/:classId`
- [ ] **Variant**: Default/primary

### Loading State
- [ ] **Skeleton Loaders**: Show while fetching class details
- [ ] **Smooth Transition**: From loading to content

---

## 🎯 Feature 4: Class Detail Page

### Navigation
- [ ] **Route**: `/admin/classes/:classId`
- [ ] **Access Methods**:
  - [ ] Click **Chart icon** (📊) in table actions
  - [ ] Click **"Voir tous les détails"** in quick view panel
  - [ ] Click **"Voir tous les détails"** in expanded row
  - [ ] Direct URL navigation

### Header Section
- [ ] **Back Button**:
  - [ ] Icon: ArrowLeft (←)
  - [ ] Label: "Retour à l'administration"
  - [ ] Click returns to `/admin`
  - [ ] Ghost variant
- [ ] **Class Information**:
  - [ ] **Class Name**: Large heading (3xl font)
  - [ ] **Course Name**: Muted text below
  - [ ] **Badges**:
    - [ ] Class code (outline variant)
    - [ ] Status badge (color-coded: active/completed/cancelled)
- [ ] **Professor Info** (right side):
  - [ ] Label: "Professeur"
  - [ ] Professor name
  - [ ] Professor email (if available)
  - [ ] Shows "Non assigné" if no professor

### Stats Grid (4 Cards)
- [ ] **Card 1 - Total Students**:
  - [ ] Icon: Users
  - [ ] Number: Current / Max (e.g., "25 / 30")
  - [ ] Progress bar showing capacity percentage
  - [ ] Color: Blue gradient
- [ ] **Card 2 - Attendance Rate**:
  - [ ] Icon: TrendingUp
  - [ ] Percentage: Average attendance
  - [ ] Progress bar with color coding
  - [ ] Color: Green/yellow/red based on rate
- [ ] **Card 3 - Average Grade**:
  - [ ] Icon: FileText
  - [ ] Percentage: Average grade
  - [ ] Progress bar
  - [ ] Color: Purple gradient
- [ ] **Card 4 - Active Sessions**:
  - [ ] Icon: Calendar
  - [ ] Number: Completed / Total
  - [ ] Badge format
  - [ ] Color: Orange gradient

### Tabs Navigation
- [ ] **Tab List**: Horizontal tabs below stats
- [ ] **Tab Items**:
  - [ ] Students (default active)
  - [ ] Schedule
  - [ ] Attendance
  - [ ] Grades
  - [ ] Materials
  - [ ] Settings

### Students Tab ✅
- [ ] **Table Structure**:
  - [ ] **Columns**: Student | Email | Attendance % | Grade % | Enrollment Date
  - [ ] **Sortable**: Click column headers to sort
  - [ ] **Responsive**: Scrollable on mobile
- [ ] **Student Row** (for each):
  - [ ] **Avatar**: With first letter of name
  - [ ] **Name**: Full name or email
  - [ ] **Email**: Student email address
  - [ ] **Attendance %**: 
    - [ ] Color-coded badge
    - [ ] Green (≥85%), Yellow (70-84%), Red (<70%)
  - [ ] **Grade %**: Average grade or "—"
  - [ ] **Enrollment Date**: French date format
- [ ] **Empty State**: 
  - [ ] "Aucun étudiant inscrit" when no students
  - [ ] Icon and message

### Schedule Tab ✅
- [ ] **Session List**: All sessions (past + upcoming)
- [ ] **Session Item** (for each):
  - [ ] **Date**: French format with weekday
  - [ ] **Time Range**: HH:MM - HH:MM
  - [ ] **Room**: Location name
  - [ ] **Status Badge**: Color-coded
  - [ ] **Type**: Lecture/Lab/Tutorial
- [ ] **Sorting**: Chronological order (latest first)
- [ ] **Empty State**: "Aucune session planifiée"

### Attendance Tab 🚧
- [ ] **Placeholder Message**: "Fonctionnalité à venir"
- [ ] **Icon**: Calendar or appropriate icon
- [ ] **Description**: Brief explanation of future feature

### Grades Tab 🚧
- [ ] **Placeholder Message**: "Fonctionnalité à venir"
- [ ] **Icon**: FileText or appropriate icon
- [ ] **Description**: Brief explanation of future feature

### Materials Tab 🚧
- [ ] **Placeholder Message**: "Fonctionnalité à venir"
- [ ] **Icon**: BookOpen or appropriate icon
- [ ] **Description**: Brief explanation of future feature

### Settings Tab 🚧
- [ ] **Placeholder Message**: "Fonctionnalité à venir"
- [ ] **Icon**: Settings or appropriate icon
- [ ] **Description**: Brief explanation of future feature

### Loading States
- [ ] **Initial Load**: Full page skeleton
- [ ] **Tab Switch**: Content-specific skeletons
- [ ] **Data Refresh**: Inline skeletons

### Error States
- [ ] **Class Not Found**:
  - [ ] Card with error message
  - [ ] "Classe introuvable" heading
  - [ ] Description
  - [ ] Back button to return to admin
- [ ] **Data Fetch Errors**: Toast notifications (already handled)

---

## 🎯 All Action Buttons Test

### From Table Row Actions Column

| Button | Icon | Title | Expected Action | ✓ |
|--------|------|-------|----------------|---|
| Quick View | 👁️ Eye | "Vue rapide" | Opens slide-out panel | [ ] |
| Detail Page | 📊 BarChart3 | "Voir tous les détails" | Navigates to `/admin/classes/:id` | [ ] |
| Assign Students | 👥 Users | "Gérer les étudiants" | Opens assign students dialog | [ ] |
| Edit | ✏️ Edit | "Modifier" | Opens edit class dialog | [ ] |
| Delete | 🗑️ Trash2 | "Supprimer" | Opens delete confirmation | [ ] |
| Expand/Collapse | ⬇️⬆️ Chevron | "Expand/Collapse" | Toggles row expansion | [ ] |

### From Quick View Panel

| Button | Icon | Label | Expected Action | ✓ |
|--------|------|-------|----------------|---|
| Edit | ✏️ Edit | "Modifier la classe" | Opens edit dialog | [ ] |
| Assign | 👥+ UserPlus | "Assigner des étudiants" | Opens assign dialog | [ ] |
| View Details | ↗️ ExternalLink | "Voir tous les détails" | Navigates + closes panel | [ ] |
| Close | ✖️ X | — | Closes panel | [ ] |

### From Expanded Row

| Button | Icon | Label | Expected Action | ✓ |
|--------|------|-------|----------------|---|
| View Details | 📊 BarChart3 | "Voir tous les détails" | Navigates to detail page | [ ] |

### From Detail Page

| Button | Icon | Label | Expected Action | ✓ |
|--------|------|-------|----------------|---|
| Back | ← ArrowLeft | "Retour à l'administration" | Returns to `/admin` | [ ] |

---

## 🎨 Visual & UX Checks

### Colors & Theming
- [ ] All components use semantic tokens from `index.css`
- [ ] **Dark Mode**: All components readable and properly styled
- [ ] **Light Mode**: All components readable and properly styled
- [ ] **Color Consistency**: 
  - [ ] Green for good attendance/grades (≥85%)
  - [ ] Yellow for moderate (70-84%)
  - [ ] Red for poor (<70%)

### Typography
- [ ] **Headings**: Proper hierarchy (h1, h2, h3)
- [ ] **Body Text**: Readable size (14px base)
- [ ] **Small Text**: Used for secondary info (12px)
- [ ] **Font Weights**: Bold for emphasis, regular for body

### Spacing & Layout
- [ ] **Card Padding**: Consistent throughout
- [ ] **Grid Gaps**: Proper spacing in grids
- [ ] **List Spacing**: Items have breathing room
- [ ] **Button Spacing**: Gaps between action buttons

### Animations
- [ ] **Panel Slide**: Smooth 300ms transition
- [ ] **Row Expansion**: Smooth slide-down/up
- [ ] **Skeleton Pulse**: Smooth loading animation
- [ ] **Hover States**: Subtle transitions on interactive elements

### Responsive Design
- [ ] **Desktop** (>1024px): Full layout with all columns
- [ ] **Tablet** (768-1024px): Adjusted columns, panels
- [ ] **Mobile** (<768px):
  - [ ] Table scrolls horizontally
  - [ ] Quick view panel full-screen
  - [ ] Stats grid stacks vertically
  - [ ] Expanded row single column

### Accessibility
- [ ] **Keyboard Navigation**: Tab through interactive elements
- [ ] **Focus States**: Visible focus indicators
- [ ] **ARIA Labels**: Proper labels on buttons
- [ ] **Screen Reader**: Meaningful text content

---

## 🐛 Edge Cases & Error Handling

### Empty States
- [ ] **No Classes**: Shows create button with message
- [ ] **No Students**: Shows "Aucun étudiant inscrit"
- [ ] **No Sessions**: Shows "Aucune session planifiée"
- [ ] **No Grades**: Shows "—" or appropriate placeholder

### Data Integrity
- [ ] **Missing Professor**: Shows "Non assigné"
- [ ] **Missing Room**: Shows "—"
- [ ] **Missing Email**: Shows username or fallback
- [ ] **Null Values**: Don't cause crashes

### Network Issues
- [ ] **Loading States**: Skeletons while fetching
- [ ] **Error States**: Toast notifications for failures
- [ ] **Retry Logic**: Refetch functions available
- [ ] **PGRST116 Errors**: Handled gracefully (no toast)

### Performance
- [ ] **Large Student Lists**: Pagination or virtualization
- [ ] **Many Sessions**: List remains performant
- [ ] **Multiple Classes**: Table renders quickly
- [ ] **Skeleton Loaders**: Show immediately

---

## ✅ Final Verification

### Feature Completeness
- [ ] **Option 1**: Enhanced Table Columns - ✅ All working
- [ ] **Option 2**: Quick View Panel - ✅ All working
- [ ] **Option 3**: Expandable Rows - ✅ All working
- [ ] **Option 4**: Detail Page - ✅ All working

### Data Flow
- [ ] **Hooks**: `useClassDetails`, `useClassStats` fetch correctly
- [ ] **Database**: Queries return expected data
- [ ] **Calculations**: Attendance/grades compute correctly
- [ ] **Filtering**: Upcoming sessions filter by date

### Code Quality
- [ ] **TypeScript**: No type errors
- [ ] **Console**: No errors or warnings
- [ ] **Network**: All requests successful (200/201)
- [ ] **Best Practices**: Follows React patterns

---

## 📊 Test Results Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Enhanced Table Columns | ⏳ Pending | Test after login |
| Quick View Panel | ⏳ Pending | Test after login |
| Expandable Rows | ⏳ Pending | Test after login |
| Detail Page | ⏳ Pending | Test after login |

### Issues Found
_(Document any issues discovered during testing)_

1. Issue #1: [Description]
   - Severity: [Low/Medium/High]
   - Steps to reproduce: [...]
   - Expected: [...]
   - Actual: [...]

---

## 🚀 Next Steps

After all tests pass:
1. ✅ Mark this checklist as complete
2. 📸 Take screenshots of each feature
3. 📝 Document any configuration needed
4. 🎉 Feature is ready for production!

---

**Test Date**: _____________
**Tester**: _____________
**Result**: ⏳ In Progress | ✅ Passed | ❌ Failed
