import { dataProvider } from "~/shared/providers/data.provider";
import { endpoints } from "~/shared/api/endpoints";
import type { QuestDefinition } from "~/features/gamification/model/quests";

export const fetchQuests = async (): Promise<QuestDefinition[]> => {
  return dataProvider.get<QuestDefinition[]>(endpoints.quests);
};
