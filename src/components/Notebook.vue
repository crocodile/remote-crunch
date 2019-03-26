<template>
  <div>
    <b-row align-h="between" class="my-3">
      <b-col cols="4">
        <b-button
          variant="outline-primary"
          class="float-left"
          @click="() => getSessionState(sessionId)"
        >Refresh</b-button>
      </b-col>
      <b-col cols="4">
        <b-button
          size="sm"
          variant="danger"
          class="float-right"
          @click="() => deleteSession(sessionId)"
        >DELETE</b-button>
      </b-col>
    </b-row>

    <!-- This card will explain the data available -->
    <b-card
      class="my-3"
      title="DATASET"
      sub-title="Your python script will be run on this data on a remote Hadoop cluster"
    >
      <br>
      <a class="float-left">Sample records:</a>
      <b-table striped hover :items="dataExampleItems"/>
      <br>
      <a class="float-left">Records available: 100,000</a>
      <br>
      <a class="float-left">
        This is public data published by
        <a
          href="https://grouplens.org/datasets/movielens/"
          class="card-link"
        >grouplens.org</a>.
      </a>
    </b-card>

    <code-editor
      class="my-3"
      editor-id="editorA"
      param-id
      content="print('hello')"
      top-forbidden-rows="0"
      bottom-forbidden-rows="0"
      ref="editorComponent"
    />

    <b-row>
      <b-col cols="12">
        <a class="float-left">
          Spark
          <a href="https://spark.apache.org/examples.html" class="card-link">MLLib</a> examles.
        </a>
      </b-col>
    </b-row>

    <!-- This card will shows the result of the execution if it's available -->
    <b-card class="my-3" title="RESULT">
      <b-card-text>
        <b-link
          v-if="submitted"
          v-bind:href="resultLink"
        >Click here to check for the result: {{resultLink}}</b-link>
        <pre class="language-json"><code>{{crunchResult}}</code></pre>
      </b-card-text>
    </b-card>

    <b-button
      block
      variant="primary"
      @click="() => submitScript(sessionId)"
      :disabled="submitted"
    >SEND SCRIPT TO SPARK</b-button>
  </div>
</template>

// _______________________________________________________________________________________________________________

<script>
import CodeEditor from "./CodeEditor.vue";
import sampleInputData from "./sampleInputData.js";
import sampleCode from "./sampleCode.js";

// --------- Axios library for rest API calls ----------
const axiosInstance = require("axios").create({
  baseURL: "http://178.128.25.20:8082",
  headers: { "content-type": "application/json" }
});

// Set up logging
require("axios-debug-log");
localStorage.debug = "axios";
//ToDo Figure out how to reuse

export default {
  name: "Notebook",
  components: {
    CodeEditor
  },
  props: {
    sessionId: Number,
    state: String
  },
  data() {
    return {
      submitted: false,
      resultLink: "",
      dataExampleItems: sampleInputData,
      crunchResult: "After submission the results will be displayed here"
    };
  },
  methods: {
    submitScript(sessionObj) {
      var editorContent = this.$refs.editorComponent[0].getEditorContent(); //ToDo! Hardcoded for 0!
      axiosInstance
        .post("/sessions/" + sessionObj.sessionId + "/statements", {
          code: sampleCode.wrapBegin + editorContent + sampleCode.wrapEnd
        })
        .then(response => {
          this.crunchResult = response.data;
        })
        .catch(e => {
          alert(e.response.data);
        });
    },
    getSessionState(sessionId) {
      axiosInstance.get("/sessions/" + sessionId + "/state").then(response => {
        this.state = response.data.state;
      });
    },
    deleteSession(sessionId) {
      axiosInstance
        .delete("/sessions/" + sessionId)
        .then(() => {
          this.$emit("onDelete", this.sessionId);
        })
        .catch(e => {
          alert(e.response.data);
        });
    }
  },
  created() {
    //ToDo Duplicate
    // Before a request is made start the progress indicator
    axiosInstance.interceptors.request.use(config => {
      this.isLoading = true;
      return config;
    });

    // Before a response is returned stop the progress indicator
    axiosInstance.interceptors.response.use(response => {
      this.isLoading = false;
      return response;
    });
  }
};
</script>

// _______________________________________________________________________________________________________________

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>