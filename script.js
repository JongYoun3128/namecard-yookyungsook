// DOM 요소
const elements = {
    themeToggle: document.getElementById("themeToggle"),
    styleBtn: document.getElementById("styleBtn"),
    homeBtn: document.getElementById("homeBtn"),
    saveContact: document.getElementById("saveContact"),
    shareBtn: document.getElementById("shareBtn"),
    qrBtn: document.getElementById("qrBtn"),
    profileImg: document.getElementById("profileImg"),
    editProfileBtn: document.getElementById("editProfileBtn"),

    shareModal: document.getElementById("shareModal"),
    styleModal: document.getElementById("styleModal"),
    closeShareModal: document.getElementById("closeShareModal"),
    closeStyleModal: document.getElementById("closeStyleModal"),

    qrSection: document.getElementById("qrSection"),
    shareUrl: document.getElementById("shareUrl"),
    copyUrlBtn: document.getElementById("copyUrlBtn"),
};

// 초기화
document.addEventListener("DOMContentLoaded", () => {
    initTheme();

    initEventListeners();
    console.log("✨ 디지털 명함이 준비되었습니다!");
});

// 테마 초기화
function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    const savedStyle = localStorage.getItem("style");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // 저장된 스타일이 있으면 적용, 없으면 기본 스타일 적용
    if (savedStyle) {
        document.body.className = savedStyle;
        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
        }
    } else if (
        CARD_CONFIG &&
        CARD_CONFIG.theme &&
        CARD_CONFIG.theme.defaultStyle
    ) {
        // config.js의 기본 스타일 적용
        document.body.classList.add(`style-${CARD_CONFIG.theme.defaultStyle}`);
    }
}

// 이벤트 리스너 초기화
function initEventListeners() {
    // 테마 토글
    elements.themeToggle.addEventListener("click", toggleTheme);

    // 스타일 선택 모달
    elements.styleBtn.addEventListener("click", () => openModal("styleModal"));
    elements.closeStyleModal.addEventListener("click", () =>
        closeModal("styleModal")
    );

    // 연락처 저장
    elements.saveContact.addEventListener("click", saveContactToDevice);

    // 공유 모달
    elements.shareBtn.addEventListener("click", () => openModal("shareModal"));
    elements.closeShareModal.addEventListener("click", () =>
        closeModal("shareModal")
    );

    // QR 코드 표시
    elements.qrBtn.addEventListener("click", scrollToQR);

    // URL 복사
    elements.copyUrlBtn.addEventListener("click", copyUrlToClipboard);
    document.getElementById("copyLink");

    // 공유 옵션들
    document
        .getElementById("shareKakao")
        .addEventListener("click", () => shareVia("kakao"));
    document
        .getElementById("shareFacebook")
        .addEventListener("click", () => shareVia("facebook"));

    document
        .getElementById("shareBand")
        .addEventListener("click", () => shareVia("band"));
    document
        .getElementById("shareEmail")
        .addEventListener("click", () => shareVia("email"));

    // 스타일 선택
    document.querySelectorAll(".style-option").forEach((option) => {
        option.addEventListener("click", function () {
            const style = this.dataset.style;
            changeStyle(style);
        });
    });

    // 모달 외부 클릭시 닫기
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            e.target.classList.remove("active");
        }
    });
}

// 테마 토글
function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem("theme", "dark");
    } else {
        elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem("theme", "light");
    }
}

// 스타일 변경
function changeStyle(style) {
    const darkMode = document.body.classList.contains("dark-mode");
    document.body.className = `style-${style}`;
    if (darkMode) {
        document.body.classList.add("dark-mode");
    }
    localStorage.setItem("style", document.body.className);

    // 활성 스타일 표시
    document.querySelectorAll(".style-option").forEach((opt) => {
        opt.classList.remove("active");
    });
    document.querySelector(`[data-style="${style}"]`).classList.add("active");

    showNotification("스타일이 변경되었습니다! 🎨");
    setTimeout(() => closeModal("styleModal"), 500);
}

