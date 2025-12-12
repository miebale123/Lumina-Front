import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

export const AsyncStore = signalStore(
  { providedIn: 'root' },

  withState<{ tasks: Record<string, boolean> }>({ tasks: {} }),

  withMethods((store) => ({
    start(id: string) {
      patchState(store, { tasks: { ...store.tasks(), [id]: true } });
    },

    stop(id: string) {
      patchState(store, { tasks: { ...store.tasks(), [id]: false } });
    },

    isLoading(id: string) {
      return !!store.tasks()[id];
    },

    async run<T>(id: string, action: () => Promise<T>): Promise<T> {
      this.start(id);
      try {
        return await action(); // <-- the actual API call happens here
      } finally {
        this.stop(id);
      }
    },
  }))
);

const asyncStore = inject<typeof AsyncStore>(AsyncStore);
