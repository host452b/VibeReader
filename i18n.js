// VibeReader i18n — English / Japanese / Chinese
// all fonts: Inter, Noto Sans JP, Noto Sans SC (SIL OFL, free for commercial use)

var I18N_LANGS = ['en', 'ja', 'zh'];
var I18N_DEFAULT = 'en';

// font stacks per language (applied via html[lang] in CSS)
var I18N_FONTS = {
  en: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  ja: "'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif",
  zh: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'Source Han Sans CN', sans-serif"
};

// --- UI strings -----------------------------------------------------------

var I18N_UI = {
  en: {
    langName:        'English',
    manualMode:      'MANUAL MODE',
    transmit:        'SEND',
    stop:            'STOP',
    refresh:         'REFRESH',
    rawTxt:          'RAW',
    flow:            'FLOW',
    cfg:             'CFG',
    clr:             'CLR',
    inputPlaceholder:'Ask anything about this page...',
    targetNone:      'Target: [None]',
    targetLost:      'Target: [Lost]',
    targetRestricted:'Target: [Restricted]',
    systemReady:     'Ready',
    scanning:        'Scanning...',
    pageLoaded:      'Page content loaded.',
    chatCleared:     'Chat cleared.',
    contextActive:   'Page context remains active.',
    configureApi:    'Please configure your AI provider in CFG.',
    stage1:          '[1/4] Preparing...',
    stage2ctx:       '[2/4] Context: ',
    stage2none:      '[2/4] No page context',
    stage3:          '[3/4] Transmitting...',
    stage4:          '[4/4] Rendering...',
    completed:       'completed in ',
    overflow:        '[3/4] Context overflow — splitting...',
    aborted:         'Transmission aborted.',
    retry:           'Retry ',
    copy:            'COPY',
    copied:          'COPIED',
    searchPlaceholder:'Search...',
    rawHeader:       'RAW TEXT EDITOR',
    // options page
    settingsTitle:   'VibeReader Settings',
    language:        'Language',
    aiProvider:      'AI Provider',
    localFirstHint:  'Local-first: Ollama runs on your machine with zero data leaving localhost. Cloud providers send page content to external APIs.',
    provider:        'Provider',
    baseUrl:         'Base URL',
    apiKey:          'API Key',
    apiFormat:       'API Format',
    model:           'Model',
    reasoningEffort: 'Reasoning Effort',
    testConnection:  'Test Connection',
    saveSettings:    'Save Settings',
    autoSummary:     'Auto Summary',
    enableAutoSum:   'Enable Auto Summary',
    autoSumHint:     'Automatically summarize page content when opening a new webpage.',
    promptTemplates: 'Prompt Templates',
    savedTemplates:  'Saved Templates',
    addTemplate:     '+ Add New Template',
    templateName:    'Template Name',
    templateContent: 'Prompt Content',
    saveTemplate:    'Save Template',
    deleteTemplate:  'Delete',
    systemPromptTitle:'Default System Prompt',
    systemPromptHint:'This prompt is prepended to every request. Placeholders are auto-filled at runtime.',
    saveSystemPrompt:'Save System Prompt',
    resetSystemPrompt:'Reset to Default',
    settingsSaved:   'Settings saved.',
    templateSaved:   'Template saved.',
    promptSaved:     'System prompt saved.',
    promptReset:     'Reset to default.',
    // autosum sidebar
    sumLabel:        'SUM',
    sumHeader:       'AUTO SUMMARY',
    sumAwaiting:     'awaiting...',
    sumAnalyzing:    'analyzing page...',
    sumRetry:        'RETRY',
    sumReady:        'READY',
    sumErr:          'ERR',
    // tab picker
    tabSelectPages:  'Select Pages',
    tabSelected:     'selected',
    tabLoadSelected: 'Load Selected',
    tabPages:        'pages',
    tabLoaded:       'Loaded {n}/{total} pages ({kb} KB)',
    aiPreviousReply: 'AI previous reply:',
    // privacy & consent
    cloudConsentTitle:   'Data Transmission Notice',
    cloudConsentMessage: 'Page content will be sent to {provider} for AI analysis. Continue?',
    cloudConsentOk:      'Allow',
    cloudConsentCancel:  'Cancel',
    cloudConsentRemember:'Don\'t ask again',
    apiKeyLocalHint:     'Your API key is stored locally on this device only — never synced to cloud.',
    privacyPolicyLink:   'Privacy Policy',
    dataWarningCloud:    'Cloud provider: page content will be sent to external API.'
  },

  ja: {
    langName:        '日本語',
    manualMode:      'マニュアルモード',
    transmit:        '送信',
    stop:            '停止',
    refresh:         '更新',
    rawTxt:          'RAW',
    flow:            'フロー',
    cfg:             '設定',
    clr:             'クリア',
    inputPlaceholder:'このページについて何でも聞いてください...',
    targetNone:      'ターゲット: [なし]',
    targetLost:      'ターゲット: [信号なし]',
    targetRestricted:'ターゲット: [制限]',
    systemReady:     '準備完了',
    scanning:        'スキャン中...',
    pageLoaded:      'ページコンテンツを読み込みました。',
    chatCleared:     'チャットをクリアしました。',
    contextActive:   'ページコンテキストはアクティブです。',
    configureApi:    'CFGでAIプロバイダを設定してください。',
    stage1:          '[1/4] 準備中...',
    stage2ctx:       '[2/4] コンテキスト: ',
    stage2none:      '[2/4] ページコンテキストなし',
    stage3:          '[3/4] API送信中...',
    stage4:          '[4/4] レンダリング中...',
    completed:       '完了: ',
    overflow:        '[3/4] コンテキスト超過 — 分割中...',
    aborted:         '送信を中断しました。',
    retry:           'リトライ ',
    copy:            'コピー',
    copied:          'コピー済',
    searchPlaceholder:'検索...',
    rawHeader:       'RAWテキストエディタ',
    settingsTitle:   'VibeReader 設定',
    language:        '言語',
    aiProvider:      'AIプロバイダ',
    localFirstHint:  'ローカル優先: Ollamaはデータを外部に送信せず、完全にローカルで実行されます。クラウドプロバイダはページ内容を外部APIに送信します。',
    provider:        'プロバイダ',
    baseUrl:         'ベースURL',
    apiKey:          'APIキー',
    apiFormat:       'APIフォーマット',
    model:           'モデル',
    reasoningEffort: '推論強度',
    testConnection:  '接続テスト',
    saveSettings:    '設定を保存',
    autoSummary:     '自動要約',
    enableAutoSum:   '自動要約を有効にする',
    autoSumHint:     '新しいウェブページを開くと自動的にページ内容を要約します。',
    promptTemplates: 'プロンプトテンプレート',
    savedTemplates:  '保存済みテンプレート',
    addTemplate:     '+ テンプレートを追加',
    templateName:    'テンプレート名',
    templateContent: 'プロンプト内容',
    saveTemplate:    'テンプレートを保存',
    deleteTemplate:  '削除',
    systemPromptTitle:'デフォルトシステムプロンプト',
    systemPromptHint:'このプロンプトはすべてのリクエストに付与されます。プレースホルダは実行時に自動入力されます。',
    saveSystemPrompt:'システムプロンプトを保存',
    resetSystemPrompt:'デフォルトにリセット',
    settingsSaved:   '設定を保存しました。',
    templateSaved:   'テンプレートを保存しました。',
    promptSaved:     'システムプロンプトを保存しました。',
    promptReset:     'デフォルトにリセットしました。',
    sumLabel:        '要約',
    sumHeader:       '自動要約',
    sumAwaiting:     '待機中...',
    sumAnalyzing:    'ページ分析中...',
    sumRetry:        'リトライ',
    sumReady:        '完了',
    sumErr:          'エラー',
    tabSelectPages:  'ページを選択',
    tabSelected:     '選択中',
    tabLoadSelected: '選択を読み込む',
    tabPages:        'ページ',
    tabLoaded:       '{n}/{total} ページを読み込みました ({kb} KB)',
    aiPreviousReply: 'AIの前回の回答:',
    cloudConsentTitle:   'データ送信のお知らせ',
    cloudConsentMessage: 'ページコンテンツがAI分析のため {provider} に送信されます。続行しますか？',
    cloudConsentOk:      '許可',
    cloudConsentCancel:  'キャンセル',
    cloudConsentRemember:'今後表示しない',
    apiKeyLocalHint:     'APIキーはこのデバイスにのみ保存され、クラウドには同期されません。',
    privacyPolicyLink:   'プライバシーポリシー',
    dataWarningCloud:    'クラウドプロバイダ: ページコンテンツが外部APIに送信されます。'
  },

  zh: {
    langName:        '中文',
    manualMode:      '手动模式',
    transmit:        '发送',
    stop:            '停止',
    refresh:         '刷新',
    rawTxt:          '原文',
    flow:            '流程',
    cfg:             '设置',
    clr:             '清除',
    inputPlaceholder:'输入你关于这个页面的问题...',
    targetNone:      '目标: [无]',
    targetLost:      '目标: [信号丢失]',
    targetRestricted:'目标: [受限]',
    systemReady:     '就绪',
    scanning:        '扫描中...',
    pageLoaded:      '页面内容已加载。',
    chatCleared:     '聊天已清除。',
    contextActive:   '页面上下文仍然有效。',
    configureApi:    '请在设置中配置 AI 供应商。',
    stage1:          '[1/4] 准备中...',
    stage2ctx:       '[2/4] 上下文: ',
    stage2none:      '[2/4] 无页面上下文',
    stage3:          '[3/4] 正在传输...',
    stage4:          '[4/4] 渲染响应中...',
    completed:       '完成耗时 ',
    overflow:        '[3/4] 上下文溢出 — 分割中...',
    aborted:         '传输已中止。',
    retry:           '重试 ',
    copy:            '复制',
    copied:          '已复制',
    searchPlaceholder:'搜索...',
    rawHeader:       '原始文本编辑器',
    settingsTitle:   'VibeReader 设置',
    language:        '语言',
    aiProvider:      'AI 供应商',
    localFirstHint:  '本地优先：Ollama 在你的设备上运行，数据不离开 localhost。云供应商会将页面内容发送到外部 API。',
    provider:        '供应商',
    baseUrl:         '基础 URL',
    apiKey:          'API 密钥',
    apiFormat:       'API 格式',
    model:           '模型',
    reasoningEffort: '推理强度',
    testConnection:  '测试连接',
    saveSettings:    '保存设置',
    autoSummary:     '自动摘要',
    enableAutoSum:   '启用自动摘要',
    autoSumHint:     '打开新网页时自动摘要页面内容。',
    promptTemplates: '提示词模板',
    savedTemplates:  '已保存的模板',
    addTemplate:     '+ 新建模板',
    templateName:    '模板名称',
    templateContent: '提示词内容',
    saveTemplate:    '保存模板',
    deleteTemplate:  '删除',
    systemPromptTitle:'默认系统提示词',
    systemPromptHint:'此提示词会附加到每个请求中。占位符在运行时自动填充。',
    saveSystemPrompt:'保存系统提示词',
    resetSystemPrompt:'恢复默认',
    settingsSaved:   '设置已保存。',
    templateSaved:   '模板已保存。',
    promptSaved:     '系统提示词已保存。',
    promptReset:     '已恢复默认。',
    sumLabel:        '摘要',
    sumHeader:       '自动摘要',
    sumAwaiting:     '等待中...',
    sumAnalyzing:    '正在分析页面...',
    sumRetry:        '重试',
    sumReady:        '就绪',
    sumErr:          '错误',
    tabSelectPages:  '选择页面',
    tabSelected:     '已选',
    tabLoadSelected: '加载选中',
    tabPages:        '个页面',
    tabLoaded:       '已加载 {n}/{total} 个页面 ({kb} KB)',
    aiPreviousReply: 'AI上一轮回复:',
    cloudConsentTitle:   '数据传输提示',
    cloudConsentMessage: '页面内容将发送至 {provider} 进行 AI 分析。是否继续？',
    cloudConsentOk:      '允许',
    cloudConsentCancel:  '取消',
    cloudConsentRemember:'不再提示',
    apiKeyLocalHint:     'API 密钥仅存储在本地设备，不会同步到云端。',
    privacyPolicyLink:   '隐私政策',
    dataWarningCloud:    '云端提供商: 页面内容将发送至外部 API。'
  }
};

