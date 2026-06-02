# MOOD WAVE

음악 스트리밍 개인화 추천 웹 서비스

---

## Deploy

[MOOD WAVE 바로가기](https://moodwave-fe.vercel.app/)

---

## Introduction

**MOOD WAVE**는 사용자가 음악을 검색하고 재생할 수 있을 뿐만 아니라,  
AI 감정 분석, 날씨 기반 추천, 음악 취향 분석 기능을 제공하는 음악 웹 서비스입니다.

사용자의 감정, 현재 날씨, 음악 감상 데이터를 기반으로  
상황에 맞는 개인화 음악 추천 경험을 제공하는 것을 목표로 합니다.

---

## Team

<table>
  <tr>
    <td align="center" width="180px">
      <a href="https://github.com/haejunbag131-maker">
        <img src="https://github.com/haejunbag131-maker.png" width="120px;" alt="박해준"/>
        <br />
        <sub><b>박해준</b></sub>
      </a>
      <br />
      <b>Frontend</b>
    </td>
    <td align="center" width="180px">
      <a href="https://github.com/donghyeon01">
        <img src="https://github.com/donghyeon01.png" width="120px;" alt="송동현"/>
        <br />
        <sub><b>송동현</b></sub>
      </a>
      <br />
      <b>Frontend</b>
    </td>
    <td align="center" width="180px">
      <a href="https://github.com/Ppakso">
        <img src="https://github.com/Ppakso.png" width="120px;" alt="박소연"/>
        <br />
        <sub><b>박소연</b></sub>
      </a>
      <br />
      <b>Frontend</b>
    </td>
    <td align="center" width="180px">
      <a href="https://github.com/cece-297">
        <img src="https://github.com/cece-297.png" width="120px;" alt="이수아"/>
        <br />
        <sub><b>이수아</b></sub>
      </a>
      <br />
      <b>Frontend</b>
    </td>
  </tr>
</table>

---

## Tech Stack

<table>
  <tr>
    <th width="120px">Frontend</th>
    <td>
      <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
      <img src="https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
      <img src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
      <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
    </td>
  </tr>
  <tr>
    <th width="120px">Backend</th>
    <td>
      <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/>
    </td>
  </tr>
  <tr>
    <th width="120px">Database</th>
    <td>
      <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/>
    </td>
  </tr>
  <tr>
    <th width="120px">API</th>
    <td>
      <img src="https://img.shields.io/badge/Spotify%20API-1DB954?style=for-the-badge&logo=spotify&logoColor=white"/>
      <img src="https://img.shields.io/badge/OpenAI%20API-412991?style=for-the-badge&logo=openai&logoColor=white"/>
      <img src="https://img.shields.io/badge/OpenWeather%20API-EB6E4B?style=for-the-badge&logo=openweathermap&logoColor=white"/>
    </td>
  </tr>
  <tr>
    <th width="120px">Library</th>
    <td>
      <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white"/>
    </td>
  </tr>
  <tr>
    <th width="120px">Deploy</th>
    <td>
      <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
      <img src="https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white"/>
    </td>
  </tr>
</table>

---

## Main Features

### 음악 검색 및 재생

Spotify API를 활용하여 음악을 검색하고,
앨범 이미지, 아티스트 정보, 곡 정보를 함께 제공합니다.

### AI 감정 기반 추천

사용자가 입력한 감정 문장을 OpenAI API로 분석하여
현재 감정에 어울리는 음악을 추천합니다.

### 날씨 기반 추천

OpenWeather API를 활용하여 현재 날씨 데이터를 가져오고,
날씨 분위기에 맞는 음악을 추천합니다.

### 음악 취향 분석

사용자의 음악 감상 데이터를 기반으로
장르, 날씨 등 취향 데이터를 시각화합니다.

---

## Architecture

MOOD WAVE는 프론트엔드를 **Vercel**, 백엔드를 **Railway**에 배포했습니다.  
프론트엔드는 사용자와 직접 상호작용하며, 백엔드 Spring Boot 서버와 REST API 방식으로 통신합니다.  
백엔드는 Spotify API, OpenAI API, OpenWeather API와 연동하고, 데이터는 Railway MySQL에 저장 및 관리합니다.

<div align="center">
  <img src="./docs/MoodWave-Architecture.png" width="900" alt="MOOD WAVE System Architecture"/>
</div>

---

## ERD

MOOD WAVE의 데이터베이스는 Spotify 로그인 사용자 정보와  
사용자가 좋아요한 음악 데이터를 중심으로 구성했습니다.

<div align="center">
  <img src="./docs/MoodWave-ERD.png" width="700" alt="MOOD WAVE ERD"/>
</div>

### Tables

| Table   | Description                      |
| ------- | -------------------------------- |
| `users` | Spotify 로그인 사용자 정보 저장  |
| `liked` | 사용자가 좋아요한 음악 정보 저장 |

---

## UI Design

### Layout Structure

MOOD WAVE는 Spotify 스타일의 음악 웹앱 레이아웃을 참고하여 제작했습니다.  
전체 화면은 **Header**, **Sidebar**, **Main**, **Footer Player** 영역으로 구성됩니다.

- **Header**: 검색창, 페이지 이동 버튼, 프로필 영역
- **Sidebar**: 주요 메뉴, 라이브러리, 좋아요 메뉴
- **Main**: 음악 추천, 인기 음악, 최신 음악, 검색 결과 표시
- **Footer Player**: 현재 재생 중인 음악 정보와 재생 컨트롤러

<div align="center">
  <img src="./docs/MoodWave-Layout.png" width="900" alt="MOOD WAVE Layout Structure"/>
</div>

<br />

### Wireframe

전체 와이어프레임은 음악 스트리밍 서비스의 사용 흐름을 기준으로 구성했습니다.  
좌측에는 로고와 메뉴를 배치하고, 우측 상단에는 검색창과 프로필 영역을 배치했습니다.  
메인 영역에는 추천 플레이리스트, 인기 음악, 최신 음악, 음악 카드, 재생 목록 등을 배치했습니다.  
하단에는 현재 재생 중인 음악과 컨트롤러를 포함한 고정 푸터 플레이어를 구성했습니다.

<div align="center">
  <img src="./docs/MoodWave-Wireframe.png" width="900" alt="MOOD WAVE Wireframe"/>
</div>

---

## Deployment

| Part     | Platform      |
| -------- | ------------- |
| Frontend | Vercel        |
| Backend  | Railway       |
| Database | Railway MySQL |

Frontend URL: [https://moodwave-fe.vercel.app/](https://moodwave-fe.vercel.app/)

---

## Folder Structure

<pre>
MOODWAVE-FE
├── docs
│   └── README Images
├── public
│   └── assets
│       ├── icon
│       └── img     
├── src
│   ├── assets
│   │   ├── css
│   │   │   ├── setting
│   │   │   ├── components
│   │   │   └── pages
│   │   └── js
│   │       ├── api
│   │       ├── components
│   │       ├── pages
│   │       └── utils
│   ├── data.js
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
</pre>

---

## Project Summary

MOOD WAVE는 단순한 음악 검색 서비스를 넘어  
사용자의 감정, 날씨, 음악 취향 데이터를 활용하여
개인화된 음악 추천 경험을 제공하는 웹 서비스입니다.

프론트엔드는 Vite 기반의 HTML, CSS, JavaScript로 구현했으며,  
백엔드는 Spring Boot를 사용하여 Spotify API, OpenAI API, OpenWeather API와 연동했습니다.  
서비스는 Vercel과 Railway를 통해 배포하여 실제 웹 환경에서 사용할 수 있도록 구성했습니다.
