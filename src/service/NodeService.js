export const NodeService = {
    getTreeNodesData() {
        return [
            {
                key: '0',
                label: 'Documentos',
                data: 'Documents Folder',
                icon: 'pi pi-fw pi-inbox',
                children: [
                    {
                        key: '0-0',
                        label: 'Trabalho',
                        data: 'Work Folder',
                        icon: 'pi pi-fw pi-cog',
                        children: [
                            { key: '0-0-0', label: 'Despesas.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                            { key: '0-0-1', label: 'Currículo.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
                        ]
                    },
                    {
                        key: '0-1',
                        label: 'Início',
                        data: 'Home Folder',
                        icon: 'pi pi-fw pi-home',
                        children: [{ key: '0-1-0', label: 'Faturas.txt', icon: 'pi pi-fw pi-file', data: 'Invoices for this month' }]
                    }
                ]
            },
            {
                key: '1',
                label: 'Eventos',
                data: 'Events Folder',
                icon: 'pi pi-fw pi-calendar',
                children: [
                    { key: '1-0', label: 'Reunião', icon: 'pi pi-fw pi-calendar-plus', data: 'Reunião' },
                    { key: '1-1', label: 'Lançamento de produto', icon: 'pi pi-fw pi-calendar-plus', data: 'Lançamento de produto' },
                    { key: '1-2', label: 'Revisão de relatório', icon: 'pi pi-fw pi-calendar-plus', data: 'Revisão de relatório' }
                ]
            },
            {
                key: '2',
                label: 'Filmes',
                data: 'Movies Folder',
                icon: 'pi pi-fw pi-star-fill',
                children: [
                    {
                        key: '2-0',
                        icon: 'pi pi-fw pi-star-fill',
                        label: 'Al Pacino',
                        data: 'Pacino Movies',
                        children: [
                            { key: '2-0-0', label: 'Scarface', icon: 'pi pi-fw pi-video', data: 'Scarface Movie' },
                            { key: '2-0-1', label: 'Serpico', icon: 'pi pi-fw pi-video', data: 'Serpico Movie' }
                        ]
                    },
                    {
                        key: '2-1',
                        label: 'Robert De Niro',
                        icon: 'pi pi-fw pi-star-fill',
                        data: 'De Niro Movies',
                        children: [
                            { key: '2-1-0', label: 'Goodfellas', icon: 'pi pi-fw pi-video', data: 'Goodfellas Movie' },
                            { key: '2-1-1', label: 'Untouchables', icon: 'pi pi-fw pi-video', data: 'Untouchables Movie' }
                        ]
                    }
                ]
            }
        ];
    },

    getTreeTableNodesData() {
        return [
            {
                key: '0',
                data: {
                    name: 'Aplicativos',
                    size: '100kb',
                    type: 'Pasta'
                },
                children: [
                    {
                        key: '0-0',
                        data: {
                            name: 'Vue',
                            size: '25kb',
                            type: 'Pasta'
                        },
                        children: [
                            {
                                key: '0-0-0',
                                data: {
                                    name: 'vue.app',
                                    size: '10kb',
                                    type: 'Aplicativo'
                                }
                            },
                            {
                                key: '0-0-1',
                                data: {
                                    name: 'native.app',
                                    size: '10kb',
                                    type: 'Aplicativo'
                                }
                            },
                            {
                                key: '0-0-2',
                                data: {
                                    name: 'mobile.app',
                                    size: '5kb',
                                    type: 'Aplicativo'
                                }
                            }
                        ]
                    },
                    {
                        key: '0-1',
                        data: {
                            name: 'editor.app',
                            size: '25kb',
                            type: 'Aplicativo'
                        }
                    },
                    {
                        key: '0-2',
                        data: {
                            name: 'settings.app',
                            size: '50kb',
                            type: 'Aplicativo'
                        }
                    }
                ]
            },
            {
                key: '1',
                data: {
                    name: 'Nuvem',
                    size: '20kb',
                    type: 'Pasta'
                },
                children: [
                    {
                        key: '1-0',
                        data: {
                            name: 'backup-1.zip',
                            size: '10kb',
                            type: 'Zip'
                        }
                    },
                    {
                        key: '1-1',
                        data: {
                            name: 'backup-2.zip',
                            size: '10kb',
                            type: 'Zip'
                        }
                    }
                ]
            },
            {
                key: '2',
                data: {
                    name: 'Área de trabalho',
                    size: '150kb',
                    type: 'Pasta'
                },
                children: [
                    {
                        key: '2-0',
                        data: {
                            name: 'note-meeting.txt',
                            size: '50kb',
                            type: 'Texto'
                        }
                    },
                    {
                        key: '2-1',
                        data: {
                            name: 'note-todo.txt',
                            size: '100kb',
                            type: 'Texto'
                        }
                    }
                ]
            },
            {
                key: '3',
                data: {
                    name: 'Documentos',
                    size: '75kb',
                    type: 'Pasta'
                },
                children: [
                    {
                        key: '3-0',
                        data: {
                            name: 'Trabalho',
                            size: '55kb',
                            type: 'Pasta'
                        },
                        children: [
                            {
                                key: '3-0-0',
                                data: {
                                    name: 'Despesas.doc',
                                    size: '30kb',
                                    type: 'Documento'
                                }
                            },
                            {
                                key: '3-0-1',
                                data: {
                                    name: 'Currículo.doc',
                                    size: '25kb',
                                    type: 'Currículo'
                                }
                            }
                        ]
                    },
                    {
                        key: '3-1',
                        data: {
                            name: 'Início',
                            size: '20kb',
                            type: 'Pasta'
                        },
                        children: [
                            {
                                key: '3-1-0',
                                data: {
                                    name: 'Faturas',
                                    size: '20kb',
                                    type: 'Texto'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                key: '4',
                data: {
                    name: 'Downloads',
                    size: '25kb',
                    type: 'Pasta'
                },
                children: [
                    {
                        key: '4-0',
                        data: {
                            name: 'Espanhol',
                            size: '10kb',
                            type: 'Pasta'
                        },
                        children: [
                            {
                                key: '4-0-0',
                                data: {
                                    name: 'tutorial-a1.txt',
                                    size: '5kb',
                                    type: 'Texto'
                                }
                            },
                            {
                                key: '4-0-1',
                                data: {
                                    name: 'tutorial-a2.txt',
                                    size: '5kb',
                                    type: 'Texto'
                                }
                            }
                        ]
                    },
                    {
                        key: '4-1',
                        data: {
                            name: 'Viagem',
                            size: '15kb',
                            type: 'Texto'
                        },
                        children: [
                            {
                                key: '4-1-0',
                                data: {
                                    name: 'Hotel.pdf',
                                    size: '10kb',
                                    type: 'PDF'
                                }
                            },
                            {
                                key: '4-1-1',
                                data: {
                                    name: 'Voo.pdf',
                                    size: '5kb',
                                    type: 'PDF'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                key: '5',
                data: {
                    name: 'Principal',
                    size: '50kb',
                    type: 'Pasta'
                },
                children: [
                    {
                        key: '5-0',
                        data: {
                            name: 'bin',
                            size: '50kb',
                            type: 'Hiperlink'
                        }
                    },
                    {
                        key: '5-1',
                        data: {
                            name: 'etc',
                            size: '100kb',
                            type: 'Hiperlink'
                        }
                    },
                    {
                        key: '5-2',
                        data: {
                            name: 'var',
                            size: '100kb',
                            type: 'Hiperlink'
                        }
                    }
                ]
            },
            {
                key: '6',
                data: {
                    name: 'Outros',
                    size: '5kb',
                    type: 'Pasta'
                },
                children: [
                    {
                        key: '6-0',
                        data: {
                            name: 'todo.txt',
                            size: '3kb',
                            type: 'Texto'
                        }
                    },
                    {
                        key: '6-1',
                        data: {
                            name: 'logo.png',
                            size: '2kb',
                            type: 'Imagem'
                        }
                    }
                ]
            },
            {
                key: '7',
                data: {
                    name: 'Imagens',
                    size: '150kb',
                    type: 'Pasta'
                },
                children: [
                    {
                        key: '7-0',
                        data: {
                            name: 'barcelona.jpg',
                            size: '90kb',
                            type: 'Imagem'
                        }
                    },
                    {
                        key: '7-1',
                        data: {
                            name: 'primevue.png',
                            size: '30kb',
                            type: 'Imagem'
                        }
                    },
                    {
                        key: '7-2',
                        data: {
                            name: 'prime.jpg',
                            size: '30kb',
                            type: 'Imagem'
                        }
                    }
                ]
            },
            {
                key: '8',
                data: {
                    name: 'Vídeos',
                    size: '1500kb',
                    type: 'Pasta'
                },
                children: [
                    {
                        key: '8-0',
                        data: {
                            name: 'primefaces.mkv',
                            size: '1000kb',
                            type: 'Vídeo'
                        }
                    },
                    {
                        key: '8-1',
                        data: {
                            name: 'intro.avi',
                            size: '500kb',
                            type: 'Vídeo'
                        }
                    }
                ]
            }
        ];
    },

    getTreeTableNodes() {
        return Promise.resolve(this.getTreeTableNodesData());
    },

    getTreeNodes() {
        return Promise.resolve(this.getTreeNodesData());
    }
};