// --- templates per language ------------------------------------------------

var I18N_TEMPLATES = {
  en: [
    { id: 'devops-root-cause', name: 'DevOps Root Cause', content: 'Act as a senior SRE. Identify the ROOT CAUSE, not just symptoms.\n\n1. **Failure Summary**\n2. **Potential Causes** — 3-5 plausible causes\n3. **Root Cause** —\n<root_cause>[most likely cause with evidence]</root_cause>\n4. **Validation Steps** — 2-3 checks\n5. **Fix** — direct fix, not workaround\n\nFailure Details:\n' },
    { id: 'code-review', name: 'Code Review', content: 'Act as a senior engineer doing a code review.\n\n1. **Overview** — what does this code do?\n2. **Bugs** — logic errors, race conditions, null risks\n3. **Security** — injection, XSS, secrets exposure\n4. **Performance** — unnecessary allocations, O(n²)\n5. **Readability** — naming, structure, dead code\n6. **Suggestions** — prioritized improvements with examples\n\nCode:\n' },
    { id: 'tech-explainer', name: 'Tech Explainer', content: 'Explain the technical content on this page for a broad audience.\n\n1. **TL;DR** — one sentence\n2. **Key Concepts** — define jargon\n3. **How It Works** — step by step with analogies\n4. **Why It Matters** — practical implications\n5. **Limitations** — what the page doesn\'t say\n\nContent:\n' },
    { id: 'security-audit', name: 'Security Audit', content: 'Conduct a security review (OWASP Top 10, CWE).\n\n1. **Attack Surface** — what is exposed?\n2. **Vulnerabilities** — severity, CWE ID, evidence\n3. **Exploitation** — how each could be exploited\n4. **Remediation** — specific fixes\n5. **Compliance** — relevant standards\n\nContent:\n' },
    { id: 'legal-analysis', name: 'Legal Document Analysis', content: 'Analyze this legal document (contract, ToS, policy).\n\n1. **Document Type & Jurisdiction**\n2. **Key Provisions** — 5-8 most important clauses in plain language\n3. **Rights & Obligations** — what each party can/must/cannot do\n4. **Risk Flags** — unusual or one-sided clauses (High/Medium/Low)\n5. **Ambiguities** — vague language\n6. **Plain Language Summary**\n\nNOTE: Analysis only, not legal advice.\n\nDocument:\n' },
    { id: 'legal-compare', name: 'Legal Clause Comparison', content: 'Compare terms on this page against market standards.\n\n1. **Standard vs Non-Standard** clauses\n2. **Missing Protections** — liability, IP, data protection\n3. **Negotiation Points** — top 3-5 with suggested language\n4. **Deadline & Notice Requirements**\n\nNOTE: For reference only.\n\nContent:\n' },
    { id: 'financial-analysis', name: 'Financial Analysis', content: 'Analyze the financial data on this page.\n\n1. **Key Metrics** — revenue, margins, growth, ratios (table)\n2. **Trends** — YoY/QoQ direction\n3. **Red Flags** — unusual items, accounting changes\n4. **Competitive Context** — vs industry benchmarks\n5. **Investment Thesis** — bull vs bear in 2-3 sentences each\n6. **Missing Data** — what else is needed?\n\nDISCLAIMER: Not investment advice.\n\nContent:\n' },
    { id: 'business-strategy', name: 'Business Strategy Brief', content: 'Analyze as a management consultant.\n\n1. **Situation** — market context, problem statement\n2. **Key Insights** — 3-5 non-obvious observations\n3. **Options** — 2-3 strategies with pros/cons\n4. **Recommendation** — which and why\n5. **Implementation** — first 3 steps\n6. **Risks** — what could go wrong\n\nContent:\n' },
    { id: 'news-factcheck', name: 'News Fact-Check & Bias', content: 'Examine this article for accuracy and bias.\n\n1. **Core Claims** — list every factual claim\n2. **Source Quality** — named, anonymous, primary?\n3. **Bias Indicators** — loaded language, omitted context\n4. **Missing Perspectives** — absent viewpoints\n5. **Verifiable vs Unverifiable** claims\n6. **Reliability Rating** — High/Medium/Low\n\nArticle:\n' },
    { id: 'research-critique', name: 'Research Paper Critique', content: 'Peer review the research on this page.\n\n1. **Research Question** — well-defined?\n2. **Methodology** — appropriate? sample size?\n3. **Findings** — actual vs claimed\n4. **Limitations** — confounders, bias\n5. **Significance** — meaningful effect size?\n6. **Reproducibility** — enough detail to replicate?\n\nContent:\n' },
    { id: 'copywriting-audit', name: 'Copywriting Audit', content: 'Audit the page content for communication effectiveness.\n\n1. **Message Clarity** — core message in one sentence\n2. **Audience Fit** — tone/vocabulary match\n3. **Structure** — hierarchy, scanability\n4. **Persuasion** — CTA, benefits before features\n5. **Weak Spots** — jargon, passive voice, walls of text\n6. **Rewrites** — 3-5 before/after suggestions\n\nContent:\n' },
    { id: 'translation-review', name: 'Translation Review (EN↔CN)', content: 'Translate and review the page content between English and Chinese.\n\n1. **Source Analysis** — terminology, idioms, register\n2. **Translation** — preserving meaning and tone\n3. **Localization Notes** — cultural adaptations\n4. **Terminology Table** — key terms with translations\n5. **Quality Flags** — ambiguous sentences\n\nContent:\n' },
    { id: 'product-analysis', name: 'Product Analysis', content: 'Analyze this product page / feature doc / changelog.\n\n1. **Value Proposition** — what problem, for whom?\n2. **Features** — must-have / nice-to-have / differentiator\n3. **UX** — friction, onboarding, learning curve\n4. **Competitive Positioning** — vs alternatives\n5. **Missing Features** — user expectations\n6. **Growth Levers** — 2-3 suggestions\n\nContent:\n' },
    { id: 'meeting-extract', name: 'Meeting Notes → Action Items', content: 'Extract structured info from this meeting/discussion.\n\n1. **Summary** — 3-5 bullet points\n2. **Decisions** — who decided what\n3. **Action Items** — [Owner] [Task] [Deadline]\n4. **Open Questions** — unresolved\n5. **Key Quotes** — important verbatim statements\n6. **Next Steps**\n\nContent:\n' },
    { id: 'data-insight', name: 'Data Insight Extraction', content: 'Analyze the data/charts/tables on this page.\n\n1. **Data Summary** — structured table\n2. **Patterns** — trends, outliers, correlations\n3. **Statistical Significance** — meaningful vs noise\n4. **So What?** — business decisions this informs\n5. **Data Quality** — missing values, bias\n6. **Follow-up** — recommended deeper analysis\n\nContent:\n' }
  ],

  ja: [
    { id: 'devops-root-cause', name: 'DevOps 根本原因分析', content: 'シニアSREとして行動してください。症状ではなく根本原因を特定してください。\n\n1. **障害概要**\n2. **想定される原因** — 3-5個\n3. **根本原因** —\n<root_cause>[証拠に基づく最も可能性の高い原因]</root_cause>\n4. **検証手順** — 2-3個の確認方法\n5. **修正案** — 回避策ではなく直接的な修正\n\n障害の詳細:\n' },
    { id: 'code-review', name: 'コードレビュー', content: 'シニアエンジニアとしてコードレビューを実施してください。\n\n1. **概要** — このコードは何をするか？\n2. **バグ** — ロジックエラー、競合状態、null参照\n3. **セキュリティ** — インジェクション、XSS、機密漏洩\n4. **パフォーマンス** — 不要なアロケーション、O(n²)\n5. **可読性** — 命名、構造、デッドコード\n6. **改善案** — 優先順位付きの具体例\n\nコード:\n' },
    { id: 'tech-explainer', name: '技術解説', content: 'このページの技術的内容を一般の読者にもわかりやすく説明してください。\n\n1. **一行要約**\n2. **主要概念** — 専門用語を定義\n3. **仕組み** — ステップごとに、例え話を交えて\n4. **重要性** — 実用的な意義\n5. **限界** — ページに書かれていないこと\n\n内容:\n' },
    { id: 'security-audit', name: 'セキュリティ監査', content: 'OWASP Top 10、CWEに基づくセキュリティレビュー。\n\n1. **攻撃対象面** — 何が公開されているか\n2. **脆弱性** — 深刻度、CWE ID、証拠\n3. **悪用シナリオ** — 各脆弱性の悪用方法\n4. **対策** — 具体的な修正\n5. **コンプライアンス** — 関連規格\n\n内容:\n' },
    { id: 'legal-analysis', name: '法的文書分析', content: 'この法的文書（契約、利用規約、ポリシー）を分析してください。\n\n1. **文書の種類と管轄**\n2. **重要条項** — 5-8の主要条項を平易な言葉で\n3. **権利と義務** — 各当事者ができること/すべきこと/できないこと\n4. **リスク** — 片務的または異常な条項（高/中/低）\n5. **曖昧な表現** — 複数の解釈が可能な箇所\n6. **平易な要約**\n\n注意：分析のみであり、法的助言ではありません。\n\n文書:\n' },
    { id: 'legal-compare', name: '契約条項比較', content: 'この条項を業界標準と比較してください。\n\n1. **標準的 vs 非標準的**な条項\n2. **欠落している保護** — 責任制限、知的財産、データ保護\n3. **交渉ポイント** — 上位3-5項目、推奨文言付き\n4. **期限・通知要件**\n\n注意：参考情報のみ。\n\n内容:\n' },
    { id: 'financial-analysis', name: '財務分析', content: 'このページの財務データを分析してください。\n\n1. **主要指標** — 売上、利益率、成長率（表形式）\n2. **トレンド** — 前年比/前期比\n3. **注意事項** — 異常項目、会計変更\n4. **競合比較** — 業界ベンチマーク対比\n5. **投資見通し** — 強気 vs 弱気\n6. **不足データ** — 追加で必要な情報\n\n免責：投資助言ではありません。\n\n内容:\n' },
    { id: 'business-strategy', name: '経営戦略ブリーフ', content: '経営コンサルタントとして分析してください。\n\n1. **状況** — 市場背景、課題\n2. **主要インサイト** — 3-5の重要な洞察\n3. **選択肢** — 2-3の戦略案、長所/短所\n4. **推奨案** — どれをなぜ\n5. **実行計画** — 最初の3ステップ\n6. **リスク** — 起こりうる問題\n\n内容:\n' },
    { id: 'news-factcheck', name: 'ニュース ファクトチェック', content: 'この記事の正確性とバイアスを検証してください。\n\n1. **主な主張** — すべての事実主張をリスト\n2. **情報源の質** — 実名、匿名、一次/二次ソース\n3. **バイアス指標** — 偏った表現、欠落した文脈\n4. **欠落した視点** — 不在の意見\n5. **検証可能/不可能** な主張\n6. **信頼性評価** — 高/中/低\n\n記事:\n' },
    { id: 'research-critique', name: '論文査読', content: 'この研究内容を査読してください。\n\n1. **研究課題** — 明確か？\n2. **方法論** — 適切か？サンプルサイズ？\n3. **結果** — 実際の発見 vs 主張\n4. **限界** — 交絡因子、バイアス\n5. **重要性** — 効果量は意味があるか？\n6. **再現性** — 再現に十分な詳細があるか？\n\n内容:\n' },
    { id: 'copywriting-audit', name: 'コピーライティング監査', content: 'このページのコミュニケーション効果を監査してください。\n\n1. **メッセージの明確さ** — 核心を一文で\n2. **ターゲット適合性** — トーン/語彙の一致\n3. **構成** — 階層構造、スキャンのしやすさ\n4. **説得力** — CTA、メリット優先\n5. **弱点** — 専門用語、受動態、テキストの壁\n6. **書き直し案** — 3-5のビフォー/アフター\n\n内容:\n' },
    { id: 'translation-review', name: '翻訳レビュー (EN↔JA)', content: 'このページの内容を英語と日本語間で翻訳・レビューしてください。\n\n1. **原文分析** — 用語、慣用句、レジスター\n2. **翻訳** — 意味とトーンを保持\n3. **ローカライズ** — 文化的適応\n4. **用語表** — 主要用語と推奨訳\n5. **品質フラグ** — 曖昧な文\n\n内容:\n' },
    { id: 'product-analysis', name: 'プロダクト分析', content: 'このプロダクトページ/機能ドキュメントを分析してください。\n\n1. **価値提案** — 誰のどんな問題を解決？\n2. **機能** — 必須/あれば良い/差別化要素\n3. **UX** — フリクション、オンボーディング\n4. **競合ポジショニング** — 代替品との比較\n5. **不足機能** — ユーザーの期待\n6. **成長レバー** — 2-3の提案\n\n内容:\n' },
    { id: 'meeting-extract', name: '議事録 → アクションアイテム', content: 'この会議/議論から構造化された情報を抽出してください。\n\n1. **要約** — 3-5の要点\n2. **決定事項** — 誰が何を決めたか\n3. **アクションアイテム** — [担当者] [タスク] [期限]\n4. **未解決の質問**\n5. **重要な発言** — 原文のまま\n6. **次のステップ**\n\n内容:\n' },
    { id: 'data-insight', name: 'データインサイト抽出', content: 'このページのデータ/チャート/表を分析してください。\n\n1. **データ概要** — 構造化された表\n2. **パターン** — トレンド、外れ値、相関\n3. **統計的有意性** — 意味のある差異かノイズか\n4. **示唆** — このデータが示すビジネス判断\n5. **データ品質** — 欠損値、バイアス\n6. **推奨分析** — 深掘りすべき方向\n\n内容:\n' }
  ],

  zh: [
    { id: 'devops-root-cause', name: 'DevOps 根因分析', content: '作为资深 SRE 工程师，识别根本原因而非表面症状。\n\n1. **故障概要**\n2. **可能的原因** — 3-5 个\n3. **根本原因** —\n<root_cause>[最可能的原因及证据]</root_cause>\n4. **验证步骤** — 2-3 个检查项\n5. **修复方案** — 直接修复，非变通方案\n\n故障详情:\n' },
    { id: 'code-review', name: '代码审查', content: '作为资深工程师进行代码审查。\n\n1. **概览** — 这段代码做什么？\n2. **Bug** — 逻辑错误、竞态条件、空指针\n3. **安全** — 注入、XSS、密钥泄露\n4. **性能** — 不必要的分配、O(n²)\n5. **可读性** — 命名、结构、死代码\n6. **改进建议** — 按优先级排列，附示例\n\n代码:\n' },
    { id: 'tech-explainer', name: '技术解读', content: '为普通读者解读此页面的技术内容。\n\n1. **一句话总结**\n2. **核心概念** — 解释专业术语\n3. **工作原理** — 分步说明，使用类比\n4. **为什么重要** — 实际意义\n5. **局限性** — 页面没说的\n\n内容:\n' },
    { id: 'security-audit', name: '安全审计', content: '按 OWASP Top 10、CWE 进行安全审查。\n\n1. **攻击面** — 暴露了什么？\n2. **漏洞** — 严重程度、CWE ID、证据\n3. **利用场景** — 如何被利用\n4. **修复** — 具体措施\n5. **合规** — 相关标准\n\n内容:\n' },
    { id: 'legal-analysis', name: '法律文件分析', content: '分析此法律文件（合同、条款、政策）。\n\n1. **文件类型与管辖权**\n2. **关键条款** — 5-8 项最重要的条款（用白话解释）\n3. **权利与义务** — 各方能做/必须做/不能做的\n4. **风险标记** — 不对等或异常条款（高/中/低）\n5. **模糊条款** — 可多重解读的语言\n6. **白话总结**\n\n注意：仅供分析参考，不构成法律建议。\n\n文件:\n' },
    { id: 'legal-compare', name: '合同条款对比', content: '将此页面条款与行业标准进行对比。\n\n1. **标准 vs 非标准**条款\n2. **缺失的保护** — 责任限制、知识产权、数据保护\n3. **谈判要点** — 前 3-5 项，附建议措辞\n4. **期限与通知要求**\n\n注意：仅供参考。\n\n内容:\n' },
    { id: 'financial-analysis', name: '财务分析', content: '分析此页面的财务数据。\n\n1. **关键指标** — 营收、利润率、增长率（表格形式）\n2. **趋势** — 同比/环比方向\n3. **风险信号** — 异常项目、会计变更\n4. **竞争对比** — 行业基准\n5. **投资逻辑** — 看多 vs 看空（各 2-3 句）\n6. **缺失数据** — 还需要什么？\n\n免责声明：不构成投资建议。\n\n内容:\n' },
    { id: 'business-strategy', name: '商业战略简报', content: '作为管理咨询师进行分析。\n\n1. **现状** — 市场背景、问题陈述\n2. **关键洞察** — 3-5 个非显而易见的观察\n3. **方案选项** — 2-3 个策略方案及利弊\n4. **建议** — 推荐哪个及原因\n5. **执行计划** — 前 3 个步骤\n6. **风险** — 可能出问题的地方\n\n内容:\n' },
    { id: 'news-factcheck', name: '新闻事实核查', content: '检验此文章的准确性与偏见。\n\n1. **核心论断** — 列出所有事实性主张\n2. **信源质量** — 实名、匿名、一手/二手来源\n3. **偏见指标** — 偏颇用语、遗漏的背景\n4. **缺失视角** — 缺席的观点\n5. **可验证/不可验证**的论断\n6. **可靠性评级** — 高/中/低\n\n文章:\n' },
    { id: 'research-critique', name: '论文评审', content: '对此页面的研究内容进行同行评审。\n\n1. **研究问题** — 是否明确？\n2. **方法论** — 是否合适？样本量？\n3. **发现** — 实际发现 vs 声称发现\n4. **局限性** — 混杂变量、偏差\n5. **显著性** — 效应量有意义吗？\n6. **可重复性** — 细节是否足够复现？\n\n内容:\n' },
    { id: 'copywriting-audit', name: '文案审计', content: '审计此页面的沟通效果。\n\n1. **信息清晰度** — 核心信息一句话概括\n2. **受众匹配** — 语气/词汇是否匹配目标人群\n3. **结构** — 层级、可扫描性\n4. **说服力** — CTA、先利后功能\n5. **薄弱环节** — 术语、被动语态、文字墙\n6. **改写建议** — 3-5 个改前/改后对比\n\n内容:\n' },
    { id: 'translation-review', name: '翻译审校 (EN↔ZH)', content: '在英文和中文之间翻译和审校此页面内容。\n\n1. **原文分析** — 术语、习语、语体\n2. **翻译** — 保留含义和语气\n3. **本地化注释** — 文化适配\n4. **术语表** — 关键词翻译对照\n5. **质量标记** — 有歧义的句子\n\n内容:\n' },
    { id: 'product-analysis', name: '产品分析', content: '分析此产品页面/功能文档/更新日志。\n\n1. **价值主张** — 解决谁的什么问题？\n2. **功能** — 必需/加分项/差异化\n3. **用户体验** — 摩擦点、上手难度\n4. **竞争定位** — 与替代方案对比\n5. **缺失功能** — 用户预期\n6. **增长杠杆** — 2-3 个建议\n\n内容:\n' },
    { id: 'meeting-extract', name: '会议纪要 → 待办事项', content: '从此会议/讨论中提取结构化信息。\n\n1. **摘要** — 3-5 个要点\n2. **已做决定** — 谁决定了什么\n3. **待办事项** — [负责人] [任务] [截止日期]\n4. **待解决问题**\n5. **关键原话** — 重要的原文引述\n6. **下一步**\n\n内容:\n' },
    { id: 'data-insight', name: '数据洞察提取', content: '分析此页面的数据/图表/表格。\n\n1. **数据概览** — 结构化表格\n2. **模式** — 趋势、异常值、相关性\n3. **统计显著性** — 有意义的差异还是噪声\n4. **意味着什么** — 这些数据应驱动哪些业务决策\n5. **数据质量** — 缺失值、偏差\n6. **后续分析** — 推荐深入方向\n\n内容:\n' }
  ]
};

