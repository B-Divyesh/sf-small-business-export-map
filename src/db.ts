import type { RecipientProfile } from './types';

const DB_NAME = 'export-map';
const STORE = 'profiles';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function listProfiles(): Promise<RecipientProfile[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE).objectStore(STORE).getAll();
    request.onsuccess = () => resolve((request.result as RecipientProfile[]).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
    request.onerror = () => reject(request.error);
  });
}

export async function putProfile(profile: RecipientProfile): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, 'readwrite').objectStore(STORE).put(profile);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteProfile(id: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function replaceProfiles(profiles: RecipientProfile[]): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    store.clear();
    profiles.forEach((profile) => store.put(profile));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
