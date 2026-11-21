// ========================================
// FITNESS TRACKER - DIET MODULE
// ========================================

// Food database with nutritional info
const FOOD_DATABASE = {
    'eggs-4': { name: 'Eggs (4)', calories: 280, protein: 24 },
    'oats-100g': { name: 'Oats (100g)', calories: 389, protein: 13 },
    'chicken-200g': { name: 'Chicken Breast (200g)', calories: 330, protein: 62 },
    'rice-150g': { name: 'Rice (150g)', calories: 195, protein: 4 },
    'protein-shake': { name: 'Protein Shake', calories: 120, protein: 25 },
    'banana': { name: 'Banana', calories: 105, protein: 1 },
    'peanut-butter-2tbsp': { name: 'Peanut Butter (2 tbsp)', calories: 188, protein: 8 },
    'milk-250ml': { name: 'Milk (250ml)', calories: 122, protein: 8 },
    'bread-2slice': { name: 'Bread (2 slices)', calories: 160, protein: 6 }
};

// Initialize diet module
document.addEventListener('DOMContentLoaded', () => {
    initDietModule();
});

function initDietModule() {
    const mealForm = document.getElementById('mealForm');
    if (mealForm) {
        mealForm.addEventListener('submit', handleMealSubmit);
    }

    const foodSelect = document.getElementById('foodSelect');
    if (foodSelect) {
        foodSelect.addEventListener('change', handleFoodSelect);
    }

    // Load targets from settings
    const settings = FitnessApp.getSettings();
    document.getElementById('targetCalories').textContent = settings.calorieTarget;
    document.getElementById('targetProtein').textContent = settings.proteinTarget;

    updateDietProgress();
    loadTodaysMeals();
}

// === FOOD SELECTION ===
function handleFoodSelect(e) {
    const customInputs = document.getElementById('customFoodInputs');
    if (e.target.value === 'custom') {
        customInputs.classList.remove('hidden');
    } else {
        customInputs.classList.add('hidden');
    }
}

// === HANDLE MEAL SUBMISSION ===
function handleMealSubmit(e) {
    e.preventDefault();

    const foodSelect = document.getElementById('foodSelect');
    const mealType = document.getElementById('mealType');

    let food;

    if (foodSelect.value === 'custom') {
        // Custom food entry
        const customName = document.getElementById('customFoodName').value;
        const customCalories = parseFloat(document.getElementById('customCalories').value) || 0;
        const customProtein = parseFloat(document.getElementById('customProtein').value) || 0;

        if (!customName) {
            alert('Please enter a food name!');
            return;
        }

        food = {
            name: customName,
            calories: customCalories,
            protein: customProtein
        };
    } else {
        // Predefined food
        if (!foodSelect.value) {
            alert('Please select a food item!');
            return;
        }
        food = FOOD_DATABASE[foodSelect.value];
    }

    const meal = {
        id: FitnessApp.generateId(),
        date: FitnessApp.getToday(),
        type: mealType.value,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        timestamp: new Date().toISOString()
    };

    saveMeal(meal);

    // Reset form
    e.target.reset();
    document.getElementById('customFoodInputs').classList.add('hidden');

    // Show success
    const dietView = document.getElementById('dietView');
    FitnessApp.showSuccess('✅ Meal logged successfully!', dietView);
}

// === SAVE MEAL ===
function saveMeal(meal) {
    const meals = FitnessApp.getStorage('meals') || [];
    meals.push(meal);
    FitnessApp.setStorage('meals', meals);

    updateDietProgress();
    loadTodaysMeals();
    FitnessApp.updateDashboard();
}

// === UPDATE DIET PROGRESS ===
function updateDietProgress() {
    const today = FitnessApp.getToday();
    const todayMeals = FitnessApp.getMealsForDate(today);

    const settings = FitnessApp.getSettings();

    const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalProtein = todayMeals.reduce((sum, meal) => sum + meal.protein, 0);

    // Update displayed values
    document.getElementById('currentCalories').textContent = Math.round(totalCalories);
    document.getElementById('currentProtein').textContent = Math.round(totalProtein);

    // Update progress bars
    const calorieProgress = Math.min((totalCalories / settings.calorieTarget) * 100, 100);
    const proteinProgress = Math.min((totalProtein / settings.proteinTarget) * 100, 100);

    document.getElementById('calorieProgress').style.width = calorieProgress + '%';
    document.getElementById('proteinProgress').style.width = proteinProgress + '%';
}

// === LOAD TODAY'S MEALS ===
function loadTodaysMeals() {
    const mealsList = document.getElementById('mealsList');
    if (!mealsList) return;

    const today = FitnessApp.getToday();
    const todayMeals = FitnessApp.getMealsForDate(today);

    if (todayMeals.length === 0) {
        mealsList.innerHTML = '<p style="color: var(--lighter-gray); text-align: center;">No meals logged today. Start tracking your nutrition!</p>';
        return;
    }

    // Group meals by type
    const mealsByType = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
    };

    todayMeals.forEach(meal => {
        mealsByType[meal.type].push(meal);
    });

    let html = '';

    Object.keys(mealsByType).forEach(type => {
        if (mealsByType[type].length > 0) {
            html += `
        <div style="margin-bottom: 1.5rem;">
          <h4 style="color: var(--white-gray); margin-bottom: 0.5rem; text-transform: capitalize;">
            ${getMealIcon(type)} ${type}
          </h4>
          ${mealsByType[type].map(meal => `
            <div class="meal-item">
              <div class="meal-header">
                <div class="meal-name">${meal.name}</div>
                <button class="exercise-remove" onclick="deleteMeal('${meal.id}')">✕</button>
              </div>
              <div class="meal-stats">
                <div class="meal-stat">🔥 ${meal.calories} cal</div>
                <div class="meal-stat">💪 ${meal.protein}g protein</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
        }
    });

    mealsList.innerHTML = html;
}

// === DELETE MEAL ===
function deleteMeal(mealId) {
    if (!confirm('Delete this meal?')) return;

    let meals = FitnessApp.getStorage('meals') || [];
    meals = meals.filter(m => m.id !== mealId);
    FitnessApp.setStorage('meals', meals);

    updateDietProgress();
    loadTodaysMeals();
    FitnessApp.updateDashboard();
}

// === HELPER FUNCTIONS ===
function getMealIcon(type) {
    const icons = {
        breakfast: '🌅',
        lunch: '☀️',
        dinner: '🌙',
        snack: '🍎'
    };
    return icons[type] || '🍽️';
}

// Make functions globally accessible
window.deleteMeal = deleteMeal;
window.updateDietProgress = updateDietProgress;
window.loadTodaysMeals = loadTodaysMeals;
