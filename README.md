# LovingPaws 🐾

A comprehensive pet health tracking app built with React Native and Expo, designed to help pet owners monitor their furry friends' health and wellbeing.

## Features

### 🏠 **Home Dashboard**
- Overview of all pets with health scores
- Quick access to common health actions
- Recent health entries and insights
- Emergency contact information

### 🐕 **Pet Management**
- Add and manage multiple pets
- Store detailed pet information (breed, age, weight, etc.)
- Upload pet photos
- Track health scores automatically

### 🏥 **Health Tracking**
- **Log Symptoms**: Record and track health issues with severity levels
- **Medication Management**: Log medications, dosages, and schedules
- **Veterinary Appointments**: Schedule and track vet visits
- **Health History**: Comprehensive timeline of all health events

### 📊 **Analytics & Insights**
- Health score calculations based on recent entries
- Visual health trends and patterns
- Pet-specific health analytics
- Historical data tracking

### 👤 **User Profile**
- Personal profile management
- Account settings and preferences
- Data backup and sync capabilities

## Tech Stack

- **Frontend**: React Native with Expo
- **Database**: SQLite (local) + Supabase (cloud sync)
- **Authentication**: Supabase Auth
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet with custom design system
- **Icons**: Lucide React Native
- **Image Handling**: Expo Image Picker

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:mirabelle514/LovingPaws.git
   cd LovingPaws
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `config/supabase.ts` file with your Supabase credentials:
   ```typescript
   export const SUPABASE_CONFIG = {
     url: 'YOUR_SUPABASE_PROJECT_URL',
     anonKey: 'YOUR_SUPABASE_ANON_KEY',
   };
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Database Setup

### Local Database (SQLite)
The app uses SQLite for local storage with automatic table creation. No additional setup required.

### Cloud Database (Supabase)
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up the following tables in your Supabase database:

#### Pets Table
```sql
CREATE TABLE pets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  breed TEXT,
  age TEXT,
  weight TEXT,
  color TEXT,
  microchip_id TEXT,
  date_of_birth TEXT,
  owner_notes TEXT,
  image TEXT,
  health_score INTEGER DEFAULT 100,
  last_checkup TEXT DEFAULT 'Never',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Health Entries Table
```sql
CREATE TABLE health_entries (
  id TEXT PRIMARY KEY,
  pet_id TEXT REFERENCES pets(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  time TEXT,
  severity TEXT,
  notes TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL UNIQUE,
  profile_image TEXT,
  avatar_initials TEXT NOT NULL,
  member_since TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

3. Enable Row Level Security (RLS) and create policies for data protection.

## Project Structure

```
LovingPaws/
├── app/                    # Expo Router screens
│   ├── (health)/          # Health-related screens
│   ├── (pets)/            # Pet management screens
│   ├── (profile)/         # User profile screens
│   ├── (settings)/        # App settings screens
│   └── (tabs)/            # Main tab navigation
├── components/            # Reusable UI components
├── contexts/              # React Context providers
├── services/              # Database and API services
├── styles/                # Global styles and colors
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
├── database/              # Database schema and migrations
└── config/                # Configuration files
```

## Key Features Implementation

### Offline-First Architecture
- Local SQLite database for immediate data access
- Automatic sync to cloud when online
- Queue system for pending changes

### Health Score Algorithm
- Calculates pet health scores based on recent entries
- Considers symptom severity and positive health actions
- Updates automatically with new entries

### Data Synchronization
- Bidirectional sync between local and cloud databases
- Conflict resolution for concurrent changes
- Automatic retry mechanisms for failed syncs

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

- Follow the existing code style and formatting
- Use TypeScript for all new code
- Add proper error handling and loading states
- Include JSDoc comments for complex functions

## Deployment

### Building for Production

1. **Configure app.json** with your app details
2. **Build the app**:
   ```bash
   npx expo build:android  # For Android
   npx expo build:ios      # For iOS
   ```

### App Store Deployment

1. Create developer accounts for App Store and Google Play
2. Configure app signing certificates
3. Submit builds through respective app stores

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@lovingpaws.app or create an issue in this repository.

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons from [Lucide](https://lucide.dev/)
- Database powered by [Supabase](https://supabase.com/)

---

Made with ❤️ for pet lovers everywhere
