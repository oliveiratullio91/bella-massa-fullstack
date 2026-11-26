<script setup>
import { ref } from 'vue';

const dropdownItems = ref([
    { name: 'Opção 1', code: 'Opção 1' },
    { name: 'Opção 2', code: 'Opção 2' },
    { name: 'Opção 3', code: 'Opção 3' }
]);

const dropdownItem = ref(null);
</script>

<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Vertical</div>
                    <div class="flex flex-col gap-2">
                        <label for="name1">Nome</label>
                        <InputText id="name1" type="text" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="email1">E-mail</label>
                        <InputText id="email1" type="text" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="age1">Idade</label>
                        <InputText id="age1" type="text" />
                    </div>
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Grade vertical</div>
                    <div class="flex flex-wrap gap-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="name2">Nome</label>
                            <InputText id="name2" type="text" />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="email2">E-mail</label>
                            <InputText id="email2" type="text" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Horizontal</div>
                    <div class="grid grid-cols-12 gap-2">
                        <label for="name3" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Nome</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText id="name3" type="text" />
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2">
                        <label for="email3" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">E-mail</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText id="email3" type="text" />
                        </div>
                    </div>
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Em linha</div>
                    <div class="flex flex-wrap items-start gap-4">
                        <div class="field">
                            <label for="firstname1" class="sr-only">Nome</label>
                            <InputText id="firstname1" type="text" placeholder="Nome" />
                        </div>
                        <div class="field">
                            <label for="lastname1" class="sr-only">Sobrenome</label>
                            <InputText id="lastname1" type="text" placeholder="Sobrenome" />
                        </div>
                        <Button label="Enviar" :fluid="false"></Button>
                    </div>
                </div>
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Texto de ajuda</div>
                    <div class="flex flex-wrap gap-2">
                        <label for="username">Nome de usuário</label>
                        <InputText id="username" type="text" />
                        <small>Informe seu nome de usuário para redefinir a senha.</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl">Avançado</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="firstname2">Nome</label>
                        <InputText id="firstname2" type="text" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="lastname2">Sobrenome</label>
                        <InputText id="lastname2" type="text" />
                    </div>
                </div>

                <div class="flex flex-wrap">
                    <label for="address">Endereço</label>
                    <Textarea id="address" rows="4" />
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="state">Estado</label>
                        <Select id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Selecione uma opção" class="w-full"></Select>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="zip">CEP</label>
                        <InputText id="zip" type="text" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>
