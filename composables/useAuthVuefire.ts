// ~/composables/useAuthVuefire.ts
// Composable that uses VueFire's useCurrentUser() + useDocument() to manage
// a single client-side auth/profile state for the whole app.
// Use in middleware & components.

import { ref, watch, type Ref } from 'vue';
import { useCurrentUser, useDocument } from 'vuefire';
import { getFirestore, doc } from 'firebase/firestore';

/**
 * Shared Nuxt state keys (persist in-memory across pages)
 * - 'auth:currentUser' stores the Firebase User object (or null)
 * - 'auth:userProfile' stores the Firestore users/{uid} doc data (or null)
 * - 'auth:ready' becomes true once we've observed auth state at least once
 */
export function useAuthVuefireState() {
  const currentUser = useState<any | null>('auth:currentUser', () => null);
  const userProfile = useState<Record<string, any> | null>('auth:userProfile', () => null);
  const authReady = useState<boolean>('auth:ready', () => false);
  return { currentUser, userProfile, authReady };
}

// One-time initialization guard for attaching watchers/listeners
let _initialized = false;

/**
 * initAuthVuefire()
 * - idempotent
 * - uses VueFire's useCurrentUser() (reactive ref that updates on login/logout)
 * - when a user exists, uses VueFire's useDocument() to keep the Firestore profile synced
 *
 * Important: this composable is client-only (VueFire's useCurrentUser relies on browser)
 */
export async function initAuthVuefire() {
  if (_initialized) return;
  _initialized = true;

  // Only run in the browser
  if (!process.client) {
    const { authReady } = useAuthVuefireState();
    authReady.value = true; // mark ready server-side so middleware won't hang
    return;
  }

  const { currentUser, userProfile, authReady } = useAuthVuefireState();

  // useCurrentUser() is a VueFire helper that returns a ref of the firebase.User or null
  const vfUser = useCurrentUser() as Ref<any | null>;

  // watch vuefire user ref; this will fire immediately with the current state (or null)
  // and subsequently on login/logout and token refresh.
  watch(
    vfUser,
    async (u) => {
      try {
        currentUser.value = u ?? null;

        if (u && u.uid) {
          // create a Firestore doc ref and use VueFire's useDocument to bind it reactively
          const db = getFirestore();
          const userDocRef = doc(db, 'users', u.uid);

          // useDocument returns an object, typically: { data, promise, error }
          // data is a reactive ref that reflects the document contents (or undefined)
          const { data: docData } = useDocument(userDocRef);

          // wait a tick for VueFire to populate docData; assign if present
          // docData may be undefined for a brief moment — handle gracefully
          watch(
            docData,
            (val) => {
              // when docData becomes available, cache it in Nuxt useState
              userProfile.value = val ?? null;
            },
            { immediate: true }
          );
        } else {
          // no user -> clear profile
          userProfile.value = null;
        }
      } catch (err) {
        // don't throw — just log; keep userProfile null on error
        // eslint-disable-next-line no-console
        console.warn('[initAuthVuefire] error when syncing profile', err);
        userProfile.value = null;
      } finally {
        // mark ready after the watch runs at least once
        authReady.value = true;
      }
    },
    { immediate: true }
  );
}

/**
 * waitForAuthVuefire()
 * Resolves when authReady is true (we've observed the first auth state)
 * Accepts timeoutMs to avoid indefinite hangs — middleware will handle reject.
 */
export function waitForAuthVuefire(timeoutMs = 7000): Promise<void> {
  const { authReady } = useAuthVuefireState();
  return new Promise((resolve, reject) => {
    if (authReady.value) return resolve();

    const stop = watch(
      () => authReady.value,
      (v) => {
        if (v) {
          stop();
          resolve();
        }
      }
    );

    if (timeoutMs > 0) {
      setTimeout(() => {
        stop();
        reject(new Error('waitForAuthVuefire timeout'));
      }, timeoutMs);
    }
  });
}
