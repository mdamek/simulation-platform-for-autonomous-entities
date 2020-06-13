import {
    GpioMapping,
    LedMatrix,
    LedMatrixUtils,
    MatrixOptions,
    PixelMapperType,
    RuntimeOptions,
  } from 'rpi-led-matrix';
  
  
  export const matrixOptions: MatrixOptions = {
    ...LedMatrix.defaultMatrixOptions(),
    rows: 16,
    cols: 32,
    chainLength: 2,
    hardwareMapping: GpioMapping.RegularPi1,
    pixelMapperConfig: LedMatrixUtils.encodeMappers({ type: PixelMapperType.U })
  };
  
  export const runtimeOptions: RuntimeOptions = {
    ...LedMatrix.defaultRuntimeOptions(),
    gpioSlowdown:4
  };