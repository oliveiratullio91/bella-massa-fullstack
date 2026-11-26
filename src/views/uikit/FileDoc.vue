<script setup>
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const toast = useToast();
const fileupload = ref();

function upload() {
    fileupload.value.upload();
}

function onUpload() {
    toast.add({ severity: 'info', summary: 'Sucesso', detail: 'Arquivo enviado', life: 3000 });
}
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-full lg:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Avançado</div>
                <FileUpload
                    name="demo[]"
                    @uploader="onUpload"
                    :multiple="true"
                    accept="image/*"
                    :maxFileSize="1000000"
                    customUpload
                    invalidFileSizeMessage="{0}: o arquivo excede o tamanho máximo de {1}."
                    invalidFileTypeMessage="{0}: tipo de arquivo inválido. Tipos permitidos: {1}."
                    invalidFileLimitMessage="Limite de arquivos excedido. São permitidos no máximo {0} arquivos."
                />
            </div>
        </div>
        <div class="col-span-full lg:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Básico</div>
                <div class="card flex flex-col gap-6 items-center justify-center">
                    <Toast />
                    <FileUpload
                        ref="fileupload"
                        mode="basic"
                        name="demo[]"
                        accept="image/*"
                        :maxFileSize="1000000"
                        @uploader="onUpload"
                        customUpload
                        invalidFileSizeMessage="{0}: o arquivo excede o tamanho máximo de {1}."
                        invalidFileTypeMessage="{0}: tipo de arquivo inválido. Tipos permitidos: {1}."
                        invalidFileLimitMessage="Limite de arquivos excedido. São permitidos no máximo {0} arquivos."
                    />
                    <Button label="Enviar arquivo" @click="upload" severity="secondary" />
                </div>
            </div>
        </div>
    </div>
</template>
