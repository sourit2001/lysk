/**
 * 多语言支持模块
 * 支持简体中文、繁体中文、英语、日语、韩语、法语和德语
 */

// 默认语言
let currentLanguage = 'zh-CN';

// 语言数据
const languages = {
    'zh-CN': {
        siteName: '恋与深空',
        filterTitle: '标签筛选',
        characterTag: '人物',
        starLevelTag: '卡面星级',
        otherTag: '其他分类',
        clearFilters: '清除筛选',
        noResults: '没有找到符合条件的图片',
        loading: '正在加载图片，请稍候...',
        imageDimensions: '图片尺寸',
        dimensionsLabel: '尺寸:',
        unknown: '未知',
        noTagsLabel: '无标签',
        prevPage: '上一页',
        nextPage: '下一页',
        pageInfo: '第 {currentPage} 页 / 共 {totalPages} 页',
        imageTags: '标签',
        downloadImage: '下载图片',
        currentLang: '中文简体',
        // 角色名称
        Xaiver: '沈星回',
        Zayne: '黎深',
        Rafayel: '祁煜',
        Sylus: '秦彻',
        Caleb: '夏以昼',
        // 标签
        '五星': '五星',
        '四星': '四星',
        '其他': '其他',
        '背景': '背景',
        '主线': '主线',
        '明日无处可逃': '明日无处可逃',
        '生日': '生日'
    },
    'zh-TW': {
        siteName: '戀與深空',
        filterTitle: '標籤篩選',
        characterTag: '人物',
        starLevelTag: '卡面星級',
        otherTag: '其他分類',
        clearFilters: '清除篩選',
        noResults: '沒有找到符合條件的圖片',
        loading: '正在加載圖片，請稍候...',
        imageDimensions: '圖片尺寸',
        dimensionsLabel: '尺寸:',
        unknown: '未知',
        noTagsLabel: '無標籤',
        prevPage: '上一頁',
        nextPage: '下一頁',
        pageInfo: '第 {currentPage} 頁 / 共 {totalPages} 頁',
        imageTags: '標籤',
        downloadImage: '下載圖片',
        currentLang: '中文繁體',
        // 角色名称
        Xaiver: '沈星回',
        Zayne: '黎深',
        Rafayel: '祁煜',
        Sylus: '秦徹',
        Caleb: '夏以晝',
        // 标签
        '五星': '五星',
        '四星': '四星',
        '其他': '其他',
        '背景': '背景',
        '主线': '主線',
        '明日无处可逃': '明日無處可逃',
        '生日': '生日'
    },
    'en': {
        siteName: 'Love and Deepspace',
        filterTitle: 'Filter by Tags',
        characterTag: 'Characters',
        starLevelTag: 'Card Star Level',
        otherTag: 'Other Categories',
        clearFilters: 'Clear Filters',
        noResults: 'No images found matching your criteria',
        loading: 'Loading images, please wait...',
        imageDimensions: 'Dimensions',
        imageTags: 'Tags',
        downloadImage: 'Download Image',
        currentLang: 'English',
        // 角色名称
        Xaiver: 'Xaiver',
        Zayne: 'Zayne',
        Rafayel: 'Rafayel',
        Sylus: 'Sylus',
        Caleb: 'Caleb',
        // 标签
        '五星': '5-Star',
        '四星': '4-Star',
        '其他': 'Others',
        '背景': 'Background',
        '主线': 'Main Story',
        '明日无处可逃': 'No Escape Tomorrow',
        '生日': 'Birthday'
    },
    'ja': {
        siteName: 'ラブアンドディープスペース',
        filterTitle: 'タグでフィルター',
        characterTag: 'キャラクター',
        starLevelTag: 'カードの星レベル',
        otherTag: 'その他のカテゴリ',
        clearFilters: 'フィルターをクリア',
        noResults: '条件に一致する画像が見つかりません',
        loading: '画像を読み込んでいます...',
        imageDimensions: '画像サイズ',
        dimensionsLabel: 'サイズ:',
        unknown: '不明',
        noTagsLabel: 'タグなし',
        prevPage: '前へ',
        nextPage: '次へ',
        pageInfo: '{currentPage} / {totalPages} ページ',
        imageTags: 'タグ',
        downloadImage: '画像をダウンロード',
        currentLang: '日本語',
        // 角色名称
        Xaiver: 'シェン・シンフイ',
        Zayne: 'リー・シェン',
        Rafayel: 'チー・ユー',
        Sylus: 'チン・チェ',
        Caleb: 'シア・イチョウ',
        // 标签
        '五星': '五つ星',
        '四星': '四つ星',
        '其他': 'その他',
        '背景': '背景',
        '主线': 'メインストーリー',
        '明日无处可逃': '明日逃げ場なし',
        '生日': '誕生日'
    },
    'ko': {
        siteName: '러브 앤 딥스페이스',
        filterTitle: '태그로 필터링',
        characterTag: '캐릭터',
        starLevelTag: '카드 별 등급',
        otherTag: '기타 카테고리',
        clearFilters: '필터 지우기',
        noResults: '조건에 맞는 이미지를 찾을 수 없습니다',
        loading: '이미지 로딩 중...',
        imageDimensions: '이미지 크기',
        dimensionsLabel: '크기:',
        unknown: '알 수 없음',
        noTagsLabel: '태그 없음',
        prevPage: '이전',
        nextPage: '다음',
        pageInfo: '{totalPages} 중 {currentPage} 페이지',
        imageTags: '태그',
        downloadImage: '이미지 다운로드',
        currentLang: '한국어',
        // 角色名称
        Xaiver: '선성회',
        Zayne: '여심',
        Rafayel: '기욱',
        Sylus: '진철',
        Caleb: '하이주',
        // 标签
        '五星': '5성',
        '四星': '4성',
        '其他': '기타',
        '背景': '배경',
        '主线': '메인 스토리',
        '明日无处可逃': '내일 도망갈 곳 없음',
        '生日': '생일',
        // 分页控件
        prevPageLabel: '이전',
        nextPageLabel: '다음',
        pageInfoLabel: '{totalPages} 중 {currentPage} 페이지'
    },
    'fr': {
        siteName: 'Amour et Espace Profond',
        filterTitle: 'Filtrer par tags',
        characterTag: 'Personnages',
        starLevelTag: 'Niveau d\'étoiles des cartes',
        otherTag: 'Autres catégories',
        clearFilters: 'Effacer les filtres',
        noResults: 'Aucune image correspondant à vos critères',
        loading: 'Chargement des images, veuillez patienter...',
        imageDimensions: 'Dimensions',
        imageTags: 'Tags',
        downloadImage: 'Télécharger l\'image',
        currentLang: 'Français',
        // 角色名称
        Xaiver: 'Xaiver',
        Zayne: 'Zayne',
        Rafayel: 'Rafayel',
        Sylus: 'Sylus',
        Caleb: 'Caleb',
        // 标签
        '五星': '5 étoiles',
        '四星': '4 étoiles',
        '其他': 'Autres',
        '背景': 'Arrière-plan',
        '主线': 'Histoire principale',
        '明日无处可逃': 'Pas d\'échappatoire demain',
        '生日': 'Anniversaire',
        // 分页控件
        prevPageLabel: 'Précédent',
        nextPageLabel: 'Suivant',
        pageInfoLabel: 'Page {currentPage} sur {totalPages}'
    },
    'de': {
        siteName: 'Liebe und Tiefer Raum',
        filterTitle: 'Nach Tags filtern',
        characterTag: 'Charaktere',
        starLevelTag: 'Karten-Sterne-Level',
        otherTag: 'Andere Kategorien',
        clearFilters: 'Filter löschen',
        noResults: 'Keine Bilder entsprechen Ihren Kriterien',
        loading: 'Bilder werden geladen, bitte warten...',
        imageDimensions: 'Bildabmessungen',
        dimensionsLabel: 'Abmessungen:',
        unknown: 'Unbekannt',
        noTagsLabel: 'Keine Tags',
        prevPage: 'Zurück',
        nextPage: 'Weiter',
        pageInfo: 'Seite {currentPage} von {totalPages}',
        imageTags: 'Tags',
        downloadImage: 'Bild herunterladen',
        currentLang: 'Deutsch',
        // 角色名称
        Xaiver: 'Xaiver',
        Zayne: 'Zayne',
        Rafayel: 'Rafayel',
        Sylus: 'Sylus',
        Caleb: 'Caleb',
        // 标签
        '五星': '5-Sterne',
        '四星': '4-Sterne',
        '其他': 'Andere',
        '背景': 'Hintergrund',
        '主线': 'Hauptgeschichte',
        '明日无处可逃': 'Morgen kein Entkommen',
        '生日': 'Geburtstag'
    }
};