// --- system prompt per language --------------------------------------------

var I18N_SYSTEM_PROMPT = {
  en: [
    '### Page Context',
    'Page title: \u3010\u5f53\u524d\u9875\u9762\u6807\u9898\u3011',
    'Core content: \u3010\u5f53\u524d\u9875\u9762\u6838\u5fc3\u6587\u672c\u3011',
    'Page timestamp: \u3010\u5f53\u524d\u9875\u9762\u65f6\u95f4\u6233\u3011',
    'Previous question: \u3010\u7528\u6237\u524d\u7f6e\u95ee\u9898\u3011',
    'Current time: \u3010\u5f53\u524d\u64cd\u4f5c\u65f6\u95f4\u3011',
    '',
    '### Rules',
    'You are a professional AI assistant for web page analysis. Follow these rules strictly:',
    '1. All answers must be grounded in the page content above. If no relevant info exists, state "No supporting page information" clearly.',
    '2. Extract core information first; keep answers concise. Preserve key technical terms with brief explanations.',
    '3. If uncertain, note "Based on page content extraction, for reference only." For professional domains (medical/legal/financial), advise user verification.',
    '',
    '### Task',
    'Complete the following task: {{\u7528\u6237\u81ea\u5b9a\u4e49\u4efb\u52a1}}',
    '',
    '### Output',
    'Use numbered lists (1. 2. 3.) for structure. Keep summaries under 300 words. Code/formulas on separate lines.'
  ].join('\n'),

  ja: [
    '### \u30da\u30fc\u30b8\u30b3\u30f3\u30c6\u30ad\u30b9\u30c8',
    '\u30da\u30fc\u30b8\u30bf\u30a4\u30c8\u30eb: \u3010\u5f53\u524d\u9875\u9762\u6807\u9898\u3011',
    '\u30b3\u30a2\u30b3\u30f3\u30c6\u30f3\u30c4: \u3010\u5f53\u524d\u9875\u9762\u6838\u5fc3\u6587\u672c\u3011',
    '\u30da\u30fc\u30b8\u30bf\u30a4\u30e0\u30b9\u30bf\u30f3\u30d7: \u3010\u5f53\u524d\u9875\u9762\u65f6\u95f4\u6233\u3011',
    '\u524d\u56de\u306e\u8cea\u554f: \u3010\u7528\u6237\u524d\u7f6e\u95ee\u9898\u3011',
    '\u73fe\u5728\u6642\u523b: \u3010\u5f53\u524d\u64cd\u4f5c\u65f6\u95f4\u3011',
    '',
    '### \u30eb\u30fc\u30eb',
    '\u3042\u306a\u305f\u306f\u30a6\u30a7\u30d6\u30da\u30fc\u30b8\u5206\u6790\u306e\u5c02\u9580AI\u30a2\u30b7\u30b9\u30bf\u30f3\u30c8\u3067\u3059\u3002\u4ee5\u4e0b\u306e\u30eb\u30fc\u30eb\u3092\u53b3\u5bc6\u306b\u5b88\u3063\u3066\u304f\u3060\u3055\u3044:',
    '1. \u3059\u3079\u3066\u306e\u56de\u7b54\u306f\u4e0a\u8a18\u306e\u30da\u30fc\u30b8\u30b3\u30f3\u30c6\u30f3\u30c4\u306b\u57fa\u3065\u304f\u3053\u3068\u3002\u95a2\u9023\u60c5\u5831\u304c\u306a\u3044\u5834\u5408\u306f\u300c\u30da\u30fc\u30b8\u306b\u95a2\u9023\u60c5\u5831\u306a\u3057\u300d\u3068\u660e\u8a18\u3002',
    '2. \u6838\u5fc3\u60c5\u5831\u3092\u512a\u5148\u7684\u306b\u62bd\u51fa\u3002\u5c02\u9580\u7528\u8a9e\u306f\u4fdd\u6301\u3057\u3064\u3064\u7c21\u6f54\u306b\u8aac\u660e\u3002',
    '3. \u4e0d\u78ba\u5b9f\u306a\u5834\u5408\u306f\u300c\u30da\u30fc\u30b8\u60c5\u5831\u306b\u57fa\u3065\u304f\u53c2\u8003\u60c5\u5831\u300d\u3068\u6ce8\u8a18\u3002\u5c02\u9580\u5206\u91ce\uff08\u533b\u7642/\u6cd5\u5f8b/\u91d1\u878d\uff09\u306f\u5c02\u9580\u5bb6\u3078\u306e\u78ba\u8a8d\u3092\u63a8\u5968\u3002',
    '',
    '### \u30bf\u30b9\u30af',
    '\u6b21\u306e\u30bf\u30b9\u30af\u3092\u5b9f\u884c: {{\u7528\u6237\u81ea\u5b9a\u4e49\u4efb\u52a1}}',
    '',
    '### \u51fa\u529b\u5f62\u5f0f',
    '\u756a\u53f7\u4ed8\u304d\u30ea\u30b9\u30c8\u3067\u69cb\u9020\u5316\u3002\u8981\u7d04\u306f300\u5b57\u4ee5\u5185\u3002\u30b3\u30fc\u30c9/\u6570\u5f0f\u306f\u5225\u884c\u3002'
  ].join('\n'),

  zh: [
    '### \u3010\u9875\u9762\u57fa\u7840\u4fe1\u606f\u951a\u5b9a\u3011',
    '\u9875\u9762\u6807\u9898\uff1a\u3010\u5f53\u524d\u9875\u9762\u6807\u9898\u3011',
    '\u6838\u5fc3\u5185\u5bb9\uff1a\u3010\u5f53\u524d\u9875\u9762\u6838\u5fc3\u6587\u672c\u3011',
    '\u9875\u9762\u65f6\u95f4\u6233\uff1a\u3010\u5f53\u524d\u9875\u9762\u65f6\u95f4\u6233\u3011',
    '\u7528\u6237\u524d\u7f6e\u95ee\u9898\uff1a\u3010\u7528\u6237\u524d\u7f6e\u95ee\u9898\u3011',
    '\u5f53\u524d\u64cd\u4f5c\u65f6\u95f4\uff1a\u3010\u5f53\u524d\u64cd\u4f5c\u65f6\u95f4\u3011',
    '',
    '### \u3010\u89d2\u8272+\u89c4\u5219\u7ea6\u675f\u3011',
    '\u4f60\u662f\u4e13\u4e1a\u7684\u7f51\u9875\u5185\u5bb9\u5206\u6790AI\u52a9\u624b\uff0c\u4e25\u683c\u9075\u5b88\u4ee5\u4e0b\u89c4\u5219\uff1a',
    '1. \u6240\u6709\u56de\u7b54\u5fc5\u987b\u57fa\u4e8e\u4e0a\u8ff0\u9875\u9762\u5185\u5bb9\uff0c\u65e0\u76f8\u5173\u4fe1\u606f\u65f6\u660e\u786e\u6807\u6ce8\u300c\u65e0\u9875\u9762\u76f8\u5173\u4fe1\u606f\u652f\u6491\u300d\u3002',
    '2. \u4f18\u5148\u63d0\u53d6\u6838\u5fc3\u4fe1\u606f\uff0c\u4fdd\u7559\u5173\u952e\u672f\u8bed\u5e76\u7b80\u8981\u89e3\u91ca\u3002',
    '3. \u82e5\u4e0d\u786e\u5b9a\uff0c\u6807\u6ce8\u300c\u57fa\u4e8e\u9875\u9762\u4fe1\u606f\u63d0\u70bc\uff0c\u4ec5\u4f9b\u53c2\u8003\u300d\u3002\u6d89\u53ca\u4e13\u4e1a\u9886\u57df\uff08\u533b\u7597/\u6cd5\u5f8b/\u91d1\u878d\uff09\u9700\u63d0\u793a\u7528\u6237\u6838\u5b9e\u3002',
    '',
    '### \u3010\u4efb\u52a1\u3011',
    '\u8bf7\u5b8c\u6210\u4ee5\u4e0b\u4efb\u52a1\uff1a{{\u7528\u6237\u81ea\u5b9a\u4e49\u4efb\u52a1}}',
    '',
    '### \u3010\u8f93\u51fa\u683c\u5f0f\u3011',
    '\u5206\u70b9\u6e05\u6670\uff08\u7528 1. 2. 3. \u7f16\u53f7\uff09\uff0c\u603b\u7ed3\u63a7\u5236\u5728300\u5b57\u5185\uff0c\u4ee3\u7801/\u516c\u5f0f\u5355\u72ec\u5206\u884c\u3002'
  ].join('\n')
};

