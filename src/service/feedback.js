import { shallowReactive } from 'vue';

export const feedbackQueue = shallowReactive([]);

export function notify(message) {
    feedbackQueue.push(message);
}

const lastFields = new WeakMap();

function rememberField(event) {
    if (event.target.matches('input:not([readonly]), textarea, select, [role="combobox"]')) lastFields.set(event.currentTarget, event.target);
}

export function lastFormField(form) {
    const field = lastFields.get(form);
    return field && form.contains(field) ? field : undefined;
}

function reportInvalidField(event) {
    event.preventDefault();
    const field = event.target;
    if (field !== field.form.querySelector('input:invalid, select:invalid, textarea:invalid')) return;

    const label = field.labels?.[0]?.textContent.trim() || 'Campo';
    let detail = field.validationMessage;
    if (field.validity.valueMissing) detail = 'Preencha este campo para continuar.';
    else if (field.validity.tooShort) detail = `Digite pelo menos ${field.minLength} caracteres.`;
    else if (field.validity.patternMismatch) detail = field.title || 'Confira o formato deste campo.';
    notify({ severity: 'warn', summary: label, detail, focusTarget: field });
}

export const feedbackForm = {
    mounted(form) {
        form.addEventListener('focusin', rememberField);
        form.addEventListener('invalid', reportInvalidField, true);
    },
    unmounted(form) {
        form.removeEventListener('focusin', rememberField);
        form.removeEventListener('invalid', reportInvalidField, true);
    }
};
