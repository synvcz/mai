import { useEffect, useState } from "react";

// const IMAGE_BASE = "/images";
const IMAGE_BASE = `${import.meta.env.BASE_URL}images`;

type Tone = "paper" | "night" | "blush";

const chapters = [
  {
    number: "01",
    label: "FIRST IMPRESSION",
    title: "Something\ncaught my attention.",
    copy: [
      "I had never met Mai before. There were countless other characters I could have noticed instead. But something about her made me stop and pay attention.",
      "It was not a ranking. It was a pause — the feeling that made me want to keep watching, before I had any good reason I could explain.",
    ],
    tone: "night" as Tone,
    image: `${IMAGE_BASE}/character-01-mai-front-cutout.png`,
    alt: "Mai Sakurajima standing with one hand at her hip, composed and self-assured",
  },
  {
    number: "02",
    label: "DISCOVERY",
    title: "Then I\ngot to know her.",
    copy: [
      "The more I saw of Mai, the more I realized that the first impression was not the whole reason I liked her.",
      "She knew who she was and did not need constant validation. Her confidence, dry humor, honesty, independence, and softer moments gradually became part of the picture.",
    ],
    tone: "paper" as Tone,
    image: `${IMAGE_BASE}/character-01-mai-side-cutout.png`,
    alt: "Mai Sakurajima in profile, relaxed and thoughtful in her school uniform",
  },
  {
    number: "03",
    label: "BEYOND APPEARANCE",
    title: "It was never\njust how she looked.",
    copy: [
      "Mai is beautiful, and that was certainly part of my first impression. But appearance alone could never explain why I chose her.",
      "What kept me interested was everything underneath it: the way she speaks, thinks, cares, and remains herself. Her confidence never erased her vulnerability, and her independence never made her feel distant.",
    ],
    tone: "blush" as Tone,
    image: `${IMAGE_BASE}/character-01-mai-face-cutout.png`,
    alt: "Close portrait of Mai Sakurajima with a quiet, vulnerable expression",
  },
];

const rotatingWords = [
  "FIRST IMPRESSION",
  "PERSONALITY",
  "CONFIDENCE",
  "INDEPENDENCE",
  "VULNERABILITY",
  "KINDNESS",
  "SINCERITY",
  "MEMORY",
];

const fragmentImages = [
  ["character-01-mai-google-01.jpg", "THE EXPRESSION"],
  ["character-01-mai-google-02.jpg", "THE PAUSE"],
  ["character-01-mai-google-03.jpg", "THE SARCASM"],
  ["character-01-mai-google-04.jpg", "THE COMPOSURE"],
  ["character-01-mai-google-05.jpg", "THE MEMORY"],
] as const;

