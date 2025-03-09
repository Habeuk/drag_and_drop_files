/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/js/drag-and-drop.js
class DragAndDrop {
  constructor(dropzone, configs = []) {
    this.dropzone = dropzone;
    this.configs = configs;
    this.fids = [];
  }

  /**
   * Initialisation
   */
  build() {
    const dropzone = this.dropzone;
    const fileInput = dropzone.parentNode.querySelector(".dnd-file-input");
    const previews = dropzone.parentNode.querySelector(".dnd-previews");
    const type = dropzone.parentNode.getAttribute("type");
    this.manageDragZone(dropzone, fileInput);
    this.uploadFiles(dropzone, fileInput, previews, type);
    if (!type.includes("image")) {
      previews.classList.add("files-document");
    }
    this.ManageOldFile(dropzone, fileInput, previews, type);
  }
  ManageOldFile(dropzone, fileInput, previews, type) {
    const fidInput = dropzone.parentNode.querySelector("input.drag_and_drop_files--fids");
    const fids = fidInput.value ? JSON.parse(fidInput.value) : [];
    const generatedElements = {};
    if (fidInput && fids.length > 0) {
      fids.forEach(fid => {
        // On affiche le preview.
        generatedElements[fid] = this.previewBoxImage();
        previews.appendChild(generatedElements[fid].container_image);
        //
        fetch("/drag_and_drop_files/get_img_url/" + fid, {
          method: "GET",
          headers: {
            Accept: "application/json"
          }
        }).then(response => {
          if (!response.ok) throw new Error("Erreur réseau");
          return response.json();
        }).then(data => {
          if (!data.fid) data.fid = fid;
          this.presaveFiles(dropzone, fileInput, generatedElements[fid], data, previews, type);
        }).catch(error => {
          console.error("Erreur:", error);
        });
      });
    }
  }
  //
  uploadFiles(dropzone, fileInput, previews, type) {
    fileInput.addEventListener("change", e => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      // On affiche le preview.
      const generatedElement = this.previewBoxImage();
      previews.appendChild(generatedElement.container_image);
      // Upload avec Fetch API.
      fetch("/drag_and_drop_files/upload", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      }).then(response => {
        if (!response.ok) throw new Error("Erreur réseau");
        return response.json();
      }).then(data => {
        this.presaveFiles(dropzone, fileInput, generatedElement, data, previews, type);
      }).catch(error => {
        console.error("Erreur:", error);
      });
    });
  }
  //
  manageDragZone(dropzone, fileInput) {
    dropzone.addEventListener("dragover", e => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });
    dropzone.addEventListener("dragleave", e => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
    });
    dropzone.addEventListener("drop", e => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      const files = e.dataTransfer.files;
      if (files.length) {
        fileInput.files = files;
        fileInput.dispatchEvent(new Event("change"));
      }
    });

    // Clic pour ouvrir le sélecteur de fichiers
    dropzone.addEventListener("click", () => {
      fileInput.click();
    });
  }
  /**
   * Ajoute l'id du fichier dans un champs.
   * @param {*} dropzone
   * @param {*} fileInput
   * @param {*} generatedElement
   * @param {*} data
   * @param {*} previews
   * @param {*} type
   */
  presaveFiles(dropzone, fileInput, generatedElement, data, previews, type) {
    if (!this.fids.includes(data.fid)) {
      this.fids.push(data.fid);
    }
    const putInInput = () => {
      const fidInput = dropzone.parentNode.querySelector("input.drag_and_drop_files--fids");
      if (fidInput) fidInput.value = JSON.stringify(this.fids);
    };
    // Affiche l'aperçu
    if (!data.url) {
      generatedElement.content_bg.style.backgroundImage = "url(/modules/contrib/drag_and_drop_files/images/file-not-found-2.jpg)";
      data.filename = "Image non disponible";
    } else {
      if (type.includes("image")) {
        generatedElement.content_bg.style.backgroundImage = `url(${data.url})`;
      } else if (type.includes("video")) {
        generatedElement.content_bg.style.backgroundImage = "url(/modules/contrib/drag_and_drop_files/images/video-player.svg)";
      } else {
        generatedElement.content_bg.style.backgroundImage = "url(/modules/contrib/drag_and_drop_files/images/free-file-icon.png)";
      }
    }
    //

    generatedElement.imge_title.innerHTML = data.filename;
    generatedElement.imge_title.setAttribute("href", data.url);
    generatedElement.imge_title.setAttribute("download", data.filename);
    generatedElement.progressbar.classList.add("complete");
    generatedElement.container_image.classList.add("complete");
    generatedElement.icone_remove.addEventListener("click", () => {
      previews.removeChild(generatedElement.container_image);
      let index = this.fids.indexOf(data.fid);
      if (index !== -1) {
        this.fids.splice(index, 1);
        putInInput();
      }
    });
    fileInput.value = "";
    putInInput();
  }
  previewBoxImage() {
    const generatedElement = {
      container_image: document.createElement("div"),
      content_bg: document.createElement("div"),
      content_text: document.createElement("div"),
      imge_title: document.createElement("a"),
      progressbar: document.createElement("span"),
      icone_complete: document.createElement("span"),
      icone_remove: document.createElement("span")
    };
    generatedElement.container_image.classList.add("container_image");
    generatedElement.content_bg.classList.add("content_bg");
    generatedElement.content_text.classList.add("content_text");
    generatedElement.imge_title.classList.add("imge_title", "text-black", "fw-bold");
    generatedElement.progressbar.classList.add("progressbar");
    generatedElement.icone_complete.classList.add("icone_complete", "svg");
    generatedElement.icone_remove.classList.add("icone_remove", "svg");
    generatedElement.imge_title.innerHTML = "Chargement encours ...";
    generatedElement.imge_title.setAttribute("href", "#");
    generatedElement.content_text.appendChild(generatedElement.imge_title);
    generatedElement.content_text.appendChild(generatedElement.progressbar);
    generatedElement.content_text.appendChild(generatedElement.icone_complete);
    generatedElement.content_text.appendChild(generatedElement.icone_remove);
    generatedElement.container_image.appendChild(generatedElement.content_bg);
    generatedElement.container_image.appendChild(generatedElement.content_text);
    const svgCode = `
        <svg version="1.1" width="2rem" height="2rem" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 117.72 117.72" xml:space="preserve">
          <style type="text/css">
            <![CDATA[
              .st0{fill:#01A601;}
            ]]>
          </style>
          <g>
            <path class="st0" d="M58.86,0c9.13,0,17.77,2.08,25.49,5.79c-3.16,2.5-6.09,4.9-8.82,7.21c-5.2-1.89-10.81-2.92-16.66-2.92 c-13.47,0-25.67,5.46-34.49,14.29c-8.83,8.83-14.29,21.02-14.29,34.49c0,13.47,5.46,25.66,14.29,34.49 c8.83,8.83,21.02,14.29,34.49,14.29s25.67-5.46,34.49-14.29c8.83-8.83,14.29-21.02,14.29-34.49c0-3.2-0.31-6.34-0.9-9.37 c2.53-3.3,5.12-6.59,7.77-9.85c2.08,6.02,3.21,12.49,3.21,19.22c0,16.25-6.59,30.97-17.24,41.62 c-10.65,10.65-25.37,17.24-41.62,17.24c-16.25,0-30.97-6.59-41.62-17.24C6.59,89.83,0,75.11,0,58.86 c0-16.25,6.59-30.97,17.24-41.62S42.61,0,58.86,0L58.86,0z M31.44,49.19L45.8,49l1.07,0.28c2.9,1.67,5.63,3.58,8.18,5.74 c1.84,1.56,3.6,3.26,5.27,5.1c5.15-8.29,10.64-15.9,16.44-22.9c6.35-7.67,13.09-14.63,20.17-20.98l1.4-0.54H114l-3.16,3.51 C101.13,30,92.32,41.15,84.36,52.65C76.4,64.16,69.28,76.04,62.95,88.27l-1.97,3.8l-1.81-3.87c-3.34-7.17-7.34-13.75-12.11-19.63 c-4.77-5.88-10.32-11.1-16.79-15.54L31.44,49.19L31.44,49.19z"/>
          </g>
        </svg>
        `;
    generatedElement.icone_complete.innerHTML = svgCode;
    const svgCodeRemove = `
        <svg version="1.1" width="2rem" height="2rem" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 108.294 122.88" xml:space="preserve">
          <g>
            <path d="M4.873,9.058h33.35V6.2V6.187c0-0.095,0.002-0.186,0.014-0.279c0.075-1.592,0.762-3.037,1.816-4.086l-0.007-0.007 c1.104-1.104,2.637-1.79,4.325-1.806l0.023,0.002V0h0.031h19.884h0.016c0.106,0,0.207,0.009,0.309,0.022 c1.583,0.084,3.019,0.76,4.064,1.81c1.102,1.104,1.786,2.635,1.803,4.315l-0.003,0.021h0.014V6.2v2.857h32.909h0.017 c0.138,0,0.268,0.014,0.401,0.034c1.182,0.106,2.254,0.625,3.034,1.41l0.004,0.007l0.005-0.007 c0.851,0.857,1.386,2.048,1.401,3.368l-0.002,0.032h0.014v0.032v10.829c0,1.472-1.195,2.665-2.667,2.665h-0.07H2.667 C1.195,27.426,0,26.233,0,24.762v-0.063V13.933v-0.014c0-0.106,0.004-0.211,0.018-0.315v-0.021 c0.089-1.207,0.624-2.304,1.422-3.098l-0.007-0.002C2.295,9.622,3.49,9.087,4.81,9.069l0.032,0.002V9.058H4.873L4.873,9.058z M77.79,49.097h-5.945v56.093h5.945V49.097L77.79,49.097z M58.46,49.097h-5.948v56.093h5.948V49.097L58.46,49.097z M39.13,49.097 h-5.946v56.093h5.946V49.097L39.13,49.097z M10.837,31.569h87.385l0.279,0.018l0.127,0.007l0.134,0.011h0.009l0.163,0.023 c1.363,0.163,2.638,0.789,3.572,1.708c1.04,1.025,1.705,2.415,1.705,3.964c0,0.098-0.009,0.193-0.019,0.286l-0.002,0.068 l-0.014,0.154l-7.393,79.335l-0.007,0.043h0.007l-0.016,0.139l-0.051,0.283l-0.002,0.005l-0.002,0.018 c-0.055,0.331-0.12,0.646-0.209,0.928l-0.007,0.022l-0.002,0.005l-0.009,0.018l-0.023,0.062l-0.004,0.021 c-0.118,0.354-0.264,0.698-0.432,1.009c-1.009,1.88-2.879,3.187-5.204,3.187H18.13l-0.247-0.014v0.003l-0.011-0.003l-0.032-0.004 c-0.46-0.023-0.889-0.091-1.288-0.202c-0.415-0.116-0.818-0.286-1.197-0.495l-0.009-0.002l-0.002,0.002 c-1.785-0.977-2.975-2.882-3.17-5.022L4.88,37.79l-0.011-0.125l-0.011-0.247l-0.004-0.116H4.849c0-1.553,0.664-2.946,1.707-3.971 c0.976-0.955,2.32-1.599,3.756-1.726l0.122-0.004v-0.007l0.3-0.013l0.104,0.002V31.569L10.837,31.569z M98.223,36.903H10.837 v-0.007l-0.116,0.004c-0.163,0.022-0.322,0.106-0.438,0.222c-0.063,0.063-0.104,0.132-0.104,0.179h-0.007l0.007,0.118l7.282,79.244 h-0.002l0.002,0.012c0.032,0.376,0.202,0.691,0.447,0.825l-0.002,0.004l0.084,0.032l0.063,0.012h0.077h72.695 c0.207,0,0.399-0.157,0.518-0.377l0.084-0.197l0.054-0.216l0.014-0.138h0.005l7.384-79.21L98.881,37.3 c0-0.045-0.041-0.111-0.103-0.172c-0.12-0.118-0.286-0.202-0.451-0.227L98.223,36.903L98.223,36.903z M98.334,36.901h-0.016H98.334 L98.334,36.901z M98.883,37.413v-0.004V37.413L98.883,37.413z M104.18,37.79l-0.002,0.018L104.18,37.79L104.18,37.79z M40.887,14.389H5.332v7.706h97.63v-7.706H67.907h-0.063c-1.472,0-2.664-1.192-2.664-2.664V6.2V6.168h0.007 c-0.007-0.22-0.106-0.433-0.259-0.585c-0.137-0.141-0.324-0.229-0.521-0.252h-0.082h-0.016H44.425h-0.031V5.325 c-0.213,0.007-0.422,0.104-0.576,0.259l-0.004-0.004l-0.007,0.004c-0.131,0.134-0.231,0.313-0.259,0.501l0.007,0.102V6.2v5.524 C43.554,13.196,42.359,14.389,40.887,14.389L40.887,14.389z"/>
          </g>
        </svg>
        `;
    generatedElement.icone_remove.innerHTML = svgCodeRemove;
    return generatedElement;
  }
}
/* harmony default export */ const drag_and_drop = (DragAndDrop);
;// ./src/js/dnd.js


(function (Drupal) {
  Drupal.behaviors.drag_and_drop_files = {
    attach: function (context, settings) {
      const dropzones = once("drag_and_drop_files_run", ".dnd-dropzone", context);
      if (dropzones && dropzones.length) {
        const configs = settings.drag_and_drop_files ? settings.drag_and_drop_files : {};
        dropzones.forEach(dropzone => {
          const dnd = new drag_and_drop(dropzone, configs);
          dnd.build();
        });
      }
    }
  };
})(Drupal);
/******/ })()
;