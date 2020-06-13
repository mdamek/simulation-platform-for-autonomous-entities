import { LedMatrix, GpioMapping, LedMatrixUtils, PixelMapperType } from 'rpi-led-matrix';
import { performance } from 'perf_hooks';
const matrixRGB = new LedMatrix(
  {
    ...LedMatrix.defaultMatrixOptions(),
    rows: 16,
    cols: 32,
    chainLength: 2,
    hardwareMapping: GpioMapping.RegularPi1,
    pixelMapperConfig: LedMatrixUtils.encodeMappers({ type: PixelMapperType.U })
  },
  {
    ...LedMatrix.defaultRuntimeOptions(),
    gpioSlowdown:4,
  }
);

console.log(matrixRGB.width())
console.log(matrixRGB.height())
function getRndInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) ) + min;
}
let c = 0;
let start = performance.now();
while(c < 1200){
  let color = {r: getRndInteger(0,255), g: getRndInteger(0,255), b: getRndInteger(0,255)}
  for(let i = 0; i < matrixRGB.width(); i++){
    for(let j = 0; j < matrixRGB.height(); j++){
      matrixRGB.fgColor(color).setPixel(i,j);
    }
  }  
  matrixRGB.sync()
  c++;
}
let stop = performance.now();
console.log("Time:" + (stop - start));