<template>
  <div v-loading="state.loading" class="mt-8">
    <div class="mb-8">
      <el-select
        v-model="state.graphFile"
        :placeholder="$t('molecular.a21')"
        size="large"
        class="w-full"
        @change="startInitGraph"
      >
        <el-option
          v-for="(item, index) in state.fileNames"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div class="graph-container">
      <div id="cy" ref="cyRef" style="width: 100%; height: 400px"></div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, reactive, onBeforeMount } from "vue";
let { proxy } = getCurrentInstance();
import { getGrapmlFiles, getTaskResult } from "@/api/tasks.js";
import cytoscape from "cytoscape";

defineProps({
  uuid: {
    type: String,
    default: "",
  },
  dirName: {
    type: String,
    default: "",
  },
});

const state = reactive({
  fileNames: [],
  loading: false,
  graphFile: "",
  showGraph: false,
});

onBeforeMount(() => {
  get_files();
});

const get_files = async () => {
  state.loading = true;
  try {
    const res = await getGrapmlFiles({
      uuid: proxy.uuid,
      dirName: proxy.dirName,
    });
    if (res.success) {
      state.fileNames = res.data;
    } else {
      proxy.$elmsg.error(res.message);
    }
  } catch (e) {
    console.log(e);
  } finally {
    state.loading = false;
  }
};

const cyRef = ref(null);
let cy = null;

let startInitGraph = async (val) => {
  state.loading = true;
  const res = await getTaskResult({
    uuid: proxy.uuid,
    dirName: proxy.dirName,
    fileName: val,
  });
  if (res.success) {
    state.showGraph = true;
    await initGraph(res.data);
  } else {
    proxy.$elmsg.error(res.message);
  }
  state.loading = false;
};

const initGraph = async (content) => {
  try {
    const elements = parseGraphML(content);
    if (!cyRef.value) {
      throw new Error("Container element not found");
    }
    cy = cytoscape({
      container: cyRef.value,
      elements: elements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": (ele) => getNodeColor(ele.data("d1")),
            label: (ele) => ele.data("id"),
            width: 25,
            height: 25,
            "font-size": "10px",
            "text-valign": "top",
            "text-halign": "center",
            "text-wrap": "wrap",
            "text-max-width": "100px",
            "text-margin-y": 15,
            "color": "#ffffff", // 文本颜色改为白色
            "border-width": "1px",
            "border-color": "#ffffff", // 边框颜色改为白色
          },
        },
        {
          selector: "edge",
          style: {
            width: (ele) => Math.min(3, (parseFloat(ele.data("d6")) || 1) / 3),
            "line-color": "#ffffff", // 边颜色改为白色
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "arrow-scale": 0.8,
            label: (ele) => ele.data("d8"),
            "font-size": "6px",
            "text-rotation": "autorotate",
            "text-margin-y": "-10px",
            "color": "#ffffff", // 边标签文本颜色改为白色
          },
        },
      ],
      layout: {
        name: "cose",
        componentSpacing: 80,
        nodeRepulsion: function (node) {
          return 80000;
        },
        nodeOverlap: 20,
        idealEdgeLength: function (edge) {
          return 50;
        },
        edgeElasticity: function (edge) {
          return 100;
        },
        nestingFactor: 1.2,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0,
        fit: true,
        padding: 30,
        animate: false,
      },
    });

    // 添加交互
    cy.on("tap", "node", function (evt) {
      const node = evt.target;
    });

    cy.on("mouseover", "node", function (evt) {
      evt.target.style("border-width", "2px");
      evt.target.style("border-color", "#ff6b6b"); // 鼠标悬停时边框颜色改为亮色
    });

    cy.on("mouseout", "node", function (evt) {
      evt.target.style("border-width", "1px");
      evt.target.style("border-color", "#ffffff"); // 恢复边框颜色
    });
  } catch (error) {
    console.log(error);
    proxy.$elmsg.error(error);
  }
};

const parseGraphML = (content) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/xml");

  const nodes = Array.from(doc.getElementsByTagName("node")).map((node) => {
    const nodeData = {
      id: node.getAttribute("id"),
    };

    Array.from(node.getElementsByTagName("data")).forEach((data) => {
      const key = data.getAttribute("key");
      nodeData[key] = data.textContent;
    });

    return { data: nodeData, group: "nodes" };
  });

  const edges = Array.from(doc.getElementsByTagName("edge")).map(
    (edge, index) => {
      const edgeData = {
        id: `e${index}`,
        source: edge.getAttribute("source"),
        target: edge.getAttribute("target"),
      };

      Array.from(edge.getElementsByTagName("data")).forEach((data) => {
        const key = data.getAttribute("key");
        edgeData[key] = data.textContent;
      });

      return { data: edgeData, group: "edges" };
    }
  );

  return [...nodes, ...edges];
};

const getNodeColor = (level) => {
  const colors = {
    A: "#ff6b6b", // 红色
    B1: "#4ecdc4", // 青色
    B2: "#45b7d1", // 蓝色
    C1: "#96ceb4", // 绿色
    IS: "#ffd93d", // 黄色
    EDB: "#6c5ce7", // 紫色
  };
  return colors[level] || "#666666"; // 默认颜色
};
</script>

<style scoped>
.graph-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: #1e1e1e; /* 背景颜色改为深色 */
  border: 1px solid #333; /* 边框颜色改为深色 */
  border-radius: 4px;
}

#cy {
  width: 100%;
  height: 100%;
}
</style>