// FermentationCarousel.tsx
import { FermentationTips } from '@/data/fermentationTips';
import { FlatList } from 'react-native';
import { FermentationCard } from './FermentationCard';


export const FermentationCarousel = () => (
    <FlatList
        horizontal
        data={FermentationTips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <FermentationCard title={item.title} description={item.description} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
    />
);
