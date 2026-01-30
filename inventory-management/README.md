# Dynamic Inventory Management System

A modern, interactive web application for creating custom inventory forms using drag-and-drop functionality. Built with vanilla JavaScript, HTML5, and CSS3.

## Features

### 🎯 Core Functionality

1. **Drag and Drop Interface**
   - Left sidebar with draggable field components
   - Multiple field categories: Text Inputs, Selections, Date & Time, Inventory Specific
   - Intuitive drag-and-drop to build forms
   - Real-time form construction

2. **Live Preview**
   - Right sidebar shows real-time form preview
   - Instant updates as fields are added or modified
   - Interactive preview with actual form elements

3. **Form Builder**
   - Center panel for form customization
   - Field configuration options (label, placeholder, required, etc.)
   - Reorder fields with up/down arrows
   - Delete individual fields
   - Clear all fields option

4. **AI-Powered Suggestions**
   - Context-aware tips based on form progress
   - Best practices recommendations
   - Guided workflow for inventory management
   - Smart suggestions for field selection

5. **Analytics Dashboard**
   - Form usage statistics
   - Field distribution charts
   - Most used fields tracking
   - Activity timeline visualization
   - Export and save metrics

### 📦 Available Field Types

**Text Inputs:**
- Text Field
- Text Area
- Email
- Number

**Selections:**
- Dropdown
- Radio Buttons
- Checkboxes

**Date & Time:**
- Date Picker
- Time Picker
- DateTime Picker

**Inventory Specific:**
- SKU/Barcode
- Quantity
- Price
- Category

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Installation

1. Clone or download the repository
2. Navigate to the `inventory-management` folder
3. Open `index.html` in your web browser

```bash
cd inventory-management
open index.html  # On Mac
# or
start index.html  # On Windows
# or
xdg-open index.html  # On Linux
```

## Usage

### Creating a Form

1. **Add Fields**: Drag fields from the left sidebar to the center form builder
2. **Configure Fields**: Click on fields to customize labels, placeholders, and options
3. **Reorder Fields**: Use up/down arrows to change field order
4. **Preview**: Watch your form update in real-time on the right sidebar
5. **Save**: Click "Save Form" to persist your work
6. **Export**: Click "Export Form" to download as JSON

### AI Suggestions

Click the "AI Suggestions" button to:
- Get context-aware tips
- Learn best practices
- Receive recommendations based on your current form

### Analytics

Click the "Analytics" button to view:
- Total fields created
- Forms saved and exported
- Field usage distribution
- Popular field types
- Activity timeline

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with animations and transitions
- **JavaScript (ES6+)**: Interactive functionality
- **Chart.js**: Data visualization for analytics
- **Font Awesome**: Icons
- **Local Storage**: Data persistence

### Architecture

```
inventory-management/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling
├── script.js       # Application logic
└── README.md       # Documentation
```

### Key Components

1. **State Management**: Centralized state object tracking all fields and analytics
2. **Drag & Drop API**: Native HTML5 drag and drop implementation
3. **Local Storage**: Automatic save/load functionality
4. **Modular Design**: Reusable components and clean separation of concerns

### Performance Optimizations

- Efficient DOM manipulation
- Event delegation for dynamic elements
- Debounced updates
- Minimal reflows and repaints
- CSS transitions for smooth animations

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Features Highlights

### Interactive UI
- Smooth animations and transitions
- Hover effects and visual feedback
- Responsive design for all screen sizes
- Beautiful gradient backgrounds
- Toast notifications for user actions

### Data Persistence
- Automatic save to browser's local storage
- Load previous forms on page refresh
- Export forms as JSON files
- Import capability (future enhancement)

### Accessibility
- Semantic HTML
- ARIA labels (can be enhanced)
- Keyboard navigation support
- High contrast colors

## Future Enhancements

- [ ] Form import from JSON
- [ ] Multiple form templates
- [ ] Collaboration features
- [ ] Backend integration
- [ ] Custom field types
- [ ] Form validation rules
- [ ] Conditional logic
- [ ] Email notifications
- [ ] PDF export
- [ ] Mobile app

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is part of the ELevate Labs Internship program.

## Author

Created as part of the ELevate Labs Internship

## Acknowledgments

- Chart.js for beautiful charts
- Font Awesome for icons
- Modern CSS techniques for responsive design
