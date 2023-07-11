import { useInjection } from 'inversify-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { Database } from '../../core/database/database';
import { SeedData } from '../../core/database/seed-data';
import { RootViews } from '../root-views.enum';

export function LoadingScreen({ navigation }) {
    const { t } = useTranslation();

    const db = useInjection(Database);
    const seedData = useInjection(SeedData);

    const [isReady, setIsReady] = useState(false);

    async function seedDb() {
        console.log('Init database');

        const { didRunMigrations } = await db.Init();

        // if (didRunMigrations) {
            await seedData.Seed();
        // }

        setIsReady(true);

        navigation.navigate(RootViews.Login);
    };

    useEffect(() => { if (!isReady) { seedDb() } }, [isReady]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="displayMedium">{t('common.loading')}</Text>
        </View>
    );
}

