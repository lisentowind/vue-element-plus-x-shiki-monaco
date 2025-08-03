import clsx from "clsx";
import Heading from "@theme/Heading";
import Translate from "@docusaurus/Translate";
import styles from "./styles.module.css";

type FeatureItem = {
  titleId: string;
  descriptionId: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
};

const FeatureList: FeatureItem[] = [
  {
    titleId: "homepage.features.beautiful-syntax.title",
    descriptionId: "homepage.features.beautiful-syntax.description",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
  },
  {
    titleId: "homepage.features.modern-dev.title",
    descriptionId: "homepage.features.modern-dev.description",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
  },
  {
    titleId: "homepage.features.powerful-flexible.title",
    descriptionId: "homepage.features.powerful-flexible.description",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
  },
];

function Feature({ titleId, descriptionId, Svg }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">
          <Translate id={titleId}>Default Title</Translate>
        </Heading>
        <p>
          <Translate id={descriptionId}>Default Description</Translate>
        </p>
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