// 获取翻译文本
function getTranslation(key) {
    if (languages[currentLanguage] && languages[currentLanguage][key]) {
        return languages[currentLanguage][key];
    }
    // 回退到中文
    if (languages['zh-CN'] && languages['zh-CN'][key]) {
        return languages['zh-CN'][key];
    }
    // 如果都没有，返回原始键值
    return key;
}

// 翻译标签名
function translateTag(tag) {
    return getTranslation(tag) || tag;
}

// 更新页面上的所有翻译内容
function updatePageTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = getTranslation(key);
    });
    
    // 更新标签名称
    updateTagTranslations();
    
    // 更新模态框中的内容
    if (document.getElementById('modal-title').textContent) {
        // 如果模态框是打开的，更新其内容
        updateModalTranslations();
    }
}

// 更新标签翻译
function updateTagTranslations() {
    // 更新标签显示
    document.querySelectorAll('[data-tag-orig]').forEach(el => {
        const originalTag = el.getAttribute('data-tag-orig');
        const tagText = el.querySelector('.tag-text');
        if (tagText) {
            tagText.textContent = translateTag(originalTag);
        }
    });
}

// 更新模态框翻译
function updateModalTranslations() {
    const tagsEl = document.getElementById('modal-tags');
    if (tagsEl && tagsEl.getAttribute('data-original-tags')) {
        const tags = tagsEl.getAttribute('data-original-tags').split(',');
        tagsEl.textContent = tags.map(tag => translateTag(tag.trim())).join(', ');
    }
}

