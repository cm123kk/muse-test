import { useEffect } from 'react';
import { SettingsPage } from '../components/templates/SettingsPage.jsx';
import { useUserSettings, useUpdateUserSettings } from '../hooks/data/useUserSettings';
import { useSettingsSlice } from '../store';

export function SettingsRoute() {
  const { data: dbSettings, loading } = useUserSettings();
  const { updateUserSettings } = useUpdateUserSettings();

  // Zustand 설정과 DB 설정을 동기화 (테마 모드 등 즉시 반영 필요한 항목)
  const { settings: localSettings, updateSettings } = useSettingsSlice();

  // DB 로드 완료 시 로컬 설정에 반영
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
    // 즉시 로컬 반영 (테마 등 UI 즉각 반응)
    updateSettings(patch);

    // DB 키 변환 후 저장
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
