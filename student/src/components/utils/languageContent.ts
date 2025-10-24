import { Language } from '../contexts/LanguageContext'

type LanguageContent = {
  welcome: string
  dailyGoal: string
  minutesToday: string
  streak: string
  goalComplete: string
  startNow: string
  continueLeaning: string
  quickSkills: string[]
  topCategories: Array<{
    name: string
    icon: string
    lessons: number
  }>
  newTrending: string
  practiceFeatures: Array<{
    title: string
    description: string
  }>
  studyAbroad: string
  marketplace: string
}

export const getLanguageContent = (language: Language): LanguageContent => {
  switch (language.code) {
    case 'es':
      return {
        welcome: 'Aprendiendo Español',
        dailyGoal: 'Meta Diaria',
        minutesToday: 'minutos hoy',
        streak: 'días seguidos',
        goalComplete: '🎉 ¡Meta completada! ¡Increíble trabajo!',
        startNow: 'Empezar ahora',
        continueLeaning: 'Continuar Aprendiendo',
        quickSkills: ['Gramática', 'Vocabulario', 'Escuchar', 'Hablar', 'Escribir'],
        topCategories: [
          { name: 'Español de Negocios', icon: '💼', lessons: 48 },
          { name: 'Viajes y Turismo', icon: '✈️', lessons: 32 },
          { name: 'Cultura Hispana', icon: '🎭', lessons: 25 },
          { name: 'Conversación', icon: '💬', lessons: 56 }
        ],
        newTrending: 'Nuevo y Tendencia',
        practiceFeatures: [
          {
            title: 'Chat con IA en Español',
            description: 'Practica conversaciones con IA'
          },
          {
            title: 'Quiz Interactivo DELE',
            description: 'Prepárate para el examen DELE'
          },
          {
            title: 'Tarjetas de Vocabulario',
            description: 'Sistema de repetición espaciada'
          }
        ],
        studyAbroad: 'Estudiar en el Extranjero',
        marketplace: 'Mercado de Cursos'
      }

    case 'fr':
      return {
        welcome: 'Apprendre le Français',
        dailyGoal: 'Objectif Quotidien',
        minutesToday: 'minutes aujourd\'hui',
        streak: 'jours consécutifs',
        goalComplete: '🎉 Objectif atteint ! Excellent travail !',
        startNow: 'Commencer maintenant',
        continueLeaning: 'Continuer l\'Apprentissage',
        quickSkills: ['Grammaire', 'Vocabulaire', 'Écoute', 'Parole', 'Écriture'],
        topCategories: [
          { name: 'Français des Affaires', icon: '💼', lessons: 48 },
          { name: 'Voyage et Tourisme', icon: '✈️', lessons: 32 },
          { name: 'Culture Française', icon: '🥖', lessons: 25 },
          { name: 'Conversation', icon: '💬', lessons: 56 }
        ],
        newTrending: 'Nouveau et Tendance',
        practiceFeatures: [
          {
            title: 'Chat IA en Français',
            description: 'Pratiquez avec l\'IA'
          },
          {
            title: 'Quiz DELF/DALF',
            description: 'Préparez-vous aux examens'
          },
          {
            title: 'Cartes de Vocabulaire',
            description: 'Système de répétition espacée'
          }
        ],
        studyAbroad: 'Étudier à l\'Étranger',
        marketplace: 'Marché des Cours'
      }

    case 'de':
      return {
        welcome: 'Deutsch Lernen',
        dailyGoal: 'Tagesziel',
        minutesToday: 'Minuten heute',
        streak: 'Tage in Folge',
        goalComplete: '🎉 Ziel erreicht! Ausgezeichnete Arbeit!',
        startNow: 'Jetzt beginnen',
        continueLeaning: 'Weiter Lernen',
        quickSkills: ['Grammatik', 'Wortschatz', 'Hören', 'Sprechen', 'Schreiben'],
        topCategories: [
          { name: 'Business Deutsch', icon: '💼', lessons: 48 },
          { name: 'Reisen & Tourismus', icon: '✈️', lessons: 32 },
          { name: 'Deutsche Kultur', icon: '🏰', lessons: 25 },
          { name: 'Konversation', icon: '💬', lessons: 56 }
        ],
        newTrending: 'Neu und Trending',
        practiceFeatures: [
          {
            title: 'KI-Chat auf Deutsch',
            description: 'Üben Sie Gespräche mit KI'
          },
          {
            title: 'Goethe-Zertifikat Quiz',
            description: 'Bereiten Sie sich auf Prüfungen vor'
          },
          {
            title: 'Vokabel-Karteikarten',
            description: 'Spaced-Repetition-System'
          }
        ],
        studyAbroad: 'Auslandsstudium',
        marketplace: 'Kurs-Marktplatz'
      }

    case 'it':
      return {
        welcome: 'Imparare l\'Italiano',
        dailyGoal: 'Obiettivo Giornaliero',
        minutesToday: 'minuti oggi',
        streak: 'giorni consecutivi',
        goalComplete: '🎉 Obiettivo raggiunto! Lavoro fantastico!',
        startNow: 'Inizia ora',
        continueLeaning: 'Continua ad Imparare',
        quickSkills: ['Grammatica', 'Vocabolario', 'Ascolto', 'Parlato', 'Scrittura'],
        topCategories: [
          { name: 'Italiano Business', icon: '💼', lessons: 48 },
          { name: 'Viaggi e Turismo', icon: '✈️', lessons: 32 },
          { name: 'Cultura Italiana', icon: '🍝', lessons: 25 },
          { name: 'Conversazione', icon: '💬', lessons: 56 }
        ],
        newTrending: 'Nuovo e di Tendenza',
        practiceFeatures: [
          {
            title: 'Chat AI in Italiano',
            description: 'Pratica conversazioni con AI'
          },
          {
            title: 'Quiz CILS/CELI',
            description: 'Preparati per gli esami'
          },
          {
            title: 'Flashcard Vocabolario',
            description: 'Sistema di ripetizione spaziata'
          }
        ],
        studyAbroad: 'Studiare all\'Estero',
        marketplace: 'Mercato Corsi'
      }

    case 'pt':
      return {
        welcome: 'Aprendendo Português',
        dailyGoal: 'Meta Diária',
        minutesToday: 'minutos hoje',
        streak: 'dias seguidos',
        goalComplete: '🎉 Meta concluída! Trabalho incrível!',
        startNow: 'Começar agora',
        continueLeaning: 'Continuar Aprendendo',
        quickSkills: ['Gramática', 'Vocabulário', 'Audição', 'Fala', 'Escrita'],
        topCategories: [
          { name: 'Português Business', icon: '💼', lessons: 48 },
          { name: 'Viagem e Turismo', icon: '✈️', lessons: 32 },
          { name: 'Cultura Brasileira', icon: '🇧🇷', lessons: 25 },
          { name: 'Conversação', icon: '💬', lessons: 56 }
        ],
        newTrending: 'Novo e Trending',
        practiceFeatures: [
          {
            title: 'Chat IA em Português',
            description: 'Pratique conversas com IA'
          },
          {
            title: 'Quiz CELPE-Bras',
            description: 'Prepare-se para exames'
          },
          {
            title: 'Flashcards de Vocabulário',
            description: 'Sistema de repetição espaçada'
          }
        ],
        studyAbroad: 'Estudar no Exterior',
        marketplace: 'Mercado de Cursos'
      }

    case 'ru':
      return {
        welcome: 'Изучение Русского',
        dailyGoal: 'Дневная Цель',
        minutesToday: 'минут сегодня',
        streak: 'дней подряд',
        goalComplete: '🎉 Цель достигнута! Отличная работа!',
        startNow: 'Начать сейчас',
        continueLeaning: 'Продолжить Обучение',
        quickSkills: ['Грамматика', 'Словарь', 'Аудирование', 'Говорение', 'Письмо'],
        topCategories: [
          { name: 'Деловой Русский', icon: '💼', lessons: 48 },
          { name: 'Путешествия', icon: '✈️', lessons: 32 },
          { name: 'Русская Культура', icon: '🪆', lessons: 25 },
          { name: 'Разговор', icon: '💬', lessons: 56 }
        ],
        newTrending: 'Новое и Популярное',
        practiceFeatures: [
          {
            title: 'ИИ Чат на Русском',
            description: 'Практикуйте разговор с ИИ'
          },
          {
            title: 'ТРКИ Викторина',
            description: 'Подготовка к экзаменам'
          },
          {
            title: 'Карточки Словаря',
            description: 'Система интервального повторения'
          }
        ],
        studyAbroad: 'Обучение за Рубежом',
        marketplace: 'Магазин Курсов'
      }

    case 'ko':
      return {
        welcome: '한국어 학습',
        dailyGoal: '일일 목표',
        minutesToday: '분/오늘',
        streak: '일 연속',
        goalComplete: '🎉 목표 달성! 훌륭한 작업!',
        startNow: '지금 시작',
        continueLeaning: '학습 계속하기',
        quickSkills: ['문법', '어휘', '듣기', '말하기', '쓰기'],
        topCategories: [
          { name: '비즈니스 한국어', icon: '💼', lessons: 48 },
          { name: '여행 한국어', icon: '✈️', lessons: 32 },
          { name: '한국 문화', icon: '🇰🇷', lessons: 25 },
          { name: '일상 대화', icon: '💬', lessons: 56 }
        ],
        newTrending: '새로운 인기',
        practiceFeatures: [
          {
            title: 'AI 한국어 채팅',
            description: 'AI와 한국어 대화 연습'
          },
          {
            title: 'TOPIK 퀴즈',
            description: '한국어능력시험 준비'
          },
          {
            title: '어휘 플래시카드',
            description: '간격 반복 학습 시스템'
          }
        ],
        studyAbroad: '유학',
        marketplace: '강의 마켓플레이스'
      }

    case 'hi':
      return {
        welcome: 'हिंदी सीखना',
        dailyGoal: 'दैनिक लक्ष्य',
        minutesToday: 'मिनट आज',
        streak: 'दिन लगातार',
        goalComplete: '🎉 लक्ष्य पूरा! बेहतरीन काम!',
        startNow: 'अभी शुरू करें',
        continueLeaning: 'सीखना जारी रखें',
        quickSkills: ['व्याकरण', 'शब्दावली', 'सुनना', 'बोलना', 'लिखना'],
        topCategories: [
          { name: 'व्यापारिक हिंदी', icon: '💼', lessons: 48 },
          { name: 'यात्रा हिंदी', icon: '✈️', lessons: 32 },
          { name: 'भारतीय संस्कृति', icon: '🇮🇳', lessons: 25 },
          { name: 'बातचीत', icon: '💬', lessons: 56 }
        ],
        newTrending: 'नया और लोकप्रिय',
        practiceFeatures: [
          {
            title: 'AI हिंदी चैट',
            description: 'AI के साथ हिंदी बातचीत का अभ्यास'
          },
          {
            title: 'इंटरैक्टिव क्विज़',
            description: 'अपने ज्ञान का परीक्षण करें'
          },
          {
            title: 'शब्दावली फ्लैशकार्ड',
            description: 'अंतराल पुनरावृत्ति सीखने की प्रणाली'
          }
        ],
        studyAbroad: 'विदेश में अध्ययन',
        marketplace: 'पाठ्यक्रम बाज़ार'
      }

    case 'ja':
      return {
        welcome: '日本語を学習中',
        dailyGoal: '今日の目標',
        minutesToday: '分/今日',
        streak: '日連続',
        goalComplete: '🎉 目標達成！素晴らしい！',
        startNow: '今すぐ始める',
        continueLeaning: '学習を続ける',
        quickSkills: ['文法', '語彙', 'リスニング', '会話', '作文'],
        topCategories: [
          { name: 'ビジネス日本語', icon: '💼', lessons: 48 },
          { name: '旅行・観光', icon: '✈️', lessons: 32 },
          { name: '日本文化', icon: '🎌', lessons: 25 },
          { name: '日常会話', icon: '💬', lessons: 56 }
        ],
        newTrending: '新着・トレンド',
        practiceFeatures: [
          {
            title: 'AI日本語チャット',
            description: 'AIと日本語で会話練習'
          },
          {
            title: 'JLPT対策クイズ',
            description: '日本語能力試験の準備'
          },
          {
            title: '漢字フラッシュカード',
            description: '間隔反復学習システム'
          }
        ],
        studyAbroad: '日本留学',
        marketplace: 'レッスン市場'
      }

    case 'zh':
      return {
        welcome: '正在学习中文',
        dailyGoal: '每日目标',
        minutesToday: '分钟/今天',
        streak: '天连续',
        goalComplete: '🎉 目标完成！做得很好！',
        startNow: '现在开始',
        continueLeaning: '继续学习',
        quickSkills: ['语法', '词汇', '听力', '口语', '写作'],
        topCategories: [
          { name: '商务中文', icon: '💼', lessons: 48 },
          { name: '旅游中文', icon: '✈️', lessons: 32 },
          { name: '中国文化', icon: '🏮', lessons: 25 },
          { name: '日常对话', icon: '💬', lessons: 56 }
        ],
        newTrending: '新的热门',
        practiceFeatures: [
          {
            title: 'AI中文对话',
            description: '与AI练习中文对话'
          },
          {
            title: 'HSK测试练习',
            description: '汉语水平考试准备'
          },
          {
            title: '汉字学习卡',
            description: '间隔重复学习系统'
          }
        ],
        studyAbroad: '中国留学',
        marketplace: '课程市场'
      }

    case 'ar':
      return {
        welcome: 'تعلم اللغة العربية',
        dailyGoal: 'الهدف اليومي',
        minutesToday: 'دقيقة/اليوم',
        streak: 'يوم متتالي',
        goalComplete: '🎉 تم تحقيق الهدف! عمل رائع!',
        startNow: 'ابدأ الآن',
        continueLeaning: 'متابعة التعلم',
        quickSkills: ['النحو', 'المفردات', 'الاستماع', 'المحادثة', 'الكتابة'],
        topCategories: [
          { name: 'العربية التجارية', icon: '💼', lessons: 48 },
          { name: 'عربية السفر', icon: '✈️', lessons: 32 },
          { name: 'الثقافة العربية', icon: '🕌', lessons: 25 },
          { name: 'المحادثة اليومية', icon: '💬', lessons: 56 }
        ],
        newTrending: 'جديد ومتداول',
        practiceFeatures: [
          {
            title: 'محادثة AI بالعربية',
            description: 'تدرب على المحادثة مع الذكاء الاصطناعي'
          },
          {
            title: 'اختبارات تفاعلية',
            description: 'اختبر معرفتك بتمارين متنوعة'
          },
          {
            title: 'بطاقات المفردات',
            description: 'نظام التعلم بالتكرار المتباعد'
          }
        ],
        studyAbroad: 'الدراسة في الخارج',
        marketplace: 'سوق الدروس'
      }

    default: // English
      return {
        welcome: 'Learning English',
        dailyGoal: 'Daily Goal',
        minutesToday: 'minutes today',
        streak: '-day streak',
        goalComplete: '🎉 Goal complete! Amazing work!',
        startNow: 'Start now',
        continueLeaning: 'Continue Learning',
        quickSkills: ['Grammar', 'Vocabulary', 'Listening', 'Speaking', 'Writing'],
        topCategories: [
          { name: 'Business English', icon: '💼', lessons: 48 },
          { name: 'Travel & Tourism', icon: '✈️', lessons: 32 },
          { name: 'Academic Writing', icon: '📝', lessons: 25 },
          { name: 'Conversation', icon: '💬', lessons: 56 }
        ],
        newTrending: 'New & Trending',
        practiceFeatures: [
          {
            title: 'AI Chat Partner',
            description: 'Practice conversations with AI'
          },
          {
            title: 'Interactive Quiz',
            description: 'Test your knowledge with MCQ exercises'
          },
          {
            title: 'Vocabulary Flashcards',
            description: 'Spaced repetition learning system'
          }
        ],
        studyAbroad: 'Study Abroad',
        marketplace: 'Marketplace'
      }
  }
}