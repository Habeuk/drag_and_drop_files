/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/drag-and-drop.js":
/*!*********************************!*\
  !*** ./src/js/drag-and-drop.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DragAndDrop);

/***/ }),

/***/ "./src/scss/dnd.scss":
/*!***************************!*\
  !*** ./src/scss/dnd.scss ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/js/dnd.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_dnd_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/dnd.scss */ "./src/scss/dnd.scss");
/* harmony import */ var _drag_and_drop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./drag-and-drop */ "./src/js/drag-and-drop.js");


(function (Drupal) {
  Drupal.behaviors.drag_and_drop_files = {
    attach: function (context, settings) {
      const dropzones = once("drag_and_drop_files_run", ".dnd-dropzone", context);
      if (dropzones && dropzones.length) {
        const configs = settings.drag_and_drop_files ? settings.drag_and_drop_files : {};
        dropzones.forEach(dropzone => {
          const dnd = new _drag_and_drop__WEBPACK_IMPORTED_MODULE_1__["default"](dropzone, configs);
          dnd.build();
        });
      }
    }
  };
})(Drupal);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vanMvZG5kLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsTUFBTUEsV0FBVyxDQUFDO0VBQ2hCQyxXQUFXQSxDQUFDQyxRQUFRLEVBQUVDLE9BQU8sR0FBRyxFQUFFLEVBQUU7SUFDbEMsSUFBSSxDQUFDRCxRQUFRLEdBQUdBLFFBQVE7SUFDeEIsSUFBSSxDQUFDQyxPQUFPLEdBQUdBLE9BQU87SUFDdEIsSUFBSSxDQUFDQyxJQUFJLEdBQUcsRUFBRTtFQUNoQjs7RUFFQTtBQUNGO0FBQ0E7RUFDRUMsS0FBS0EsQ0FBQSxFQUFHO0lBQ04sTUFBTUgsUUFBUSxHQUFHLElBQUksQ0FBQ0EsUUFBUTtJQUM5QixNQUFNSSxTQUFTLEdBQUdKLFFBQVEsQ0FBQ0ssVUFBVSxDQUFDQyxhQUFhLENBQUMsaUJBQWlCLENBQUM7SUFDdEUsTUFBTUMsUUFBUSxHQUFHUCxRQUFRLENBQUNLLFVBQVUsQ0FBQ0MsYUFBYSxDQUFDLGVBQWUsQ0FBQztJQUNuRSxNQUFNRSxJQUFJLEdBQUdSLFFBQVEsQ0FBQ0ssVUFBVSxDQUFDSSxZQUFZLENBQUMsTUFBTSxDQUFDO0lBQ3JELElBQUksQ0FBQ0MsY0FBYyxDQUFDVixRQUFRLEVBQUVJLFNBQVMsQ0FBQztJQUN4QyxJQUFJLENBQUNPLFdBQVcsQ0FBQ1gsUUFBUSxFQUFFSSxTQUFTLEVBQUVHLFFBQVEsRUFBRUMsSUFBSSxDQUFDO0lBQ3JELElBQUksQ0FBQ0EsSUFBSSxDQUFDSSxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7TUFDM0JMLFFBQVEsQ0FBQ00sU0FBUyxDQUFDQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7SUFDMUM7SUFDQSxJQUFJLENBQUNDLGFBQWEsQ0FBQ2YsUUFBUSxFQUFFSSxTQUFTLEVBQUVHLFFBQVEsRUFBRUMsSUFBSSxDQUFDO0VBQ3pEO0VBRUFPLGFBQWFBLENBQUNmLFFBQVEsRUFBRUksU0FBUyxFQUFFRyxRQUFRLEVBQUVDLElBQUksRUFBRTtJQUNqRCxNQUFNUSxRQUFRLEdBQUdoQixRQUFRLENBQUNLLFVBQVUsQ0FBQ0MsYUFBYSxDQUFDLGlDQUFpQyxDQUFDO0lBQ3JGLE1BQU1KLElBQUksR0FBR2MsUUFBUSxDQUFDQyxLQUFLLEdBQUdDLElBQUksQ0FBQ0MsS0FBSyxDQUFDSCxRQUFRLENBQUNDLEtBQUssQ0FBQyxHQUFHLEVBQUU7SUFDN0QsTUFBTUcsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLElBQUlKLFFBQVEsSUFBSWQsSUFBSSxDQUFDbUIsTUFBTSxHQUFHLENBQUMsRUFBRTtNQUMvQm5CLElBQUksQ0FBQ29CLE9BQU8sQ0FBRUMsR0FBRyxJQUFLO1FBQ3BCO1FBQ0FILGlCQUFpQixDQUFDRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUNDLGVBQWUsQ0FBQyxDQUFDO1FBQy9DakIsUUFBUSxDQUFDa0IsV0FBVyxDQUFDTCxpQkFBaUIsQ0FBQ0csR0FBRyxDQUFDLENBQUNHLGVBQWUsQ0FBQztRQUM1RDtRQUNBQyxLQUFLLENBQUMsbUNBQW1DLEdBQUdKLEdBQUcsRUFBRTtVQUMvQ0ssTUFBTSxFQUFFLEtBQUs7VUFDYkMsT0FBTyxFQUFFO1lBQ1BDLE1BQU0sRUFBRTtVQUNWO1FBQ0YsQ0FBQyxDQUFDLENBQ0NDLElBQUksQ0FBRUMsUUFBUSxJQUFLO1VBQ2xCLElBQUksQ0FBQ0EsUUFBUSxDQUFDQyxFQUFFLEVBQUUsTUFBTSxJQUFJQyxLQUFLLENBQUMsZUFBZSxDQUFDO1VBQ2xELE9BQU9GLFFBQVEsQ0FBQ0csSUFBSSxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQ0RKLElBQUksQ0FBRUssSUFBSSxJQUFLO1VBQ2QsSUFBSSxDQUFDQSxJQUFJLENBQUNiLEdBQUcsRUFBRWEsSUFBSSxDQUFDYixHQUFHLEdBQUdBLEdBQUc7VUFDN0IsSUFBSSxDQUFDYyxZQUFZLENBQUNyQyxRQUFRLEVBQUVJLFNBQVMsRUFBRWdCLGlCQUFpQixDQUFDRyxHQUFHLENBQUMsRUFBRWEsSUFBSSxFQUFFN0IsUUFBUSxFQUFFQyxJQUFJLENBQUM7UUFDdEYsQ0FBQyxDQUFDLENBQ0Q4QixLQUFLLENBQUVDLEtBQUssSUFBSztVQUNoQkMsT0FBTyxDQUFDRCxLQUFLLENBQUMsU0FBUyxFQUFFQSxLQUFLLENBQUM7UUFDakMsQ0FBQyxDQUFDO01BQ04sQ0FBQyxDQUFDO0lBQ0o7RUFDRjtFQUNBO0VBQ0E1QixXQUFXQSxDQUFDWCxRQUFRLEVBQUVJLFNBQVMsRUFBRUcsUUFBUSxFQUFFQyxJQUFJLEVBQUU7SUFDL0NKLFNBQVMsQ0FBQ3FDLGdCQUFnQixDQUFDLFFBQVEsRUFBR0MsQ0FBQyxJQUFLO01BQzFDLE1BQU1DLElBQUksR0FBR0QsQ0FBQyxDQUFDRSxNQUFNLENBQUNDLEtBQUssQ0FBQyxDQUFDLENBQUM7TUFDOUIsTUFBTUMsUUFBUSxHQUFHLElBQUlDLFFBQVEsQ0FBQyxDQUFDO01BQy9CRCxRQUFRLENBQUNFLE1BQU0sQ0FBQyxNQUFNLEVBQUVMLElBQUksQ0FBQztNQUM3QjtNQUNBLE1BQU1NLGdCQUFnQixHQUFHLElBQUksQ0FBQ3pCLGVBQWUsQ0FBQyxDQUFDO01BQy9DakIsUUFBUSxDQUFDa0IsV0FBVyxDQUFDd0IsZ0JBQWdCLENBQUN2QixlQUFlLENBQUM7TUFDdEQ7TUFDQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFO1FBQ25DQyxNQUFNLEVBQUUsTUFBTTtRQUNkc0IsSUFBSSxFQUFFSixRQUFRO1FBQ2RqQixPQUFPLEVBQUU7VUFDUEMsTUFBTSxFQUFFO1FBQ1Y7TUFDRixDQUFDLENBQUMsQ0FDQ0MsSUFBSSxDQUFFQyxRQUFRLElBQUs7UUFDbEIsSUFBSSxDQUFDQSxRQUFRLENBQUNDLEVBQUUsRUFBRSxNQUFNLElBQUlDLEtBQUssQ0FBQyxlQUFlLENBQUM7UUFDbEQsT0FBT0YsUUFBUSxDQUFDRyxJQUFJLENBQUMsQ0FBQztNQUN4QixDQUFDLENBQUMsQ0FDREosSUFBSSxDQUFFSyxJQUFJLElBQUs7UUFDZCxJQUFJLENBQUNDLFlBQVksQ0FBQ3JDLFFBQVEsRUFBRUksU0FBUyxFQUFFNkMsZ0JBQWdCLEVBQUViLElBQUksRUFBRTdCLFFBQVEsRUFBRUMsSUFBSSxDQUFDO01BQ2hGLENBQUMsQ0FBQyxDQUNEOEIsS0FBSyxDQUFFQyxLQUFLLElBQUs7UUFDaEJDLE9BQU8sQ0FBQ0QsS0FBSyxDQUFDLFNBQVMsRUFBRUEsS0FBSyxDQUFDO01BQ2pDLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQztFQUNKO0VBQ0E7RUFDQTdCLGNBQWNBLENBQUNWLFFBQVEsRUFBRUksU0FBUyxFQUFFO0lBQ2xDSixRQUFRLENBQUN5QyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUdDLENBQUMsSUFBSztNQUMzQ0EsQ0FBQyxDQUFDUyxjQUFjLENBQUMsQ0FBQztNQUNsQm5ELFFBQVEsQ0FBQ2EsU0FBUyxDQUFDQyxHQUFHLENBQUMsVUFBVSxDQUFDO0lBQ3BDLENBQUMsQ0FBQztJQUVGZCxRQUFRLENBQUN5QyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUdDLENBQUMsSUFBSztNQUM1Q0EsQ0FBQyxDQUFDUyxjQUFjLENBQUMsQ0FBQztNQUNsQm5ELFFBQVEsQ0FBQ2EsU0FBUyxDQUFDdUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUN2QyxDQUFDLENBQUM7SUFFRnBELFFBQVEsQ0FBQ3lDLGdCQUFnQixDQUFDLE1BQU0sRUFBR0MsQ0FBQyxJQUFLO01BQ3ZDQSxDQUFDLENBQUNTLGNBQWMsQ0FBQyxDQUFDO01BQ2xCbkQsUUFBUSxDQUFDYSxTQUFTLENBQUN1QyxNQUFNLENBQUMsVUFBVSxDQUFDO01BQ3JDLE1BQU1QLEtBQUssR0FBR0gsQ0FBQyxDQUFDVyxZQUFZLENBQUNSLEtBQUs7TUFDbEMsSUFBSUEsS0FBSyxDQUFDeEIsTUFBTSxFQUFFO1FBQ2hCakIsU0FBUyxDQUFDeUMsS0FBSyxHQUFHQSxLQUFLO1FBQ3ZCekMsU0FBUyxDQUFDa0QsYUFBYSxDQUFDLElBQUlDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztNQUM5QztJQUNGLENBQUMsQ0FBQzs7SUFFRjtJQUNBdkQsUUFBUSxDQUFDeUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07TUFDdkNyQyxTQUFTLENBQUNvRCxLQUFLLENBQUMsQ0FBQztJQUNuQixDQUFDLENBQUM7RUFDSjtFQUNBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNFbkIsWUFBWUEsQ0FBQ3JDLFFBQVEsRUFBRUksU0FBUyxFQUFFNkMsZ0JBQWdCLEVBQUViLElBQUksRUFBRTdCLFFBQVEsRUFBRUMsSUFBSSxFQUFFO0lBQ3hFLElBQUksQ0FBQyxJQUFJLENBQUNOLElBQUksQ0FBQ1UsUUFBUSxDQUFDd0IsSUFBSSxDQUFDYixHQUFHLENBQUMsRUFBRTtNQUNqQyxJQUFJLENBQUNyQixJQUFJLENBQUN1RCxJQUFJLENBQUNyQixJQUFJLENBQUNiLEdBQUcsQ0FBQztJQUMxQjtJQUNBLE1BQU1tQyxVQUFVLEdBQUdBLENBQUEsS0FBTTtNQUN2QixNQUFNMUMsUUFBUSxHQUFHaEIsUUFBUSxDQUFDSyxVQUFVLENBQUNDLGFBQWEsQ0FBQyxpQ0FBaUMsQ0FBQztNQUNyRixJQUFJVSxRQUFRLEVBQUVBLFFBQVEsQ0FBQ0MsS0FBSyxHQUFHQyxJQUFJLENBQUN5QyxTQUFTLENBQUMsSUFBSSxDQUFDekQsSUFBSSxDQUFDO0lBQzFELENBQUM7SUFDRDtJQUNBLElBQUksQ0FBQ2tDLElBQUksQ0FBQ3dCLEdBQUcsRUFBRTtNQUNiWCxnQkFBZ0IsQ0FBQ1ksVUFBVSxDQUFDQyxLQUFLLENBQUNDLGVBQWUsR0FBRyx1RUFBdUU7TUFDM0gzQixJQUFJLENBQUM0QixRQUFRLEdBQUcsc0JBQXNCO0lBQ3hDLENBQUMsTUFBTTtNQUNMLElBQUl4RCxJQUFJLENBQUNJLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUMxQnFDLGdCQUFnQixDQUFDWSxVQUFVLENBQUNDLEtBQUssQ0FBQ0MsZUFBZSxHQUFHLE9BQU8zQixJQUFJLENBQUN3QixHQUFHLEdBQUc7TUFDeEUsQ0FBQyxNQUFNLElBQUlwRCxJQUFJLENBQUNJLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNqQ3FDLGdCQUFnQixDQUFDWSxVQUFVLENBQUNDLEtBQUssQ0FBQ0MsZUFBZSxHQUFHLG1FQUFtRTtNQUN6SCxDQUFDLE1BQU07UUFDTGQsZ0JBQWdCLENBQUNZLFVBQVUsQ0FBQ0MsS0FBSyxDQUFDQyxlQUFlLEdBQUcscUVBQXFFO01BQzNIO0lBQ0Y7SUFDQTs7SUFFQWQsZ0JBQWdCLENBQUNnQixVQUFVLENBQUNDLFNBQVMsR0FBRzlCLElBQUksQ0FBQzRCLFFBQVE7SUFDckRmLGdCQUFnQixDQUFDZ0IsVUFBVSxDQUFDRSxZQUFZLENBQUMsTUFBTSxFQUFFL0IsSUFBSSxDQUFDd0IsR0FBRyxDQUFDO0lBQzFEWCxnQkFBZ0IsQ0FBQ2dCLFVBQVUsQ0FBQ0UsWUFBWSxDQUFDLFVBQVUsRUFBRS9CLElBQUksQ0FBQzRCLFFBQVEsQ0FBQztJQUNuRWYsZ0JBQWdCLENBQUNtQixXQUFXLENBQUN2RCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxVQUFVLENBQUM7SUFDdERtQyxnQkFBZ0IsQ0FBQ3ZCLGVBQWUsQ0FBQ2IsU0FBUyxDQUFDQyxHQUFHLENBQUMsVUFBVSxDQUFDO0lBQzFEbUMsZ0JBQWdCLENBQUNvQixZQUFZLENBQUM1QixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTTtNQUM1RGxDLFFBQVEsQ0FBQytELFdBQVcsQ0FBQ3JCLGdCQUFnQixDQUFDdkIsZUFBZSxDQUFDO01BQ3RELElBQUk2QyxLQUFLLEdBQUcsSUFBSSxDQUFDckUsSUFBSSxDQUFDc0UsT0FBTyxDQUFDcEMsSUFBSSxDQUFDYixHQUFHLENBQUM7TUFDdkMsSUFBSWdELEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtRQUNoQixJQUFJLENBQUNyRSxJQUFJLENBQUN1RSxNQUFNLENBQUNGLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDMUJiLFVBQVUsQ0FBQyxDQUFDO01BQ2Q7SUFDRixDQUFDLENBQUM7SUFDRnRELFNBQVMsQ0FBQ2EsS0FBSyxHQUFHLEVBQUU7SUFDcEJ5QyxVQUFVLENBQUMsQ0FBQztFQUNkO0VBRUFsQyxlQUFlQSxDQUFBLEVBQUc7SUFDaEIsTUFBTXlCLGdCQUFnQixHQUFHO01BQ3ZCdkIsZUFBZSxFQUFFZ0QsUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO01BQzlDZCxVQUFVLEVBQUVhLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEtBQUssQ0FBQztNQUN6Q0MsWUFBWSxFQUFFRixRQUFRLENBQUNDLGFBQWEsQ0FBQyxLQUFLLENBQUM7TUFDM0NWLFVBQVUsRUFBRVMsUUFBUSxDQUFDQyxhQUFhLENBQUMsR0FBRyxDQUFDO01BQ3ZDUCxXQUFXLEVBQUVNLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLE1BQU0sQ0FBQztNQUMzQ0UsY0FBYyxFQUFFSCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxNQUFNLENBQUM7TUFDOUNOLFlBQVksRUFBRUssUUFBUSxDQUFDQyxhQUFhLENBQUMsTUFBTTtJQUM3QyxDQUFDO0lBQ0QxQixnQkFBZ0IsQ0FBQ3ZCLGVBQWUsQ0FBQ2IsU0FBUyxDQUFDQyxHQUFHLENBQUMsaUJBQWlCLENBQUM7SUFDakVtQyxnQkFBZ0IsQ0FBQ1ksVUFBVSxDQUFDaEQsU0FBUyxDQUFDQyxHQUFHLENBQUMsWUFBWSxDQUFDO0lBQ3ZEbUMsZ0JBQWdCLENBQUMyQixZQUFZLENBQUMvRCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxjQUFjLENBQUM7SUFDM0RtQyxnQkFBZ0IsQ0FBQ2dCLFVBQVUsQ0FBQ3BELFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsU0FBUyxDQUFDO0lBQ2hGbUMsZ0JBQWdCLENBQUNtQixXQUFXLENBQUN2RCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxhQUFhLENBQUM7SUFDekRtQyxnQkFBZ0IsQ0FBQzRCLGNBQWMsQ0FBQ2hFLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQztJQUN0RW1DLGdCQUFnQixDQUFDb0IsWUFBWSxDQUFDeEQsU0FBUyxDQUFDQyxHQUFHLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQztJQUNsRW1DLGdCQUFnQixDQUFDZ0IsVUFBVSxDQUFDQyxTQUFTLEdBQUcsd0JBQXdCO0lBQ2hFakIsZ0JBQWdCLENBQUNnQixVQUFVLENBQUNFLFlBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO0lBQ3JEbEIsZ0JBQWdCLENBQUMyQixZQUFZLENBQUNuRCxXQUFXLENBQUN3QixnQkFBZ0IsQ0FBQ2dCLFVBQVUsQ0FBQztJQUN0RWhCLGdCQUFnQixDQUFDMkIsWUFBWSxDQUFDbkQsV0FBVyxDQUFDd0IsZ0JBQWdCLENBQUNtQixXQUFXLENBQUM7SUFDdkVuQixnQkFBZ0IsQ0FBQzJCLFlBQVksQ0FBQ25ELFdBQVcsQ0FBQ3dCLGdCQUFnQixDQUFDNEIsY0FBYyxDQUFDO0lBQzFFNUIsZ0JBQWdCLENBQUMyQixZQUFZLENBQUNuRCxXQUFXLENBQUN3QixnQkFBZ0IsQ0FBQ29CLFlBQVksQ0FBQztJQUN4RXBCLGdCQUFnQixDQUFDdkIsZUFBZSxDQUFDRCxXQUFXLENBQUN3QixnQkFBZ0IsQ0FBQ1ksVUFBVSxDQUFDO0lBQ3pFWixnQkFBZ0IsQ0FBQ3ZCLGVBQWUsQ0FBQ0QsV0FBVyxDQUFDd0IsZ0JBQWdCLENBQUMyQixZQUFZLENBQUM7SUFDM0UsTUFBTUUsT0FBTyxHQUFHO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztJQUNMN0IsZ0JBQWdCLENBQUM0QixjQUFjLENBQUNYLFNBQVMsR0FBR1ksT0FBTztJQUNuRCxNQUFNQyxhQUFhLEdBQUc7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7SUFDTDlCLGdCQUFnQixDQUFDb0IsWUFBWSxDQUFDSCxTQUFTLEdBQUdhLGFBQWE7SUFDdkQsT0FBTzlCLGdCQUFnQjtFQUN6QjtBQUNGO0FBRUEsaUVBQWVuRCxXQUFXOzs7Ozs7Ozs7OztBQ2hOMUI7Ozs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ04wQjtBQUVnQjtBQUMxQyxDQUFDLFVBQVVrRixNQUFNLEVBQUU7RUFDakJBLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDQyxtQkFBbUIsR0FBRztJQUNyQ0MsTUFBTSxFQUFFLFNBQUFBLENBQVVDLE9BQU8sRUFBRUMsUUFBUSxFQUFFO01BQ25DLE1BQU1DLFNBQVMsR0FBR0MsSUFBSSxDQUFDLHlCQUF5QixFQUFFLGVBQWUsRUFBRUgsT0FBTyxDQUFDO01BQzNFLElBQUlFLFNBQVMsSUFBSUEsU0FBUyxDQUFDakUsTUFBTSxFQUFFO1FBQ2pDLE1BQU1wQixPQUFPLEdBQUdvRixRQUFRLENBQUNILG1CQUFtQixHQUFHRyxRQUFRLENBQUNILG1CQUFtQixHQUFHLENBQUMsQ0FBQztRQUNoRkksU0FBUyxDQUFDaEUsT0FBTyxDQUFFdEIsUUFBUSxJQUFLO1VBQzlCLE1BQU13RixHQUFHLEdBQUcsSUFBSTFGLHNEQUFXLENBQUNFLFFBQVEsRUFBRUMsT0FBTyxDQUFDO1VBQzlDdUYsR0FBRyxDQUFDckYsS0FBSyxDQUFDLENBQUM7UUFDYixDQUFDLENBQUM7TUFDSjtJQUNGO0VBQ0YsQ0FBQztBQUNILENBQUMsRUFBRTZFLE1BQU0sQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHN0ZXBoYW5lODg4L3didS1hdG9taXF1ZS10aGVtZS8uL3NyYy9qcy9kcmFnLWFuZC1kcm9wLmpzIiwid2VicGFjazovL0BzdGVwaGFuZTg4OC93YnUtYXRvbWlxdWUtdGhlbWUvLi9zcmMvc2Nzcy9kbmQuc2NzcyIsIndlYnBhY2s6Ly9Ac3RlcGhhbmU4ODgvd2J1LWF0b21pcXVlLXRoZW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BzdGVwaGFuZTg4OC93YnUtYXRvbWlxdWUtdGhlbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0BzdGVwaGFuZTg4OC93YnUtYXRvbWlxdWUtdGhlbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9Ac3RlcGhhbmU4ODgvd2J1LWF0b21pcXVlLXRoZW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQHN0ZXBoYW5lODg4L3didS1hdG9taXF1ZS10aGVtZS8uL3NyYy9qcy9kbmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgRHJhZ0FuZERyb3Age1xuICBjb25zdHJ1Y3Rvcihkcm9wem9uZSwgY29uZmlncyA9IFtdKSB7XG4gICAgdGhpcy5kcm9wem9uZSA9IGRyb3B6b25lO1xuICAgIHRoaXMuY29uZmlncyA9IGNvbmZpZ3M7XG4gICAgdGhpcy5maWRzID0gW107XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGlzYXRpb25cbiAgICovXG4gIGJ1aWxkKCkge1xuICAgIGNvbnN0IGRyb3B6b25lID0gdGhpcy5kcm9wem9uZTtcbiAgICBjb25zdCBmaWxlSW5wdXQgPSBkcm9wem9uZS5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoXCIuZG5kLWZpbGUtaW5wdXRcIik7XG4gICAgY29uc3QgcHJldmlld3MgPSBkcm9wem9uZS5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoXCIuZG5kLXByZXZpZXdzXCIpO1xuICAgIGNvbnN0IHR5cGUgPSBkcm9wem9uZS5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZShcInR5cGVcIik7XG4gICAgdGhpcy5tYW5hZ2VEcmFnWm9uZShkcm9wem9uZSwgZmlsZUlucHV0KTtcbiAgICB0aGlzLnVwbG9hZEZpbGVzKGRyb3B6b25lLCBmaWxlSW5wdXQsIHByZXZpZXdzLCB0eXBlKTtcbiAgICBpZiAoIXR5cGUuaW5jbHVkZXMoXCJpbWFnZVwiKSkge1xuICAgICAgcHJldmlld3MuY2xhc3NMaXN0LmFkZChcImZpbGVzLWRvY3VtZW50XCIpO1xuICAgIH1cbiAgICB0aGlzLk1hbmFnZU9sZEZpbGUoZHJvcHpvbmUsIGZpbGVJbnB1dCwgcHJldmlld3MsIHR5cGUpO1xuICB9XG5cbiAgTWFuYWdlT2xkRmlsZShkcm9wem9uZSwgZmlsZUlucHV0LCBwcmV2aWV3cywgdHlwZSkge1xuICAgIGNvbnN0IGZpZElucHV0ID0gZHJvcHpvbmUucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKFwiaW5wdXQuZHJhZ19hbmRfZHJvcF9maWxlcy0tZmlkc1wiKTtcbiAgICBjb25zdCBmaWRzID0gZmlkSW5wdXQudmFsdWUgPyBKU09OLnBhcnNlKGZpZElucHV0LnZhbHVlKSA6IFtdO1xuICAgIGNvbnN0IGdlbmVyYXRlZEVsZW1lbnRzID0ge307XG4gICAgaWYgKGZpZElucHV0ICYmIGZpZHMubGVuZ3RoID4gMCkge1xuICAgICAgZmlkcy5mb3JFYWNoKChmaWQpID0+IHtcbiAgICAgICAgLy8gT24gYWZmaWNoZSBsZSBwcmV2aWV3LlxuICAgICAgICBnZW5lcmF0ZWRFbGVtZW50c1tmaWRdID0gdGhpcy5wcmV2aWV3Qm94SW1hZ2UoKTtcbiAgICAgICAgcHJldmlld3MuYXBwZW5kQ2hpbGQoZ2VuZXJhdGVkRWxlbWVudHNbZmlkXS5jb250YWluZXJfaW1hZ2UpO1xuICAgICAgICAvL1xuICAgICAgICBmZXRjaChcIi9kcmFnX2FuZF9kcm9wX2ZpbGVzL2dldF9pbWdfdXJsL1wiICsgZmlkLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHRocm93IG5ldyBFcnJvcihcIkVycmV1ciByw6lzZWF1XCIpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWRhdGEuZmlkKSBkYXRhLmZpZCA9IGZpZDtcbiAgICAgICAgICAgIHRoaXMucHJlc2F2ZUZpbGVzKGRyb3B6b25lLCBmaWxlSW5wdXQsIGdlbmVyYXRlZEVsZW1lbnRzW2ZpZF0sIGRhdGEsIHByZXZpZXdzLCB0eXBlKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJldXI6XCIsIGVycm9yKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAvL1xuICB1cGxvYWRGaWxlcyhkcm9wem9uZSwgZmlsZUlucHV0LCBwcmV2aWV3cywgdHlwZSkge1xuICAgIGZpbGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICBjb25zdCBmaWxlID0gZS50YXJnZXQuZmlsZXNbMF07XG4gICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgZm9ybURhdGEuYXBwZW5kKFwiZmlsZVwiLCBmaWxlKTtcbiAgICAgIC8vIE9uIGFmZmljaGUgbGUgcHJldmlldy5cbiAgICAgIGNvbnN0IGdlbmVyYXRlZEVsZW1lbnQgPSB0aGlzLnByZXZpZXdCb3hJbWFnZSgpO1xuICAgICAgcHJldmlld3MuYXBwZW5kQ2hpbGQoZ2VuZXJhdGVkRWxlbWVudC5jb250YWluZXJfaW1hZ2UpO1xuICAgICAgLy8gVXBsb2FkIGF2ZWMgRmV0Y2ggQVBJLlxuICAgICAgZmV0Y2goXCIvZHJhZ19hbmRfZHJvcF9maWxlcy91cGxvYWRcIiwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB0aHJvdyBuZXcgRXJyb3IoXCJFcnJldXIgcsOpc2VhdVwiKTtcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMucHJlc2F2ZUZpbGVzKGRyb3B6b25lLCBmaWxlSW5wdXQsIGdlbmVyYXRlZEVsZW1lbnQsIGRhdGEsIHByZXZpZXdzLCB0eXBlKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJldXI6XCIsIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgLy9cbiAgbWFuYWdlRHJhZ1pvbmUoZHJvcHpvbmUsIGZpbGVJbnB1dCkge1xuICAgIGRyb3B6b25lLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZHJvcHpvbmUuY2xhc3NMaXN0LmFkZChcImRyYWdvdmVyXCIpO1xuICAgIH0pO1xuXG4gICAgZHJvcHpvbmUuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZHJvcHpvbmUuY2xhc3NMaXN0LnJlbW92ZShcImRyYWdvdmVyXCIpO1xuICAgIH0pO1xuXG4gICAgZHJvcHpvbmUuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGRyb3B6b25lLmNsYXNzTGlzdC5yZW1vdmUoXCJkcmFnb3ZlclwiKTtcbiAgICAgIGNvbnN0IGZpbGVzID0gZS5kYXRhVHJhbnNmZXIuZmlsZXM7XG4gICAgICBpZiAoZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgIGZpbGVJbnB1dC5maWxlcyA9IGZpbGVzO1xuICAgICAgICBmaWxlSW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJjaGFuZ2VcIikpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQ2xpYyBwb3VyIG91dnJpciBsZSBzw6lsZWN0ZXVyIGRlIGZpY2hpZXJzXG4gICAgZHJvcHpvbmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGZpbGVJbnB1dC5jbGljaygpO1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBBam91dGUgbCdpZCBkdSBmaWNoaWVyIGRhbnMgdW4gY2hhbXBzLlxuICAgKiBAcGFyYW0geyp9IGRyb3B6b25lXG4gICAqIEBwYXJhbSB7Kn0gZmlsZUlucHV0XG4gICAqIEBwYXJhbSB7Kn0gZ2VuZXJhdGVkRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IGRhdGFcbiAgICogQHBhcmFtIHsqfSBwcmV2aWV3c1xuICAgKiBAcGFyYW0geyp9IHR5cGVcbiAgICovXG4gIHByZXNhdmVGaWxlcyhkcm9wem9uZSwgZmlsZUlucHV0LCBnZW5lcmF0ZWRFbGVtZW50LCBkYXRhLCBwcmV2aWV3cywgdHlwZSkge1xuICAgIGlmICghdGhpcy5maWRzLmluY2x1ZGVzKGRhdGEuZmlkKSkge1xuICAgICAgdGhpcy5maWRzLnB1c2goZGF0YS5maWQpO1xuICAgIH1cbiAgICBjb25zdCBwdXRJbklucHV0ID0gKCkgPT4ge1xuICAgICAgY29uc3QgZmlkSW5wdXQgPSBkcm9wem9uZS5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dC5kcmFnX2FuZF9kcm9wX2ZpbGVzLS1maWRzXCIpO1xuICAgICAgaWYgKGZpZElucHV0KSBmaWRJbnB1dC52YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHRoaXMuZmlkcyk7XG4gICAgfTtcbiAgICAvLyBBZmZpY2hlIGwnYXBlcsOndVxuICAgIGlmICghZGF0YS51cmwpIHtcbiAgICAgIGdlbmVyYXRlZEVsZW1lbnQuY29udGVudF9iZy5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgvbW9kdWxlcy9jb250cmliL2RyYWdfYW5kX2Ryb3BfZmlsZXMvaW1hZ2VzL2ZpbGUtbm90LWZvdW5kLTIuanBnKVwiO1xuICAgICAgZGF0YS5maWxlbmFtZSA9IFwiSW1hZ2Ugbm9uIGRpc3BvbmlibGVcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGUuaW5jbHVkZXMoXCJpbWFnZVwiKSkge1xuICAgICAgICBnZW5lcmF0ZWRFbGVtZW50LmNvbnRlbnRfYmcuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke2RhdGEudXJsfSlgO1xuICAgICAgfSBlbHNlIGlmICh0eXBlLmluY2x1ZGVzKFwidmlkZW9cIikpIHtcbiAgICAgICAgZ2VuZXJhdGVkRWxlbWVudC5jb250ZW50X2JnLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKC9tb2R1bGVzL2NvbnRyaWIvZHJhZ19hbmRfZHJvcF9maWxlcy9pbWFnZXMvdmlkZW8tcGxheWVyLnN2ZylcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdlbmVyYXRlZEVsZW1lbnQuY29udGVudF9iZy5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgvbW9kdWxlcy9jb250cmliL2RyYWdfYW5kX2Ryb3BfZmlsZXMvaW1hZ2VzL2ZyZWUtZmlsZS1pY29uLnBuZylcIjtcbiAgICAgIH1cbiAgICB9XG4gICAgLy9cblxuICAgIGdlbmVyYXRlZEVsZW1lbnQuaW1nZV90aXRsZS5pbm5lckhUTUwgPSBkYXRhLmZpbGVuYW1lO1xuICAgIGdlbmVyYXRlZEVsZW1lbnQuaW1nZV90aXRsZS5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIGRhdGEudXJsKTtcbiAgICBnZW5lcmF0ZWRFbGVtZW50LmltZ2VfdGl0bGUuc2V0QXR0cmlidXRlKFwiZG93bmxvYWRcIiwgZGF0YS5maWxlbmFtZSk7XG4gICAgZ2VuZXJhdGVkRWxlbWVudC5wcm9ncmVzc2Jhci5jbGFzc0xpc3QuYWRkKFwiY29tcGxldGVcIik7XG4gICAgZ2VuZXJhdGVkRWxlbWVudC5jb250YWluZXJfaW1hZ2UuY2xhc3NMaXN0LmFkZChcImNvbXBsZXRlXCIpO1xuICAgIGdlbmVyYXRlZEVsZW1lbnQuaWNvbmVfcmVtb3ZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBwcmV2aWV3cy5yZW1vdmVDaGlsZChnZW5lcmF0ZWRFbGVtZW50LmNvbnRhaW5lcl9pbWFnZSk7XG4gICAgICBsZXQgaW5kZXggPSB0aGlzLmZpZHMuaW5kZXhPZihkYXRhLmZpZCk7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIHRoaXMuZmlkcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBwdXRJbklucHV0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZmlsZUlucHV0LnZhbHVlID0gXCJcIjtcbiAgICBwdXRJbklucHV0KCk7XG4gIH1cblxuICBwcmV2aWV3Qm94SW1hZ2UoKSB7XG4gICAgY29uc3QgZ2VuZXJhdGVkRWxlbWVudCA9IHtcbiAgICAgIGNvbnRhaW5lcl9pbWFnZTogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcbiAgICAgIGNvbnRlbnRfYmc6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG4gICAgICBjb250ZW50X3RleHQ6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG4gICAgICBpbWdlX3RpdGxlOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKSxcbiAgICAgIHByb2dyZXNzYmFyOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxcbiAgICAgIGljb25lX2NvbXBsZXRlOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxcbiAgICAgIGljb25lX3JlbW92ZTogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIiksXG4gICAgfTtcbiAgICBnZW5lcmF0ZWRFbGVtZW50LmNvbnRhaW5lcl9pbWFnZS5jbGFzc0xpc3QuYWRkKFwiY29udGFpbmVyX2ltYWdlXCIpO1xuICAgIGdlbmVyYXRlZEVsZW1lbnQuY29udGVudF9iZy5jbGFzc0xpc3QuYWRkKFwiY29udGVudF9iZ1wiKTtcbiAgICBnZW5lcmF0ZWRFbGVtZW50LmNvbnRlbnRfdGV4dC5jbGFzc0xpc3QuYWRkKFwiY29udGVudF90ZXh0XCIpO1xuICAgIGdlbmVyYXRlZEVsZW1lbnQuaW1nZV90aXRsZS5jbGFzc0xpc3QuYWRkKFwiaW1nZV90aXRsZVwiLCBcInRleHQtYmxhY2tcIiwgXCJmdy1ib2xkXCIpO1xuICAgIGdlbmVyYXRlZEVsZW1lbnQucHJvZ3Jlc3NiYXIuY2xhc3NMaXN0LmFkZChcInByb2dyZXNzYmFyXCIpO1xuICAgIGdlbmVyYXRlZEVsZW1lbnQuaWNvbmVfY29tcGxldGUuY2xhc3NMaXN0LmFkZChcImljb25lX2NvbXBsZXRlXCIsIFwic3ZnXCIpO1xuICAgIGdlbmVyYXRlZEVsZW1lbnQuaWNvbmVfcmVtb3ZlLmNsYXNzTGlzdC5hZGQoXCJpY29uZV9yZW1vdmVcIiwgXCJzdmdcIik7XG4gICAgZ2VuZXJhdGVkRWxlbWVudC5pbWdlX3RpdGxlLmlubmVySFRNTCA9IFwiQ2hhcmdlbWVudCBlbmNvdXJzIC4uLlwiO1xuICAgIGdlbmVyYXRlZEVsZW1lbnQuaW1nZV90aXRsZS5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiKTtcbiAgICBnZW5lcmF0ZWRFbGVtZW50LmNvbnRlbnRfdGV4dC5hcHBlbmRDaGlsZChnZW5lcmF0ZWRFbGVtZW50LmltZ2VfdGl0bGUpO1xuICAgIGdlbmVyYXRlZEVsZW1lbnQuY29udGVudF90ZXh0LmFwcGVuZENoaWxkKGdlbmVyYXRlZEVsZW1lbnQucHJvZ3Jlc3NiYXIpO1xuICAgIGdlbmVyYXRlZEVsZW1lbnQuY29udGVudF90ZXh0LmFwcGVuZENoaWxkKGdlbmVyYXRlZEVsZW1lbnQuaWNvbmVfY29tcGxldGUpO1xuICAgIGdlbmVyYXRlZEVsZW1lbnQuY29udGVudF90ZXh0LmFwcGVuZENoaWxkKGdlbmVyYXRlZEVsZW1lbnQuaWNvbmVfcmVtb3ZlKTtcbiAgICBnZW5lcmF0ZWRFbGVtZW50LmNvbnRhaW5lcl9pbWFnZS5hcHBlbmRDaGlsZChnZW5lcmF0ZWRFbGVtZW50LmNvbnRlbnRfYmcpO1xuICAgIGdlbmVyYXRlZEVsZW1lbnQuY29udGFpbmVyX2ltYWdlLmFwcGVuZENoaWxkKGdlbmVyYXRlZEVsZW1lbnQuY29udGVudF90ZXh0KTtcbiAgICBjb25zdCBzdmdDb2RlID0gYFxuICAgICAgICA8c3ZnIHZlcnNpb249XCIxLjFcIiB3aWR0aD1cIjJyZW1cIiBoZWlnaHQ9XCIycmVtXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCIgdmlld0JveD1cIjAgMCAxMTcuNzIgMTE3LjcyXCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cbiAgICAgICAgICA8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+XG4gICAgICAgICAgICA8IVtDREFUQVtcbiAgICAgICAgICAgICAgLnN0MHtmaWxsOiMwMUE2MDE7fVxuICAgICAgICAgICAgXV0+XG4gICAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgICA8Zz5cbiAgICAgICAgICAgIDxwYXRoIGNsYXNzPVwic3QwXCIgZD1cIk01OC44NiwwYzkuMTMsMCwxNy43NywyLjA4LDI1LjQ5LDUuNzljLTMuMTYsMi41LTYuMDksNC45LTguODIsNy4yMWMtNS4yLTEuODktMTAuODEtMi45Mi0xNi42Ni0yLjkyIGMtMTMuNDcsMC0yNS42Nyw1LjQ2LTM0LjQ5LDE0LjI5Yy04LjgzLDguODMtMTQuMjksMjEuMDItMTQuMjksMzQuNDljMCwxMy40Nyw1LjQ2LDI1LjY2LDE0LjI5LDM0LjQ5IGM4LjgzLDguODMsMjEuMDIsMTQuMjksMzQuNDksMTQuMjlzMjUuNjctNS40NiwzNC40OS0xNC4yOWM4LjgzLTguODMsMTQuMjktMjEuMDIsMTQuMjktMzQuNDljMC0zLjItMC4zMS02LjM0LTAuOS05LjM3IGMyLjUzLTMuMyw1LjEyLTYuNTksNy43Ny05Ljg1YzIuMDgsNi4wMiwzLjIxLDEyLjQ5LDMuMjEsMTkuMjJjMCwxNi4yNS02LjU5LDMwLjk3LTE3LjI0LDQxLjYyIGMtMTAuNjUsMTAuNjUtMjUuMzcsMTcuMjQtNDEuNjIsMTcuMjRjLTE2LjI1LDAtMzAuOTctNi41OS00MS42Mi0xNy4yNEM2LjU5LDg5LjgzLDAsNzUuMTEsMCw1OC44NiBjMC0xNi4yNSw2LjU5LTMwLjk3LDE3LjI0LTQxLjYyUzQyLjYxLDAsNTguODYsMEw1OC44NiwweiBNMzEuNDQsNDkuMTlMNDUuOCw0OWwxLjA3LDAuMjhjMi45LDEuNjcsNS42MywzLjU4LDguMTgsNS43NCBjMS44NCwxLjU2LDMuNiwzLjI2LDUuMjcsNS4xYzUuMTUtOC4yOSwxMC42NC0xNS45LDE2LjQ0LTIyLjljNi4zNS03LjY3LDEzLjA5LTE0LjYzLDIwLjE3LTIwLjk4bDEuNC0wLjU0SDExNGwtMy4xNiwzLjUxIEMxMDEuMTMsMzAsOTIuMzIsNDEuMTUsODQuMzYsNTIuNjVDNzYuNCw2NC4xNiw2OS4yOCw3Ni4wNCw2Mi45NSw4OC4yN2wtMS45NywzLjhsLTEuODEtMy44N2MtMy4zNC03LjE3LTcuMzQtMTMuNzUtMTIuMTEtMTkuNjMgYy00Ljc3LTUuODgtMTAuMzItMTEuMS0xNi43OS0xNS41NEwzMS40NCw0OS4xOUwzMS40NCw0OS4xOXpcIi8+XG4gICAgICAgICAgPC9nPlxuICAgICAgICA8L3N2Zz5cbiAgICAgICAgYDtcbiAgICBnZW5lcmF0ZWRFbGVtZW50Lmljb25lX2NvbXBsZXRlLmlubmVySFRNTCA9IHN2Z0NvZGU7XG4gICAgY29uc3Qgc3ZnQ29kZVJlbW92ZSA9IGBcbiAgICAgICAgPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgd2lkdGg9XCIycmVtXCIgaGVpZ2h0PVwiMnJlbVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiIHZpZXdCb3g9XCIwIDAgMTA4LjI5NCAxMjIuODhcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuICAgICAgICAgIDxnPlxuICAgICAgICAgICAgPHBhdGggZD1cIk00Ljg3Myw5LjA1OGgzMy4zNVY2LjJWNi4xODdjMC0wLjA5NSwwLjAwMi0wLjE4NiwwLjAxNC0wLjI3OWMwLjA3NS0xLjU5MiwwLjc2Mi0zLjAzNywxLjgxNi00LjA4NmwtMC4wMDctMC4wMDcgYzEuMTA0LTEuMTA0LDIuNjM3LTEuNzksNC4zMjUtMS44MDZsMC4wMjMsMC4wMDJWMGgwLjAzMWgxOS44ODRoMC4wMTZjMC4xMDYsMCwwLjIwNywwLjAwOSwwLjMwOSwwLjAyMiBjMS41ODMsMC4wODQsMy4wMTksMC43Niw0LjA2NCwxLjgxYzEuMTAyLDEuMTA0LDEuNzg2LDIuNjM1LDEuODAzLDQuMzE1bC0wLjAwMywwLjAyMWgwLjAxNFY2LjJ2Mi44NTdoMzIuOTA5aDAuMDE3IGMwLjEzOCwwLDAuMjY4LDAuMDE0LDAuNDAxLDAuMDM0YzEuMTgyLDAuMTA2LDIuMjU0LDAuNjI1LDMuMDM0LDEuNDFsMC4wMDQsMC4wMDdsMC4wMDUtMC4wMDcgYzAuODUxLDAuODU3LDEuMzg2LDIuMDQ4LDEuNDAxLDMuMzY4bC0wLjAwMiwwLjAzMmgwLjAxNHYwLjAzMnYxMC44MjljMCwxLjQ3Mi0xLjE5NSwyLjY2NS0yLjY2NywyLjY2NWgtMC4wN0gyLjY2NyBDMS4xOTUsMjcuNDI2LDAsMjYuMjMzLDAsMjQuNzYydi0wLjA2M1YxMy45MzN2LTAuMDE0YzAtMC4xMDYsMC4wMDQtMC4yMTEsMC4wMTgtMC4zMTV2LTAuMDIxIGMwLjA4OS0xLjIwNywwLjYyNC0yLjMwNCwxLjQyMi0zLjA5OGwtMC4wMDctMC4wMDJDMi4yOTUsOS42MjIsMy40OSw5LjA4Nyw0LjgxLDkuMDY5bDAuMDMyLDAuMDAyVjkuMDU4SDQuODczTDQuODczLDkuMDU4eiBNNzcuNzksNDkuMDk3aC01Ljk0NXY1Ni4wOTNoNS45NDVWNDkuMDk3TDc3Ljc5LDQ5LjA5N3ogTTU4LjQ2LDQ5LjA5N2gtNS45NDh2NTYuMDkzaDUuOTQ4VjQ5LjA5N0w1OC40Niw0OS4wOTd6IE0zOS4xMyw0OS4wOTcgaC01Ljk0NnY1Ni4wOTNoNS45NDZWNDkuMDk3TDM5LjEzLDQ5LjA5N3ogTTEwLjgzNywzMS41NjloODcuMzg1bDAuMjc5LDAuMDE4bDAuMTI3LDAuMDA3bDAuMTM0LDAuMDExaDAuMDA5bDAuMTYzLDAuMDIzIGMxLjM2MywwLjE2MywyLjYzOCwwLjc4OSwzLjU3MiwxLjcwOGMxLjA0LDEuMDI1LDEuNzA1LDIuNDE1LDEuNzA1LDMuOTY0YzAsMC4wOTgtMC4wMDksMC4xOTMtMC4wMTksMC4yODZsLTAuMDAyLDAuMDY4IGwtMC4wMTQsMC4xNTRsLTcuMzkzLDc5LjMzNWwtMC4wMDcsMC4wNDNoMC4wMDdsLTAuMDE2LDAuMTM5bC0wLjA1MSwwLjI4M2wtMC4wMDIsMC4wMDVsLTAuMDAyLDAuMDE4IGMtMC4wNTUsMC4zMzEtMC4xMiwwLjY0Ni0wLjIwOSwwLjkyOGwtMC4wMDcsMC4wMjJsLTAuMDAyLDAuMDA1bC0wLjAwOSwwLjAxOGwtMC4wMjMsMC4wNjJsLTAuMDA0LDAuMDIxIGMtMC4xMTgsMC4zNTQtMC4yNjQsMC42OTgtMC40MzIsMS4wMDljLTEuMDA5LDEuODgtMi44NzksMy4xODctNS4yMDQsMy4xODdIMTguMTNsLTAuMjQ3LTAuMDE0djAuMDAzbC0wLjAxMS0wLjAwM2wtMC4wMzItMC4wMDQgYy0wLjQ2LTAuMDIzLTAuODg5LTAuMDkxLTEuMjg4LTAuMjAyYy0wLjQxNS0wLjExNi0wLjgxOC0wLjI4Ni0xLjE5Ny0wLjQ5NWwtMC4wMDktMC4wMDJsLTAuMDAyLDAuMDAyIGMtMS43ODUtMC45NzctMi45NzUtMi44ODItMy4xNy01LjAyMkw0Ljg4LDM3Ljc5bC0wLjAxMS0wLjEyNWwtMC4wMTEtMC4yNDdsLTAuMDA0LTAuMTE2SDQuODQ5YzAtMS41NTMsMC42NjQtMi45NDYsMS43MDctMy45NzEgYzAuOTc2LTAuOTU1LDIuMzItMS41OTksMy43NTYtMS43MjZsMC4xMjItMC4wMDR2LTAuMDA3bDAuMy0wLjAxM2wwLjEwNCwwLjAwMlYzMS41NjlMMTAuODM3LDMxLjU2OXogTTk4LjIyMywzNi45MDNIMTAuODM3IHYtMC4wMDdsLTAuMTE2LDAuMDA0Yy0wLjE2MywwLjAyMi0wLjMyMiwwLjEwNi0wLjQzOCwwLjIyMmMtMC4wNjMsMC4wNjMtMC4xMDQsMC4xMzItMC4xMDQsMC4xNzloLTAuMDA3bDAuMDA3LDAuMTE4bDcuMjgyLDc5LjI0NCBoLTAuMDAybDAuMDAyLDAuMDEyYzAuMDMyLDAuMzc2LDAuMjAyLDAuNjkxLDAuNDQ3LDAuODI1bC0wLjAwMiwwLjAwNGwwLjA4NCwwLjAzMmwwLjA2MywwLjAxMmgwLjA3N2g3Mi42OTUgYzAuMjA3LDAsMC4zOTktMC4xNTcsMC41MTgtMC4zNzdsMC4wODQtMC4xOTdsMC4wNTQtMC4yMTZsMC4wMTQtMC4xMzhoMC4wMDVsNy4zODQtNzkuMjFMOTguODgxLDM3LjMgYzAtMC4wNDUtMC4wNDEtMC4xMTEtMC4xMDMtMC4xNzJjLTAuMTItMC4xMTgtMC4yODYtMC4yMDItMC40NTEtMC4yMjdMOTguMjIzLDM2LjkwM0w5OC4yMjMsMzYuOTAzeiBNOTguMzM0LDM2LjkwMWgtMC4wMTZIOTguMzM0IEw5OC4zMzQsMzYuOTAxeiBNOTguODgzLDM3LjQxM3YtMC4wMDRWMzcuNDEzTDk4Ljg4MywzNy40MTN6IE0xMDQuMTgsMzcuNzlsLTAuMDAyLDAuMDE4TDEwNC4xOCwzNy43OUwxMDQuMTgsMzcuNzl6IE00MC44ODcsMTQuMzg5SDUuMzMydjcuNzA2aDk3LjYzdi03LjcwNkg2Ny45MDdoLTAuMDYzYy0xLjQ3MiwwLTIuNjY0LTEuMTkyLTIuNjY0LTIuNjY0VjYuMlY2LjE2OGgwLjAwNyBjLTAuMDA3LTAuMjItMC4xMDYtMC40MzMtMC4yNTktMC41ODVjLTAuMTM3LTAuMTQxLTAuMzI0LTAuMjI5LTAuNTIxLTAuMjUyaC0wLjA4MmgtMC4wMTZINDQuNDI1aC0wLjAzMVY1LjMyNSBjLTAuMjEzLDAuMDA3LTAuNDIyLDAuMTA0LTAuNTc2LDAuMjU5bC0wLjAwNC0wLjAwNGwtMC4wMDcsMC4wMDRjLTAuMTMxLDAuMTM0LTAuMjMxLDAuMzEzLTAuMjU5LDAuNTAxbDAuMDA3LDAuMTAyVjYuMnY1LjUyNCBDNDMuNTU0LDEzLjE5Niw0Mi4zNTksMTQuMzg5LDQwLjg4NywxNC4zODlMNDAuODg3LDE0LjM4OXpcIi8+XG4gICAgICAgICAgPC9nPlxuICAgICAgICA8L3N2Zz5cbiAgICAgICAgYDtcbiAgICBnZW5lcmF0ZWRFbGVtZW50Lmljb25lX3JlbW92ZS5pbm5lckhUTUwgPSBzdmdDb2RlUmVtb3ZlO1xuICAgIHJldHVybiBnZW5lcmF0ZWRFbGVtZW50O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERyYWdBbmREcm9wO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuLi9zY3NzL2RuZC5zY3NzXCI7XG5cbmltcG9ydCBEcmFnQW5kRHJvcCBmcm9tIFwiLi9kcmFnLWFuZC1kcm9wXCI7XG4oZnVuY3Rpb24gKERydXBhbCkge1xuICBEcnVwYWwuYmVoYXZpb3JzLmRyYWdfYW5kX2Ryb3BfZmlsZXMgPSB7XG4gICAgYXR0YWNoOiBmdW5jdGlvbiAoY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgIGNvbnN0IGRyb3B6b25lcyA9IG9uY2UoXCJkcmFnX2FuZF9kcm9wX2ZpbGVzX3J1blwiLCBcIi5kbmQtZHJvcHpvbmVcIiwgY29udGV4dCk7XG4gICAgICBpZiAoZHJvcHpvbmVzICYmIGRyb3B6b25lcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgY29uZmlncyA9IHNldHRpbmdzLmRyYWdfYW5kX2Ryb3BfZmlsZXMgPyBzZXR0aW5ncy5kcmFnX2FuZF9kcm9wX2ZpbGVzIDoge307XG4gICAgICAgIGRyb3B6b25lcy5mb3JFYWNoKChkcm9wem9uZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRuZCA9IG5ldyBEcmFnQW5kRHJvcChkcm9wem9uZSwgY29uZmlncyk7XG4gICAgICAgICAgZG5kLmJ1aWxkKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59KShEcnVwYWwpO1xuIl0sIm5hbWVzIjpbIkRyYWdBbmREcm9wIiwiY29uc3RydWN0b3IiLCJkcm9wem9uZSIsImNvbmZpZ3MiLCJmaWRzIiwiYnVpbGQiLCJmaWxlSW5wdXQiLCJwYXJlbnROb2RlIiwicXVlcnlTZWxlY3RvciIsInByZXZpZXdzIiwidHlwZSIsImdldEF0dHJpYnV0ZSIsIm1hbmFnZURyYWdab25lIiwidXBsb2FkRmlsZXMiLCJpbmNsdWRlcyIsImNsYXNzTGlzdCIsImFkZCIsIk1hbmFnZU9sZEZpbGUiLCJmaWRJbnB1dCIsInZhbHVlIiwiSlNPTiIsInBhcnNlIiwiZ2VuZXJhdGVkRWxlbWVudHMiLCJsZW5ndGgiLCJmb3JFYWNoIiwiZmlkIiwicHJldmlld0JveEltYWdlIiwiYXBwZW5kQ2hpbGQiLCJjb250YWluZXJfaW1hZ2UiLCJmZXRjaCIsIm1ldGhvZCIsImhlYWRlcnMiLCJBY2NlcHQiLCJ0aGVuIiwicmVzcG9uc2UiLCJvayIsIkVycm9yIiwianNvbiIsImRhdGEiLCJwcmVzYXZlRmlsZXMiLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiZmlsZSIsInRhcmdldCIsImZpbGVzIiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsImFwcGVuZCIsImdlbmVyYXRlZEVsZW1lbnQiLCJib2R5IiwicHJldmVudERlZmF1bHQiLCJyZW1vdmUiLCJkYXRhVHJhbnNmZXIiLCJkaXNwYXRjaEV2ZW50IiwiRXZlbnQiLCJjbGljayIsInB1c2giLCJwdXRJbklucHV0Iiwic3RyaW5naWZ5IiwidXJsIiwiY29udGVudF9iZyIsInN0eWxlIiwiYmFja2dyb3VuZEltYWdlIiwiZmlsZW5hbWUiLCJpbWdlX3RpdGxlIiwiaW5uZXJIVE1MIiwic2V0QXR0cmlidXRlIiwicHJvZ3Jlc3NiYXIiLCJpY29uZV9yZW1vdmUiLCJyZW1vdmVDaGlsZCIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNvbnRlbnRfdGV4dCIsImljb25lX2NvbXBsZXRlIiwic3ZnQ29kZSIsInN2Z0NvZGVSZW1vdmUiLCJEcnVwYWwiLCJiZWhhdmlvcnMiLCJkcmFnX2FuZF9kcm9wX2ZpbGVzIiwiYXR0YWNoIiwiY29udGV4dCIsInNldHRpbmdzIiwiZHJvcHpvbmVzIiwib25jZSIsImRuZCJdLCJzb3VyY2VSb290IjoiIn0=