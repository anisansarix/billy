# Billy - Modern ERP Platform for Indian MSMEs

Billy is a comprehensive, mobile-first business operating system designed specifically for Micro, Small, and Medium Enterprises (MSMEs) in India. The platform streamlines core business operations including sales, purchases, inventory, party management, and GST compliance.

## Mission
To provide a beautiful, intuitive, and trustworthy ERP system that simplifies complex accounting and operational workflows for Indian business owners. Billy eliminates the cognitive load of traditional accounting software by offering a clear, premium, and fast user experience.

## Key Features

### Sales & Invoicing
- Professional GST-compliant invoicing
- Quotations and Estimates
- Credit Notes and Delivery Challans
- Automated Tax Calculations (CGST, SGST, IGST, CESS)

### Purchases & Expenses
- Purchase Order generation and tracking
- Vendor bill management
- Expense categorization and receipt capture

### Inventory Management
- Real-time stock tracking and low-stock alerts
- Product and Service categorization
- HSN/SAC code mapping
- Stock Adjustment records

### Party Management (CRM)
- Customer and Vendor directories
- Outstanding balance tracking (Receivables and Payables)
- Credit limit management
- GSTIN validation

### Compliance & Reporting
- Built-in GST returns logic
- E-Way Bill generation readiness
- Profit and Loss tracking
- Cashflow visibility

## Technology Stack
- Core Framework: React Native with Expo SDK 56
- Language: TypeScript
- Routing: Expo Router (File-based navigation)
- Styling: NativeWind v5 (Tailwind CSS)
- State Management: Zustand with AsyncStorage persistence
- UI Components: Glassmorphism via expo-blur, Reanimated for fluid interactions, Lucide React Native icons

## Architectural Principles
- Mobile-First Ergonomics: Minimum 44x44 points touch targets, generous spacing, and readable typography.
- Offline Capability: State is persisted locally via Zustand and AsyncStorage for uninterrupted usage.
- Scalable Domain Modeling: Data structures strictly mirror real business entities to facilitate future backend synchronization and multi-business support.
- Mathematical Precision: All monetary values are processed and stored as integer Paise to prevent floating-point inaccuracies.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go application on a mobile device (for physical testing)

### Installation
1. Clone the repository
2. Install dependencies:
   npm install
3. Start the Expo development server:
   npx expo start

## Development Standards
- Component Extraction: UI components are strictly extracted when reused or representing core business concepts.
- Strict Typing: The codebase strictly adheres to TypeScript interfaces defined in the domain layer.
- Design System: Adheres to a premium, business-focused aesthetic utilizing curated colors and modern typography without unnecessary clutter.

## License
Proprietary and Confidential. All rights reserved.
