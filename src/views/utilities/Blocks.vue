<script setup>
import BlockViewer from '@/components/BlockViewer.vue';
import { ref } from 'vue';

const password = ref('');
const checked1 = ref(true);

const blocksCode = {
    hero: `<div class="relative min-h-160 lg:min-h-0 bg-surface-0 dark:bg-surface-900 flex lg:flex-row flex-col">
    <div class="flex lg:flex lg:flex-row flex-col justify-center md:justify-normal h-full flex-1">
        <div class="relative flex-1 z-20 flex items-center justify-center">
            <div class="flex items-center justify-center h-full">
                <div class="w-full max-w-2xl px-6 py-12 lg:p-12 xl:p-16 text-center lg:text-left">
                    <h1 class="text-4xl xl:text-5xl font-bold text-surface-0 lg:text-surface-900 dark:text-surface-0 mb-6 leading-tight!">
                        <span class="block">Crie as telas que seus</span>
                        <span class="block text-primary">visitantes merecem ver</span>
                    </h1>

                    <p class="text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-xl leading-normal mb-8 max-w-xl lg:max-w-none">
                        Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades dos seus usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                    </p>

                    <div class="flex items-center gap-4 justify-center lg:justify-start">
                        <Button label="Saiba mais" type="button" />
                        <Button label="Demonstração" type="button" outlined />
                    </div>
                </div>
            </div>
        </div>

        <div class="absolute lg:relative inset-0 lg:inset-auto flex-1">
            <div class="absolute lg:hidden inset-0 bg-surface-900/60 dark:bg-surface-900/80 z-10" />
            <img
                src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/hero/hero-1.png"
                alt="Imagem de apresentação"
                class="h-full w-full object-cover xl:[clip-path:polygon(12%_0,100%_0%,100%_100%,0_100%)]"
            />
        </div>
    </div>
</div>`,

    feature: `<div class="bg-surface-0 dark:bg-surface-950 px-6 md:px-12 lg:px-20 py-20 text-center">
    <div class="flex flex-col gap-6">
        <div class="flex flex-col items-center gap-4">
            <div class="font-bold text-3xl leading-tight">
                <span class="text-surface-900 dark:text-surface-0">Um produto, </span>
                <span class="text-primary-500 dark:text-primary-400">muitas soluções</span>
            </div>
            <div class="text-surface-500 dark:text-surface-400 leading-tight">Conheça recursos que tornam seu projeto mais completo e fácil de usar.</div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="w-full rounded-md p-4">
                <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                    <i class="pi pi-desktop text-2xl! lg:text-3xl! text-primary-500 dark:text-primary-400" />
                </span>
                <div class="flex flex-col gap-1">
                    <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">Feito para desenvolvedores</div>
                    <p class="text-surface-500 dark:text-surface-400 leading-normal">Componentes organizados e flexíveis para transformar suas ideias em aplicações.</p>
                </div>
            </div>
            <div class="w-full rounded-md p-4">
                <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                    <i class="pi pi-lock text-2xl! lg:text-3xl! text-primary-500 dark:text-primary-400" />
                </span>
                <div class="flex flex-col gap-1">
                    <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">Criptografia de ponta a ponta</div>
                    <p class="text-surface-500 dark:text-surface-400 leading-normal">Proteja suas informações durante a comunicação entre os usuários.</p>
                </div>
            </div>
            <div class="w-full rounded-md p-4">
                <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                    <i class="pi pi-face-smile text-2xl! lg:text-3xl! text-primary-500 dark:text-primary-400" />
                </span>
                <div class="flex flex-col gap-1">
                    <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">Fácil de usar</div>
                    <p class="text-surface-500 dark:text-surface-400 leading-normal">Uma interface que se adapta ao computador, ao tablet e ao celular.</p>
                </div>
            </div>
            <div class="w-full rounded-md p-4">
                <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                    <i class="pi pi-globe text-2xl! lg:text-3xl! text-primary-500 dark:text-primary-400" />
                </span>
                <div class="flex flex-col gap-1">
                    <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">Suporte rápido e global</div>
                    <p class="text-surface-500 dark:text-surface-400 leading-normal">Encontre ajuda para aproveitar os recursos em todas as etapas do projeto.</p>
                </div>
            </div>
            <div class="w-full rounded-md p-4">
                <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                    <i class="pi pi-github text-2xl! lg:text-3xl! text-primary-500 dark:text-primary-400" />
                </span>
                <div class="flex flex-col gap-1">
                    <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">Código aberto</div>
                    <p class="text-surface-500 dark:text-surface-400 leading-normal">Personalize os componentes e contribua com melhorias para a comunidade.</p>
                </div>
            </div>
            <div class="w-full rounded-md p-4">
                <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                    <i class="pi pi-shield text-2xl! lg:text-3xl! text-primary-500 dark:text-primary-400" />
                </span>
                <div class="flex flex-col gap-1">
                    <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">Segurança confiável</div>
                    <p class="text-surface-500 dark:text-surface-400 leading-normal">Recursos pensados para oferecer uma experiência segura e consistente.</p>
                </div>
            </div>
        </div>
    </div>
</div>`,

    pricing: `<div class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
        <div class="flex flex-col gap-4 items-center justify-center mb-12">
            <div class="text-surface-900 dark:text-surface-0 font-bold text-4xl lg:text-5xl text-center leading-tight">Planos e preços</div>
            <div class="text-surface-500 dark:text-surface-400 text-lg text-center leading-normal">Escolha o plano que melhor atende às necessidades do seu projeto.</div>
        </div>

        <div class="flex lg:flex-row flex-col gap-8 max-w-7xl mx-auto">
            <div class="w-full flex-1 p-8 flex rounded-2xl flex-col bg-surface-0 dark:bg-surface-800 shadow-sm gap-6">
                <div class="flex flex-col gap-2">
                    <h4 class="text-surface-900 dark:text-surface-0 font-medium text-xl leading-tight">Básico</h4>
                    <p class="text-surface-500 dark:text-surface-400 leading-normal">Escolha o plano que melhor atende às necessidades do seu projeto.</p>
                </div>

                <div class="w-full h-px bg-surface-200 dark:bg-surface-700" />
                <div class="flex items-center gap-2">
                    <span class="font-bold text-3xl text-surface-900 dark:text-surface-0 leading-tight">R$&nbsp;9,00</span>
                    <span class="font-medium text-surface-500 dark:text-surface-400 leading-tight">por mês</span>
                </div>
                <div class="w-full h-px bg-surface-200 dark:bg-surface-600" />
                <ul class="list-none flex flex-col gap-4 flex-1">
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle text-lg! text-green-500" />
                        <span class="text-surface-800 dark:text-surface-100 leading-tight"> Recursos essenciais </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle text-lg! text-green-500" />
                        <span class="text-surface-800 dark:text-surface-100 leading-tight"> Atualizações incluídas </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle text-lg! text-green-500" />
                        <span class="text-surface-800 dark:text-surface-100 leading-tight"> Suporte à configuração </span>
                    </li>
                </ul>
                <Button label="Comprar agora" rounded class="w-full" />
            </div>
            <div class="w-full flex-1 p-8 flex rounded-2xl flex-col bg-surface-0 dark:bg-surface-800 shadow-sm gap-6">
                <div class="flex flex-col gap-2">
                    <h4 class="text-surface-900 dark:text-surface-0 font-medium text-xl leading-tight">Premium</h4>
                    <p class="text-surface-500 dark:text-surface-400 leading-normal">Escolha o plano que melhor atende às necessidades do seu projeto.</p>
                </div>

                <div class="w-full h-px bg-surface-200 dark:bg-surface-700" />
                <div class="flex items-center gap-2">
                    <span class="font-bold text-3xl text-surface-900 dark:text-surface-0 leading-tight">R$&nbsp;29,00</span>
                    <span class="font-medium text-surface-500 dark:text-surface-400 leading-tight">por mês</span>
                </div>
                <div class="w-full h-px bg-surface-200 dark:bg-surface-600" />
                <ul class="list-none flex flex-col gap-4 flex-1">
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle text-lg! text-green-500" />
                        <span class="text-surface-800 dark:text-surface-100 leading-tight"> Recursos essenciais </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle text-lg! text-green-500" />
                        <span class="text-surface-800 dark:text-surface-100 leading-tight"> Atualizações incluídas </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle text-lg! text-green-500" />
                        <span class="text-surface-800 dark:text-surface-100 leading-tight"> Suporte à configuração </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle text-lg! text-green-500" />
                        <span class="text-surface-800 dark:text-surface-100 leading-tight"> Recursos avançados </span>
                    </li>
                </ul>
                <Button label="Comprar agora" rounded class="w-full" />
            </div>
            <div class="w-full flex-1 p-8 flex rounded-2xl flex-col bg-surface-0 dark:bg-surface-800 shadow-sm gap-6">
                <div class="flex flex-col gap-2">
                    <h4 class="text-surface-900 dark:text-surface-0 font-medium text-xl leading-tight">Empresarial</h4>
                    <p class="text-surface-500 dark:text-surface-400 leading-normal">Escolha o plano que melhor atende às necessidades do seu projeto.</p>
                </div>

                <div class="w-full h-px bg-surface-200 dark:bg-surface-700" />
                <div class="flex items-center gap-2">
                    <span class="font-bold text-3xl text-surface-900 dark:text-surface-0 leading-tight">R$&nbsp;49,00</span>
                    <span class="font-medium text-surface-500 dark:text-surface-400 leading-tight">por mês</span>
                </div>
                <div class="w-full h-px bg-surface-200 dark:bg-surface-600" />
                <ul class="list-none flex flex-col gap-4 flex-1">
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle text-lg! text-green-500" />
                        <span class="text-surface-800 dark:text-surface-100 leading-tight"> Recursos essenciais </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle text-lg! text-green-500" />
                        <span class="text-surface-800 dark:text-surface-100 leading-tight"> Atualizações incluídas </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle text-lg! text-green-500" />
                        <span class="text-surface-800 dark:text-surface-100 leading-tight"> Suporte à configuração </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle text-lg! text-green-500" />
                        <span class="text-surface-800 dark:text-surface-100 leading-tight"> Recursos avançados </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle text-lg! text-green-500" />
                        <span class="text-surface-800 dark:text-surface-100 leading-tight"> Atendimento prioritário </span>
                    </li>
                </ul>
                <Button label="Comprar agora" rounded class="w-full" />
            </div>
        </div>
    </div>`,

    cta: ` <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
    <div class="text-surface-700 dark:text-surface-100 text-center flex flex-col items-center gap-4">
        <div class="text-primary font-bold text-lg leading-tight"><i class="pi pi-discord text-lg! leading-none!" />&nbsp;POWERED BY DISCORD</div>
        <div class="text-surface-900 dark:text-surface-0 font-bold text-4xl leading-tight">Participe da nossa comunidade de design</div>
        <div class="text-surface-700 dark:text-surface-100 text-xl leading-normal">Escolha o plano que melhor atende às necessidades do seu projeto.</div>
        <Button label="Participar agora" icon="pi pi-discord" rounded class="mt-4" />
    </div>
</div>`,

    banner: `<div class="pb-20 bg-surface-0 dark:bg-surface-950">
    <div class="bg-surface-900 text-surface-100 py-4 px-6 lg:px-20 flex justify-between items-center flex-wrap">
        <div class="font-bold">🔥 Ofertas imperdíveis!</div>
        <div class="inline-flex gap-1 items-center">
            <span class="hidden lg:flex leading-normal">Aproveite condições especiais para começar seu projeto.</span>
            <a class="text-surface-0 underline font-bold" href="#">Saiba mais</a>
        </div>
        <Button icon="pi pi-times" text rounded severity="secondary" class="text-surface-0! hover:bg-surface-500/20!" />
    </div>
</div>`,

    'page-heading': `<div class="bg-surface-0 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
    <ul class="list-none p-0 m-0 flex items-center font-medium mb-5">
        <li>
            <a class="text-surface-500 dark:text-surface-300 no-underline leading-normal cursor-pointer">Aplicativo</a>
        </li>
        <li class="px-2">
            <i class="pi pi-angle-right text-surface-500 dark:text-surface-300 text-sm! leading-normal!" />
        </li>
        <li>
            <span class="text-surface-900 dark:text-surface-0 leading-normal">Análises</span>
        </li>
    </ul>
    <div class="flex items-start flex-col md:justify-between md:flex-row">
        <div>
            <div class="font-bold text-3xl text-surface-900 dark:text-surface-0 mb-4">Clientes</div>
            <div class="flex items-center text-surface-700 dark:text-surface-300 flex-wrap gap-8">
                <div class="flex items-center gap-2">
                    <i class="pi pi-users text-base! leading-normal!" />
                    <span>332 usuários ativos</span>
                </div>
                <div class="flex items-center gap-2">
                    <i class="pi pi-globe text-base! leading-normal!" />
                    <span>9.402 sessões</span>
                </div>
                <div class="flex items-center gap-2">
                    <i class="pi pi-clock text-base! leading-normal!" />
                    <span>2,32 min de duração média</span>
                </div>
            </div>
        </div>
        <div class="mt-6 md:mt-0 flex items-center">
            <Button label="Adicione" class="mr-3" outlined icon="pi pi-user-plus" />
            <Button label="Salvar alterações" icon="pi pi-check" class="whitespace-nowrap" />
        </div>
    </div>
</div>`,

    stats: `<div class="bg-surface-50 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div class="bg-surface-0 dark:bg-surface-900 shadow-sm p-5 rounded-2xl">
            <div class="flex justify-between gap-4">
                <div class="flex flex-col gap-2">
                    <span class="text-surface-700 dark:text-surface-300 font-normal leading-tight">Mensagens</span>
                    <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl! leading-tight!">152</div>
                </div>
                <div class="flex items-center justify-center bg-linear-to-b from-cyan-400 dark:from-cyan-300 to-cyan-600 dark:to-cyan-500 rounded-lg w-10 h-10">
                    <i class="pi pi-envelope text-surface-0 dark:text-surface-900 text-xl! leading-none!" />
                </div>
            </div>
            <div class="mt-4">
                <span class="text-surface-600 dark:text-surface-300 font-medium leading-tight">24 novos</span>
                <span class="text-surface-500 dark:text-surface-300 leading-tight"> desde a última visita</span>
            </div>
        </div>

        <div class="bg-surface-0 dark:bg-surface-900 shadow-sm p-5 rounded-2xl">
            <div class="flex justify-between gap-4">
                <div class="flex flex-col gap-2">
                    <span class="text-surface-700 dark:text-surface-300 font-normal leading-tight">Entradas</span>
                    <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl! leading-tight!">532</div>
                </div>
                <div class="flex items-center justify-center bg-linear-to-b from-orange-400 dark:from-orange-300 to-orange-600 dark:to-orange-500 rounded-lg w-10 h-10">
                    <i class="pi pi-map-marker text-surface-0 dark:text-surface-900 text-xl! leading-none!" />
                </div>
            </div>
            <div class="mt-4">
                <span class="text-surface-600 dark:text-surface-300 font-medium leading-tight">48 novas</span>
                <span class="text-surface-500 dark:text-surface-300 leading-tight"> desde a última visita</span>
            </div>
        </div>

        <div class="bg-surface-0 dark:bg-surface-900 shadow-sm p-5 rounded-2xl">
            <div class="flex justify-between gap-4">
                <div class="flex flex-col gap-2">
                    <span class="text-surface-700 dark:text-surface-300 font-normal leading-tight">Arquivos sincronizados</span>
                    <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl! leading-tight!">28.441</div>
                </div>
                <div class="flex items-center justify-center bg-linear-to-b from-slate-400 dark:from-slate-300 to-slate-600 dark:to-slate-500 rounded-lg w-10 h-10">
                    <i class="pi pi-file text-surface-0 dark:text-surface-900 text-xl! leading-none!" />
                </div>
            </div>
            <div class="mt-4">
                <span class="text-surface-500 dark:text-surface-300 leading-tight">32,56 / 250 GB</span>
            </div>
        </div>

        <div class="bg-surface-0 dark:bg-surface-900 shadow-sm p-5 rounded-2xl">
            <div class="flex justify-between gap-4">
                <div class="flex flex-col gap-2">
                    <span class="text-surface-700 dark:text-surface-300 font-normal leading-tight">Usuários conectados</span>
                    <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl! leading-tight!">25.660</div>
                </div>
                <div class="flex items-center justify-center bg-linear-to-b from-violet-400 dark:from-violet-300 to-violet-600 dark:to-violet-500 rounded-lg w-10 h-10">
                    <i class="pi pi-users text-surface-0 dark:text-surface-900 text-xl! leading-none!" />
                </div>
            </div>
            <div class="mt-4">
                <span class="text-surface-600 dark:text-surface-300 font-medium leading-tight">72 novos</span>
                <span class="text-surface-500 dark:text-surface-300 leading-tight"> usuários nesta semana</span>
            </div>
        </div>
    </div>
</div>`,

    'sign-in': ` <div class="bg-surface-0 dark:bg-surface-900 p-8 md:p-12 shadow-sm rounded-2xl w-full max-w-xl mx-auto flex flex-col gap-8">
    <div class="flex flex-col items-center gap-4">
        <div class="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14" width="33" height="32" viewBox="0 0 33 32" fill="none">
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.09219 2.87829C5.94766 3.67858 4.9127 4.62478 4.01426 5.68992C7.6857 5.34906 12.3501 5.90564 17.7655 8.61335C23.5484 11.5047 28.205 11.6025 31.4458 10.9773C31.1517 10.087 30.7815 9.23135 30.343 8.41791C26.6332 8.80919 21.8772 8.29127 16.3345 5.51998C12.8148 3.76014 9.71221 3.03521 7.09219 2.87829ZM28.1759 5.33332C25.2462 2.06 20.9887 0 16.25 0C14.8584 0 13.5081 0.177686 12.2209 0.511584C13.9643 0.987269 15.8163 1.68319 17.7655 2.65781C21.8236 4.68682 25.3271 5.34013 28.1759 5.33332ZM32.1387 14.1025C28.2235 14.8756 22.817 14.7168 16.3345 11.4755C10.274 8.44527 5.45035 8.48343 2.19712 9.20639C2.0292 9.24367 1.86523 9.28287 1.70522 9.32367C1.2793 10.25 0.939308 11.2241 0.695362 12.2356C0.955909 12.166 1.22514 12.0998 1.50293 12.0381C5.44966 11.161 11.0261 11.1991 17.7655 14.5689C23.8261 17.5991 28.6497 17.561 31.9029 16.838C32.0144 16.8133 32.1242 16.7877 32.2322 16.7613C32.2441 16.509 32.25 16.2552 32.25 16C32.25 15.358 32.2122 14.7248 32.1387 14.1025ZM31.7098 20.1378C27.8326 20.8157 22.5836 20.5555 16.3345 17.431C10.274 14.4008 5.45035 14.439 2.19712 15.1619C1.475 15.3223 0.825392 15.5178 0.252344 15.7241C0.250782 15.8158 0.25 15.9078 0.25 16C0.25 24.8366 7.41344 32 16.25 32C23.6557 32 29.8862 26.9687 31.7098 20.1378Z"
                    class="fill-surface-700 dark:fill-surface-200"
                />
            </svg>
        </div>
        <div class="flex flex-col items-center gap-2 w-full">
            <div class="text-surface-900 dark:text-surface-0 text-2xl font-semibold leading-tight text-center w-full">Bem-vindo de volta</div>
            <div class="text-center w-full">
                <span class="text-surface-700 dark:text-surface-200 leading-normal">Ainda não tem uma conta?</span>
                <a class="text-primary font-medium ml-1 cursor-pointer hover:text-primary-emphasis">Crie sua conta hoje!</a>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-6 w-full">
        <div class="flex flex-col gap-2 w-full">
            <label for="email1" class="text-surface-900 dark:text-surface-0 font-medium leading-normal">Endereço de e-mail</label>
            <InputText id="email1" type="text" placeholder="Endereço de e-mail" class="w-full px-3 py-2 shadow-sm rounded-lg" />
        </div>
        <div class="flex flex-col gap-2 w-full">
            <label for="password1" class="text-surface-900 dark:text-surface-0 font-medium leading-normal">Senha</label>

            <Password id="password1" v-model="password" placeholder="Senha" :toggleMask="true" :feedback="false" input-class="w-full!" />
        </div>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-0">
            <div class="flex items-center gap-2">
                <Checkbox id="rememberme1" v-model="checked1" :binary="true" />
                <label for="rememberme1" class="text-surface-900 dark:text-surface-0 leading-normal">Lembrar de mim</label>
            </div>
            <a class="text-primary font-medium cursor-pointer hover:text-primary-emphasis">Esqueceu sua senha?</a>
        </div>
    </div>
    <Button label="Entrar" icon="pi pi-user" class="w-full py-2 rounded-lg flex justify-center items-center gap-2">
        <template #icon>
            <i class="pi pi-user text-base! leading-normal!" />
        </template>
    </Button>
</div>`,

    'description-list': `<div class="bg-surface-0 dark:bg-surface-950 px-8 md:px-20 py-12 md:py-20 lg:px-80">
    <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2 pb-4">
            <div class="font-semibold text-xl text-surface-900 dark:text-surface-0 leading-tight">Informações do filme</div>
            <div class="text-surface-500 dark:text-surface-300 text-base leading-tight">Conheça os detalhes e a sinopse deste filme.</div>
        </div>

        <div class="border-t border-surface-200 dark:border-surface-700" />

        <div class="flex flex-col gap-4">
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex items-center gap-4 flex-1">
                    <div class="w-[140px] text-surface-900 dark:text-surface-0 font-medium text-base leading-tight">Título</div>
                    <div class="flex-1 text-surface-900 dark:text-surface-0 text-base leading-tight">Fogo contra Fogo</div>
                </div>
                <div class="flex justify-end">
                    <Button icon="pi pi-pen-to-square" rounded outlined severity="secondary" icon-only class="shrink-0" />
                </div>
            </div>

            <div class="border-t border-surface-200 dark:border-surface-700" />

            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex items-center gap-4 flex-1">
                    <div class="w-[140px] text-surface-900 dark:text-surface-0 font-medium text-base leading-tight">Gênero</div>
                    <div class="flex-1 flex flex-wrap gap-2">
                        <Chip label="Policial" severity="secondary" />
                        <Chip label="Drama" severity="secondary" />
                        <Chip label="Suspense" severity="secondary" />
                    </div>
                </div>
                <div class="flex justify-end">
                    <Button icon="pi pi-pen-to-square" rounded outlined severity="secondary" icon-only class="shrink-0" />
                </div>
            </div>

            <div class="border-t border-surface-200 dark:border-surface-700" />

            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex items-center gap-4 flex-1">
                    <div class="w-[140px] text-surface-900 dark:text-surface-0 font-medium text-base leading-tight">Diretor</div>
                    <div class="flex-1 text-surface-900 dark:text-surface-0 text-base leading-tight">Michael Mann</div>
                </div>
                <div class="flex justify-end">
                    <Button icon="pi pi-pen-to-square" rounded outlined severity="secondary" icon-only class="shrink-0" />
                </div>
            </div>

            <div class="border-t border-surface-200 dark:border-surface-700" />

            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex items-center gap-4 flex-1">
                    <div class="w-[140px] text-surface-900 dark:text-surface-0 font-medium text-base leading-tight">Roteirista</div>
                    <div class="flex-1 text-surface-900 dark:text-surface-0 text-base leading-tight">Michael Mann</div>
                </div>
                <div class="flex justify-end">
                    <Button icon="pi pi-pen-to-square" rounded outlined severity="secondary" icon-only class="shrink-0" />
                </div>
            </div>

            <div class="border-t border-surface-200 dark:border-surface-700" />

            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex items-start gap-4 flex-1">
                    <div class="w-[140px] text-surface-900 dark:text-surface-0 font-medium text-base leading-tight">Sinopse</div>
                    <div class="flex-1 text-surface-900 dark:text-surface-0 text-base leading-normal">
                        Um grupo de assaltantes profissionais de bancos passa a ser perseguido pela polícia após deixar uma pista no seu último roubo.
                    </div>
                </div>
                <div class="flex justify-end">
                    <Button icon="pi pi-pen-to-square" rounded outlined severity="secondary" icon-only class="shrink-0" />
                </div>
            </div>

            <div class="border-t border-surface-200 dark:border-surface-700" />
        </div>
    </div>
</div>`,

    card: `<div class="bg-surface-50 dark:bg-surface-950">
    <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-2xl flex flex-col gap-4">
        <div class="flex gap-4">
            <div class="flex flex-col gap-2 flex-1">
                <div class="text-2xl leading-tight font-semibold text-surface-900 dark:text-surface-0">Título do cartão</div>
                <div class="text-base leading-tight text-surface-500 dark:text-surface-300">Adicione aqui as informações que deseja destacar.</div>
            </div>
        </div>
        <div class="flex flex-1">
            <div class="flex-1 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg h-[150px]" />
        </div>
    </div>
</div>`,
    glass: `<div
        class="px-6 py-20 md:px-20 lg:px-80 flex items-center justify-center backdrop-blur-3xl bg-cover! bg-center! bg-no-repeat!"
        style="background-image: url('https://fqjltiegiezfetthbags.supabase.co/storage/v1/object/public/block.images/blocks/signin/signin-glass.jpg')"
    >
        <div class="px-8 md:px-12 lg:px-20 py-12 flex flex-col items-center gap-12 w-full backdrop-blur-2xl rounded-2xl bg-white/10 border border-white/10 max-w-sm">
            <div class="flex flex-col items-center gap-4 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14" width="33" height="32" viewBox="0 0 33 32" fill="none">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.09219 2.87829C5.94766 3.67858 4.9127 4.62478 4.01426 5.68992C7.6857 5.34906 12.3501 5.90564 17.7655 8.61335C23.5484 11.5047 28.205 11.6025 31.4458 10.9773C31.1517 10.087 30.7815 9.23135 30.343 8.41791C26.6332 8.80919 21.8772 8.29127 16.3345 5.51998C12.8148 3.76014 9.71221 3.03521 7.09219 2.87829ZM28.1759 5.33332C25.2462 2.06 20.9887 0 16.25 0C14.8584 0 13.5081 0.177686 12.2209 0.511584C13.9643 0.987269 15.8163 1.68319 17.7655 2.65781C21.8236 4.68682 25.3271 5.34013 28.1759 5.33332ZM32.1387 14.1025C28.2235 14.8756 22.817 14.7168 16.3345 11.4755C10.274 8.44527 5.45035 8.48343 2.19712 9.20639C2.0292 9.24367 1.86523 9.28287 1.70522 9.32367C1.2793 10.25 0.939308 11.2241 0.695362 12.2356C0.955909 12.166 1.22514 12.0998 1.50293 12.0381C5.44966 11.161 11.0261 11.1991 17.7655 14.5689C23.8261 17.5991 28.6497 17.561 31.9029 16.838C32.0144 16.8133 32.1242 16.7877 32.2322 16.7613C32.2441 16.509 32.25 16.2552 32.25 16C32.25 15.358 32.2122 14.7248 32.1387 14.1025ZM31.7098 20.1378C27.8326 20.8157 22.5836 20.5555 16.3345 17.431C10.274 14.4008 5.45035 14.439 2.19712 15.1619C1.475 15.3223 0.825392 15.5178 0.252344 15.7241C0.250782 15.8158 0.25 15.9078 0.25 16C0.25 24.8366 7.41344 32 16.25 32C23.6557 32 29.8862 26.9687 31.7098 20.1378Z"
                        class="fill-surface-0"
                    />
                </svg>
                <div class="flex flex-col gap-2 w-full">
                    <div class="text-center text-3xl font-medium text-white leading-tight">Bem-vindo de volta</div>
                    <div class="text-center">
                        <span class="text-white/80">Ainda não tem uma conta? </span>
                        <a class="text-white/80 cursor-pointer hover:text-white/90 underline">Cadastre-se</a>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-center gap-8 w-full">
                <div class="flex flex-col gap-6 w-full">
                    <IconField>
                        <InputIcon class="pi pi-user text-white/70!" />
                        <InputText type="text" class="appearance-none! border! border-white/10! w-full! outline-0! bg-white/10! text-white! placeholder:text-white/70! rounded-3xl! shadow-sm!" placeholder="Nome de usuário" />
                    </IconField>
                    <IconField>
                        <InputIcon class="pi pi-lock text-white/70!" />
                        <InputText
                            type="password"
                            class="appearance-none! border! border-white/10! w-full! outline-0! bg-white/10! text-white! placeholder:text-white/70! rounded-3xl! shadow-sm!"
                            placeholder="Senha"
                        />
                    </IconField>
                </div>
                <Button label="Entrar" class="w-full! rounded-3xl! bg-surface-950! border! border-surface-950! text-white! hover:bg-surface-950/80!" />
            </div>
            <a class="text-white/80 cursor-pointer hover:text-white/90">Esqueceu a senha?</a>
        </div>
    </div>`
};
</script>