const styleText = `
  .character-page {
    --ink: #25252b;
    --paper: #dedddb;
    --paper-soft: #ebe7e2;
    --night: #17171a;
    --night-soft: #242329;
    --blush: #d8c3c4;
    --pink: #d68d9a;
    --pink-soft: rgba(211, 128, 144, .2);
    --line-light: rgba(38, 35, 40, .18);
    --line-dark: rgba(235, 231, 225, .22);
    min-height: 100%;
    overflow: clip;
    isolation: isolate;
    background: var(--paper);
    color: var(--ink);
    font-family: "Plus Jakarta Sans", "Trebuchet MS", sans-serif;
  }

  .character-page *,
  .character-page *::before,
  .character-page *::after { box-sizing: border-box; }

  .character-page::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 50;
    pointer-events: none;
    opacity: .045;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='.5'/%3E%3C/svg%3E");
    mix-blend-mode: multiply;
  }

  .character-sans {
    font-family: "Sora", "Plus Jakarta Sans", sans-serif;
  }

  .character-mono {
    font-family: "Space Mono", "SFMono-Regular", Consolas, monospace;
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  .character-page img {
    display: block;
  }

  .character-topline {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 8;
    display: flex;
    justify-content: space-between;
    padding: 22px 28px;
    color: rgba(38, 36, 42, .64);
    font-size: 8px;
    line-height: 1.4;
  }

  .character-topline span:last-child { text-align: right; }

  .chapter-index {
    position: absolute;
    top: 28px;
    left: clamp(22px, 5vw, 72px);
    z-index: 4;
    color: currentColor;
    font-size: 8px;
    opacity: .62;
  }

  .chapter-edge {
    position: absolute;
    right: clamp(20px, 5vw, 72px);
    bottom: 24px;
    z-index: 4;
    display: flex;
    gap: 20px;
    color: currentColor;
    font-size: 8px;
    opacity: .56;
  }

  .progress-line {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 60;
    width: 100%;
    height: 2px;
    background: var(--pink);
    transform-origin: left;
  }

  .hero {
    position: relative;
    min-height: 112svh;
    background:
      radial-gradient(circle at 72% 39%, rgba(255,255,255,.46), transparent 28%),
      linear-gradient(135deg, #d5d4d6 0%, #c3c3c7 100%);
  }

  .hero-stage {
    position: sticky;
    top: 0;
    min-height: 100svh;
    overflow: hidden;
  }

  .hero-copy {
    position: absolute;
    bottom: clamp(68px, 12vh, 132px);
    left: clamp(24px, 9vw, 138px);
    z-index: 4;
    max-width: 620px;
    padding: 28px 32px 30px;
    border: 1px solid rgba(255, 255, 255, .42);
    background: rgba(239, 237, 235, .34);
    box-shadow: 0 22px 70px rgba(53, 46, 50, .07);
    backdrop-filter: blur(16px) saturate(.82);
  }

  .hero-kicker,
  .chapter-label {
    color: rgba(38, 36, 42, .56);
    font-size: 9px;
  }

  .hero-kicker { margin-bottom: 18px; }

  .hero-title {
    margin: 0;
    color: #1c1c21;
    font-size: clamp(4.6rem, 14vw, 12rem);
    font-weight: 780;
    line-height: .83;
    letter-spacing: -.1em;
  }

  .hero-subtitle {
    max-width: 245px;
    margin: 28px 0 0 8px;
    color: rgba(38, 36, 42, .68);
    font-size: clamp(.84rem, 1.3vw, 1rem);
    line-height: 1.6;
  }

  .hero-portrait {
    position: absolute;
    top: 9%;
    right: clamp(-4%, 5vw, 7%);
    z-index: 2;
    width: min(58vw, 700px);
    height: 82%;
    object-fit: contain;
    object-position: center;
    filter: saturate(.72) contrast(.98);
    opacity: .9;
    transform: translate3d(0, var(--hero-shift, 0px), 0) scale(1.03);
    transition: transform 1.2s cubic-bezier(.2,.7,.2,1);
  }

  .hero-ring {
    position: absolute;
    top: 17%;
    right: clamp(4%, 13vw, 17%);
    z-index: 1;
    width: min(46vw, 590px);
    aspect-ratio: 1;
    border: 1px solid rgba(255,255,255,.52);
    border-radius: 50%;
    opacity: .7;
  }

  .hero-scroll {
    position: absolute;
    right: 28px;
    bottom: 26px;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(38, 36, 42, .5);
    font-size: 8px;
  }

  .hero-scroll::before {
    content: "";
    width: 42px;
    height: 1px;
    background: currentColor;
    transform-origin: left;
    animation: line-breathe 3.6s ease-in-out infinite;
  }

  @keyframes line-breathe {
    0%, 100% { transform: scaleX(.35); opacity: .3; }
    50% { transform: scaleX(1); opacity: .9; }
  }

  .chapter {
    position: relative;
    min-height: 100svh;
    overflow: hidden;
  }

  .chapter-paper {
    background: linear-gradient(115deg, #d5d3d1, #e8e5e1 72%, #d4ced0);
    color: var(--ink);
  }

  .chapter-night {
    background:
      radial-gradient(ellipse at 66% 30%, rgba(112, 88, 103, .2), transparent 34%),
      var(--night);
    color: #e7e3dd;
  }

  .chapter-blush {
    background:
      radial-gradient(circle at 19% 20%, rgba(236, 174, 183, .22), transparent 25%),
      linear-gradient(120deg, #c8b4b8 0%, #e2d4d1 64%, #b4a9b0 100%);
    color: #29252c;
  }

  .chapter-grid {
    position: sticky;
    top: 0;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
    align-items: center;
    min-height: 100svh;
    padding: 9vh clamp(24px, 8vw, 126px);
  }

  .chapter-grid::before {
    content: "";
    position: absolute;
    inset: 6vh clamp(18px, 4vw, 72px);
    z-index: 0;
    border: 1px solid rgba(255, 255, 255, .18);
    background: rgba(239, 236, 232, .14);
    box-shadow: 0 28px 90px rgba(35, 30, 34, .08);
    backdrop-filter: blur(18px) saturate(.82);
    pointer-events: none;
  }

  .chapter-night .chapter-grid::before {
    border-color: rgba(255, 255, 255, .12);
    background: rgba(25, 25, 30, .28);
    box-shadow: 0 28px 100px rgba(0, 0, 0, .22);
  }

  .chapter-blush .chapter-grid::before {
    background: rgba(245, 235, 233, .2);
  }

  .chapter-media-wrap {
    position: relative;
    z-index: 2;
    width: min(39vw, 510px);
    height: min(72vh, 690px);
    margin-left: clamp(0px, 4vw, 56px);
  }

  .chapter-media-wrap.chapter-media-02 {
    width: min(42vw, 590px);
    height: min(80vh, 770px);
    margin-left: clamp(-2vw, 1vw, 18px);
  }

  .chapter-media {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    filter: saturate(.72) contrast(.98) drop-shadow(0 24px 35px rgba(27, 23, 28, .16));
    opacity: .94;
    transform: scale(1.03);
  }

  .chapter-media-01 .chapter-media { max-width: 82%; margin-inline: auto; }
  .chapter-media-02 .chapter-media { max-width: 92%; margin-inline: auto; }
  .chapter-media-03 .chapter-media { max-width: 100%; margin-inline: auto; }

  .chapter-night .chapter-media {
    filter: saturate(.52) brightness(.88) drop-shadow(0 24px 35px rgba(0, 0, 0, .28));
    opacity: .82;
  }
  .chapter-blush .chapter-media {
    filter: saturate(.62) contrast(.98) drop-shadow(0 24px 35px rgba(75, 49, 62, .16));
    opacity: .9;
  }

  .chapter-media-wrap::after {
    content: "";
    position: absolute;
    inset: 4% 2%;
    border: 1px solid currentColor;
    opacity: .12;
    transform: translate(15px, 15px);
    pointer-events: none;
  }

  .chapter-copy {
    position: relative;
    z-index: 2;
    max-width: 560px;
    margin-left: clamp(-4vw, -3vw, -24px);
    padding: 30px 34px 32px;
    border: 1px solid rgba(255, 255, 255, .26);
    background: rgba(239, 236, 232, .2);
    box-shadow: 0 20px 80px rgba(22, 20, 24, .08);
    backdrop-filter: blur(17px) saturate(.86);
  }

  .chapter-night .chapter-copy {
    border-color: rgba(255, 255, 255, .16);
    background: rgba(32, 29, 34, .3);
  }

  .chapter-blush .chapter-copy {
    background: rgba(245, 235, 233, .27);
  }

  .chapter-copy h2 {
    max-width: 620px;
    margin: 14px 0 30px;
    white-space: pre-line;
    font-size: clamp(3.2rem, 7vw, 7rem);
    font-weight: 770;
    line-height: .88;
    letter-spacing: -.095em;
  }

  .chapter-copy p {
    max-width: 420px;
    margin: 0 0 16px;
    color: inherit;
    opacity: .7;
    font-size: clamp(.82rem, 1.1vw, .98rem);
    line-height: 1.72;
  }

  .chapter-night .chapter-label { color: rgba(239, 230, 224, .56); }
  .chapter-blush .chapter-label { color: rgba(55, 46, 53, .58); }

  .annotation-stack {
    position: absolute;
    top: 50%;
    right: clamp(20px, 4vw, 62px);
    display: grid;
    gap: 12px;
    color: currentColor;
    font-size: 8px;
    opacity: .42;
    transform: translateY(-50%);
    writing-mode: vertical-rl;
  }

  .sakura-tree {
    position: absolute;
    right: -4%;
    bottom: -7px;
    z-index: 0;
    width: min(68vw, 930px);
    height: min(86vh, 900px);
    opacity: .29;
    overflow: hidden;
    border-radius: 48% 0 0 0;
    filter: saturate(.72) contrast(.9);
    mask-image: linear-gradient(to top, transparent 0%, black 18%, black 76%, transparent 100%);
    pointer-events: none;
  }

  .sakura-tree-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 66% center;
    mix-blend-mode: multiply;
    opacity: .78;
  }

  .sakura-tree::before,
  .sakura-tree::after {
    content: "";
    position: absolute;
    bottom: -9%;
    left: 53%;
    width: 8px;
    height: 100%;
    border-radius: 100%;
    background: #4f3e45;
    transform: rotate(9deg);
    transform-origin: bottom;
  }

  .sakura-tree::after {
    left: 50%;
    width: 4px;
    height: 66%;
    transform: rotate(-34deg);
  }

  .sakura-branch {
    position: absolute;
    left: 8%;
    top: 22%;
    width: 86%;
    height: 5px;
    border-radius: 50%;
    background: #58444b;
    transform: rotate(-21deg);
  }

  .sakura-branch::before,
  .sakura-branch::after {
    content: "";
    position: absolute;
    top: 2px;
    width: 52%;
    height: 4px;
    border-radius: 50%;
    background: #58444b;
    transform: rotate(30deg);
    transform-origin: left;
  }

  .sakura-branch::after {
    left: 55%;
    width: 43%;
    transform: rotate(-30deg);
  }

  .bloom {
    position: absolute;
    width: 19px;
    height: 19px;
    border-radius: 50% 44% 50% 44%;
    background: rgba(226, 135, 153, .78);
    box-shadow: 9px 3px 0 -2px rgba(226, 135, 153, .68), -6px 5px 0 -3px rgba(244, 183, 191, .8);
  }

  .bloom-one { top: 12%; left: 13%; transform: rotate(14deg); }
  .bloom-two { top: 27%; left: 48%; transform: rotate(-12deg); }
  .bloom-three { top: 20%; right: 3%; transform: rotate(23deg); }
  .bloom-four { top: 38%; right: 24%; transform: rotate(-8deg); }
  .bloom-five { top: 5%; right: 24%; transform: rotate(30deg); }
  .bloom-six { top: 34%; left: 22%; transform: rotate(-20deg); }

  .torii {
    position: absolute;
    left: 3%;
    bottom: 5%;
    z-index: 0;
    width: min(52vw, 700px);
    height: min(64vh, 620px);
    opacity: .24;
    overflow: hidden;
    filter: saturate(.64) contrast(.9);
    mask-image: linear-gradient(to top, transparent 0%, black 13%, black 78%, transparent 100%);
    pointer-events: none;
  }

  .torii-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    mix-blend-mode: multiply;
    opacity: .7;
  }

  .torii::before,
  .torii::after {
    content: "";
    position: absolute;
    bottom: 0;
    width: 11px;
    height: 80%;
    background: #8c4a55;
  }

  .torii::before { left: 16%; }
  .torii::after { right: 16%; }

  .torii-top {
    position: absolute;
    top: 8%;
    left: 0;
    width: 100%;
    height: 13px;
    border-radius: 50%;
    background: #8c4a55;
    transform: rotate(-1.5deg);
  }

  .torii-middle {
    position: absolute;
    top: 25%;
    left: 10%;
    width: 80%;
    height: 7px;
    background: #8c4a55;
  }

  .torii-inner {
    position: absolute;
    top: 28%;
    left: 22%;
    width: 56%;
    height: 72%;
    border-left: 3px solid rgba(140, 74, 85, .8);
    border-right: 3px solid rgba(140, 74, 85, .8);
  }

  .fragments {
    position: relative;
    min-height: 104svh;
    overflow: hidden;
    background:
      radial-gradient(circle at 75% 38%, rgba(217, 137, 151, .14), transparent 25%),
      #1c1b1f;
    color: #e3dfda;
  }

  .fragments-inner {
    position: sticky;
    top: 0;
    min-height: 104svh;
    padding: 14vh clamp(24px, 8vw, 128px) 11vh;
  }

  .fragments-intro {
    display: grid;
    grid-template-columns: minmax(190px, .76fr) minmax(280px, 1fr);
    align-items: end;
    gap: 7vw;
    max-width: 920px;
    padding: 26px 30px 28px;
    border: 1px solid rgba(255, 255, 255, .15);
    background: rgba(38, 35, 40, .34);
    backdrop-filter: blur(15px) saturate(.86);
  }

  .fragments-intro h2 {
    margin: 12px 0 0;
    font-size: clamp(3.2rem, 7vw, 7rem);
    font-weight: 770;
    line-height: .88;
    letter-spacing: -.095em;
  }

  .fragments-intro p {
    max-width: 365px;
    margin: 0 0 6px;
    color: #aaa7a6;
    font-size: .9rem;
    line-height: 1.72;
  }

  .fragment-notes {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 30px;
    max-width: 760px;
    margin-top: clamp(75px, 14vh, 135px);
    color: #aaa7a6;
  }

  .fragment-note {
    position: relative;
    padding-left: 18px;
    font-size: 9px;
  }

  .fragment-note::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--pink);
    transform: translateY(-50%);
  }

  .fragment-footnote {
    position: absolute;
    bottom: 8vh;
    left: clamp(24px, 8vw, 128px);
    color: #7d797d;
    font-size: 10px;
    letter-spacing: .02em;
  }

  .fragment-strip {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: clamp(9px, 1.5vw, 20px);
    max-width: 1020px;
    margin-top: clamp(42px, 7vh, 74px);
  }

  .fragment-card {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, .16);
    background: rgba(242, 238, 232, .12);
  }

  .fragment-card:nth-child(1),
  .fragment-card:nth-child(4) { transform: translateY(16px); }

  .fragment-card:nth-child(2),
  .fragment-card:nth-child(5) { transform: translateY(-12px); }

  .fragment-card img {
    width: 100%;
    height: clamp(170px, 27vh, 290px);
    object-fit: cover;
    object-position: center top;
    filter: saturate(.72) contrast(.96);
    opacity: .88;
    transition: transform 1s cubic-bezier(.2,.65,.2,1), opacity .8s ease;
  }

  .fragment-card:hover img {
    transform: scale(1.04);
    opacity: 1;
  }

  .fragment-card figcaption {
    padding: 11px 10px 12px;
    color: #b9b1b0;
    font-size: 7px;
  }

  .choice {
    position: relative;
    min-height: 110svh;
    overflow: hidden;
    background: linear-gradient(124deg, #d6c7c8 0%, #ece3df 68%, #cdc1c5 100%);
    color: var(--ink);
  }

  .choice-grid {
    position: sticky;
    top: 0;
    display: grid;
    grid-template-columns: 1.08fr .92fr;
    align-items: center;
    min-height: 110svh;
    padding: 11vh clamp(24px, 9vw, 140px);
  }

  .choice-copy {
    position: relative;
    z-index: 2;
    max-width: 560px;
    padding: 28px 32px 30px;
    border: 1px solid rgba(255, 255, 255, .36);
    background: rgba(241, 233, 231, .28);
    backdrop-filter: blur(16px) saturate(.86);
  }

  .choice-copy h2 {
    margin: 14px 0 28px;
    font-size: clamp(3.3rem, 7.6vw, 7.8rem);
    font-weight: 770;
    line-height: .85;
    letter-spacing: -.1em;
  }

  .choice-copy p {
    max-width: 425px;
    margin: 0 0 16px;
    color: #676067;
    font-size: .9rem;
    line-height: 1.72;
  }

  .choice-reveal {
    margin-top: 44px;
    padding-top: 20px;
    border-top: 1px solid var(--line-light);
  }

  .choice-reveal strong {
    display: block;
    max-width: 540px;
    color: #29252c;
    font-size: clamp(1.15rem, 2vw, 1.65rem);
    line-height: 1.18;
    letter-spacing: -.045em;
  }

  .choice-mark {
    position: absolute;
    right: 8vw;
    bottom: 8vh;
    z-index: 0;
    width: min(28vw, 380px);
    height: min(44vh, 450px);
    border: 1px solid rgba(130, 68, 83, .26);
    opacity: .58;
  }

  .choice-mark::before,
  .choice-mark::after {
    content: "";
    position: absolute;
    background: rgba(130, 68, 83, .22);
  }

  .choice-mark::before { top: 50%; left: 0; width: 100%; height: 1px; }
  .choice-mark::after { top: 0; left: 50%; width: 1px; height: 100%; }

  .answer {
    position: relative;
    min-height: 115svh;
    overflow: hidden;
    background:
      radial-gradient(circle at 54% 42%, rgba(190, 111, 132, .15), transparent 27%),
      #18171a;
    color: #e5e0da;
  }

  .answer-stage {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 115svh;
    padding: 16vh 24px;
    text-align: center;
  }

  .answer-copy {
    position: relative;
    z-index: 3;
    padding: 28px 34px 32px;
    border: 1px solid rgba(255, 255, 255, .14);
    background: rgba(24, 23, 26, .3);
    backdrop-filter: blur(15px) saturate(.8);
  }

  .answer-copy h2 {
    margin: 14px 0 38px;
    font-size: clamp(4rem, 10vw, 10rem);
    font-weight: 770;
    line-height: .85;
    letter-spacing: -.11em;
  }

  .answer-main {
    max-width: 620px;
    margin: 0 auto 34px;
    color: #bbb3b0;
    font-size: clamp(1.12rem, 2vw, 1.6rem);
    line-height: 1.3;
    letter-spacing: -.04em;
  }

  .answer-word {
    min-height: 30px;
    color: #d493a0;
    font-size: clamp(.7rem, 1.05vw, .9rem);
  }

  .answer-closing {
    max-width: 520px;
    margin: 44px auto 0;
    color: #ece7e0;
    font-size: clamp(1.4rem, 3vw, 2.6rem);
    font-weight: 640;
    line-height: 1.05;
    letter-spacing: -.07em;
  }

  .answer-petal {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50% 44% 50% 44%;
    background: rgba(219, 135, 150, .62);
    transform: rotate(24deg);
  }

  .answer-petal-one { top: 19%; left: 18%; }
  .answer-petal-two { top: 27%; right: 17%; transform: rotate(-22deg); }
  .answer-petal-three { bottom: 22%; left: 24%; transform: rotate(47deg); }
  .answer-petal-four { right: 22%; bottom: 18%; transform: rotate(-11deg); }

  .footer-strip {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    padding: 18px 28px;
    background: #c7afb5;
    color: #33272d;
    font-size: 8px;
  }

  .footer-strip span:last-child { text-align: right; }

  @media (min-width: 1100px) and (min-height: 620px) {
    .hero-stage {
      min-height: 94svh;
    }

    .hero {
      min-height: 104svh;
    }

    .hero-copy {
      bottom: 10vh;
      left: clamp(48px, 9vw, 148px);
      padding: 32px 38px 34px;
    }

    .hero-portrait {
      top: 5%;
      right: clamp(5%, 9vw, 13%);
      width: min(35vw, 570px);
      height: 88%;
    }

    .hero-ring {
      top: 10%;
      right: clamp(5%, 15vw, 19%);
      width: min(36vw, 590px);
    }

    .chapter {
      min-height: 96svh;
    }

    .chapter-grid {
      grid-template-columns: minmax(360px, .9fr) minmax(460px, 1.1fr);
      column-gap: clamp(30px, 4vw, 76px);
      min-height: 96svh;
      padding: 7vh clamp(44px, 7vw, 124px);
    }

    .chapter-grid::before {
      inset: 5vh clamp(22px, 3vw, 58px);
    }

    .chapter-media-wrap {
      width: min(31vw, 480px);
      height: min(74vh, 720px);
      margin-left: clamp(18px, 3vw, 48px);
    }

    .chapter-media-wrap.chapter-media-02 {
      width: min(37vw, 620px);
      height: min(80vh, 780px);
      margin-left: 0;
    }

    .chapter-copy {
      max-width: 610px;
      margin-left: -2vw;
      padding: 32px 40px 34px;
    }

    .chapter-copy h2 {
      font-size: clamp(4.2rem, 6.1vw, 7rem);
    }

    .chapter-copy p {
      max-width: 470px;
      font-size: .92rem;
    }

    .sakura-tree {
      right: -1%;
      width: min(70vw, 980px);
      height: min(90vh, 940px);
      opacity: .31;
    }

    .torii {
      left: 1%;
      width: min(55vw, 740px);
      height: min(68vh, 660px);
      opacity: .25;
    }

    .fragments,
    .fragments-inner,
    .choice,
    .choice-grid,
    .answer,
    .answer-stage {
      min-height: 96svh;
    }

    .fragments-inner {
      padding: 10vh clamp(44px, 7vw, 124px) 8vh;
    }

    .fragments-intro {
      max-width: 1060px;
      grid-template-columns: minmax(300px, .78fr) minmax(360px, 1fr);
      gap: clamp(56px, 7vw, 118px);
      padding: 24px 34px 26px;
    }

    .fragment-strip {
      max-width: 1160px;
      margin-top: 5vh;
    }

    .fragment-card img {
      height: clamp(150px, 22vh, 238px);
    }

    .choice-grid {
      grid-template-columns: minmax(470px, 1.08fr) minmax(260px, .92fr);
      padding: 8vh clamp(44px, 8vw, 140px);
    }

    .choice-copy {
      max-width: 620px;
      padding: 32px 40px 34px;
    }

    .answer-stage {
      padding: 10vh 24px;
    }
  }

  @media (max-width: 760px) {
    .character-topline { padding: 17px 18px; }
    .hero { min-height: 104svh; }
    .hero-copy { right: 18px; padding: 23px 21px 25px; }
    .hero-portrait { top: 6%; right: -22%; width: 91vw; height: 68%; opacity: .88; }
    .hero-ring { top: 13%; right: -12%; width: 76vw; }
    .hero-copy { left: 22px; bottom: 78px; }
    .hero-title { font-size: clamp(4.7rem, 22vw, 8.4rem); }
    .hero-subtitle { margin-top: 20px; }
    .chapter { min-height: 106svh; }
    .chapter-grid,
    .choice-grid {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      min-height: 106svh;
      padding: 15vh 22px 10vh;
    }
    .chapter-media-wrap { order: 1; width: min(68vw, 310px); height: 41svh; margin: 1vh 0 -6vh 11vw; }
    .chapter-media-wrap.chapter-media-02 { width: min(84vw, 390px); height: 48svh; margin: 0 0 -9vh 3vw; }
    .chapter-copy { order: 2; margin: 0; padding: 20px 21px 22px; }
    .chapter-copy h2 { margin-bottom: 21px; font-size: clamp(3.3rem, 15vw, 5.8rem); }
    .chapter-copy p { font-size: .8rem; line-height: 1.64; }
    .chapter-copy p:nth-of-type(2) { display: none; }
    .chapter-index { top: 20px; left: 22px; }
    .chapter-edge { right: 18px; bottom: 17px; gap: 10px; font-size: 7px; }
    .annotation-stack { display: none; }
    .sakura-tree { right: -76px; bottom: -3px; width: 104vw; height: 58vh; opacity: .27; }
    .torii { left: -8px; bottom: 5%; width: 52vw; height: 34vh; opacity: .22; }
    .fragments { min-height: 94svh; }
    .fragments-inner { min-height: 94svh; padding: 15vh 22px 10vh; }
    .fragments-intro { display: block; padding: 22px 21px 24px; }
    .fragments-intro h2 { font-size: clamp(3.35rem, 15vw, 6rem); }
    .fragments-intro p { margin-top: 24px; font-size: .8rem; }
    .fragment-notes { display: grid; grid-template-columns: 1fr 1fr; gap: 17px 12px; margin-top: 64px; }
    .fragment-strip { gap: 7px; margin-top: 44px; }
    .fragment-card:nth-child(1),
    .fragment-card:nth-child(2),
    .fragment-card:nth-child(3),
    .fragment-card:nth-child(4),
    .fragment-card:nth-child(5) { transform: none; }
    .fragment-card img { height: 145px; }
    .fragment-card figcaption { padding: 8px 6px 9px; font-size: 6px; }
    .fragment-note { font-size: 7px; }
    .fragment-footnote { left: 22px; bottom: 7vh; font-size: 9px; }
    .choice { min-height: 108svh; }
    .choice-grid { min-height: 108svh; }
    .choice-copy { max-width: 100%; padding: 22px 21px 24px; }
    .choice-copy h2 { font-size: clamp(3.4rem, 15vw, 6.4rem); }
    .choice-copy p { font-size: .8rem; }
    .choice-reveal { margin-top: 31px; padding-top: 16px; }
    .choice-reveal strong { font-size: 1.08rem; }
    .choice-mark { right: -7vw; bottom: 6vh; width: 43vw; height: 33vh; }
    .answer { min-height: 112svh; }
    .answer-stage { min-height: 112svh; padding: 16vh 22px; }
    .answer-copy { padding: 22px 21px 24px; }
    .answer-copy h2 { margin-bottom: 27px; font-size: clamp(4.1rem, 19vw, 8rem); }
    .answer-main { font-size: 1.1rem; }
    .answer-closing { margin-top: 36px; font-size: 1.4rem; }
    .footer-strip { grid-template-columns: repeat(2, 1fr); gap: 11px; padding: 17px 18px; font-size: 7px; }
    .footer-strip span:last-child { text-align: left; }
  }

  @media (prefers-reduced-motion: reduce) {
    .character-page *,
    .character-page *::before,
    .character-page *::after {
      scroll-behavior: auto !important;
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
    }
    .hero-portrait { transform: none; }
  }
`;

