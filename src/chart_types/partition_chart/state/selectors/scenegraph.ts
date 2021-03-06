import { Dimensions } from '../../../../utils/dimensions';
import { shapeViewModel } from '../../layout/viewmodel/viewmodel';
import { measureText } from '../../layout/utils/measure';
import { ShapeTreeNode, ShapeViewModel, RawTextGetter, nullShapeViewModel } from '../../layout/types/viewmodel_types';
import { DEPTH_KEY } from '../../layout/utils/group_by_rollup';
import { PartitionSpec, Layer } from '../../specs/index';
import { identity, mergePartial, RecursivePartial } from '../../../../utils/commons';
import { config as defaultConfig } from '../../layout/config/config';
import { Config } from '../../layout/types/config_types';

function rawTextGetter(layers: Layer[]): RawTextGetter {
  return (node: ShapeTreeNode) => {
    const accessorFn = layers[node[DEPTH_KEY] - 1].nodeLabel || identity;
    return `${accessorFn(node.dataName)}`;
  };
}

export function render(partitionSpec: PartitionSpec, parentDimensions: Dimensions): ShapeViewModel {
  const { width, height } = parentDimensions;
  const { layers, data: facts, config: specConfig } = partitionSpec;
  const textMeasurer = document.createElement('canvas');
  const textMeasurerCtx = textMeasurer.getContext('2d');
  const partialConfig: RecursivePartial<Config> = { ...specConfig, width, height };
  const config: Config = mergePartial(defaultConfig, partialConfig);
  if (!textMeasurerCtx) {
    return nullShapeViewModel(config, { x: width / 2, y: height / 2 });
  }
  return shapeViewModel(
    measureText(textMeasurerCtx),
    config,
    layers,
    facts,
    rawTextGetter(layers),
    partitionSpec.valueAccessor,
    partitionSpec.valueFormatter,
    [() => null, ...layers.map(({ groupByRollup }) => groupByRollup)],
  );
}
