import { useInjection } from 'inversify-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { Database } from '../../core/database/database';
import { SeedData } from '../../core/database/seed-data';
import { DataSync } from '../../core/datasync/datasync.service';
import { Environment } from '../env';
import { useSession } from '../login/session.store';
import { RootViews } from '../root-views.enum';

export function LoadingScreen({ navigation }) {
    const { t } = useTranslation();

    const db = useInjection(Database);
    const seedData = useInjection(SeedData);
    const ds = useInjection(DataSync);

    const { user } = useSession();
    if (!user?.id) { throw new Error('User not logged in'); }

    const [isReady, setIsReady] = useState(false);

    async function seedDb() {
        console.log('Init database');

        // @TODO refactor to isFreshInstall
        const { didRunMigrations } = await db.Init();

        if (Environment.Type === 'Test' && didRunMigrations) {
            await seedData.Seed();
        }

        if (Environment.Type !== 'Test') {
            if (didRunMigrations) { await ds.recover(user.id); }

            await ds.start();
        }

        setIsReady(true);

        navigation.navigate(RootViews.Home);
    };

    useEffect(() => { if (!isReady) { seedDb() } }, [isReady]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="displayMedium">{t('common.loading')}</Text>
        </View>
    );
}

