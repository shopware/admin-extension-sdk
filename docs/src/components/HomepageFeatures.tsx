/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Simple API',
    description: (
      <>
      The AdminAppActions library was designed to make the communcation
      to the admin simple and easy.
      </>
    ),
  },
  {
    title: 'Extremely small footprint',
    description: (
      <>
        The library is designed to have a very small bundle size so that it
        don't extend you app size much.
      </>
    ),
  },
  {
    title: 'Full type support',
    description: (
      <>
        The library is completely written in Typescript so that you get the best developer experience
        possible.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
