const LOADER_DURATION = 5000;
const COUNTDOWN_START = 5;

let countdown = COUNTDOWN_START;
let progress = 0;

const loader = document.getElementById('loader');
const mainContent = document.getElementById('mainContent');
const progressFill = document.getElementById('progressFill');
const countdownEl = document.getElementById('countdown');

function updateLoader() {
    const interval = LOADER_DURATION / 100;
    const progressIncrement = 100 / (LOADER_DURATION / 100);
    const countdownInterval = LOADER_DURATION / COUNTDOWN_START;
    
    const progressTimer = setInterval(() => {
        progress += progressIncrement;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressTimer);
        }
        progressFill.style.width = progress + '%';
    }, interval);
    
    const countdownTimer = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            countdown = 0;
            clearInterval(countdownTimer);
            showMainContent();
        }
        countdownEl.textContent = countdown;
    }, countdownInterval);
}

function showMainContent() {
    loader.classList.add('fade-out');
    
    setTimeout(() => {
        loader.classList.add('hidden');
        mainContent.classList.remove('hidden');
        mainContent.style.animation = 'fadeIn 0.8s ease-out';
    }, 600);
}

function copyToClipboard(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    let success = false;
    
    try {
        success = document.execCommand('copy');
    } catch (err) {
        console.error('复制失败:', err);
    }
    
    document.body.removeChild(textarea);
    
    if (success || navigator.clipboard) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showCopySuccess(button);
            }).catch(() => {
                showCopySuccess(button);
            });
        } else {
            showCopySuccess(button);
        }
    }
}

function showCopySuccess(button) {
    const originalHTML = button.innerHTML;
    button.classList.add('copied');
    button.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>已复制</span>
    `;
    
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    
    setTimeout(() => {
        button.classList.remove('copied');
        button.innerHTML = originalHTML;
        toast.classList.remove('show');
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    updateLoader();
    
    document.querySelectorAll('.contact-item').forEach(item => {
        const copyText = item.dataset.copy;
        if (copyText) {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.copy-btn')) {
                    const btn = item.querySelector('.copy-btn');
                    if (btn) {
                        copyToClipboard(copyText, btn);
                    }
                }
            });
        }
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
