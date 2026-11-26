<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const value = ref(0);
let interval = null;

function startProgress() {
    interval = setInterval(() => {
        let newValue = value.value + Math.floor(Math.random() * 10) + 1;
        if (newValue >= 100) {
            newValue = 100;
        }
        value.value = newValue;
    }, 2000);
}

function endProgress() {
    clearInterval(interval);
    interval = null;
}

onMounted(() => {
    startProgress();
});

onBeforeUnmount(() => {
    endProgress();
});
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Barra de progresso</div>
        <div class="flex flex-col md:flex-row gap-4">
            <div class="md:w-1/2">
                <ProgressBar :value="value"></ProgressBar>
            </div>
            <div class="md:w-1/2">
                <ProgressBar :value="50" :showValue="false"></ProgressBar>
            </div>
        </div>
    </div>

    <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Indicador</div>
                <div class="flex gap-2">
                    <Badge :value="2"></Badge>
                    <Badge :value="8" severity="success"></Badge>
                    <Badge :value="4" severity="info"></Badge>
                    <Badge :value="12" severity="Warn"></Badge>
                    <Badge :value="3" severity="danger"></Badge>
                </div>

                <div class="font-semibold my-4">Sobreposição</div>
                <div class="flex gap-6">
                    <OverlayBadge value="2">
                        <i class="pi pi-bell" style="font-size: 2rem" />
                    </OverlayBadge>
                    <OverlayBadge value="4" severity="danger">
                        <i class="pi pi-calendar" style="font-size: 2rem" />
                    </OverlayBadge>
                    <OverlayBadge severity="danger">
                        <i class="pi pi-envelope" style="font-size: 2rem" />
                    </OverlayBadge>
                </div>

                <div class="font-semibold my-4">Botões</div>
                <div class="flex gap-2">
                    <Button label="E-mails" badge="8" class="mr-2"></Button>
                    <Button label="Mensagens" icon="pi pi-users" severity="warn" badge="8" badgeClass="p-badge-danger"></Button>
                </div>

                <div class="font-semibold my-4">Tamanhos</div>
                <div class="flex items-start gap-2">
                    <Badge :value="2"></Badge>
                    <Badge :value="4" size="large" severity="warn"></Badge>
                    <Badge :value="6" size="xlarge" severity="success"></Badge>
                </div>
            </div>

            <div class="card">
                <div class="font-semibold text-xl mb-4">Avatar</div>
                <div class="font-semibold mb-4">Grupo</div>
                <AvatarGroup>
                    <Avatar :image="'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'" size="large" shape="circle"></Avatar>
                    <Avatar :image="'https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png'" size="large" shape="circle"></Avatar>
                    <Avatar :image="'https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png'" size="large" shape="circle"></Avatar>
                    <Avatar :image="'https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png'" size="large" shape="circle"></Avatar>
                    <Avatar :image="'https://primefaces.org/cdn/primevue/images/avatar/xuxuefeng.png'" size="large" shape="circle"></Avatar>
                    <Avatar label="+2" shape="circle" size="large" :style="{ 'background-color': '#9c27b0', color: '#ffffff' }"></Avatar>
                </AvatarGroup>

                <div class="font-semibold my-4">Rótulo circular</div>
                <Avatar label="P" class="mr-2" size="xlarge" shape="circle"></Avatar>
                <Avatar label="V" class="mr-2" size="large" :style="{ 'background-color': '#2196F3', color: '#ffffff' }" shape="circle"></Avatar>
                <Avatar label="U" class="mr-2" :style="{ 'background-color': '#9c27b0', color: '#ffffff' }" shape="circle"></Avatar>

                <div class="font-semibold my-4">Ícone com indicador</div>
                <OverlayBadge value="4" severity="danger" class="inline-flex">
                    <Avatar label="U" size="xlarge" />
                </OverlayBadge>
            </div>

            <div class="card">
                <div class="font-semibold text-xl mb-4">Voltar ao topo</div>
                <ScrollPanel :style="{ width: '250px', height: '200px' }">
                    <p>
                        Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades dos seus
                        usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                    </p>
                    <ScrollTop target="parent" :threshold="100" icon="pi pi-arrow-up"></ScrollTop>
                </ScrollPanel>
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Etiqueta</div>
                <div class="font-semibold mb-4">Padrão</div>
                <div class="flex gap-2">
                    <Tag value="Principal"></Tag>
                    <Tag severity="success" value="Sucesso"></Tag>
                    <Tag severity="info" value="Informação"></Tag>
                    <Tag severity="warn" value="Aviso"></Tag>
                    <Tag severity="danger" value="Perigo"></Tag>
                </div>

                <div class="font-semibold my-4">Etiquetas arredondadas</div>
                <div class="flex gap-2">
                    <Tag value="Principal" :rounded="true"></Tag>
                    <Tag severity="success" value="Sucesso" :rounded="true"></Tag>
                    <Tag severity="info" value="Informação" :rounded="true"></Tag>
                    <Tag severity="warn" value="Aviso" :rounded="true"></Tag>
                    <Tag severity="danger" value="Perigo" :rounded="true"></Tag>
                </div>

                <div class="font-semibold my-4">Ícones</div>
                <div class="flex gap-2">
                    <Tag icon="pi pi-user" value="Principal"></Tag>
                    <Tag icon="pi pi-check" severity="success" value="Sucesso"></Tag>
                    <Tag icon="pi pi-info-circle" severity="info" value="Informação"></Tag>
                    <Tag con="pi pi-exclamation-triangle" severity="warn" value="Aviso"></Tag>
                    <Tag icon="pi pi-times" severity="danger" value="Perigo"></Tag>
                </div>
            </div>

            <div class="card">
                <div class="font-semibold text-xl mb-4">Marcador</div>
                <div class="font-semibold mb-4">Básico</div>
                <div class="flex items-center flex-col sm:flex-row">
                    <Chip label="Ação" class="mr-2 mb-2"></Chip>
                    <Chip label="Comédia" class="mr-2 mb-2"></Chip>
                    <Chip label="Mistério" class="mr-2 mb-2"></Chip>
                    <Chip label="Suspense" :removable="true" class="mb-2"></Chip>
                </div>

                <div class="font-semibold my-4">Ícone</div>
                <div class="flex items-center flex-col sm:flex-row">
                    <Chip label="Apple" icon="pi pi-apple" class="mr-2 mb-2"></Chip>
                    <Chip label="Facebook" icon="pi pi-facebook" class="mr-2 mb-2"></Chip>
                    <Chip label="Google" icon="pi pi-google" class="mr-2 mb-2"></Chip>
                    <Chip label="Microsoft" icon="pi pi-microsoft" :removable="true" class="mb-2"></Chip>
                </div>

                <div class="font-semibold my-4">Imagem</div>
                <div class="flex items-center flex-col sm:flex-row">
                    <Chip label="Amy Elsner" :image="'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'" class="mr-2 mb-2"></Chip>
                    <Chip label="Asiya Javayant" :image="'https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png'" class="mr-2 mb-2"></Chip>
                    <Chip label="Onyama Limba" :image="'https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png'" class="mr-2 mb-2"></Chip>
                </div>
            </div>

            <div class="card">
                <div class="font-semibold text-xl mb-4">Esqueleto de carregamento</div>
                <div class="rounded-border border border-surface p-6">
                    <div class="flex mb-4">
                        <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                        <div>
                            <Skeleton width="10rem" class="mb-2"></Skeleton>
                            <Skeleton width="5rem" class="mb-2"></Skeleton>
                            <Skeleton height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <Skeleton width="100%" height="150px"></Skeleton>
                    <div class="flex justify-between mt-4">
                        <Skeleton width="4rem" height="2rem"></Skeleton>
                        <Skeleton width="4rem" height="2rem"></Skeleton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
