import { injectable } from "inversify";
import { InteractionManager } from "react-native";

@injectable()
export abstract class BaseRepository {

    protected RunAsync<T>(synchronousCallback: () => T): Promise<T> {
        return new Promise((res, rej) => {
            InteractionManager.runAfterInteractions(() => {
                try {
                    const result = synchronousCallback();

                    res(result);
                } catch (err) {
                    rej(err);
                }
            });
        });
    }
}