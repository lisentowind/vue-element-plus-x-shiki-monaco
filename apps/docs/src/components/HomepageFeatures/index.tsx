import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureListZh: FeatureItem[] = [
  {
    title: '🎨 精美的语法高亮',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        基于 Shiki 提供 VSCode 级别的语法高亮效果，支持多种主题风格，
        让代码展示更加美观和专业。
      </>
    ),
  },
  {
    title: '🚀 现代化开发体验',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        基于 Vue 3 组合式 API 和 TypeScript 构建，提供完整的类型支持
        和现代化的开发体验，让集成更加简单。
      </>
    ),
  },
  {
    title: '⚡ 强大且灵活',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        结合了 Monaco Editor 的强力编辑功能和 Shiki 的精准高亮，
        支持自定义工具栏和丰富的配置选项。
      </>
    ),
  },
];

const FeatureListEn: FeatureItem[] = [
  {
    title: '🎨 Beautiful Syntax Highlighting',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Powered by Shiki for VSCode-level syntax highlighting effects, supports multiple 
        theme styles, making code display more beautiful and professional.
      </>
    ),
  },
  {
    title: '🚀 Modern Development Experience',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Built with Vue 3 Composition API and TypeScript, providing complete type support
        and modern development experience for easier integration.
      </>
    ),
  },
  {
    title: '⚡ Powerful and Flexible',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Combines Monaco Editor's powerful editing capabilities with Shiki's precise highlighting,
        supports custom toolbars and rich configuration options.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description as string}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  const {i18n} = useDocusaurusContext();
  const FeatureList = i18n.currentLocale === 'zh-Hans' ? FeatureListZh : FeatureListEn;
  
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