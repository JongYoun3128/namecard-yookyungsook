// 전자명함 설정 파일
// 이 파일을 수정하여 명함 정보를 간편하게 변경할 수 있습니다.

const CARD_CONFIG = {
    // 기본 정보
    personal: {
        name: "유경숙",
        title: "지사장",
        company: " POINTGROUND",
        profileImage: "https://via.placeholder.com/150", // 또는 로컬 이미지 경로
        coverImage: "", // 커버 이미지 URL (선택사항)
    },

    // 연락처
    contact: {
        mobile: "010-8407-8428",
        company: "02-1811-8428",
        website: "pointground.co.kr",
        email: "officecine01@gmail.com",
        address: "서울특별시 금천구 벚꽃로 286 삼성리더스타워 1101호",
        fax: "",
    },

    // 소셜 미디어 (사용하지 않는 항목은 url을 빈 문자열로 설정)
    social: {
        facebook: "",
        instagram: "",
        linkedin: "",
        twitter: "",
        youtube: "",
        blog: "",
    },

    // 스타일 설정
    theme: {
        defaultStyle: "professional", // default, modern, minimal, gradient, professional, creative
        primaryColor: "#1e40af",
        secondaryColor: "#3b82f6",
    },

    // 공유 설정
    share: {
        title: "손가비 회장 - 포인트그라운드",
        description: "포인트그라운드 손가비 회장의 디지털 명함입니다.",
        url: "https://jongyoun3128.github.io/namecard-yookyungsook/", // 실제 배포 URL로 변경
    },
};

// 설정을 HTML에 적용하는 함수
function applyConfig() {
    // // 기본 정보
    // document.querySelector(".name").textContent = CARD_CONFIG.personal.name;
    // document.querySelector(".title").textContent = CARD_CONFIG.personal.title;
    // document.querySelector(
    //     ".company"
    // ).innerHTML = ` ${CARD_CONFIG.personal.company}`;

    // // 연락처
    // const contactItems = document.querySelectorAll(".contact-item");
    // contactItems[0].querySelector(".contact-value").textContent =
    //     CARD_CONFIG.contact.mobile;
    // contactItems[0].setAttribute(
    //     "onclick",
    //     `window.location.href='tel:${CARD_CONFIG.contact.mobile}'`
    // );

    // contactItems[1].querySelector(".contact-value").textContent =
    //     CARD_CONFIG.contact.email;
    // contactItems[1].setAttribute(
    //     "onclick",
    //     `window.location.href='mailto:${CARD_CONFIG.contact.email}'`
    // );

    // contactItems[2].querySelector(".contact-value").textContent =
    //     CARD_CONFIG.contact.company;

    // 팩스가 없으면 숨기기
    // if (CARD_CONFIG.contact.fax && CARD_CONFIG.contact.fax !== "") {
    //     contactItems[3].querySelector(".contact-value").textContent =
    //         CARD_CONFIG.contact.fax;
    //     contactItems[3].style.display = "flex";
    // } else {
    //     contactItems[3].style.display = "none";
    // }

    // contactItems[4].querySelector(".contact-value").textContent =
    //     CARD_CONFIG.contact.address;
    // contactItems[5].querySelector(".contact-value").textContent =
    //     CARD_CONFIG.contact.website;

    // 공유 URL
    document.getElementById("shareUrl").value = CARD_CONFIG.share.url;
}

// vCard 생성 함수
function generateVCard() {
    const config = CARD_CONFIG;
    let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${config.personal.name}
TITLE:${config.personal.title}
ORG:${config.personal.company}
TEL;TYPE=CELL:${config.contact.mobile}
TEL;TYPE=WORK:${config.contact.company}`;

    // 팩스가 있을 경우만 추가
    if (config.contact.fax && config.contact.fax !== "") {
        vcard += `
TEL;TYPE=FAX:${config.contact.fax}`;
    }

    vcard += `
EMAIL:${config.contact.email}
ADR;TYPE=WORK:;;${config.contact.address};;;한국
URL:${config.contact.website}
NOTE:${config.contact.mobile}
END:VCARD`;

    return vcard;
}

// DOM 로드 후 설정 적용
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyConfig);
} else {
    applyConfig();
}
