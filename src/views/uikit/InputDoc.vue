<script setup>
import { CountryService } from '@/service/CountryService';
import { NodeService } from '@/service/NodeService';
import { onMounted, ref } from 'vue';

const floatValue = ref(null);
const autoValue = ref(null);
const selectedAutoValue = ref(null);
const autoFilteredValue = ref([]);
const calendarValue = ref(null);
const inputNumberValue = ref(null);
const sliderValue = ref(50);
const ratingValue = ref(null);
const colorValue = ref('#1976D2');
const radioValue = ref(null);
const checkboxValue = ref([]);
const switchValue = ref(false);
const listboxValues = ref([
    { name: 'Nova York', code: 'NY' },
    { name: 'Roma', code: 'RM' },
    { name: 'Londres', code: 'LDN' },
    { name: 'Istambul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const listboxValue = ref(null);
const dropdownValues = ref([
    { name: 'Nova York', code: 'NY' },
    { name: 'Roma', code: 'RM' },
    { name: 'Londres', code: 'LDN' },
    { name: 'Istambul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const dropdownValue = ref(null);
const multiselectValues = ref([
    { name: 'Austrália', code: 'AU' },
    { name: 'Brasil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egito', code: 'EG' },
    { name: 'França', code: 'FR' },
    { name: 'Alemanha', code: 'DE' },
    { name: 'Índia', code: 'IN' },
    { name: 'Japão', code: 'JP' },
    { name: 'Espanha', code: 'ES' },
    { name: 'Estados Unidos', code: 'US' }
]);

const multiselectValue = ref(null);
const toggleValue = ref(false);
const selectButtonValue = ref(null);
const selectButtonValues = ref([{ name: 'Opção 1' }, { name: 'Opção 2' }, { name: 'Opção 3' }]);
const knobValue = ref(50);
const inputGroupValue = ref(false);
const treeSelectNodes = ref(null);
const selectedNode = ref(null);

onMounted(() => {
    CountryService.getCountries().then((data) => (autoValue.value = data));
    NodeService.getTreeNodes().then((data) => (treeSelectNodes.value = data));
});

function searchCountry(event) {
    setTimeout(() => {
        if (!event.query.trim().length) {
            autoFilteredValue.value = [...autoValue.value];
        } else {
            autoFilteredValue.value = autoValue.value.filter((country) => {
                return country.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
}
</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Campo de texto</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <InputText type="text" placeholder="Padrão" />
                    <InputText type="text" placeholder="Desabilitado" :disabled="true" />
                    <InputText type="text" placeholder="Inválido" invalid />
                </div>

                <div class="font-semibold text-xl">Ícones</div>
                <IconField>
                    <InputIcon class="pi pi-user" />
                    <InputText type="text" placeholder="Nome de usuário" />
                </IconField>
                <IconField iconPosition="left">
                    <InputText type="text" placeholder="Pesquisar" />
                    <InputIcon class="pi pi-search" />
                </IconField>

                <div class="font-semibold text-xl">Rótulo flutuante</div>
                <FloatLabel>
                    <InputText id="username" type="text" v-model="floatValue" />
                    <label for="username">Nome de usuário</label>
                </FloatLabel>

                <div class="font-semibold text-xl">Área de texto</div>
                <Textarea placeholder="Sua mensagem" :autoResize="true" rows="3" cols="30" />

                <div class="font-semibold text-xl">Preenchimento automático</div>
                <AutoComplete v-model="selectedAutoValue" :suggestions="autoFilteredValue" optionLabel="name" placeholder="Pesquisar" dropdown multiple display="chip" @complete="searchCountry($event)" />

                <div class="font-semibold text-xl">Seletor de data</div>
                <DatePicker :showIcon="true" :showButtonBar="true" v-model="calendarValue"></DatePicker>

                <div class="font-semibold text-xl">Campo numérico</div>
                <InputNumber v-model="inputNumberValue" showButtons mode="decimal"></InputNumber>
            </div>

            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Controle deslizante</div>
                <InputText v-model.number="sliderValue" />
                <Slider v-model="sliderValue" />

                <div class="flex flex-row mt-6">
                    <div class="flex flex-col gap-4 w-1/2">
                        <div class="font-semibold text-xl">Avaliação</div>
                        <Rating v-model="ratingValue" />
                    </div>
                    <div class="flex flex-col gap-4 w-1/2">
                        <div class="font-semibold text-xl">Seletor de cor</div>
                        <ColorPicker style="width: 2rem" v-model="colorValue" />
                    </div>
                </div>

                <div class="font-semibold text-xl">Controle giratório</div>
                <Knob v-model="knobValue" :step="10" :min="-50" :max="50" valueTemplate="{value}%" />
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Seleção única</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex items-center">
                        <RadioButton id="option1" name="option" value="Chicago" v-model="radioValue" />
                        <label for="option1" class="leading-none ml-2">Chicago</label>
                    </div>
                    <div class="flex items-center">
                        <RadioButton id="option2" name="option" value="Los Angeles" v-model="radioValue" />
                        <label for="option2" class="leading-none ml-2">Los Angeles</label>
                    </div>
                    <div class="flex items-center">
                        <RadioButton id="option3" name="option" value="New York" v-model="radioValue" />
                        <label for="option3" class="leading-none ml-2">Nova York</label>
                    </div>
                </div>

                <div class="font-semibold text-xl">Caixa de seleção</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex items-center">
                        <Checkbox id="checkOption1" name="option" value="Chicago" v-model="checkboxValue" />
                        <label for="checkOption1" class="ml-2">Chicago</label>
                    </div>
                    <div class="flex items-center">
                        <Checkbox id="checkOption2" name="option" value="Los Angeles" v-model="checkboxValue" />
                        <label for="checkOption2" class="ml-2">Los Angeles</label>
                    </div>
                    <div class="flex items-center">
                        <Checkbox id="checkOption3" name="option" value="New York" v-model="checkboxValue" />
                        <label for="checkOption3" class="ml-2">Nova York</label>
                    </div>
                </div>

                <div class="font-semibold text-xl">Interruptor</div>
                <ToggleSwitch v-model="switchValue" />
            </div>

            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Lista de opções</div>
                <Listbox v-model="listboxValue" :options="listboxValues" optionLabel="name" :filter="true" />

                <div class="font-semibold text-xl">Selecionar</div>
                <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Selecionar" />

                <div class="font-semibold text-xl">Seleção múltipla</div>
                <MultiSelect v-model="multiselectValue" :options="multiselectValues" optionLabel="name" placeholder="Selecione os países" :filter="true">
                    <template #value="slotProps">
                        <div class="inline-flex items-center py-1 px-2 bg-primary text-primary-contrast rounded-border mr-2" v-for="option of slotProps.value" :key="option.code">
                            <span :class="'mr-2 flag flag-' + option.code.toLowerCase()" style="width: 18px; height: 12px" />
                            <div>{{ option.name }}</div>
                        </div>
                        <template v-if="!slotProps.value || slotProps.value.length === 0">
                            <div class="p-1">Selecione os países</div>
                        </template>
                    </template>
                    <template #option="slotProps">
                        <div class="flex items-center">
                            <span :class="'mr-2 flag flag-' + slotProps.option.code.toLowerCase()" style="width: 18px; height: 12px" />
                            <div>{{ slotProps.option.name }}</div>
                        </div>
                    </template>
                </MultiSelect>

                <div class="font-semibold text-xl">Seleção em árvore</div>
                <TreeSelect v-model="selectedNode" :options="treeSelectNodes" placeholder="Selecione um item"></TreeSelect>
            </div>

            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Botão de alternância</div>
                <ToggleButton v-model="toggleValue" onLabel="Sim" offLabel="Não" :style="{ width: '10em' }" />

                <div class="font-semibold text-xl">Botões de seleção</div>
                <SelectButton v-model="selectButtonValue" :options="selectButtonValues" optionLabel="name" />
            </div>
        </div>
    </Fluid>

    <Fluid class="flex mt-8">
        <div class="card flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Grupo de campos</div>
            <div class="flex flex-col md:flex-row gap-4">
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-user"></i>
                    </InputGroupAddon>
                    <InputText placeholder="Nome de usuário" />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-clock"></i>
                    </InputGroupAddon>
                    <InputGroupAddon>
                        <i class="pi pi-star-fill"></i>
                    </InputGroupAddon>
                    <InputNumber placeholder="Preço" />
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputGroupAddon>.00</InputGroupAddon>
                </InputGroup>
            </div>
            <div class="flex flex-col md:flex-row gap-4">
                <InputGroup>
                    <Button label="Pesquisar" />
                    <InputText placeholder="Palavra-chave" />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>
                        <Checkbox v-model="inputGroupValue" :binary="true" />
                    </InputGroupAddon>
                    <InputText placeholder="Confirmar" />
                </InputGroup>
            </div>
        </div>
    </Fluid>
</template>
