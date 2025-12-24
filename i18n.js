let translations = {};

// "profile.name" 같은 키를 객체에서 찾아주는 함수
function getValue(obj, key) {
    return key.split(".").reduce((o, k) => (o ? o[k] : null), obj);
}

// 실제로 화면에 언어 적용
function applyLanguage(lang) {
    const data = translations[lang];
    if (!data) return;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n;
        const value = getValue(data, key);
        if (value) el.innerText = value;
    });

    localStorage.setItem("lang", lang);
    setActiveFlag(lang);
}

// 국기 클릭용 함수
function changeLang(lang) {
    applyLanguage(lang);
}

// 페이지 로드 시 1번만 JSON 로드
document.addEventListener("DOMContentLoaded", () => {
    fetch("./locales/translations.json")
        .then((res) => res.json())
        .then((data) => {
            translations = data;
            const savedLang = localStorage.getItem("lang") || "ko";
            applyLanguage(savedLang);
        })
        .catch(() => {
            console.error("translations.json 파일을 불러올 수 없습니다.");
        });
});

// 선택된 국기 표시
function setActiveFlag(lang) {
    document.querySelectorAll(".lang-flags button").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });
}