<template>
    <div>
        <!-- Page Hero Section -->
        <div class="bg-surface-0 dark:bg-surface-900 border border-surface rounded-xl p-8 bg-[url('/demo/images/blocks/landing-blocks.jpg')] dark:bg-[url('/demo/images/blocks/landing-blocks-dark.jpg')] bg-cover bg-no-repeat h-[440px] flex mb-8">
            <div class="flex flex-col gap-4 items-center sm:items-start justify-center sm:max-w-144">
                <span class="bg-surface-950 text-white px-2 py-1 font-bold rounded-md text-sm">TailwindCSS v4</span>
                <div class="flex items-center gap-4">
                    <span class="font-bold text-4xl text-surface-950 dark:text-surface-0">PrimeBlocks</span>
                </div>
                <p class="text-surface-700 dark:text-surface-300 text-lg text-center sm:text-start">Blocos de interface prontos para criar aplicações bonitas. Uma coleção completa de componentes para agilizar o desenvolvimento.</p>
                <div class="flex gap-2">
                    <Button label="Explorar blocos" as="a" href="https://primeblocks.org" target="_blank" rel="noopener noreferrer" />
                </div>
            </div>
        </div>

        <!-- Blocks Showcase -->
        <BlockViewer header="Apresentação" :code="blocksCode.hero" free>
            <div class="relative min-h-160 lg:min-h-0 bg-surface-0 dark:bg-surface-900 flex lg:flex-row flex-col">
                <div class="flex lg:flex lg:flex-row flex-col justify-center md:justify-normal h-full flex-1">
                    <div class="relative flex-1 z-20 flex items-center justify-center">
                        <div class="flex items-center justify-center h-full">
                            <div class="w-full max-w-2xl px-6 py-12 lg:p-12 xl:p-16 text-center lg:text-left">
                                <h1 class="text-4xl xl:text-5xl font-bold text-surface-0 lg:text-surface-900 dark:text-surface-0 mb-6 leading-tight!">
                                    <span class="block">Crie as telas que seus</span>
                                    <span class="block text-primary">visitantes merecem ver</span>
                                </h1>

                                <p class="text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-xl leading-normal mb-8 max-w-xl lg:max-w-none">
                                    Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades
                                    dos seus usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                                </p>

                                <div class="flex items-center gap-4 justify-center lg:justify-start">
                                    <Button label="Saiba mais" type="button" />
                                    <Button label="Demonstração" type="button" outlined />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="absolute lg:relative inset-0 lg:inset-auto flex-1">
                        <div class="absolute lg:hidden inset-0 bg-surface-900/60 dark:bg-surface-900/80 z-10" />
                        <img
                            src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/hero/hero-1.png"
                            alt="Imagem de apresentação"
                            class="h-full w-full object-cover xl:[clip-path:polygon(12%_0,100%_0%,100%_100%,0_100%)]"
                        />
                    </div>
                </div>
            </div>
        </BlockViewer>

        <!-- Feature Block -->
        <BlockViewer header="Recurso" :code="blocksCode.feature" free>
            <div class="bg-surface-0 dark:bg-surface-950 px-6 md:px-12 lg:px-20 py-20 text-center">
                <div class="flex flex-col gap-6">
                    <div class="flex flex-col items-center gap-4">
                        <div class="font-bold text-3xl leading-tight">
                            <span class="text-surface-900 dark:text-surface-0">Um produto, </span>
                            <span class="text-primary-500 dark:text-primary-400">muitas soluções</span>
                        </div>
                        <div class="text-surface-500 dark:text-surface-400 leading-tight">Conheça recursos que tornam seu projeto mais completo e fácil de usar.</div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="w-full rounded-md p-4">
                            <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                                <i class="pi pi-desktop text-2xl! lg:text-3xl! text-primary-500 dark:text-primary-400" />
                            </span>
                            <div class="flex flex-col gap-1">
                                <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">Feito para desenvolvedores</div>
                                <p class="text-surface-500 dark:text-surface-400 leading-normal">Componentes organizados e flexíveis para transformar suas ideias em aplicações.</p>
                            </div>
                        </div>
                        <div class="w-full rounded-md p-4">
                            <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                                <i class="pi pi-lock text-2xl! lg:text-3xl! text-primary-500 dark:text-primary-400" />
                            </span>
                            <div class="flex flex-col gap-1">
                                <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">Criptografia de ponta a ponta</div>
                                <p class="text-surface-500 dark:text-surface-400 leading-normal">Proteja suas informações durante a comunicação entre os usuários.</p>
                            </div>
                        </div>
                        <div class="w-full rounded-md p-4">
                            <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                                <i class="pi pi-face-smile text-2xl! lg:text-3xl! text-primary-500 dark:text-primary-400" />
                            </span>
                            <div class="flex flex-col gap-1">
                                <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">Fácil de usar</div>
                                <p class="text-surface-500 dark:text-surface-400 leading-normal">Uma interface que se adapta ao computador, ao tablet e ao celular.</p>
                            </div>
                        </div>
                        <div class="w-full rounded-md p-4">
                            <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                                <i class="pi pi-globe text-2xl! lg:text-3xl! text-primary-500 dark:text-primary-400" />
                            </span>
                            <div class="flex flex-col gap-1">
                                <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">Suporte rápido e global</div>
                                <p class="text-surface-500 dark:text-surface-400 leading-normal">Encontre ajuda para aproveitar os recursos em todas as etapas do projeto.</p>
                            </div>
                        </div>
                        <div class="w-full rounded-md p-4">
                            <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                                <i class="pi pi-github text-2xl! lg:text-3xl! text-primary-500 dark:text-primary-400" />
                            </span>
                            <div class="flex flex-col gap-1">
                                <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">Código aberto</div>
                                <p class="text-surface-500 dark:text-surface-400 leading-normal">Personalize os componentes e contribua com melhorias para a comunidade.</p>
                            </div>
                        </div>
                        <div class="w-full rounded-md p-4">
                            <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                                <i class="pi pi-shield text-2xl! lg:text-3xl! text-primary-500 dark:text-primary-400" />
                            </span>
                            <div class="flex flex-col gap-1">
                                <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">Segurança confiável</div>
                                <p class="text-surface-500 dark:text-surface-400 leading-normal">Recursos pensados para oferecer uma experiência segura e consistente.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BlockViewer>

        <!-- Glassmorphism Card Block -->
        <BlockViewer header="Cartão" :code="blocksCode.glass" free>
            <div
                class="px-6 py-20 md:px-20 lg:px-80 flex items-center justify-center backdrop-blur-3xl bg-cover! bg-center! bg-no-repeat!"
                style="background-image: url('https://fqjltiegiezfetthbags.supabase.co/storage/v1/object/public/block.images/blocks/signin/signin-glass.jpg')"
            >
                <div class="px-8 md:px-12 lg:px-20 py-12 flex flex-col items-center gap-12 w-full backdrop-blur-2xl rounded-2xl bg-white/10 border border-white/10 max-w-xl">
                    <div class="flex flex-col items-center gap-4 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14" width="33" height="32" viewBox="0 0 33 32" fill="none">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M7.09219 2.87829C5.94766 3.67858 4.9127 4.62478 4.01426 5.68992C7.6857 5.34906 12.3501 5.90564 17.7655 8.61335C23.5484 11.5047 28.205 11.6025 31.4458 10.9773C31.1517 10.087 30.7815 9.23135 30.343 8.41791C26.6332 8.80919 21.8772 8.29127 16.3345 5.51998C12.8148 3.76014 9.71221 3.03521 7.09219 2.87829ZM28.1759 5.33332C25.2462 2.06 20.9887 0 16.25 0C14.8584 0 13.5081 0.177686 12.2209 0.511584C13.9643 0.987269 15.8163 1.68319 17.7655 2.65781C21.8236 4.68682 25.3271 5.34013 28.1759 5.33332ZM32.1387 14.1025C28.2235 14.8756 22.817 14.7168 16.3345 11.4755C10.274 8.44527 5.45035 8.48343 2.19712 9.20639C2.0292 9.24367 1.86523 9.28287 1.70522 9.32367C1.2793 10.25 0.939308 11.2241 0.695362 12.2356C0.955909 12.166 1.22514 12.0998 1.50293 12.0381C5.44966 11.161 11.0261 11.1991 17.7655 14.5689C23.8261 17.5991 28.6497 17.561 31.9029 16.838C32.0144 16.8133 32.1242 16.7877 32.2322 16.7613C32.2441 16.509 32.25 16.2552 32.25 16C32.25 15.358 32.2122 14.7248 32.1387 14.1025ZM31.7098 20.1378C27.8326 20.8157 22.5836 20.5555 16.3345 17.431C10.274 14.4008 5.45035 14.439 2.19712 15.1619C1.475 15.3223 0.825392 15.5178 0.252344 15.7241C0.250782 15.8158 0.25 15.9078 0.25 16C0.25 24.8366 7.41344 32 16.25 32C23.6557 32 29.8862 26.9687 31.7098 20.1378Z"
                                class="fill-surface-0"
                            />
                        </svg>
                        <div class="flex flex-col gap-2 w-full">
                            <div class="text-center text-3xl font-medium text-white leading-tight">Bem-vindo de volta</div>
                            <div class="text-center">
                                <span class="text-white/80">Ainda não tem uma conta? </span>
                                <a class="text-white/80 cursor-pointer hover:text-white/90 underline">Cadastre-se</a>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col items-center gap-8 w-full">
                        <div class="flex flex-col gap-6 w-full">
                            <IconField>
                                <InputIcon class="pi pi-user text-white/70!" />
                                <InputText type="text" class="appearance-none! border! border-white/10! w-full! outline-0! bg-white/10! text-white! placeholder:text-white/70! rounded-3xl! shadow-sm!" placeholder="Nome de usuário" />
                            </IconField>
                            <IconField>
                                <InputIcon class="pi pi-lock text-white/70!" />
                                <InputText type="password" class="appearance-none! border! border-white/10! w-full! outline-0! bg-white/10! text-white! placeholder:text-white/70! rounded-3xl! shadow-sm!" placeholder="Senha" />
                            </IconField>
                        </div>
                        <Button label="Entrar" class="w-full! rounded-3xl! bg-surface-950! border! border-surface-950! text-white! hover:bg-surface-950/80!" />
                    </div>
                    <a class="text-white/80 cursor-pointer hover:text-white/90">Esqueceu a senha?</a>
                </div>
            </div>
        </BlockViewer>

        <!-- Pricing Block -->
        <BlockViewer header="Planos" :code="blocksCode.pricing" free>
            <div class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
                <div class="flex flex-col gap-4 items-center justify-center mb-12">
                    <div class="text-surface-900 dark:text-surface-0 font-bold text-4xl lg:text-5xl text-center leading-tight">Planos e preços</div>
                    <div class="text-surface-500 dark:text-surface-400 text-lg text-center leading-normal">Escolha o plano que melhor atende às necessidades do seu projeto.</div>
                </div>

                <div class="flex lg:flex-row flex-col gap-8 max-w-7xl mx-auto">
                    <div class="w-full flex-1 p-8 flex rounded-2xl flex-col bg-surface-0 dark:bg-surface-800 shadow-sm gap-6">
                        <div class="flex flex-col gap-2">
                            <h4 class="text-surface-900 dark:text-surface-0 font-medium text-xl leading-tight">Básico</h4>
                            <p class="text-surface-500 dark:text-surface-400 leading-normal">Escolha o plano que melhor atende às necessidades do seu projeto.</p>
                        </div>

                        <div class="w-full h-px bg-surface-200 dark:bg-surface-700" />
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-3xl text-surface-900 dark:text-surface-0 leading-tight">R$&nbsp;9,00</span>
                            <span class="font-medium text-surface-500 dark:text-surface-400 leading-tight">por mês</span>
                        </div>
                        <div class="w-full h-px bg-surface-200 dark:bg-surface-600" />
                        <ul class="list-none flex flex-col gap-4 flex-1">
                            <li class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-lg! text-green-500" />
                                <span class="text-surface-800 dark:text-surface-100 leading-tight"> Recursos essenciais </span>
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-lg! text-green-500" />
                                <span class="text-surface-800 dark:text-surface-100 leading-tight"> Atualizações incluídas </span>
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-lg! text-green-500" />
                                <span class="text-surface-800 dark:text-surface-100 leading-tight"> Suporte à configuração </span>
                            </li>
                        </ul>
                        <Button label="Comprar agora" rounded class="w-full" />
                    </div>
                    <div class="w-full flex-1 p-8 flex rounded-2xl flex-col bg-surface-0 dark:bg-surface-800 shadow-sm gap-6">
                        <div class="flex flex-col gap-2">
                            <h4 class="text-surface-900 dark:text-surface-0 font-medium text-xl leading-tight">Premium</h4>
                            <p class="text-surface-500 dark:text-surface-400 leading-normal">Escolha o plano que melhor atende às necessidades do seu projeto.</p>
                        </div>

                        <div class="w-full h-px bg-surface-200 dark:bg-surface-700" />
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-3xl text-surface-900 dark:text-surface-0 leading-tight">R$&nbsp;29,00</span>
                            <span class="font-medium text-surface-500 dark:text-surface-400 leading-tight">por mês</span>
                        </div>
                        <div class="w-full h-px bg-surface-200 dark:bg-surface-600" />
                        <ul class="list-none flex flex-col gap-4 flex-1">
                            <li class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-lg! text-green-500" />
                                <span class="text-surface-800 dark:text-surface-100 leading-tight"> Recursos essenciais </span>
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-lg! text-green-500" />
                                <span class="text-surface-800 dark:text-surface-100 leading-tight"> Atualizações incluídas </span>
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-lg! text-green-500" />
                                <span class="text-surface-800 dark:text-surface-100 leading-tight"> Suporte à configuração </span>
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-lg! text-green-500" />
                                <span class="text-surface-800 dark:text-surface-100 leading-tight"> Recursos avançados </span>
                            </li>
                        </ul>
                        <Button label="Comprar agora" rounded class="w-full" />
                    </div>
                    <div class="w-full flex-1 p-8 flex rounded-2xl flex-col bg-surface-0 dark:bg-surface-800 shadow-sm gap-6">
                        <div class="flex flex-col gap-2">
                            <h4 class="text-surface-900 dark:text-surface-0 font-medium text-xl leading-tight">Empresarial</h4>
                            <p class="text-surface-500 dark:text-surface-400 leading-normal">Escolha o plano que melhor atende às necessidades do seu projeto.</p>
                        </div>

                        <div class="w-full h-px bg-surface-200 dark:bg-surface-700" />
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-3xl text-surface-900 dark:text-surface-0 leading-tight">R$&nbsp;49,00</span>
                            <span class="font-medium text-surface-500 dark:text-surface-400 leading-tight">por mês</span>
                        </div>
                        <div class="w-full h-px bg-surface-200 dark:bg-surface-600" />
                        <ul class="list-none flex flex-col gap-4 flex-1">
                            <li class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-lg! text-green-500" />
                                <span class="text-surface-800 dark:text-surface-100 leading-tight"> Recursos essenciais </span>
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-lg! text-green-500" />
                                <span class="text-surface-800 dark:text-surface-100 leading-tight"> Atualizações incluídas </span>
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-lg! text-green-500" />
                                <span class="text-surface-800 dark:text-surface-100 leading-tight"> Suporte à configuração </span>
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-lg! text-green-500" />
                                <span class="text-surface-800 dark:text-surface-100 leading-tight"> Recursos avançados </span>
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-lg! text-green-500" />
                                <span class="text-surface-800 dark:text-surface-100 leading-tight"> Atendimento prioritário </span>
                            </li>
                        </ul>
                        <Button label="Comprar agora" rounded class="w-full" />
                    </div>
                </div>
            </div>
        </BlockViewer>

        <!-- Call to Action Block -->
        <BlockViewer header="Chamada para ação" :code="blocksCode.cta" free>
            <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
                <div class="text-surface-700 dark:text-surface-100 text-center flex flex-col items-center gap-4">
                    <div class="text-primary font-bold text-lg leading-tight"><i class="pi pi-discord text-lg! leading-none!" />COM DISCORD</div>
                    <div class="text-surface-900 dark:text-surface-0 font-bold text-4xl leading-tight">Participe da nossa comunidade de design</div>
                    <div class="text-surface-700 dark:text-surface-100 text-xl leading-normal">Escolha o plano que melhor atende às necessidades do seu projeto.</div>
                    <Button label="Participar agora" icon="pi pi-discord" rounded class="mt-4" />
                </div>
            </div>
        </BlockViewer>

        <!-- Banner Block -->
        <BlockViewer header="Faixa de destaque" :code="blocksCode.banner" containerClass="bg-surface-0 dark:bg-surface-950" free>
            <div class="pb-20 bg-surface-0 dark:bg-surface-950">
                <div class="bg-surface-900 text-surface-100 py-4 px-6 lg:px-20 flex justify-between items-center flex-wrap">
                    <div class="font-bold">🔥 Ofertas imperdíveis!</div>
                    <div class="inline-flex gap-1 items-center">
                        <span class="hidden lg:flex leading-normal">Aproveite condições especiais para começar seu projeto.</span>
                        <a class="text-surface-0 underline font-bold" href="#">Saiba mais</a>
                    </div>
                    <Button icon="pi pi-times" text rounded severity="secondary" class="text-surface-0! hover:bg-surface-500/20!" />
                </div>
            </div>
        </BlockViewer>

        <!-- Page Heading Block -->
        <BlockViewer header="Cabeçalho da página" :code="blocksCode['page-heading']" free>
            <div class="bg-surface-0 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
                <ul class="list-none p-0 m-0 flex items-center font-medium mb-5">
                    <li>
                        <a class="text-surface-500 dark:text-surface-300 no-underline leading-normal cursor-pointer">Aplicativo</a>
                    </li>
                    <li class="px-2">
                        <i class="pi pi-angle-right text-surface-500 dark:text-surface-300 text-sm! leading-normal!" />
                    </li>
                    <li>
                        <span class="text-surface-900 dark:text-surface-0 leading-normal">Análises</span>
                    </li>
                </ul>
                <div class="flex items-start flex-col md:justify-between md:flex-row">
                    <div>
                        <div class="font-bold text-3xl text-surface-900 dark:text-surface-0 mb-4">Clientes</div>
                        <div class="flex items-center text-surface-700 dark:text-surface-300 flex-wrap gap-8">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-users text-base! leading-normal!" />
                                <span>332 usuários ativos</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="pi pi-globe text-base! leading-normal!" />
                                <span>9.402 sessões</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="pi pi-clock text-base! leading-normal!" />
                                <span>2,32 min de duração média</span>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6 md:mt-0 flex items-center">
                        <Button label="Adicione" class="mr-3" outlined icon="pi pi-user-plus" />
                        <Button label="Salvar alterações" icon="pi pi-check" class="whitespace-nowrap" />
                    </div>
                </div>
            </div>
        </BlockViewer>

        <!-- Stats Block -->
        <BlockViewer header="Estatísticas" :code="blocksCode.stats" free>
            <div class="bg-surface-50 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
                <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div class="bg-surface-0 dark:bg-surface-900 shadow-sm p-5 rounded-2xl">
                        <div class="flex justify-between gap-4">
                            <div class="flex flex-col gap-2">
                                <span class="text-surface-700 dark:text-surface-300 font-normal leading-tight">Mensagens</span>
                                <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl! leading-tight!">152</div>
                            </div>
                            <div class="flex items-center justify-center bg-linear-to-b from-cyan-400 dark:from-cyan-300 to-cyan-600 dark:to-cyan-500 rounded-lg w-10 h-10">
                                <i class="pi pi-envelope text-surface-0 dark:text-surface-900 text-xl! leading-none!" />
                            </div>
                        </div>
                        <div class="mt-4">
                            <span class="text-surface-600 dark:text-surface-300 font-medium leading-tight">24 novos</span>
                            <span class="text-surface-500 dark:text-surface-300 leading-tight"> desde a última visita</span>
                        </div>
                    </div>

                    <div class="bg-surface-0 dark:bg-surface-900 shadow-sm p-5 rounded-2xl">
                        <div class="flex justify-between gap-4">
                            <div class="flex flex-col gap-2">
                                <span class="text-surface-700 dark:text-surface-300 font-normal leading-tight">Entradas</span>
                                <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl! leading-tight!">532</div>
                            </div>
                            <div class="flex items-center justify-center bg-linear-to-b from-orange-400 dark:from-orange-300 to-orange-600 dark:to-orange-500 rounded-lg w-10 h-10">
                                <i class="pi pi-map-marker text-surface-0 dark:text-surface-900 text-xl! leading-none!" />
                            </div>
                        </div>
                        <div class="mt-4">
                            <span class="text-surface-600 dark:text-surface-300 font-medium leading-tight">48 novas</span>
                            <span class="text-surface-500 dark:text-surface-300 leading-tight"> desde a última visita</span>
                        </div>
                    </div>

                    <div class="bg-surface-0 dark:bg-surface-900 shadow-sm p-5 rounded-2xl">
                        <div class="flex justify-between gap-4">
                            <div class="flex flex-col gap-2">
                                <span class="text-surface-700 dark:text-surface-300 font-normal leading-tight">Arquivos sincronizados</span>
                                <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl! leading-tight!">28.441</div>
                            </div>
                            <div class="flex items-center justify-center bg-linear-to-b from-slate-400 dark:from-slate-300 to-slate-600 dark:to-slate-500 rounded-lg w-10 h-10">
                                <i class="pi pi-file text-surface-0 dark:text-surface-900 text-xl! leading-none!" />
                            </div>
                        </div>
                        <div class="mt-4">
                            <span class="text-surface-500 dark:text-surface-300 leading-tight">32,56 / 250 GB</span>
                        </div>
                    </div>

                    <div class="bg-surface-0 dark:bg-surface-900 shadow-sm p-5 rounded-2xl">
                        <div class="flex justify-between gap-4">
                            <div class="flex flex-col gap-2">
                                <span class="text-surface-700 dark:text-surface-300 font-normal leading-tight">Usuários conectados</span>
                                <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl! leading-tight!">25.660</div>
                            </div>
                            <div class="flex items-center justify-center bg-linear-to-b from-violet-400 dark:from-violet-300 to-violet-600 dark:to-violet-500 rounded-lg w-10 h-10">
                                <i class="pi pi-users text-surface-0 dark:text-surface-900 text-xl! leading-none!" />
                            </div>
                        </div>
                        <div class="mt-4">
                            <span class="text-surface-600 dark:text-surface-300 font-medium leading-tight">72 novos</span>
                            <span class="text-surface-500 dark:text-surface-300 leading-tight"> usuários nesta semana</span>
                        </div>
                    </div>
                </div>
            </div>
        </BlockViewer>

        <!-- Sign-In Block -->
        <BlockViewer header="Acesso" :code="blocksCode['sign-in']" containerClass="" free>
            <div class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20 flex items-center justify-center">
                <div class="bg-surface-0 dark:bg-surface-900 p-8 md:p-12 shadow-sm rounded-2xl w-full max-w-xl mx-auto flex flex-col gap-8">
                    <div class="flex flex-col items-center gap-4">
                        <div class="flex items-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14" width="33" height="32" viewBox="0 0 33 32" fill="none">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M7.09219 2.87829C5.94766 3.67858 4.9127 4.62478 4.01426 5.68992C7.6857 5.34906 12.3501 5.90564 17.7655 8.61335C23.5484 11.5047 28.205 11.6025 31.4458 10.9773C31.1517 10.087 30.7815 9.23135 30.343 8.41791C26.6332 8.80919 21.8772 8.29127 16.3345 5.51998C12.8148 3.76014 9.71221 3.03521 7.09219 2.87829ZM28.1759 5.33332C25.2462 2.06 20.9887 0 16.25 0C14.8584 0 13.5081 0.177686 12.2209 0.511584C13.9643 0.987269 15.8163 1.68319 17.7655 2.65781C21.8236 4.68682 25.3271 5.34013 28.1759 5.33332ZM32.1387 14.1025C28.2235 14.8756 22.817 14.7168 16.3345 11.4755C10.274 8.44527 5.45035 8.48343 2.19712 9.20639C2.0292 9.24367 1.86523 9.28287 1.70522 9.32367C1.2793 10.25 0.939308 11.2241 0.695362 12.2356C0.955909 12.166 1.22514 12.0998 1.50293 12.0381C5.44966 11.161 11.0261 11.1991 17.7655 14.5689C23.8261 17.5991 28.6497 17.561 31.9029 16.838C32.0144 16.8133 32.1242 16.7877 32.2322 16.7613C32.2441 16.509 32.25 16.2552 32.25 16C32.25 15.358 32.2122 14.7248 32.1387 14.1025ZM31.7098 20.1378C27.8326 20.8157 22.5836 20.5555 16.3345 17.431C10.274 14.4008 5.45035 14.439 2.19712 15.1619C1.475 15.3223 0.825392 15.5178 0.252344 15.7241C0.250782 15.8158 0.25 15.9078 0.25 16C0.25 24.8366 7.41344 32 16.25 32C23.6557 32 29.8862 26.9687 31.7098 20.1378Z"
                                    class="fill-surface-700 dark:fill-surface-200"
                                />
                            </svg>
                        </div>
                        <div class="flex flex-col items-center gap-2 w-full">
                            <div class="text-surface-900 dark:text-surface-0 text-2xl font-semibold leading-tight text-center w-full">Bem-vindo de volta</div>
                            <div class="text-center w-full">
                                <span class="text-surface-700 dark:text-surface-200 leading-normal">Ainda não tem uma conta?</span>
                                <a class="text-primary font-medium ml-1 cursor-pointer hover:text-primary-emphasis">Crie sua conta hoje!</a>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-6 w-full">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="email1" class="text-surface-900 dark:text-surface-0 font-medium leading-normal">Endereço de e-mail</label>
                            <InputText id="email1" type="text" placeholder="Endereço de e-mail" class="w-full px-3 py-2 shadow-sm rounded-lg" />
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="password1" class="text-surface-900 dark:text-surface-0 font-medium leading-normal">Senha</label>

                            <Password id="password1" v-model="password" placeholder="Senha" :toggleMask="true" :feedback="false" input-class="w-full!" />
                        </div>
                        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-0">
                            <div class="flex items-center gap-2">
                                <Checkbox id="rememberme1" v-model="checked1" :binary="true" />
                                <label for="rememberme1" class="text-surface-900 dark:text-surface-0 leading-normal">Lembrar de mim</label>
                            </div>
                            <a class="text-primary font-medium cursor-pointer hover:text-primary-emphasis">Esqueceu sua senha?</a>
                        </div>
                    </div>
                    <Button label="Entrar" icon="pi pi-user" class="w-full py-2 rounded-lg flex justify-center items-center gap-2">
                        <template #icon>
                            <i class="pi pi-user text-base! leading-normal!" />
                        </template>
                    </Button>
                </div>
            </div>
        </BlockViewer>

        <!-- Description List Block -->
        <BlockViewer header="Lista de descrições" :code="blocksCode['description-list']" free>
            <div class="bg-surface-0 dark:bg-surface-950 px-8 md:px-20 py-12 md:py-20 lg:px-80">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2 pb-4">
                        <div class="font-semibold text-xl text-surface-900 dark:text-surface-0 leading-tight">Informações do filme</div>
                        <div class="text-surface-500 dark:text-surface-300 text-base leading-tight">Conheça os detalhes e a sinopse deste filme.</div>
                    </div>

                    <div class="border-t border-surface-200 dark:border-surface-700" />

                    <div class="flex flex-col gap-4">
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex items-center gap-4 flex-1">
                                <div class="w-[140px] text-surface-900 dark:text-surface-0 font-medium text-base leading-tight">Título</div>
                                <div class="flex-1 text-surface-900 dark:text-surface-0 text-base leading-tight">Fogo contra Fogo</div>
                            </div>
                            <div class="flex justify-end">
                                <Button icon="pi pi-pen-to-square" rounded outlined severity="secondary" icon-only class="shrink-0" />
                            </div>
                        </div>

                        <div class="border-t border-surface-200 dark:border-surface-700" />

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex items-center gap-4 flex-1">
                                <div class="w-[140px] text-surface-900 dark:text-surface-0 font-medium text-base leading-tight">Gênero</div>
                                <div class="flex-1 flex flex-wrap gap-2">
                                    <Chip label="Policial" severity="secondary" />
                                    <Chip label="Drama" severity="secondary" />
                                    <Chip label="Suspense" severity="secondary" />
                                </div>
                            </div>
                            <div class="flex justify-end">
                                <Button icon="pi pi-pen-to-square" rounded outlined severity="secondary" icon-only class="shrink-0" />
                            </div>
                        </div>

                        <div class="border-t border-surface-200 dark:border-surface-700" />

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex items-center gap-4 flex-1">
                                <div class="w-[140px] text-surface-900 dark:text-surface-0 font-medium text-base leading-tight">Diretor</div>
                                <div class="flex-1 text-surface-900 dark:text-surface-0 text-base leading-tight">Michael Mann</div>
                            </div>
                            <div class="flex justify-end">
                                <Button icon="pi pi-pen-to-square" rounded outlined severity="secondary" icon-only class="shrink-0" />
                            </div>
                        </div>

                        <div class="border-t border-surface-200 dark:border-surface-700" />

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex items-center gap-4 flex-1">
                                <div class="w-[140px] text-surface-900 dark:text-surface-0 font-medium text-base leading-tight">Roteirista</div>
                                <div class="flex-1 text-surface-900 dark:text-surface-0 text-base leading-tight">Michael Mann</div>
                            </div>
                            <div class="flex justify-end">
                                <Button icon="pi pi-pen-to-square" rounded outlined severity="secondary" icon-only class="shrink-0" />
                            </div>
                        </div>

                        <div class="border-t border-surface-200 dark:border-surface-700" />

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex items-start gap-4 flex-1">
                                <div class="w-[140px] text-surface-900 dark:text-surface-0 font-medium text-base leading-tight">Sinopse</div>
                                <div class="flex-1 text-surface-900 dark:text-surface-0 text-base leading-normal">Um grupo de assaltantes profissionais de bancos passa a ser perseguido pela polícia após deixar uma pista no seu último roubo.</div>
                            </div>
                            <div class="flex justify-end">
                                <Button icon="pi pi-pen-to-square" rounded outlined severity="secondary" icon-only class="shrink-0" />
                            </div>
                        </div>

                        <div class="border-t border-surface-200 dark:border-surface-700" />
                    </div>
                </div>
            </div>
        </BlockViewer>

        <!-- Card Block -->
        <BlockViewer header="Cartão" :code="blocksCode.card" free>
            <div class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
                <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-2xl flex flex-col gap-4">
                    <div class="flex gap-4">
                        <div class="flex flex-col gap-2 flex-1">
                            <div class="text-2xl leading-tight font-semibold text-surface-900 dark:text-surface-0">Título do cartão</div>
                            <div class="text-base leading-tight text-surface-500 dark:text-surface-300">Adicione aqui as informações que deseja destacar.</div>
                        </div>
                    </div>
                    <div class="flex flex-1">
                        <div class="flex-1 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg h-[150px]" />
                    </div>
                </div>
            </div>
        </BlockViewer>
    </div>
</template>
