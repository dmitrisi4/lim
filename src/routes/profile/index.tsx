import { component$, useStylesScoped$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { DEMO_USER_ID, getMockProfileSnapshot } from "~/shared/api/mock-db";
import { useI18n } from "~/shared/i18n/context";
import { formatDateTime } from "~/shared/lib/date";
import styles from "~/routes/profile/index.css?inline";

export const useProfileLoader = routeLoader$(async () => {
  return getMockProfileSnapshot(DEMO_USER_ID);
});

export default component$(() => {
  useStylesScoped$(styles);
  const profile = useProfileLoader();
  const { ui } = useI18n();

  return (
    <section class="profile-page">
      <div class="profile-panel">
        <h2 class="profile-title">{ui.profileTitle}</h2>
        <p class="profile-subtitle">{ui.profileSubtitle}</p>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <p class="metric-label">XP</p>
          <p class="metric-value">{profile.value.progress.xp}</p>
        </div>
        <div class="metric-card">
          <p class="metric-label">{ui.feedMetricLevel}</p>
          <p class="metric-value">{profile.value.progress.level}</p>
        </div>
        <div class="metric-card">
          <p class="metric-label">{ui.feedMetricStreak}</p>
          <p class="metric-value">
            {profile.value.streak.days} {ui.profileDays}
          </p>
        </div>
      </div>

      <div class="activity-panel">
        <h3 class="activity-title">{ui.profileRecentActivity}</h3>
        <ul class="activity-list">
          {profile.value.recent.length === 0 ? (
            <li class="activity-empty">{ui.profileEmptyActivity}</li>
          ) : (
            profile.value.recent.map((item) => (
              <li key={item.id} class="activity-item">
                <p class="activity-item-title">{item.title}</p>
                <p class="activity-item-meta">
                  {formatDateTime(item.at)} · +{item.xpDelta} XP
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: "Lim | Profile"
};
