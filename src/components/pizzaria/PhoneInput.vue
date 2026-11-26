<script setup>
import { formatPhone, phoneDigits } from '@/utils/locale';

const model = defineModel({ type: String, default: '' });

function updatePhone(event) {
    if (event.isComposing) return;

    const input = event.target;
    const value = input.value;
    const formatted = formatPhone(value);
    model.value = formatted;
    if (formatted === value) return;

    const atEnd = input.selectionStart === value.length;
    let digitsBeforeCursor = phoneDigits(value.slice(0, input.selectionStart)).length;
    let cursor = 0;
    while (cursor < formatted.length && digitsBeforeCursor > 0) {
        if (/\d/.test(formatted[cursor])) digitsBeforeCursor--;
        cursor++;
    }

    input.value = formatted;
    cursor = atEnd ? formatted.length : cursor;
    input.setSelectionRange(cursor, cursor);
}
</script>

<template>
    <input type="tel" inputmode="tel" maxlength="20" placeholder="(85) 99999-9999" class="p-inputtext p-component p-inputtext-fluid" :value="formatPhone(model)" @input="updatePhone" @compositionend="updatePhone" />
</template>
