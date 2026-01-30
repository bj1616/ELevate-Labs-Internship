// Application State
const state = {
    fields: [],
    fieldIdCounter: 0,
    analytics: {
        fieldUsage: {},
        totalFields: 0,
        formsSaved: 0,
        formsExported: 0,
        activityLog: []
    }
};

// Field Templates
const fieldTemplates = {
    text: { icon: 'fa-i-cursor', label: 'Text Field', placeholder: 'Enter text' },
    textarea: { icon: 'fa-align-left', label: 'Text Area', placeholder: 'Enter description' },
    email: { icon: 'fa-envelope', label: 'Email', placeholder: 'Enter email' },
    number: { icon: 'fa-hashtag', label: 'Number', placeholder: 'Enter number' },
    select: { icon: 'fa-caret-square-down', label: 'Dropdown', options: ['Option 1', 'Option 2', 'Option 3'] },
    radio: { icon: 'fa-dot-circle', label: 'Radio Button', options: ['Option 1', 'Option 2'] },
    checkbox: { icon: 'fa-check-square', label: 'Checkbox', options: ['Option 1', 'Option 2'] },
    date: { icon: 'fa-calendar-alt', label: 'Date', placeholder: '' },
    time: { icon: 'fa-clock', label: 'Time', placeholder: '' },
    datetime: { icon: 'fa-calendar-check', label: 'Date & Time', placeholder: '' },
    sku: { icon: 'fa-barcode', label: 'SKU/Barcode', placeholder: 'Enter SKU' },
    quantity: { icon: 'fa-cubes', label: 'Quantity', placeholder: 'Enter quantity' },
    price: { icon: 'fa-dollar-sign', label: 'Price', placeholder: 'Enter price' },
    category: { icon: 'fa-tags', label: 'Category', options: ['Electronics', 'Furniture', 'Supplies', 'Food'] }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeDragAndDrop();
    initializeEventListeners();
    loadFromLocalStorage();
    updateAnalytics();
    setupAISuggestions();
});

// Drag and Drop Initialization
function initializeDragAndDrop() {
    const fieldItems = document.querySelectorAll('.field-item');
    const formBuilderArea = document.getElementById('formBuilderArea');

    fieldItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    formBuilderArea.addEventListener('dragover', handleDragOver);
    formBuilderArea.addEventListener('drop', handleDrop);
    formBuilderArea.addEventListener('dragleave', handleDragLeave);
}

function handleDragStart(e) {
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('fieldType', e.currentTarget.dataset.fieldType);
}

function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    if (e.target === e.currentTarget) {
        e.currentTarget.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const fieldType = e.dataTransfer.getData('fieldType');
    if (fieldType) {
        addField(fieldType);
        showToast('Field added successfully!', 'success');
        trackActivity('Field Added', fieldType);
    }
}

// Field Management
function addField(fieldType) {
    const template = fieldTemplates[fieldType];
    if (!template) return;

    const fieldId = `field_${state.fieldIdCounter++}`;
    const field = {
        id: fieldId,
        type: fieldType,
        label: template.label,
        placeholder: template.placeholder || '',
        required: false,
        options: template.options || []
    };

    state.fields.push(field);
    
    // Track field usage
    state.analytics.fieldUsage[fieldType] = (state.analytics.fieldUsage[fieldType] || 0) + 1;
    state.analytics.totalFields++;
    
    renderFormBuilder();
    renderLivePreview();
    updateAnalytics();
    updateAISuggestions();
    saveToLocalStorage();
}

function removeField(fieldId) {
    const fieldIndex = state.fields.findIndex(f => f.id === fieldId);
    if (fieldIndex > -1) {
        const field = state.fields[fieldIndex];
        state.fields.splice(fieldIndex, 1);
        state.analytics.totalFields--;
        
        renderFormBuilder();
        renderLivePreview();
        updateAnalytics();
        updateAISuggestions();
        saveToLocalStorage();
        
        showToast('Field removed', 'info');
        trackActivity('Field Removed', field.type);
    }
}

