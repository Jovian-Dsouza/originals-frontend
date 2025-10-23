# Originals Frontend - UI/UX Documentation for Figma Design

## Table of Contents
1. [Design System & Theme](#1-design-system--theme)
2. [Page-by-Page Documentation](#2-page-by-page-documentation)
3. [Component Documentation](#3-component-documentation)
4. [User Flows](#4-user-flows)
5. [Interaction Patterns](#5-interaction-patterns)
6. [Responsive Behavior](#6-responsive-behavior)

---

## 1. Design System & Theme

### 1.1 Color Palette (HSL Values)
The application uses a futuristic dark theme with neon accents:

```css
/* Primary Colors */
--background: 240 20% 6%        /* Very dark blue-gray */
--foreground: 180 100% 95%       /* Near white cyan */
--card: 240 15% 10%             /* Dark card background */
--card-foreground: 180 100% 95% /* Card text */

/* Accent Colors */
--primary: 265 89% 59%           /* Bright purple */
--primary-foreground: 0 0% 100%  /* White */
--secondary: 180 100% 50%        /* Cyan */
--secondary-foreground: 240 20% 6% /* Dark text */

/* Supporting Colors */
--muted: 240 10% 15%             /* Muted background */
--muted-foreground: 180 20% 70% /* Muted text */
--accent: 180 100% 50%           /* Cyan accent */
--destructive: 0 72% 51%         /* Red for errors */

/* Borders & Inputs */
--border: 240 10% 18%            /* Border color */
--input: 240 10% 18%             /* Input background */
--ring: 265 89% 59%              /* Focus ring */
```

### 1.2 Typography System
- **Font Family**: System sans-serif (default)
- **Font Weight**: 
  - Regular: 400
  - Medium: 500
  - Semibold: 600
  - Bold: 700
- **Font Sizes**:
  - xs: 0.75rem (12px)
  - sm: 0.875rem (14px)
  - base: 1rem (16px)
  - lg: 1.125rem (18px)
  - xl: 1.25rem (20px)
  - 2xl: 1.5rem (24px)
  - 3xl: 1.875rem (30px)
  - 4xl: 2.25rem (36px)
  - 5xl: 3rem (48px)

### 1.3 Glassmorphism Effects
The app heavily uses glassmorphism for cards and overlays:

```css
.glass-card {
  background: rgba(240, 15%, 10%, 0.6); /* Semi-transparent dark */
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.37),
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.05);
}
```

### 1.4 Neon Glow Effects
Primary and secondary colors have glow effects:

```css
.glow-primary {
  box-shadow: 0 0 20px hsl(265 89% 59% / 0.5);
}

.glow-secondary {
  box-shadow: 0 0 20px hsl(180 100% 50% / 0.5);
}
```

### 1.5 Background Pattern
The app uses a subtle background pattern:
- Radial gradients at 20% 50% and 80% 80% with primary/secondary colors
- Repeating linear gradient creating subtle grid lines
- Fixed background attachment for parallax effect

### 1.6 Spacing & Layout
- **Border Radius**: 1rem (16px) default
- **Padding**: 4px, 8px, 16px, 24px, 32px, 48px
- **Margins**: Same as padding
- **Gap**: 4px, 8px, 12px, 16px, 24px, 32px
- **Max Width**: screen-xl (1280px) for content containers

---

## 2. Page-by-Page Documentation

### 2.1 Onboarding Page (`/`)

**Purpose**: Multi-step user onboarding and authentication flow

**UI/UX Elements**:

#### Page 1: Welcome/Vision Intro
- **Hero Background**: Full-screen image with gradient overlay
- **Logo**: Large "Originals" text with gradient (primary to secondary)
- **Tagline**: "On-chain Collaboration Network"
- **Main Content**: 
  - Large animated icon (Sparkles) with glow effect
  - Headline: "Where careers don't need cubicles"
  - Subtitle: "Connect • Collaborate • Get Paid • Build Reputation"
  - 2x2 grid of feature cards with icons and descriptions
- **Authentication Buttons**:
  - Primary: "Login with Zora" (gradient background)
  - Secondary: "Login with Wallet" (outline style)
- **Progress Indicator**: 5 dots at bottom

#### Page 2: Profile Setup (Email Flow)
- **Profile Photo Upload**: Circular placeholder with camera icon
- **Banner Upload**: Dashed border rectangle with image icon
- **Form Fields**:
  - Name input
  - Tagline input (60 char limit)
  - Status selection (3 badges: "Open to Gigs", "Open to Collabs", "Just Exploring")
- **Action**: "Mint Creator Coin" button

#### Page 2: Wallet Connection (Zora Flow)
- **Loading Animation**: Spinning Sparkles icon with glow
- **Connection Status**: Wallet address display
- **Profile Preview**: Mock creator coin data (Market Cap, 24h Change, Posts)
- **Action**: "Sync to Originals Profile" button

#### Page 3: User Type Selection
- **Two Large Cards**:
  - Independent Creator (Users icon, purple accent)
  - Commercial Creator (Building2 icon, cyan accent)
- **Card States**: Selected cards have colored borders and background tints
- **Action**: "Continue" button

#### Page 4A: Creative Domains (Indie Users)
- **Grid Layout**: 2x5 grid of creative domain cards
- **Domain Options**: 10 creative fields with icons and subtitles
- **Card States**: Selected cards have primary border and glow
- **Action**: "Next: Enter Your Orbit" button

#### Page 4B: Organization Setup (Commercial Users)
- **Form Fields**:
  - Organization Name input
  - Organization Type dropdown (Production House, Media Agency, Music Label, DAO)
  - Logo upload area
  - Primary Creative Domains (badge selection)
  - Website URL input
- **Action**: "Next: Enter Your Orbit" button

#### Page 5: Orbit Overview
- **Large Animated Icon**: Sparkles with orbiting elements
- **Headline**: "You're in the Originals Network"
- **Description**: "Every idea you mint from here carries your credit forever"
- **Action**: "Enter Nexus →" button

**Key Interactions**:
- Smooth transitions between pages
- Form validation before proceeding
- Animated elements (floating, pulsing glow)
- Responsive grid layouts

### 2.2 PostFeed Page (`/feed`)

**Purpose**: TikTok-style vertical scroll feed for content discovery

**UI/UX Elements**:

#### Layout Structure
- **Full Screen**: 100vh height with overflow hidden
- **Vertical Scroll**: Snap-y snap-mandatory for smooth scrolling
- **Background**: Each post has full-screen background image with dark overlay

#### Header
- **Position**: Absolute top with gradient background
- **Content**: Centered "Originals" title
- **Background**: Gradient from black/50 to transparent

#### Post Cards
- **Full Screen**: Each post takes full viewport height
- **Background Image**: Cover with black/40 overlay
- **Top Section**:
  - Creator avatar (circular, 40px)
  - Creator name and collaborators
  - Content type badge (BTS, Release, Thoughts) with icon
  - More options button (3 dots)
- **Bottom Section**:
  - Description text
  - Market cap display (green/red based on change)
  - Action buttons (Comment, Share)
  - "Buy" button (primary style)

#### Floating Elements
- **Create Button**: Fixed bottom-right, metallic gradient with Plus icon
- **Bottom Navigation**: Fixed bottom with 4 tabs

**Key Interactions**:
- Vertical swipe/scroll between posts
- Tap to interact with buttons
- Smooth transitions between posts
- Market cap color coding (green up, red down)

### 2.3 CollabFeed Page (`/collab`)

**Purpose**: Tinder-style swiping interface for collaboration discovery

**UI/UX Elements**:

#### Header
- **Sticky Position**: Top of screen with glass card styling
- **Title**: "CollabFeed" with filter button
- **Filter Chips**: Horizontal scrollable badges (All, Paid, Barter, Credits, Contract, Freestyle, Remote)
- **Filter Button**: Outline style with Filter icon

#### Main Content Area
- **Card Stack**: Tinder-style card interface
- **Card Structure**:
  - Image section (3/5 height) with gradient overlay
  - Role badge (top-right corner)
  - Content section (2/5 height) with:
    - Project title (large, bold)
    - Creator info (avatar + name)
    - Description (2 lines max)
    - Badge row (payment type, credits, work style, location)

#### Action Buttons
- **Pass Button**: Large circular red button with X icon
- **Info Button**: Medium circular outline button with Info icon
- **Like Button**: Large circular gradient button with Heart icon

#### Floating Elements
- **Create Collab Button**: Fixed bottom-right, metallic gradient with Handshake icon
- **Bottom Navigation**: Fixed bottom

**Key Interactions**:
- Horizontal swipe gestures (left = pass, right = like)
- Tap action buttons
- Filter chip selection
- Card stack animation (next card scales down and moves up)

### 2.4 CreateCollab Page (`/create-collab`)

**Purpose**: Two-step collaboration post creation with collaborator management

**UI/UX Elements**:

#### Header
- **Sticky Position**: Glass card with border
- **Back Button**: Ghost style with ArrowLeft icon
- **Title**: "Create PostCoin" with step indicator
- **Subtitle**: Shows current step ("Project details" or "Invite collaborators")

#### Step 1: Project Details
- **Glass Card Container**: Rounded corners with padding
- **Form Fields**:
  - Project Title input
  - Description textarea (5 rows)
  - Media upload area (dashed border, Upload icon)
- **Action**: "Continue to Collaborators" button (gradient)

#### Step 2: Collaborator Management
- **Header Section**:
  - "Invite Collaborators" title
  - Total Credits counter (must equal 100%)
- **Collaborator Cards**: Each collaborator gets a glass card with:
  - Role input field
  - Creator Type dropdown (Indie, Organization, Brand)
  - Credits percentage input
  - Compensation dropdown (Paid, Barter, Both)
  - Time Commitment dropdown (Ongoing, One-Time)
  - Job Description textarea
  - Remove button (Trash icon)
- **Add Collaborator Button**: Dashed border outline style
- **Publish Button**: Gradient style, disabled until credits = 100%

**Key Interactions**:
- Form validation (required fields, credit total)
- Dynamic collaborator addition/removal
- Real-time credit calculation
- Step navigation with back button

### 2.5 CreateContent Page (`/create-content`)

**Purpose**: Content creation with two distinct flows (Indie vs Collab)

**UI/UX Elements**:

#### Mode Selection Screen
- **Back Button**: Ghost style
- **Title**: "Post Content"
- **Subtitle**: "Choose your content type"
- **Two Large Cards**:
  - Indie Content (Plus icon, primary accent)
  - Collab Content (Upload icon, secondary accent)

#### Indie Content Flow
- **Form Fields**:
  - Content Type dropdown (BTS, Release, Thoughts, Independent)
  - Title input
  - Description textarea
  - Media upload area

#### Collab Content Flow
- **Form Fields**:
  - Collab selection dropdown
  - Stage selection (BTS, Release)
  - Description textarea
  - Media upload area

#### Common Elements
- **Media Upload**: Dashed border rectangle with Upload icon
- **Publish Button**: Full-width primary button
- **Form Validation**: Required field checking

**Key Interactions**:
- Mode selection with card hover effects
- Dynamic form fields based on selection
- File upload interface
- Form validation and error handling

### 2.6 Contracts Page (`/contracts`)

**Purpose**: Manage collaboration matches and communication

**UI/UX Elements**:

#### Header
- **Sticky Position**: Glass card with border
- **Title**: "Contracts"
- **Subtitle**: "Manage your collaboration matches"

#### Tab Interface
- **Two Tabs**: "Pings Received" and "Matched Collabs"
- **Tab List**: Full-width grid with 2 columns

#### Pings Received Tab
- **Ping Cards**: Each ping displays:
  - User avatar (circular, 48px)
  - User name and ping time
  - Interested role and collab post
  - User bio
  - Action buttons (Accept, Profile, Decline)
- **Empty State**: Glass card with MessageCircle icon and description

#### Matched Collabs Tab
- **Collab Cards**: Each match displays:
  - User avatar with online indicator
  - Project name and role
  - Creator handle
  - Last message preview with timestamp
  - Unread message badge
- **Empty State**: Glass card with CheckCircle2 icon and description

**Key Interactions**:
- Tab switching
- Ping acceptance/decline
- Message preview with unread indicators
- Card hover effects

### 2.7 Profile Page (`/profile`)

**Purpose**: User profile with Zora integration and professional history

**UI/UX Elements**:

#### Header
- **Glass Card**: With border and padding
- **Title**: "Profile" with settings and logout buttons
- **Profile Section**:
  - Avatar (80px) with verification badge
  - Name and bio
  - Skills badges
- **Stats Grid**: 3-column grid with:
  - CC Market Cap (with 24h change)
  - Content count
  - Gigs count

#### Tab Interface
- **Two Tabs**: "Content" and "Pro"
- **Tab List**: Full-width grid

#### Content Tab
- **Content Grid**: 3-column masonry layout
- **Content Cards**: Each shows:
  - Media preview image
  - Market cap overlay on hover
  - Loading states for Zora data
- **Empty State**: Message for no content

#### Professional Tab
- **Wallet Information Section**:
  - Wallet cards with type and address
  - Copy button for addresses
  - Email display if available
- **Skills Section**: Badge display
- **Ongoing Collabs**: Timeline format with:
  - Creator avatar and info
  - Project details
  - Duration and description
  - Type badge
- **Completed Collabs**: Same format as ongoing

**Key Interactions**:
- Zora wallet data loading
- Tab switching
- Address copying
- Content grid hover effects
- Logout confirmation

---

## 3. Component Documentation

### 3.1 Navigation Components

#### BottomNav
- **Position**: Fixed bottom with backdrop blur
- **Height**: 80px
- **Items**: 4 navigation items with icons and labels
- **Active State**: Primary color with glow effect
- **Icons**: Image, Handshake, FileText, User

#### Sticky Headers
- **Position**: Sticky top with z-index 40
- **Styling**: Glass card with border
- **Content**: Title, subtitle, action buttons
- **Backdrop**: Blur effect

#### Back Buttons
- **Style**: Ghost variant with icon
- **Icon**: ArrowLeft
- **Behavior**: Navigate back or to previous step

### 3.2 Interactive Components

#### Swipeable Cards
- **CollabFeed**: Horizontal swipe with pass/like actions
- **Animation**: Scale and translate effects
- **Stack**: Multiple cards with depth effect

#### Filter Chips/Badges
- **Style**: Outline and default variants
- **Behavior**: Click to filter content
- **Scroll**: Horizontal scrollable container

#### Action Buttons
- **Primary**: Gradient background (primary to secondary)
- **Secondary**: Outline with colored border
- **Ghost**: Transparent with hover effects
- **Sizes**: sm, default, lg, icon

#### Input Fields
- **Style**: Rounded with border
- **Background**: Muted with transparency
- **Focus**: Ring effect with primary color
- **Validation**: Error states with destructive color

#### Select Dropdowns
- **Trigger**: Input-like appearance
- **Content**: Scrollable list with items
- **Search**: Optional search functionality

### 3.3 Display Components

#### Glass Cards
- **Background**: Semi-transparent with backdrop blur
- **Border**: White/10 opacity
- **Shadow**: Multiple layers for depth
- **Radius**: 1rem default

#### Avatar Components
- **Individual**: Circular with border
- **Organization**: Square/rounded rectangle
- **Fallback**: Gradient background with initials
- **Sizes**: Various from 24px to 80px

#### Badge Components
- **Default**: Primary background
- **Secondary**: Muted background
- **Outline**: Border only
- **Destructive**: Red background
- **Sizes**: sm, default

#### Progress Indicators
- **Dots**: Small circles with active state
- **Bars**: Horizontal progress bars
- **Circular**: Loading spinners

#### Stat Displays
- **Market Cap**: Large number with change indicator
- **Color Coding**: Green for positive, red for negative
- **Format**: Currency formatting with commas

### 3.4 Guided Tour Component

#### Modal Overlay
- **Backdrop**: Semi-transparent with blur
- **Position**: Fixed full screen
- **Z-index**: 50

#### Tour Cards
- **Position**: Center or bottom positioned
- **Styling**: Glass card with glow effects
- **Content**: Title, description, CTA button
- **Skip**: X button in top-right

#### Progress Indicators
- **Dots**: Small bars showing current step
- **Animation**: Smooth transitions

---

## 4. User Flows

### 4.1 Onboarding Flow
1. **Welcome Screen**: User sees vision and authentication options
2. **Authentication**: Choose Zora, wallet, or email
3. **Profile Setup**: Complete profile information
4. **User Type**: Select Independent or Commercial creator
5. **Domain Selection**: Choose creative domains
6. **Completion**: Enter the main application

### 4.2 Collaboration Discovery Flow
1. **CollabFeed**: Browse available collaborations
2. **Filter**: Apply filters to narrow down options
3. **Swipe**: Pass or like collaboration opportunities
4. **Match**: When mutual interest occurs
5. **Contract**: Manage the collaboration in Contracts page

### 4.3 Content Creation Flow
1. **Create Button**: Tap floating create button
2. **Content Type**: Choose Indie or Collab content
3. **Form Completion**: Fill required fields
4. **Media Upload**: Add images/videos
5. **Publish**: Submit content to feed

### 4.4 Collaboration Management Flow
1. **Create Collab**: Post collaboration opportunity
2. **Receive Pings**: Get interest from other creators
3. **Review Applications**: Check creator profiles
4. **Accept/Decline**: Make collaboration decisions
5. **Active Collaboration**: Manage ongoing projects

---

## 5. Interaction Patterns

### 5.1 Scrolling Patterns
- **PostFeed**: Vertical snap scrolling (TikTok-style)
- **CollabFeed**: Horizontal swipe gestures
- **General**: Smooth scrolling with momentum

### 5.2 Gesture Patterns
- **Swipe Left**: Pass/reject (CollabFeed)
- **Swipe Right**: Like/accept (CollabFeed)
- **Tap**: Select, open, or activate
- **Long Press**: Context menus (where applicable)

### 5.3 Form Interactions
- **Validation**: Real-time field validation
- **Error States**: Clear error messaging
- **Success States**: Confirmation toasts
- **Loading States**: Skeleton screens and spinners

### 5.4 Navigation Patterns
- **Tab Navigation**: Bottom navigation bar
- **Breadcrumbs**: Back button navigation
- **Deep Linking**: Direct page access
- **State Persistence**: Maintain scroll positions

---

## 6. Responsive Behavior

### 6.1 Mobile-First Design
- **Breakpoints**: Mobile-first approach
- **Touch Targets**: Minimum 44px touch areas
- **Gesture Support**: Native swipe and scroll

### 6.2 Layout Adaptations
- **Grid Systems**: 2-col and 3-col responsive grids
- **Card Sizing**: Flexible card dimensions
- **Text Scaling**: Responsive typography
- **Spacing**: Consistent spacing across devices

### 6.3 Content Adaptation
- **Image Scaling**: Cover and contain strategies
- **Text Truncation**: Ellipsis for overflow
- **Button Sizing**: Touch-friendly button sizes
- **Modal Sizing**: Responsive modal dimensions

### 6.4 Performance Considerations
- **Lazy Loading**: Images and content
- **Smooth Animations**: 60fps animations
- **Memory Management**: Efficient component rendering
- **Network Optimization**: Optimized asset loading

---

## Design Recommendations for Figma

### Visual Hierarchy
1. **Primary Actions**: Use gradient buttons for main CTAs
2. **Secondary Actions**: Outline buttons for secondary actions
3. **Tertiary Actions**: Ghost buttons for subtle actions
4. **Information Hierarchy**: Use size, color, and spacing to create clear hierarchy

### Accessibility Considerations
1. **Color Contrast**: Ensure sufficient contrast ratios
2. **Touch Targets**: Minimum 44px for interactive elements
3. **Focus States**: Clear focus indicators
4. **Screen Reader**: Proper semantic markup

### Animation Guidelines
1. **Smooth Transitions**: 300ms cubic-bezier transitions
2. **Loading States**: Skeleton screens for better UX
3. **Micro-interactions**: Subtle hover and focus effects
4. **Performance**: Optimize for 60fps animations

### Component Consistency
1. **Design Tokens**: Use consistent spacing, colors, and typography
2. **Component Library**: Maintain consistent component patterns
3. **State Variations**: Design all states (default, hover, active, disabled)
4. **Error Handling**: Design clear error and success states

This documentation provides a comprehensive guide for Figma designers to understand the current application structure and create enhanced design mockups that maintain consistency while improving the user experience.