// 연락처 저장 (vCard)
function saveContactToDevice() {
    const vCard =
        typeof generateVCard === "function"
            ? generateVCard()
            : `BEGIN:VCARD
VERSION:3.0
FN:홍길동
TITLE:대표이사 / CEO
ORG:(주)테크이노베이션
TEL;TYPE=CELL:010-1234-5678
TEL;TYPE=WORK:02-1234-5678
TEL;TYPE=FAX:02-1234-5679
EMAIL:ceo@company.com
ADR;TYPE=WORK:;;서울특별시 강남구 테헤란로 123, ABC타워 10층;;;한국
URL:www.company.com
NOTE:혁신적인 기술로 더 나은 미래를 만들어갑니다.
END:VCARD`;

    const blob = new Blob([vCard], { type: "text/vcard;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const name = CARD_CONFIG ? CARD_CONFIG.personal.name : "명함";
    link.download = `${name}_명함.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showNotification("연락처가 저장되었습니다! 📱");
}

// QR 코드로 스크롤
function scrollToQR() {
    elements.qrSection.scrollIntoView({ behavior: "smooth", block: "center" });
    showNotification("QR 코드를 스캔해보세요! 📸");
}

// 프로필 이미지 변경
function changeProfileImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                elements.profileImg.src = event.target.result;
                localStorage.setItem("profileImage", event.target.result);
                showNotification("프로필 사진이 변경되었습니다! 📸");
            };
            reader.readAsDataURL(file);
        }
    };

    input.click();
}

// URL 복사
function copyUrlToClipboard() {
    const url = elements.shareUrl.value;

    navigator.clipboard
        .writeText(url)
        .then(() => {
            showNotification("링크가 복사되었습니다! 📋");
        })
        .catch(() => {
            // 폴백 방식
            elements.shareUrl.select();
            document.execCommand("copy");
            showNotification("링크가 복사되었습니다! 📋");
        });
}

// 공유 기능
function shareVia(platform) {
    const shareUrl = CARD_CONFIG ? CARD_CONFIG.share.url : window.location.href;
    const shareTitle = CARD_CONFIG ? CARD_CONFIG.share.title : "디지털 명함";
    const shareText = CARD_CONFIG
        ? CARD_CONFIG.share.description
        : "안녕하세요! 제 명함을 공유합니다.";

    const url = encodeURIComponent(shareUrl);
    const title = encodeURIComponent(shareTitle);
    const text = encodeURIComponent(shareText);

    const shareUrls = {
        kakao: `https://story.kakao.com/share?url=${url}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        line: `https://social-plugins.line.me/lineit/share?url=${url}`,
        band: `https://band.us/plugin/share?body=${text}&route=${url}`,
        email: `mailto:?subject=${title}&body=${text}%0A%0A${url}`,
        sms: `sms:?body=${text}%20${url}`,
    };

    if (shareUrls[platform]) {
        window.open(shareUrls[platform], "_blank", "width=600,height=400");
        showNotification(`${platform}로 공유합니다! 📤`);
    }
}

// 모달 열기
function openModal(modalId) {
    document.getElementById(modalId).classList.add("active");
}

// 모달 닫기
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
}

// 알림 표시
function showNotification(message, duration = 3000) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = "slideOutRight 0.3s ease";
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, duration);
}

// // PWA 홈 화면 추가 안내
// if (window.matchMedia("(display-mode: standalone)").matches) {
//     console.log("✅ PWA 모드로 실행 중입니다!");
// } else {
//     // 홈 화면 추가 안내 (iOS Safari)
//     const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
//     if (isIOS) {
//         setTimeout(() => {
//             const addToHome = confirm(
//                 '홈 화면에 추가하시면 앱처럼 사용할 수 있습니다.\n\n공유 버튼 → "홈 화면에 추가"를 선택하세요.'
//             );
//         }, 5000);
//     }
// }

// 연락처 항목 클릭시 진동 피드백 (모바일)
document.querySelectorAll(".contact-item").forEach((item) => {
    item.addEventListener("click", () => {
        if ("vibrate" in navigator) {
            navigator.vibrate(50);
        }
    });
});

// 스크롤 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll(".contact-item, .social-link, .btn").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
});

// 서비스 워커 등록 (PWA)
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        // 서비스 워커는 추후 추가 가능
        console.log("📱 PWA 준비 완료");
    });
}
