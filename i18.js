document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('dt_lang') || 'en';
    updateSelectValue(savedLang);
    loadTranslations(savedLang);
});

document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'lang-select') {
        const selectedLang = e.target.value;
        localStorage.setItem('dt_lang', selectedLang);
        loadTranslations(selectedLang);
    }
});

async function loadTranslations(lang) {
    try {
        const response = await fetch(`./locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Fichier locales/${lang}.json introuvable`);
        }

        const translations = await response.json();
        document.documentElement.lang = lang;
        
        applyTranslations(translations);
        
        updateSelectValue(lang);
    } catch (error) {
        console.error('Erreur i18n :', error);
    }
}

function updateSelectValue(lang) {
    const langSelect = document.getElementById('lang-select');
    if (langSelect && langSelect.value !== lang) {
        langSelect.value = lang;
    }
}

function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        if (element.tagName === 'SELECT' || element.id === 'lang-select') return;

        const keyPath = element.getAttribute('data-i18n').split('.');
        let value = translations;

        keyPath.forEach(key => {
            if (value && value[key] !== undefined) {
                value = value[key];
            } else {
                value = null;
            }
        });

        if (value && typeof value === 'string') {
            if (value.includes('<') && value.includes('>')) {
                element.innerHTML = value;
            } else {
                element.textContent = value;
            }
        }
    });
}