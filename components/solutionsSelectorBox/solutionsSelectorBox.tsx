import React from 'react';
import cn from 'classnames';
import { useState } from 'react';
import Image from 'next/image';

import styles from './solutionsSelectorBox.module.scss';
import understandImg from '../../public/images/understand_graph.png';
import queryBuilderImg from '../../public/images/query-builder-300x154.png';
import screenNodeLinkImg from '../../public/images/screen-node-link-818x1024.png';

export default function SolutionsSelectorBox() {
  const articleSelectors = ['Understand', 'Query', 'Analyze', 'Explainable knowledge'];
  const [selected, setSelected] = useState('Understand');

  return (
    <div className={styles.container}>
      <div className={styles.buttonsContainer}>
        {articleSelectors.map((a, i) => (
          <div
            key={a}
            className={cn(styles.selectorButtonBox, {
              [styles.selected]: a == selected,
              [styles.rightShadow]: i == 0,
              [styles.leftShadow]: i == articleSelectors.length - 1,
              [styles.leftRightShadow]: i > 0 && i < articleSelectors.length - 1,
            })}
            onClick={() => setSelected(a)}
          >
            <p>{a}</p>
          </div>
        ))}
      </div>
      <div className={styles.solutionContentContainer}>{renderSolution(selected)}</div>
    </div>
  );
}

function renderSolution(article: String) {
  switch (article) {
    case 'Understand':
      return (
        <div>
          <h2>Understand your data</h2>
          <p>
            Our innovative Graph Schema Visualization depicts the query possibilities, graph
            relationships, and data quality. This view is unique in the graph analytics world, as it
            focuses on <span className={styles.highlight}>what is doable with the data</span>{' '}
            (task-level), rather than overwhelming the user with the raw data from the beginning
            without an idea where to start.
          </p>
          <div className="learn-more-link">
            <p>Learn More</p>
          </div>
          <div className={styles.solutionContentImageCenter}>
            <Image
              loader={({ src }: { src: string }) => src}
              src={understandImg}
              alt="Data flow image"
            />
          </div>
        </div>
      );

    case 'Query':
      return (
        <div>
          <h2>Query your data</h2>
          <p>
            Our innovative Query Definition Interface for editing and connecting of query
            (sub-)components works hand in hand with the Graph Schema Visualization and focusses on{' '}
            <span className={styles.highlight}>how to ask a specific data analysis question.</span>{' '}
            <br />
            Via a simple drag-and-drop it receives entities and relationships from the schema view
            and allows to connect, filter, nest, or transform (AVG, SUM, COUNT, SHORTESTPATH)
            subqueries.
          </p>
          <div className={styles.solutionContentImageRight}>
            <Image
              loader={({ src }: { src: string }) => src}
              src={queryBuilderImg}
              alt="Query image"
            />
          </div>
        </div>
      );

    case 'Analyze':
      return (
        <div>
          <h2>Analyze your data</h2>
          <p>
            GraphPolaris’ backend can harvest cloud-based resources to blend AI into the visual
            exploration process: Queries either explicitly or implicitly invoke (graph) machine
            learning algorithms (e.g., traversal, community detection, or centrality algorithm) and
            deliver visualization results or contribute exploration suggestions.
          </p>
          <div className={styles.solutionContentImageRight}>
            <Image
              loader={({ src }: { src: string }) => src}
              src={screenNodeLinkImg}
              alt="Query image"
            />
          </div>
        </div>
      );

    case 'Explainable knowledge':
      return (
        <div>
          <h2>Gain insight</h2>
          <p>
            Graph Data analysts, scientists, and crucially business managers need an effective
            communication channel to <span className={styles.highlight}>elaborate and justify</span>{' '}
            their findings and executive
            <span className={styles.highlight}> decision-making process.</span> The visualization
            domain presents a range of innovative solutions to make graph analysis understandable
            and our unique expertise allows us to benefit from these success stories. Unlike the
            rest of the market that uses only ineffective and clutter-prune node-link diagrams, we
            feature significantly more effective and efficient visualizations.
          </p>
        </div>
      );

    default:
      return <></>;
  }
}