function updateField(fieldId, updates) {
    const field = state.fields.find(f => f.id === fieldId);
    if (field) {
        Object.assign(field, updates);
        renderLivePreview();
        saveToLocalStorage();
    }
}

// Render Functions
function renderFormBuilder() {
    const formBuilderArea = document.getElementById('formBuilderArea');
    
    if (state.fields.length === 0) {
        formBuilderArea.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-mouse-pointer"></i>
                <h3>Start Building Your Inventory Form</h3>
                <p>Drag and drop fields from the left panel to create your custom inventory form</p>
            </div>
        `;
        return;
    }

    formBuilderArea.innerHTML = state.fields.map(field => {
        const template = fieldTemplates[field.type];
        return `
            <div class="form-field" data-field-id="${field.id}">
                <div class="field-header">
                    <div class="field-label">
                        <i class="fas ${template.icon}"></i>
                        <span>${field.label}</span>
                        <span class="field-type-badge">${field.type}</span>
                    </div>
                    <div class="field-actions">
                        <button class="icon-btn" onclick="moveFieldUp('${field.id}')" title="Move Up">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <button class="icon-btn" onclick="moveFieldDown('${field.id}')" title="Move Down">
                            <i class="fas fa-arrow-down"></i>
                        </button>
                        <button class="icon-btn delete" onclick="removeField('${field.id}')" title="Remove Field">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="field-config">
                    <div class="config-group">
                        <label>Field Label</label>
                        <input type="text" value="${field.label}" 
                               onchange="updateField('${field.id}', {label: this.value})">
                    </div>
                    ${['text', 'textarea', 'email', 'number', 'sku', 'quantity', 'price'].includes(field.type) ? `
                    <div class="config-group">
                        <label>Placeholder</label>
                        <input type="text" value="${field.placeholder}" 
                               onchange="updateField('${field.id}', {placeholder: this.value})">
                    </div>
                    ` : ''}
                    ${['select', 'radio', 'checkbox', 'category'].includes(field.type) ? `
                    <div class="config-group">
                        <label>Options (comma-separated)</label>
                        <input type="text" value="${field.options.join(', ')}" 
                               onchange="updateField('${field.id}', {options: this.value.split(',').map(o => o.trim())})">
                    </div>
                    ` : ''}
                    <div class="config-group">
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" ${field.required ? 'checked' : ''} 
                                   onchange="updateField('${field.id}', {required: this.checked})">
                            Required Field
                        </label>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderLivePreview() {
    const livePreview = document.getElementById('livePreview');
    
    if (state.fields.length === 0) {
        livePreview.innerHTML = `
            <div class="preview-empty">
                <i class="fas fa-file-alt"></i>
                <p>Your form preview will appear here</p>
            </div>
        `;
        return;
    }

    const formHTML = state.fields.map(field => {
        const template = fieldTemplates[field.type];
        let inputHTML = '';

        switch (field.type) {
            case 'textarea':
                inputHTML = `<textarea placeholder="${field.placeholder}" ${field.required ? 'required' : ''}></textarea>`;
                break;
            case 'select':
            case 'category':
                inputHTML = `
                    <select ${field.required ? 'required' : ''}>
                        <option value="">Select ${field.label}</option>
                        ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                `;
                break;
            case 'radio':
                inputHTML = field.options.map((opt, i) => `
                    <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <input type="radio" name="${field.id}" value="${opt}" ${field.required && i === 0 ? 'required' : ''}>
                        ${opt}
                    </label>
                `).join('');
                break;
            case 'checkbox':
                inputHTML = field.options.map(opt => `
                    <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <input type="checkbox" value="${opt}">
                        ${opt}
                    </label>
                `).join('');
                break;
            case 'date':
                inputHTML = `<input type="date" ${field.required ? 'required' : ''}>`;
                break;
            case 'time':
                inputHTML = `<input type="time" ${field.required ? 'required' : ''}>`;
                break;
            case 'datetime':
                inputHTML = `<input type="datetime-local" ${field.required ? 'required' : ''}>`;
                break;
            case 'number':
            case 'quantity':
                inputHTML = `<input type="number" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>`;
                break;
            case 'price':
                inputHTML = `<input type="number" step="0.01" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>`;
                break;
            case 'email':
                inputHTML = `<input type="email" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>`;
                break;
            default:
                inputHTML = `<input type="text" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>`;
        }

        return `
            <div class="preview-field">
                <label>
                    <i class="fas ${template.icon}"></i>
                    ${field.label}${field.required ? ' *' : ''}
                </label>
                ${inputHTML}
            </div>
        `;
    }).join('');

    livePreview.innerHTML = `
        <div class="preview-form">
            <h3 style="margin-bottom: 1.5rem; color: var(--dark);">Inventory Form Preview</h3>
            ${formHTML}
            <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                <i class="fas fa-check"></i> Submit
            </button>
        </div>
    `;
}

// Field Movement
function moveFieldUp(fieldId) {
    const index = state.fields.findIndex(f => f.id === fieldId);
    if (index > 0) {
        [state.fields[index - 1], state.fields[index]] = [state.fields[index], state.fields[index - 1]];
        renderFormBuilder();
        renderLivePreview();
        saveToLocalStorage();
    }
}

function moveFieldDown(fieldId) {
    const index = state.fields.findIndex(f => f.id === fieldId);
    if (index < state.fields.length - 1) {
        [state.fields[index], state.fields[index + 1]] = [state.fields[index + 1], state.fields[index]];
        renderFormBuilder();
        renderLivePreview();
        saveToLocalStorage();
    }
}

// Event Listeners
function initializeEventListeners() {
    // Clear Form
    document.getElementById('clearFormBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all fields?')) {
            state.fields = [];
            state.analytics.totalFields = 0;
            renderFormBuilder();
            renderLivePreview();
            updateAnalytics();
            saveToLocalStorage();
            showToast('Form cleared', 'info');
        }
    });

    // Save Form
    document.getElementById('saveFormBtn').addEventListener('click', () => {
        if (state.fields.length === 0) {
            showToast('Add some fields before saving', 'error');
            return;
        }
        state.analytics.formsSaved++;
        saveToLocalStorage();
        updateAnalytics();
        showToast('Form saved successfully!', 'success');
        trackActivity('Form Saved', `${state.fields.length} fields`);
    });

    // Export Form
    document.getElementById('exportBtn').addEventListener('click', () => {
        if (state.fields.length === 0) {
            showToast('Add some fields before exporting', 'error');
            return;
        }
        exportForm();
    });

    // AI Suggestions Modal
    const aiBtn = document.getElementById('aiSuggestionsBtn');
    const aiModal = document.getElementById('aiModal');
    aiBtn.addEventListener('click', () => {
        aiModal.classList.add('active');
    });

    // Analytics Modal
    const analyticsBtn = document.getElementById('analyticsBtn');
    const analyticsModal = document.getElementById('analyticsModal');
    analyticsBtn.addEventListener('click', () => {
        analyticsModal.classList.add('active');
        renderAnalytics();
    });

    // Close Modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });

    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Field Search
    document.getElementById('fieldSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.field-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
        });
    });
}