// --- auto-summary prompt per language --------------------------------------

var I18N_AUTOSUM_PROMPT = {
  en: 'You are a content analyst. Summarize this webpage in English.\n\n'
    + '**Format:**\n'
    + '1. [Main Topic] — what is this page about?\n'
    + '2. [Key Point] — most important info\n'
    + '3. [Detail] — supporting info\n'
    + '4. [Implication] — why it matters\n'
    + '5. [Context] — additional details (optional)\n\n'
    + 'Keep under 200 words. Prioritize actionable insights.\n\n',

  ja: '\u30b3\u30f3\u30c6\u30f3\u30c4\u30a2\u30ca\u30ea\u30b9\u30c8\u3068\u3057\u3066\u3001\u3053\u306e\u30a6\u30a7\u30d6\u30da\u30fc\u30b8\u3092\u65e5\u672c\u8a9e\u3067\u8981\u7d04\u3057\u3066\u304f\u3060\u3055\u3044\u3002\n\n'
    + '**\u30d5\u30a9\u30fc\u30de\u30c3\u30c8:**\n'
    + '1. [\u4e3b\u984c] \u2014 \u3053\u306e\u30da\u30fc\u30b8\u306f\u4f55\u306b\u3064\u3044\u3066\uff1f\n'
    + '2. [\u91cd\u8981\u30dd\u30a4\u30f3\u30c8] \u2014 \u6700\u3082\u91cd\u8981\u306a\u60c5\u5831\n'
    + '3. [\u8a73\u7d30] \u2014 \u88dc\u8db3\u60c5\u5831\n'
    + '4. [\u610f\u5473] \u2014 \u306a\u305c\u91cd\u8981\u304b\n'
    + '5. [\u80cc\u666f] \u2014 \u8ffd\u52a0\u60c5\u5831\uff08\u4efb\u610f\uff09\n\n'
    + '200\u5b57\u4ee5\u5185\u3002\u5b9f\u7528\u7684\u306a\u30a4\u30f3\u30b5\u30a4\u30c8\u3092\u512a\u5148\u3002\n\n',

  zh: '\u4f5c\u4e3a\u5185\u5bb9\u5206\u6790\u5e08\uff0c\u7528\u4e2d\u6587\u6458\u8981\u6b64\u7f51\u9875\u3002\n\n'
    + '**\u683c\u5f0f:**\n'
    + '1. [\u4e3b\u9898] \u2014 \u8fd9\u4e2a\u9875\u9762\u8bb2\u4ec0\u4e48\uff1f\n'
    + '2. [\u6838\u5fc3\u8981\u70b9] \u2014 \u6700\u91cd\u8981\u7684\u4fe1\u606f\n'
    + '3. [\u8865\u5145\u7ec6\u8282] \u2014 \u652f\u6491\u4fe1\u606f\n'
    + '4. [\u610f\u4e49] \u2014 \u4e3a\u4ec0\u4e48\u91cd\u8981\n'
    + '5. [\u80cc\u666f] \u2014 \u989d\u5916\u7ec6\u8282\uff08\u53ef\u9009\uff09\n\n'
    + '\u63a7\u5236\u5728200\u5b57\u5185\u3002\u4f18\u5148\u63d0\u53d6\u53ef\u64cd\u4f5c\u7684\u6d1e\u5bdf\u3002\n\n'
};

// --- helpers ---------------------------------------------------------------

// get a UI string for the given language
function t(lang, key) {
  var strings = I18N_UI[lang] || I18N_UI[I18N_DEFAULT];
  return strings[key] || I18N_UI[I18N_DEFAULT][key] || key;
}

// get templates for the given language
function getTemplatesForLang(lang) {
  return I18N_TEMPLATES[lang] || I18N_TEMPLATES[I18N_DEFAULT];
}

// get system prompt for the given language
function getSystemPromptForLang(lang) {
  return I18N_SYSTEM_PROMPT[lang] || I18N_SYSTEM_PROMPT[I18N_DEFAULT];
}

// get auto-summary prompt prefix for the given language
function getAutoSumPromptForLang(lang) {
  return I18N_AUTOSUM_PROMPT[lang] || I18N_AUTOSUM_PROMPT[I18N_DEFAULT];
}

// apply font family to document based on language
function applyLangFont(lang) {
  var fontFamily = I18N_FONTS[lang] || I18N_FONTS[I18N_DEFAULT];
  document.documentElement.setAttribute('lang', lang);
  document.body.style.fontFamily = fontFamily;
}
