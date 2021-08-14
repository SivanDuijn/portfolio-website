import react, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import Link from 'next/link';

import styles from './usecasesSlider.module.scss';

interface Usecase {
  className: string;
  title: string;
  text: string;
}

const usecasesData: Usecase[] = [
  {
    className: styles.fraudDetection,
    title: 'Fraud Detection',
    text: `Our Graph Databases easily capture activity networks, discern normal from fraudulent behavior 
      and trace fraud patterns even through complex financial traffic networks.`,
  },
  {
    className: styles.advertisement,
    title: 'Advertisement',
    text: `GraphPolaris supports social network analysis. Applied in the context of advertisement, our 
      system allows to make marketing campaigns (measurably) more effective.`,
  },
  {
    className: styles.supplyChains,
    title: 'Supply Chains',
    text: `GraphPolaris’ innovative features allow to better analyze problem root causes, 
      communicate efficiency improvements, and anticipate problems before they arise.`,
  },
  {
    className: styles.yours,
    title: 'Your use case',
    text: `How can we help? GraphPolaris is neither use case, domain, nor vendor-agnostic 
      and we are here to help you with your (not only graph) data analysis problem. 
      Get in touch with us under info@graphpolaris.com!`,
  },
];

export default function UsecasesSlider() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  // The index of the usecase to show.
  const [index, setIndex] = useState(0);
  // The class to use for animation, slide in or out, depending on if 'next' or 'previous' was pressed.
  const [animationClass, setAnimationClass] = useState('');
  // The timeout id of the timeout for removing the class.
  const animationClassTimeout = useRef(0);

  const updateMedia = (): void => {
    setIsSmallScreen(window.innerWidth <= 1300);
  };

  useEffect(() => {
    updateMedia();
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  /** Increments index to show next usecase, also sets an animation class for sliding in from left. */
  const next = (): void => {
    if (animationClass != '') return;
    setIndex(index - 1);

    setAnimationClass(styles.slideInFromLeft);
    setRemoveAnimationClassTimout();
  };
  /** Decrements index to show previous usecase, also sets an animation class for sliding in from right. */
  const previous = (): void => {
    if (animationClass != '') return;
    setIndex(index + 1);

    setAnimationClass(styles.slideInFromRight);
    setRemoveAnimationClassTimout();
  };
  /** Sets a timeout for removing the animation class. */
  const setRemoveAnimationClassTimout = (): void => {
    clearTimeout(animationClassTimeout.current);
    animationClassTimeout.current = setTimeout(() => {
      setAnimationClass('');
    }, 800) as unknown as number;
  };

  /** Modulo function which also correctly calculates negative values. */
  const mod = (n: number, m: number) => ((n % m) + m) % m;

  // Create the usecase elements, the amount depends on how much fits in view, currently only 1, for mobile screensize
  const usecaseElements: JSX.Element[] = [];
  let n = usecasesData.length;
  n = n % 2 == 0 ? n + 1 : n; // If n is even, add one.
  for (let i = -(n >> 1); i <= n >> 1; i++) {
    let ind = index + i;
    if (n === 5) ind++;
    const usecase = usecasesData[mod(ind, usecasesData.length)];
    usecaseElements.push(<RenderUsecase key={usecase.title + i} usecase={usecase} />);
  }

  return (
    <div className={styles.container}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        className={styles.arrow}
        viewBox="0 0 330 330"
        onClick={() => previous()}
      >
        <path
          transform="rotate(90, 165, 165)"
          d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393  c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393  s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
        />
      </svg>
      <div></div>
      <div className={styles.usecasesContainer}>
        <div className={cn(styles.usecasesBox, animationClass)}>{usecaseElements}</div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        className={styles.arrow}
        viewBox="0 0 330 330"
        onClick={() => next()}
      >
        <path
          transform="rotate(-90, 165, 165)"
          d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393  c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393  s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
        />
      </svg>
    </div>
  );
}

/** Renders a single usecase. */
function RenderUsecase({ usecase }: { usecase: Usecase }) {
  return (
    <section className={cn(usecase.className, styles.usecaseContent)}>
      <h1 className={styles.title}>{usecase.title}</h1>
      <p className={styles.text}>{usecase.text}</p>
      <Link href="/#contact">
        <a className="learn-more-link">
          <p>Learn More</p>
        </a>
      </Link>
    </section>
  );
}
