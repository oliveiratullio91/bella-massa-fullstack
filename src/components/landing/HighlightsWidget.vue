<template>
    <div id="highlights" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
        <div class="text-center">
            <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Poderoso em qualquer lugar</div>
            <span class="text-muted-color text-2xl">Uma experiência completa no computador e no celular.</span>
        </div>

        <div class="grid grid-cols-12 gap-4 mt-20 pb-2 md:pb-20">
            <div class="flex justify-center col-span-12 lg:col-span-6 bg-purple-100 p-0 order-1 lg:order-none" style="border-radius: 8px">
                <img src="/demo/images/landing/mockup.svg" class="w-11/12" alt="Prévia no celular" />
            </div>

            <div class="col-span-12 lg:col-span-6 my-auto flex flex-col lg:items-end text-center lg:text-right gap-4">
                <div class="flex items-center justify-center bg-purple-200 self-center lg:self-end" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                    <i class="pi pi-fw pi-mobile text-4xl! text-purple-700"></i>
                </div>
                <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal">Seu projeto sempre com você</div>
                <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal ml-0 md:ml-2" style="max-width: 650px"
                    >Acesse os principais recursos em qualquer dispositivo. O layout se adapta a diferentes tamanhos de tela para oferecer uma navegação confortável, onde você estiver.</span
                >
            </div>
        </div>

        <div class="grid grid-cols-12 gap-4 my-20 pt-2 md:pt-20">
            <div class="col-span-12 lg:col-span-6 my-auto flex flex-col text-center lg:text-left lg:items-start gap-4">
                <div class="flex items-center justify-center bg-yellow-200 self-center lg:self-start" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                    <i class="pi pi-fw pi-desktop text-3xl! text-yellow-700"></i>
                </div>
                <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal">Mais espaço para suas ideias</div>
                <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal mr-0 md:mr-2" style="max-width: 650px"
                    >Organize suas informações com componentes prontos e um visual consistente. Personalize a interface para atender às necessidades do seu projeto e aproveite uma experiência fluida em todas as telas.</span
                >
            </div>

            <div class="flex justify-end order-1 sm:order-2 col-span-12 lg:col-span-6 bg-yellow-100 p-0" style="border-radius: 8px">
                <img src="/demo/images/landing/mockup-desktop.svg" class="w-11/12" alt="Prévia da interface" />
            </div>
        </div>
    </div>
</template>
