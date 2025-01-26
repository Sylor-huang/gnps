import { defineAsyncComponent } from 'vue';

export const MsDetail = defineAsyncComponent(() =>
  import("@/views/Results/MsDetail")
);

export const GraphDetail = defineAsyncComponent(() =>
  import("@/views/Results/GraphDetail")
);

export const MsMatchDetail = defineAsyncComponent(() =>
  import("@/views/Results/MsMatchDetail")
);

