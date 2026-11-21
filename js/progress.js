// ========================================
// FITNESS TRACKER - PROGRESS MODULE
// ========================================

// Initialize progress module
document.addEventListener('DOMContentLoaded', () => {
    initProgressModule();
});

function initProgressModule() {
    const weightForm = document.getElementById('weightForm');
    if (weightForm) {
        weightForm.addEventListener('submit', handleWeightSubmit);
    }

    updateProgressStats();
    loadWeightHistory();
    renderWeightChart();
}

// === HANDLE WEIGHT SUBMISSION ===
function handleWeightSubmit(e) {
    e.preventDefault();

    const weightInput = document.getElementById('weightInput');
    const dateInput = document.getElementById('weightDate');

    const weight = parseFloat(weightInput.value);
    const date = dateInput.value;

    if (!weight || weight <= 0) {
        alert('Please enter a valid weight!');
        return;
    }

    if (!date) {
        alert('Please select a date!');
        return;
    }

    const entry = {
        id: FitnessApp.generateId(),
        date: date,
        weight: weight,
        timestamp: new Date().toISOString()
    };

    saveWeight(entry);

    // Reset form
    e.target.reset();
    document.getElementById('weightDate').value = FitnessApp.getToday();

    // Show success
    const progressView = document.getElementById('progressView');
    FitnessApp.showSuccess('✅ Weight logged successfully!', progressView);
}

// === SAVE WEIGHT ===
function saveWeight(entry) {
    let bodyWeight = FitnessApp.getStorage('bodyWeight') || [];

    // Check if entry for this date already exists
    const existingIndex = bodyWeight.findIndex(w => w.date === entry.date);

    if (existingIndex >= 0) {
        // Update existing entry
        bodyWeight[existingIndex] = entry;
    } else {
        // Add new entry
        bodyWeight.push(entry);
    }

    // Sort by date
    bodyWeight.sort((a, b) => new Date(a.date) - new Date(b.date));

    FitnessApp.setStorage('bodyWeight', bodyWeight);

    updateProgressStats();
    loadWeightHistory();
    renderWeightChart();
}

// === UPDATE PROGRESS STATS ===
function updateProgressStats() {
    const workouts = FitnessApp.getStorage('workouts') || [];
    const meals = FitnessApp.getStorage('meals') || [];
    const bodyWeight = FitnessApp.getStorage('bodyWeight') || [];

    // Total workouts
    document.getElementById('totalWorkouts').textContent = workouts.length;

    // Current weight
    if (bodyWeight.length > 0) {
        const latestWeight = bodyWeight[bodyWeight.length - 1];
        document.getElementById('currentWeight').textContent = latestWeight.weight + ' kg';
    } else {
        document.getElementById('currentWeight').textContent = '--';
    }

    // Average calories and protein
    if (meals.length > 0) {
        const uniqueDates = [...new Set(meals.map(m => m.date))];
        const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
        const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);

        const avgCalories = totalCalories / uniqueDates.length;
        const avgProtein = totalProtein / uniqueDates.length;

        document.getElementById('avgCalories').textContent = Math.round(avgCalories);
        document.getElementById('avgProtein').textContent = Math.round(avgProtein);
    } else {
        document.getElementById('avgCalories').textContent = '0';
        document.getElementById('avgProtein').textContent = '0';
    }
}

// === LOAD WEIGHT HISTORY ===
function loadWeightHistory() {
    const weightHistory = document.getElementById('weightHistory');
    if (!weightHistory) return;

    const bodyWeight = FitnessApp.getStorage('bodyWeight') || [];

    if (bodyWeight.length === 0) {
        weightHistory.innerHTML = '<p style="color: var(--lighter-gray); text-align: center;">No weight entries yet. Start tracking your progress!</p>';
        return;
    }

    // Show last 10 entries, most recent first
    const recentEntries = bodyWeight.slice(-10).reverse();

    weightHistory.innerHTML = recentEntries.map((entry, index) => {
        // Calculate change from previous entry
        let change = null;
        if (index < recentEntries.length - 1) {
            const prevWeight = recentEntries[index + 1].weight;
            change = entry.weight - prevWeight;
        }

        return `
      <div class="meal-item">
        <div class="meal-header">
          <div class="meal-name">${entry.weight} kg</div>
          <div style="color: var(--lighter-gray); font-size: 0.875rem;">
            ${formatDateDisplay(entry.date)}
          </div>
        </div>
        ${change !== null ? `
          <div style="margin-top: 0.5rem; font-size: 0.875rem; color: ${change > 0 ? '#ff6b6b' : '#51cf66'};">
            ${change > 0 ? '↑' : '↓'} ${Math.abs(change).toFixed(1)} kg
          </div>
        ` : ''}
        <button class="exercise-remove" style="position: absolute; top: 1rem; right: 1rem;" onclick="deleteWeight('${entry.id}')">✕</button>
      </div>
    `;
    }).join('');
}

// === DELETE WEIGHT ===
function deleteWeight(entryId) {
    if (!confirm('Delete this weight entry?')) return;

    let bodyWeight = FitnessApp.getStorage('bodyWeight') || [];
    bodyWeight = bodyWeight.filter(w => w.id !== entryId);
    FitnessApp.setStorage('bodyWeight', bodyWeight);

    updateProgressStats();
    loadWeightHistory();
    renderWeightChart();
}

// === RENDER WEIGHT CHART ===
function renderWeightChart() {
    const bodyWeight = FitnessApp.getStorage('bodyWeight') || [];

    if (bodyWeight.length === 0) {
        const canvas = document.getElementById('weightChart');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#666666';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('No weight data to display', canvas.width / 2, canvas.height / 2);
        }
        return;
    }

    // Use the chart utility to render
    if (window.ChartUtils) {
        const data = bodyWeight.map(entry => ({
            date: entry.date,
            value: entry.weight
        }));

        window.ChartUtils.renderLineChart('weightChart', data, {
            yLabel: 'Weight (kg)',
            lineColor: '#ffffff',
            gridColor: 'rgba(255, 255, 255, 0.1)',
            textColor: '#e0e0e0'
        });
    }
}

// === HELPER FUNCTIONS ===
function formatDateDisplay(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === FitnessApp.formatDate(today)) {
        return 'Today';
    } else if (dateStr === FitnessApp.formatDate(yesterday)) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

// Make functions globally accessible
window.deleteWeight = deleteWeight;
window.updateProgressStats = updateProgressStats;
window.loadWeightHistory = loadWeightHistory;
window.renderWeightChart = renderWeightChart;
