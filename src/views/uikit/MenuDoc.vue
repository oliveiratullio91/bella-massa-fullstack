<script setup>
import { ref } from 'vue';

const menu = ref(null);
const contextMenu = ref(null);

const nestedMenuitems = ref([
    {
        label: 'Clientes',
        icon: 'pi pi-fw pi-table',
        items: [
            {
                label: 'Novo',
                icon: 'pi pi-fw pi-user-plus',
                items: [
                    {
                        label: 'Cliente',
                        icon: 'pi pi-fw pi-plus'
                    },
                    {
                        label: 'Duplicar',
                        icon: 'pi pi-fw pi-copy'
                    }
                ]
            },
            {
                label: 'Editar',
                icon: 'pi pi-fw pi-user-edit'
            }
        ]
    },
    {
        label: 'Pedidos',
        icon: 'pi pi-fw pi-shopping-cart',
        items: [
            {
                label: 'Visualizar',
                icon: 'pi pi-fw pi-list'
            },
            {
                label: 'Pesquisar',
                icon: 'pi pi-fw pi-search'
            }
        ]
    },
    {
        label: 'Envios',
        icon: 'pi pi-fw pi-envelope',
        items: [
            {
                label: 'Rastreamento',
                icon: 'pi pi-fw pi-compass'
            },
            {
                label: 'Mapa',
                icon: 'pi pi-fw pi-map-marker'
            },
            {
                label: 'Gerenciar',
                icon: 'pi pi-fw pi-pencil'
            }
        ]
    },
    {
        label: 'Perfil',
        icon: 'pi pi-fw pi-user',
        items: [
            {
                label: 'Configurações',
                icon: 'pi pi-fw pi-cog'
            },
            {
                label: 'Faturamento',
                icon: 'pi pi-fw pi-file'
            }
        ]
    },
    {
        label: 'Sair',
        icon: 'pi pi-fw pi-sign-out'
    }
]);
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Computador' }, { label: 'Notebook' }, { label: 'Acessórios' }, { label: 'Mochilas' }, { label: 'Item' }]);
const tieredMenuItems = ref([
    {
        label: 'Clientes',
        icon: 'pi pi-fw pi-table',
        items: [
            {
                label: 'Novo',
                icon: 'pi pi-fw pi-user-plus',
                items: [
                    {
                        label: 'Cliente',
                        icon: 'pi pi-fw pi-plus'
                    },
                    {
                        label: 'Duplicar',
                        icon: 'pi pi-fw pi-copy'
                    }
                ]
            },
            {
                label: 'Editar',
                icon: 'pi pi-fw pi-user-edit'
            }
        ]
    },
    {
        label: 'Pedidos',
        icon: 'pi pi-fw pi-shopping-cart',
        items: [
            {
                label: 'Visualizar',
                icon: 'pi pi-fw pi-list'
            },
            {
                label: 'Pesquisar',
                icon: 'pi pi-fw pi-search'
            }
        ]
    },
    {
        label: 'Envios',
        icon: 'pi pi-fw pi-envelope',
        items: [
            {
                label: 'Rastreamento',
                icon: 'pi pi-fw pi-compass'
            },
            {
                label: 'Mapa',
                icon: 'pi pi-fw pi-map-marker'
            },
            {
                label: 'Gerenciar',
                icon: 'pi pi-fw pi-pencil'
            }
        ]
    },
    {
        label: 'Perfil',
        icon: 'pi pi-fw pi-user',
        items: [
            {
                label: 'Configurações',
                icon: 'pi pi-fw pi-cog'
            },
            {
                label: 'Faturamento',
                icon: 'pi pi-fw pi-file'
            }
        ]
    },
    {
        separator: true
    },
    {
        label: 'Sair',
        icon: 'pi pi-fw pi-sign-out'
    }
]);
const overlayMenuItems = ref([
    {
        label: 'Salvar',
        icon: 'pi pi-save'
    },
    {
        label: 'Atualizar',
        icon: 'pi pi-refresh'
    },
    {
        label: 'Excluir',
        icon: 'pi pi-trash'
    },
    {
        separator: true
    },
    {
        label: 'Início',
        icon: 'pi pi-home'
    }
]);
const menuitems = ref([
    {
        label: 'Clientes',
        items: [
            {
                label: 'Novo',
                icon: 'pi pi-fw pi-plus'
            },
            {
                label: 'Editar',
                icon: 'pi pi-fw pi-user-edit'
            }
        ]
    },
    {
        label: 'Pedidos',
        items: [
            {
                label: 'Visualizar',
                icon: 'pi pi-fw pi-list'
            },
            {
                label: 'Pesquisar',
                icon: 'pi pi-fw pi-search'
            }
        ]
    }
]);
const contextMenuItems = ref([
    {
        label: 'Salvar',
        icon: 'pi pi-save'
    },
    {
        label: 'Atualizar',
        icon: 'pi pi-refresh'
    },
    {
        label: 'Excluir',
        icon: 'pi pi-trash'
    },
    {
        separator: true
    },
    {
        label: 'Opções',
        icon: 'pi pi-cog'
    }
]);
const megamenuItems = ref([
    {
        label: 'Moda',
        icon: 'pi pi-fw pi-tag',
        items: [
            [
                {
                    label: 'Feminino',
                    items: [{ label: 'Item feminino' }, { label: 'Item feminino' }, { label: 'Item feminino' }]
                },
                {
                    label: 'Masculino',
                    items: [{ label: 'Item masculino' }, { label: 'Item masculino' }, { label: 'Item masculino' }]
                }
            ],
            [
                {
                    label: 'Infantil',
                    items: [{ label: 'Item infantil' }, { label: 'Item infantil' }]
                },
                {
                    label: 'Bagagem',
                    items: [{ label: 'Item de bagagem' }, { label: 'Item de bagagem' }, { label: 'Item de bagagem' }]
                }
            ]
        ]
    },
    {
        label: 'Eletrônicos',
        icon: 'pi pi-fw pi-desktop',
        items: [
            [
                {
                    label: 'Computador',
                    items: [{ label: 'Item de computador' }, { label: 'Item de computador' }]
                },
                {
                    label: 'Filmadora',
                    items: [{ label: 'Item de filmadora' }, { label: 'Item de filmadora' }, { label: 'Item de filmadora' }]
                }
            ],
            [
                {
                    label: 'TV',
                    items: [{ label: 'Item de TV' }, { label: 'Item de TV' }]
                },
                {
                    label: 'Áudio',
                    items: [{ label: 'Item de áudio' }, { label: 'Item de áudio' }, { label: 'Item de áudio' }]
                }
            ],
            [
                {
                    label: 'Esportes 7',
                    items: [{ label: 'Esportes 7.1' }, { label: 'Esportes 7.2' }]
                }
            ]
        ]
    },
    {
        label: 'Móveis',
        icon: 'pi pi-fw pi-image',
        items: [
            [
                {
                    label: 'Sala de estar',
                    items: [{ label: 'Item de sala de estar' }, { label: 'Item de sala de estar' }]
                },
                {
                    label: 'Cozinha',
                    items: [{ label: 'Item de cozinha' }, { label: 'Item de cozinha' }, { label: 'Item de cozinha' }]
                }
            ],
            [
                {
                    label: 'Quarto',
                    items: [{ label: 'Item de quarto' }, { label: 'Item de quarto' }]
                },
                {
                    label: 'Área externa',
                    items: [{ label: 'Item de área externa' }, { label: 'Item de área externa' }, { label: 'Item de área externa' }]
                }
            ]
        ]
    },
    {
        label: 'Esportes',
        icon: 'pi pi-fw pi-star',
        items: [
            [
                {
                    label: 'Basquete',
                    items: [{ label: 'Item de basquete' }, { label: 'Item de basquete' }]
                },
                {
                    label: 'Futebol',
                    items: [{ label: 'Item de futebol' }, { label: 'Item de futebol' }, { label: 'Item de futebol' }]
                }
            ],
            [
                {
                    label: 'Tênis',
                    items: [{ label: 'Item de tênis' }, { label: 'Item de tênis' }]
                }
            ]
        ]
    }
]);
const panelMenuitems = ref([
    {
        label: 'Clientes',
        icon: 'pi pi-fw pi-table',
        items: [
            {
                label: 'Novo',
                icon: 'pi pi-fw pi-user-plus',
                items: [
                    {
                        label: 'Cliente',
                        icon: 'pi pi-fw pi-plus'
                    },
                    {
                        label: 'Duplicar',
                        icon: 'pi pi-fw pi-copy'
                    }
                ]
            },
            {
                label: 'Editar',
                icon: 'pi pi-fw pi-user-edit'
            }
        ]
    },
    {
        label: 'Pedidos',
        icon: 'pi pi-fw pi-shopping-cart',
        items: [
            {
                label: 'Visualizar',
                icon: 'pi pi-fw pi-list'
            },
            {
                label: 'Pesquisar',
                icon: 'pi pi-fw pi-search'
            }
        ]
    },
    {
        label: 'Envios',
        icon: 'pi pi-fw pi-envelope',
        items: [
            {
                label: 'Rastreamento',
                icon: 'pi pi-fw pi-compass'
            },
            {
                label: 'Mapa',
                icon: 'pi pi-fw pi-map-marker'
            },
            {
                label: 'Gerenciar',
                icon: 'pi pi-fw pi-pencil'
            }
        ]
    },
    {
        label: 'Perfil',
        icon: 'pi pi-fw pi-user',
        items: [
            {
                label: 'Configurações',
                icon: 'pi pi-fw pi-cog'
            },
            {
                label: 'Faturamento',
                icon: 'pi pi-fw pi-file'
            }
        ]
    }
]);

