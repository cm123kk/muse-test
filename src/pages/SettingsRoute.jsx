import { useEffect } from 'react';
import { SettingsPage } from '../components/templates/SettingsPage.jsx';
import { useUserSettings, useUpdateUserSettings } from '../hooks/data/useUserSettings';
import { useSettingsSlice } from '../store';

export function SettingsRoute() {
  const { data: dbSettings, loading } = useUserSettings();
  const { updateUserSettings } = useUpdateUserSettings();

  // Sync Zustand settings with DB settings (items that need immediate reflection, such as theme mode)
  const { settings: localSettings, updateSettings } = useSettingsSlice();

  // Reflect into local settings once the DB load completes
  useEffect(() => {
    if (dbSettings) {
      updateSettings({
        themeMode: dbSettings.theme_mode,
        isAutoTagEnabled: dbSettings.is_auto_tag_enabled,
        storageMode: dbSettings.storage_mode,
        aiModel: dbSettings.ai_model,
      });
    }
  }, [dbSettings]); // eslint-disable-line react-hooks/exhaustive-deps

  const settings = dbSettings
    ? {
        themeMode: dbSettings.theme_mode,
        isAutoTagEnabled: dbSettings.is_auto_tag_enabled,
        storageMode: dbSettings.storage_mode,
        aiModel: dbSettings.ai_model,
      }
    : localSettings;

  const handleChange = async (patch) => {
    // Apply locally immediately (instant UI response for theme, etc.)
    updateSettings(patch);

    // Convert to DB keys, then save
    const dbPatch = {};
    if ('themeMode' in patch) dbPatch.theme_mode = patch.themeMode;
    if ('isAutoTagEnabled' in patch) dbPatch.is_auto_tag_enabled = patch.isAutoTagEnabled;
    if ('storageMode' in patch) dbPatch.storage_mode = patch.storageMode;
    if ('aiModel' in patch) dbPatch.ai_model = patch.aiModel;

    if (Object.keys(dbPatch).length) {
      await updateUserSettings(dbPatch);
    }
  };

  return (
    <SettingsPage
      settings={settings}
      onChange={handleChange}
      onSave={() => {}}
      isLoading={loading}
    />
  );
}
