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
        this.presets = document.getElementById('presets');
        
        this.presetGradients = [
            'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(90deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(90deg, #30cfd0 0%, #330867 100%)',
            'linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(90deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
            'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
            'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        ];
        
        this.init();
    }
    
    init() {
        this.addEventListeners();
        this.renderPresets();
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
    
    renderPresets() {
        this.presetGradients.forEach((gradient, index) => {
            const preset = document.createElement('div');
            preset.className = 'preset-item';
            preset.style.background = gradient;
            preset.title = `Preset ${index + 1}`;
            preset.addEventListener('click', () => this.applyPreset(gradient));
            this.presets.appendChild(preset);
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
    }
    
    copyToClipboard() {
        navigator.clipboard.writeText(this.cssCode.textContent).then(() => {
            this.copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyBtn.textContent = 'Copy';
            }, 2000);
        });
    }
}

new GradientGenerator();
