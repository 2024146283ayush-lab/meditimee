# MediTime - Smart Medicine Reminder & Health Companion

MediTime is a comprehensive healthcare application designed for elderly people and users of all age groups. It helps users manage medicines, prescriptions, health schedules, and family care through intelligent reminders and tracking.

## Features

### 1. Smart Medicine Scheduler
- Add medicines manually or through prescription upload
- Set dosage, quantity, timing, duration, and special instructions
- Daily, weekly, monthly, and custom schedules
- Repeat reminders until medicine is marked as taken

### 2. Multilingual Voice Reminders
- Voice reminders in Hindi and English
- User can choose preferred language
- Adjustable voice volume and reminder frequency

### 3. Family Caregiver Notifications
- Connect family members through phone number or email
- Notify family if medicine is missed or emergency button is pressed
- Family dashboard to monitor medication adherence

### 4. Medicine Intake Tracking
- Mark medicine as Taken, Skipped, or Snoozed
- Maintain complete medication history
- Daily, weekly, and monthly adherence reports
- Visual charts showing medicine compliance percentage

### 5. AI Health Assistant
- Integrated chatbot for medicine-related guidance
- Answer questions regarding medicine schedules, dosage reminders, and general health tips
- Multilingual support (Hindi & English)
- Voice interaction support

### 6. Prescription Scanner
- Upload prescription image
- OCR extracts medicine names, timings, and dosage
- Auto-populate medicine schedule

### 7. Emergency SOS Feature
- One-tap emergency button
- Sends location and emergency alert to family members
- Quick call option for ambulance and emergency contacts

### 8. Medicine Inventory Management
- Track remaining tablets
- Notify users when medicines are running low
- Auto-generated refill reminders

### 9. Health Records Vault
- Store prescriptions, medical reports, lab tests, and doctor notes
- Cloud backup and secure access

### 10. Doctor Appointment Management
- Schedule doctor visits
- Appointment reminders
- Store doctor contact information
- Follow-up notifications

### 11. Smart Dashboard
- Today's medicines
- Upcoming reminders
- Health score
- Medicine adherence percentage
- Recent activity
- Family updates

### 12. Accessibility Features
- Large fonts for elderly users
- High contrast mode
- Voice navigation
- Simple and clutter-free UI
- One-touch actions

### 13. Offline Functionality
- Reminders work without internet
- Data syncs automatically when internet returns

### 14. Gamification & Motivation
- Daily medication streaks
- Achievement badges
- Health score improvements
- Positive reinforcement messages

## Tech Stack

- **Frontend**: Next.js 16 with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express, MongoDB
- **State Management**: Zustand
- **Styling**: Tailwind CSS with custom healthcare color palette
- **Icons**: Heroicons
- **Charts**: Recharts
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd meditime
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
# Backend
PORT=3001
MONGODB_URI=mongodb://localhost:27017/meditime
JWT_SECRET=your-secret-key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Start the development servers:

**Option 1: Start both frontend and backend together**
```bash
npm run dev:all
```

**Option 2: Start separately**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run dev:backend
```

5. Open your browser and visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
meditime/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main dashboard
│   │   ├── medicines/         # Medicine management
│   │   ├── appointments/      # Doctor appointments
│   │   ├── records/          # Health records
│   │   ├── family/           # Family members
│   │   ├── chat/             # AI health assistant
│   │   ├── scanner/          # Prescription scanner
│   │   ├── emergency/        # Emergency SOS
│   │   └── settings/         # User settings
│   ├── components/            # React components
│   │   ├── layout/           # Layout components (Sidebar, MobileNav)
│   │   └── ui/               # Reusable UI components
│   ├── lib/                   # Utility functions
│   │   ├── api.ts            # API client
│   │   ├── translations.ts   # Multilingual support
│   │   └── voice.ts          # Voice synthesis utilities
│   ├── store/                 # Zustand state management
│   └── types/                 # TypeScript type definitions
├── backend/
│   ├── config/               # Configuration files
│   ├── models/               # MongoDB models
│   ├── routes/               # Express API routes
│   └── middleware/           # Authentication middleware
└── public/                   # Static assets
```

## Color Palette

- **Primary Blue**: #0ea5e9 (Sky Blue)
- **Secondary Green**: #10b981 (Emerald)
- **Accent Purple**: #6366f1 (Indigo)
- **Danger Red**: #ef4444 (Red)
- **Warning Orange**: #f59e0b (Amber)
- **Success Green**: #22c55e (Green)

## Accessibility

MediTime is designed with accessibility in mind:

- **Large Fonts**: Toggle to increase text size for better readability
- **High Contrast**: Toggle for better visibility
- **Voice Navigation**: Enable voice guidance for navigation
- **Simple UI**: Clean, minimal design with clear visual hierarchy
- **Touch Friendly**: Large touch targets for mobile users

## Multilingual Support

The application supports:
- **English** (en)
- **Hindi** (hi)

## License

This project is licensed under the MIT License.

## Tagline

"MediTime – Your Smart Partner for Timely Medication and Better Health."
