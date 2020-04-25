import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import strip from '@rollup/plugin-strip';

export default {
  input: "index.ts",
  output: {
    dir: "build",
    format: "cjs",
  },
  plugins: [
    typescript(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    strip({
      include: [
        '**/*.ts',
      ],
      functions: ['logger','cleanLog']
    }),
  ],
};
