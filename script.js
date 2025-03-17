// DOM Elements
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const listContainer = document.getElementById('list-container');
const clearAllButton = document.getElementById('clear-all');
const taskCounter = document.getElementById('task-counter');
const completedCount = document.getElementById('completed-count');
const filterOptions = document.querySelectorAll('.filter-option');
const themeToggle = document.getElementById('theme-toggle');
const languageToggle = document.getElementById('language-toggle');
const notificationToggle = document.getElementById('notification-toggle');
const deadlineDateInput = document.getElementById('deadline-date');
const deadlineTimeInput = document.getElementById('deadline-time');
const helpButton = document.getElementById('help-button');
const howToLink = document.getElementById('how-to-link');
const howToDialog = document.getElementById('how-to-dialog');
const gotItButton = document.getElementById('got-it-button');

// Toast and Dialog Elements
const toastContainer = document.getElementById('toast-container');
const confirmDialog = document.getElementById('confirm-dialog');
const dialogTitle = document.getElementById('dialog-title');
const dialogMessage = document.getElementById('dialog-message');
const dialogConfirm = document.getElementById('dialog-confirm');
const dialogCancel = document.getElementById('dialog-cancel');

// Importance options
const importanceOptions = document.querySelectorAll('.importance-option');
let selectedImportance = 'medium'; // Default importance

// Tasks array
let tasks = [];

// Current filter state
let currentFilter = 'all';

// Current language and theme settings
let currentLanguage = localStorage.getItem('language') || 'en'; // 'hi' for Hindi, 'en' for English
let currentTheme = localStorage.getItem('theme') || 'light';
let notificationsEnabled = localStorage.getItem('notifications') === 'enabled';

// Notification timers storage
const notificationTimers = {};

