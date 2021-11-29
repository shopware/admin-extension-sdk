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
    title: 'Easy to use',
    description: (
      <>
      You don't need to have knowledge about
      the internal of the Shopware 6 admin. The SDK hides the complicated stuff behind beautiful API.
      </>
    ),
  },
  {
    title: 'Many capabilities',
    description: (
      <>
        Throwing notifications, extending the current UI and much more. 
        The SDK provides a ton of extension for your ideas and solutions.
      </>
    ),
  },
  {
    title: 'Lightweight',
    description: (
      <>
         The whole library is completely tree-shakable, dependency-free and every functionality
         can be imported granularly so that your bundle stays small and fast.
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
