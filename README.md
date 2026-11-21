# 💪 Fitness Tracker Web Application

A modern, mobile-first fitness tracking web application built with vanilla HTML, CSS, and JavaScript. Features a stunning black and white gradient design with glassmorphism effects and smooth animations.

![Fitness Tracker](https://via.placeholder.com/800x400/000000/FFFFFF?text=Fitness+Tracker)

## ✨ Features

### 🏋️ Workout Tracking
- Select workout type (Push / Pull / Legs / Cardio)
- Add multiple exercises per workout
- Track sets, reps, and weight for each exercise
- View workout history
- Mark workouts as completed

### 🍳 Diet Tracking
- Log meals with predefined food database
- Custom food entry option
- Automatic calorie and protein calculation
- Real-time progress bars for daily targets
- Meal history organized by type (Breakfast, Lunch, Dinner, Snack)

### 📊 Progress Tracking
- Body weight tracking over time
- Visual weight progression chart
- Overall statistics (total workouts, average calories/protein)
- Weight history with trend indicators

### ✅ Daily Checklist
- Track daily habits (Workout, Protein, Water, Steps, Sleep)
- Quick visual overview of daily goals
- One-click toggle for each item

### 💾 Data Persistence
- All data stored in browser LocalStorage
- No backend required
- Data persists across browser sessions
- Works completely offline

## 🎨 Design Features

- **Black & White Gradient Theme**: Sleek, modern aesthetic with gradient backgrounds
- **Glassmorphism Effects**: Semi-transparent cards with backdrop blur
- **Smooth Animations**: Fade-in transitions, gradient shifts, and micro-interactions
- **Mobile-First**: Optimized for mobile devices with touch-friendly buttons
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Premium UI**: Gradient text, animated progress bars, and hover effects

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for running local server) or any HTTP server

### Installation

1. **Clone or download the repository**
   ```bash
   cd fitness-tracker
   ```

2. **Start a local server**

   **Using Python:**
   ```bash
   python -m http.server 8000
   ```

   **Using Node.js (if you have npx):**
   ```bash
   npx http-server -p 8000
   ```

   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   Navigate to: `http://localhost:8000`

## 📁 Project Structure

```
fitness-tracker/
│
├── index.html          # Main HTML file with all views
│
├── css/
│   └── style.css       # Complete styling with gradients & animations
│
├── js/
│   ├── app.js          # Core app logic, navigation, LocalStorage utilities
│   ├── workout.js      # Workout tracking functionality
│   ├── diet.js         # Diet tracking and meal logging
│   ├── progress.js     # Progress tracking and stats
│   └── chart-utils.js  # Vanilla JS charting library
│
└── assets/             # Future assets (icons, images)
```

## 📱 How to Use

### Dashboard
- View today's summary of workouts and calories
- Check off daily habit goals
- See weekly statistics at a glance

### Logging a Workout
1. Navigate to the **Workout** tab
2. Select your workout type (Push/Pull/Legs/Cardio)
3. Click **Add Exercise** and enter exercise name
4. Add sets with reps and weight
5. Click **Add Set** for additional sets
6. Click **Complete Workout** to save

### Logging Meals
1. Navigate to the **Diet** tab
2. Select a food item from the dropdown (or choose "Custom Entry")
3. Select meal type (Breakfast/Lunch/Dinner/Snack)
4. Click **Add Meal**
5. Watch your daily progress bars update automatically

### Tracking Weight
1. Navigate to the **Progress** tab
2. Enter your weight in kg
3. Select the date
4. Click **Log Weight**
5. View your progress on the weight chart

## 💾 Data Storage

All data is stored in your browser's LocalStorage:

```javascript
{
  "workouts": [],      // Array of workout sessions
  "meals": [],         // Array of meal entries
  "bodyWeight": [],    // Array of weight measurements
  "dailyChecklist": {}, // Daily habit tracking
  "settings": {}       // User preferences
}
```

**Note:** Data is stored locally and won't sync across devices. To export your data:
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Copy the data you want to backup

## 🎯 Default Settings

- **Daily Calorie Target**: 2500 kcal
- **Daily Protein Target**: 150g
- **Weight Unit**: kg

To modify these, edit the `getSettings()` function in `js/app.js`.

## 🔮 Future Enhancements

- [ ] Progressive Web App (PWA) support for app-like experience
- [ ] Export data to CSV
- [ ] Cloud sync with Firebase
- [ ] Streak tracking and badges
- [ ] Exercise library with GIFs
- [ ] Workout templates
- [ ] Nutrition goals customization in UI
- [ ] Dark mode toggle
- [ ] Multiple user profiles

## 🛠️ Customization

### Changing Colors
Edit the CSS custom properties in `css/style.css`:

```css
:root {
  --black: #000000;
  --pure-white: #ffffff;
  /* Modify gradient definitions */
  --gradient-primary: linear-gradient(135deg, #000000 0%, #2d2d2d 100%);
}
```

### Adding New Food Items
Edit the `FOOD_DATABASE` object in `js/diet.js`:

```javascript
const FOOD_DATABASE = {
  'your-food-id': { 
    name: 'Food Name', 
    calories: 100, 
    protein: 10 
  }
};
```

### Modifying Default Targets
Edit the `getSettings()` function in `js/app.js`:

```javascript
return getStorage('settings') || {
  calorieTarget: 2500,  // Your target
  proteinTarget: 150,   // Your target
  weightUnit: 'kg'
};
```

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📄 License

This project is open source and available for personal use.

## 🤝 Contributing

Feel free to fork this project and make it your own! Some ideas:
- Add more workout types
- Create preset workout templates
- Add more detailed nutrition tracking (macros, micronutrients)
- Implement workout exercise library
- Add social sharing features

## 💡 Tips

1. **Consistent Logging**: Track workouts and meals daily for best results
2. **Use Custom Entry**: For foods not in the database, use custom entry
3. **Weekly Review**: Check the Progress tab weekly to see trends
4. **Daily Checklist**: Complete the daily checklist every evening
5. **Backup Data**: Periodically export your LocalStorage data

## 🐛 Troubleshooting

**Data not persisting?**
- Check if your browser allows LocalStorage
- Ensure you're not in private/incognito mode

**Charts not showing?**
- Add at least 2 weight entries to see the chart
- Refresh the page if data isn't updating

**Buttons not working?**
- Check browser console (F12) for JavaScript errors
- Make sure all JS files are loaded correctly

## 📞 Support

For issues or feature requests, feel free to create an issue or reach out!

---

**Built with ❤️ using Vanilla JavaScript**

No frameworks. No dependencies. Just pure, clean code.
