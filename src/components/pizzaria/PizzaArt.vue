<script setup>
defineProps({ variant: { type: String, default: 'margherita' } });
const toppings = [
    [59, 48],
    [95, 39],
    [124, 65],
    [110, 105],
    [67, 114],
    [43, 84],
    [83, 78]
];
</script>
<template>
    <svg class="pizza-art" viewBox="0 0 170 170" fill="none" aria-hidden="true">
        <template v-if="['bebida', 'suco'].includes(variant)">
            <ellipse cx="85" cy="147" rx="38" ry="8" fill="#bcb299" opacity=".2" />
            <rect x="68" y="19" width="34" height="15" rx="4" fill="#5e6a4a" />
            <path d="M69 34v15L57 70v64q0 10 10 10h36q10 0 10-10V70l-12-21V34Z" :fill="variant === 'suco' ? '#e7a647' : '#45312a'" />
            <path d="M59 78h52v39H59Z" :fill="variant === 'suco' ? '#fff3ce' : '#b94b33'" />
            <path d="M70 96h30M77 103h16" stroke="#fff8e8" stroke-width="4" stroke-linecap="round" />
            <path d="M69 57 64 73v57" stroke="white" opacity=".22" stroke-width="4" stroke-linecap="round" />
        </template>
        <template v-else-if="variant === 'pao'">
            <ellipse cx="85" cy="130" rx="59" ry="11" fill="#bcb299" opacity=".2" />
            <path d="M28 104q-8-23 21-41l59-18q22-7 34 15t-15 36l-57 27q-28 14-42-19Z" fill="#dba451" />
            <path d="m53 77 14 32m10-41 14 30m10-39 12 29" stroke="#fff0bc" stroke-width="10" stroke-linecap="round" />
            <path d="m48 85 7 4m24-8 7 4m25-9 7 4" stroke="#657944" stroke-width="4" stroke-linecap="round" />
        </template>
        <template v-else-if="variant === 'pudim'">
            <ellipse cx="85" cy="118" rx="64" ry="23" fill="#eee3cf" />
            <ellipse cx="85" cy="119" rx="51" ry="17" fill="#c97e3a" opacity=".8" />
            <path d="M48 74c4-15 70-15 74 0l14 41c-9 19-92 19-102 0z" fill="#f3c179" />
            <ellipse cx="85" cy="74" rx="37" ry="13" fill="#ad5f30" />
            <ellipse cx="85" cy="74" rx="12" ry="4" fill="#f7dbad" />
            <path d="M54 89l-7 19m17-17-5 21m14-17-3 19" stroke="#fce1a7" stroke-width="4" stroke-linecap="round" />
        </template>
        <template v-else>
            <ellipse cx="86" cy="148" rx="61" ry="8" fill="#bcb299" opacity=".2" />
            <circle cx="85" cy="82" r="68" fill="#ddb578" />
            <circle cx="85" cy="80" r="64" fill="#efca87" />
            <circle cx="85" cy="80" r="56" :fill="variant === 'chocolate' ? '#573b30' : '#bc5b38'" />
            <circle cx="85" cy="80" r="52" :fill="variant === 'chocolate' ? '#704b37' : '#f0d08a'" />
            <path d="m85 25 1 110M37 53l96 55M37 108l96-55" stroke="#a97a40" opacity=".3" stroke-width="1.5" />
            <g v-for="([x, y], index) in toppings" :key="index">
                <template v-if="variant === 'calabresa' || variant === 'portuguesa'">
                    <circle :cx="x" :cy="y" r="10" fill="#a84730" />
                    <circle :cx="x - 2" :cy="y - 2" r="6.5" fill="#bc6047" />
                    <path :d="`M${x - 9} ${y + 13}q10-8 19 0`" stroke="#f8edc8" stroke-width="3" stroke-linecap="round" />
                </template>
                <template v-else-if="variant === 'margherita'">
                    <circle :cx="x" :cy="y" r="10" fill="#c96545" />
                    <circle :cx="x" :cy="y" r="6" fill="#e48a64" />
                    <ellipse :cx="x + 9" :cy="y - 8" rx="5" ry="10" fill="#617943" :transform="`rotate(35 ${x + 9} ${y - 8})`" />
                </template>
                <template v-else-if="variant === 'chocolate'">
                    <path :d="`M${x - 7} ${y - 4}Q${x} ${y - 11} ${x + 7} ${y - 4}L${x} ${y + 9}Z`" fill="#d36755" />
                    <path :d="`m${x - 4} ${y - 6} 4 3 4-3`" stroke="#65814c" stroke-width="3" />
                </template>
                <template v-else>
                    <path :d="`m${x - 7} ${y - 2} 9-7 6 9-8 7Z`" :fill="variant === 'frango' ? '#c68a4d' : '#fbebbc'" />
                    <path :d="`M${x - 7} ${y + 8}q8-9 15-4`" stroke="#fff0c7" stroke-width="4" stroke-linecap="round" />
                </template>
                <circle :cx="x + 5" :cy="y + 12" r="1.3" fill="#6c7043" />
            </g>
        </template>
    </svg>
</template>
