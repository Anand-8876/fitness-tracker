// ========================================
// FITNESS TRACKER - WORKOUT MODULE
// ========================================

let currentWorkout = {
    type: null,
    exercises: []
};

// Initialize workout module
document.addEventListener('DOMContentLoaded', () => {
    initWorkoutModule();
});

function initWorkoutModule() {
    // Workout type selection
    const workoutTypeCards = document.querySelectorAll('.workout-type-card');
    workoutTypeCards.forEach(card => {
        card.addEventListener('click', () => selectWorkoutType(card));
    });

    // Add exercise button
    const addExerciseBtn = document.getElementById('addExerciseBtn');
    if (addExerciseBtn) {
        addExerciseBtn.addEventListener('click', addExercise);
    }

    // Save workout button
    const saveWorkoutBtn = document.getElementById('saveWorkoutBtn');
    if (saveWorkoutBtn) {
        saveWorkoutBtn.addEventListener('click', saveWorkout);
    }

    loadWorkoutHistory();
}

// === WORKOUT TYPE SELECTION ===
function selectWorkoutType(card) {
    // Remove selection from all cards
    document.querySelectorAll('.workout-type-card').forEach(c => {
        c.classList.remove('selected');
    });

    // Select clicked card
    card.classList.add('selected');
    currentWorkout.type = card.dataset.type;
}

// === ADD EXERCISE ===
function addExercise() {
    if (!currentWorkout.type) {
        alert('Please select a workout type first!');
        return;
    }

    const exerciseName = prompt('Enter exercise name:');
    if (!exerciseName) return;

    const exercise = {
        id: FitnessApp.generateId(),
        name: exerciseName,
        sets: [{ reps: 10, weight: 0 }]
    };

    currentWorkout.exercises.push(exercise);
    renderExercises();
}

// === RENDER EXERCISES ===
function renderExercises() {
    const exerciseList = document.getElementById('exerciseList');
    if (!exerciseList) return;

    if (currentWorkout.exercises.length === 0) {
        exerciseList.innerHTML = '<p style="color: var(--lighter-gray); text-align: center;">No exercises added yet. Click "Add Exercise" to start!</p>';
        return;
    }

    exerciseList.innerHTML = currentWorkout.exercises.map((exercise, exIndex) => `
    <div class="exercise-item" data-exercise-id="${exercise.id}">
      <div class="exercise-header">
        <div class="exercise-name">${exercise.name}</div>
        <button class="exercise-remove" onclick="removeExercise('${exercise.id}')">✕</button>
      </div>
      
      <div class="set-table">
        ${exercise.sets.map((set, setIndex) => `
          <div class="set-row">
            <div class="set-number">${setIndex + 1}</div>
            <input 
              type="number" 
              class="set-input" 
              placeholder="Reps" 
              value="${set.reps}"
              onchange="updateSet('${exercise.id}', ${setIndex}, 'reps', this.value)"
            />
            <input 
              type="number" 
              class="set-input" 
              placeholder="Weight" 
              value="${set.weight}"
              onchange="updateSet('${exercise.id}', ${setIndex}, 'weight', this.value)"
            />
            <button class="set-remove" onclick="removeSet('${exercise.id}', ${setIndex})">✕</button>
          </div>
        `).join('')}
      </div>
      
      <button class="btn btn-small btn-secondary" onclick="addSet('${exercise.id}')">+ Add Set</button>
    </div>
  `).join('');
}

// === SET OPERATIONS ===
function addSet(exerciseId) {
    const exercise = currentWorkout.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
        exercise.sets.push({ reps: 10, weight: 0 });
        renderExercises();
    }
}

function removeSet(exerciseId, setIndex) {
    const exercise = currentWorkout.exercises.find(ex => ex.id === exerciseId);
    if (exercise && exercise.sets.length > 1) {
        exercise.sets.splice(setIndex, 1);
        renderExercises();
    }
}

function updateSet(exerciseId, setIndex, field, value) {
    const exercise = currentWorkout.exercises.find(ex => ex.id === exerciseId);
    if (exercise && exercise.sets[setIndex]) {
        exercise.sets[setIndex][field] = parseFloat(value) || 0;
    }
}

// === REMOVE EXERCISE ===
function removeExercise(exerciseId) {
    currentWorkout.exercises = currentWorkout.exercises.filter(ex => ex.id !== exerciseId);
    renderExercises();
}

// === SAVE WORKOUT ===
function saveWorkout() {
    if (!currentWorkout.type) {
        alert('Please select a workout type!');
        return;
    }

    if (currentWorkout.exercises.length === 0) {
        alert('Please add at least one exercise!');
        return;
    }

    const workouts = FitnessApp.getStorage('workouts') || [];

    const workout = {
        id: FitnessApp.generateId(),
        date: FitnessApp.getToday(),
        type: currentWorkout.type,
        exercises: currentWorkout.exercises,
        timestamp: new Date().toISOString()
    };

    workouts.push(workout);
    FitnessApp.setStorage('workouts', workouts);

    // Show success message
    const workoutView = document.getElementById('workoutView');
    FitnessApp.showSuccess('✅ Workout saved successfully!', workoutView);

    // Reset current workout
    currentWorkout = {
        type: null,
        exercises: []
    };

    // Clear UI
    document.querySelectorAll('.workout-type-card').forEach(c => {
        c.classList.remove('selected');
    });
    renderExercises();

    // Reload history
    loadWorkoutHistory();

    // Update dashboard
    FitnessApp.updateDashboard();
}

// === LOAD WORKOUT HISTORY ===
function loadWorkoutHistory() {
    const workoutHistory = document.getElementById('workoutHistory');
    if (!workoutHistory) return;

    const workouts = FitnessApp.getStorage('workouts') || [];

    // Get last 5 workouts
    const recentWorkouts = workouts.slice(-5).reverse();

    if (recentWorkouts.length === 0) {
        workoutHistory.innerHTML = '<p style="color: var(--light-gray); text-align: center;">No workouts logged yet. Start your first workout!</p>';
        return;
    }

    workoutHistory.innerHTML = recentWorkouts.map(workout => `
    <div class="meal-item">
      <div class="meal-header">
        <div class="meal-name">${getWorkoutIcon(workout.type)} ${capitalizeFirst(workout.type)}</div>
        <div style="color: var(--lighter-gray); font-size: 0.875rem;">${formatDateDisplay(workout.date)}</div>
      </div>
      <div style="color: var(--lighter-gray); font-size: 0.875rem; margin-top: 0.5rem;">
        ${workout.exercises.length} exercise${workout.exercises.length !== 1 ? 's' : ''} • 
        ${getTotalSets(workout)} sets
      </div>
    </div>
  `).join('');
}

// === HELPER FUNCTIONS ===
function getWorkoutIcon(type) {
    const icons = {
        push: '💪',
        pull: '🔄',
        legs: '🦵',
        cardio: '🏃'
    };
    return icons[type] || '🏋️';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

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
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function getTotalSets(workout) {
    return workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
}

// Make functions globally accessible
window.addSet = addSet;
window.removeSet = removeSet;
window.updateSet = updateSet;
window.removeExercise = removeExercise;
window.loadWorkoutHistory = loadWorkoutHistory;