// 初始化语言选择器
function initLanguageSelector() {
    // 获取浏览器语言
    const browserLang = navigator.language || navigator.userLanguage;
    
    // 设置初始语言（如果支持浏览器语言则使用，否则默认中文）
    if (languages[browserLang]) {
        currentLanguage = browserLang;
    } else if (browserLang.startsWith('zh')) {
        currentLanguage = browserLang.includes('TW') || browserLang.includes('HK') ? 'zh-TW' : 'zh-CN';
    }
    
    // 设置语言选择器点击事件
    document.querySelectorAll('#language-dropdown a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Language link clicked:', this.getAttribute('data-lang')); // Debug log
            currentLanguage = this.getAttribute('data-lang');
            updatePageTranslations();
            
            // 更新当前语言显示
            document.querySelector('#language-selector span').textContent = getTranslation('currentLang');
            
            // Dropdown will hide naturally when mouse leaves the group due to Tailwind's group-hover
        });
    });
    
    // 初始更新翻译
    updatePageTranslations();

    // Ensure dropdown is hidden initially (Tailwind's group-hover should handle this)
    // It's generally better to rely on CSS for initial state if possible.
    // const dropdown = document.getElementById('language-dropdown');
    // if (dropdown) {
    //     dropdown.classList.add('hidden'); 
    // }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initLanguageSelector);
