// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  LevaPanel,
  useControls as useControlsImpl,
  useCreateStore
} from "leva";
import { FC } from "react";
import { Object3D } from "three";

interface Props {
  selected: Object3D[] | undefined;
}

export const Panel: FC<Props> = ({ selected }) => {
  if (selected) {
    return <LevaPanel store={selected[0]?.userData.store} />;
  }

  return <LevaPanel />;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useControls = (selected, props) => {
  const store = useCreateStore();
  const isFirst = selected[0] === store;
  const materialProps = useControlsImpl(
    Object.keys(props).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          ...props[key],
          transient: false,
          onChange: (value, path, ctx) =>
            !ctx.initial &&
            isFirst &&
            selected.length > 1 &&
            selected.forEach((s, i) => i > 0 && s.setValueAtPath(path, value)),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render: (get) =>
            selected.length === 1 ||
            selected.every((store) => store.getData()[key])
        }
      }),
      {}
    ),
    { store },
    [selected]
  );
  return [store, materialProps];
};
