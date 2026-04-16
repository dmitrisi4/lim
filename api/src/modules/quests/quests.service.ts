import { Injectable } from '@nestjs/common';

export type LearningLanguage = 'en' | 'es' | 'ru';
export type EnglishLevel = 'a1' | 'a2' | 'b1' | 'b2' | 'c1';
export type SlideCategory = 'grammar' | 'vocabulary' | 'speaking' | 'listening' | 'reading';

export type QuestLocalizedCopy = Partial<Record<LearningLanguage, string>>;

export interface QuestRequirements {
	totalCompleted?: number;
	byLevel?: Partial<Record<EnglishLevel, number>>;
	byCategory?: Partial<Record<SlideCategory, number>>;
}

export interface QuestDefinition {
	id: string;
	title: QuestLocalizedCopy;
	description: QuestLocalizedCopy;
	reward: QuestLocalizedCopy;
	requirements: QuestRequirements;
}

@Injectable()
export class QuestsService {
	private readonly quests: QuestDefinition[] = [
		{
			id: 'starter-pack',
			title: {
				en: 'English Starter',
				ru: 'Английский Старт',
				es: 'Inicio de Inglés',
			},
			description: {
				en: 'Complete your first steps in the English world.',
				ru: 'Сделай свои первые шаги в мире английского языка.',
				es: 'Completa tus primeros pasos en el mundo del inglés.',
			},
			reward: {
				en: 'Starter Badge',
				ru: 'Значок Новичка',
				es: 'Insignia de Iniciado',
			},
			requirements: {
				totalCompleted: 3,
				byLevel: {
					a1: 2,
				},
			},
		},
		{
			id: 'grammar-basics',
			title: {
				en: 'Grammar Foundation',
				ru: 'Основы грамматики',
				es: 'Bases de Gramática',
			},
			description: {
				en: 'Master the core rules of English grammar.',
				ru: 'Освой базовые правила английской грамматики.',
				es: 'Domina las reglas principales de la gramática inglesa.',
			},
			reward: {
				en: 'Grammar Seal',
				ru: 'Печать Грамматики',
				es: 'Sello de Gramática',
			},
			requirements: {
				byCategory: {
					grammar: 4,
				},
			},
		},
		{
			id: 'vocab-booster',
			title: {
				en: 'Daily Vocabulary',
				ru: 'Повседневные слова',
				es: 'Vocabulario Diario',
			},
			description: {
				en: 'Increase your word count for everyday conversations.',
				ru: 'Увеличь свой словарный запас для повседневного общения.',
				es: 'Aumenta tu vocabulario para conversaciones diarias.',
			},
			reward: {
				en: 'Lexicon Crest',
				ru: 'Герб Лексики',
				es: 'Emblema de Léxico',
			},
			requirements: {
				byCategory: {
					vocabulary: 4,
				},
			},
		},
		{
			id: 'communication-pro',
			title: {
				en: 'First Conversations',
				ru: 'Первые разговоры',
				es: 'Primeras Conversaciones',
			},
			description: {
				en: 'Practice speaking and listening to start communicating.',
				ru: 'Практикуй говорение и аудирование, чтобы начать общение.',
				es: 'Practica habla y escucha para empezar a comunicarte.',
			},
			reward: {
				en: 'Speaker Token',
				ru: 'Токен Диктора',
				es: 'Token de Orador',
			},
			requirements: {
				byCategory: {
					speaking: 2,
					listening: 2,
					reading: 2,
				},
			},
		},
		{
			id: 'level-up-a1',
			title: {
				en: 'A1 Explorer',
				ru: 'Исследователь A1',
				es: 'Explorador A1',
			},
			description: {
				en: 'Complete a full cycle of A1 level requirements.',
				ru: 'Заверши полный цикл требований уровня A1.',
				es: 'Completa un ciclo completo de requisitos de nivel A1.',
			},
			reward: {
				en: 'Veteran Crest',
				ru: 'Герб Ветерана',
				es: 'Emblema Veterano',
			},
			requirements: {
				totalCompleted: 12,
				byLevel: {
					a1: 8,
				},
			},
		},
	];

	findAll(): QuestDefinition[] {
		return this.quests;
	}
}
