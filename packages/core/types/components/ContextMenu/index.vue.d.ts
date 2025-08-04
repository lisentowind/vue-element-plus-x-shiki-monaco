import type {
  ContextMenuItem,
  ContextMenuPosition,
  MenuItem,
} from "../../hooks/useContextMenu";

interface Props {
  visible?: boolean;
  position?: ContextMenuPosition;
  items?: ContextMenuItem[];
  variant?: "classic" | "glass";
  theme?: string;
}
declare const _default: import("vue").DefineComponent<
  Props,
  {},
  {},
  {},
  {},
  import("vue").ComponentOptionsMixin,
  import("vue").ComponentOptionsMixin,
  {
    itemClick: (item: MenuItem) => any;
    hide: () => any;
  },
  string,
  import("vue").PublicProps,
  Readonly<Props> &
    Readonly<{
      onItemClick?: ((item: MenuItem) => any) | undefined;
      onHide?: (() => any) | undefined;
    }>,
  {
    visible: boolean;
    position: ContextMenuPosition;
    items: ContextMenuItem[];
    variant: "classic" | "glass";
    theme: string;
  },
  {},
  {},
  {},
  string,
  import("vue").ComponentProvideOptions,
  false,
  {},
  any
>;
export default _default;
