import { useInjection } from 'inversify-react-native';
import { useEffect } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Database } from '../../core/database/database';
import { SeedData } from '../../core/database/seed-data';
import { DataSync } from '../../core/datasync/datasync.service';
import { Environment } from '../env';
import { useSession } from '../login/session.store';
import { RootViews } from '../root-views.enum';

export function LoadingScreen({ navigation }) {
    const db = useInjection(Database);
    const seedData = useInjection(SeedData);
    const ds = useInjection(DataSync);

    const { user, hasInitialized, initialize } = useSession();
    if (!user?.id) { throw new Error('User not logged in'); }

    async function loadData() {
        console.log('Init database');

        // @TODO refactor to isFreshInstall
        const { didRunMigrations } = await db.Init();

        if (Environment.Type === 'Test' && didRunMigrations) {
            await seedData.Seed();
        }

        if (Environment.Type !== 'Test') {
            if (didRunMigrations) { await ds.recover(user.id); }

            await ds.start(user.id);
        }

        initialize();
    };

    useEffect(() => {
        (async function () {
            if (!hasInitialized) { await loadData(); }

            navigation.navigate(RootViews.Home);
        })();
    });

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator animating={!hasInitialized} />
        </View>
    );
}