// Language translations
const translations = {
    hi: {
        appTitle: 'टास्कबेल - आपका स्मार्ट टास्क मैनेजर',
        addTaskPlaceholder: 'आपको क्या करने की आवश्यकता है?',
        addButton: 'टास्क जोड़ें',
        allFilter: 'सभी',
        activeFilter: 'सक्रिय',
        completedFilter: 'पूर्ण',
        clearAll: 'सभी हटाएं',
        taskStats: 'कार्य पूर्ण:',
        emptyTaskAlert: 'अरे भाई, कुछ तो लिखो! खाली टास्क क्या करेंगे?',
        deadlineAlert: 'डेडलाइन तो सेट करो यार! टाइम मैनेजमेंट जरूरी है!',
        invalidDateAlert: 'ये कौनसी तारीख है भाई? सही तारीख डालो!',
        changeLanguage: 'भाषा बदलें / Change Language',
        changeTheme: 'थीम बदलें',
        taskAdded: 'बढ़िया! टास्क जोड़ दिया। अब कर भी लेना, सिर्फ लिखने से कुछ नहीं होता!',
        taskDeleted: 'टास्क डिलीट कर दिया! बिना किए ही मिटा दिया? वाह भाई वाह!',
        allTasksCleared: 'सब कुछ साफ़! स्लेट क्लीन कर दी! अब नई शुरुआत!',
        taskCompleted: 'शाबाश! एक काम तो पूरा किया! अब अगले वाला भी कर लो!',
        showingAllTasks: 'अब सभी टास्क दिखा रहे हैं!',
        showingActiveTasks: 'सिर्फ अधूरे काम दिखा रहे हैं! इन्हें जल्दी पूरा करो!',
        showingCompletedTasks: 'पूरे किए हुए काम! आपका स्कोरकार्ड!',
        deleteTaskTitle: 'टास्क हटाएं',
        deleteTaskConfirm: 'क्या आप वाकई इस टास्क को बिना पूरा किए हटाना चाहते हैं? सोच लो...',
        clearAllTasksTitle: 'सभी टास्क हटाएं',
        clearAllTasksConfirm: 'सारे टास्क मिटा दोगे? पक्का? रिकॉर्ड भी खत्म हो जाएगा!',
        deadlineLabel: 'समय सीमा:',
        todaysTasks: 'आज के काम',
        addNewTask: 'नया काम जोड़ें',
        taskName: 'काम का नाम',
        deadlineInput: 'डेडलाइन',
        importanceLevel: 'महत्व स्तर',
        low: 'कम',
        medium: 'मध्यम',
        high: 'उच्च',
        filterTasks: 'काम फ़िल्टर करें',
        yourTasks: 'आपके काम',
        howToComplete: 'कैसे पूरा करें?',
        noTasksYet: 'अभी कोई काम नहीं',
        addFirstTask: 'पहला काम जोड़कर जिंदगी में कुछ करें!',
        notificationsEnabled: 'नोटिफिकेशन चालू! अब बहाना नहीं चलेगा!',
        notificationsDisabled: 'नोटिफिकेशन बंद! टाइम भूलना आसान हो गया!',
        taskDue: 'अरे भाई! "{task}" का टाइम हो गया! जल्दी करो!',
        timeHalfGone: 'आधा टाइम खत्म हो गया भाई! "{task}" पर ध्यान दो, रील्स देखना बंद करो!',
        timeMostlyGone: 'बस 10% टाइम बचा है! जल्दी करो! "{task}" अभी अधूरा है!',
        procrastinating: 'टालमटोल करने से काम नहीं होगा! "{task}" पूरा करो!',
        greatJob: 'वाह भाई वाह! टाइम से पहले "{task}" पूरा कर लिया!',
        dateLabel: 'तारीख',
        timeLabel: 'समय'
    },
    en: {
        appTitle: 'TASKBELL - Your Smart Task Manager',
        addTaskPlaceholder: 'What do you need to do?',
        addButton: 'Add Task',
        allFilter: 'All',
        activeFilter: 'Active',
        completedFilter: 'Completed',
        clearAll: 'Clear All',
        taskStats: 'Tasks completed:',
        emptyTaskAlert: 'Bhai kuch to likho! Empty task kya add karoge?',
        deadlineAlert: 'Deadline to set karo yaar! Time management zaroori hai!',
        invalidDateAlert: 'Ye kaisi date hai bhai? Valid date daalo!',
        changeLanguage: 'Change Language / भाषा बदलें',
        changeTheme: 'Change Theme',
        taskAdded: 'Task added successfully! Ab complete bhi kar dena, sirf likhne se kuch nahi hoga!',
        taskDeleted: 'Task deleted! Bina kiye hi delete kar diya? Waah bhai waah!',
        allTasksCleared: 'All tasks cleared! Slate clean kar di! Ab nayi shuruwat!',
        taskCompleted: 'Shabash! Ek kaam to poora kiya! Ab agla wala bhi kar lo!',
        showingAllTasks: 'Showing all tasks!',
        showingActiveTasks: 'Showing only pending kaam! Inhe jaldi poora karo!',
        showingCompletedTasks: 'Showing completed tasks! Aapka scorecard!',
        deleteTaskTitle: 'Delete Task',
        deleteTaskConfirm: 'Are you sure you want to delete this task without completing it? Soch lo...',
        clearAllTasksTitle: 'Clear All Tasks',
        clearAllTasksConfirm: 'Saare tasks mita doge? Pakka? Record bhi khatm ho jayega!',
        deadlineLabel: 'Deadline:',
        todaysTasks: 'Today\'s Tasks',
        addNewTask: 'Add New Task',
        taskName: 'Task Name',
        deadlineInput: 'Deadline',
        importanceLevel: 'Importance Level',
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        filterTasks: 'Filter Tasks',
        yourTasks: 'Your Tasks',
        howToComplete: 'How to complete?',
        noTasksYet: 'No Tasks Yet',
        addFirstTask: 'Add your first task to get started with life!',
        notificationsEnabled: 'Notifications enabled! Ab bahana nahi chalega!',
        notificationsDisabled: 'Notifications disabled! Time bhoolna aasan ho gaya!',
        taskDue: 'Arre bhai! "{task}" ka time ho gaya! Jaldi karo!',
        timeHalfGone: 'Aadha time khatam ho gaya bhai! "{task}" pe dhyan do, reels dekhna band karo!',
        timeMostlyGone: 'Only 10% time left! Jaldi karo! "{task}" is still pending!',
        procrastinating: 'Procrastination se kaam nahi hoga! Complete "{task}" now!',
        greatJob: 'Waah bhai waah! "{task}" completed before time!',
        dateLabel: 'Date',
        timeLabel: 'Time'
    }
};

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
    updateTaskCount();
    updateEmptyState();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskCount();
    updateEmptyState();
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    const deadlineDate = deadlineDateInput.value;
    const deadlineTime = deadlineTimeInput.value || '23:59'; // Default to end of day if time not set
    
    if (taskText === '') {
        showToast(translations[currentLanguage].emptyTaskAlert, 'error');
        return;
    }

    if (deadlineDate === '') {
        showToast(translations[currentLanguage].deadlineAlert, 'error');
        return;
    }
    
    // Combine date and time
    const deadline = `${deadlineDate}T${deadlineTime}`;
    const deadlineDateTime = new Date(deadline);
    
    if (isNaN(deadlineDateTime.getTime())) {
        showToast(translations[currentLanguage].invalidDateAlert, 'error');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        deadline: deadline,
        completed: false,
        importance: selectedImportance,
        createdAt: new Date().toISOString(),
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    // Reset form
    taskInput.value = '';
    deadlineDateInput.value = '';
    deadlineTimeInput.value = '';
    setImportance('medium');

    // Schedule notifications for the task
    scheduleNotifications(task);

    showToast(translations[currentLanguage].taskAdded, 'success');
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(currentLanguage === 'hi' ? 'hi-IN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Calculate time remaining until deadline or completion time
function calculateTimeRemaining(targetDate) {
    const now = new Date();
    const target = new Date(targetDate);
    const diffMs = target - now;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    return diffMinutes;
}

// Format time to display
function formatTimeLeft(minutesLeft) {
    if (minutesLeft <= 0) return 'Time is up!';
    
    const days = Math.floor(minutesLeft / (24 * 60));
    const hours = Math.floor((minutesLeft % (24 * 60)) / 60);
    const minutes = Math.floor(minutesLeft % 60);
    
    let formattedTime = '';
    if (days > 0) formattedTime += `${days}d `;
    if (hours > 0 || days > 0) formattedTime += `${hours}h `;
    formattedTime += `${minutes}m`;
    
    return formattedTime;
}

// Calculate progress percentage
function calculateProgress(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    
    const totalDuration = deadlineDate - now;
    if (totalDuration <= 0) return 100; // Past deadline
    
    const totalTimeNeeded = deadlineDate - new Date(0); // Use a fixed starting point
    const progress = Math.min(100, 100 - ((totalDuration / totalTimeNeeded) * 100));
    return progress;
}

// Render tasks
function renderTasks() {
    listContainer.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        
        // Add importance class
        li.classList.add(`importance-${task.importance}`);
        
        if (task.completed) {
            li.classList.add('checked');
        }
        
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        
        // Create custom checkbox
        const checkboxCustom = document.createElement('div');
        checkboxCustom.className = 'checkbox-custom';
        
        const checkIcon = document.createElement('i');
        checkIcon.className = 'fas fa-check';
        checkboxCustom.appendChild(checkIcon);
        
        // Create task text
        const p = document.createElement('p');
        p.textContent = task.text;
        
        // Create task info section
        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';
        
        // Create deadline display
        const deadlineDisplay = document.createElement('div');
        deadlineDisplay.className = 'task-deadline';
        
        const deadlineIcon = document.createElement('i');
        deadlineIcon.className = 'far fa-calendar-alt';
        
        const deadlineText = document.createElement('span');
        deadlineText.textContent = `${translations[currentLanguage].deadlineLabel} ${formatDate(task.deadline)}`;
        
        deadlineDisplay.appendChild(deadlineIcon);
        deadlineDisplay.appendChild(deadlineText);
        
        // Add importance indicator
        const importanceDisplay = document.createElement('div');
        importanceDisplay.className = 'task-importance';
        
        const importanceIndicator = document.createElement('span');
        importanceIndicator.className = `importance-indicator ${task.importance}`;
        
        let importanceText;
        switch(task.importance) {
            case 'low':
                importanceText = translations[currentLanguage].low;
                break;
            case 'medium':
                importanceText = translations[currentLanguage].medium;
                break;
            case 'high':
                importanceText = translations[currentLanguage].high;
                break;
        }
        
        const importanceTextSpan = document.createElement('span');
        importanceTextSpan.textContent = importanceText + ' ' + translations[currentLanguage].importanceLevel;
        
        importanceDisplay.appendChild(importanceIndicator);
        importanceDisplay.appendChild(importanceTextSpan);
        
        // Create progress bar
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressText = document.createElement('div');
        progressText.className = 'progress-text';
        
        if (!task.completed) {
            // Calculate progress
            const progress = calculateProgress(task.deadline);
            const timeRemaining = calculateTimeRemaining(task.deadline);
            
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.floor(progress)}% - ${formatTimeLeft(timeRemaining)} left`;
            
            // Set color based on progress
            if (progress < 50) {
                progressBar.style.background = 'var(--low-color)';
            } else if (progress < 90) {
                progressBar.style.background = 'var(--medium-color)';
            } else {
                progressBar.style.background = 'var(--high-color)';
            }
        } else {
            progressBar.style.width = '100%';
            progressBar.style.background = 'var(--success-color)';
            progressText.textContent = 'Completed';
        }
        
        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(progressText);
        
        // Create delete button
        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-btn';
        
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-times';
        deleteBtn.appendChild(deleteIcon);
        
        // Add event listener to delete button
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        // Add event listener to checkbox
        checkbox.addEventListener('change', () => toggleComplete(task.id));
        
        // Add all elements to the task item
        li.appendChild(checkbox);
        li.appendChild(checkboxCustom);
        li.appendChild(p);
        
        taskInfo.appendChild(deadlineDisplay);
        taskInfo.appendChild(importanceDisplay);
        
        li.appendChild(taskInfo);
        li.appendChild(progressContainer);
        li.appendChild(deleteBtn);
        
        listContainer.appendChild(li);
    });
}

// Sarcastic but appropriate quotes
const completionQuotes = [
    "Finally done, ab agla kaam sirf 3 baar postpone karna!",
    "Great work! Ab coffee break le lo, waise bhi productivity quota exceed ho gaya!",
    "Task complete! Ab Netflix chalu karo, reward deserved hai!",
    "Congrats! Is productivity ko screenshot leke social media pe post karo!",
    "Kya baat hai! One task down, sirf 28436 tasks to go!",
    "Task complete kar diya? Yeh toh miracle ho gaya!",
    "Achievement unlocked: Adulting for 5 minutes straight!",
    "Waah! Ab khud ko treat do, productivity deserve karti hai treat!",
    "Completed! Itna productive toh aap interview ke din bhi nahi hote!",
    "Task done! Now treat yourself to 5 hours of doing absolutely nothing!"
];

const procrastinationJokes = [
    "Procrastination Olympics mein Gold Medal jeetne ki koshish chal rahi hai?",
    "Task ko kal karne ka plan, aaj se 3 hafte pehle banaya tha!",
    "Deadline approaching faster than your excuses!",
    "Kal karo, kal karo... yesterday you said tomorrow!",
    "Aaj productive ban-ne ka plan, kal se shuru karne wale ho?",
    "Motivation dhundh rahe ho? Try deadline terror, works every time!",
    "Aapka procrastination game kisi champion se kam nahi!",
    "Coffee pi lo, fir shuru karenge... said you 5 coffees ago!",
    "Kaam karne ka mann nahi? Welcome to the club, we meet never!",
    "Yeh task apne aap complete ho jayega... said no one ever!"
];

const deletionQuotes = [
    "Task deleted! Ignorance is bliss, right?",
    "Task gone! Kabhi kabhi reality se bhaagna bhi zaroori hai!",
    "Congratulations! You've mastered the art of selective responsibility!",
    "Task: Adios! I wasn't planning to do it anyway!",
    "Phew! Ek aur task se chutkara! Life is all about priorities!",
    "Task ko ignore karna is a skill, and you're mastering it!",
    "Deleted! Ab mental peace milega... for about 5 minutes!",
    "Task ka weight kam ho gaya! Ab sirf guilt handle karna hai!",
    "Task gone, but the guilt remains! Enjoy the paradox!",
    "Successfully unburdened yourself! That's self-care... kinda!"
];

const morningQuotes = [
    "Good morning! Coffee ho gayi? Ab kaam shuru karo!",
    "Subah ho gayi, kaam karne ka waqt aa gaya! Unfortunately...",
    "Morning routine complete? Ab procrastination routine start karo!",
    "Alarm ke saath uthna was the easy part, kaam karna is the real challenge!",
    "Rise and shine! Yaa fir rise and scroll through phone for another hour...",
    "Good morning! Aaj ka plan: Coffee, Procrastinate, Panic, Coffee again!",
    "Morning motivation alert! Kaam kar lo warna boss daantega!",
    "New day, new tasks, same procrastination! Let's do this... later!",
    "Aaj productive day hai! Said you every morning for the past year!",
    "Morning reminder: Those tasks won't complete themselves! Unfortunately..."
];

const eveningSlackingQuotes = [
    "Evening ho gayi, abhi tak kitna kaam hua? Just asking, no pressure!",
    "Shaam ho gayi, lagta hai deadline ab nightmare banegi!",
    "Evening reminder: Time flies when you're procrastinating!",
    "Sunset ho raha hai, aur aapka task list bhi waise ka waisa hi hai!",
    "Kaam khatam nahi hua? No worries, night shift champion ban jao!",
    "Shaam ho gayi! Ab panic mode activate karne ka time aa gaya!",
    "Evening alert: Miracle expect kar rahe ho to complete everything?",
    "Chai break lene ka perfect time! 10th time in a day!",
    "Tension mat lo, deadline toh kal subah hai... oh wait, it's today!",
    "Evening memo: Goal set karna easy hai, achieve karna mushkil!"
];

const weekendReminders = [
    "Weekend hai, but these tasks aren't going to finish themselves!",
    "Weekend mein bhi kaam? Work-life balance has left the chat!",
    "Enjoy your weekend! Those tasks will wait patiently till Monday!",
    "Weekend alert: Netflix ke beech mein thoda kaam bhi kar lena!",
    "Weekend par tasks complete karne wale log - you're built different!",
    "Weekend warrior mode: on! Tasks ko tackle karne ka time aa gaya!",
    "Weekend reminder: Monday tak deadline hai doesn't mean Monday ko karo!",
    "Aaj relax karo, kal kaam karenge... weekend edition!",
    "Weekend par bhi notifications? Sorry for disturbing your peace!",
    "Tasks on weekend? Work-life balance has gone for a vacation!"
];

const dueDateQuotes = [
    "Deadline aa gayi! Ab panic mode activate karo!",
    "Time's up! Ab excuse ready rakhiye!",
    "Deadline today! Time for the famous last-minute sprint!",
    "Due date arrived! Ab miracle hi bacha sakta hai!",
    "Deadline knocking! Ready ho jao last minute all-nighter ke liye!",
    "Time khatam! Ab boss ko kaunsa excuse doge?",
    "Due date reached! Ab to supernatural speed chahiye completion ke liye!",
    "It's D-Day for your task! May the odds be ever in your favor!",
    "Deadline is here! Ab to coffee IV drip lagani padegi!",
    "Time up! Ab regret karo ki 2 hafte pehle kyun start nahi kiya!"
];

const halfwayQuotes = [
    "Aadha time khatam! Task kitna hua? Asking for a friend!",
    "Time half gone! Ab panic meter check karo!",
    "Halfway mark reached! Ab double speed chahiye!",
    "50% time gone, kitna progress hua? 5%? Typical!",
    "Time aadha ho gaya! Ab productivity booster activate karo!",
    "Half the time is gone! Classic time to start panicking!",
    "Time running fast! Abhi bhi social media check kar rahe ho?",
    "Midway alert! Ab to caffeine overdose lene ka time aa gaya!",
    "Time half gone! Ab regret shuru hoga ki pehle kyun nahi start kiya!",
    "Halfway point! Perfect time to realize you're in trouble!"
];

const almostDoneQuotes = [
    "Deadline approaching! Ab to bhagwan hi bacha sakta hai!",
    "Time almost up! Coffee machine ready rakho!",
    "Last warning! Deadline aane wali hai, ready ho?",
    "Final stretch! Ab supernatural powers chahiye hongi!",
    "80% time gone! Ab miracles expect kar rahe ho?",
    "Deadline approaching! Perfect time for a coffee and panic combo!",
    "Time running out! Ab to Flash ki speed chahiye!",
    "Final countdown started! Emergency plan B ready karo!",
    "Almost there! Ab raat bhar jagkar complete karna padega!",
    "Last warning! Deadline se pehle complete karo, ya excuse ready rakho!"
];

// Add sarcastic toast message arrays
const sarcasticCompleteQuotes = [
    "Task complete! Did you expect a medal or something?",
    "Look at you being all productive today!",
    "Another task bites the dust. Your mom would be so proud.",
    "Task finished. The world is now a better place.",
    "Achievement unlocked: Basic adult functionality!",
    "Congrats! You did the absolute minimum expected of you.",
    "Task completed. Now treat yourself to 5 seconds of happiness.",
    "Done! Should I alert the media about your accomplishment?",
    "Wow, you actually finished something. Impressive.",
    "Task complete! Your productivity coach would be less disappointed today."
];

const sarcasticDeleteQuotes = [
    "Task deleted. As if it never existed, like your gym membership.",
    "Poof! Gone faster than your motivation on Monday mornings.",
    "Task deleted. The easiest way to complete things, isn't it?",
    "Another one bites the dust. Marie Kondo would be proud.",
    "Task successfully yeeted into the digital void.",
    "Task? What task? I don't see any task here.",
    "Task deleted. Procrastination: 1, Productivity: 0",
    "Gone! Like your plans to wake up early tomorrow.",
    "Task deleted. The digital equivalent of sweeping it under the rug.",
    "That task just got Thanos-snapped out of existence."
];

const sarcasticNotiQuotes = [
    "Hey! Remember that thing you were supposed to do?",
    "Your task is feeling neglected. Pay attention to it!",
    "Tick tock! Your deadline doesn't care about your excuses.",
    "This task isn't going to complete itself, you know.",
    "Your future self is already annoyed you haven't done this yet.",
    "Still procrastinating? That's a bold strategy, Cotton.",
    "Your task is wondering why you're ignoring it.",
    "Friendly reminder: Deadlines exist for a reason!",
    "This notification is basically your task giving you side-eye.",
    "Your task called. It's feeling lonely without your attention."
];

// Get random quote from array
function getRandomQuote(quoteArray) {
    const randomIndex = Math.floor(Math.random() * quoteArray.length);
    return quoteArray[randomIndex];
}

// Get time-appropriate random quote
function getTimeBasedQuote() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Weekend check (Saturday = 6, Sunday = 0)
    if (day === 0 || day === 6) {
        return getRandomQuote(weekendReminders);
    }
    
    // Time-based quotes
    if (hour >= 5 && hour < 12) {
        return getRandomQuote(morningQuotes);
    } else if (hour >= 16 && hour < 20) {
        return getRandomQuote(eveningSlackingQuotes);
    } else {
        return getRandomQuote(procrastinationJokes);
    }
}

// Toggle task completion status
function toggleComplete(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) return;
    
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    
    if (tasks[taskIndex].completed) {
        // Cancel any scheduled notifications
        if (tasks[taskIndex].notificationId) {
            clearTimeout(tasks[taskIndex].notificationId);
            tasks[taskIndex].notificationId = null;
        }
        
        // Show a toast with a sarcastic message
        const randomQuote = completionQuotes[Math.floor(Math.random() * completionQuotes.length)];
        showToast(randomQuote, 'success');
        
        // Add animation to show just completed
        const taskElement = document.querySelector(`li[data-id="${id}"]`);
        if (taskElement) {
            taskElement.classList.add('just-completed');
            setTimeout(() => {
                taskElement.classList.remove('just-completed');
            }, 1000);
        }
    } else {
        // Task unmarked, schedule notifications again
        scheduleNotifications(tasks[taskIndex]);
    }
    
    saveTasks();
    renderTasks();
    updateTaskCount();
}

// Delete a task
function deleteTask(id) {
    showConfirmDialog(
        'Delete Task?',
        'Are you sure you want to delete this task? This cannot be undone.'
    ).then(confirmed => {
        if (confirmed) {
            const taskIndex = tasks.findIndex(task => task.id === id);
            
            if (taskIndex !== -1) {
                // Cancel any scheduled notifications
                if (tasks[taskIndex].notificationId) {
                    clearTimeout(tasks[taskIndex].notificationId);
                }
                
                // Remove the task
                tasks.splice(taskIndex, 1);
                saveTasks();
                renderTasks();
                updateTaskCount();
                
                // Show a toast with a sarcastic message
                const randomQuote = deletionQuotes[Math.floor(Math.random() * deletionQuotes.length)];
                showToast(randomQuote, 'info');
            }
        }
    });
}

// Update task count
function updateTaskCount() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    
    taskCounter.textContent = total;
    completedCount.textContent = completed;
    
    // Also update the task stats display to ensure consistency
    const taskStats = document.querySelector('.task-stats');
    if (taskStats) {
        taskStats.innerHTML = `<span id="completed-count">${completed}</span>/<span id="task-counter">${total}</span> ${translations[currentLanguage].taskStats}`;
    }
    
    // Check if we need to show/hide the empty state
    updateEmptyState();
}

// Update empty state visibility
function updateEmptyState() {
    const emptyState = document.getElementById('empty-state');
    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}

// Set importance
function setImportance(importance) {
    selectedImportance = importance;
    
    importanceOptions.forEach(option => {
        if (option.getAttribute('data-importance') === importance) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// Show toast notification - Only when relevant
function showToast(message, type = 'info') {
    // Don't show redundant toasts for the same user action
    const existingToasts = Array.from(toastContainer.querySelectorAll('.toast'));
    for (const existingToast of existingToasts) {
        if (existingToast.querySelector('span').textContent === message) {
            return; // Skip duplicates
        }
    }
    
    // Limit the number of toasts shown simultaneously
    if (existingToasts.length >= 3) {
        const oldestToast = existingToasts[0];
        oldestToast.classList.remove('show');
        oldestToast.classList.add('hide');
        setTimeout(() => {
            if (oldestToast.parentNode === toastContainer) {
                toastContainer.removeChild(oldestToast);
            }
        }, 500);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon;
    switch(type) {
        case 'success':
            icon = 'check-circle';
            break;
        case 'error':
            icon = 'exclamation-circle';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            break;
        default:
            icon = 'info-circle';
    }
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger reflow
    toast.offsetHeight;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide and remove toast after timeout
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        
        setTimeout(() => {
            if (toast.parentNode === toastContainer) {
                toastContainer.removeChild(toast);
            }
        }, 500);
    }, 3000);
}

// Show confirmation dialog
function showConfirmDialog(title, message) {
    return new Promise((resolve) => {
        dialogTitle.textContent = title;
        dialogMessage.textContent = message;
        confirmDialog.classList.add('active');

        const handleConfirm = () => {
            confirmDialog.classList.remove('active');
            cleanup();
            resolve(true);
        };

        const handleCancel = () => {
            confirmDialog.classList.remove('active');
            cleanup();
            resolve(false);
        };

        const cleanup = () => {
            dialogConfirm.removeEventListener('click', handleConfirm);
            dialogCancel.removeEventListener('click', handleCancel);
            document.removeEventListener('keydown', handleKeydown);
        };
        
        const handleKeydown = (e) => {
            if (e.key === 'Escape') handleCancel();
            if (e.key === 'Enter') handleConfirm();
        };

        dialogConfirm.addEventListener('click', handleConfirm);
        dialogCancel.addEventListener('click', handleCancel);
        document.addEventListener('keydown', handleKeydown);
    });
}

// Request notification permission
function requestNotificationPermission() {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
        showToast("Oops! Your browser doesn't support notifications. Time to upgrade your browser!", "error");
        notificationToggle.classList.remove('on');
        localStorage.setItem('notifications', 'disabled');
        return Promise.resolve(false);
    }
    
    // On mobile, we need to use a different approach
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (Notification.permission === "granted") {
        return Promise.resolve(true);
    } else if (Notification.permission === "denied") {
        // For mobile devices, provide more specific instructions
        if (isMobile) {
            showToast("Please enable notifications in your device settings for this website", "warning");
        } else {
            showToast("Notification access denied! Check your browser settings to enable notifications", "warning");
        }
        notificationToggle.classList.remove('on');
        localStorage.setItem('notifications', 'disabled');
        return Promise.resolve(false);
    }
    
    return Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            showToast("Notifications are now on! I'll be your personal reminder!", "success");
            return true;
        } else {
            // For mobile, show more helpful message
            if (isMobile) {
                showToast("To enable notifications, go to your browser settings and allow notifications for this site", "info");
            } else {
                showToast("You'll need to enable notifications in your browser settings", "info");
            }
            notificationToggle.classList.remove('on');
            localStorage.setItem('notifications', 'disabled');
            return false;
        }
    });
}

// Toggle notifications
function toggleNotifications() {
    const isCurrentlyEnabled = notificationToggle.classList.contains('on');
    
    if (isCurrentlyEnabled) {
        // Turn off notifications
        notificationToggle.classList.remove('on');
        notificationToggle.classList.add('off');
        
        // Add transition animation to icon
        const icon = notificationToggle.querySelector('i');
        icon.classList.remove('fa-bounce');
        icon.style.opacity = '0.6';
        setTimeout(() => {
            icon.className = 'fas fa-bell-slash';
            icon.style.opacity = '1';
        }, 150);
        
        localStorage.setItem('notifications', 'disabled');
        
        // Cancel all scheduled notifications
        tasks.forEach(task => {
            if (task.notificationId) {
                clearTimeout(task.notificationId);
                task.notificationId = null;
            }
        });
        saveTasks();
        showToast("Notifications turned off. No more nagging from me!", "info");
    } else {
        // Request permission and turn on if granted
        requestNotificationPermission().then(granted => {
            if (granted) {
                notificationToggle.classList.add('on');
                notificationToggle.classList.remove('off');
                
                // Add transition animation to icon
                const icon = notificationToggle.querySelector('i');
                icon.classList.remove('fa-bounce');
                icon.style.opacity = '0.6';
                setTimeout(() => {
                    icon.className = 'fas fa-bell';
                    icon.style.opacity = '1';
                }, 150);
                
                localStorage.setItem('notifications', 'enabled');
                
                // Schedule notifications for all uncompleted tasks
                tasks.forEach(task => {
                    if (!task.completed) {
                        scheduleNotifications(task);
                    }
                });
                saveTasks();
                
                // Add toast message for turning on notifications
                showToast("Notifications are now on! I'll be your personal reminder!", "success");
            }
        });
    }
}

// Send notification
function sendNotification(title, message) {
    if (!("Notification" in window)) {
        return;
    }
    
    // Choose appropriate quote based on context
    let additionalMessage = "";
    
    if (message.includes("due")) {
        additionalMessage = ` ${dueDateQuotes[Math.floor(Math.random() * dueDateQuotes.length)]}`;
    } else if (message.includes("halfway") || message.includes("50%")) {
        additionalMessage = ` ${halfwayQuotes[Math.floor(Math.random() * halfwayQuotes.length)]}`;
    } else if (message.includes("80%")) {
        additionalMessage = ` ${almostDoneQuotes[Math.floor(Math.random() * almostDoneQuotes.length)]}`;
    }
    
    // Create custom SVG logo for notifications - simplified bell
    const svgLogo = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#FF6B00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12,2 C9,2 6,4 6,9 L6,13 L4,16 L20,16 L18,13 L18,9 C18,4 15,2 12,2 Z" fill="rgba(255, 107, 0, 0.08)" />
        <path d="M9,16 C9,18.5 10.5,20 12,20 C13.5,20 15,18.5 15,16" />
        <circle cx="12" cy="9" r="4" fill="rgba(255, 107, 0, 0.08)" />
    </svg>`;
    
    // Convert SVG to blob URL for notification icon
    const blob = new Blob([svgLogo], {type: 'image/svg+xml'});
    const iconUrl = URL.createObjectURL(blob);
    
    // Check if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Create and show the notification
    if (Notification.permission === "granted") {
        // Use different options for mobile
        const notificationOptions = {
            body: message + additionalMessage,
            icon: iconUrl,
            vibrate: isMobile ? [100, 50, 100] : undefined, // Add vibration for mobile
            requireInteraction: !isMobile, // On desktop, require interaction to dismiss
            silent: false // Play sound
        };
        
        const notification = new Notification(title, notificationOptions);
        
        notification.onclick = function() {
            window.focus();
            this.close();
            URL.revokeObjectURL(iconUrl); // Clean up the blob URL
        };
        
        // Clean up the blob URL after notification timeout
        setTimeout(() => {
            URL.revokeObjectURL(iconUrl);
        }, 10000);
    }
}

// Schedule notifications for a task
function scheduleNotifications(task) {
    if (!notificationsEnabled || task.completed) return;
    
    // Clear existing timers for this task
    if (notificationTimers[task.id]) {
        notificationTimers[task.id].forEach(timer => clearTimeout(timer));
    }
    
    notificationTimers[task.id] = [];
    
    const now = new Date().getTime();
    const deadlineTime = new Date(task.deadline).getTime();
    
    // Schedule deadline notification
    if (deadlineTime > now) {
        const timer = setTimeout(() => {
            const message = translations[currentLanguage].taskDue.replace('{task}', task.text);
            sendNotification(translations[currentLanguage].appTitle, message);
        }, deadlineTime - now);
        notificationTimers[task.id].push(timer);
        
        // Also schedule notifications at 50% and 90% of the time to deadline
        const timeRemaining = deadlineTime - now;
        
        // 50% notification
        if (timeRemaining > 0) {
            const halfwayTime = now + (timeRemaining * 0.5);
            const timer50 = setTimeout(() => {
                const message = translations[currentLanguage].timeHalfGone.replace('{task}', task.text);
                sendNotification(translations[currentLanguage].appTitle, message);
            }, halfwayTime - now);
            notificationTimers[task.id].push(timer50);
        }
        
        // 90% notification
        if (timeRemaining > 0) {
            const ninetyPercentTime = now + (timeRemaining * 0.9);
            const timer90 = setTimeout(() => {
                const message = translations[currentLanguage].timeMostlyGone.replace('{task}', task.text);
                sendNotification(translations[currentLanguage].appTitle, message);
            }, ninetyPercentTime - now);
            notificationTimers[task.id].push(timer90);
        }
        
        // Random procrastination check (between 30-70% of time at random intervals)
        if (timeRemaining > 0) {
            // Add 2-3 random reminders
            const numReminders = 2 + Math.floor(Math.random() * 2);
            
            for (let i = 0; i < numReminders; i++) {
                const randomPercentage = 0.3 + (Math.random() * 0.4); // Between 30% and 70%
                const randomTime = now + (timeRemaining * randomPercentage);
                
                const timerRandom = setTimeout(() => {
                    // Get a random procrastination joke
                    const randomJoke = getRandomQuote(procrastinationJokes);
                    const message = `"${task.text}" ${randomJoke}`;
                    sendNotification(translations[currentLanguage].appTitle, message);
                }, randomTime - now);
                
                notificationTimers[task.id].push(timerRandom);
            }
        }
    }
}

// Toggle theme
function toggleTheme() {
    // Get the body element
    const body = document.documentElement;
    // Get current theme
    const currentTheme = body.getAttribute('data-theme') || 'light';
    // Determine new theme
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Update DOM
    body.setAttribute('data-theme', newTheme);
    // Save preference
    localStorage.setItem('theme', newTheme);
    
    // Update button appearance with animated transition
    if (newTheme === 'dark') {
        themeToggle.classList.add('on');
        themeToggle.classList.remove('off');
        
        // Change icon with animation
        const icon = themeToggle.querySelector('i');
        icon.classList.remove('fa-spin-pulse');
        icon.style.opacity = '0.6';
        setTimeout(() => {
            icon.className = 'fas fa-sun';
            icon.style.opacity = '1';
        }, 150);
    } else {
        themeToggle.classList.remove('on');
        themeToggle.classList.add('off');
        
        // Change icon with animation
        const icon = themeToggle.querySelector('i');
        icon.classList.remove('fa-spin-pulse');
        icon.style.opacity = '0.6';
        setTimeout(() => {
            icon.className = 'fas fa-moon';
            icon.style.opacity = '1';
        }, 150);
    }
}

// Toggle language
function toggleLanguage() {
    // Get current language
    currentLanguage = localStorage.getItem('language') || 'en';
    // Determine new language
    const newLanguage = currentLanguage === 'en' ? 'hi' : 'en';
    
    // Update storage and variable
    localStorage.setItem('language', newLanguage);
    currentLanguage = newLanguage;
    
    // Update button appearance with animated transitions
    if (newLanguage === 'hi') {
        languageToggle.classList.add('on');
        languageToggle.classList.remove('off');
        
        // Animate language change icon
        const icon = languageToggle.querySelector('i');
        icon.classList.remove('fa-flip');
        icon.style.opacity = '0.6';
        setTimeout(() => {
            icon.style.opacity = '1';
        }, 150);
    } else {
        languageToggle.classList.remove('on');
        languageToggle.classList.add('off');
        
        // Animate language change icon
        const icon = languageToggle.querySelector('i');
        icon.classList.remove('fa-flip');
        icon.style.opacity = '0.6';
        setTimeout(() => {
            icon.style.opacity = '1';
        }, 150);
    }
    
    // Update the UI
    loadLanguage();
}

// Load language
function loadLanguage() {
    // Update document title
    document.title = translations[currentLanguage].appTitle;
    
    // Set data attribute for language indicator
    languageToggle.setAttribute('data-current-lang', currentLanguage.toUpperCase());
    
    // Update input placeholders
    taskInput.placeholder = translations[currentLanguage].addTaskPlaceholder;
    
    // Update buttons
    addButton.innerHTML = `<i class="fas fa-plus"></i> ${translations[currentLanguage].addButton}`;
    clearAllButton.innerHTML = `<i class="fas fa-trash-alt"></i> ${translations[currentLanguage].clearAll}`;
    
    // Update filter options
    filterOptions.forEach(option => {
        const filter = option.getAttribute('data-filter');
        switch(filter) {
            case 'all':
                option.textContent = translations[currentLanguage].allFilter;
                break;
            case 'active':
                option.textContent = translations[currentLanguage].activeFilter;
                break;
            case 'completed':
                option.textContent = translations[currentLanguage].completedFilter;
                break;
        }
    });
    
    // Update headings
    document.querySelector('.todo-app h2').childNodes[0].textContent = translations[currentLanguage].todaysTasks + ' ';
    document.querySelector('.task-form h3').childNodes[1].textContent = ' ' + translations[currentLanguage].addNewTask;
    document.querySelector('.filters-container h3').childNodes[1].textContent = ' ' + translations[currentLanguage].filterTasks;
    
    const yourTasksHeading = document.querySelector('h3:has(#how-to-link)');
    if (yourTasksHeading) {
        yourTasksHeading.childNodes[1].textContent = ' ' + translations[currentLanguage].yourTasks + ' ';
    }
    
    // Update form labels
    document.querySelector('label[for="task-input"]').childNodes[1].textContent = ' ' + translations[currentLanguage].taskName;
    
    // Update the deadline label
    const deadlineLabel = document.querySelector('.input-group:has(.deadline-inputs) > label');
    if (deadlineLabel) {
        deadlineLabel.childNodes[1].textContent = ' ' + translations[currentLanguage].deadlineInput;
    }
    
    // Update date and time labels
    const dateLabel = document.querySelector('.date-input label');
    const timeLabel = document.querySelector('.time-input label');
    if (dateLabel) dateLabel.textContent = translations[currentLanguage].dateLabel;
    if (timeLabel) timeLabel.textContent = translations[currentLanguage].timeLabel;
    
    // Update importance labels
    const importanceLabel = document.querySelector('.input-group:has(.importance-selector) label');
    if (importanceLabel) {
        importanceLabel.childNodes[1].textContent = ' ' + translations[currentLanguage].importanceLevel;
    }
    
    // Update importance options
    const lowOption = document.querySelector('.importance-option[data-importance="low"] .importance-label');
    const mediumOption = document.querySelector('.importance-option[data-importance="medium"] .importance-label');
    const highOption = document.querySelector('.importance-option[data-importance="high"] .importance-label');
    
    if (lowOption) lowOption.textContent = translations[currentLanguage].low;
    if (mediumOption) mediumOption.textContent = translations[currentLanguage].medium;
    if (highOption) highOption.textContent = translations[currentLanguage].high;
    
    // Update how-to-link
    const howToLink = document.getElementById('how-to-link');
    if (howToLink) {
        howToLink.textContent = `(${translations[currentLanguage].howToComplete})`;
    }
    
    // Update empty state
    const emptyStateHeading = document.querySelector('#empty-state h3');
    const emptyStateParagraph = document.querySelector('#empty-state p');
    
    if (emptyStateHeading) emptyStateHeading.textContent = translations[currentLanguage].noTasksYet;
    if (emptyStateParagraph) emptyStateParagraph.textContent = translations[currentLanguage].addFirstTask;
    
    // Update task stats
    const taskStats = document.querySelector('.task-stats');
    taskStats.innerHTML = `<span id="completed-count">${completedCount.textContent}</span>/<span id="task-counter">${taskCounter.textContent}</span> ${translations[currentLanguage].taskStats}`;
    
    // Update button titles
    languageToggle.title = translations[currentLanguage].changeLanguage;
    themeToggle.title = translations[currentLanguage].changeTheme;
    
    // Refresh tasks to update UI text
    renderTasks();
}

// Apply filter
function applyFilter(filter) {
    currentFilter = filter;
    
    const taskItems = listContainer.querySelectorAll('li');
    taskItems.forEach(item => {
        const isCompleted = item.classList.contains('checked');
        
        if (filter === 'all' || 
            (filter === 'active' && !isCompleted) || 
            (filter === 'completed' && isCompleted)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Update active filter class
    filterOptions.forEach(option => {
        if (option.getAttribute('data-filter') === filter) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Show a random procrastination joke instead of a simple message
    showToast(getRandomQuote(procrastinationJokes), 'info');
}

// Initialize app
function initApp() {
    // Load tasks from local storage
    loadTasks();
    
    // Get stored preferences
    currentTheme = localStorage.getItem('theme') || 'light';
    currentLanguage = localStorage.getItem('language') || 'en';
    notificationsEnabled = localStorage.getItem('notifications') === 'enabled';
    
    // Apply current theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Set up theme toggle
    if (currentTheme === 'dark') {
        themeToggle.classList.add('on');
        themeToggle.classList.remove('off');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    } else {
        themeToggle.classList.remove('on');
        themeToggle.classList.add('off');
        themeToggle.querySelector('i').className = 'fas fa-moon';
    }
    
    // Set up language toggle
    if (currentLanguage === 'hi') {
        languageToggle.classList.add('on');
        languageToggle.classList.remove('off');
    } else {
        languageToggle.classList.remove('on');
        languageToggle.classList.add('off');
    }
    
    // Set up notification toggle
    if (notificationsEnabled) {
        notificationToggle.classList.add('on');
        notificationToggle.classList.remove('off');
        notificationToggle.querySelector('i').className = 'fas fa-bell';
    } else {
        notificationToggle.classList.remove('on');
        notificationToggle.classList.add('off');
        notificationToggle.querySelector('i').className = 'fas fa-bell-slash';
    }
    
    // Update task count
    updateTaskCount();
    
    // Load language
    loadLanguage();
    
    // Setup notifications
    if (notificationsEnabled) {
        // Check if we have permission
        if (Notification.permission !== "granted") {
            requestNotificationPermission();
        } else {
            // Schedule notifications for existing tasks
            tasks.forEach(task => {
                if (!task.completed) {
                    scheduleNotifications(task);
                }
            });
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);

addButton.addEventListener('click', addTask);

taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        addTask();
    }
});

clearAllButton.addEventListener('click', () => {
    if (tasks.length === 0) return;
    
    showConfirmDialog(
        translations[currentLanguage].clearAllTasksTitle, 
        translations[currentLanguage].clearAllTasksConfirm
    ).then(confirmed => {
        if (confirmed) {
            // Clear all notification timers
            Object.keys(notificationTimers).forEach(taskId => {
                notificationTimers[taskId].forEach(timer => clearTimeout(timer));
                delete notificationTimers[taskId];
            });
            
            tasks = [];
            saveTasks();
            renderTasks();
            showToast(translations[currentLanguage].allTasksCleared, 'info');
        }
    });
});

importanceOptions.forEach(option => {
    option.addEventListener('click', () => {
        const importance = option.getAttribute('data-importance');
        setImportance(importance);
    });
});

filterOptions.forEach(option => {
    option.addEventListener('click', () => {
        const filter = option.getAttribute('data-filter');
        applyFilter(filter);
    });
});

themeToggle.addEventListener('click', toggleTheme);
languageToggle.addEventListener('click', toggleLanguage);
notificationToggle.addEventListener('click', toggleNotifications);

// How-to dialog
howToLink.addEventListener('click', (e) => {
    e.preventDefault();
    howToDialog.classList.add('active');
});

gotItButton.addEventListener('click', () => {
    howToDialog.classList.remove('active');
});

howToDialog.addEventListener('click', (e) => {
    if (e.target === howToDialog) {
        howToDialog.classList.remove('active');
    }
});

helpButton.addEventListener('click', () => {
    howToDialog.classList.add('active');
}); 