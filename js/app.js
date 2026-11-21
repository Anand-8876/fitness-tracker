// ========================================
// FITNESS TRACKER - MAIN APP
// ========================================

// Initialize app on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// === APP INITIALIZATION ===
function initApp() {
  console.log('🚀 Fitness Tracker initialized');
  
  // Initialize navigation
  initNavigation();
  
  // Initialize dashboard
  updateDashboard();
  
  // Set default date inputs to today
  setDefaultDates();
  
  // Load initial data
  loadAllData();
}

// === NAVIGATION ===
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      switchView(view);
      
      // Update active state
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function switchView(viewName) {
  // Hide all views
  const views = document.querySelectorAll('.view');
  views.forEach(view => view.classList.add('hidden'));
  
  // Show selected view
  const targetView = document.getElementById(`${viewName}View`);
  if (targetView) {
    targetView.classList.remove('hidden');
    targetView.classList.add('fade-in');
    
    // Refresh data for the view
    refreshViewData(viewName);
  }
}

function refreshViewData(viewName) {
  switch(viewName) {
    case 'dashboard':
      updateDashboard();
      break;
    case 'workout':
      loadWorkoutHistory();
      break;
    case 'diet':
      updateDietProgress();
      loadTodaysMeals();
      break;
    case 'progress':
      updateProgressStats();
      loadWeightHistory();
      renderWeightChart();
      break;
  }
}

// === DASHBOARD UPDATES ===
function updateDashboard() {
  const today = getToday();
  
  // Update today's stats
  const todayWorkouts = getWorkoutsForDate(today);
  const todayMeals = getMealsForDate(today);
  
  document.getElementById('todayWorkouts').textContent = todayWorkouts.length;
  
  const todayCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
  document.getElementById('todayCalories').textContent = todayCalories;
  
  // Update weekly stats
  updateWeeklyStats();
  
  // Update checklist
  loadDailyChecklist();
}

function updateWeeklyStats() {
  const weekData = getWeekData();
  
  document.getElementById('weekWorkouts').textContent = weekData.totalWorkouts;
  document.getElementById('weekCalories').textContent = Math.round(weekData.avgCalories);
  document.getElementById('weekProtein').textContent = Math.round(weekData.avgProtein);
}

function getWeekData() {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const workouts = getStorage('workouts') || [];
  const meals = getStorage('meals') || [];
  
  const weekWorkouts = workouts.filter(w => {
    const wDate = new Date(w.date);
    return wDate >= weekAgo && wDate <= today;
  });
  
  const weekMeals = meals.filter(m => {
    const mDate = new Date(m.date);
    return mDate >= weekAgo && mDate <= today;
  });
  
  // Calculate daily averages
  const daysWithMeals = new Set(weekMeals.map(m => m.date)).size;
  const totalCalories = weekMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = weekMeals.reduce((sum, m) => sum + m.protein, 0);
  
  return {
    totalWorkouts: weekWorkouts.length,
    avgCalories: daysWithMeals > 0 ? totalCalories / daysWithMeals : 0,
    avgProtein: daysWithMeals > 0 ? totalProtein / daysWithMeals : 0
  };
}

// === DAILY CHECKLIST ===
function loadDailyChecklist() {
  const today = getToday();
  const checklist = getStorage('dailyChecklist') || {};
  const todayChecklist = checklist[today] || {};
  
  const checklistItems = document.querySelectorAll('.checklist-item');
  checklistItems.forEach(item => {
    const itemName = item.dataset.item;
    if (todayChecklist[itemName]) {
      item.classList.add('checked');
    } else {
      item.classList.remove('checked');
    }
    
    // Add click handler
    item.onclick = () => toggleChecklistItem(itemName);
  });
}

function toggleChecklistItem(itemName) {
  const today = getToday();
  const checklist = getStorage('dailyChecklist') || {};
  
  if (!checklist[today]) {
    checklist[today] = {};
  }
  
  checklist[today][itemName] = !checklist[today][itemName];
  setStorage('dailyChecklist', checklist);
  
  loadDailyChecklist();
}

// === LOCAL STORAGE UTILITIES ===
function getStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return null;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
    return false;
  }
}

// === DATE UTILITIES ===
function getToday() {
  const today = new Date();
  return formatDate(today);
}

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function setDefaultDates() {
  const today = getToday();
  const weightDateInput = document.getElementById('weightDate');
  if (weightDateInput) {
    weightDateInput.value = today;
  }
}

// === DATA RETRIEVAL HELPERS ===
function getWorkoutsForDate(date) {
  const workouts = getStorage('workouts') || [];
  return workouts.filter(w => w.date === date);
}

function getMealsForDate(date) {
  const meals = getStorage('meals') || [];
  return meals.filter(m => m.date === date);
}

function getSettings() {
  return getStorage('settings') || {
    calorieTarget: 2500,
    proteinTarget: 150,
    weightUnit: 'kg'
  };
}

function updateSettings(updates) {
  const settings = getSettings();
  const newSettings = { ...settings, ...updates };
  setStorage('settings', newSettings);
  return newSettings;
}

// === LOAD ALL DATA ===
function loadAllData() {
  // This ensures all modules have access to data
  updateDashboard();
}

// === SUCCESS/ERROR MESSAGES ===
function showSuccess(message, container) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  
  if (container) {
    container.insertBefore(successDiv, container.firstChild);
  }
  
  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}

function showError(message, container) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  
  if (container) {
    container.insertBefore(errorDiv, container.firstChild);
  }
  
  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}

// === GENERATE UNIQUE ID ===
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Export functions for use in other modules
window.FitnessApp = {
  getStorage,
  setStorage,
  getToday,
  formatDate,
  getSettings,
  updateSettings,
  showSuccess,
  showError,
  generateId,
  updateDashboard,
  getWorkoutsForDate,
  getMealsForDate
};
