import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { feedbackForm } from '@/service/feedback';

import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import ptBR from '@/locales/pt-BR.json';

import '@/assets/tailwind.css';
import '@/assets/styles.scss';
import '@/styles/pizzaria.scss';
import '@/styles/admin.scss';

const app = createApp(App);
app.directive('feedback-form', feedbackForm);
const PizzeriaTheme = definePreset(Aura, {
    semantic: {
        primary: { 50: '#fdf3ef', 100: '#fae3da', 200: '#f4c3b1', 300: '#eca087', 400: '#e07859', 500: '#ce5c3d', 600: '#b7472c', 700: '#973923', 800: '#7e3222', 900: '#692d21', 950: '#39150e' },
        colorScheme: {
            light: {
                primary: { color: '{primary.600}', inverseColor: '#ffffff', hoverColor: '{primary.700}', activeColor: '{primary.800}' },
                formField: { placeholderColor: '#687062' }
            }
        }
    }
});

app.use(router);
app.use(PrimeVue, {
    locale: ptBR,
    theme: {
        preset: PizzeriaTheme,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
