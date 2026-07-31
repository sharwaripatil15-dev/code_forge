export type LanguageCode = 'en' | 'hi' | 'es' | 'fr' | 'ja';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  name: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', name: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', label: 'Español', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', name: 'French', flag: '🇫🇷' },
  { code: 'ja', label: '日本語', name: 'Japanese', flag: '🇯🇵' },
];

export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  en: 'English',
  hi: 'Hindi',
  es: 'Spanish',
  fr: 'French',
  ja: 'Japanese',
};

export interface Translations {
  steps: {
    input: string;
    search: string;
    gapmap: string;
    devils: string;
    blueprint: string;
  };
  ideaInput: {
    headlineStart: string;
    headlineHighlight: string;
    subtitle: string;
    describeLabel: string;
    describePlaceholder: string;
    domainLabel: string;
    targetUserLabel: string;
    submitButton: string;
    submittingButton: string;
    voiceInput: string;
    listening: string;
    orSelectTemplate: string;
    examplesCount: string;
  };
  deepSearch: {
    title: string;
    subtitlePrefix: string;
    exploreGapMap: string;
    synthesizingText: string;
    clustersTitle: string;
  };
  devilsAdvocate: {
    title: string;
    subtitle: string;
    evaluateAllButton: string;
  };
  projectHub: {
    title: string;
    executiveSummaryTitle: string;
    architectureTitle: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    steps: {
      input: '1. Idea Input',
      search: '2. DeepSearch',
      gapmap: '3. Gap Map',
      devils: "4. Devil's Advocate",
      blueprint: '5. Project HUB',
    },
    ideaInput: {
      headlineStart: 'From a one-line idea to a',
      headlineHighlight: 'validated project plan',
      subtitle: 'DeepSearch across arXiv papers, GitHub repos, and live web intelligence. Pinpoint uncrowded white-space opportunities in minutes.',
      describeLabel: 'Describe Your Project Idea',
      describePlaceholder: 'e.g., An autonomous AI code reviewer that uses WASM Tree-Sitter AST validation to eliminate false positives in pull request comments...',
      domainLabel: 'Domain / Category',
      targetUserLabel: 'Primary Target User',
      submitButton: 'Run DeepSearch pass',
      submittingButton: 'Generating Intelligence Dossier...',
      voiceInput: 'Voice Input',
      listening: 'Listening...',
      orSelectTemplate: 'Or select a pre-loaded hackathon idea template',
      examplesCount: '3 Domain Examples',
    },
    deepSearch: {
      title: 'DeepSearch Intelligence Dossier',
      subtitlePrefix: 'Multi-source intelligence analysis for:',
      exploreGapMap: 'Explore Interactive Gap Map',
      synthesizingText: 'Synthesizing arXiv + GitHub + Google Patents knowledge clusters...',
      clustersTitle: 'Knowledge Clusters & Prior-Art Families',
    },
    devilsAdvocate: {
      title: "Devil's Advocate Stress-Test",
      subtitle: 'Interrogating weak assumptions and architectural risks before writing code.',
      evaluateAllButton: 'AI Interrogate & Score All',
    },
    projectHub: {
      title: 'Project HUB & Production Blueprint',
      executiveSummaryTitle: 'Executive Summary',
      architectureTitle: 'System Architecture Topology',
    },
  },
  hi: {
    steps: {
      input: '1. विचार दर्ज करें',
      search: '2. दीपसर्च',
      gapmap: '3. गैप मैप',
      devils: '4. डेविल्स एडवोकेट',
      blueprint: '5. प्रोजेक्ट हब',
    },
    ideaInput: {
      headlineStart: 'एक पंक्ति के विचार से एक',
      headlineHighlight: 'सत्यापित प्रोजेक्ट योजना तक',
      subtitle: 'arXiv शोध पत्रों, GitHub रिपॉजिटरी और लाइव वेब इंटेलिजेंस में दीपसर्च करें। मिनटों में नए अवसरों की पहचान करें।',
      describeLabel: 'अपने प्रोजेक्ट विचार का वर्णन करें',
      describePlaceholder: 'उदा. एक स्वायत्त AI कोड समीक्षक जो पुल अनुरोध टिप्पणियों में गलत सकारात्मकताओं को समाप्त करने के लिए WASM ट्री-सिटर AST सत्यापन का उपयोग करता है...',
      domainLabel: 'डोमेन / श्रेणी',
      targetUserLabel: 'प्राथमिक लक्ष्य उपयोगकर्ता',
      submitButton: 'दीपसर्च चलाएं',
      submittingButton: 'इंटेलिजेंस डोजियर जनरेट हो रहा है...',
      voiceInput: 'आवाज इनपुट',
      listening: 'सुन रहा है...',
      orSelectTemplate: 'या एक पूर्व-लोड की गई हैकाथॉन विचार टेम्पलेट चुनें',
      examplesCount: '3 डोमेन उदाहरण',
    },
    deepSearch: {
      title: 'दीपसर्च इंटेलिजेंस डोजियर',
      subtitlePrefix: 'इसके लिए बहु-स्रोत खुफिया विश्लेषण:',
      exploreGapMap: 'इंटरएक्टिव गैप मैप एक्सप्लोर करें',
      synthesizingText: 'arXiv + GitHub + Google पेटेंट ज्ञान क्लस्टर्स का विश्लेषण किया जा रहा है...',
      clustersTitle: 'ज्ञान क्लस्टर और पूर्व-कला परिवार',
    },
    devilsAdvocate: {
      title: 'डेविल्स एडवोकेट तनाव परीक्षण',
      subtitle: 'कोड लिखने से पहले कमजोर मान्यताओं और वास्तुकला जोखिमों से पूछताछ।',
      evaluateAllButton: 'AI पूछताछ और स्कोर करें',
    },
    projectHub: {
      title: 'प्रोजेक्ट हब और प्रोडक्शन ब्लूप्रिंट',
      executiveSummaryTitle: 'कार्यकारी सारांश',
      architectureTitle: 'सिस्टम आर्किटेक्चर टोपोलॉजी',
    },
  },
  es: {
    steps: {
      input: '1. Idea de Proyecto',
      search: '2. Búsqueda Profunda',
      gapmap: '3. Mapa de Brechas',
      devils: '4. Abogado del Diablo',
      blueprint: '5. Centro de Proyecto',
    },
    ideaInput: {
      headlineStart: 'De una idea de una línea a un',
      headlineHighlight: 'plan de proyecto validado',
      subtitle: 'Búsqueda profunda en artículos de arXiv, repositorios de GitHub e inteligencia web en vivo. Identifique oportunidades en minutos.',
      describeLabel: 'Describa su idea de proyecto',
      describePlaceholder: 'ej. Un revisor de código IA autónomo que utiliza validación AST WASM Tree-Sitter para eliminar falsos positivos...',
      domainLabel: 'Dominio / Categoría',
      targetUserLabel: 'Usuario Objetivo Principal',
      submitButton: 'Ejecutar Búsqueda Profunda',
      submittingButton: 'Generando Dossier de Inteligencia...',
      voiceInput: 'Entrada de Voz',
      listening: 'Escuchando...',
      orSelectTemplate: 'O seleccione una plantilla de idea de hackatón predeterminada',
      examplesCount: '3 Ejemplos de Dominio',
    },
    deepSearch: {
      title: 'Dossier de Inteligencia de Búsqueda Profunda',
      subtitlePrefix: 'Análisis de inteligencia fuente múltiple para:',
      exploreGapMap: 'Explorar Mapa de Brechas Interactivo',
      synthesizingText: 'Sintetizando clústeres de arXiv + GitHub + Patentes de Google...',
      clustersTitle: 'Clústeres de Conocimiento y Familias de Arte Previo',
    },
    devilsAdvocate: {
      title: 'Prueba de Estrés del Abogado del Diablo',
      subtitle: 'Interrogando suposiciones débiles y riesgos arquitectónicos antes de codificar.',
      evaluateAllButton: 'Interrogar y Evaluar Todo con IA',
    },
    projectHub: {
      title: 'HUB de Proyecto y Plan de Producción',
      executiveSummaryTitle: 'Resumen Ejecutivo',
      architectureTitle: 'Topología de Arquitectura del Sistema',
    },
  },
  fr: {
    steps: {
      input: "1. Saisie d'Idée",
      search: '2. Recherche Profonde',
      gapmap: '3. Carte des Écarts',
      devils: '4. Avocat du Diable',
      blueprint: '5. HUB de Projet',
    },
    ideaInput: {
      headlineStart: "D'une idée en une ligne à un",
      headlineHighlight: 'plan de projet validé',
      subtitle: 'Recherche approfondie dans les articles arXiv, les repos GitHub et le web en direct. Identifiez les opportunités en quelques minutes.',
      describeLabel: 'Décrivez votre idée de projet',
      describePlaceholder: 'ex. Un réviseur de code IA autonome utilisant la validation AST WASM Tree-Sitter pour éliminer les faux positifs...',
      domainLabel: 'Domaine / Catégorie',
      targetUserLabel: 'Utilisateur Cible Principal',
      submitButton: 'Lancer la Recherche Profonde',
      submittingButton: "Génération du Dossier d'Intelligence...",
      voiceInput: 'Entrée Vocale',
      listening: 'Écoute...',
      orSelectTemplate: "Ou sélectionnez un modèle d'idée de hackathon préchargé",
      examplesCount: '3 Exemples de Domaines',
    },
    deepSearch: {
      title: "Dossier d'Intelligence de Recherche Profonde",
      subtitlePrefix: 'Analyse renseignement multi-sources pour:',
      exploreGapMap: 'Explorer la Carte des Écarts Interactive',
      synthesizingText: 'Synthèse des clusters arXiv + GitHub + Brevets Google...',
      clustersTitle: 'Clusters de Connaissances et Familles d\'Art Antérieur',
    },
    devilsAdvocate: {
      title: "Test de Stress de l'Avocat du Diable",
      subtitle: 'Interrogation des hypothèses faibles et des risques architecturaux avant le codage.',
      evaluateAllButton: 'Interroger et Évaluer Tout par IA',
    },
    projectHub: {
      title: 'HUB de Projet et Plan de Production',
      executiveSummaryTitle: 'Résumé Exécutif',
      architectureTitle: 'Topologie de l\'Architecture Système',
    },
  },
  ja: {
    steps: {
      input: '1. アイデア入力',
      search: '2. ディープサーチ',
      gapmap: '3. ギャップマップ',
      devils: '4. 悪魔の代弁者',
      blueprint: '5. プロジェクトHUB',
    },
    ideaInput: {
      headlineStart: '1行のアイデアから',
      headlineHighlight: '検証されたプロジェクト計画へ',
      subtitle: 'arXiv論文、GitHubリポジトリ、ライブWebインテリジェンスをディープサーチ。手つかずの機会を数分で特定します。',
      describeLabel: 'プロジェクトのアイデアを入力',
      describePlaceholder: '例: WASM Tree-Sitter AST検証を使用してPRコメントの誤検知を排除する自律型AIコードレビューツール...',
      domainLabel: 'ドメイン / カテゴリ',
      targetUserLabel: '主要ターゲットユーザー',
      submitButton: 'ディープサーチを実行',
      submittingButton: 'インテリジェンスドシエを生成中...',
      voiceInput: '音声入力',
      listening: '聞き取り中...',
      orSelectTemplate: 'または、ロード済みのハッカソンアイデアテンプレートを選択',
      examplesCount: '3つのドメイン例',
    },
    deepSearch: {
      title: 'ディープサーチ・インテリジェンス・ドシエ',
      subtitlePrefix: 'マルチソース分析対象:',
      exploreGapMap: 'インタラクティブなギャップマップを探索',
      synthesizingText: 'arXiv + GitHub + Google特許のナレッジクラスタを統合中...',
      clustersTitle: 'ナレッジクラスタと先行技術ファミリー',
    },
    devilsAdvocate: {
      title: '悪魔の代弁者ストレスストレステスト',
      subtitle: 'コードを書く前に脆弱な前提条件とアーキテクチャリスクを検証。',
      evaluateAllButton: 'AIによる一括検証とスコアリング',
    },
    projectHub: {
      title: 'プロジェクトHUBとプロダクションブループリント',
      executiveSummaryTitle: 'エグゼクティブサマリー',
      architectureTitle: 'システムアーキテクチャトポロジ',
    },
  },
};

export function getTranslation(code: LanguageCode = 'en'): Translations {
  return TRANSLATIONS[code] || TRANSLATIONS.en;
}
