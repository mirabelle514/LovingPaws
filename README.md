# Loving Paws Tracking App

A comprehensive pet health tracking app built with React Native and Expo, designed to help pet owners monitor their furry friends' health and wellbeing.

## Features

### **Home Dashboard**

- Overview of all pets with health scores
- Quick access to common health actions
- Recent health entries and insights
- Emergency contact information

### **Pet Management**

- Add and manage multiple pets
- Store detailed pet information (breed, age, weight, etc.)
- Upload pet photos
- Track health scores automatically

### **Health Tracking**

- **Log Symptoms**: Record and track health issues with severity levels
- **Medication Management**: Log medications, dosages, and schedules
- **Veterinary Appointments**: Schedule and track vet visits
- **Health History**: Comprehensive timeline of all health events

### **Analytics & Insights**

- Health score calculations based on recent entries
- Visual health trends and patterns
- Pet-specific health analytics
- Historical data tracking

### **User Profile**

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

## Key Features

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

## Support

For support, create an issue in this repository.
Email support will be available soon at [support@lovingpaws.app](mailto:mirabelle.kilkenny@gmail.com)

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons from [Lucide](https://lucide.dev/)
- Database powered by [Supabase](https://supabase.com/)

Made with ❤️ for pet lovers everywhere.

Part of [The Wednesday Collective](https://thewednesdaycollective.com/) | [The Wednesday Projects](https://thewednesdayprojects.com/)
