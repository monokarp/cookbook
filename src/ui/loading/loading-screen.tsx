import { useEffect } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Environment } from '../env';
import { useSession } from '../login/session.store';
import { RootViews } from '../root-views.enum';
import { useServices } from '../services-context';

export function LoadingScreen({ navigation }) {
    const { db, seedData, dataSync: ds } = useServices();

    const { user, hasInitialized, initialize } = useSession();
    if (!user?.id) { throw new Error('User not logged in'); }

    async function loadData() {
        console.log('Init database');

        const { didRunMigrations, isFreshInstall } = await db.Init();

        if (Environment.Type === 'Test' && isFreshInstall) {
            await seedData.Seed();
        }

        if (Environment.Type !== 'Test') {
            if (isFreshInstall) { await ds.recover(user.id); }
            else if (didRunMigrations) { await ds.pushAllLocal(user.id); }

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