// AI Suggestions System
function setupAISuggestions() {
    updateAISuggestions();
}

function updateAISuggestions() {
    const suggestionCard = document.getElementById('currentSuggestion');
    const fieldCount = state.fields.length;
    
    let suggestion = {
        title: 'Getting Started',
        message: 'Welcome! Start by dragging essential inventory fields like SKU/Barcode, Product Name, Quantity, and Price to your form.'
    };

    if (fieldCount === 0) {
        suggestion = {
            title: 'Start Building',
            message: 'Begin by adding a SKU/Barcode field to uniquely identify your inventory items.'
        };
    } else if (fieldCount === 1) {
        suggestion = {
            title: 'Add More Details',
            message: 'Great start! Now add fields for product name, quantity, and price to create a comprehensive inventory form.'
        };
    } else if (fieldCount < 5) {
        suggestion = {
            title: 'Essential Fields',
            message: 'Consider adding category, date, and description fields to track your inventory better.'
        };
    } else if (fieldCount >= 5 && fieldCount < 10) {
        suggestion = {
            title: 'Looking Good!',
            message: 'Your form is taking shape! You might want to add fields for supplier information or storage location.'
        };
    } else {
        suggestion = {
            title: 'Excellent Progress!',
            message: 'You have built a comprehensive inventory form! Remember to save your form and test it in the preview.'
        };
    }

    suggestionCard.querySelector('h3').textContent = suggestion.title;
    suggestionCard.querySelector('p').textContent = suggestion.message;
}

