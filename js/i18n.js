/**
 * 多语言支持模块
 * 支持简体中文、繁体中文、英语、日语、韩语、法语和德语
 */

// 默认语言 (Default language - set to English)
let currentLanguage = 'en';

// 强制重置任何可能的缓存语言设置
// Force reset any potential cached language settings
if (window.sessionStorage) {
    sessionStorage.removeItem('userLanguage');
}
if (window.localStorage) {
    localStorage.removeItem('userLanguage');
}
// 确保使用英文作为默认语言
// Ensure English is used as default language
console.log('Forcing default language to English');

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
        siteNameGallery: '恋与深空 图库',
        siteNavDescription: '探索《恋与深空》的精彩瞬间',
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
        '生日': '生日',
        '七夕': '七夕',
        '樱花': '樱花',
        '烟花': '烟花',
        '春日': '春日',
        '拍立得': '拍立得',
        '人鱼': '人鱼',
        '手机': '手机',
        '婚礼': '婚礼'
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
        siteNameGallery: '戀與深空 圖庫',
        siteNavDescription: '探索《戀與深空》的精彩瞬間',
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
        '主线': '主線',
        '明日无处可逃': '明日無處可逃',
        '生日': '生日',
        '七夕': '七夕',
        '樱花': '樱花',
        '烟花': '煙花',
        '春日': '春日',
        '拍立得': '拍立得',
        '人鱼': '人鱼',
        '手机': '手機',
        '婚礼': '婚禮'
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
        siteNameGallery: 'Love and Deepspace Gallery',
        siteNavDescription: 'Explore the wonderful moments of Love and Deepspace',
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
        '生日': 'Birthday',
        '七夕': 'Qixi Festival',
        '樱花': 'Cherry Blossom',
        '烟花': 'Fireworks',
        '春日': 'Spring Day',
        '写真': 'Photo Collection',
        '动态': 'Animation',
        '拍立得': 'Polaroid',
        '人鱼': 'Mermaid',
        '手机': 'Mobile Wallpaper',
        '婚礼': 'Wedding'
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
        siteNameGallery: 'ラブアンドディープスペース ギャラリー',
        siteNavDescription: '『恋と深空』の素晴らしい瞬間を探索',
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
        '生日': '誕生日',
        '七夕': '七夕祭り',
        '樱花': '桜',
        '烟花': '花火',
        '春日': '春の日',
        '写真': 'フォトコレクション',
        '动态': 'アニメーション',
        '拍立得': 'ポラロイド',
        '人鱼': '人魚',
        '手机': 'スマホ壁紙',
        '婚礼': 'ウェディング'
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
        siteNameGallery: '러브 앤 딥스페이스 갤러리',
        siteNavDescription: '『러브앤딥스페이스』의 멋진 순간들을 탐험하세요',
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
        '七夕': '칠석절',
        '樱花': '뱀꽃',
        '烟花': '불꽃놀이',
        '春日': '봄날',
        '写真': '사진 모음',
        '动态': '애니메이션',
        '拍立得': '폴라로이드',
        '人鱼': '인어',
        '手机': '모바일 배경화면',
        '婚礼': '웨딩',
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
        siteNameGallery: 'Galerie Love and Deepspace',
        siteNavDescription: 'Explorez les moments merveilleux de Love and Deepspace',
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
        '明日无处可逃': 'Pas d\'\u00e9chappatoire demain',
        '生日': 'Anniversaire',
        '七夕': 'Festival Qixi',
        '樱花': 'Fleurs de cerisier',
        '烟花': 'Feux d\'artifice',
        '春日': 'Jour de printemps',
        '写真': 'Collection de photos',
        '动态': 'Animation',
        '拍立得': 'Polaroïd',
        '人鱼': 'Sirène',
        '手机': 'Fond d\'écran mobile',
        '婚礼': 'Mariage'
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
        siteNameGallery: 'Love and Deepspace Galerie',
        siteNavDescription: 'Entdecken Sie die wundervollen Momente von Love and Deepspace',
        // 角色名称
        Xaiver: 'Xaiver',
        Zayne: 'Zayne',
        Rafayel: 'Rafayel',
        Sylus: 'Sylus',
        Caleb: 'Caleb',
        // 标签
        '五星': '5-Sterne',
        '拍立得': 'Polaroid',
        '四星': '4-Sterne',
        '其他': 'Andere',
        '背景': 'Hintergrund',
        '主线': 'Hauptgeschichte',
        '明日无处可逃': 'Morgen kein Entkommen',
        '生日': 'Geburtstag',
        '七夕': 'Qixi-Fest',
        '樱花': 'Kirschblüte',
        '烟花': 'Feuerwerk',
        '春日': 'Frühlingstag',
        '写真': 'Fotosammlung',
        '动态': 'Animation',
        '人鱼': 'Meerjungfrau',
        '手机': 'Handy-Hintergrundbild',
        '婚礼': 'Hochzeit'
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
    // 翻译所有带 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = getTranslation(key);
    });
    
    // 翻译所有标签元素
    document.querySelectorAll('.tag').forEach(tagEl => {
        const originalTag = tagEl.getAttribute('data-tag-orig');
        if (originalTag) {
            const tagTextEl = tagEl.querySelector('.tag-text');
            if (tagTextEl) {
                tagTextEl.textContent = translateTag(originalTag);
            }
        }
    });
    
    // 翻译模态框中的标签
    const modalTagsContainer = document.getElementById('modal-tags');
    if (modalTagsContainer) {
        const tagSpans = modalTagsContainer.querySelectorAll('span');
        tagSpans.forEach(span => {
            const originalTag = span.getAttribute('data-original-tag');
            if (originalTag) {
                span.textContent = translateTag(originalTag);
            }
        });
    }
    
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
    document.querySelectorAll('span.tag-text[data-i18n-tag]').forEach(tagTextEl => {
        const originalTagKey = tagTextEl.getAttribute('data-i18n-tag');
        if (originalTagKey) {
            tagTextEl.textContent = translateTag(originalTagKey);
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
    // 强制设置英文作为默认语言，忽略所有其他设置
    // Force English as default language, ignore all other settings
    currentLanguage = 'en';
    console.log('initLanguageSelector: Setting default language to English');
    
    // 清除可能存在的缓存
    // Clear any potential caches
    try {
        if (window.localStorage) localStorage.removeItem('userLanguage');
        if (window.sessionStorage) sessionStorage.removeItem('userLanguage');
        if (document.cookie.indexOf('lang=') >= 0) {
            document.cookie = 'lang=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
    } catch (e) {
        console.error('Error clearing language cache:', e);
    }
    
    // 设置语言选择器点击事件
    // Set up language selector click events
    document.querySelectorAll('#language-dropdown a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Language link clicked:', this.getAttribute('data-lang')); // Debug log
            currentLanguage = this.getAttribute('data-lang');
            document.documentElement.lang = currentLanguage; // Set lang attribute
            updatePageTranslations();
            
            // 更新当前语言显示
            // Update current language display
            document.querySelector('#language-selector span').textContent = getTranslation('currentLang');
        });
    });
    
    // 强制更新翻译为英文
    // Force update translations to English
    updatePageTranslations();
    console.log('Translations updated to:', currentLanguage);
    
    // 强制设置语言选择器显示为英文
    // Force language selector to show English
    const langSelector = document.querySelector('#language-selector span');
    if (langSelector) {
        langSelector.textContent = languages['en']['currentLang'];
        console.log('Language selector text set to English');
    }
}

// 强制立即设置语言为英文，而不等待DOM加载
// Immediately set language to English, don't wait for DOM loading
(function() {
    currentLanguage = 'en';
    document.documentElement.lang = currentLanguage; // Set lang attribute
    console.log('Immediately setting language to English');
})();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // Force language to English before initialization
    currentLanguage = 'en';
    document.documentElement.lang = currentLanguage; // Set lang attribute
    // Then initialize selector
    initLanguageSelector();
    // Then apply translations
    updatePageTranslations();
    console.log('Final language check: Current language is', currentLanguage);
});
