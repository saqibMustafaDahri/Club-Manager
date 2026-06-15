import { defineConfig } from "@lovable.dev/vite-tanstack-config";
export default defineConfig({
  tanstackStart: {
    router: {
      autoCodeSplitting: false,
      codeSplittingOptions: {
        defaultBehavior: [],
      },
    },
  },
});