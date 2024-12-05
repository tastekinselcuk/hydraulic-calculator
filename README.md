# Hydraulic Calculator

A modern Vue.js-based web application for performing advanced hydraulic engineering calculations. This tool provides real-time calculations of essential hydraulic parameters for dam and reservoir projects, with multi-language support (English and Turkish).

## Features

- Real-time calculation of hydraulic parameters:
  - Cross-sectional Area
  - Wetted Perimeter
  - Hydraulic Radius
  - Flow Velocity
  - Froude Number
- Bilingual Support:
  - English (EN)
  - Turkish (TR)
- Data Management:
  - Save calculations for future reference
  - Export results to PDF
  - Copy results to clipboard
- Modern, responsive user interface
- Input validation and error handling

## Tech Stack

- **Frontend Framework**: Vue.js 3
- **Build Tool**: Vite 5
- **State Management**: Pinia 2.2
- **Routing**: Vue Router 4.5
- **PDF Generation**: jsPDF 2.5 with AutoTable 3.8
- **Development Tools**:
  - @vitejs/plugin-vue
  - Modern JavaScript (ES6+)
  - CSS3 with custom properties

## Project Structure

```
hydraulic-calculator/
├── src/
│   ├── assets/         # Static assets
│   ├── components/     # Vue components
│   ├── locales/        # Language files (EN/TR)
│   ├── router/         # Vue Router configuration
│   ├── stores/         # Pinia state management
│   ├── views/          # Page components
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
├── public/             # Public static assets
└── index.html          # Entry HTML file
```

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/tastekinselcuk/hydraulic-calculator.git

# Navigate to project directory
cd hydraulic-calculator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. Select your preferred language (English or Turkish)
2. Enter the required hydraulic parameters
3. Get instant calculations
4. Save or export your results as needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Selçuk Taştekin - [GitHub](https://github.com/tastekinselcuk)
