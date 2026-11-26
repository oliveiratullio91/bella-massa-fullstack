<script setup>
import { ref } from 'vue';

const items = ref([
    {
        label: 'Salvar',
        icon: 'pi pi-check'
    },
    {
        label: 'Atualizar',
        icon: 'pi pi-upload'
    },
    {
        label: 'Excluir',
        icon: 'pi pi-trash'
    },
    {
        label: 'Página inicial',
        icon: 'pi pi-home'
    }
]);
const cardMenu = ref([
    { label: 'Salvar', icon: 'pi pi-fw pi-check' },
    { label: 'Atualizar', icon: 'pi pi-fw pi-refresh' },
    { label: 'Excluir', icon: 'pi pi-fw pi-trash' }
]);
const menuRef = ref(null);

function toggle() {
    menuRef.value.toggle(event);
}
</script>

<template>
    <div class="flex flex-col">
        <div class="card">
            <div class="font-semibold text-xl mb-4">Barra de ferramentas</div>
            <Toolbar>
                <template #start>
                    <Button icon="pi pi-plus" class="mr-2" severity="secondary" text />
                    <Button icon="pi pi-print" class="mr-2" severity="secondary" text />
                    <Button icon="pi pi-upload" severity="secondary" text />
                </template>

                <template #center>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText placeholder="Pesquisar" />
                    </IconField>
                </template>

                <template #end> <SplitButton label="Salvar" :model="items"></SplitButton></template>
            </Toolbar>
        </div>

        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <div class="card">
                    <div class="font-semibold text-xl mb-4">Painéis expansíveis</div>
                    <Accordion value="0">
                        <AccordionPanel value="0">
                            <AccordionHeader>Cabeçalho I</AccordionHeader>
                            <AccordionContent>
                                <p class="m-0">
                                    Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades
                                    dos seus usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                                </p>
                            </AccordionContent>
                        </AccordionPanel>
                        <AccordionPanel value="1">
                            <AccordionHeader>Cabeçalho II</AccordionHeader>
                            <AccordionContent>
                                <p class="m-0">
                                    Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades
                                    dos seus usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                                </p>
                            </AccordionContent>
                        </AccordionPanel>
                        <AccordionPanel value="2">
                            <AccordionHeader>Cabeçalho III</AccordionHeader>
                            <AccordionContent>
                                <p class="m-0">
                                    Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades
                                    dos seus usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                                </p>
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>
                </div>
                <div class="card">
                    <div class="font-semibold text-xl mb-4">Abas</div>
                    <Tabs value="0">
                        <TabList>
                            <Tab value="0">Cabeçalho I</Tab>
                            <Tab value="1">Cabeçalho II</Tab>
                            <Tab value="2">Cabeçalho III</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel value="0">
                                <p class="m-0">
                                    Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades
                                    dos seus usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                                </p>
                            </TabPanel>
                            <TabPanel value="1">
                                <p class="m-0">
                                    Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades
                                    dos seus usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                                </p>
                            </TabPanel>
                            <TabPanel value="2">
                                <p class="m-0">
                                    Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades
                                    dos seus usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                                </p>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </div>
            <div class="md:w-1/2 mt-6 md:mt-0">
                <div class="card">
                    <div class="font-semibold text-xl mb-4">Painel</div>
                    <Panel header="Cabeçalho" :toggleable="true">
                        <p class="leading-normal m-0">
                            Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades dos seus
                            usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                        </p>
                    </Panel>
                </div>
                <div class="card">
                    <div class="font-semibold text-xl mb-4">Grupo de campos</div>
                    <Fieldset legend="Legenda" :toggleable="true">
                        <p class="leading-normal m-0">
                            Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades dos seus
                            usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                        </p>
                    </Fieldset>
                </div>

                <Card>
                    <template v-slot:title>
                        <div class="flex items-center justify-between mb-0">
                            <div class="font-semibold text-xl mb-4">Cartão</div>
                            <Button icon="pi pi-plus" class="p-button-text" @click="toggle" />
                        </div>
                        <Menu id="config_menu" ref="menuRef" :model="cardMenu" :popup="true" />
                    </template>

                    <template v-slot:content>
                        <p class="leading-normal m-0">
                            Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades dos seus
                            usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                        </p>
                    </template>
                </Card>
            </div>
        </div>

        <div class="card mt-8">
            <div class="font-semibold text-xl mb-4">Divisor</div>
            <div class="flex flex-col md:flex-row">
                <div class="w-full md:w-5/12 flex flex-col items-center justify-center gap-3 py-5">
                    <div class="flex flex-col gap-2">
                        <label for="username">Nome de usuário</label>
                        <InputText id="username" type="text" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="password">Senha</label>
                        <InputText id="password" type="password" />
                    </div>
                    <div class="flex">
                        <Button label="Entrar" icon="pi pi-user" class="w-full max-w-[17.35rem] mx-auto"></Button>
                    </div>
                </div>
                <div class="w-full md:w-2/12">
                    <Divider layout="vertical" class="hidden! md:flex!"><b>OU</b></Divider>
                    <Divider layout="horizontal" class="flex! md:hidden!" align="center"><b>OU</b></Divider>
                </div>
                <div class="w-full md:w-5/12 flex items-center justify-center py-5">
                    <Button label="Cadastre-se" icon="pi pi-user-plus" severity="success" class="w-full max-w-[17.35rem] mx-auto"></Button>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="font-semibold text-xl mb-4">Divisor de painéis</div>
            <Splitter style="height: 300px" class="mb-8">
                <SplitterPanel :size="30" :minSize="10">
                    <div className="h-full flex items-center justify-center">Painel 1</div>
                </SplitterPanel>
                <SplitterPanel :size="70">
                    <Splitter layout="vertical">
                        <SplitterPanel :size="15">
                            <div className="h-full flex items-center justify-center">Painel 2</div>
                        </SplitterPanel>
                        <SplitterPanel :size="50">
                            <div className="h-full flex items-center justify-center">Painel 3</div>
                        </SplitterPanel>
                    </Splitter>
                </SplitterPanel>
            </Splitter>
        </div>
    </div>
</template>
