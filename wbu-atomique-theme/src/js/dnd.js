import "../scss/dnd.scss";

import DragAndDrop from "./drag-and-drop";
(function (Drupal) {
  Drupal.behaviors.drag_and_drop_files = {
    attach: function (context, settings) {
      const dropzones = once("drag_and_drop_files_run", ".dnd-dropzone", context);
      if (dropzones && dropzones.length) {
        const dnd = new DragAndDrop(dropzones, settings);
        dnd.build();
      }
    },
  };
})(Drupal);
