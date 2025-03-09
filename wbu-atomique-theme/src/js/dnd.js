import "../scss/dnd.scss";

import DragAndDrop from "./drag-and-drop";
(function (Drupal) {
  Drupal.behaviors.drag_and_drop_files = {
    attach: function (context, settings) {
      const dropzones = once("drag_and_drop_files_run", ".dnd-dropzone", context);
      if (dropzones && dropzones.length) {
        const configs = settings.drag_and_drop_files ? settings.drag_and_drop_files : {};
        dropzones.forEach((dropzone) => {
          const dnd = new DragAndDrop(dropzone, configs);
          dnd.build();
        });
      }
    },
  };
})(Drupal);
