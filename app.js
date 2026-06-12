class GradientGenerator {
    constructor() {
        this.gradientType = document.getElementById('gradientType');
        this.angle = document.getElementById('angle');
        this.angleValue = document.getElementById('angleValue');
        this.angleControl = document.getElementById('angleControl');
        this.colorStops = document.getElementById('colorStops');
        this.addColorBtn = document.getElementById('addColor');
        this.preview = document.getElementById('preview');
        this.cssCode = document.getElementById('cssCode');
        this.copyBtn = document.getElementById('copyBtn');
        this.copyScssBtn = document.getElementById('copyScssBtn');
        this.generateClassBtn = document.getElementById('generateClassBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.presets = document.getElementById('presets');
        this.randomBtn = document.getElementById('randomGradient');
        this.randomHistoryBtn = document.getElementById('randomFromHistory');
        this.saveBtn = document.getElementById('saveGradient');
        this.savedGrid = document.getElementById('savedGrid');
        this.savedCount = document.getElementById('savedCount');
        this.canvas = document.getElementById('gradientCanvas');
        this.historyGrid = document.getElementById('historyGrid');
        this.historyCount = document.getElementById('historyCount');
        this.clearHistoryBtn = document.getElementById('clearHistory');
        this.classModal = document.getElementById('classModal');
        this.classCode = document.getElementById('classCode');
        this.copyClassBtn = document.getElementById('copyClassBtn');
        
        // Gradient history
        this.gradientHistory = [];
        this.MAX_HISTORY = 12;
        
        this.presetCategories = {
            'Sunset': [
                { name: 'Golden Hour', gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
                { name: 'Purple Dusk', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                { name: 'Coral Sunset', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)' },
                { name: 'Orange Glow', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
                { name: 'Twilight', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }
            ],
            'Nature': [
                { name: 'Ocean', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
                { name: 'Forest', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
                { name: 'Mint', gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
                { name: 'Spring', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
                { name: 'Tropical', gradient: 'linear-gradient(135deg, #42e695 0%, #3bb2b8 100%)' }
            ],
            'Neon': [
                { name: 'Pink Neon', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
                { name: 'Cyber', gradient: 'linear-gradient(135deg, #00f260 0%, #0575e6 100%)' },
                { name: 'Electric', gradient: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)' },
                { name: 'Vaporwave', gradient: 'linear-gradient(135deg, #ff00cc 0%, #333399 100%)' },
                { name: 'Synthwave', gradient: 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)' }
            ],
            'Pastel': [
                { name: 'Soft Cloud', gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
                { name: 'Cotton Candy', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
                { name: 'Lavender', gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
                { name: 'Peach', gradient: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)' },
                { name: 'Rose', gradient: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)' }
            ],
            'Dark': [
                { name: 'Midnight', gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
                { name: 'Deep Space', gradient: 'linear-gradient(135deg, #000000 0%, #434343 100%)' },
                { name: 'Obsidian', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
                { name: 'Charcoal', gradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)' },
                { name: 'Noir', gradient: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)' }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.addEventListeners();
        this.renderPresets();
        this.loadSavedGradients();
        this.loadHistory();
        this.updateGradient();
    }
    
    addEventListeners() {
        this.gradientType.addEventListener('change', () => {
            this.toggleAngleControl();
            this.updateGradient();
        });
        
        this.angle.addEventListener('input', () => {
            this.angleValue.textContent = this.angle.value;
            this.updateGradient();
        });
        
        this.addColorBtn.addEventListener('click', () => this.addColorStop());
        
        this.colorStops.addEventListener('change', (e) => {
            if (e.target.classList.contains('color-picker') || 
                e.target.classList.contains('position')) {
                this.updateGradient();
            }
        });
        
        this.colorStops.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-color')) {
                e.target.parentElement.remove();
                this.updateGradient();
            }
        });
        
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.copyScssBtn.addEventListener('click', () => this.copyToClipboard('scss'));
        this.generateClassBtn.addEventListener('click', () => this.showClassModal());
        this.downloadBtn.addEventListener('click', () => this.downloadGradient());
        this.randomBtn.addEventListener('click', () => this.generateRandomGradient());
        this.randomHistoryBtn.addEventListener('click', () => this.generateRandomFromHistory());
        this.saveBtn.addEventListener('click', () => this.saveCurrentGradient());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // Modal close
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.classModal.classList.remove('show');
        });
        
        this.classModal.addEventListener('click', (e) => {
            if (e.target === this.classModal) {
                this.classModal.classList.remove('show');
            }
        });
        
        this.copyClassBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(this.classCode.textContent).then(() => {
                this.showToast('✅ CSS class copied!');
                this.classModal.classList.remove('show');
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'r':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.generateRandomFromHistory();
                        } else {
                            this.generateRandomGradient();
                        }
                        break;
                    case 's':
                        e.preventDefault();
                        this.saveCurrentGradient();
                        break;
                    case 'c':
                        if (document.activeElement.tagName !== 'INPUT') {
                            e.preventDefault();
                            this.copyToClipboard();
                        }
                        break;
                }
            }
        });
    }
    
    toggleAngleControl() {
        if (this.gradientType.value === 'radial') {
            this.angleControl.style.display = 'none';
        } else {
            this.angleControl.style.display = 'block';
        }
    }
    
    addColorStop() {
        const colorStop = document.createElement('div');
        colorStop.className = 'color-stop';
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        const position = this.getAvailablePosition();
        
        colorStop.innerHTML = `
            <input type="color" class="color-picker" value="${randomColor}">
            <input type="number" class="position" value="${position}" min="0" max="100">%
            <button class="remove-color" title="Remove color">×</button>
        `;
        
        this.colorStops.appendChild(colorStop);
        this.updateGradient();
    }
    
    getAvailablePosition() {
        const stops = Array.from(this.colorStops.querySelectorAll('.position'));
        const positions = stops.map(s => parseInt(s.value));
        return Math.min(100, Math.max(...positions) + 10);
    }
    
    getColorStops() {
        const stops = [];
        const colorStops = this.colorStops.querySelectorAll('.color-stop');
        
        colorStops.forEach(stop => {
            const color = stop.querySelector('.color-picker').value;
            const position = stop.querySelector('.position').value;
            stops.push({ color, position: parseInt(position) });
        });
        
        return stops.sort((a, b) => a.position - b.position);
    }
    
    generateCSS() {
        const type = this.gradientType.value;
        const stops = this.getColorStops();
        const stopsStr = stops.map(s => `${s.color} ${s.position}%`).join(', ');
        
        if (type === 'linear') {
            return `background: linear-gradient(${this.angle.value}deg, ${stopsStr});`;
        } else if (type === 'radial') {
            return `background: radial-gradient(${stopsStr});`;
        } else {
            return `background: conic-gradient(from ${this.angle.value}deg, ${stopsStr});`;
        }
    }
    
    updateGradient() {
        const css = this.generateCSS();
        this.preview.style = css;
        this.cssCode.textContent = css;
    }
    
    generateRandomGradient() {
        // Random type
        const types = ['linear', 'radial', 'conic'];
        this.gradientType.value = types[Math.floor(Math.random() * types.length)];
        this.toggleAngleControl();
        
        // Random angle
        if (this.gradientType.value !== 'radial') {
            this.angle.value = Math.floor(Math.random() * 360);
            this.angleValue.textContent = this.angle.value;
        }
        
        // Random colors (2-4)
        const numColors = Math.floor(Math.random() * 3) + 2;
        this.colorStops.innerHTML = '';
        
        for (let i = 0; i < numColors; i++) {
            const color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            const position = Math.round((i / (numColors - 1)) * 100);
            
            const colorStop = document.createElement('div');
            colorStop.className = 'color-stop';
            colorStop.innerHTML = `
                <input type="color" class="color-picker" value="${color}">
                <input type="number" class="position" value="${position}" min="0" max="100">%
                <button class="remove-color" title="Remove color">×</button>
            `;
            this.colorStops.appendChild(colorStop);
        }
        
        this.updateGradient();
        this.showToast('🎲 Random gradient generated!');
    }
    
    saveCurrentGradient() {
        const saved = JSON.parse(localStorage.getItem('savedGradients') || '[]');
        const css = this.generateCSS();
        
        // Check if already saved
        if (saved.some(g => g.css === css)) {
            this.showToast('⚠️ This gradient is already saved!');
            return;
        }
        
        const gradient = {
            id: Date.now(),
            css: css,
            type: this.gradientType.value,
            angle: this.angle.value,
            stops: this.getColorStops(),
            timestamp: new Date().toISOString()
        };
        
        saved.unshift(gradient);
        
        // Limit to 20 saved gradients
        if (saved.length > 20) saved.pop();
        
        localStorage.setItem('savedGradients', JSON.stringify(saved));
        this.renderSavedGradients();
        this.showToast('✅ Gradient saved to gallery!');
    }
    
    loadSavedGradients() {
        this.renderSavedGradients();
    }
    
    renderSavedGradients() {
        const saved = JSON.parse(localStorage.getItem('savedGradients') || '[]');
        this.savedCount.textContent = saved.length;
        this.savedGrid.innerHTML = '';
        
        if (saved.length === 0) {
            this.savedGrid.innerHTML = '<div class="saved-item-empty">No saved gradients yet. Click "Save" to add some!</div>';
            return;
        }
        
        saved.forEach(gradient => {
            const item = document.createElement('div');
            item.className = 'saved-item';
            item.style.background = gradient.css.replace('background: ', '').replace(';', '');
            item.title = 'Click to load';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-saved';
            deleteBtn.textContent = '×';
            deleteBtn.title = 'Delete';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.deleteSavedGradient(gradient.id);
            };
            
            item.appendChild(deleteBtn);
            item.addEventListener('click', () => this.loadSavedGradient(gradient));
            this.savedGrid.appendChild(item);
        });
    }
    
    deleteSavedGradient(id) {
        const saved = JSON.parse(localStorage.getItem('savedGradients') || '[]');
        const filtered = saved.filter(g => g.id !== id);
        localStorage.setItem('savedGradients', JSON.stringify(filtered));
        this.renderSavedGradients();
        this.showToast('🗑️ Gradient deleted');
    }
    
    loadSavedGradient(gradient) {
        this.gradientType.value = gradient.type;
        this.toggleAngleControl();
        
        if (gradient.type !== 'radial') {
            this.angle.value = gradient.angle;
            this.angleValue.textContent = gradient.angle;
        }
        
        this.colorStops.innerHTML = '';
        gradient.stops.forEach(stop => {
            const colorStop = document.createElement('div');
            colorStop.className = 'color-stop';
            colorStop.innerHTML = `
                <input type="color" class="color-picker" value="${stop.color}">
                <input type="number" class="position" value="${stop.position}" min="0" max="100">%
                <button class="remove-color" title="Remove color">×</button>
            `;
            this.colorStops.appendChild(colorStop);
        });
        
        this.updateGradient();
        this.showToast('📂 Gradient loaded!');
    }
    
    renderPresets() {
        Object.entries(this.presetCategories).forEach(([category, presets]) => {
            const categorySection = document.createElement('div');
            categorySection.className = 'preset-category';
            
            const categoryTitle = document.createElement('h4');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category;
            categorySection.appendChild(categoryTitle);
            
            const categoryGrid = document.createElement('div');
            categoryGrid.className = 'category-grid';
            
            presets.forEach((preset) => {
                const presetItem = document.createElement('div');
                presetItem.className = 'preset-item';
                presetItem.style.background = preset.gradient;
                presetItem.title = preset.name;
                
                const presetName = document.createElement('span');
                presetName.className = 'preset-name';
                presetName.textContent = preset.name;
                presetItem.appendChild(presetName);
                
                presetItem.addEventListener('click', () => this.applyPreset(preset.gradient));
                categoryGrid.appendChild(presetItem);
            });
            
            categorySection.appendChild(categoryGrid);
            this.presets.appendChild(categorySection);
        });
    }
    
    applyPreset(gradient) {
        const match = gradient.match(/(linear|radial|conic)-gradient\(([^)]+)\)/);
        if (!match) return;
        
        const type = match[1];
        const params = match[2];
        
        this.gradientType.value = type;
        this.toggleAngleControl();
        
        const stopsMatch = params.match(/#[a-fA-F0-9]{6}\s*\d+%/g);
        if (!stopsMatch) return;
        
        this.colorStops.innerHTML = '';
        
        stopsMatch.forEach(stopStr => {
            const [color, position] = stopStr.split(/\s+/);
            const colorStop = document.createElement('div');
            colorStop.className = 'color-stop';
            colorStop.innerHTML = `
                <input type="color" class="color-picker" value="${color}">
                <input type="number" class="position" value="${parseInt(position)}" min="0" max="100">%
                <button class="remove-color" title="Remove color">×</button>
            `;
            this.colorStops.appendChild(colorStop);
        });
        
        if (type !== 'radial') {
            const angleMatch = params.match(/(\d+)deg/);
            if (angleMatch) {
                this.angle.value = angleMatch[1];
                this.angleValue.textContent = angleMatch[1];
            }
        }
        
        this.updateGradient();
        this.showToast(`🎨 Applied preset: ${gradient.split('(')[0]}`);
    }
    
    copyToClipboard(format = 'css') {
        let textToCopy = this.cssCode.textContent;
        
        if (format === 'scss') {
            const css = this.cssCode.textContent;
            const match = css.match(/background:\s*(.+);/);
            if (match) {
                textToCopy = `@mixin gradient-background {\n    background: ${match[1]};\n}`;
            }
        }
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            this.showToast(format === 'scss' ? '✅ SCSS copied to clipboard!' : '✅ CSS copied to clipboard!');
            this.copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyBtn.textContent = 'Copy CSS';
            }, 2000);
        });
    }
    
    showClassModal() {
        const css = this.cssCode.textContent;
        const match = css.match(/background:\s*(.+);/);
        if (match) {
            const className = `gradient-${Date.now().toString(36).substr(-6)}`;
            this.classCode.textContent = `.${className} {\n    ${css}\n}`;
            this.classModal.classList.add('show');
        }
    }
    
    addToHistory() {
        const css = this.generateCSS();
        const stops = this.getColorStops();
        
        // Don't add duplicates at the beginning
        if (this.gradientHistory.length > 0 && this.gradientHistory[0].css === css) {
            return;
        }
        
        const entry = {
            id: Date.now(),
            css: css,
            type: this.gradientType.value,
            angle: this.angle.value,
            stops: stops,
            timestamp: new Date().toISOString()
        };
        
        this.gradientHistory.unshift(entry);
        
        // Limit history size
        if (this.gradientHistory.length > this.MAX_HISTORY) {
            this.gradientHistory.pop();
        }
        
        // Save to localStorage
        localStorage.setItem('gradientHistory', JSON.stringify(this.gradientHistory));
        this.renderHistory();
    }
    
    loadHistory() {
        const saved = localStorage.getItem('gradientHistory');
        if (saved) {
            try {
                this.gradientHistory = JSON.parse(saved);
            } catch (e) {
                this.gradientHistory = [];
            }
        }
        this.renderHistory();
    }
    
    renderHistory() {
        this.historyCount.textContent = this.gradientHistory.length;
        this.historyGrid.innerHTML = '';
        
        if (this.gradientHistory.length === 0) {
            this.historyGrid.innerHTML = '<div class="history-item-empty">No history yet. Generate some gradients!</div>';
            return;
        }
        
        this.gradientHistory.forEach((gradient, index) => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.style.background = gradient.css.replace('background: ', '').replace(';', '');
            item.title = `Click to load (generated ${new Date(gradient.timestamp).toLocaleTimeString()})`;
            
            item.addEventListener('click', () => {
                this.loadSavedGradient(gradient);
                this.showToast(`📂 Loaded from history (${index + 1}/${this.gradientHistory.length})`);
            });
            
            this.historyGrid.appendChild(item);
        });
    }
    
    generateRandomFromHistory() {
        if (this.gradientHistory.length === 0) {
            this.showToast('⚠️ No history yet! Generate some gradients first.');
            return;
        }
        
        const randomEntry = this.gradientHistory[Math.floor(Math.random() * this.gradientHistory.length)];
        this.loadSavedGradient(randomEntry);
        this.showToast(`🎲 Random from history: ${this.gradientHistory.indexOf(randomEntry) + 1}/${this.gradientHistory.length}`);
    }
    
    clearHistory() {
        if (this.gradientHistory.length === 0) return;
        
        if (confirm('Clear all gradient history?')) {
            this.gradientHistory = [];
            localStorage.removeItem('gradientHistory');
            this.renderHistory();
            this.showToast('🗑️ History cleared');
        }
    }
    
    updateGradient() {
        const css = this.generateCSS();
        this.preview.style = css;
        this.cssCode.textContent = css;
    }
    
    generateRandomGradient() {
        // Random type
        const types = ['linear', 'radial', 'conic'];
        this.gradientType.value = types[Math.floor(Math.random() * types.length)];
        this.toggleAngleControl();
        
        // Random angle
        if (this.gradientType.value !== 'radial') {
            this.angle.value = Math.floor(Math.random() * 360);
            this.angleValue.textContent = this.angle.value;
        }
        
        // Random colors (2-4)
        const numColors = Math.floor(Math.random() * 3) + 2;
        this.colorStops.innerHTML = '';
        
        for (let i = 0; i < numColors; i++) {
            const color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            const position = Math.round((i / (numColors - 1)) * 100);
            
            const colorStop = document.createElement('div');
            colorStop.className = 'color-stop';
            colorStop.innerHTML = `
                <input type="color" class="color-picker" value="${color}">
                <input type="number" class="position" value="${position}" min="0" max="100">%
                <button class="remove-color" title="Remove color">×</button>
            `;
            this.colorStops.appendChild(colorStop);
        }
        
        this.updateGradient();
        this.addToHistory();
        this.showToast('🎲 Random gradient generated!');
    }
    
    saveCurrentGradient() {
        const saved = JSON.parse(localStorage.getItem('savedGradients') || '[]');
        const css = this.generateCSS();
        
        // Check if already saved
        if (saved.some(g => g.css === css)) {
            this.showToast('⚠️ This gradient is already saved!');
            return;
        }
        
        const gradient = {
            id: Date.now(),
            css: css,
            type: this.gradientType.value,
            angle: this.angle.value,
            stops: this.getColorStops(),
            timestamp: new Date().toISOString()
        };
        
        saved.unshift(gradient);
        
        // Limit to 20 saved gradients
        if (saved.length > 20) saved.pop();
        
        localStorage.setItem('savedGradients', JSON.stringify(saved));
        this.renderSavedGradients();
        this.showToast('✅ Gradient saved to gallery!');
    }
    
    loadSavedGradients() {
        this.renderSavedGradients();
    }
    
    renderSavedGradients() {
        const saved = JSON.parse(localStorage.getItem('savedGradients') || '[]');
        this.savedCount.textContent = saved.length;
        this.savedGrid.innerHTML = '';
        
        if (saved.length === 0) {
            this.savedGrid.innerHTML = '<div class="saved-item-empty">No saved gradients yet. Click "Save" to add some!</div>';
            return;
        }
        
        saved.forEach(gradient => {
            const item = document.createElement('div');
            item.className = 'saved-item';
            item.style.background = gradient.css.replace('background: ', '').replace(';', '');
            item.title = 'Click to load';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-saved';
            deleteBtn.textContent = '×';
            deleteBtn.title = 'Delete';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.deleteSavedGradient(gradient.id);
            };
            
            item.appendChild(deleteBtn);
            item.addEventListener('click', () => this.loadSavedGradient(gradient));
            this.savedGrid.appendChild(item);
        });
    }
    
    deleteSavedGradient(id) {
        const saved = JSON.parse(localStorage.getItem('savedGradients') || '[]');
        const filtered = saved.filter(g => g.id !== id);
        localStorage.setItem('savedGradients', JSON.stringify(filtered));
        this.renderSavedGradients();
        this.showToast('🗑️ Gradient deleted');
    }
    
    loadSavedGradient(gradient) {
        this.gradientType.value = gradient.type;
        this.toggleAngleControl();
        
        if (gradient.type !== 'radial') {
            this.angle.value = gradient.angle;
            this.angleValue.textContent = gradient.angle;
        }
        
        this.colorStops.innerHTML = '';
        gradient.stops.forEach(stop => {
            const colorStop = document.createElement('div');
            colorStop.className = 'color-stop';
            colorStop.innerHTML = `
                <input type="color" class="color-picker" value="${stop.color}">
                <input type="number" class="position" value="${stop.position}" min="0" max="100">%
                <button class="remove-color" title="Remove color">×</button>
            `;
            this.colorStops.appendChild(colorStop);
        });
        
        this.updateGradient();
        this.showToast('📂 Gradient loaded!');
    }
    
    renderPresets() {
        Object.entries(this.presetCategories).forEach(([category, presets]) => {
            const categorySection = document.createElement('div');
            categorySection.className = 'preset-category';
            
            const categoryTitle = document.createElement('h4');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category;
            categorySection.appendChild(categoryTitle);
            
            const categoryGrid = document.createElement('div');
            categoryGrid.className = 'category-grid';
            
            presets.forEach((preset) => {
                const presetItem = document.createElement('div');
                presetItem.className = 'preset-item';
                presetItem.style.background = preset.gradient;
                presetItem.title = preset.name;
                
                const presetName = document.createElement('span');
                presetName.className = 'preset-name';
                presetName.textContent = preset.name;
                presetItem.appendChild(presetName);
                
                presetItem.addEventListener('click', () => this.applyPreset(preset.gradient));
                categoryGrid.appendChild(presetItem);
            });
            
            categorySection.appendChild(categoryGrid);
            this.presets.appendChild(categorySection);
        });
    }
    
    applyPreset(gradient) {
        const match = gradient.match(/(linear|radial|conic)-gradient\(([^)]+)\)/);
        if (!match) return;
        
        const type = match[1];
        const params = match[2];
        
        this.gradientType.value = type;
        this.toggleAngleControl();
        
        const stopsMatch = params.match(/#[a-fA-F0-9]{6}\s*\d+%/g);
        if (!stopsMatch) return;
        
        this.colorStops.innerHTML = '';
        
        stopsMatch.forEach(stopStr => {
            const [color, position] = stopStr.split(/\s+/);
            const colorStop = document.createElement('div');
            colorStop.className = 'color-stop';
            colorStop.innerHTML = `
                <input type="color" class="color-picker" value="${color}">
                <input type="number" class="position" value="${parseInt(position)}" min="0" max="100">%
                <button class="remove-color" title="Remove color">×</button>
            `;
            this.colorStops.appendChild(colorStop);
        });
        
        if (type !== 'radial') {
            const angleMatch = params.match(/(\d+)deg/);
            if (angleMatch) {
                this.angle.value = angleMatch[1];
                this.angleValue.textContent = angleMatch[1];
            }
        }
        
        this.updateGradient();
        this.addToHistory();
        this.showToast(`🎨 Applied preset`);
    }
    
    downloadGradient() {
        const canvas = this.canvas;
        const ctx = canvas.getContext('2d');
        canvas.width = 1920;
        canvas.height = 1080;
        
        const type = this.gradientType.value;
        const stops = this.getColorStops();
        
        let gradient;
        if (type === 'linear') {
            const angleRad = (this.angle.value - 90) * Math.PI / 180;
            const x1 = canvas.width / 2 + Math.cos(angleRad + Math.PI) * canvas.width;
            const y1 = canvas.height / 2 + Math.sin(angleRad + Math.PI) * canvas.height;
            const x2 = canvas.width / 2 + Math.cos(angleRad) * canvas.width;
            const y2 = canvas.height / 2 + Math.sin(angleRad) * canvas.height;
            gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        } else if (type === 'radial') {
            gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.height / 2
            );
        } else {
            gradient = ctx.createConicGradient(
                this.angle.value * Math.PI / 180,
                canvas.width / 2, canvas.height / 2
            );
        }
        
        stops.forEach(stop => {
            gradient.addColorStop(stop.position / 100, stop.color);
        });
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `gradient-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
            this.showToast('📥 Gradient downloaded as PNG!');
        });
    }
    
    showToast(message) {
        // Remove existing toast
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }
}

new GradientGenerator();
