export const PhotoService = {
    getData() {
        return [
            {
                itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria1.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria1s.jpg',
                alt: 'Descrição da imagem 1',
                title: 'Título 1'
            },
            {
                itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria2.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria2s.jpg',
                alt: 'Descrição da imagem 2',
                title: 'Título 2'
            },
            {
                itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria3.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria3s.jpg',
                alt: 'Descrição da imagem 3',
                title: 'Título 3'
            },
            {
                itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria4.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria4s.jpg',
                alt: 'Descrição da imagem 4',
                title: 'Título 4'
            },
            {
                itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria5.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria5s.jpg',
                alt: 'Descrição da imagem 5',
                title: 'Título 5'
            },
            {
                itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria6.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria6s.jpg',
                alt: 'Descrição da imagem 6',
                title: 'Título 6'
            },
            {
                itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria7.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria7s.jpg',
                alt: 'Descrição da imagem 7',
                title: 'Título 7'
            },
            {
                itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria8.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria8s.jpg',
                alt: 'Descrição da imagem 8',
                title: 'Título 8'
            },
            {
                itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria9.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria9s.jpg',
                alt: 'Descrição da imagem 9',
                title: 'Título 9'
            },
            {
                itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria10s.jpg',
                alt: 'Descrição da imagem 10',
                title: 'Título 10'
            },
            {
                itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria11.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria11s.jpg',
                alt: 'Descrição da imagem 11',
                title: 'Título 11'
            },
            {
                itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria12.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria12s.jpg',
                alt: 'Descrição da imagem 12',
                title: 'Título 12'
            },
            {
                itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria13.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria13s.jpg',
                alt: 'Descrição da imagem 13',
                title: 'Título 13'
            },
            {
                itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria14.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria14s.jpg',
                alt: 'Descrição da imagem 14',
                title: 'Título 14'
            },
            {
                itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria15.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria15s.jpg',
                alt: 'Descrição da imagem 15',
                title: 'Título 15'
            }
        ];
    },

    getImages() {
        return Promise.resolve(this.getData());
    }
};
