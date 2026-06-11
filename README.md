# Billy ERP Platform

Billy is a modern, enterprise-grade accounting and business management platform designed specifically to serve as the operating system for Indian Micro, Small, and Medium Enterprises (MSMEs). 

Built with React Native and Expo, Billy delivers a seamless, cross-platform experience. It prioritizes sophisticated design language, fluid performance, and uncompromising data density, offering a powerful alternative to traditional, legacy ERP software.

## Platform Features

- **Financial Command Center**: Real-time aggregation of cash flow, outstanding balances, and inventory metrics visualized through fluid, hardware-accelerated area charts.
- **Automated GST Compliance**: Enterprise-ready invoicing and quotation workflows with built-in support for Indian HSN/SAC codes and automated CGST, SGST, and IGST calculations.
- **Intelligent Receivables**: Advanced aging reports and health bars to monitor outstanding customer payments and vendor liabilities.
- **Inventory & Logistics**: Dynamic product catalog management, complete with low-stock alerts, warehouse batch tracking, and E-Way Bill generation.
- **Premium User Experience**: Engineered using modern design principles, featuring glassmorphic interfaces, sophisticated typography, and optimized mobile ergonomics with strict adherence to platform accessibility standards.

## Technical Architecture

The platform is engineered for scale, utilizing a modern frontend stack optimized for offline-first capabilities and high-frequency data mutation.

- **Framework**: React Native and Expo SDK 56
- **Routing**: File-based routing via Expo Router for modular, scalable navigation
- **State Management**: Highly optimized Zustand store utilizing shallow rendering to guarantee 60FPS performance on low-tier hardware
- **Styling**: NativeWind v5 (Tailwind CSS) integrated with global style variables
- **Animations**: React Native Reanimated for performant, thread-safe micro-interactions

## Project Structure

The codebase follows a strict domain-driven architecture to maintain scalability.

- `src/app/(app)/` - Protected application routes organized by business domain:
  - `(dashboard)/` - Analytics and reporting interfaces
  - `(sales)/` - Document builders for invoices, estimates, and delivery challans
  - `(purchases)/` - Expense tracking and purchase orders
  - `(inventory)/` - Product catalogs and stock adjustments
  - `(finance)/` - GST returns, E-Way bills, and payments
  - `(parties)/` - Customer and vendor relationship management
- `src/components/` - Isolated presentation and logic components:
  - `ui/` - Foundational design system elements
  - `charts/` - Hardware-accelerated data visualizations
  - `domain/` - Complex, feature-specific assemblies

## Getting Started

### Prerequisites
Ensure Node.js and npm are installed on your local environment.

### Installation

1. Install all dependencies:
```bash
npm install
```

2. Start the Metro development server:
```bash
npx expo start -c
```

### Deployment
Follow the Expo Application Services (EAS) documentation to build production binaries for iOS and Android.

## License

This software is proprietary and confidential. Copyright reserved by Omnity Industries.