// Analytics
function updateAnalytics() {
    document.getElementById('totalFields').textContent = state.analytics.totalFields;
    document.getElementById('formsSaved').textContent = state.analytics.formsSaved;
    document.getElementById('formsExported').textContent = state.analytics.formsExported;
}

function renderAnalytics() {
    // Update stats
    updateAnalytics();

    // Render field distribution chart
    const ctx1 = document.getElementById('fieldDistributionChart');
    if (ctx1) {
        const labels = Object.keys(state.analytics.fieldUsage);
        const data = Object.values(state.analytics.fieldUsage);
        
        if (window.fieldDistChart) {
            window.fieldDistChart.destroy();
        }
        
        window.fieldDistChart = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: labels.length ? labels : ['No Data'],
                datasets: [{
                    data: data.length ? data : [1],
                    backgroundColor: [
                        '#4f46e5', '#06b6d4', '#10b981', '#f59e0b', 
                        '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Render popular fields
    const popularFieldsList = document.getElementById('popularFieldsList');
    const sortedFields = Object.entries(state.analytics.fieldUsage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (sortedFields.length === 0) {
        popularFieldsList.innerHTML = '<p style="color: #9ca3af; text-align: center;">No data available yet</p>';
    } else {
        popularFieldsList.innerHTML = sortedFields.map(([type, count]) => {
            const template = fieldTemplates[type];
            return `
                <div class="popular-field-item">
                    <div class="field-info">
                        <div class="field-icon">
                            <i class="fas ${template.icon}"></i>
                        </div>
                        <span>${template.label}</span>
                    </div>
                    <span class="usage-count">${count} times</span>
                </div>
            `;
        }).join('');
    }

    // Render activity timeline
    const ctx2 = document.getElementById('activityChart');
    if (ctx2) {
        if (window.activityChart) {
            window.activityChart.destroy();
        }
        
        const activities = state.analytics.activityLog.slice(-10).reverse();
        
        window.activityChart = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: activities.length ? activities.map((_, i) => `Activity ${i + 1}`) : ['No Data'],
                datasets: [{
                    label: 'Activity Over Time',
                    data: activities.length ? activities.map((_, i) => i + 1) : [0],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function trackActivity(action, details) {
    state.analytics.activityLog.push({
        action,
        details,
        timestamp: new Date().toISOString()
    });
    saveToLocalStorage();
}

// Export Functionality
function exportForm() {
    const formData = {
        title: 'Inventory Form',
        fields: state.fields,
        createdAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-form-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    state.analytics.formsExported++;
    updateAnalytics();
    saveToLocalStorage();
    showToast('Form exported successfully!', 'success');
    trackActivity('Form Exported', `${state.fields.length} fields`);
}

// Local Storage
function saveToLocalStorage() {
    localStorage.setItem('inventoryFormState', JSON.stringify(state));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('inventoryFormState');
    if (saved) {
        const loadedState = JSON.parse(saved);
        Object.assign(state, loadedState);
        renderFormBuilder();
        renderLivePreview();
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.getElementById('toastContainer').appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Make functions globally accessible
window.removeField = removeField;
window.updateField = updateField;
window.moveFieldUp = moveFieldUp;
window.moveFieldDown = moveFieldDown;
