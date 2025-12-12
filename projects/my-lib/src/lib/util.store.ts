import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

export const UtilsStore = signalStore(
  { providedIn: 'root' },

  withState(() => ({
    loadingTasks: new Set<string>(),
  })),

  withMethods((store) => ({
    startLoading(id: string) {
      const updated = new Set(store.loadingTasks());
      updated.add(id);
      patchState(store, { loadingTasks: updated });
    },

    stopLoading(id: string) {
      const updated = new Set(store.loadingTasks());
      updated.delete(id);
      patchState(store, { loadingTasks: updated });
    },

    isLoading(id: string) {
      return store.loadingTasks().has(id);
    },

    async run<T>(id: string, action: () => Promise<T>): Promise<T> {
      this.startLoading(id);
      try {
        return await action();
      } finally {
        this.stopLoading(id);
      }
    },
  }))
);
