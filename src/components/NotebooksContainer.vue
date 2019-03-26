<template>
  <b-container>
    <h1>{{ msg }}</h1>
    <p>This script will be sent to Spark 2 on Hadoop 3.1.1.3.0.1.0-187</p>
    <b-card no-body>
      <b-tabs v-model="tabIndex" card>
        <!-- Render Tabs, supply a unique `key` to each tab -->
        <b-tab v-for="t in tabs" :key="`dyntab-${t['sessionId']}`">
          <template slot="title">
            <table cellspacing="2">
              <tr>
                <a>{{ `Session ${t["sessionId"]}` }}</a>
              </tr>
              <tr>
                <b-badge pill variant="primary" class="float-left mt-1" v-if="t.state === 'starting'">Starting</b-badge>
                <b-badge
                  pill
                  variant="secondary"
                  class="float-left mt-1"
                  v-if="t.state === 'shutting_down'"
                >Shutting down</b-badge>
                <b-badge pill variant="success" class="float-left mt-1" v-if="t.state === 'idle'">Idle</b-badge>
                <b-badge pill variant="danger" class="float-left mt-1" v-if="t.state === 'error'">Error</b-badge>
                <b-badge pill variant="warning" class="float-left mt-1" v-if="t.state === 'busy'">Busy</b-badge>
                <b-badge pill variant="info" class="float-left mt-1" v-if="t.state === 'success'">Stopped</b-badge>
                <b-badge pill variant="light" class="float-left mt-1" v-if="t.state === 'not_started'">Not started</b-badge>
                <b-badge pill variant="dark" class="float-left mt-1" v-if="t.state === 'dead'">Dead</b-badge>
              </tr>
            </table>
          </template>

          <Notebook
            :sessionId="t['sessionId']"
            :state="t['state']"
            @onDelete="
              sessionId => {
                deleteTab(sessionId);
              }
            "
          ></Notebook>
        </b-tab>

        <!-- New Tab Button (Using tabs slot) -->
        <template slot="tabs">
          <b-nav-item @click.prevent="newTab" href="#">
            <b>+</b>
          </b-nav-item>
        </template>

        <!-- Render this if no tabs -->
        <div slot="empty" class="text-center text-muted">
          There are no open session tabs
          <br>Start a new Spark session using the
          <b>+</b> button above.
        </div>
      </b-tabs>
    </b-card>
    <p v-if="isLoading" class="text-monospace text-left blink">
      <small>{{ loadingMsg }}</small>
    </p>

    <loading :active.sync="isLoading" :can-cancel="true" :on-cancel="onCancel" :is-full-page="isFullPage"></loading>
  </b-container>
</template>


// _______________________________________________________________________________________________________________


<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Notebook from "./Notebook.vue";

// --------- Axios library for rest API calls ----------
const axiosInstance = require("axios").create({
  baseURL: "http://localhost:8082",
  headers: { "content-type": "application/json" }
});

// Set up logging
require("axios-debug-log");
localStorage.debug = "axios";

export default {
  name: "NotebooksContainer",
  components: {
    Loading,
    Notebook
  },
  props: {
    msg: String
  },
  data() {
    return {
      tabIndex: 0,
      tabs: [],
      isLoading: false,
      isFullPage: false,
      loadingMsg: "Just a moment, communicating with Spark..."
    };
  },
  methods: {
    deleteTab(sessionId) {
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].sessionId === sessionId) {
          this.tabs.splice(i, 1);
        }
      }
    },
    loadSessions() {
      axiosInstance
        .get("/sessions", {
          from: 0,
          size: 25
        })
        .then(response => {
          var sessionsList = response.data.sessions;

          // There are no sessions on Livy, so nothing else to do here
          if (sessionsList.length < 1) return;

          // Update tabs
          this.tabs = [];

          sessionsList.forEach((session, index) => {
            this.tabs.push({
              sessionId: response.data.sessions[index].id,
              state: response.data.sessions[index].state
            });
          });
          this.setActiveTab(that.tabs.length - 1);
        });
    },
    newTab() {
      axiosInstance
        .post("/sessions", {
          kind: "pyspark"
        })
        .then(response => {
          this.tabs.push({
            sessionId: response.data.id,
            state: response.data.state
          });
          this.setActiveTab(this.tabs.length - 1);
        });
    },
    onCancel() {
      console.log(
        "User cancelled the loader." /* eslint-disable-line no-console */
      );
    },
    setActiveTab(index) {
      this.$nextTick(() => {
        this.tabIndex = index;
      });
    }
  },
  created() {
    // // Before a request is made start the progress indicator
    // axiosInstance.interceptors.request.use(config => {
    //   this.isLoading = true;
    //   return config;
    // });
    // // Before a response is returned stop the progress indicator
    // axiosInstance.interceptors.response.use(response => {
    //   this.isLoading = false;
    //   return;
    // });
  },
  mounted() {
    this.loadSessions();
  }
};
</script>


// _______________________________________________________________________________________________________________


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.blink {
  animation: blink 1.5s linear infinite;
  animation-direction: alternate;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
