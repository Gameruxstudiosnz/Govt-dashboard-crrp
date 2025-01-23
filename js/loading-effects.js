class EmergencyLoader {
    constructor() {
        this.loader = this.createLoader();
        this.isLoading = false;
        
        // Multiple secret codes
        this.secretCodes = {
            konami: {
                sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
                effect: 'sirenMode'
            },
            dispatch: {
                sequence: ['d', 'i', 's', 'p', 'a', 't', 'c', 'h'],
                effect: 'dispatchMode'
            },
            pursuit: {
                sequence: ['p', 'u', 'r', 's', 'u', 'i', 't'],
                effect: 'pursuitMode'
            },
            fire: {
                sequence: ['f', 'i', 'r', 'e'],
                effect: 'fireMode'
            }
        };
        
        this.currentSequence = [];
        this.bindLoadingEvents();
        this.initEasterEggs();
    }

    createLoader() {
        const loader = document.createElement('div');
        loader.className = 'emergency-loader';
        loader.style.display = 'none';
        
        const bar = document.createElement('div');
        bar.className = 'emergency-bar';
        
        loader.appendChild(bar);
        document.body.appendChild(loader);
        
        return loader;
    }

    bindLoadingEvents() {
        // Show on navigation events
        window.addEventListener('beforeunload', () => this.showLoader());
        
        // Show on AJAX requests
        this.interceptXHRRequests();
        this.interceptFetchRequests();
        
        // Show on resource loading
        window.addEventListener('load', () => this.hideLoader());
    }

    interceptXHRRequests() {
        const originalXHR = window.XMLHttpRequest;
        const self = this;

        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            xhr.addEventListener('loadstart', () => self.showLoader());
            xhr.addEventListener('loadend', () => self.hideLoader());
            return xhr;
        };
    }

    interceptFetchRequests() {
        const originalFetch = window.fetch;
        const self = this;

        window.fetch = function() {
            self.showLoader();
            return originalFetch.apply(this, arguments)
                .finally(() => self.hideLoader());
        };
    }

    showLoader() {
        if (!this.isLoading) {
            this.isLoading = true;
            this.loader.style.display = 'block';
        }
    }

    hideLoader() {
        if (this.isLoading) {
            this.isLoading = false;
            this.loader.style.display = 'none';
        }
    }

    initEasterEggs() {
        document.addEventListener('keydown', (e) => {
            this.currentSequence.push(e.key);
            
            // Check each secret code
            for (const [codeName, code] of Object.entries(this.secretCodes)) {
                if (this.checkSequence(this.currentSequence, code.sequence)) {
                    this.triggerEffect(code.effect);
                    this.currentSequence = [];
                    break;
                }
            }
            
            // Reset if sequence gets too long
            if (this.currentSequence.length > 20) {
                this.currentSequence = [];
            }
        });
    }

    checkSequence(current, target) {
        return target.every((key, index) => current[current.length - target.length + index] === key);
    }

    triggerEffect(effectName) {
        switch(effectName) {
            case 'sirenMode':
                this.createSirenEffect();
                break;
            case 'dispatchMode':
                this.createDispatchEffect();
                break;
            case 'pursuitMode':
                this.createPursuitEffect();
                break;
        }
    }

    createSirenEffect() {
        const effect = this.createEffectContainer('🚨 EMERGENCY MODE 🚨');
        this.playSound('siren');
        this.addLightbar(effect);
        this.removeEffectAfterDelay(effect, 5000);
    }

    createDispatchEffect() {
        const effect = this.createEffectContainer('📟 DISPATCH ACTIVATED 📟');
        this.playSound('radio-static');
        this.addDispatchAnimation(effect);
        this.removeEffectAfterDelay(effect, 6000);
    }

    createPursuitEffect() {
        const effect = this.createEffectContainer('🚔 PURSUIT MODE ENGAGED 🚔');
        this.playSound('engine-rev');
        this.addPursuitAnimation(effect);
        this.removeEffectAfterDelay(effect, 7000);
    }

    createEffectContainer(text) {
        const container = document.createElement('div');
        container.className = 'easter-egg-effect';
        container.innerHTML = `<h1 class="effect-text">${text}</h1>`;
        document.body.appendChild(container);
        return container;
    }

    playSound(soundName) {
        const sounds = {
            'siren': '/assets/sounds/siren.mp3',
            'radio-static': '/assets/sounds/radio-static.mp3',
            'engine-rev': '/assets/sounds/engine-rev.mp3'
        };
        
        if (sounds[soundName]) {
            const audio = new Audio(sounds[soundName]);
            audio.volume = 0.3;
            audio.play();
        }
    }

    addLightbar(container) {
        const lightbar = document.createElement('div');
        lightbar.className = 'lightbar';
        lightbar.innerHTML = `
            <div class="light red"></div>
            <div class="light blue"></div>
            <div class="light red"></div>
            <div class="light blue"></div>
        `;
        container.appendChild(lightbar);
    }

    addDispatchAnimation(container) {
        container.classList.add('dispatch-effect');
        const radioWaves = document.createElement('div');
        radioWaves.className = 'radio-waves';
        container.appendChild(radioWaves);
    }

    addPursuitAnimation(container) {
        container.classList.add('pursuit-effect');
        const roadStripes = document.createElement('div');
        roadStripes.className = 'road-stripes';
        container.appendChild(roadStripes);
    }

    removeEffectAfterDelay(element, delay) {
        setTimeout(() => {
            element.classList.add('fade-out');
            setTimeout(() => element.remove(), 1000);
        }, delay);
    }
}// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new EmergencyLoader();
});