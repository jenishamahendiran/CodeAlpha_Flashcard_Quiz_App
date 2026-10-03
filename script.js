const STORAGE_KEY = "fitnessTrackerActivities";

const activityForm = document.getElementById("activityForm");
const activityModal = document.getElementById("activityModal");
const openFormBtn = document.getElementById("openFormBtn");
const closeFormBtn = document.getElementById("closeFormBtn");
const clearBtn = document.getElementById("clearBtn");
const activityList = document.getElementById("activityList");

const stepsValue = document.getElementById("stepsValue");
const caloriesValue = document.getElementById("caloriesValue");
const workoutValue = document.getElementById("workoutValue");
const activityCount = document.getElementById("activityCount");

const stepsProgress = document.getElementById("stepsProgress");
const caloriesProgress = document.getElementById("caloriesProgress");
const workoutProgress = document.getElementById("workoutProgress");

const stepsPercent = document.getElementById("stepsPercent");
const caloriesPercent = document.getElementById("caloriesPercent");
const workoutPercent = document.getElementById("workoutPercent");

const dateDisplay = document.getElementById("dateDisplay");

let activities = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function todayKey() {
    const date = new Date();
    return date.toISOString().split("T")[0];
}

function saveActivities() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
}

function getTodayActivities() {
    return activities.filter(activity => activity.date === todayKey());
}

function percentage(value, goal) {
    return Math.min(Math.round((value / goal) * 100), 100);
}

function updateDashboard() {
    const todayActivities = getTodayActivities();

    const totalSteps = todayActivities.reduce((sum, item) => sum + Number(item.steps), 0);
    const totalCalories = todayActivities.reduce((sum, item) => sum + Number(item.calories), 0);
    const totalWorkout = todayActivities.reduce((sum, item) => sum + Number(item.duration), 0);

    stepsValue.textContent = totalSteps.toLocaleString();
    caloriesValue.textContent = totalCalories.toLocaleString();
    workoutValue.textContent = `${totalWorkout} min`;
    activityCount.textContent = todayActivities.length;

    const stepPct = percentage(totalSteps, 10000);
    const caloriePct = percentage(totalCalories, 2000);
    const workoutPct = percentage(totalWorkout, 60);

    stepsProgress.style.width = `${stepPct}%`;
    caloriesProgress.style.width = `${caloriePct}%`;
    workoutProgress.style.width = `${workoutPct}%`;

    stepsPercent.textContent = `${stepPct}%`;
    caloriesPercent.textContent = `${caloriePct}%`;
    workoutPercent.textContent = `${workoutPct}%`;

    renderActivities();
}

function renderActivities() {
    const todayActivities = getTodayActivities();

    if (todayActivities.length === 0) {
        activityList.innerHTML = `
            <div class="empty-state">
                <div>🏋️</div>
                <p>No activities logged yet.</p>
                <small>Click “Add Activity” to get started.</small>
            </div>
        `;
        return;
    }

    activityList.innerHTML = todayActivities
        .slice()
        .reverse()
        .map(activity => `
            <div class="activity">
                <div>
                    <div class="activity-name">${escapeHtml(activity.type)}</div>
                    <div class="activity-meta">
                        ${activity.duration} min · ${activity.calories} kcal · ${Number(activity.steps).toLocaleString()} steps
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteActivity('${activity.id}')" title="Delete activity">🗑</button>
            </div>
        `)
        .join("");
}

function deleteActivity(id) {
    activities = activities.filter(activity => activity.id !== id);
    saveActivities();
    updateDashboard();
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

function openModal() {
    activityModal.classList.remove("hidden");
}

function closeModal() {
    activityModal.classList.add("hidden");
    activityForm.reset();
}

activityForm.addEventListener("submit", event => {
    event.preventDefault();

    const newActivity = {
        id: Date.now().toString(),
        type: document.getElementById("activityType").value,
        duration: Number(document.getElementById("duration").value),
        calories: Number(document.getElementById("calories").value),
        steps: Number(document.getElementById("steps").value),
        date: todayKey()
    };

    activities.push(newActivity);
    saveActivities();
    updateDashboard();
    closeModal();
});

openFormBtn.addEventListener("click", openModal);
closeFormBtn.addEventListener("click", closeModal);

activityModal.addEventListener("click", event => {
    if (event.target === activityModal) {
        closeModal();
    }
});

clearBtn.addEventListener("click", () => {
    const todayActivities = getTodayActivities();

    if (todayActivities.length === 0) {
        return;
    }

    if (confirm("Clear all activities logged today?")) {
        activities = activities.filter(activity => activity.date !== todayKey());
        saveActivities();
        updateDashboard();
    }
});

dateDisplay.textContent = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
});

updateDashboard();
