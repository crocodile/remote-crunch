<template>
  <div>
    <div :id="editorId" style="width: 100%; min-height: 12em"></div>
    <b-alert
      :show="dismissCountDown"
      fade
      variant="danger"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      <a href="#" class="alert-link">Sorry, this part of the code is not editable 😨</a>
    </b-alert>
  </div>
</template>


<script>
var topMarkerId;
var bottomMarkerId;

export default {
  name: "CodeEditor",
  props: [
    "editorId",
    "paramId",
    "content",
    "topForbiddenRows",
    "bottomForbiddenRows"
  ],
  data() {
    return {
      editor: Object,
      dismissSecs: 1,
      dismissCountDown: 0
    };
  },
  watch: {
    content(value) {
      this.editor.setValue(value);
    }
  },
  mounted() {
    this.editor = window.ace.edit(this.editorId);
    this.editor.setValue(this.content);
    this.$parent[this.paramId] = this.editor.getValue();
    this.editor.setTheme("ace/theme/monokai");
    this.editor.getSession().setMode("ace/mode/python");
    this.editor.setOption("maxLines", "Infinity");

    this.editor.on("change", () => {
      this.$parent.childEditorContent = this.editor.getValue();
    });

    this.decorateDisabledRows();

    // Prevent editing the lines which are not to be edited i.e.: disabling them this way
    var that = this;

    this.editor.commands.on("exec", function(e) {
      var rowCol = that.editor.selection.getCursor();
      if (
        rowCol.row <= that.topForbiddenRows 
         // There is a bug with the disabled rows - This is disabled for the time being.
        // || rowCol.row >= that.bottomDisablingStart
      ) {
        e.preventDefault();
        e.stopPropagation();
        that.showAlert();
      }
    });

    this.editor.on("change", delta => {
      if (delta.start.row > 0) {
        this.decorateDisabledRows();
      }
      // this.$parent[this.paramId] = this.editor.getValue(); This is no longer needed. We will do this as a pull rather then push upwards.
    });
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    decorateDisabledRows() {
      // Change the color of the rows which are not to be edited
      var Range = window.ace.require("ace/range").Range;
      this.editor.getSession().removeMarker(topMarkerId);

      // There is a bug with the disabled rows - This is disabled for the time being.
      //this.editor.getSession().removeMarker(bottomMarkerId);

      topMarkerId = this.editor
        .getSession()
        .addMarker(
          new Range(0, 0, this.topForbiddenRows, 0),
          "disabledRow",
          "fullLine"
        );

        // There is a bug with the disabled rows - This is disabled for the time being.
      // bottomMarkerId = this.editor
      //   .getSession()
      //   .addMarker(
      //     new Range(this.bottomDisablingStart, 0, this.lastLine, 0),
      //     "disabledRow",
      //     "fullLine"
      //   );

    },
     getEditorContent() {
        return this.editorgetValue();
     }
  },
  computed: {
    bottomDisablingStart: function() {
      return this.lastLine - this.bottomForbiddenRows;
    },
    lastLine: function() {
      return this.editor.getSession().getLength();
    }
  }
};
</script>

<style scoped>
.disabledRow {
  position: absolute;
  background: rgb(0, 0, 0);
  z-index: 20;
}
</style>