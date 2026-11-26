<template>
    <div class="card">
        <div class="font-semibold text-2xl mb-4">Documentação</div>
        <div class="font-semibold text-xl mb-4">Começar</div>
        <p class="text-lg mb-4">
            Sakai é um modelo de aplicação Vue baseado no <a href="https://github.com/vuejs/create-vue" class="font-medium text-primary hover:underline">create-vue</a>, a ferramenta recomendada para iniciar projetos Vue <strong>com Vite</strong>.
            Para começar, clone o <a href="https://github.com/primefaces/sakai-vue" class="font-medium text-primary hover:underline">repositório</a> do GitHub e instale as dependências com npm ou yarn.
        </p>
        <pre class="app-code">
<code>git clone https://github.com/primefaces/sakai-vue
npm install
npm run dev</code></pre>

        <p class="text-lg mb-4">Acesse <i class="bg-highlight px-2 py-1 rounded-border not-italic text-base">http://localhost:5173/</i> para visualizar a aplicação no seu ambiente local.</p>

        <pre class="app-code"><code>npm run dev</code></pre>

        <div class="font-semibold text-xl mb-4">Estrutura</div>
        <p class="text-lg mb-4">O modelo está organizado em pastas. As demonstrações e o layout ficam separados para facilitar a remoção do que não for necessário na sua aplicação.</p>
        <ul class="leading-normal list-disc pl-8 text-lg mb-4">
            <li><span class="text-primary font-medium">src/layout</span>: arquivos do layout principal, necessários para a aplicação.</li>
            <li><span class="text-primary font-medium">src/views</span>: páginas de demonstração, como o painel.</li>
            <li><span class="text-primary font-medium">public/demo</span>: arquivos usados nas demonstrações.</li>
            <li><span class="text-primary font-medium">src/assets/demo</span>: estilos usados nas demonstrações.</li>
            <li><span class="text-primary font-medium">src/assets/layout</span>: arquivos SCSS do layout principal.</li>
        </ul>

        <div class="font-semibold text-xl mb-4">Menu</div>
        <p class="text-lg mb-4">
            O menu principal é definido no arquivo <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">src/layout/AppMenu.vue</span>. Atualize a propriedade
            <i class="bg-highlight px-2 py-1 rounded-border not-italic text-base">model</i> para definir seus próprios itens de menu.
        </p>

        <div class="font-semibold text-xl mb-4">Composable do layout</div>
        <p class="text-lg mb-4">
            O arquivo <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">src/layout/composables/layout.js</span> é um composable que gerencia o estado do layout, incluindo o modo escuro, o tema do PrimeVue e os modos do menu. Se
            alterar valores iniciais, como o tema ou as cores, aplique as mesmas alterações na configuração do PrimeVue em main.js.
        </p>

        <div class="font-semibold text-xl mb-4">Tailwind CSS</div>
        <p class="text-lg mb-4">As páginas de demonstração usam Tailwind CSS, enquanto a estrutura principal da aplicação usa principalmente CSS personalizado.</p>

        <div class="font-semibold text-xl mb-4">Variáveis</div>
        <p class="text-lg mb-4">
            As variáveis CSS do modelo usam os valores dos temas do PrimeVue. Utilize os arquivos em <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">assets/layout/_variables.scss</span> para personalizar conforme suas
            necessidades.
        </p>

        <div class="font-semibold text-xl mb-4">Adicionar Sakai-Vue a um projeto Nuxt</div>
        <p class="text-lg mb-4">Para começar, crie um projeto Nuxt.</p>
        <pre class="app-code">
<code>npx nuxi@latest init sakai-nuxt</code></pre>

        <p class="text-lg mb-4">Adicione as bibliotecas do PrimeVue ao projeto.</p>
        <pre class="app-code">
<code>npm install primevue @primevue/themes tailwindcss-primeui primeicons
npm install --save-dev @primevue/nuxt-module</code></pre>

        <p class="text-lg mb-4">Adicione o módulo PrimeVue-Nuxt em <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">nuxt.config.js</span></p>
        <pre class="app-code">
<code>modules: [
    '@primevue/nuxt-module',
]</code></pre>

        <p class="text-lg mb-4">Instale <a href="https://tailwindcss.com/docs/guides/nuxtjs" class="font-medium text-primary hover:underline">Tailwind CSS</a> com Nuxt seguindo a documentação oficial.</p>

        <p class="text-lg mb-4">
            Adicione <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">tailwindcss-primeui</span> como plugin em <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">tailwind.config.js</span>
        </p>
        <pre class="app-code">
<code>plugins: [require('tailwindcss-primeui')]</code></pre>

        <p class="text-lg mb-4">Adicione a configuração do PrimeVue em <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">nuxt.config.js</span></p>
        <pre class="app-code">
<code>import Aura from '@primevue/themes/aura';

primevue: {
    options: {
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: '.app-dark'
            }
        }
    }
}</code></pre>

        <p class="text-lg mb-4">
            Copie a pasta <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">src/assets</span> e cole na pasta <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">assets</span> do seu projeto Nuxt. Depois,
            adicione em <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">nuxt.config.js</span>
        </p>
        <pre class="app-code">
<code>css: ['~/assets/tailwind.css', '~/assets/styles.scss']</code></pre>

        <p class="text-lg mb-4">Altere <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">app.vue</span></p>
        <pre class="app-code">
<code>&lt;template&gt;
    &lt;NuxtLayout&gt;
        &lt;NuxtPage /&gt;
    &lt;/NuxtLayout&gt;
&lt;/template&gt;</code></pre>

        <p class="text-lg mb-4">Crie <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">layouts/default.vue</span> e cole este código:</p>
        <pre class="app-code">
<code>&lt;script setup&gt;
import AppLayout from './AppLayout.vue';
&lt;/script&gt;

&lt;template&gt;
    &lt;AppLayout /&gt;
&lt;/template&gt;</code></pre>

        <p class="text-lg mb-4">
            Crie <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">layouts</span> e copie a pasta <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">src/layout</span> para ela. Em seguida, crie
            <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">composables/use-layout.vue</span> e substitua seu conteúdo pelo de
            <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">src/layout/composables/layout.js</span>. Depois, remova esta linha:
        </p>
        <pre class="app-code">
<code>import { useLayout } from '@/layout/composables/layout';</code></pre>

        <p class="text-lg mb-4">Por último, copie as seguintes pastas:</p>
        <ul class="leading-normal list-disc pl-8 text-lg mb-4">
            <li><span class="text-primary font-medium">public/demo</span> <i class="pi pi-arrow-right text-sm! mr-1"></i> <span class="text-primary font-medium">public</span></li>
            <li><span class="text-primary font-medium">src/components</span> <i class="pi pi-arrow-right text-sm! mr-1"></i> <span class="text-primary font-medium">components</span></li>
            <li><span class="text-primary font-medium">src/service</span> <i class="pi pi-arrow-right text-sm! mr-1"></i> <span class="text-primary font-medium">service</span></li>
            <li><span class="text-primary font-medium">src/views/uikit</span> <i class="pi pi-arrow-right text-sm! mr-1"></i> <span class="text-primary font-medium">pages/uikit</span></li>
            <li><span class="text-primary font-medium">src/views/pages</span> <i class="pi pi-arrow-right text-sm! mr-1"></i> <span class="text-primary font-medium">pages</span></li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 991px) {
    .video-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
