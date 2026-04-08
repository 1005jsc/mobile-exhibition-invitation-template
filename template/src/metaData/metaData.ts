import { InputData } from '@/data/DataManager';
import type { Metadata } from 'next';

const { metadata: { title, description, thumbnailImage } } = InputData;

export const metaData: Metadata = {
    title: title,
    description: description,
    openGraph: {
        title: title,
        description: description,
        images: [
            {
                url: thumbnailImage,
                width: 1200,
                height: 630,
                alt: title,
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [
            thumbnailImage
        ],
    },
};