function toggleMenu(event) {
    menu.value.toggle(event);
}

function onContextRightClick(event) {
    contextMenu.value.show(event);
}
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Barra de menu</div>
        <Menubar :model="nestedMenuitems">
            <template #end>
                <IconField iconPosition="left">
                    <InputIcon class="pi pi-search" />
                    <InputText type="text" placeholder="Pesquisar" />
                </IconField>
            </template>
        </Menubar>
    </div>

    <div class="card">
        <div class="font-semibold text-xl mb-4">Caminho de navegação</div>
        <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>

    <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Etapas</div>
                <Stepper value="1">
                    <StepList>
                        <Step value="1">Cabeçalho I</Step>
                        <Step value="2">Cabeçalho II</Step>
                        <Step value="3">Cabeçalho III</Step>
                    </StepList>
                </Stepper>
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Menu de abas</div>
                <Tabs value="0">
                    <TabList>
                        <Tab value="0">Cabeçalho I</Tab>
                        <Tab value="1">Cabeçalho II</Tab>
                        <Tab value="2">Cabeçalho III</Tab>
                    </TabList>
                </Tabs>
            </div>
        </div>
    </div>

    <div class="flex flex-col md:flex-row gap-8 mt-6">
        <div class="md:w-1/3">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Menu em níveis</div>
                <TieredMenu :model="tieredMenuItems" />
            </div>
        </div>
        <div class="md:w-1/3">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Menu simples</div>
                <Menu :model="menuitems" />
            </div>
        </div>
        <div class="md:w-1/3">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Menu sobreposto</div>
                <Menu ref="menu" :model="overlayMenuItems" :popup="true" />
                <Button type="button" label="Opções" icon="pi pi-angle-down" @click="toggleMenu" style="width: auto" />
            </div>

            <div class="card" @contextmenu="onContextRightClick">
                <div class="font-semibold text-xl mb-4">Menu de contexto</div>
                Clique com o botão direito para exibir.
                <ContextMenu ref="contextMenu" :model="contextMenuItems" />
            </div>
        </div>
    </div>

    <div class="flex flex-col md:flex-row gap-8 mt-8">
        <div class="md:w-1/2">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Megamenu horizontal</div>
                <MegaMenu :model="megamenuItems" />

                <div class="font-semibold text-xl mb-4 mt-8">Megamenu vertical</div>
                <MegaMenu :model="megamenuItems" orientation="vertical" />
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Menu em painel</div>
                <PanelMenu :model="panelMenuitems" />
            </div>
        </div>
    </div>
</template>
