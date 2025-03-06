import "../scss/dnd.scss";

import DragAndDrop from "./drag-and-drop";
(function (Drupal) {
  Drupal.behaviors.drag_and_drop_files = {
    attach: function (context, settings) {
      const dropzones = context.querySelectorAll(".dnd-dropzone:not([data-dnd-processed])");
      if (dropzones && dropzones.length) {
        console.log("dropzones : ", dropzones);
        const dnd = new DragAndDrop(dropzones, settings);
        dnd.build();
      }
    },
  };
})(Drupal);