function SakuraTree() {
  return (
    <div className="sakura-tree" aria-hidden="true">
      <img className="sakura-tree-image" src={`${IMAGE_BASE}/character-01-sakura-bg.jpg`} alt="" />
      <div className="sakura-branch" />
      <div className="bloom bloom-one" />
      <div className="bloom bloom-two" />
      <div className="bloom bloom-three" />
      <div className="bloom bloom-four" />
      <div className="bloom bloom-five" />
      <div className="bloom bloom-six" />
    </div>
  );
}

function Torii() {
  return (
    <div className="torii" aria-hidden="true">
      <img className="torii-image" src={`${IMAGE_BASE}/character-01-torii-bg.jpg`} alt="" />
      <div className="torii-top" />
      <div className="torii-middle" />
      <div className="torii-inner" />
    </div>
  );
}

function Chapter({
  chapter,
  index,
}: {
  chapter: (typeof chapters)[number];
  index: number;
}) {
  return (
    <section className={`chapter chapter-${chapter.tone}`} aria-labelledby={`chapter-${chapter.number}`}>
      <span className="chapter-index character-mono">{chapter.number} / 06</span>
      <div className="chapter-grid">
        <div className={`chapter-media-wrap chapter-media-${chapter.number}`}>
          <img className="chapter-media" src={chapter.image} alt={chapter.alt} loading={index === 0 ? "eager" : "lazy"} />
        </div>
        <div className="chapter-copy">
          <div className="chapter-label character-mono">{chapter.label}</div>
          <h2 id={`chapter-${chapter.number}`} className="character-sans">{chapter.title}</h2>
          {chapter.copy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
      <SakuraTree />
      {index === 1 ? <Torii /> : null}
      <div className="annotation-stack character-mono" aria-hidden="true">
        <span>{chapter.number} / CHARACTER STUDY</span>
        <span>静けさ</span>
        <span>MAI SAKURAJIMA</span>
      </div>
      <div className="chapter-edge character-mono">
        <span>{chapter.label}</span>
        <span>PERSONAL STUDY</span>
      </div>
    </section>
  );
}

export function Character01() {
  const [progress, setProgress] = useState(0);
  const [answerWord, setAnswerWord] = useState(rotatingWords[0]);

  useEffect(() => {
    let wordTimer: number | undefined;
    let wordIndex = 0;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.max(0, Math.min(1, next)));

      if (wordTimer === undefined && next > .58 && next < .9) {
        wordTimer = window.setInterval(() => {
          wordIndex = (wordIndex + 1) % rotatingWords.length;
          setAnswerWord(rotatingWords[wordIndex]);
        }, 1900);
      }
      if (next <= .58 || next >= .9) {
        window.clearInterval(wordTimer);
        wordTimer = undefined;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(wordTimer);
    };
  }, []);

  return (
    <main className="character-page">
      <style>{styleText}</style>
      <div
        className="progress-line"
        aria-hidden="true"
        style={{ transform: `scaleX(${progress})` }}
      />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-stage">
          <header className="character-topline character-mono">
            <span>CHARACTER / 01</span>
            <span>MAI SAKURAJIMA<br />A PERSONAL STUDY</span>
          </header>
          <div className="hero-ring" aria-hidden="true" />
          <img
            className="hero-portrait"
            src={`${IMAGE_BASE}/character-01-mai-front.png`}
            alt="Mai Sakurajima in her school uniform, standing with quiet confidence"
            style={{ transform: `translate3d(0, ${progress * 70}px, 0) scale(1.03)` }}
          />
          <SakuraTree />
          <div className="hero-copy">
            <div className="hero-kicker character-mono">A personal visual essay</div>
            <h1 id="hero-title" className="hero-title character-sans">Why<br />her.</h1>
            <p className="hero-subtitle">Out of everyone, I chose her.</p>
          </div>
          <div className="hero-scroll character-mono" aria-hidden="true">SCROLL TO BEGIN</div>
        </div>
      </section>

      {chapters.map((chapter, index) => (
        <Chapter key={chapter.number} chapter={chapter} index={index} />
      ))}

      <section className="fragments" aria-labelledby="chapter-04">
        <div className="fragments-inner">
          <span className="chapter-index character-mono">04 / 06</span>
          <div className="fragments-intro">
            <div>
              <div className="chapter-label character-mono">WHY I STAYED</div>
              <h2 id="chapter-04" className="character-sans">It<br />accumulated.</h2>
            </div>
            <p>I did not choose Mai because of one moment. The small things kept adding up until the choice felt quietly inevitable.</p>
          </div>
          <div className="fragment-notes character-mono">
            <span className="fragment-note">THE EXPRESSION</span>
            <span className="fragment-note">THE PAUSE</span>
            <span className="fragment-note">THE SARCASM</span>
            <span className="fragment-note">THE COMPOSURE</span>
            <span className="fragment-note">THE KINDNESS</span>
            <span className="fragment-note">THE MEMORY</span>
          </div>
          <div className="fragment-strip">
            {fragmentImages.map(([image, label]) => (
              <figure className="fragment-card" key={image}>
                <img
                  src={`${IMAGE_BASE}/${image}`}
                  alt={`Mai Sakurajima — ${label.toLowerCase()}`}
                  loading="lazy"
                />
                <figcaption className="character-mono">{label}</figcaption>
              </figure>
            ))}
          </div>
          <div className="fragment-footnote">A choice can be made of very small things.</div>
          <SakuraTree />
        </div>
      </section>

      <section className="choice" aria-labelledby="chapter-05">
        <div className="choice-grid">
          <div className="choice-copy">
            <div className="chapter-label character-mono">05 / THE CHOICE</div>
            <h2 id="chapter-05" className="character-sans">There were<br />other<br />characters.</h2>
            <p>There are countless characters who are funny, beautiful, intelligent, kind, interesting, or emotionally compelling. I could have chosen someone else.</p>
            <p>What made the difference was how those qualities came together in her, and how that particular combination resonated with me.</p>
            <div className="choice-reveal">
              <strong>I did not choose her because no one else was worth choosing.</strong>
              <strong style={{ marginTop: "15px" }}>I chose her because she became the one who meant the most to me.</strong>
            </div>
          </div>
          <div className="choice-mark" aria-hidden="true" />
          <SakuraTree />
          <Torii />
        </div>
        <div className="chapter-edge character-mono">
          <span>COUNTLESS CHARACTERS</span>
          <span>ONE CHARACTER</span>
        </div>
      </section>

      <section className="answer" aria-labelledby="chapter-06">
        <div className="answer-stage">
          <span className="answer-petal answer-petal-one" aria-hidden="true" />
          <span className="answer-petal answer-petal-two" aria-hidden="true" />
          <span className="answer-petal answer-petal-three" aria-hidden="true" />
          <span className="answer-petal answer-petal-four" aria-hidden="true" />
          <div className="answer-copy">
            <div className="chapter-label character-mono">06 / WHY HER</div>
            <h2 id="chapter-06" className="character-sans">So why her?</h2>
            <p className="answer-main">Because it was never just one thing.</p>
            <div className="answer-word character-mono" aria-live="polite">{answerWord}</div>
            <p className="answer-closing">It was the way all of it became her.</p>
          </div>
        </div>
      </section>

      <footer className="footer-strip character-mono">
        <span>CHARACTER / 01</span>
        <span>MAI SAKURAJIMA</span>
        <span>WHY HER</span>
        <span>A PERSONAL STUDY</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}