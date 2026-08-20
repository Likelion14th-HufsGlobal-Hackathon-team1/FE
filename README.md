# Archiv Frontend

명품 핸드백을 위한 디지털 제품 여권(DPP) 서비스 **Archiv**의 프론트엔드입니다.

구매 후 정품 인증부터 여행의 순간을 기록하는 AI 참(Charm), AI 기반 가방 상태 진단과 매장 케어 예약까지 하나의 모바일 웹 서비스로 연결합니다.

**Likelion 14th HUFS Global 해커톤(SJF 트랙) 출품작 — 팀 원픽**

## 핵심 기능

### DPP 정품 인증

- QR 카메라 스캔을 통한 제품 정보 조회
- 스캔 결과를 제품 등록 폼에 자동 입력
- 제품명, 제품 코드, 구매일 및 기억의 캡슐 등록
- 등록 제품 목록과 상세 정보 조회

### AI 여정 인증

- 여행 날짜, 국가, 도시와 메모 입력
- 카메라 또는 갤러리에서 여행 사진 여러 장 선택
- 여행 정보를 기반으로 AI Charm 후보 3개 생성
- 원하는 Charm 선택 및 Journey 저장

### Charm 꾸미기

- 생성한 Charm을 가방 위에 배치
- Charm 위치, 크기 및 회전 조정
- 저장된 배치를 Home과 Journey 화면에 반영

### AI 가방 상태 진단

- 카메라 또는 갤러리에서 가방 사진 선택
- 스크래치, 오염, 마모와 전체 상태 점수 확인
- AI 분석 의견 및 맞춤형 케어 방법 제공
- Care 분석 결과를 기반으로 매장 예약 진행

### Care 예약 및 알림

- 사용자 위치를 기반으로 주변 MCM 매장 조회
- 날짜별 예약 가능 시간 조회
- 제품, 매장, 날짜와 시간을 선택해 케어 예약
- Care 분석 후 제품별 케어 주기 알림 제공

### 마이페이지

- 사용자 정보 조회
- 등록한 제품 컬렉션 확인
- 대표 가방 및 제품별 기록 확인
- 기억의 캡슐과 Journey 상세 조회

## 기술 스택

| 구분 | 내용 |
| --- | --- |
| Language | JavaScript |
| UI | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router DOM |
| Styling | Styled Components |
| Icons | React Icons |
| QR Scanner | ZXing Browser |
| 이미지 저장 | Cloudinary |
| 배포 | Vercel |
| Lint | Oxlint |

## 이미지 처리 방식

Journey와 Care에서 사용자가 선택한 사진은 프론트엔드에서 Cloudinary로 직접 업로드합니다.

```text
사진 선택 또는 촬영
      ↓
Cloudinary 업로드
      ↓
secure_url 반환
      ↓
백엔드 imageUrl/imageUrls 필드로 전송
      ↓
AI 분석 또는 AI Charm 생성
```

백엔드는 이미지 파일이 아닌 Cloudinary 공개 URL을 전달받으므로 `res.cloudinary.com`에서 접근할 수 있는 이미지가 사용됩니다.

## 프로젝트 구조

```text
src/
├── assets/          이미지 및 SVG 리소스
├── components/      공통 UI 컴포넌트
├── pages/           페이지 컴포넌트
├── styles/          전역 스타일
├── utils/           API, 이미지 업로드, 스토리지 유틸리티
├── App.jsx          페이지 라우팅
└── main.jsx         애플리케이션 진입점
```

## 배포

프론트엔드는 Vercel을 통해 배포합니다.

- Production Branch: `main`
- Build Command: `npm run build`
- Output Directory: `dist`

배포 주소가 변경되면 백엔드 CORS 허용 Origin에도 해당 주소를 등록해야 합니다.

카메라 촬영과 QR 스캔 기능은 HTTPS 환경 및 브라우저 카메라 권한이 필요합니다.

## 팀

**Likelion 14th HUFS Global 해커톤 팀 원픽**

고선민, 김다은, 김민지, 김지우, 윤도희
